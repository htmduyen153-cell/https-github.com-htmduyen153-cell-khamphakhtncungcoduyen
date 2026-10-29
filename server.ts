import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'sync-store.json');

// Đảm bảo thư mục lưu trữ dữ liệu tồn tại
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerDataStore {
  studentsProgress: Record<string, any>;
  accessLogs: any[];
  customResources: any[];
  customSyllabus?: Record<string, any>;
  adminPassword?: string;
}

const DEFAULT_RESOURCES = [
  {
    id: 'res-8-30-1',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'model3d',
    title: 'Mô hình 3D: Toàn bộ hệ cơ quan nội tạng người',
    desc: 'Mô hình xoay 360 độ tương tác, bóc tách quan sát vị trí của tim, phổi, gan, dạ dày trong khoang ngực và bụng.',
    link: 'https://human.biodigital.com',
    fileName: 'So-do-khoang-than-the-nguoi.pdf',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-2',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'mindmap',
    title: 'Mindmap: Sơ đồ phối hợp các hệ cơ quan cơ thể người',
    desc: 'Tổng hợp sơ đồ thể hiện sự phối hợp nhịp nhàng giữa hệ thần kinh, nội tiết cùng hệ tuần hoàn, tiêu hóa, hô hấp.',
    link: '',
    fileName: 'Mindmap-Bai30-Cothe-nguoi.png',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-3',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'exercise',
    title: 'Phiếu học tập: Nhận diện cơ quan và hệ cơ quan',
    desc: 'Bộ 15 câu hỏi trắc nghiệm khách quan và bài tập ghép nối chức năng của từng cơ quan chính.',
    link: '',
    fileName: 'Phieu-bai-tap-Bai30-KHTN8.docx',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-30-4',
    lessonId: 'b8-30',
    grade: 8,
    subcat: 'game',
    title: 'Trò chơi: Đố vui sắp xếp cơ quan vào đúng hệ',
    desc: 'Thử thách kéo thả các cơ quan: Dạ dày, Phổi, Thận, Tim, Não vào đúng hệ cơ quan tương ứng.',
    link: 'https://wordwall.net',
    fileName: '',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-33-1',
    lessonId: 'b8-33',
    grade: 8,
    subcat: 'model3d',
    title: 'Mô hình 3D: Cấu tạo 4 ngăn tim và van tim',
    desc: 'Khảo sát động học 4 ngăn tim (2 tâm thất, 2 tâm nhĩ) và van nhĩ thất, van động mạch khi co bóp.',
    link: 'https://sketchfab.com/3d-models/human-heart-animated-3d-model',
    fileName: 'Mo-hinh-tim-3D-KHTN8.pdf',
    createdAt: '2026-10-10'
  },
  {
    id: 'res-8-33-2',
    lessonId: 'b8-33',
    grade: 8,
    subcat: 'virtual_lab',
    title: 'Thí nghiệm mô phỏng: Đường đi máu vòng tuần hoàn lớn & nhỏ',
    desc: 'Theo dõi sự thay đổi màu sắc máu giàu O2 (đỏ tươi) và máu giàu CO2 (đỏ thẫm) qua các mao mạch.',
    link: 'https://vlab.amrita.edu',
    fileName: '',
    createdAt: '2026-10-10'
  }
];

