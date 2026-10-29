import React, { useState } from 'react';
import { StudentProgress } from '../types';
import { pushProgressToCloud, pullProgressFromCloud, exportProgressToFile } from '../services/syncService';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: StudentProgress;
  onApplyRemoteProgress: (remote: StudentProgress) => void;
  onRefreshSync: () => Promise<void>;
  isSyncing: boolean;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  progress,
  onApplyRemoteProgress,
  onRefreshSync,
  isSyncing
}) => {
  const [copied, setCopied] = useState(false);
  const [targetCode, setTargetCode] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [fileImportError, setFileImportError] = useState('');

  if (!isOpen) return null;

  // URL kèm mã đồng bộ để quét QR trên điện thoại
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const syncShareUrl = `${currentOrigin}/?sync=${encodeURIComponent(progress.syncCode)}`;
  // Tạo QR code ảnh qua qrserver API tiện lợi
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(syncShareUrl)}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(progress.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(syncShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportFromDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = targetCode.trim().toUpperCase();
    if (!code) return;

    setImportStatus({ type: 'loading' });
    const res = await pullProgressFromCloud(code);

    if (res.success && res.data) {
      onApplyRemoteProgress(res.data);
      setImportStatus({
        type: 'success',
        message: `Đã kết nối và đồng bộ thành công hồ sơ của em ${res.data.student.name}!`
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setImportStatus({
        type: 'error',
        message: res.error || 'Không tìm thấy hồ sơ với mã đồng bộ này trên máy chủ.'
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.syncCode && parsed.student) {
          onApplyRemoteProgress(parsed);
          setFileImportError('');
          alert('Đã khôi phục thành công tiến độ từ tệp sao lưu!');
          onClose();
        } else {
          setFileImportError('Tệp sao lưu không đúng định dạng!');
        }
      } catch {
        setFileImportError('Không thể đọc tệp sao lưu JSON!');
      }
    };
    reader.readAsText(file);
  };

  const completedCount = progress.completedLessonIds.length;
  const quizCount = Object.keys(progress.quizScores).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-emerald-100 my-auto text-slate-800 max-h-[92vh] flex flex-col">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-sm">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
              Học Mọi Lúc Mọi Nơi &bull; Đa Thiết Bị
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Trung Tâm Lưu Trữ & Đồng Bộ Tiến Độ
            </h3>
          </div>
        </div>

        {/* Nội dung cuộn được */}
        <div className="overflow-y-auto space-y-5 flex-grow pr-1">
          
          {/* Card thông tin mã đồng bộ hiện tại */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 block mb-0.5">
                  Mã Đồng Bộ Độc Quyền Của Em:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800 tracking-wider">
                    {progress.syncCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-regular fa-copy"></i>
                    <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Chủ sở hữu: <b>{progress.student.name}</b> (Lớp {progress.student.room}) &bull; Khối KHTN {progress.student.grade}
                </p>
              </div>

              {/* Nút đồng bộ thủ công */}
              <button
                onClick={onRefreshSync}
                disabled={isSyncing}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin text-emerald-600' : ''}`}></i>
                <span>{isSyncing ? 'Đang lưu Cloud...' : 'Đồng bộ ngay'}</span>
              </button>
            </div>

            {/* Chỉ số thống kê nhanh */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-200/60 text-center">
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Bài đã học</span>
                <span className="text-base font-black text-slate-800">{completedCount} bài</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Bài trắc nghiệm</span>
                <span className="text-base font-black text-emerald-700">{quizCount} bài</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Thời gian học</span>
                <span className="text-base font-black text-teal-700">{progress.studyTimeMinutes} phút</span>
              </div>
            </div>
          </div>

          {/* Phần 2: Quét mã QR để mở ngay trên Điện thoại di động */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-2xs">
              <img
                src={qrCodeImageUrl}
                alt="QR Code Đồng Bộ"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left flex-grow">
              <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <i className="fa-solid fa-mobile-screen-button text-emerald-600"></i>
                Chuyển Sang Học Trên Điện Thoại Di Động
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mở camera điện thoại quét mã QR bên cạnh để mở ứng dụng với toàn bộ tiến độ của em đã được đồng bộ sẵn sàng!
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-link text-emerald-600"></i>
                  <span>Sao chép liên kết đồng bộ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phần 3: Nhập mã từ thiết bị khác về máy này */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-right-to-bracket text-emerald-600"></i>
              Tải Tiến Độ Từ Điện Thoại / Máy Tính Khác Về Máy Này
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Nếu em vừa học xong trên điện thoại hoặc máy tính ở trường, nhập mã đồng bộ của thiết bị đó vào đây:
            </p>

            <form onSubmit={handleImportFromDevice} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={targetCode}
                onChange={e => {
                  setTargetCode(e.target.value);
                  setImportStatus({ type: 'idle' });
                }}
                placeholder="Ví dụ: BIO-8A1-4921"
                className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={importStatus.type === 'loading' || !targetCode.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {importStatus.type === 'loading' ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                    <span>Tải & Hợp nhất</span>
                  </>
                )}
              </button>
            </form>

            {importStatus.type === 'error' && (
              <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {importStatus.message}
              </p>
            )}
            {importStatus.type === 'success' && (
              <p className="text-xs text-emerald-700 mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium">
                {importStatus.message}
              </p>
            )}
          </div>

          {/* Phần 4: Xuất và Nhập file JSON sao lưu ngoại tuyến */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 block">Sao lưu dự phòng an toàn</span>
              <span className="text-slate-400 text-[11px]">Xuất tệp sao lưu hoặc khôi phục từ tệp máy tính</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportProgressToFile(progress)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-download text-emerald-600"></i>
                <span>Tải tệp (.json)</span>
              </button>

              <label className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer">
                <i className="fa-solid fa-upload text-teal-600"></i>
                <span>Nạp tệp sao lưu</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </div>

            {fileImportError && (
              <p className="text-xs text-rose-600 w-full">{fileImportError}</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Lần đồng bộ gần nhất: {new Date(progress.lastSyncTimestamp).toLocaleTimeString('vi-VN')}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
