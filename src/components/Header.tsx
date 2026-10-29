import React from 'react';
import { GradeNumber, StudentProfile } from '../types';

interface HeaderProps {
  currentGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  userRole: 'student' | 'admin';
  student: StudentProfile | null;
  onOpenWelcomeGate: () => void;
  onOpenTimerModal: () => void;
  onToggleAdminView: () => void;
  viewMode: 'student' | 'admin';
  onAdminLogout: () => void;
  studyMinutes: number;
  onAdminSync?: () => void;
  isAdminSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  userRole,
  student,
  onOpenWelcomeGate,
  onOpenTimerModal,
  onToggleAdminView,
  viewMode,
  onAdminLogout,
  studyMinutes,
  onAdminSync,
  isAdminSyncing
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Logo & Tên ứng dụng */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={userRole === 'student' ? onOpenWelcomeGate : undefined}
          title={userRole === 'student' ? 'Xem thông tin hoặc đổi tài khoản học sinh' : 'Lớp học Sinh Học Cô Duyên'}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-200 text-xl sm:text-2xl">
            <i className="fa-solid fa-dna"></i>
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-600 block">
              Sinh Học THCS &bull; GDPT 2018
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-tight">
              Cùng Cô Duyên
            </h1>
          </div>
        </div>

        {/* 4 Khối lớp (Hiện trên Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
          {([6, 7, 8, 9] as GradeNumber[]).map(grade => {
            const isActive = currentGrade === grade;
            return (
              <button
                key={grade}
                onClick={() => onSelectGrade(grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                KHTN {grade}
              </button>
            );
          })}
        </nav>

        {/* Nhóm công cụ bên phải: TÁCH BIỆT HOÀN TOÀN GIỮA HỌC SINH VÀ QUẢN TRỊ VIÊN */}
        {userRole === 'student' ? (
          /* ========================================================
             1. PHẦN DÀNH CHO HỌC SINH:
             - Tuyệt đối không hiện bảng hay nút quản trị bên cạnh
             - Không có nút đồng bộ (chỉ admin mới có quyền đồng bộ)
             - Chỉ hiển thị đồng hồ học tập và tên của chính em học sinh
             ======================================================== */
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Nút Đồng hồ tập trung (Pomodoro study timer) */}
            <button
              onClick={onOpenTimerModal}
              title="Đồng hồ học tập tập trung & tính thời gian"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 text-xs font-bold transition cursor-pointer"
            >
              <i className="fa-solid fa-stopwatch text-teal-600 text-xs"></i>
              <span className="font-mono text-xs">{studyMinutes}p</span>
            </button>

            {/* Huy hiệu Họ Tên Học Sinh (Click để đổi thông tin hoặc đăng xuất) */}
            <button
              onClick={onOpenWelcomeGate}
              title="Nhấn để xem thông tin hoặc đăng xuất"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition cursor-pointer max-w-[200px]"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <span className="truncate text-xs font-extrabold">
                {student ? student.name : 'Em học sinh'}
                {student?.room ? ` • ${student.room}` : ''}
              </span>
            </button>
          </div>
        ) : (
          /* ========================================================
             2. PHẦN DÀNH CHO ADMIN CÔ DUYÊN:
             - Tuyệt đối không hiện tên học sinh bên cạnh
             - Có quyền đồng bộ dữ liệu lên máy chủ cho toàn hệ thống
             - Chuyển đổi giữa Bảng Quản Trị và Xem Bài Học
             ======================================================== */
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Nút Đồng Bộ Đám Mây dành riêng cho Admin */}
            {onAdminSync && (
              <button
                onClick={onAdminSync}
                disabled={isAdminSyncing}
                title="Đồng bộ toàn bộ thay đổi lên máy chủ để bất kỳ ai mở link cũng nhận được bản mới nhất"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                <i className={`fa-solid ${isAdminSyncing ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-xs`}></i>
                <span className="hidden sm:inline">
                  {isAdminSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ Máy Chủ'}
                </span>
              </button>
            )}

            {/* Huy hiệu Quản Trị Viên Cô Duyên */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] leading-tight text-amber-950 font-black">Cô Duyên</span>
                <span className="text-[9px] leading-none text-amber-700 font-bold uppercase tracking-wider">Quản Trị Viên</span>
              </div>
            </div>

            {/* Nút chuyển đổi giữa Xem Bài Học <-> Bảng Quản Trị */}
            <button
              onClick={onToggleAdminView}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border cursor-pointer shadow-xs ${
                viewMode === 'admin'
                  ? 'bg-slate-800 hover:bg-slate-900 text-white border-slate-900'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
              title={viewMode === 'admin' ? 'Chuyển sang xem giao diện bài học' : 'Quay lại Bảng Quản Trị'}
            >
              <i className={`fa-solid ${viewMode === 'admin' ? 'fa-book-open-reader' : 'fa-gear'} text-xs`}></i>
              <span className="text-xs">
                {viewMode === 'admin' ? 'Xem Bài Học' : 'Bảng Quản Trị'}
              </span>
            </button>

            {/* Nút Đăng xuất Quản trị viên */}
            <button
              onClick={onAdminLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
              title="Đăng xuất khỏi tài khoản Quản Trị Viên"
            >
              <i className="fa-solid fa-right-from-bracket text-xs"></i>
              <span className="hidden sm:inline text-xs">Đăng xuất</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