function loadStore(): ServerDataStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed.customResources)) {
        parsed.customResources = DEFAULT_RESOURCES;
      }
      if (!parsed.adminPassword) {
        parsed.adminPassword = 'coduyen2026';
      }
      if (!parsed.studentsProgress || typeof parsed.studentsProgress !== 'object') {
        parsed.studentsProgress = {};
      }
      // Dọn sạch seed logs nếu có
      if (Array.isArray(parsed.accessLogs)) {
        parsed.accessLogs = parsed.accessLogs.filter(
          (l: any) =>
            l &&
            l.studentName &&
            l.studentName !== 'Học sinh ẩn danh' &&
            l.studentName !== 'Nguyễn Văn An' &&
            l.studentName !== 'Trần Thị Mai' &&
            !String(l.id || '').startsWith('log-seed-')
        );
      } else {
        parsed.accessLogs = [];
      }

      // Đảm bảo mọi học sinh thực tế từng đồng bộ hồ sơ đều được lưu trong nhật ký và thống kê
      Object.values(parsed.studentsProgress).forEach((prog: any) => {
        if (prog?.student?.name && prog.student.name.trim() && prog.student.name.trim() !== 'Học sinh ẩn danh') {
          const sName = prog.student.name.trim();
          const sClass = (prog.student.room || 'Chưa phân lớp').trim();
          const hasLog = (parsed.accessLogs || []).some(
            (l: any) => l.studentName === sName && l.studentClass === sClass
          );
          if (!hasLog) {
            parsed.accessLogs.push({
              id: `log-reg-${prog.student.id || Date.now()}`,
              timestamp: prog.lastSyncTimestamp
                ? new Date(prog.lastSyncTimestamp).toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })
                : new Date().toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  }),
              rawDate: prog.lastSyncTimestamp || new Date().toISOString(),
              studentName: sName,
              studentClass: sClass,
              grade: prog.student.grade || 8,
              lessonName: 'Vào lớp học tập & Đồng bộ hồ sơ',
              action: 'Đăng nhập vào lớp học',
              deviceType: 'Desktop'
            });
          }
        }
      });

      // Dọn sạch syllabus cũ nếu có
      if (parsed.customSyllabus && parsed.customSyllabus[6]) {
        const hasOld = parsed.customSyllabus[6].some((l: any) => l.id === 'b6-17');
        if (hasOld) {
          parsed.customSyllabus = null;
        }
      }
      return parsed;
    }
  } catch (err) {
    console.error('Lỗi khi đọc file sync-store.json:', err);
  }
  return {
    adminPassword: 'coduyen2026',
    studentsProgress: {},
    accessLogs: [],
    customResources: DEFAULT_RESOURCES
  };
}

function saveStore(data: ServerDataStore) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi khi ghi file sync-store.json:', err);
  }
}

let store = loadStore();
// Lưu ngay lập tức để sync-store.json luôn hiện diện trên đĩa và không bao giờ bị mất
saveStore(store);

app.use(express.json({ limit: '25mb' }));

// 1. API ĐỒNG BỘ TIẾN ĐỘ THEO MÃ SYNC CODE
app.get('/api/sync/:code', (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const progress = store.studentsProgress[code];
  if (!progress) {
    return res.status(404).json({ error: 'Không tìm thấy dữ liệu đồng bộ với mã này' });
  }
  return res.json(progress);
});

