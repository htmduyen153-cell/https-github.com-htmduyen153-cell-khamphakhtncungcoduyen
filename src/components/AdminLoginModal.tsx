import React, { useState } from 'react';
import { verifyAdminCredentials } from '../services/adminAuth';
import { ChangePasswordModal, ForgotPasswordModal } from './AdminPasswordModals';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals đổi mật khẩu & quên mật khẩu
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await verifyAdminCredentials(username, password);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Tên đăng nhập hoặc mật khẩu quản trị chưa chính xác!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-800 border border-emerald-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-xl shadow-inner">
            <i className="fa-solid fa-lock"></i>
          </div>

          <h3 className="text-lg font-black text-slate-900 text-center mb-1">
            Xác Thực Quản Trị Viên
          </h3>
          <p className="text-xs text-slate-500 text-center mb-5">
            Dành riêng cho Cô Duyên quản lý học liệu và theo dõi điểm danh học sinh
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Tài khoản
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập tên tài khoản quản trị..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Mật khẩu quản trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Tùy chọn Quên mật khẩu & Đổi mật khẩu */}
            <div className="flex items-center justify-between text-xs pt-0.5 px-0.5">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
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
                  setErrorMsg('');
                  setIsChangePassOpen(true);
                }}
                className="text-slate-600 hover:text-slate-900 font-semibold hover:underline cursor-pointer flex items-center gap-1.5 transition"
              >
                <i className="fa-solid fa-key text-amber-600"></i>
                <span>Đổi mật khẩu</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Vào Bảng Quản Trị</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal Đổi Mật Khẩu */}
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        onSuccess={() => {
          setPassword('');
        }}
      />

      {/* Modal Quên Mật Khẩu */}
      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </>
  );
};
