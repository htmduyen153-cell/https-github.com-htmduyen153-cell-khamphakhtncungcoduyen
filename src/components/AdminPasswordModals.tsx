import React, { useState } from 'react';
import { changeAdminPassword, resetAdminPassword } from '../services/adminAuth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await changeAdminPassword(currentPass, newPass, confirmPass);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-800 border border-emerald-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl shadow-inner">
          <i className="fa-solid fa-key"></i>
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center mb-1">
          Đổi Mật Khẩu Quản Trị Viên
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5">
          Cập nhật mật khẩu bảo mật mới cho tài khoản Cô Duyên
        </p>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center flex flex-col items-center gap-2">
            <i className="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu hiện tại:
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPass}
                  onChange={e => {
                    setCurrentPass(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Nhập mật khẩu đang dùng..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <i className={`fa-solid ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu mới:
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={e => {
                    setNewPass(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Nhập mật khẩu mới (ít nhất 4 ký tự)..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <i className={`fa-solid ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Xác nhận lại mật khẩu mới:
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={e => {
                  setConfirmPass(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5 font-medium">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Lưu Mật Khẩu Mới</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const res = await resetAdminPassword(recoveryAnswer, newPass, confirmPass);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-800 border border-emerald-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 text-xl shadow-inner">
          <i className="fa-solid fa-unlock-keyhole"></i>
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center mb-1">
          Khôi Phục Mật Khẩu Quản Trị
        </h3>
        <p className="text-xs text-slate-500 text-center mb-5">
          Xác thực danh tính giáo viên để đặt lại mật khẩu mới
        </p>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center flex flex-col items-center gap-2">
            <i className="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-question text-teal-700"></i>
                Câu hỏi xác thực giáo viên phụ trách:
              </p>
              Vui lòng nhập tên giáo viên phụ trách (Ví dụ: <b>Cô Duyên</b>) hoặc môn học giảng dạy (<b>Sinh học</b>) để xác minh quyền quản trị.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Câu trả lời xác minh / Mã khôi phục:
              </label>
              <input
                type="text"
                required
                value={recoveryAnswer}
                onChange={e => {
                  setRecoveryAnswer(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập tên giáo viên (Cô Duyên) hoặc môn học..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu mới mong muốn:
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={e => {
                    setNewPass(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Xác nhận lại mật khẩu mới:
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={e => {
                  setConfirmPass(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5 font-medium">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang xác minh...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-unlock"></i>
                  <span>Đặt Lại Mật Khẩu & Đăng Nhập</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