app.post('/api/sync/:code', (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const progress = req.body;
  if (!progress) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }
  progress.lastSyncTimestamp = new Date().toISOString();
  store.studentsProgress[code] = progress;

  // Tự động bảo đảm học sinh có bản ghi tham gia trong accessLogs nếu là học sinh thực tế
  if (progress.student && progress.student.name && progress.student.name.trim() && progress.student.name.trim() !== 'Học sinh ẩn danh') {
    const sName = progress.student.name.trim();
    const sClass = (progress.student.room || 'Chưa phân lớp').trim();
    const hasLog = (store.accessLogs || []).some(
      (l: any) => l.studentName === sName && l.studentClass === sClass
    );
    if (!hasLog) {
      store.accessLogs.unshift({
        id: `log-sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
        rawDate: new Date().toISOString(),
        studentName: sName,
        studentClass: sClass,
        grade: progress.student.grade || 8,
        lessonName: 'Vào lớp học tập & Đồng bộ hồ sơ',
        action: 'Đăng nhập vào lớp học',
        deviceType: 'Desktop'
      });
    }
  }

  saveStore(store);
  return res.json({ success: true, timestamp: progress.lastSyncTimestamp });
});

// 2. API NHẬT KÝ VÀ THỐNG KÊ ADMIN
app.get('/api/admin/overview', (_req, res) => {
  const totalSyncProfiles = Object.keys(store.studentsProgress).length;
  const logs = store.accessLogs || [];

  const classMap: Record<string, any> = {};
  logs.forEach(l => {
    const cName = (l.studentClass || 'Chưa phân lớp').trim();
    if (!classMap[cName]) {
      classMap[cName] = {
        className: cName,
        grade: l.grade,
        students: new Set(),
        interactions: 0,
        lastSeen: l.timestamp
      };
    }
    classMap[cName].interactions += 1;
    classMap[cName].students.add(l.studentName);
  });

  const formattedClasses = Object.values(classMap).map(c => ({
    className: c.className,
    grade: c.grade,
    studentCount: c.students.size,
    totalInteractions: c.interactions,
    lastActive: c.lastSeen
  }));

  res.json({
    totalSyncProfiles,
    totalLogs: logs.length,
    classes: formattedClasses
  });
});

app.get('/api/admin/logs', (_req, res) => {
  res.json(store.accessLogs || []);
});

app.post('/api/admin/log', (req, res) => {
  const log = req.body;
  if (
    !log ||
    !log.studentName ||
    log.studentName === 'Học sinh ẩn danh' ||
    !log.studentName.trim() ||
    String(log.id || '').startsWith('log-seed-') ||
    log.studentName === 'Nguyễn Văn An' ||
    log.studentName === 'Trần Thị Mai'
  ) {
    return res.json({ success: true, ignored: true });
  }

  // Tránh thêm trùng lặp id
  const exists = (store.accessLogs || []).some(l => l.id === log.id);
  if (!exists) {
    store.accessLogs.unshift(log);
    if (store.accessLogs.length > 1000) {
      store.accessLogs = store.accessLogs.slice(0, 1000);
    }
    saveStore(store);
  }
  res.json({ success: true });
});

// Hợp nhất đồng bộ danh sách logs từ phía client lên server
app.post('/api/admin/sync-logs', (req, res) => {
  const { logs } = req.body;
  if (Array.isArray(logs)) {
    const clean = logs.filter(
      (l: any) =>
        l &&
        l.studentName &&
        l.studentName !== 'Học sinh ẩn danh' &&
        l.studentName !== 'Nguyễn Văn An' &&
        l.studentName !== 'Trần Thị Mai' &&
        !String(l.id || '').startsWith('log-seed-')
    );
    const existingIds = new Set((store.accessLogs || []).map((l: any) => l.id));
    let added = 0;
    clean.forEach((l: any) => {
      if (!existingIds.has(l.id)) {
        store.accessLogs.push(l);
        existingIds.add(l.id);
        added++;
      }
    });
    if (added > 0) {
      store.accessLogs.sort((a: any, b: any) => {
        const tA = new Date(a.rawDate || a.timestamp).getTime() || 0;
        const tB = new Date(b.rawDate || b.timestamp).getTime() || 0;
        return tB - tA;
      });
      if (store.accessLogs.length > 1000) {
        store.accessLogs = store.accessLogs.slice(0, 1000);
      }
      saveStore(store);
    }
  }
  res.json({ success: true, count: store.accessLogs?.length || 0 });
});

app.post('/api/admin/clear-logs', (_req, res) => {
  store.accessLogs = [];
  saveStore(store);
  res.json({ success: true });
});

// 2b. API BẢO MẬT TÀI KHOẢN ADMIN (XÁC THỰC, ĐỔI MẬT KHẨU, QUÊN MẬT KHẨU)
app.post('/api/admin/verify', (req, res) => {
  const { username, password } = req.body || {};
  const currentPass = store.adminPassword || 'coduyen2026';
  const u = (username || '').trim().toLowerCase();
  const p = (password || '').trim();

  if ((u === 'admin' || u === 'coduyen') && p === currentPass) {
    return res.json({ success: true, message: 'Xác thực thành công' });
  }
  return res.status(401).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const currentPass = store.adminPassword || 'coduyen2026';

  if ((currentPassword || '').trim() !== currentPass) {
    return res.status(400).json({ success: false, error: 'Mật khẩu hiện tại không chính xác' });
  }
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'Mật khẩu mới phải có ít nhất 4 ký tự' });
  }

  store.adminPassword = newPassword.trim();
  saveStore(store);
  return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
});

app.post('/api/admin/reset-password', (req, res) => {
  const { recoveryAnswer, newPassword } = req.body || {};
  const answer = (recoveryAnswer || '').trim().toLowerCase();

  // Chấp nhận câu trả lời xác minh giáo viên: coduyen, cô duyên, duyên, sinh học, khtn
  const validAnswers = ['coduyen', 'cô duyên', 'duyen', 'giaovien', 'sinhhoc', 'sinh học', 'khtn'];
  const isMatch = validAnswers.some(ans => answer.includes(ans));

  if (!isMatch) {
    return res.status(400).json({ success: false, error: 'Câu trả lời xác minh giáo viên hoặc mã khôi phục không đúng' });
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'Mật khẩu mới phải có ít nhất 4 ký tự' });
  }

  store.adminPassword = newPassword.trim();
  saveStore(store);
  return res.json({ success: true, message: 'Khôi phục và đặt lại mật khẩu mới thành công' });
});

// 3. API QUẢN LÝ HỌC LIỆU (THÊM, XÓA, LẤY DANH SÁCH)
app.get('/api/resources', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(store.customResources || []);
});

app.post('/api/resources', (req, res) => {
  const resource = req.body;
  if (!resource || !resource.title) {
    return res.status(400).json({ error: 'Thiếu thông tin học liệu' });
  }
  store.customResources.unshift(resource);
  saveStore(store);
  res.json({ success: true, resource });
});

// Chỉnh sửa / cập nhật học liệu theo ID
app.put('/api/resources/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const index = store.customResources.findIndex(r => r.id === id);
  if (index !== -1) {
    store.customResources[index] = { ...store.customResources[index], ...updatedData, id };
    saveStore(store);
    return res.json({ success: true, resource: store.customResources[index] });
  }
  return res.status(404).json({ error: 'Không tìm thấy học liệu để chỉnh sửa' });
});

// Xóa 1 học liệu theo ID
app.delete('/api/resources/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = store.customResources.length;
  store.customResources = store.customResources.filter(r => r.id !== id);
  saveStore(store);
  res.json({
    success: true,
    deletedId: id,
    remainingCount: store.customResources.length,
    didDelete: store.customResources.length < initialLength
  });
});

// Xóa hàng loạt nhiều học liệu
app.post('/api/resources/bulk-delete', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
  }
  store.customResources = store.customResources.filter(r => !ids.includes(r.id));
  saveStore(store);
  res.json({ success: true, remainingCount: store.customResources.length });
});

// Xóa toàn bộ học liệu của 1 bài học
app.delete('/api/resources/lesson/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  store.customResources = store.customResources.filter(r => r.lessonId !== lessonId);
  saveStore(store);
  res.json({ success: true, remainingCount: store.customResources.length });
});

// 4. API QUẢN LÝ CHƯƠNG TRÌNH BÀI HỌC (SYLLABUS)
app.get('/api/syllabus', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(store.customSyllabus || null);
});

app.post('/api/syllabus', (req, res) => {
  const newSyllabus = req.body;
  if (!newSyllabus) {
    return res.status(400).json({ error: 'Dữ liệu chương trình không hợp lệ' });
  }
  store.customSyllabus = newSyllabus;
  saveStore(store);
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// 5. API ĐỒNG BỘ TOÀN DIỆN DÀNH RIÊNG CHO QUẢN TRỊ VIÊN CÔ DUYÊN
// Đảm bảo khi Admin bấm đồng bộ thì bất kỳ ai truy cập đường link chia sẻ đều nhận bản mới nhất
app.post('/api/admin/sync-all', (req, res) => {
  const { syllabus, resources } = req.body;
  let hasUpdate = false;
  if (syllabus && typeof syllabus === 'object') {
    store.customSyllabus = syllabus;
    hasUpdate = true;
  }
  if (Array.isArray(resources)) {
    store.customResources = resources;
    hasUpdate = true;
  }
  if (hasUpdate) {
    saveStore(store);
  }
  res.json({
    success: true,
    message: 'Đã đồng bộ toàn bộ bài học và học liệu lên máy chủ thành công! Mọi học sinh và người nhận link chia sẻ sẽ thấy phiên bản mới nhất ngay lập tức.',
    timestamp: new Date().toISOString(),
    resourceCount: store.customResources?.length || 0
  });
});

// TÍCH HỢP VITE CHO CẢ DEV VÀ PRODUCTION
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Máy chủ học tập Cô Duyên đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer();
