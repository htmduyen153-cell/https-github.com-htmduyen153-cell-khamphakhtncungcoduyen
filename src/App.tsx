import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GradeNumber, Lesson, ResourceItem, StudentProgress, StudentProfile, SubCategoryType } from './types';
import { MASTER_SYLLABUS } from './data/syllabus';
import { SEED_RESOURCES } from './data/initialResources';
import {
  loadLocalProgress,
  saveLocalProgress,
  pushProgressToCloud,
  pullProgressFromCloud,
  mergeProgress,
  getDefaultProgress,
  logActivity
} from './services/syncService';
import { Header } from './components/Header';
import { WelcomeGateModal } from './components/WelcomeGateModal';
import { SyncModal } from './components/SyncModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { LessonDetail } from './components/LessonDetail';
import { StudentNotebook } from './components/StudentNotebook';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const GRADE_METADATA: Record<GradeNumber, { title: string; subtitle: string; icon: string }> = {
  6: {
    title: 'KHTN 6: Mạch Vật Sống (Tế Bào Đến Đa Dạng Sinh Học)',
    subtitle: 'Chủ đề Tế bào – Đơn vị cơ sở của sự sống & Đa dạng thế giới sống cùng Cô Duyên.',
    icon: 'fa-microscope'
  },
  7: {
    title: 'KHTN 7: Mạch Vật Sống (Trao Đổi Chất & Điều Hòa Cơ Thể)',
    subtitle: 'Chủ đề Trao đổi chất, Cảm ứng, Sinh trưởng phát triển, Sinh sản & Cơ thể thống nhất.',
    icon: 'fa-seedling'
  },
  8: {
    title: 'KHTN 8: Mạch Vật Sống (Cơ Thể Người & Sinh Thái Học)',
    subtitle: 'Chủ đề Sinh học cơ thể người & Sinh thái học môi trường cùng Cô Duyên.',
    icon: 'fa-heart-pulse'
  },
  9: {
    title: 'KHTN 9: Mạch Vật Sống (Di Truyền Học & Tiến Hóa)',
    subtitle: 'Chủ đề Di truyền học Mendel, Nhiễm sắc thể, Công nghệ sinh học & Tiến hóa.',
    icon: 'fa-dna'
  }
};

