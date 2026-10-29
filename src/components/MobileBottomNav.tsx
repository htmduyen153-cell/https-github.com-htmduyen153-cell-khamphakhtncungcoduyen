import React from 'react';

interface MobileBottomNavProps {
  currentView: 'lessons' | 'notebook';
  onSelectView: (view: 'lessons' | 'notebook') => void;
  userRole: 'student' | 'admin';
  onOpenTimerModal: () => void;
  onOpenAdmin: () => void;
  onAdminLogout: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  userRole,
  onOpenTimerModal,
  onOpenAdmin,
  onAdminLogout
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-3 py-1.5 flex items-center justify-around">
      <button
        onClick={() => onSelectView('lessons')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
          currentView === 'lessons' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <i className="fa-solid fa-book-open text-base"></i>
        <span className="text-[10px]">Bài học</span>
      </button>

      {userRole === 'student' ? (
        /* THANH ĐIỀU HƯỚNG DÀNH CHO HỌC SINH - TUYỆT ĐỐI KHÔNG CÓ NÚT ADMIN HOẶC NÚT ĐỒNG BỘ */
        <>
          <button
            onClick={onOpenTimerModal}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition text-slate-500 hover:text-teal-700 cursor-pointer"
          >
            <i className="fa-solid fa-stopwatch text-base text-teal-600"></i>
            <span className="text-[10px]">Học tập</span>
          </button>

          <button
            onClick={() => onSelectView('notebook')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
              currentView === 'notebook' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-book-bookmark text-base"></i>
            <span className="text-[10px]">Sổ tay</span>
          </button>
        </>
      ) : (
        /* THANH ĐIỀU HƯỚNG DÀNH CHO QUẢN TRỊ VIÊN - KHÔNG CÓ THÔNG TIN HỌC SINH */
        <>
          <button
            onClick={onOpenAdmin}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition text-amber-700 hover:text-amber-800 font-bold cursor-pointer"
          >
            <i className="fa-solid fa-shield-halved text-base text-amber-600"></i>
            <span className="text-[10px]">Bảng Quản Trị</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket text-base"></i>
            <span className="text-[10px]">Đăng xuất</span>
          </button>
        </>
      )}
    </nav>
  );
};
