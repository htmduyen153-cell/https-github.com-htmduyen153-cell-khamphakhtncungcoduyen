import { StudentProgress, StudentProfile, AccessLog, GradeNumber } from '../types';

const STORAGE_KEY = 'coduyen_student_progress_v3';
const LOGS_STORAGE_KEY = 'coduyen_access_logs_v3';

// Tạo mã đồng bộ ngắn gọn, dễ nhớ (vd: BIO-8A1-7392 hoặc BIO-29384)
export function generateSyncCode(name?: string, room?: string): string {
  const prefix = 'BIO';
  const roomClean = room ? room.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) : '';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return roomClean ? `${prefix}-${roomClean}-${randNum}` : `${prefix}-${randNum}`;
}

export function getDefaultProgress(profile: StudentProfile): StudentProgress {
  return {
    syncCode: profile.syncCode,
    student: profile,
    completedLessonIds: [],
    bookmarkedLessonIds: [],
    lessonNotes: {},
    quizScores: {},
    studyTimeMinutes: 0,
    streakDays: 1,
    lastStudyDate: new Date().toISOString().slice(0, 10),
    lastSyncTimestamp: new Date().toISOString()
  };
}

export function loadLocalProgress(): StudentProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc tiến độ từ localStorage:', e);
    return null;
  }
}

export function saveLocalProgress(progress: StudentProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Lỗi lưu tiến độ vào localStorage:', e);
  }
}

// Gửi tiến độ lên Cloud server qua API
export async function pushProgressToCloud(progress: StudentProgress): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/sync/${encodeURIComponent(progress.syncCode)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
    if (!res.ok) {
      throw new Error(`Mã phản hồi từ máy chủ: ${res.status}`);
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Lỗi đồng bộ lên đám mây (đang lưu ngoại tuyến):', err?.message);
    return { success: false, error: err?.message || 'Không thể kết nối máy chủ' };
  }
}

// Tải tiến độ từ Cloud theo mã đồng bộ của thiết bị khác
export async function pullProgressFromCloud(syncCode: string): Promise<{ success: boolean; data?: StudentProgress; error?: string }> {
  try {
    const res = await fetch(`/api/sync/${encodeURIComponent(syncCode.trim())}`);
    if (res.status === 404) {
      return { success: false, error: 'Không tìm thấy hồ sơ với mã đồng bộ này trên hệ thống.' };
    }
    if (!res.ok) {
      throw new Error(`Lỗi máy chủ (${res.status})`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Không thể tải dữ liệu từ máy chủ.' };
  }
}

// Hợp nhất tiến độ thông minh (merge local và remote)
export function mergeProgress(local: StudentProgress, remote: StudentProgress): StudentProgress {
  const mergedCompleted = Array.from(new Set([...local.completedLessonIds, ...remote.completedLessonIds]));
  const mergedBookmarks = Array.from(new Set([...local.bookmarkedLessonIds, ...remote.bookmarkedLessonIds]));
  const mergedNotes = { ...remote.lessonNotes, ...local.lessonNotes };
  const mergedQuizScores = { ...remote.quizScores, ...local.quizScores };

  const mergedStudyTime = Math.max(local.studyTimeMinutes, remote.studyTimeMinutes);
  const mergedStreak = Math.max(local.streakDays, remote.streakDays);

  return {
    ...local,
    student: {
      ...local.student,
      name: local.student.name || remote.student.name,
      grade: local.student.grade || remote.student.grade,
      room: local.student.room || remote.student.room
    },
    completedLessonIds: mergedCompleted,
    bookmarkedLessonIds: mergedBookmarks,
    lessonNotes: mergedNotes,
    quizScores: mergedQuizScores,
    studyTimeMinutes: mergedStudyTime,
    streakDays: mergedStreak,
    lastSyncTimestamp: new Date().toISOString()
  };
}

// Quản lý Nhật ký truy cập (Access Logs)
export function getLocalLogs(): AccessLog[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Lọc sạch mọi dữ liệu giả định/seed
    return parsed.filter(
      (l: any) =>
        l &&
        l.studentName &&
        l.studentName !== 'Học sinh ẩn danh' &&
        l.studentName !== 'Nguyễn Văn An' &&
        l.studentName !== 'Trần Thị Mai' &&
        !String(l.id || '').startsWith('log-seed-')
    );
  } catch {
    return [];
  }
}

export function saveLocalLogs(logs: AccessLog[]): void {
  try {
    const cleanLogs = logs.filter(
      (l: any) =>
        l &&
        l.studentName &&
        l.studentName !== 'Học sinh ẩn danh' &&
        l.studentName !== 'Nguyễn Văn An' &&
        l.studentName !== 'Trần Thị Mai' &&
        !String(l.id || '').startsWith('log-seed-')
    );
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(cleanLogs.slice(0, 500)));
  } catch (e) {
    console.error('Lỗi lưu nhật ký:', e);
  }
}