export default function App() {
  // 0. Chương trình bài học tùy biến (Syllabus chuẩn theo danh sách mới)
  const [syllabus, setSyllabus] = useState<Record<GradeNumber, Lesson[]>>(() => {
    try {
      const local = localStorage.getItem('coduyen_custom_syllabus_v3');
      if (local) {
        const parsed = JSON.parse(local);
        // Kiểm tra nếu là bản syllabus mới (không có bài 17 cũ ở lớp 6)
        if (parsed && parsed[6] && parsed[6].some((l: any) => l.id === 'b6-18')) {
          return parsed;
        }
      }
    } catch {}
    return MASTER_SYLLABUS;
  });

  // Tải chương trình bài học và học liệu từ server (tự động cập nhật bản mới nhất khi Admin chỉnh sửa)
  const refreshServerData = useCallback(() => {
    fetch('/api/syllabus', { cache: 'no-store' })
      .then(res => res.json())
      .then(serverSyl => {
        if (serverSyl && typeof serverSyl === 'object' && Object.keys(serverSyl).length > 0) {
          // Chỉ nhận nếu là syllabus hợp lệ
          if (serverSyl[6] && serverSyl[6].some((l: any) => l.id === 'b6-18')) {
            setSyllabus(serverSyl);
            localStorage.setItem('coduyen_custom_syllabus_v3', JSON.stringify(serverSyl));
          }
        }
      })
      .catch(() => {});

    fetch('/api/resources', { cache: 'no-store' })
      .then(res => res.json())
      .then(serverRes => {
        if (Array.isArray(serverRes) && serverRes.length >= 0) {
          setResources(serverRes);
          localStorage.setItem('coduyen_custom_resources_v4', JSON.stringify(serverRes));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshServerData();

    const handleFocus = () => refreshServerData();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(refreshServerData, 20000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [refreshServerData]);

  // 1. Vai trò người dùng hiện tại: Phân tách tuyệt đối giữa Học sinh ('student') và Admin ('admin')
  const [currentUserRole, setCurrentUserRole] = useState<'student' | 'admin' | null>(() => {
    try {
      const saved = localStorage.getItem('coduyen_active_role_v1');
      if (saved === 'admin' || saved === 'student') return saved as 'student' | 'admin';
    } catch {}
    const localProg = loadLocalProgress();
    if (localProg) return 'student';
    return null;
  });

  // Tiến độ học tập của học sinh
  const [progress, setProgress] = useState<StudentProgress | null>(() => loadLocalProgress());
  const [currentGrade, setCurrentGrade] = useState<GradeNumber>(progress?.student?.grade || 8);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('b8-30');
  
  // 2. Chế độ xem & Điều hướng
  const [viewMode, setViewMode] = useState<'student' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('coduyen_active_role_v1');
      return saved === 'admin' ? 'admin' : 'student';
    } catch {
      return 'student';
    }
  });
  const [mobileTab, setMobileTab] = useState<'lessons' | 'notebook'>('lessons');
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');

  // 3. Modals & Admin Selection Pre-fill
  const [isWelcomeGateOpen, setIsWelcomeGateOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('coduyen_active_role_v1');
      if (saved === 'admin') return false;
      if (saved === 'student' && loadLocalProgress()) return false;
    } catch {}
    return true;
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('coduyen_active_role_v1');
      return saved === 'admin';
    } catch {
      return false;
    }
  });
  const [adminInitialSelection, setAdminInitialSelection] = useState<{
    grade?: GradeNumber;
    lessonId?: string;
    subcat?: SubCategoryType;
  } | null>(null);

  // 4. Trạng thái đồng bộ đám mây dành riêng cho Admin
  const [isAdminSyncing, setIsAdminSyncing] = useState(false);

  // Hàm đồng bộ toàn diện dành riêng cho Quản Trị Viên (Cô Duyên)
  const handleAdminSyncToServer = async () => {
    setIsAdminSyncing(true);
    try {
      const res = await fetch('/api/admin/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabus,
          resources
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Đã đồng bộ toàn bộ bài học và học liệu lên máy chủ thành công!\nKhi Cô Duyên chia sẻ đường link cho người khác, họ sẽ thấy ngay bản cập nhật mới nhất!');
      } else {
        alert('Có lỗi khi đồng bộ: ' + (data.error || 'Vui lòng thử lại'));
      }
    } catch (err: any) {
      alert('Không thể kết nối máy chủ để đồng bộ: ' + (err?.message || 'Lỗi mạng'));
    } finally {
      setIsAdminSyncing(false);
    }
  };

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const [isSyncing, setIsSyncing] = useState(false);

  // 5. Tài nguyên học liệu
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const local = localStorage.getItem('coduyen_custom_resources_v4');
      if (local) return JSON.parse(local);
    } catch {}
    return SEED_RESOURCES;
  });

  // Kiểm tra tham số URL (?sync=BIO-...) để tự động đồng bộ khi quét QR trên điện thoại
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncParam = params.get('sync');
    if (syncParam) {
      setIsSyncing(true);
      pullProgressFromCloud(syncParam.toUpperCase()).then(res => {
        setIsSyncing(false);
        if (res.success && res.data) {
          setProgress(res.data);
          saveLocalProgress(res.data);
          setCurrentGrade(res.data.student.grade);
          setIsWelcomeGateOpen(false);
          window.history.replaceState({}, document.title, window.location.pathname);
          alert(`Đã tự động kết nối và đồng bộ tiến độ của em ${res.data.student.name} trên thiết bị này!`);
        }
      });
    }
  }, []);

  // Lắng nghe trạng thái mạng Online/Offline
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus('synced');
      if (progress) {
        pushProgressToCloud(progress);
      }
    };
    const handleOffline = () => {
      setSyncStatus('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [progress]);

  // Tự động ghi nhận phiên học tập thực tế khi học sinh đã có hồ sơ mở ứng dụng
  useEffect(() => {
    if (currentUserRole === 'student' && progress?.student?.name && progress.student.name.trim() && progress.student.name.trim() !== 'Học sinh ẩn danh') {
      const today = new Date().toISOString().slice(0, 10);
      const sessionKey = `coduyen_session_logged_${today}_${progress.student.name}_${progress.student.room}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        const lessonsInGrade = syllabus[currentGrade] || [];
        const currentL = lessonsInGrade.find(l => l.id === selectedLessonId) || lessonsInGrade[0];
        const title = currentL ? `${currentL.code}: ${currentL.title}` : `KHTN ${currentGrade}`;
        logActivity(progress.student, 'Vào học bài (Phiên học mới)', title, currentGrade);
      }
    }
  }, [currentUserRole, progress?.student?.name, currentGrade, selectedLessonId, syllabus]);

  // Cập nhật bài học mặc định khi đổi khối lớp hoặc cập nhật syllabus
  useEffect(() => {
    const list = syllabus[currentGrade] || [];
    if (list.length > 0 && !list.some(l => l.id === selectedLessonId)) {
      setSelectedLessonId(list[0].id);
    }
  }, [currentGrade, selectedLessonId, syllabus]);

  // Hàm lưu tiến độ với Cloud sync tự động
  const updateAndSyncProgress = useCallback((newProgress: StudentProgress) => {
    setProgress(newProgress);
    saveLocalProgress(newProgress);

    if (navigator.onLine) {
      setSyncStatus('saving');
      pushProgressToCloud(newProgress).then(res => {
        setSyncStatus(res.success ? 'synced' : 'offline');
      });
    } else {
      setSyncStatus('offline');
    }
  }, []);

  // Ghi nhật ký truy cập hoạt động
  const handleLogActivity = useCallback((action: string, resTitle?: string) => {
    const lessonsInGrade = syllabus[currentGrade] || [];
    const lesson = lessonsInGrade.find(l => l.id === selectedLessonId);
    const title = lesson ? `${lesson.code}: ${lesson.title}` : selectedLessonId;
    logActivity(progress?.student || null, action, title, currentGrade, resTitle);
  }, [currentGrade, selectedLessonId, progress, syllabus]);

  // Chọn bài học
  const handleSelectLesson = (lessonId: string, grade?: GradeNumber) => {
    if (grade && grade !== currentGrade) {
      setCurrentGrade(grade);
    }
    setSelectedLessonId(lessonId);
    if (mobileTab !== 'lessons') {
      setMobileTab('lessons');
    }
    handleLogActivity('Mở xem bài học');
  };

  // Đánh dấu hoàn thành bài học
  const handleToggleCompleteLesson = () => {
    if (!progress) return;
    const completedSet = new Set(progress.completedLessonIds);
    if (completedSet.has(selectedLessonId)) {
      completedSet.delete(selectedLessonId);
    } else {
      completedSet.add(selectedLessonId);
      handleLogActivity('Đánh dấu hoàn thành bài');
    }
    const updated: StudentProgress = {
      ...progress,
      completedLessonIds: Array.from(completedSet)
    };
    updateAndSyncProgress(updated);
  };

  // Đánh dấu Bookmark bài học
  const handleToggleBookmarkLesson = () => {
    if (!progress) return;
    const bookmarkSet = new Set(progress.bookmarkedLessonIds);
    if (bookmarkSet.has(selectedLessonId)) {
      bookmarkSet.delete(selectedLessonId);
    } else {
      bookmarkSet.add(selectedLessonId);
    }
    const updated: StudentProgress = {
      ...progress,
      bookmarkedLessonIds: Array.from(bookmarkSet)
    };
    updateAndSyncProgress(updated);
  };

  // Lưu ghi chú cá nhân cho bài học
  const handleSaveNote = (noteText: string) => {
    if (!progress) return;
    const updated: StudentProgress = {
      ...progress,
      lessonNotes: {
        ...progress.lessonNotes,
        [selectedLessonId]: noteText
      }
    };
    updateAndSyncProgress(updated);
  };

  // Tích lũy số phút học tập từ Pomodoro timer
  const handleAddStudyMinutes = (min: number) => {
    if (!progress) return;
    const today = new Date().toISOString().slice(0, 10);
    const isNewDay = progress.lastStudyDate !== today;

    const updated: StudentProgress = {
      ...progress,
      studyTimeMinutes: progress.studyTimeMinutes + min,
      streakDays: isNewDay ? progress.streakDays + 1 : progress.streakDays,
      lastStudyDate: today
    };
    updateAndSyncProgress(updated);
  };

  // Áp dụng tiến độ tải về từ thiết bị khác
  const handleApplyRemoteProgress = (remote: StudentProgress) => {
    if (!progress) {
      setProgress(remote);
      saveLocalProgress(remote);
      setCurrentGrade(remote.student.grade);
    } else {
      const merged = mergeProgress(progress, remote);
      setProgress(merged);
      saveLocalProgress(merged);
      pushProgressToCloud(merged);
    }
  };

  // Đồng bộ thủ công ngay lập tức
  const handleManualSync = async () => {
    if (!progress) return;
    setIsSyncing(true);
    setSyncStatus('saving');

    const remoteRes = await pullProgressFromCloud(progress.syncCode);
    if (remoteRes.success && remoteRes.data) {
      const merged = mergeProgress(progress, remoteRes.data);
      setProgress(merged);
      saveLocalProgress(merged);
      await pushProgressToCloud(merged);
    } else {
      await pushProgressToCloud(progress);
    }

    setIsSyncing(false);
    setSyncStatus('synced');
  };

  // Lưu thông tin học sinh từ WelcomeGate (Đăng nhập Học sinh)
  const handleSaveStudentProfile = (newProfile: StudentProfile, imported?: StudentProgress) => {
    let studentProg: StudentProgress;
    if (imported) {
      studentProg = imported;
      setProgress(imported);
      saveLocalProgress(imported);
      setCurrentGrade(imported.student.grade);
    } else {
      studentProg = getDefaultProgress(newProfile);
      setProgress(studentProg);
      saveLocalProgress(studentProg);
      setCurrentGrade(newProfile.grade);
      pushProgressToCloud(studentProg);
    }
    setCurrentUserRole('student');
    setIsAdminLoggedIn(false);
    setViewMode('student');
    localStorage.setItem('coduyen_active_role_v1', 'student');
    setIsWelcomeGateOpen(false);

    // Ghi nhận ngay lập tức vào nhật ký học tập thực tế và thống kê theo lớp
    const targetGrade = studentProg.student.grade;
    const lessonsInGrade = syllabus[targetGrade] || [];
    const firstLesson = lessonsInGrade[0];
    const lessonTitle = firstLesson ? `${firstLesson.code}: ${firstLesson.title}` : `KHTN ${targetGrade}`;
    logActivity(studentProg.student, 'Đăng nhập vào lớp học', lessonTitle, targetGrade);
  };

  // Xử lý khi Admin Cô Duyên đăng nhập thành công
  const handleAdminLoginSuccess = () => {
    setCurrentUserRole('admin');
    setIsAdminLoggedIn(true);
    setViewMode('admin');
    localStorage.setItem('coduyen_active_role_v1', 'admin');
    setIsWelcomeGateOpen(false);
    setIsAdminLoginOpen(false);
  };

  // Xử lý khi Admin đăng xuất
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentUserRole(null);
    setViewMode('student');
    localStorage.removeItem('coduyen_active_role_v1');
    setIsWelcomeGateOpen(true);
  };

  // Xử lý khi Học sinh đăng xuất / đổi tài khoản
  const handleStudentLogout = () => {
    setCurrentUserRole(null);
    localStorage.removeItem('coduyen_active_role_v1');
    setIsWelcomeGateOpen(true);
  };

  // Thêm tài nguyên học liệu mới
  const handleAddResource = (newRes: ResourceItem) => {
    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem('coduyen_custom_resources_v4', JSON.stringify(updated));

    fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRes)
    }).catch(() => {});
  };

  // Xóa tài nguyên học liệu
  const handleDeleteResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    localStorage.setItem('coduyen_custom_resources_v4', JSON.stringify(updated));

    fetch(`/api/resources/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Cập nhật tài nguyên học liệu
  const handleUpdateResource = (updatedRes: ResourceItem) => {
    const updated = resources.map(r => r.id === updatedRes.id ? updatedRes : r);
    setResources(updated);
    localStorage.setItem('coduyen_custom_resources_v4', JSON.stringify(updated));

    fetch(`/api/resources/${updatedRes.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRes)
    }).catch(() => {});
  };

  // Cập nhật tùy biến bài học (Lesson)
  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setSyllabus(prev => {
      const list = prev[updatedLesson.grade] || [];
      const updatedList = list.map(l => l.id === updatedLesson.id ? updatedLesson : l);
      const nextSyllabus = { ...prev, [updatedLesson.grade]: updatedList };
      localStorage.setItem('coduyen_custom_syllabus_v3', JSON.stringify(nextSyllabus));
      fetch('/api/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSyllabus)
      }).catch(() => {});
      return nextSyllabus;
    });
  };

  // Xóa bài học khỏi chương trình
  const handleDeleteLesson = (lessonId: string, grade: GradeNumber) => {
    setSyllabus(prev => {
      const list = prev[grade] || [];
      const updatedList = list.filter(l => l.id !== lessonId);
      const nextSyllabus = { ...prev, [grade]: updatedList };
      localStorage.setItem('coduyen_custom_syllabus_v3', JSON.stringify(nextSyllabus));
      fetch('/api/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSyllabus)
      }).catch(() => {});
      return nextSyllabus;
    });

    // Xóa học liệu gắn với bài này
    const remainingResources = resources.filter(r => r.lessonId !== lessonId);
    setResources(remainingResources);
    localStorage.setItem('coduyen_custom_resources_v4', JSON.stringify(remainingResources));
    fetch(`/api/resources/lesson/${lessonId}`, { method: 'DELETE' }).catch(() => {});
  };

  // Thêm bài học mới
  const handleAddLesson = (newLesson: Lesson) => {
    setSyllabus(prev => {
      const list = prev[newLesson.grade] || [];
      const nextSyllabus = { ...prev, [newLesson.grade]: [...list, newLesson] };
      localStorage.setItem('coduyen_custom_syllabus_v3', JSON.stringify(nextSyllabus));
      fetch('/api/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSyllabus)
      }).catch(() => {});
      return nextSyllabus;
    });
    setSelectedLessonId(newLesson.id);
  };

  // Khôi phục chương trình gốc chuẩn SGK
  const handleResetSyllabus = () => {
    setSyllabus(MASTER_SYLLABUS);
    localStorage.removeItem('coduyen_custom_syllabus_v3');
    fetch('/api/syllabus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(MASTER_SYLLABUS)
    }).catch(() => {});
  };

  // Mở trang Admin với form thêm học liệu điền sẵn bài học và mục con
  const handleOpenAdminToAdd = (lessonId: string, grade: GradeNumber, subcat: SubCategoryType) => {
    setAdminInitialSelection({ grade, lessonId, subcat });
    if (isAdminLoggedIn) {
      setViewMode('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Tất cả bài học của khối lớp hiện tại từ syllabus
  const currentGradeLessons = syllabus[currentGrade] || [];
  const currentLesson = currentGradeLessons.find(l => l.id === selectedLessonId) || currentGradeLessons[0];
  const currentLessonIndex = currentGradeLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? currentGradeLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < currentGradeLessons.length - 1 ? currentGradeLessons[currentLessonIndex + 1] : null;

  // Lọc bài học theo tìm kiếm
  const filteredLessons = useMemo(() => {
    if (!lessonSearchQuery.trim()) return currentGradeLessons;
    const q = lessonSearchQuery.toLowerCase();
    return currentGradeLessons.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.topic.toLowerCase().includes(q) ||
      l.keyConcepts.some(c => c.toLowerCase().includes(q))
    );
  }, [currentGradeLessons, lessonSearchQuery]);

  // Nhóm các bài học theo từng Chủ đề để hiển thị khoa học trong Sidebar
  const groupedLessons = useMemo(() => {
    const groups: { topic: string; lessons: Lesson[] }[] = [];
    filteredLessons.forEach(l => {
      let g = groups.find(item => item.topic === l.topic);
      if (!g) {
        g = { topic: l.topic, lessons: [] };
        groups.push(g);
      }
      g.lessons.push(l);
    });
    return groups;
  }, [filteredLessons]);

  // Gom toàn bộ bài học để làm sổ tay
  const allLessonsFlat = useMemo(() => {
    return Object.values(syllabus).flat();
  }, [syllabus]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased pb-20 md:pb-8">
      
      {/* 1. Header chính - Phân tách vai trò rõ ràng */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={(g) => {
          setCurrentGrade(g);
          handleLogActivity('Chuyển khối lớp', `KHTN ${g}`);
        }}
        userRole={currentUserRole === 'admin' ? 'admin' : 'student'}
        student={currentUserRole === 'student' ? (progress?.student || null) : null}
        onOpenWelcomeGate={() => setIsWelcomeGateOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        onToggleAdminView={() => {
          setViewMode(v => v === 'admin' ? 'student' : 'admin');
        }}
        viewMode={viewMode}
        onAdminLogout={handleAdminLogout}
        studyMinutes={progress?.studyTimeMinutes || 0}
        onAdminSync={handleAdminSyncToServer}
        isAdminSyncing={isAdminSyncing}
      />

      {/* 2. Nội dung chính: Chế độ Học Sinh hoặc Quản Trị Viên */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {viewMode === 'admin' && isAdminLoggedIn ? (
          /* GIAO DIỆN QUẢN TRỊ VIÊN CÔ DUYÊN */
          <AdminPortal
            allLessonsByGrade={syllabus}
            resources={resources}
            onAddResource={handleAddResource}
            onUpdateResource={handleUpdateResource}
            onDeleteResource={handleDeleteResource}
            onUpdateLesson={handleUpdateLesson}
            onDeleteLesson={handleDeleteLesson}
            onAddLesson={handleAddLesson}
            onResetSyllabus={handleResetSyllabus}
            onCloseAdmin={() => setViewMode('student')}
            onAdminLogout={handleAdminLogout}
            initialSelection={adminInitialSelection}
          />
        ) : mobileTab === 'notebook' ? (
          /* GIAO DIỆN SỔ TAY TIẾN TRÌNH HỌC TẬP (CHỈ DÀNH CHO HỌC SINH) */
          progress ? (
            <StudentNotebook
              progress={progress}
              allLessons={allLessonsFlat}
              onSelectLesson={handleSelectLesson}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
            />
          ) : null
        ) : (
          /* GIAO DIỆN BÀI HỌC VÀ HỌC TẬP KHÁM PHÁ */
          <div className="space-y-5">

            {/* THANH THÔNG BÁO DÀNH CHO ADMIN KHI ĐANG XEM GIAO DIỆN BÀI HỌC (HỌC SINH HOÀN TOÀN KHÔNG THẤY) */}
            {currentUserRole === 'admin' && (
              <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-3 px-4 text-amber-950 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-chalkboard-user text-amber-700 text-base"></i>
                  <span>Cô Duyên đang ở chế độ xem trước bài học. Bạn có thể bấm "Sửa bài học" hoặc "Thêm học liệu" trực tiếp tại đây.</span>
                </div>
                <button
                  onClick={() => setViewMode('admin')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition cursor-pointer shrink-0 shadow-2xs"
                >
                  Quay Lại Bảng Quản Trị &rarr;
                </button>
              </div>
            )}
            
            {/* Banner giới thiệu khối lớp */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-8 shadow-xl shadow-emerald-950/10">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-2.5 border border-white/10">
                  <i className={`fa-solid ${GRADE_METADATA[currentGrade].icon}`}></i>
                  <span>Mạch Vật Sống &bull; GDPT 2018</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                  {GRADE_METADATA[currentGrade].title}
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-3 max-w-2xl">
                  {GRADE_METADATA[currentGrade].subtitle}
                </p>

                {/* Thanh tiến độ hoàn thành khối lớp của học sinh (chỉ hiện khi là Học sinh) */}
                {currentUserRole === 'student' && progress && (
                  <div className="mt-4 pt-3 border-t border-white/10 max-w-lg">
                    <div className="flex items-center justify-between text-xs text-emerald-200 font-bold mb-1">
                      <span>Tiến độ KHTN {currentGrade}:</span>
                      <span>
                        {progress.completedLessonIds.filter(id => id.startsWith(`b${currentGrade}-`)).length} / {currentGradeLessons.length} bài
                      </span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(progress.completedLessonIds.filter(id => id.startsWith(`b${currentGrade}-`)).length / (currentGradeLessons.length || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute -right-8 -bottom-10 opacity-10 text-[240px] pointer-events-none select-none">
                <i className="fa-solid fa-dna"></i>
              </div>
            </div>

            {/* Bố cục 2 cột linh hoạt: Danh mục bài học (Trái) & Nội dung bài học (Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* CỘT TRÁI: DANH MỤC BÀI HỌC SGK PHÂN THEO CHỦ ĐỀ */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs lg:sticky lg:top-24 max-h-[82vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <i className="fa-solid fa-list-ol text-emerald-600"></i>
                    <span>Danh Mục Bài Học (SGK)</span>
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {currentGradeLessons.length} bài
                  </span>
                </div>

                {/* Ô tìm kiếm bài học nhanh */}
                <div className="mb-2.5">
                  <input
                    type="text"
                    value={lessonSearchQuery}
                    onChange={e => setLessonSearchQuery(e.target.value)}
                    placeholder="🔍 Tìm nhanh bài học, chủ đề, khái niệm..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Danh sách bài học cuộn được phân nhóm theo Chủ đề */}
                <div className="space-y-3 overflow-y-auto flex-grow pr-1">
                  {groupedLessons.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                      <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50/70 rounded-lg flex items-center gap-1.5">
                        <i className="fa-solid fa-layer-group text-[10px] text-emerald-600"></i>
                        <span className="line-clamp-1">{group.topic}</span>
                      </div>

                      {group.lessons.map(lesson => {
                        const isSelected = lesson.id === selectedLessonId;
                        const isDone = currentUserRole === 'student' && progress?.completedLessonIds.includes(lesson.id);
                        const isSaved = currentUserRole === 'student' && progress?.bookmarkedLessonIds.includes(lesson.id);
                        const resCount = resources.filter(r => r.lessonId === lesson.id).length;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={`w-full text-left p-2.5 rounded-2xl transition duration-150 border flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700 font-medium'
                            }`}
                          >
                            <div className="pr-2 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black uppercase text-emerald-600">
                                  {lesson.code}
                                </span>
                                {isDone && (
                                  <i className="fa-solid fa-circle-check text-emerald-600 text-[11px]" title="Đã hoàn thành"></i>
                                )}
                                {isSaved && (
                                  <i className="fa-solid fa-bookmark text-amber-500 text-[10px]" title="Đã lưu"></i>
                                )}
                              </div>
                              <span className="text-xs line-clamp-1 group-hover:text-emerald-700 transition">
                                {lesson.title}
                              </span>
                            </div>

                            <span
                              className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isSelected ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {resCount} mục
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI: CHI TIẾT BÀI HỌC ĐANG CHỌN */}
              <div className="lg:col-span-8">
                {currentLesson ? (
                  <LessonDetail
                    lesson={currentLesson}
                    resources={resources}
                    isCompleted={currentUserRole === 'student' && (progress?.completedLessonIds.includes(currentLesson.id) || false)}
                    isBookmarked={currentUserRole === 'student' && (progress?.bookmarkedLessonIds.includes(currentLesson.id) || false)}
                    onToggleComplete={handleToggleCompleteLesson}
                    onToggleBookmark={handleToggleBookmarkLesson}
                    noteText={currentUserRole === 'student' ? (progress?.lessonNotes[currentLesson.id] || '') : ''}
                    onSaveNote={handleSaveNote}
                    onLogResourceAccess={handleLogActivity}
                    onOpenAdminToAdd={handleOpenAdminToAdd}
                    isAdmin={currentUserRole === 'admin'}
                    onDeleteResource={handleDeleteResource}
                    onUpdateResource={handleUpdateResource}
                    onUpdateLesson={handleUpdateLesson}
                    onAddResource={handleAddResource}
                    prevLesson={prevLesson}
                    nextLesson={nextLesson}
                    onSelectLesson={handleSelectLesson}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                    <p className="text-sm text-slate-500">Vui lòng chọn bài học từ danh mục bên trái.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-dna text-emerald-600 text-base"></i>
            <span>
              <b>Khám Phá Sinh Học KHTN Cùng Cô Duyên</b> &bull; Mạch Vật Sống GDPT 2018 (Lớp 6, 7, 8, 9)
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Học tập mọi lúc mọi nơi &bull; Đồng bộ tiến độ đa thiết bị &bull; 69 bài học chuẩn phân phối chương trình
          </div>
        </div>
      </footer>

      {/* 4. Thanh điều hướng đáy dành riêng cho Điện thoại di động */}
      <MobileBottomNav
        currentView={mobileTab}
        onSelectView={(v) => {
          setMobileTab(v);
          if (viewMode === 'admin') setViewMode('student');
        }}
        userRole={currentUserRole === 'admin' ? 'admin' : 'student'}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setViewMode(v => v === 'admin' ? 'student' : 'admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onAdminLogout={handleAdminLogout}
      />

      {/* 5. Modals tích hợp */}
      <WelcomeGateModal
        isOpen={isWelcomeGateOpen}
        onClose={() => {
          if (currentUserRole) {
            setIsWelcomeGateOpen(false);
          }
        }}
        onSaveProfile={handleSaveStudentProfile}
        initialProfile={currentUserRole === 'student' ? (progress?.student || null) : null}
        currentUserRole={currentUserRole}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onStudentLogout={handleStudentLogout}
      />

      {currentUserRole === 'student' && progress && (
        <SyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          progress={progress}
          onApplyRemoteProgress={handleApplyRemoteProgress}
          onRefreshSync={handleManualSync}
          isSyncing={isSyncing}
        />
      )}

      <StudyTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        onAddStudyMinutes={handleAddStudyMinutes}
        totalStudyMinutes={progress?.studyTimeMinutes || 0}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
