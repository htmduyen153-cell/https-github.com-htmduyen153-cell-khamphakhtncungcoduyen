import React from 'react';
import { StudentProgress, Lesson } from '../types';

interface StudentNotebookProps {
  progress: StudentProgress;
  allLessons: Lesson[];
  onSelectLesson: (lessonId: string, grade: any) => void;
  onOpenSyncModal?: () => void;
}

export const StudentNotebook: React.FC<StudentNotebookProps> = ({
  progress,
  allLessons,
  onSelectLesson
}) => {
  const completedSet = new Set(progress.completedLessonIds);
  const bookmarkSet = new Set(progress.bookmarkedLessonIds);
  const totalLessons = allLessons.length || 1;
  const overallPercent = Math.round((completedSet.size / totalLessons) * 100);

  const completedLessons = allLessons.filter(l => completedSet.has(l.id));
  const bookmarkedLessons = allLessons.filter(l => bookmarkSet.has(l.id));
  const notesEntries = Object.entries(progress.lessonNotes).filter(([_, note]) => note.trim() !== '');

  return (
    <div className="space-y-6">
      
      {/* Banner Sổ Tay Cá Nhân */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3 border border-white/10">
            <i className="fa-solid fa-graduation-cap"></i> Nhật Ký Tiến Trình Sinh Học
          </span>
          <h3 className="text-xl sm:text-2xl font-black mb-2">
            Hồ Sơ Học Tập Của Em: {progress.student.name}
          </h3>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-4">
            Khối KHTN {progress.student.grade} &bull; Lớp: <b>{progress.student.room}</b> &bull; Chương trình Sinh học GDPT 2018 cùng Cô Duyên
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold backdrop-blur-sm border border-white/20">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>Đã hoàn thành {completedSet.size} bài học &bull; Tích lũy {progress.studyTimeMinutes} phút tập trung</span>
          </div>
        </div>

        <div className="absolute -right-6 -bottom-10 opacity-10 text-[200px] pointer-events-none select-none">
          <i className="fa-solid fa-book-bookmark"></i>
        </div>
      </div>

      {/* 4 Thẻ chỉ số năng lực */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tiến độ chung</div>
          <div className="text-2xl font-black text-slate-800">{overallPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{completedSet.size}/{totalLessons} bài học</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Thời gian học</div>
          <div className="text-2xl font-black text-emerald-600">{progress.studyTimeMinutes}p</div>
          <div className="text-[11px] text-slate-500 mt-1">Đã tích lũy tập trung</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Chuỗi ngày học 🔥</div>
          <div className="text-2xl font-black text-amber-600">{progress.streakDays} ngày</div>
          <div className="text-[11px] text-slate-500 mt-1">Học tập đều đặn</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Điểm trắc nghiệm</div>
          <div className="text-2xl font-black text-teal-700">
            {Object.keys(progress.quizScores).length} bài
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đã hoàn thành kiểm tra</div>
        </div>
      </div>

      {/* Phần 1: Các bài học đã hoàn thành */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-emerald-600"></i>
          Các Bài Học Em Đã Hoàn Thành ({completedLessons.length} bài):
        </h4>

        {completedLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {completedLessons.map(l => (
              <div
                key={l.id}
                onClick={() => onSelectLesson(l.id, l.grade)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 block">KHTN {l.grade} &bull; {l.code}</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{l.title}</span>
                </div>
                <i className="fa-solid fa-circle-check text-emerald-600 shrink-0 ml-2"></i>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-2">
            Em chưa đánh dấu hoàn thành bài học nào. Hãy vào từng bài và bấm "Đánh dấu hoàn thành" nhé!
          </p>
        )}
      </div>

      {/* Phần 2: Các bài học đã lưu (Bookmarks) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-bookmark text-amber-500"></i>
          Bài Học Yêu Thích & Đã Lưu ({bookmarkedLessons.length} bài):
        </h4>

        {bookmarkedLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {bookmarkedLessons.map(l => (
              <div
                key={l.id}
                onClick={() => onSelectLesson(l.id, l.grade)}
                className="p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-100/50 border border-amber-200/60 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 block">KHTN {l.grade} &bull; {l.code}</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{l.title}</span>
                </div>
                <i className="fa-solid fa-arrow-right text-amber-700 text-xs shrink-0 ml-2"></i>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-2">
            Chưa có bài học nào trong danh sách yêu thích. Em có thể bấm biểu tượng Lưu bài ở từng bài học.
          </p>
        )}
      </div>

      {/* Phần 3: Ghi chú cá nhân */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <i className="fa-regular fa-note-sticky text-indigo-600"></i>
          Sổ Tay Ghi Chú Sinh Học Của Em ({notesEntries.length} ghi chú):
        </h4>

        {notesEntries.length > 0 ? (
          <div className="space-y-3">
            {notesEntries.map(([lId, note]) => {
              const lessonObj = allLessons.find(l => l.id === lId);
              return (
                <div key={lId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      {lessonObj ? `${lessonObj.code}: ${lessonObj.title}` : lId}
                    </span>
                    {lessonObj && (
                      <button
                        onClick={() => onSelectLesson(lessonObj.id, lessonObj.grade)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        Đến bài học &rarr;
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{note}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-2">
            Chưa có ghi chú nào. Em có thể viết ghi chú vào mục ghi chú cá nhân ở mỗi bài học.
          </p>
        )}
      </div>

    </div>
  );
};
