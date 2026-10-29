import React, { useState, useEffect } from 'react';
import { Lesson, ResourceItem, SubCategoryType, GradeNumber } from '../types';

interface LessonDetailProps {
  lesson: Lesson;
  resources: ResourceItem[];
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  noteText: string;
  onSaveNote: (note: string) => void;
  onLogResourceAccess: (action: string, title?: string) => void;
  onOpenAdminToAdd: (lessonId: string, grade: any, subcat: SubCategoryType) => void;
  isAdmin?: boolean;
  onDeleteResource?: (id: string) => void;
  onUpdateResource?: (updatedRes: ResourceItem) => void;
  onUpdateLesson?: (updatedLesson: Lesson) => void;
  onAddResource?: (newRes: ResourceItem) => void;
  prevLesson?: Lesson | null;
  nextLesson?: Lesson | null;
  onSelectLesson?: (lessonId: string) => void;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  resources,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  noteText,
  onSaveNote,
  onLogResourceAccess,
  onOpenAdminToAdd,
  isAdmin,
  onDeleteResource,
  onUpdateResource,
  onUpdateLesson,
  onAddResource,
  prevLesson,
  nextLesson,
  onSelectLesson
}) => {
  const [activeSubcat, setActiveSubcat] = useState<SubCategoryType>('all');
  const [localNote, setLocalNote] = useState(noteText);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ResourceItem | null>(null);

  // State thêm mới học liệu trực tiếp trên trang bài học
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [addSubcat, setAddSubcat] = useState<SubCategoryType>('model3d');
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addLink, setAddLink] = useState('');
  const [addFileName, setAddFileName] = useState('');
  const [addFileData, setAddFileData] = useState<string | null>(null);
  const addFileInputRef = React.useRef<HTMLInputElement>(null);
  const [addFileInputKey, setAddFileInputKey] = useState<number>(0);

  const clearAddFile = () => {
    setAddFileName('');
    setAddFileData(null);
    if (addFileInputRef.current) addFileInputRef.current.value = '';
    setAddFileInputKey(k => k + 1);
  };

  const handleAddFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddFileName(file.name);
    if (file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAddFileData(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // State chỉnh sửa trực tiếp trên trang bài học
  const [itemToEdit, setItemToEdit] = useState<ResourceItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editSubcat, setEditSubcat] = useState<SubCategoryType>('model3d');
  const [editFileName, setEditFileName] = useState('');
  const [editFileData, setEditFileData] = useState<string | null>(null);
  const editFileInputRef = React.useRef<HTMLInputElement>(null);
  const [editFileInputKey, setEditFileInputKey] = useState<number>(0);

  const clearEditFile = () => {
    setEditFileName('');
    setEditFileData(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setEditFileInputKey(k => k + 1);
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

  // State chỉnh sửa chính bài học này (dành cho Admin)
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editLessonCode, setEditLessonCode] = useState(lesson.code);
  const [editLessonTitle, setEditLessonTitle] = useState(lesson.title);
  const [editLessonTopic, setEditLessonTopic] = useState(lesson.topic);
  const [editLessonYccd, setEditLessonYccd] = useState(lesson.yccd);
  const [editLessonConcepts, setEditLessonConcepts] = useState((lesson.keyConcepts || []).join(', '));

  // KHI CHỌN BÀI TIẾP THEO HOẶC CHUYỂN BÀI HỌC:
  // PHẢI ĐỂ TRỐNG HOÀN TOÀN PHẦN THÊM FILE ĐÍNH KÈM, KHÔNG ĐỂ LẠI FILE BAN ĐẦU
  useEffect(() => {
    setLocalNote(noteText);
    setIsNoteSaved(false);
    clearAddFile();
    setAddTitle('');
    setAddDesc('');
    setAddLink('');
    setIsAddingResource(false);
    clearEditFile();
    setItemToEdit(null);
  }, [lesson.id, noteText]);

  useEffect(() => {
    if (itemToEdit) {
      setEditTitle(itemToEdit.title);
      setEditDesc(itemToEdit.desc || '');
      setEditLink(itemToEdit.link || '');
      setEditSubcat(itemToEdit.subcat);
      setEditFileName(itemToEdit.fileName || '');
      setEditFileData(itemToEdit.fileData || null);
    } else {
      clearEditFile();
    }
  }, [itemToEdit]);

  const handleNoteBlur = () => {
    onSaveNote(localNote);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  // Xử lý Thêm học liệu mới trực tiếp tại bài học
  const handleSaveNewResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim() || !onAddResource) return;

    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      grade: lesson.grade,
      lessonId: lesson.id,
      subcat: addSubcat,
      title: addTitle.trim(),
      desc: addDesc.trim(),
      link: addLink.trim() || undefined,
      fileName: addFileName.trim() || undefined,
      fileData: addFileData,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddResource(newRes);

    // Xóa sạch toàn bộ phần tệp đính kèm ngay sau khi bấm lưu
    clearAddFile();
    setAddTitle('');
    setAddDesc('');
    setAddLink('');
    setIsAddingResource(false);
  };

  const handleSaveDirectEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit || !editTitle.trim() || !onUpdateResource) return;

    const updated: ResourceItem = {
      ...itemToEdit,
      title: editTitle.trim(),
      desc: editDesc.trim(),
      link: editLink.trim() || undefined,
      subcat: editSubcat,
      fileName: editFileName.trim() || undefined,
      fileData: editFileData
    };

    onUpdateResource(updated);
    clearEditFile();
    setItemToEdit(null);
  };

  const getSubcatBadge = (subcat: SubCategoryType) => {
    switch (subcat) {
      case 'model3d':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"><i className="fa-solid fa-cube text-indigo-600"></i> Mô hình 3D</span>;
      case 'mindmap':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"><i className="fa-solid fa-brain text-purple-600"></i> Sơ đồ tư duy</span>;
      case 'exercise':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><i className="fa-solid fa-file-pen text-amber-600"></i> Phiếu bài tập</span>;
      case 'virtual_lab':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200"><i className="fa-solid fa-flask text-cyan-600"></i> Thí nghiệm ảo</span>;
      case 'game':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200"><i className="fa-solid fa-gamepad text-pink-600"></i> Trò chơi</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Tài liệu</span>;
    }
  };

  // Lọc học liệu theo bài học đang chọn và phân loại mục con
  const filteredResources = resources.filter(r => {
    const matchLesson = r.lessonId === lesson.id;
    const matchSubcat = activeSubcat === 'all' || r.subcat === activeSubcat;
    return matchLesson && matchSubcat;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header Bài học đang chọn */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              KHTN {lesson.grade} &bull; {lesson.code}
            </span>
            <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
              {lesson.topic}
            </span>
          </div>

          {/* Các nút hành động: Đánh dấu đã học, Bookmark & Nút thêm nhanh cho giáo viên */}
          <div className="flex items-center gap-2">
            {/* Nhóm công cụ Quản trị viên chỉ hiện khi Admin đăng nhập */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setEditLessonCode(lesson.code);
                    setEditLessonTitle(lesson.title);
                    setEditLessonTopic(lesson.topic);
                    setEditLessonYccd(lesson.yccd);
                    setEditLessonConcepts((lesson.keyConcepts || []).join(', '));
                    setIsEditingLesson(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition flex items-center gap-1.5 border border-amber-200 cursor-pointer"
                  title="Chỉnh sửa thông tin bài học này"
                >
                  <i className="fa-solid fa-pen-to-square text-amber-600"></i>
                  <span className="hidden sm:inline">Sửa bài học</span>
                </button>

                <button
                  onClick={() => {
                    setAddSubcat(activeSubcat === 'all' ? 'model3d' : activeSubcat);
                    clearAddFile();
                    setIsAddingResource(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
                  title="Thêm học liệu và đính kèm tệp vào bài học này"
                >
                  <i className="fa-solid fa-circle-plus text-emerald-600"></i>
                  <span className="hidden sm:inline">Thêm học liệu</span>
                </button>
              </>
            )}

            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title={isBookmarked ? 'Bỏ lưu bài học' : 'Lưu bài học vào mục yêu thích'}
            >
              <i className={`fa-bookmark ${isBookmarked ? 'fa-solid text-amber-600' : 'fa-regular'}`}></i>
              <span className="hidden sm:inline">{isBookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
            </button>

            <button
              onClick={onToggleComplete}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800'
              }`}
            >
              <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'}`}></i>
              <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
            </button>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 tracking-tight">
          {lesson.code}: {lesson.title}
        </h3>

        {/* Khung Yêu Cầu Cần Đạt chuẩn Bộ GD&ĐT */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          <span className="font-extrabold text-emerald-800 block mb-1">
            <i className="fa-solid fa-bullseye mr-1.5 text-emerald-600"></i>
            Yêu cầu cần đạt chuẩn SGK GDPT 2018:
          </span>
          <p>{lesson.yccd}</p>
        </div>

        {/* Các khái niệm cốt lõi */}
        {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Khái niệm:</span>
            {lesson.keyConcepts.map((kc, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-100"
              >
                {kc}
              </span>
            ))}
          </div>
        )}

        {/* Khung Ghi Chú Cá Nhân Của Học Sinh */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <i className="fa-regular fa-note-sticky text-amber-500"></i>
              <span>Sổ tay ghi chú cá nhân của em cho bài học này:</span>
            </label>
            {isNoteSaved && (
              <span className="text-[11px] font-bold text-emerald-600">
                <i className="fa-solid fa-check mr-1"></i>Đã tự động lưu
              </span>
            )}
          </div>
          <textarea
            rows={2}
            value={localNote}
            onChange={e => setLocalNote(e.target.value)}
            onBlur={handleNoteBlur}
            placeholder="Ghi chú kiến thức trọng tâm, câu hỏi cần hỏi Cô Duyên... (tự động đồng bộ trên mọi thiết bị)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Thanh Tabs Bộ Lọc Phân Mục Con Của Bài Học */}
        <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả mục con' },
            { id: 'model3d', label: '🧊 Mô hình 3D' },
            { id: 'mindmap', label: '🧠 Sơ đồ tư duy' },
            { id: 'exercise', label: '📝 Phiếu bài tập' },
            { id: 'virtual_lab', label: '🔬 Thí nghiệm ảo' },
            { id: 'game', label: '🎮 Trò chơi' }
          ].map(tab => {
            const isActive = activeSubcat === tab.id;
            const count = resources.filter(r => r.lessonId === lesson.id && (tab.id === 'all' || r.subcat === tab.id)).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubcat(tab.id as SubCategoryType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HIỂN THỊ CÁC HỌC LIỆU TRONG MỤC ĐANG CHỌN */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredResources.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  {getSubcatBadge(item.subcat)}

                  {/* Nhóm nút SỬA và XÓA dành cho Admin ngay tại trang bài học */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      {/* NÚT SỬA */}
                      <button
                        onClick={() => setItemToEdit(item)}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] transition flex items-center gap-1 border border-amber-200/80 cursor-pointer"
                        title="Chỉnh sửa học liệu này"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>Sửa</span>
                      </button>

                      {/* NÚT XÓA */}
                      {onDeleteResource && (
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition flex items-center gap-1 border border-rose-200/80 cursor-pointer"
                          title="Cô Duyên có thể xóa học liệu này"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {item.title}
                </h5>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {item.desc || 'Học liệu phục vụ kiến thức trọng tâm của bài học.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onLogResourceAccess('Mở liên kết web', item.title)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Mở liên kết học tập / 3D / Thí nghiệm</span>
                  </a>
                )}

                {item.fileName && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <div className="flex items-center gap-2 truncate text-slate-600">
                      <i className="fa-solid fa-paperclip text-emerald-600"></i>
                      <span className="truncate font-medium">{item.fileName}</span>
                    </div>
                    <button
                      onClick={() => {
                        onLogResourceAccess('Tải tệp đính kèm', item.fileName);
                        if (item.fileData) {
                          const a = document.createElement('a');
                          a.href = item.fileData;
                          a.download = item.fileName || 'tai-lieu.pdf';
                          a.click();
                        } else {
                          alert(`Đã sẵn sàng tải tệp: ${item.fileName}`);
                        }
                      }}
                      className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                    >
                      Tải về
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TRẠNG THÁI TRỐNG: PHÂN BIỆT RÕ HỌC SINH VÀ QUẢN TRỊ VIÊN */
        isAdmin ? (
          /* Dành cho Quản trị viên Cô Duyên */
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-amber-200 bg-amber-50/20">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-inner">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Chưa có tài nguyên nào trong mục này
            </h4>
            <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">
              Cô Duyên có thể thêm link mô hình 3D, sơ đồ tư duy, phiếu bài tập, thí nghiệm ảo hoặc tệp tải về cho bài học này nhé!
            </p>

            <button
              onClick={() => {
                setAddSubcat(activeSubcat === 'all' ? 'model3d' : activeSubcat);
                clearAddFile();
                setIsAddingResource(true);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md shadow-emerald-700/20 transition inline-flex items-center gap-2 text-xs cursor-pointer"
            >
              <i className="fa-solid fa-circle-plus"></i>
              <span>Thêm Mới Vào Mục Này</span>
            </button>
          </div>
        ) : (
          /* Dành cho Học sinh: Hoàn toàn không hiện bảng quản trị hay nút thêm của admin */
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Chưa có học liệu trong mục này
            </h4>
            <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
              Nội dung đang được cập nhật. Em hãy tham khảo các mục học liệu khác hoặc sách giáo khoa nhé!
            </p>
          </div>
        )
      )}

      {/* THANH ĐIỀU HƯỚNG BÀI TRƯỚC / BÀI TIẾP THEO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson && onSelectLesson(prevLesson.id)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2.5 transition cursor-pointer shadow-2xs"
            title={`Chuyển về bài trước: ${prevLesson.code}`}
          >
            <i className="fa-solid fa-arrow-left text-emerald-600"></i>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-semibold">Bài trước</span>
              <span className="line-clamp-1 max-w-[200px]">{prevLesson.code}: {prevLesson.title}</span>
            </div>
          </button>
        ) : <div />}

        {nextLesson ? (
          <button
            onClick={() => onSelectLesson && onSelectLesson(nextLesson.id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-between sm:justify-end gap-2.5 transition cursor-pointer shadow-md shadow-emerald-700/20"
            title={`Chuyển sang bài tiếp theo: ${nextLesson.code}`}
          >
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-emerald-200 block font-semibold">Bài tiếp theo &rarr;</span>
              <span className="line-clamp-1 max-w-[220px]">{nextLesson.code}: {nextLesson.title}</span>
            </div>
            <i className="fa-solid fa-arrow-right text-white"></i>
          </button>
        ) : null}
      </div>

      {/* MODAL CHỈNH SỬA HỌC LIỆU TRỰC TIẾP TRÊN TRANG BÀI HỌC (CHO ADMIN) */}
      {itemToEdit && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setItemToEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Chỉnh Sửa Học Liệu Này</h4>
                <span className="text-[10px] text-slate-400">{lesson.code}: {lesson.title}</span>
              </div>
            </div>

            <form onSubmit={handleSaveDirectEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phân loại mục con:</label>
                <select
                  value={editSubcat}
                  onChange={e => setEditSubcat(e.target.value as SubCategoryType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="model3d">🧊 Mô hình 3D</option>
                  <option value="mindmap">🧠 Sơ đồ tư duy</option>
                  <option value="exercise">📝 Phiếu bài tập</option>
                  <option value="virtual_lab">🔬 Thí nghiệm ảo</option>
                  <option value="game">🎮 Trò chơi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề học liệu:</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mô tả hoặc hướng dẫn:</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Liên kết web (Link 3D / PhET...):</label>
                <input
                  type="url"
                  value={editLink}
                  onChange={e => setEditLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Tệp đính kèm trong modal sửa */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">
                    <i className="fa-solid fa-paperclip text-amber-600 mr-1"></i> Tệp đính kèm:
                  </label>
                  {editFileName ? (
                    <button
                      type="button"
                      onClick={clearEditFile}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Xóa tệp (để trống)
                    </button>
                  ) : null}
                </div>
                <input
                  key={editFileInputKey}
                  ref={editFileInputRef}
                  type="file"
                  onChange={handleEditFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer"
                />
                {editFileName ? (
                  <div className="text-[11px] font-bold text-amber-800 truncate">
                    📎 {editFileName}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400">
                    Chưa có tệp đính kèm (đang để trống)
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemToEdit(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black cursor-pointer shadow-sm"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA HỌC LIỆU TRỰC TIẾP TRÊN TRANG BÀI HỌC (CHO ADMIN) */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 text-center mb-1">
              Xóa Học Liệu Này?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Cô Duyên có chắc chắn muốn xóa học liệu này khỏi bài học không?
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs mb-5">
              <div className="font-bold text-slate-800">{itemToDelete.title}</div>
              <div className="text-slate-500 mt-1">Phân mục: <b>{itemToDelete.subcat}</b></div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  if (onDeleteResource) {
                    onDeleteResource(itemToDelete.id);
                  }
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA THÔNG TIN BÀI HỌC DÀNH CHO ADMIN */}
      {isEditingLesson && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setIsEditingLesson(false)}
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
                  Chỉnh Sửa Bài Học
                </h3>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!editLessonTitle.trim() || !editLessonCode.trim()) return;
                if (onUpdateLesson) {
                  onUpdateLesson({
                    ...lesson,
                    code: editLessonCode.trim(),
                    title: editLessonTitle.trim(),
                    topic: editLessonTopic.trim() || lesson.topic,
                    yccd: editLessonYccd.trim() || lesson.yccd,
                    keyConcepts: editLessonConcepts
                      .split(',')
                      .map(k => k.trim())
                      .filter(Boolean)
                  });
                }
                setIsEditingLesson(false);
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Mã bài:</label>
                  <input
                    type="text"
                    required
                    value={editLessonCode}
                    onChange={e => setEditLessonCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Chủ đề:</label>
                  <input
                    type="text"
                    required
                    value={editLessonTopic}
                    onChange={e => setEditLessonTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Tên bài học:</label>
                <input
                  type="text"
                  required
                  value={editLessonTitle}
                  onChange={e => setEditLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Yêu cầu cần đạt chuẩn SGK GDPT 2018:</label>
                <textarea
                  rows={3}
                  value={editLessonYccd}
                  onChange={e => setEditLessonYccd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Khái niệm cốt lõi (cách nhau bởi dấu phẩy):</label>
                <input
                  type="text"
                  value={editLessonConcepts}
                  onChange={e => setEditLessonConcepts(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingLesson(false)}
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

      {/* MODAL THÊM HỌC LIỆU MỚI TRỰC TIẾP TRÊN TRANG BÀI HỌC (CHO ADMIN) */}
      {isAddingResource && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800 my-auto">
            <button
              onClick={() => setIsAddingResource(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                <i className="fa-solid fa-circle-plus"></i>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Thêm Học Liệu Mới</h4>
                <span className="text-[11px] text-emerald-700 font-bold">{lesson.code}: {lesson.title}</span>
              </div>
            </div>

            <form onSubmit={handleSaveNewResource} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Phân loại mục con:
                </label>
                <select
                  value={addSubcat}
                  onChange={e => setAddSubcat(e.target.value as SubCategoryType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  <option value="model3d">🧊 Mô hình / Hình ảnh 3D tương tác</option>
                  <option value="mindmap">🧠 Sơ đồ tư duy (Mindmap)</option>
                  <option value="exercise">📝 Phiếu bài tập & Trắc nghiệm</option>
                  <option value="virtual_lab">🔬 Thí nghiệm ảo trực quan</option>
                  <option value="game">🎮 Trò chơi sinh học củng cố</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Tiêu đề học liệu:
                </label>
                <input
                  type="text"
                  required
                  value={addTitle}
                  onChange={e => setAddTitle(e.target.value)}
                  placeholder="VD: Mô hình 3D cấu tạo tế bào"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Mô tả hoặc hướng dẫn học sinh:
                </label>
                <textarea
                  rows={2}
                  value={addDesc}
                  onChange={e => setAddDesc(e.target.value)}
                  placeholder="Hướng dẫn cách học, câu hỏi gợi ý..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  <i className="fa-solid fa-link text-emerald-600 mr-1"></i> Liên kết web (3D, PhET, Wordwall...):
                </label>
                <input
                  type="url"
                  value={addLink}
                  onChange={e => setAddLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* ĐÍNH KÈM TỆP VÀO MỤC CON - TỰ ĐỘNG ĐỂ TRỐNG KHI LƯU HOẶC CHUYỂN BÀI TIẾP THEO */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase text-slate-700">
                    <i className="fa-solid fa-paperclip text-emerald-600 mr-1"></i> Đính kèm tệp cho mục này (PDF, Word, Ảnh...):
                  </label>
                  {addFileName ? (
                    <button
                      type="button"
                      onClick={clearAddFile}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Bỏ chọn tệp đính kèm này, để trống"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      <span>Bỏ chọn tệp</span>
                    </button>
                  ) : null}
                </div>

                <input
                  key={addFileInputKey}
                  ref={addFileInputRef}
                  type="file"
                  onChange={handleAddFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />

                {/* Trạng thái tệp đính kèm */}
                {addFileName ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 truncate">
                      <i className="fa-solid fa-file-circle-check text-emerald-600 text-sm shrink-0"></i>
                      <span className="font-bold truncate text-[11px]">{addFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearAddFile}
                      className="px-2 py-0.5 rounded bg-white text-rose-600 font-bold text-[10px] border border-rose-200 hover:bg-rose-50 ml-2 shrink-0 cursor-pointer"
                    >
                      Xóa tệp
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium px-1">
                    <i className="fa-regular fa-circle-dot text-slate-300"></i>
                    <span>Chưa chọn tệp (đang để trống). Khi bấm Lưu hoặc chuyển bài tiếp theo, phần này luôn để trống sạch sẽ.</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddingResource(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>Lưu Học Liệu Vào Bài</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
