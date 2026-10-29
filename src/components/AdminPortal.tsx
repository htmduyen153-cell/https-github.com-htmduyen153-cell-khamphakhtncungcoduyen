import React, { useState, useEffect } from 'react';
import { GradeNumber, Lesson, ResourceItem, AccessLog, SubCategoryType } from '../types';
import { ChangePasswordModal } from './AdminPasswordModals';
import { fetchAndSyncLogs, getLocalLogs } from '../services/syncService';

interface AdminPortalProps {
  allLessonsByGrade: Record<GradeNumber, Lesson[]>;
  resources: ResourceItem[];
  onAddResource: (newRes: ResourceItem) => void;
  onUpdateResource: (updatedRes: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onUpdateLesson?: (updatedLesson: Lesson) => void;
  onDeleteLesson?: (lessonId: string, grade: GradeNumber) => void;
  onAddLesson?: (newLesson: Lesson) => void;
  onResetSyllabus?: () => void;
  onCloseAdmin: () => void;
  onAdminLogout: () => void;
  initialSelection?: {
    grade?: GradeNumber;
    lessonId?: string;
    subcat?: SubCategoryType;
  } | null;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  allLessonsByGrade,
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onUpdateLesson,
  onDeleteLesson,
  onAddLesson,
  onResetSyllabus,
  onCloseAdmin,
  onAdminLogout,
  initialSelection
}) => {
  const [adminTab, setAdminTab] = useState<'lessons_list' | 'resources' | 'analytics'>('lessons_list');

  // Khối lớp đang chọn quản lý bài học
  const [syllabusGrade, setSyllabusGrade] = useState<GradeNumber>(initialSelection?.grade || 8);
  const [lessonSearch, setLessonSearch] = useState('');

  // Trạng thái Chỉnh sửa & Xóa bài học (Syllabus Lesson)
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Form chỉnh sửa / thêm bài học
  const [editLessonGrade, setEditLessonGrade] = useState<GradeNumber>(8);
  const [editLessonCode, setEditLessonCode] = useState('');
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonTopic, setEditLessonTopic] = useState('');
  const [editLessonYccd, setEditLessonYccd] = useState('');
  const [editLessonKeyConcepts, setEditLessonKeyConcepts] = useState('');

  // Form Thêm học liệu
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(initialSelection?.grade || 8);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialSelection?.lessonId || '');
  const [subcat, setSubcat] = useState<SubCategoryType>(initialSelection?.subcat || 'model3d');
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resLink, setResLink] = useState('');
  const [resFileName, setResFileName] = useState('');
  const [resFileData, setResFileData] = useState<string | null>(null);

  // Quản lý reset sạch DOM và state của input file đính kèm
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const editFileInputRef = React.useRef<HTMLInputElement>(null);
  const [editFileInputKey, setEditFileInputKey] = useState<number>(0);

  // Hàm xóa tệp đính kèm ở form thêm mới học liệu, để trống phần tệp
  const clearAttachedFile = () => {
    setResFileName('');
    setResFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileInputKey(prev => prev + 1);
  };

  // Hàm xóa tệp đính kèm ở modal chỉnh sửa học liệu
  const clearEditAttachedFile = () => {
    setEditFileName('');
    setEditFileData(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
    setEditFileInputKey(prev => prev + 1);
  };

  // Bộ lọc bảng học liệu
  const [tableGradeFilter, setTableGradeFilter] = useState<string>('all');
  const [tableSubcatFilter, setTableSubcatFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');

  // Trạng thái Chỉnh sửa & Xóa học liệu trong UI
  const [itemToEdit, setItemToEdit] = useState<ResourceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ResourceItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string>('');
  const [isConfirmClearLogsOpen, setIsConfirmClearLogsOpen] = useState(false);
  const [isConfirmResetSyllabusOpen, setIsConfirmResetSyllabusOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isSyncingToServer, setIsSyncingToServer] = useState(false);

  const handleSyncToServer = async () => {
    setIsSyncingToServer(true);
    try {
      const res = await fetch('/api/admin/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabus: allLessonsByGrade,
          resources: resources
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice('Đã đồng bộ toàn bộ bài học và học liệu lên máy chủ đám mây thành công! Mọi học sinh và người nhận link chia sẻ sẽ thấy phiên bản mới nhất ngay lập tức.');
      } else {
        setActionNotice('Có lỗi khi đồng bộ: ' + (data.error || 'Vui lòng thử lại'));
      }
    } catch (err: any) {
      setActionNotice('Không thể kết nối máy chủ để đồng bộ: ' + (err?.message || 'Lỗi mạng'));
    } finally {
      setIsSyncingToServer(false);
    }
  };

  // State chỉnh sửa chi tiết học liệu trong Edit Modal
  const [editGrade, setEditGrade] = useState<GradeNumber>(8);
  const [editLessonId, setEditLessonId] = useState<string>('');
  const [editSubcat, setEditSubcat] = useState<SubCategoryType>('model3d');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editFileData, setEditFileData] = useState<string | null>(null);

  // Dữ liệu Logs & Thống kê
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logGradeFilter, setLogGradeFilter] = useState<string>('all');
  const [logClassFilter, setLogClassFilter] = useState<string>('all');
  const [selectedClassDetail, setSelectedClassDetail] = useState<any | null>(null);

  // Khi có initialSelection truyền từ bài học
  useEffect(() => {
    if (initialSelection) {
      if (initialSelection.grade) {
        setSelectedGrade(initialSelection.grade);
        setSyllabusGrade(initialSelection.grade);
      }
      if (initialSelection.lessonId) setSelectedLessonId(initialSelection.lessonId);
      if (initialSelection.subcat) setSubcat(initialSelection.subcat);
      // Xóa sạch tệp đính kèm và form để sẵn sàng thêm mới hoàn toàn trống
      clearAttachedFile();
      setResTitle('');
      setResDesc('');
      setResLink('');
      setAdminTab('resources');
    }
  }, [initialSelection]);

  // Khi chọn bài học tiếp theo hoặc đổi bài học trong form:
  // PHẢI ĐỂ TRỐNG PHẦN THÊM FILE ĐÍNH KÈM, KHÔNG ĐƯỢC ĐỂ LẠI FILE BAN ĐẦU CỦA BÀI TRƯỚC
  useEffect(() => {
    clearAttachedFile();
    setResTitle('');
    setResDesc('');
    setResLink('');
  }, [selectedLessonId, selectedGrade]);

  // Cập nhật lesson dropdown khi đổi grade ở form thêm mới học liệu
  useEffect(() => {
    const list = allLessonsByGrade[selectedGrade] || [];
    if (list.length > 0 && (!selectedLessonId || !list.some(l => l.id === selectedLessonId))) {
      setSelectedLessonId(list[0].id);
    }
  }, [selectedGrade, allLessonsByGrade, selectedLessonId]);

  // Khi mở Edit Modal học liệu, nạp dữ liệu của item vào state form edit
  useEffect(() => {
    if (itemToEdit) {
      setEditGrade(itemToEdit.grade);
      setEditLessonId(itemToEdit.lessonId);
      setEditSubcat(itemToEdit.subcat);
      setEditTitle(itemToEdit.title);
      setEditDesc(itemToEdit.desc || '');
      setEditLink(itemToEdit.link || '');
      setEditFileName(itemToEdit.fileName || '');
      setEditFileData(itemToEdit.fileData || null);
    }
  }, [itemToEdit]);

  // Khi mở Edit Modal bài học
  useEffect(() => {
    if (lessonToEdit) {
      setEditLessonGrade(lessonToEdit.grade);
      setEditLessonCode(lessonToEdit.code);
      setEditLessonTitle(lessonToEdit.title);
      setEditLessonTopic(lessonToEdit.topic);
      setEditLessonYccd(lessonToEdit.yccd || '');
      setEditLessonKeyConcepts((lessonToEdit.keyConcepts || []).join(', '));
    }
  }, [lessonToEdit]);

  // Trạng thái làm mới nhật ký
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  // Tải Logs và tự động đồng bộ 2 chiều (giữ trọn vẹn dữ liệu học sinh, không bao giờ tự động reset về 0)
  const fetchLogs = async () => {
    setIsRefreshingLogs(true);
    try {
      const merged = await fetchAndSyncLogs();
      setAccessLogs(merged);
    } catch {
      setAccessLogs(getLocalLogs());
    } finally {
      setIsRefreshingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [adminTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResFileName(file.name);
    if (file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setResFileData(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditFileName(file.name);
    if (file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setEditFileData(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Thêm học liệu mới
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      grade: selectedGrade,
      lessonId: selectedLessonId,
      subcat,
      title: resTitle.trim(),
      desc: resDesc.trim(),
      link: resLink.trim() || undefined,
      fileName: resFileName.trim() || undefined,
      fileData: resFileData,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddResource(newRes);
    setResTitle('');
    setResDesc('');
    setResLink('');
    // Xóa sạch tệp đính kèm và reset DOM input sau khi lưu xong
    clearAttachedFile();

    setActionNotice('Cô Duyên đã lưu học liệu thành công! Phần đính kèm tệp đã được để trống sạch sẽ để sẵn sàng thêm bài tiếp theo.');
    setTimeout(() => setActionNotice(''), 3500);
  };

  // Lưu chỉnh sửa học liệu
  const handleSaveEditResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit || !editTitle.trim()) return;

    const updatedRes: ResourceItem = {
      ...itemToEdit,
      grade: editGrade,
      lessonId: editLessonId,
      subcat: editSubcat,
      title: editTitle.trim(),
      desc: editDesc.trim(),
      link: editLink.trim() || undefined,
      fileName: editFileName.trim() || undefined,
      fileData: editFileData
    };

    onUpdateResource(updatedRes);
    setItemToEdit(null);
    setActionNotice(`Đã cập nhật thành công học liệu: "${updatedRes.title}"`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  // Xác nhận và xóa học liệu
  const executeDeleteResource = (item: ResourceItem) => {
    onDeleteResource(item.id);
    setItemToDelete(null);
    setActionNotice(`Đã xóa vĩnh viễn học liệu: "${item.title}"`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  // Lưu chỉnh sửa bài học (Lesson)
  const handleSaveEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonToEdit || !editLessonTitle.trim() || !editLessonCode.trim()) return;

    const updatedLesson: Lesson = {
      ...lessonToEdit,
      grade: editLessonGrade,
      code: editLessonCode.trim(),
      title: editLessonTitle.trim(),
      topic: editLessonTopic.trim() || lessonToEdit.topic,
      yccd: editLessonYccd.trim() || lessonToEdit.yccd,
      keyConcepts: editLessonKeyConcepts
        .split(',')
        .map(k => k.trim())
        .filter(k => Boolean(k))
    };

    if (onUpdateLesson) {
      onUpdateLesson(updatedLesson);
    }
    setLessonToEdit(null);
    setActionNotice(`Đã cập nhật thành công bài học: "${updatedLesson.code}: ${updatedLesson.title}"`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  // Tạo mới một bài học
  const handleCreateNewLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLessonTitle.trim() || !editLessonCode.trim()) return;

    const newId = `b${editLessonGrade}-${Date.now().toString().slice(-5)}`;
    const newLesson: Lesson = {
      id: newId,
      grade: editLessonGrade,
      code: editLessonCode.trim(),
      title: editLessonTitle.trim(),
      topic: editLessonTopic.trim() || 'Chủ đề tự chọn',
      yccd: editLessonYccd.trim() || 'Yêu cầu cần đạt chuẩn kiến thức kỹ năng GDPT 2018.',
      keyConcepts: editLessonKeyConcepts
        .split(',')
        .map(k => k.trim())
        .filter(k => Boolean(k))
    };

    if (onAddLesson) {
      onAddLesson(newLesson);
    }
    setIsAddingLesson(false);
    setActionNotice(`Đã thêm mới bài học thành công: "${newLesson.code}: ${newLesson.title}"`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  // Xác nhận và xóa bài học
  const executeDeleteLesson = (lesson: Lesson) => {
    if (onDeleteLesson) {
      onDeleteLesson(lesson.id, lesson.grade);
    }
    setLessonToDelete(null);
    setActionNotice(`Đã xóa bài học: "${lesson.code}: ${lesson.title}" khỏi hệ thống`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  // Tính toán dữ liệu phân tích theo từng lớp
  const classAnalyticsMap: Record<string, any> = {};
  accessLogs.forEach(log => {
    const cName = (log.studentClass || 'Chưa phân lớp').trim();
    if (!classAnalyticsMap[cName]) {
      classAnalyticsMap[cName] = {
        className: cName,
        grade: log.grade,
        students: new Set<string>(),
        accessCount: 0,
        lessonCounts: {} as Record<string, number>,
        lastAccess: log.timestamp
      };
    }
    classAnalyticsMap[cName].accessCount += 1;
    classAnalyticsMap[cName].students.add(log.studentName);
    classAnalyticsMap[cName].lessonCounts[log.lessonName] = (classAnalyticsMap[cName].lessonCounts[log.lessonName] || 0) + 1;
  });

  const classList = Object.values(classAnalyticsMap).sort((a: any, b: any) => b.accessCount - a.accessCount);
  const uniqueClassNames = Array.from(new Set(accessLogs.map(l => (l.studentClass || 'Chưa phân lớp').trim()))).sort();

  // Đếm bài xem nhiều nhất
  const lessonCountsAll: Record<string, number> = {};
  accessLogs.forEach(l => {
    lessonCountsAll[l.lessonName] = (lessonCountsAll[l.lessonName] || 0) + 1;
  });
  let topLessonOverall = 'Chưa có dữ liệu';
  let maxViews = 0;
  for (const [les, count] of Object.entries(lessonCountsAll)) {
    if (count > maxViews) {
      maxViews = count;
      topLessonOverall = les;
    }
  }

  // Lọc nhật ký
  const filteredLogs = accessLogs.filter(l => {
    const searchLower = logSearch.toLowerCase().trim();
    const matchSearch =
      l.studentName.toLowerCase().includes(searchLower) ||
      l.studentClass.toLowerCase().includes(searchLower) ||
      l.lessonName.toLowerCase().includes(searchLower);
    const matchGrade = logGradeFilter === 'all' || l.grade.toString() === logGradeFilter;
    const matchClass = logClassFilter === 'all' || l.studentClass === logClassFilter;
    return matchSearch && matchGrade && matchClass;
  });

  // Lọc bảng học liệu hiển thị
  const filteredTableResources = resources.filter(r => {
    const matchGrade = tableGradeFilter === 'all' || r.grade.toString() === tableGradeFilter;
    const matchSubcat = tableSubcatFilter === 'all' || r.subcat === tableSubcatFilter;
    const matchSearch = !tableSearch.trim() || r.title.toLowerCase().includes(tableSearch.toLowerCase()) || r.lessonId.toLowerCase().includes(tableSearch.toLowerCase());
    return matchGrade && matchSubcat && matchSearch;
  });

  // Danh sách bài học theo khối lớp đang chọn trong Tab 1
  const lessonsInSyllabusGrade = allLessonsByGrade[syllabusGrade] || [];
  const filteredSyllabusLessons = lessonsInSyllabusGrade.filter(l => {
    if (!lessonSearch.trim()) return true;
    const q = lessonSearch.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.topic.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    if (accessLogs.length === 0) {
      setActionNotice('Chưa có dữ liệu nhật ký học sinh để xuất file!');
      setTimeout(() => setActionNotice(''), 3000);
      return;
    }

    let csv = '\uFEFF';
    csv += 'STT,Thời Gian,Họ Và Tên Học Sinh,Lớp Chi Đội,Khối Lớp,Bài Học Truy Cập,Hành Động,Tài Nguyên,Thiết Bị\n';
    accessLogs.forEach((log, index) => {
      csv += `${index + 1},"${log.timestamp}","${log.studentName}","${log.studentClass}","KHTN ${log.grade}","${log.lessonName}","${log.action}","${log.resourceTitle || ''}","${log.deviceType || 'Desktop'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nhat_ky_hoc_sinh_KHTN_Co_Duyen_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClearLogsConfirmed = async () => {
    try {
      await fetch('/api/admin/clear-logs', { method: 'POST' });
    } catch {}
    localStorage.removeItem('coduyen_access_logs_v3');
    setAccessLogs([]);
    setIsConfirmClearLogsOpen(false);
    setActionNotice('Đã xóa toàn bộ lịch sử truy cập học sinh thành công!');
    setTimeout(() => setActionNotice(''), 3000);
  };

  // Mở modal thêm bài học mới
  const openAddLessonModal = () => {
    setEditLessonGrade(syllabusGrade);
    setEditLessonCode(`Bài ${(lessonsInSyllabusGrade.length + 1)}`);
    setEditLessonTitle('');
    setEditLessonTopic('Chủ đề mới');
    setEditLessonYccd('');
    setEditLessonKeyConcepts('');
    setIsAddingLesson(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Thông báo thao tác thành công (Toast / Banner) */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-base"></i>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-white/80 hover:text-white p-1 cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <i className="fa-solid fa-shield-halved"></i> TRANG QUẢN TRỊ VIÊN CỦA CÔ DUYÊN
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản Trị Bài Học & Học Liệu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cô Duyên có toàn quyền <b className="text-amber-600">chỉnh sửa tùy biến</b> và <b className="text-rose-600">xóa bỏ</b> các bài học cũng như học liệu đã tạo trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSyncToServer}
            disabled={isSyncingToServer}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-700/20 disabled:opacity-50"
            title="Đồng bộ toàn bộ bài học và học liệu lên máy chủ để chia sẻ cho mọi người"
          >
            <i className={`fa-solid ${isSyncingToServer ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-xs`}></i>
            <span>{isSyncingToServer ? 'Đang đồng bộ...' : 'Đồng Bộ Lên Máy Chủ (Chia Sẻ Link)'}</span>
          </button>
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
            title="Đổi mật khẩu quản trị Cô Duyên"
          >
            <i className="fa-solid fa-key text-amber-600"></i>
            <span>Đổi Mật Khẩu</span>
          </button>
          <button
            onClick={onCloseAdmin}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-eye"></i>
            <span>Xem Giao Diện Học Sinh</span>
          </button>
          <button
            onClick={onAdminLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* 3 Tabs Chuyển đổi chính */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {/* TAB 1: SỬA & XÓA CÁC BÀI HỌC TRONG CHƯƠNG TRÌNH */}
        <button
          onClick={() => setAdminTab('lessons_list')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'lessons_list'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <i className="fa-solid fa-book-bookmark"></i>
          <span>Biên Tập & Tùy Chỉnh Các Bài Học</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-800 text-white font-extrabold">
            {lessonsInSyllabusGrade.length} bài
          </span>
        </button>

        {/* TAB 2: QUẢN LÝ HỌC LIỆU ĐÃ TẠO */}
        <button
          onClick={() => setAdminTab('resources')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'resources'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <i className="fa-solid fa-layer-group"></i>
          <span>Quản Lý Học Liệu Đã Tạo (3D, Sơ Đồ...)</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-800 text-white font-extrabold">
            {resources.length}
          </span>
        </button>

        {/* TAB 3: THỐNG KÊ LỚP HỌC */}
        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <i className="fa-solid fa-chart-pie text-emerald-600"></i>
          <span>Thống Kê Theo Lớp & Nhật Ký</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-900 font-extrabold">
            {accessLogs.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BIÊN TẬP, TÙY CHỈNH, SỬA & XÓA CÁC BÀI HỌC (LESSONS)  */}
      {/* ============================================================== */}
      {adminTab === 'lessons_list' && (
        <div className="space-y-5">
          {/* Thanh công cụ chọn khối lớp, tìm kiếm và nút Thêm bài học mới */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Khối lớp:</span>
              {([6, 7, 8, 9] as GradeNumber[]).map(g => (
                <button
                  key={g}
                  onClick={() => setSyllabusGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    syllabusGrade === g
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  KHTN {g} ({allLessonsByGrade[g]?.length || 0} bài)
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={lessonSearch}
                onChange={e => setLessonSearch(e.target.value)}
                placeholder="🔍 Tìm bài học theo tên, mã..."
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-48 sm:w-60"
              />
              <button
                onClick={openAddLessonModal}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Thêm bài mới</span>
              </button>
              {onResetSyllabus && (
                <button
                  onClick={() => setIsConfirmResetSyllabusOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition cursor-pointer shrink-0"
                  title="Khôi phục toàn bộ bài học gốc chuẩn SGK GDPT 2018"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i>
                  <span className="hidden md:inline">Khôi phục SGK</span>
                </button>
              )}
            </div>
          </div>

          {/* Bảng danh sách các bài học với ĐẦY ĐỦ NÚT SỬA VÀ NÚT XÓA BÊN CẠNH NHAU */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-emerald-600"></i>
                  <span>Danh Sách Các Bài Học KHTN {syllabusGrade}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Bấm <b className="text-amber-600">"Chỉnh sửa"</b> bên cạnh <b className="text-rose-600">"Xóa"</b> để tùy chỉnh tiêu đề, mã bài, chủ đề và yêu cầu cần đạt.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Hiển thị {filteredSyllabusLessons.length} bài
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-16">Mã bài</th>
                    <th className="py-3 px-3">Tên bài học</th>
                    <th className="py-3 px-3">Chủ đề</th>
                    <th className="py-3 px-3 hidden md:table-cell">Yêu cầu cần đạt</th>
                    <th className="py-3 px-3 text-center">Học liệu</th>
                    <th className="py-3 px-3 text-right">Thao tác quyền quản trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSyllabusLessons.map(lesson => {
                    const resCount = resources.filter(r => r.lessonId === lesson.id).length;

                    return (
                      <tr key={lesson.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-bold text-emerald-800 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            {lesson.code}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 max-w-[200px]">
                          <div className="line-clamp-2">{lesson.title}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium max-w-[160px]">
                          <span className="line-clamp-1">{lesson.topic}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 hidden md:table-cell max-w-[240px]">
                          <p className="line-clamp-2 text-[11px] leading-relaxed">{lesson.yccd}</p>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            resCount > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {resCount} mục
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* NÚT CHỈNH SỬA BÀI HỌC */}
                            <button
                              onClick={() => setLessonToEdit(lesson)}
                              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition inline-flex items-center gap-1.5 border border-amber-200 cursor-pointer shadow-2xs"
                              title="Chỉnh sửa tùy biến tên bài, mã bài, yêu cầu cần đạt"
                            >
                              <i className="fa-solid fa-pen-to-square text-amber-600"></i>
                              <span>Chỉnh sửa</span>
                            </button>

                            {/* NÚT XÓA BÀI HỌC ĐẶT NGAY BÊN CẠNH */}
                            <button
                              onClick={() => setLessonToDelete(lesson)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition inline-flex items-center gap-1.5 border border-rose-200 cursor-pointer shadow-2xs"
                              title="Xóa bài học này khỏi chương trình"
                            >
                              <i className="fa-solid fa-trash-can text-rose-600"></i>
                              <span>Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredSyllabusLessons.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-400">
                  Không tìm thấy bài học nào phù hợp với từ khóa tìm kiếm.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: QUẢN LÝ, THÊM, SỬA & XÓA HỌC LIỆU ĐÃ TẠO (RESOURCES)    */}
      {/* ============================================================== */}
      {adminTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Cột trái: Form Thêm học liệu */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-circle-plus text-emerald-600"></i>
              <span>Thêm Học Liệu Mới Cho Bài Học</span>
            </h3>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  1. Khối lớp (KHTN):
                </label>
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(Number(e.target.value) as GradeNumber)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value={6}>KHTN 6</option>
                  <option value={7}>KHTN 7</option>
                  <option value={8}>KHTN 8</option>
                  <option value={9}>KHTN 9</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    2. Chọn bài học thuộc khối:
                  </label>
                  {(() => {
                    const lessons = allLessonsByGrade[selectedGrade] || [];
                    const cIdx = lessons.findIndex(l => l.id === selectedLessonId);
                    const nextLesson = cIdx >= 0 && cIdx < lessons.length - 1 ? lessons[cIdx + 1] : null;
                    if (!nextLesson) return null;
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(nextLesson.id)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition"
                        title={`Chuyển sang bài tiếp theo: ${nextLesson.code}`}
                      >
                        <span>Bài tiếp: {nextLesson.code}</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    );
                  })()}
                </div>
                <select
                  value={selectedLessonId}
                  onChange={e => setSelectedLessonId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white max-h-48"
                >
                  {(allLessonsByGrade[selectedGrade] || []).map(l => (
                    <option key={l.id} value={l.id}>
                      {l.code}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  3. Phân bổ vào mục con:
                </label>
                <select
                  value={subcat}
                  onChange={e => setSubcat(e.target.value as SubCategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="model3d">🧊 Mô hình / Hình ảnh 3D tương tác</option>
                  <option value="mindmap">🧠 Sơ đồ tư duy (Mindmap)</option>
                  <option value="exercise">📝 Phiếu bài tập & Trắc nghiệm</option>
                  <option value="virtual_lab">🔬 Thí nghiệm ảo trực quan</option>
                  <option value="game">🎮 Trò chơi sinh học củng cố</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tiêu đề học liệu:
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={e => setResTitle(e.target.value)}
                  placeholder="VD: Mô hình 3D giải phẫu tim người"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mô tả hoặc hướng dẫn học sinh:
                </label>
                <textarea
                  rows={2}
                  value={resDesc}
                  onChange={e => setResDesc(e.target.value)}
                  placeholder="Ghi chú khái niệm cốt lõi, cách tương tác..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  <i className="fa-solid fa-link text-emerald-600"></i> Thêm liên kết web (3D Sketchfab, PhET, Wordwall...):
                </label>
                <input
                  type="url"
                  value={resLink}
                  onChange={e => setResLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* ĐÍNH KÈM TỆP VÀO MỤC CON - TỰ ĐỘNG ĐỂ TRỐNG KHI LƯU HOẶC CHUYỂN BÀI TIẾP THEO */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    <i className="fa-solid fa-paperclip text-emerald-600 mr-1.5"></i>
                    Đính kèm tệp cho mục này (PDF, Word, Ảnh...):
                  </label>
                  {resFileName ? (
                    <button
                      type="button"
                      onClick={clearAttachedFile}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Bỏ chọn tệp đính kèm này, để trống"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      <span>Bỏ chọn tệp</span>
                    </button>
                  ) : null}
                </div>

                <input
                  key={fileInputKey}
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />

                {/* Trạng thái tệp đính kèm */}
                {resFileName ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 truncate">
                      <i className="fa-solid fa-file-circle-check text-emerald-600 text-base shrink-0"></i>
                      <div className="truncate">
                        <span className="font-bold truncate block">{resFileName}</span>
                        <span className="text-[10px] text-emerald-600">Đã chọn đính kèm cho bài này</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearAttachedFile}
                      className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] shrink-0 ml-2 cursor-pointer shadow-2xs"
                    >
                      Xóa tệp
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-1">
                    <i className="fa-regular fa-circle-dot text-slate-400 text-[10px]"></i>
                    <span>Chưa chọn tệp (đang để trống). Khi bấm Lưu hoặc chọn bài tiếp theo, phần này luôn để trống sạch sẽ.</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>Lưu Học Liệu Vào Bài Học</span>
              </button>
            </form>
          </div>

          {/* Cột phải: Bảng danh sách học liệu kèm đầy đủ nút SỬA và XÓA */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-emerald-600"></i>
                  <span>Tất Cả Học Liệu Đã Tạo Trong Hệ Thống</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Bấm nút <span className="text-amber-700 font-bold">"Sửa"</span> bên cạnh nút <span className="text-rose-600 font-bold">"Xóa"</span> để tùy chỉnh học liệu
                </p>
              </div>
              <span className="text-xs bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-600 self-start sm:self-center">
                {filteredTableResources.length} / {resources.length} mục
              </span>
            </div>

            {/* Thanh lọc học liệu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div>
                <select
                  value={tableGradeFilter}
                  onChange={e => setTableGradeFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="all">Tất cả khối lớp</option>
                  <option value="6">KHTN 6</option>
                  <option value="7">KHTN 7</option>
                  <option value="8">KHTN 8</option>
                  <option value="9">KHTN 9</option>
                </select>
              </div>
              <div>
                <select
                  value={tableSubcatFilter}
                  onChange={e => setTableSubcatFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="all">Tất cả mục con</option>
                  <option value="model3d">🧊 Mô hình 3D</option>
                  <option value="mindmap">🧠 Sơ đồ tư duy</option>
                  <option value="exercise">📝 Phiếu bài tập</option>
                  <option value="virtual_lab">🔬 Thí nghiệm ảo</option>
                  <option value="game">🎮 Trò chơi</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  placeholder="🔍 Tìm tiêu đề học liệu..."
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Lớp & Bài</th>
                    <th className="py-3 px-3">Phân loại</th>
                    <th className="py-3 px-3">Tiêu đề học liệu</th>
                    <th className="py-3 px-3">Tài nguyên</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTableResources.map(item => {
                    const gradeLessons = allLessonsByGrade[item.grade] || [];
                    const lessonObj = gradeLessons.find(l => l.id === item.lessonId);
                    const lessonCode = lessonObj ? lessonObj.code : item.lessonId;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-600">
                            KHTN {item.grade}
                          </span>
                          <div className="truncate max-w-[130px] text-[11px] mt-0.5 text-emerald-800 font-bold">
                            {lessonCode}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-semibold text-slate-700">
                            {item.subcat}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800 max-w-[170px]" title={item.title}>
                          <div className="line-clamp-2">{item.title}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5 text-[11px]">
                            {item.link ? (
                              <a href={item.link} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                                <i className="fa-solid fa-link text-[10px]"></i> Link web
                              </a>
                            ) : null}
                            {item.fileName ? (
                              <span className="text-slate-400 truncate max-w-[100px] flex items-center gap-1">
                                <i className="fa-solid fa-file text-[10px]"></i> {item.fileName}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* NÚT SỬA HỌC LIỆU */}
                            <button
                              onClick={() => setItemToEdit(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer border border-amber-200/80"
                              title="Chỉnh sửa nội dung học liệu này"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                              <span>Sửa</span>
                            </button>

                            {/* NÚT XÓA HỌC LIỆU ĐẶT NGAY BÊN CẠNH */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer border border-rose-200/60"
                              title="Xóa vĩnh viễn học liệu này"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                              <span>Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredTableResources.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  Không tìm thấy học liệu nào phù hợp với bộ lọc.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: THỐNG KÊ LỚP HỌC & NHẬT KÝ CHI TIẾT                     */}
      {/* ============================================================== */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* 4 Cards thống kê tổng quan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tổng tương tác</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800">{accessLogs.length}</div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-id-card-clip"></i>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số học sinh</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800">
                  {new Set(accessLogs.map(l => `${l.studentName}__${l.studentClass}`)).size}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số lớp học</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800">{classList.length}</div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-fire"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bài xem nhiều nhất</div>
                <div className="text-xs font-black text-slate-800 truncate" title={topLessonOverall}>
                  {topLessonOverall}
                </div>
              </div>
            </div>
          </div>

          {/* Bảng thẻ thống kê theo từng lớp học */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-chart-column text-emerald-600"></i>
                  <span>Bảng Thống Kê Hoạt Động Theo Từng Lớp Học</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tổng hợp sĩ số tham gia và bài học quan tâm nhất của từng chi đội / lớp
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Đang có {classList.length} lớp
              </span>
            </div>

            {classList.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                  <i className="fa-solid fa-chalkboard-user text-xl"></i>
                </div>
                <div className="font-bold text-slate-700 text-sm">Chưa có dữ liệu lớp học</div>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Hệ thống để trống và chỉ ghi nhận khi có học sinh thực tế nhập tên vào học bài. Không tự ý thêm học sinh ảo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classList.map((c: any) => {
                  let topL = 'Chưa xác định';
                  let maxC = 0;
                  for (const [les, count] of Object.entries(c.lessonCounts as Record<string, number>)) {
                    if (count > maxC) {
                      maxC = count;
                      topL = les;
                    }
                  }
                  const percent = Math.min(100, Math.round((c.accessCount / (accessLogs.length || 1)) * 100));

                  return (
                    <div
                      key={c.className}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-sm text-slate-800">
                            Lớp: {c.className}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {c.students.size} học sinh
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mb-2">
                          Bài xem nhiều nhất: <b className="text-slate-700">{topL}</b>
                        </div>

                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{c.accessCount} lượt truy cập</span>
                        <button
                          onClick={() => {
                            setLogClassFilter(c.className);
                            const el = document.getElementById('access-logs-table');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          Lọc nhật ký lớp này &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chi tiết nhật ký truy cập */}
          <div id="access-logs-table" className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-clipboard-list text-emerald-600"></i>
                  <span>Nhật Ký Học Sinh Thời Gian Thực</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ghi lại chính xác học sinh nào, lớp nào đã học bài nào trên máy tính hay điện thoại
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLogs}
                  disabled={isRefreshingLogs}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Cập nhật lượt học sinh thực tế mới nhất từ hệ thống"
                >
                  <i className={`fa-solid fa-arrows-rotate ${isRefreshingLogs ? 'fa-spin text-emerald-600' : 'text-slate-600'}`}></i>
                  <span>{isRefreshingLogs ? 'Đang tải...' : 'Làm Mới'}</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-file-excel"></i>
                  <span>Xuất Tệp Excel (CSV)</span>
                </button>
                <button
                  onClick={() => setIsConfirmClearLogsOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span>Xóa Nhật Ký</span>
                </button>
              </div>
            </div>

            {/* Bộ lọc nhật ký */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  placeholder="🔍 Tìm theo tên học sinh, lớp, bài học..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={logGradeFilter}
                  onChange={e => setLogGradeFilter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">Tất cả khối lớp</option>
                  <option value="6">KHTN 6</option>
                  <option value="7">KHTN 7</option>
                  <option value="8">KHTN 8</option>
                  <option value="9">KHTN 9</option>
                </select>
              </div>
              <div>
                <select
                  value={logClassFilter}
                  onChange={e => setLogClassFilter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50/50 font-bold text-emerald-800"
                >
                  <option value="all">Tất cả các lớp</option>
                  {uniqueClassNames.map(c => (
                    <option key={c} value={c}>
                      Lớp: {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Hiển thị {filteredLogs.length} / {accessLogs.length} dòng nhật ký</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3">Học sinh</th>
                    <th className="py-2.5 px-3">Lớp</th>
                    <th className="py-2.5 px-3">Khối</th>
                    <th className="py-2.5 px-3">Bài học đã xem</th>
                    <th className="py-2.5 px-3">Hành động</th>
                    <th className="py-2.5 px-3">Thiết bị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mb-3">
                            <i className="fa-solid fa-clipboard-user"></i>
                          </div>
                          <p className="font-bold text-slate-700 text-sm">Chưa có lượt học sinh nào truy cập thực tế</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                            Nhật ký học sinh được để trống hoàn toàn và sẽ tự động ghi nhận chính xác khi có học sinh thực tế vào học bài.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {log.studentName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                            {log.studentClass}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">
                          Lớp {log.grade}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 max-w-[200px] truncate" title={log.lessonName}>
                          {log.lessonName}
                        </td>
                        <td className="py-2.5 px-3 text-xs">
                          <span className="font-semibold text-emerald-700">{log.action}</span>
                          {log.resourceTitle && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{log.resourceTitle}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {log.deviceType || 'Desktop'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: CHỈNH SỬA TÙY BIẾN BÀI HỌC (LESSON EDIT MODAL)         */}
      {/* ============================================================== */}
      {lessonToEdit && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setLessonToEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Quyền Quản Trị Viên Cô Duyên
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Chỉnh Sửa Tùy Biến Bài Học
                </h3>
              </div>
            </div>

            <form onSubmit={handleSaveEditLesson} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Khối lớp:
                  </label>
                  <select
                    value={editLessonGrade}
                    onChange={e => setEditLessonGrade(Number(e.target.value) as GradeNumber)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value={6}>KHTN 6</option>
                    <option value={7}>KHTN 7</option>
                    <option value={8}>KHTN 8</option>
                    <option value={9}>KHTN 9</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Mã bài học (VD: Bài 17):
                  </label>
                  <input
                    type="text"
                    required
                    value={editLessonCode}
                    onChange={e => setEditLessonCode(e.target.value)}
                    placeholder="VD: Bài 17"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Tên bài học:
                </label>
                <input
                  type="text"
                  required
                  value={editLessonTitle}
                  onChange={e => setEditLessonTitle(e.target.value)}
                  placeholder="VD: Tế bào – Đơn vị cơ sở của sự sống"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Chủ đề bài học:
                </label>
                <input
                  type="text"
                  required
                  value={editLessonTopic}
                  onChange={e => setEditLessonTopic(e.target.value)}
                  placeholder="VD: Tế bào – Đơn vị cơ sở của sự sống"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Yêu cầu cần đạt chuẩn SGK GDPT 2018:
                </label>
                <textarea
                  rows={3}
                  value={editLessonYccd}
                  onChange={e => setEditLessonYccd(e.target.value)}
                  placeholder="Nêu được khái niệm, phân biệt được..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Khái niệm cốt lõi (cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={editLessonKeyConcepts}
                  onChange={e => setEditLessonKeyConcepts(e.target.value)}
                  placeholder="VD: Màng sinh chất, Tế bào chất, Nhân tế bào"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setLessonToEdit(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Lưu Thay Đổi Bài Học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: THÊM BÀI HỌC MỚI VÀO CHƯƠNG TRÌNH                     */}
      {/* ============================================================== */}
      {isAddingLesson && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setIsAddingLesson(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                <i className="fa-solid fa-circle-plus"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Thêm mới vào chương trình
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Thêm Bài Học Mới
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateNewLesson} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Khối lớp:
                  </label>
                  <select
                    value={editLessonGrade}
                    onChange={e => setEditLessonGrade(Number(e.target.value) as GradeNumber)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={6}>KHTN 6</option>
                    <option value={7}>KHTN 7</option>
                    <option value={8}>KHTN 8</option>
                    <option value={9}>KHTN 9</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Mã bài (VD: Bài 35):
                  </label>
                  <input
                    type="text"
                    required
                    value={editLessonCode}
                    onChange={e => setEditLessonCode(e.target.value)}
                    placeholder="VD: Bài 35"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Tên bài học:
                </label>
                <input
                  type="text"
                  required
                  value={editLessonTitle}
                  onChange={e => setEditLessonTitle(e.target.value)}
                  placeholder="Nhập tên bài học..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Chủ đề bài học:
                </label>
                <input
                  type="text"
                  required
                  value={editLessonTopic}
                  onChange={e => setEditLessonTopic(e.target.value)}
                  placeholder="VD: Cơ thể người & Đa dạng sinh học"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Yêu cầu cần đạt chuẩn SGK GDPT 2018:
                </label>
                <textarea
                  rows={3}
                  value={editLessonYccd}
                  onChange={e => setEditLessonYccd(e.target.value)}
                  placeholder="Mô tả các yêu cầu cần đạt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Khái niệm cốt lõi (cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={editLessonKeyConcepts}
                  onChange={e => setEditLessonKeyConcepts(e.target.value)}
                  placeholder="VD: Khái niệm 1, Khái niệm 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Tạo Bài Học Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: XÁC NHẬN XÓA BÀI HỌC (LESSON DELETE MODAL)             */}
      {/* ============================================================== */}
      {lessonToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 text-center mb-1">
              Xác Nhận Xóa Bài Học
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Cô Duyên có toàn quyền xóa bài học này khỏi chương trình KHTN {lessonToDelete.grade}:
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs mb-5 space-y-1">
              <div className="font-bold text-slate-900">{lessonToDelete.code}: {lessonToDelete.title}</div>
              <div className="text-slate-500">Chủ đề: <b>{lessonToDelete.topic}</b></div>
              <div className="text-slate-500">Thuộc: <b>KHTN {lessonToDelete.grade}</b></div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLessonToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => executeDeleteLesson(lessonToDelete)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác Nhận Xóa Bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: CHỈNH SỬA HỌC LIỆU DÀNH CHO CÔ DUYÊN                   */}
      {/* ============================================================== */}
      {itemToEdit && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setItemToEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Quyền Quản Trị Viên
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Chỉnh Sửa Học Liệu
                </h3>
              </div>
            </div>

            <form onSubmit={handleSaveEditResource} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Khối lớp:
                  </label>
                  <select
                    value={editGrade}
                    onChange={e => setEditGrade(Number(e.target.value) as GradeNumber)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value={6}>KHTN 6</option>
                    <option value={7}>KHTN 7</option>
                    <option value={8}>KHTN 8</option>
                    <option value={9}>KHTN 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Phân loại mục con:
                  </label>
                  <select
                    value={editSubcat}
                    onChange={e => setEditSubcat(e.target.value as SubCategoryType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="model3d">🧊 Mô hình 3D</option>
                    <option value="mindmap">🧠 Sơ đồ tư duy</option>
                    <option value="exercise">📝 Phiếu bài tập</option>
                    <option value="virtual_lab">🔬 Thí nghiệm ảo</option>
                    <option value="game">🎮 Trò chơi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Bài học thuộc khối:
                </label>
                <select
                  value={editLessonId}
                  onChange={e => setEditLessonId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {(allLessonsByGrade[editGrade] || []).map(l => (
                    <option key={l.id} value={l.id}>
                      {l.code}: {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Tiêu đề học liệu:
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Mô tả / Hướng dẫn học sinh:
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Liên kết web (Link 3D / Thí nghiệm / Bài tập):
                </label>
                <input
                  type="url"
                  value={editLink}
                  onChange={e => setEditLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase text-slate-700">
                    <i className="fa-solid fa-paperclip text-amber-600 mr-1"></i> Tệp đính kèm:
                  </label>
                  {editFileName ? (
                    <button
                      type="button"
                      onClick={clearEditAttachedFile}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Xóa tệp đính kèm, để trống"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      <span>Xóa tệp (để trống)</span>
                    </button>
                  ) : null}
                </div>

                <input
                  key={editFileInputKey}
                  ref={editFileInputRef}
                  type="file"
                  onChange={handleEditFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer"
                />

                {editFileName ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="flex items-center gap-2 truncate">
                      <i className="fa-solid fa-file-circle-check text-amber-700 text-sm shrink-0"></i>
                      <span className="font-bold truncate text-[11px]">{editFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearEditAttachedFile}
                      className="px-2 py-0.5 rounded bg-white text-rose-600 font-bold text-[10px] border border-rose-200 hover:bg-rose-50 ml-2 shrink-0 cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Chưa có tệp đính kèm nào (đang để trống).
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setItemToEdit(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: XÁC NHẬN XÓA HỌC LIỆU TRONG UI (KHÔNG DÙNG ALERT)     */}
      {/* ============================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 text-center mb-1">
              Xác Nhận Xóa Học Liệu
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Cô Duyên có chắc chắn muốn xóa vĩnh viễn học liệu này khỏi hệ thống không?
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs mb-5 space-y-1">
              <div className="font-bold text-slate-800">{itemToDelete.title}</div>
              <div className="text-slate-500">Thuộc: <b>KHTN {itemToDelete.grade} &bull; {itemToDelete.lessonId}</b></div>
              <div className="text-slate-500">Mục: <b>{itemToDelete.subcat}</b></div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => executeDeleteResource(itemToDelete)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: XÁC NHẬN KHÔI PHỤC CHƯƠNG TRÌNH GỐC                    */}
      {/* ============================================================== */}
      {isConfirmResetSyllabusOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-rotate-left"></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 text-center mb-1">
              Khôi Phục Chương Trình Gốc
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
              Thao tác này sẽ đưa toàn bộ danh mục bài học các khối 6, 7, 8, 9 về chuẩn SGK GDPT 2018 ban đầu.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConfirmResetSyllabusOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  if (onResetSyllabus) onResetSyllabus();
                  setIsConfirmResetSyllabusOpen(false);
                  setActionNotice('Đã khôi phục toàn bộ bài học về mặc định SGK GDPT 2018!');
                  setTimeout(() => setActionNotice(''), 3000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md shadow-amber-600/20 cursor-pointer"
              >
                Đồng Ý Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: XÁC NHẬN XÓA NHẬT KÝ                                  */}
      {/* ============================================================== */}
      {isConfirmClearLogsOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 text-center mb-1">
              Xác Nhận Xóa Toàn Bộ Nhật Ký
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
              Thao tác này sẽ xóa sạch toàn bộ lịch sử truy cập của học sinh. Dữ liệu này không thể khôi phục.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConfirmClearLogsOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleClearLogsConfirmed}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Đồng Ý Xóa Sạch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết một lớp học */}
      {selectedClassDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedClassDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Báo cáo chuyên sâu
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Chi Tiết Lớp: {selectedClassDetail.className} (KHTN {selectedClassDetail.grade})
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto space-y-4 flex-grow pr-1">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Sĩ số tham gia</span>
                  <span className="text-xl font-black text-slate-800">{selectedClassDetail.students.size} em</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Tổng tương tác</span>
                  <span className="text-xl font-black text-emerald-600">{selectedClassDetail.accessCount} lượt</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">
                  Danh sách học sinh trong lớp:
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  {Array.from(selectedClassDetail.students).map((sName: any, idx: number) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white hover:bg-slate-50">
                      <span className="font-bold text-slate-800">{idx + 1}. {sName}</span>
                      <span className="text-slate-400 text-[11px]">Đã học bài</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐỔI MẬT KHẨU DÀNH CHO ADMIN */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={() => {
          setActionNotice('Đã cập nhật mật khẩu quản trị Cô Duyên thành công!');
          setTimeout(() => setActionNotice(''), 3500);
        }}
      />

    </div>
  );
};
