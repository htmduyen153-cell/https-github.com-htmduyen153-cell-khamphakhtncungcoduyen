import React, { useState, useEffect } from 'react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudyMinutes: (minutes: number) => void;
  totalStudyMinutes: number;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  onAddStudyMinutes,
  totalStudyMinutes
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // phút
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(sec => sec - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Hoàn thành phiên học!
      if (mode === 'study') {
        onAddStudyMinutes(selectedDuration);
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(() => {});
        } catch {}
        alert(`Chúc mừng em đã hoàn thành xuất sắc ${selectedDuration} phút học tập tập trung cùng Cô Duyên!`);
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        alert('Hết giờ giải lao! Hãy tiếp tục buổi học thật hứng khởi nhé!');
        setMode('study');
        setSecondsLeft(selectedDuration * 60);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, selectedDuration, onAddStudyMinutes]);

  const handleSelectTime = (min: number) => {
    setSelectedDuration(min);
    setSecondsLeft(min * 60);
    setIsActive(false);
    setMode('study');
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsLeft(selectedDuration * 60);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = 100 - ((secondsLeft / (selectedDuration * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-emerald-100 my-auto text-slate-800 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
          <i className="fa-solid fa-stopwatch"></i>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
          Đồng Hồ Tập Trung Sinh Học
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Phương pháp Pomodoro giúp ghi nhớ kiến thức sinh học sâu hơn và giảm mệt mỏi
        </p>

        {/* Nút chọn thời gian */}
        <div className="flex justify-center gap-2 mb-6">
          {[15, 25, 45].map(min => (
            <button
              key={min}
              disabled={isActive}
              onClick={() => handleSelectTime(min)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                selectedDuration === min && mode === 'study'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {min} phút
            </button>
          ))}
          <button
            disabled={isActive}
            onClick={() => {
              setMode('break');
              setSelectedDuration(5);
              setSecondsLeft(5 * 60);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
              mode === 'break'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Nghỉ 5p
          </button>
        </div>

        {/* Đồng hồ số tròn lớn */}
        <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#e2e8f0"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={mode === 'study' ? '#10b981' : '#f59e0b'}
              strokeWidth="6"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900 tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              {mode === 'study' ? 'Đang học tập' : 'Giải lao'}
            </span>
          </div>
        </div>

        {/* Nút điều khiển */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <button
            onClick={handleToggleTimer}
            className={`px-6 py-2.5 rounded-xl font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
            <span>{isActive ? 'Tạm dừng' : 'Bắt đầu học'}</span>
          </button>

          <button
            onClick={handleResetTimer}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer"
            title="Đặt lại"
          >
            <i className="fa-solid fa-rotate-left"></i>
          </button>
        </div>

        {/* Tổng thời gian đã học */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
          <span>Tổng thời gian học tích lũy:</span>
          <span className="font-bold text-emerald-700 font-mono text-sm">{totalStudyMinutes} phút</span>
        </div>

      </div>
    </div>
  );
};