// Hợp nhất logs không trùng lặp và giữ nguyên toàn bộ dữ liệu thực tế
export function mergeLogs(localLogs: AccessLog[], remoteLogs: AccessLog[]): AccessLog[] {
  const map = new Map<string, AccessLog>();

  const makeKey = (l: AccessLog) => {
    if (l.id && !l.id.startsWith('log-seed-')) return l.id;
    return `${l.studentName}__${l.studentClass}__${l.action}__${l.lessonName}__${l.timestamp}`;
  };

  [...remoteLogs, ...localLogs].forEach(log => {
    if (
      !log ||
      !log.studentName ||
      log.studentName === 'Học sinh ẩn danh' ||
      log.studentName === 'Nguyễn Văn An' ||
      log.studentName === 'Trần Thị Mai' ||
      String(log.id || '').startsWith('log-seed-')
    ) {
      return;
    }
    const k = makeKey(log);
    if (!map.has(k)) {
      map.set(k, log);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.rawDate || a.timestamp).getTime() || 0;
    const timeB = new Date(b.rawDate || b.timestamp).getTime() || 0;
    return timeB - timeA;
  });
}

// Đồng bộ 2 chiều giữa client và server để không bao giờ bị reset về 0 học sinh
export async function fetchAndSyncLogs(): Promise<AccessLog[]> {
  const localLogs = getLocalLogs();
  try {
    const res = await fetch('/api/admin/logs', { cache: 'no-store' });
    if (res.ok) {
      const serverLogs = await res.json();
      const merged = mergeLogs(localLogs, Array.isArray(serverLogs) ? serverLogs : []);
      saveLocalLogs(merged);

      // Nếu local có dữ liệu mà server chưa có (ví dụ khi server mới khởi động lại), gửi bù lên server
      if (Array.isArray(serverLogs) && merged.length > serverLogs.length) {
        fetch('/api/admin/sync-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: merged })
        }).catch(() => {});
      }
      return merged;
    }
  } catch (err) {
    console.warn('Không thể kết nối máy chủ nhật ký, sử dụng bản lưu cục bộ:', err);
  }
  return localLogs;
}

export async function logActivity(
  student: StudentProfile | null,
  action: string,
  lessonName: string,
  grade: GradeNumber,
  resourceTitle?: string
): Promise<void> {
  // TUYỆT ĐỐI KHÔNG TỰ Ý THÊM HỌC SINH NẾU KHÔNG CÓ LƯỢT TRUY CẬP THỰC TẾ CỦA HỌC SINH
  if (!student || !student.name || !student.name.trim() || student.name.trim() === 'Học sinh ẩn danh') {
    return;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

  const now = new Date();
  const timeStr = now.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const entry: AccessLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: timeStr,
    rawDate: now.toISOString(),
    studentName: student.name.trim(),
    studentClass: (student.room || 'Chưa phân lớp').trim(),
    grade,
    lessonName,
    action,
    resourceTitle,
    deviceType
  };

  // Lưu local
  const currentLogs = getLocalLogs();
  // Tránh spam cùng 1 hành động trong vòng 2 giây nếu học sinh click đúp
  if (currentLogs.length > 0) {
    const last = currentLogs[0];
    if (
      last.studentName === entry.studentName &&
      last.action === entry.action &&
      last.lessonName === entry.lessonName &&
      (Date.now() - new Date(last.rawDate || 0).getTime()) < 2000
    ) {
      return;
    }
  }

  currentLogs.unshift(entry);
  saveLocalLogs(currentLogs);

  // Gửi lên server để Cô Duyên xem thống kê tập trung
  try {
    fetch('/api/admin/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  } catch {
    // Không cản trở người dùng
  }
}

// Xuất file JSON sao lưu tiến độ
export function exportProgressToFile(progress: StudentProgress): void {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tien_do_hoc_tap_${progress.student.name.replace(/\s+/g, '_')}_${progress.syncCode}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
