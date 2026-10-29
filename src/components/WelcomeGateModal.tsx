import React, { useState } from 'react';
import { GradeNumber, StudentProfile } from '../types';
import { generateSyncCode } from '../services/syncService';
import { verifyAdminCredentials } from '../services/adminAuth';
import { ChangePasswordModal, ForgotPasswordModal } from './AdminPasswordModals';

interface WelcomeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
  initialProfile: StudentProfile | null;
  currentUserRole?: 'student' | 'admin' | null;
  onAdminLoginSuccess?: () => void;
  onStudentLogout?: () => void;
}

export const WelcomeGateModal: React.FC<WelcomeGateModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  currentUserRole,
  onAdminLoginSuccess,
  onStudentLogout
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [grade, setGrade] = useState<GradeNumber>(initialProfile?.grade || 8);
  const [room, setRoom] = useState(initialProfile?.room || '');
  const [mode, setMode] = useState<'student' | 'admin'>(currentUserRole === 'admin' ? 'admin' : 'student');

  // Đăng nhập Admin
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);

  // Modals đổi mật khẩu & quên mật khẩu
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: StudentProfile = {
      id: initialProfile?.id || `stu-${Date.now()}`,
      name: name.trim(),
      grade,
      room: room.trim() || 'Chưa phân lớp',
      syncCode: initialProfile?.syncCode || generateSyncCode(name, room),
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    onSaveProfile(profile);
    onClose();
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoggingIn(true);
    setAdminError('');

    const res = await verifyAdminCredentials(adminUsername, adminPassword);
    setIsAdminLoggingIn(false);

    if (res.success) {
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
      onClose();
    } else {
      setAdminError(res.error || 'Tên đăng nhập hoặc mật khẩu quản trị chưa chính xác!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-emerald-100 my-auto text-slate-800">
        
        {/* Nút đóng nếu đã có profile trước đó */}
        {initialProfile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        )}

        {/* HEADER VÀ LỜI CHÚC TRUYỀN CẢM HỨNG CỦA CÔ DUYÊN */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white text-2xl mb-2.5 shadow-lg shadow-emerald-500/20">
            <i className="fa-solid fa-leaf"></i>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
            Lớp Học Sinh Học - KHTN
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-200">
              <i className="fa-solid fa-dna text-emerald-600"></i> GDPT 2018 &bull; Mạch Vật Sống (Lớp 6 - 9)
            </span>
          </div>

          {/* Hộp Lời Chúc / Thông Điệp Truyền Cảm Hứng Hấp Dẫn Của Cô Duyên */}
          <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-amber-50/50 border border-emerald-200/90 text-slate-700 shadow-xs text-left overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-emerald-200/40 text-7xl font-serif pointer-events-none select-none">
              ”
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs shadow-2xs">
                🌸
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Lời Nhắn Gửi Yêu Thương Từ Cô Duyên
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              Chào mừng các em học sinh thân yêu đến với thế giới Sinh học diệu kỳ! Nơi mỗi tế bào là một công trình kiến trúc tinh xảo, mỗi sự sống đều ẩn chứa những bí mật diệu kỳ cần được giải mã. Cùng Cô Duyên chạm vào các mô hình 3D đa chiều, khám phá sơ đồ tư duy sắc màu và trải nghiệm những thí nghiệm khoa học trực quan nhất.
            </p>

            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-[11px]">
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  🧬 Mô hình 3D
                </span>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  🧠 Sơ đồ tư duy
                </span>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  🔬 Thí nghiệm ảo
                </span>
              </div>
              <div className="font-serif italic font-bold text-emerald-900 text-xs">
                ✨ Chúc các em luôn say mê & bứt phá điểm 10!
              </div>
            </div>
          </div>
        </div>

        {/* 2 Tab chuyển đổi duy nhất: [Học Sinh Vào Học] và [Cô Duyên (Quản Trị Viên)] */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setMode('student')}
            className={`py-2.5 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              mode === 'student'
                ? 'bg-white text-emerald-800 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-user-graduate text-emerald-600"></i>
            <span>Học Sinh Vào Học</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`py-2.5 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              mode === 'admin'
                ? 'bg-emerald-700 text-white shadow-xs font-black'
                : 'text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <i className="fa-solid fa-user-shield text-amber-400"></i>
            <span>Cô Duyên (Quản Trị)</span>
          </button>
        </div>

        {/* FORM 1: HỌC SINH ĐIỀN THÔNG TIN VÀ BẮT ĐẦU HỌC */}
        {mode === 'student' && (
          <form onSubmit={handleSubmitStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                <i className="fa-solid fa-user-pen text-emerald-600 mr-1"></i> Họ và tên của em:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  <i className="fa-solid fa-school text-emerald-600 mr-1"></i> Khối lớp đang học:
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value) as GradeNumber)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-medium bg-white"
                >
                  <option value={6}>KHTN 6 (Sinh học 6)</option>
                  <option value={7}>KHTN 7 (Sinh học 7)</option>
                  <option value={8}>KHTN 8 (Sinh học 8)</option>
                  <option value={9}>KHTN 9 (Sinh học 9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  <i className="fa-solid fa-door-open text-emerald-600 mr-1"></i> Lớp / Chi đội:
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  placeholder="Ví dụ: 8/1, 8A2, 7/3, 9A..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-md shadow-emerald-700/25 transition duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Bắt Đầu Hành Trình Học Tập</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>

            <div className="pt-2 text-center flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMode('admin')}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-bold hover:underline cursor-pointer inline-flex items-center justify-center gap-1"
              >
                <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                <span>Cô Duyên hoặc Quản trị viên? Đăng nhập quản trị tại đây &rarr;</span>
              </button>

              {initialProfile && onStudentLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onStudentLogout();
                    setName('');
                    setRoom('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer inline-flex items-center justify-center gap-1 pt-1 border-t border-slate-100"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Đổi học sinh khác / Thoát tài khoản này</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* FORM 2: ĐĂNG NHẬP DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (CÔ DUYÊN) */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-emerald-700"></i>
                Cổng đăng nhập Quản Trị Viên dành riêng cho Cô Duyên:
              </p>
              Toàn quyền biên tập bài học, bổ sung mô hình 3D, sơ đồ tư duy, thí nghiệm ảo và đồng bộ bản cập nhật mới nhất cho tất cả học sinh.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Tài khoản quản trị:
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={e => {
                  setAdminUsername(e.target.value);
                  setAdminError('');
                }}
                placeholder="Tài khoản..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={e => {
                    setAdminPassword(e.target.value);
                    setAdminError('');
                  }}
                  placeholder="Nhập mật khẩu quản trị..."
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  title={showAdminPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <i className={`fa-solid ${showAdminPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Tùy chọn Quên mật khẩu & Đổi mật khẩu */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => {
                  setAdminError('');
                  setIsForgotPassOpen(true);
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer flex items-center gap-1.5 transition"
              >
                <i className="fa-solid fa-unlock-keyhole text-emerald-600"></i>
                <span>Quên mật khẩu?</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminError('');
                  setIsChangePassOpen(true);
                }}
                className="text-slate-600 hover:text-slate-900 font-semibold hover:underline cursor-pointer flex items-center gap-1.5 transition"
              >
                <i className="fa-solid fa-key text-amber-600"></i>
                <span>Đổi mật khẩu</span>
              </button>
            </div>

            {adminError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5 font-medium">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {adminError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAdminLoggingIn}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {isAdminLoggingIn ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Vào Bảng Quản Trị Viên</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('student')}
                className="text-xs text-slate-500 hover:text-emerald-700 font-medium hover:underline cursor-pointer"
              >
                &larr; Quay lại màn hình Học sinh
              </button>
            </div>
          </form>
        )}

      </div>

      {/* MODAL ĐỔI MẬT KHẨU */}
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        onSuccess={() => {
          setAdminPassword('');
        }}
      />

      {/* MODAL QUÊN MẬT KHẨU */}
      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
        onSuccess={() => {
          if (onAdminLoginSuccess) {
            onAdminLoginSuccess();
          }
          onClose();
        }}
      />
    </div>
  );
};
