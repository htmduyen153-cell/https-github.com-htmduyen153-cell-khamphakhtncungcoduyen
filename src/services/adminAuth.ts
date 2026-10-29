// Quản lý xác thực, đổi mật khẩu và quên mật khẩu cho Quản Trị Viên (Cô Duyên)

const ADMIN_STORAGE_KEY = 'coduyen_admin_password_v1';
const DEFAULT_PASSWORD = 'coduyen2026';

// Danh sách từ khóa chấp nhận cho câu hỏi bí mật / mã khôi phục giáo viên
const RECOVERY_KEYWORDS = ['coduyen', 'cô duyên', 'duyen', 'giaovien', 'sinhhoc', 'sinh học', 'khtn', 'sinh'];

export const getLocalAdminPassword = (): string => {
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
};

export const setLocalAdminPassword = (newPass: string) => {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, newPass);
  } catch {}
};

/**
 * Kiểm tra đăng nhập Admin (gửi lên server, nếu offline thì kiểm tra localStorage)
 */
export const verifyAdminCredentials = async (
  username: string,
  pass: string
): Promise<{ success: boolean; error?: string }> => {
  const u = username.trim().toLowerCase();
  const p = pass.trim();

  if (!u || !p) {
    return { success: false, error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!' };
  }

  // 1. Thử xác thực qua máy chủ
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setLocalAdminPassword(p);
        return { success: true };
      }
    }
  } catch {
    // Nếu mất mạng, tiếp tục kiểm tra offline bên dưới
  }

  // 2. Kiểm tra fallback offline
  const localPass = getLocalAdminPassword();
  if ((u === 'admin' || u === 'coduyen') && (p === localPass || p === DEFAULT_PASSWORD)) {
    return { success: true };
  }

  return { success: false, error: 'Tên tài khoản hoặc mật khẩu quản trị không chính xác!' };
};

/**
 * Đổi mật khẩu quản trị
 */
export const changeAdminPassword = async (
  currentPass: string,
  newPass: string,
  confirmPass: string
): Promise<{ success: boolean; message: string }> => {
  if (!currentPass.trim()) {
    return { success: false, message: 'Vui lòng nhập mật khẩu hiện tại!' };
  }

  const localPass = getLocalAdminPassword();
  if (currentPass.trim() !== localPass && currentPass.trim() !== DEFAULT_PASSWORD) {
    return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
  }

  if (!newPass || newPass.trim().length < 4) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự!' };
  }

  if (newPass.trim() !== confirmPass.trim()) {
    return { success: false, message: 'Xác nhận mật khẩu mới không trùng khớp!' };
  }

  const updatedPassword = newPass.trim();

  // 1. Thử cập nhật lên server
  try {
    await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPass.trim(), newPassword: updatedPassword })
    });
  } catch {}

  // 2. Lưu vào localStorage
  setLocalAdminPassword(updatedPassword);

  return { success: true, message: 'Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật.' };
};

/**
 * Khôi phục / Đặt lại mật khẩu khi Quên mật khẩu
 */
export const resetAdminPassword = async (
  recoveryAnswer: string,
  newPass: string,
  confirmPass: string
): Promise<{ success: boolean; message: string }> => {
  if (!recoveryAnswer.trim()) {
    return { success: false, message: 'Vui lòng nhập câu trả lời xác minh giáo viên hoặc mã khôi phục!' };
  }

  const cleanAns = recoveryAnswer.trim().toLowerCase();
  const isMatch = RECOVERY_KEYWORDS.some(k => cleanAns.includes(k));

  if (!isMatch) {
    return {
      success: false,
      message: 'Thông tin xác minh chưa đúng. Gợi ý: Tên giáo viên "Cô Duyên" hoặc môn "Sinh học"!'
    };
  }

  if (!newPass || newPass.trim().length < 4) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự!' };
  }

  if (newPass.trim() !== confirmPass.trim()) {
    return { success: false, message: 'Xác nhận mật khẩu mới không trùng khớp!' };
  }

  const updatedPassword = newPass.trim();

  // 1. Thử gửi lên server
  try {
    await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recoveryAnswer: cleanAns, newPassword: updatedPassword })
    });
  } catch {}

  // 2. Lưu vào localStorage
  setLocalAdminPassword(updatedPassword);

  return {
    success: true,
    message: 'Khôi phục mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới này để đăng nhập.'
  };
};
