export type GradeNumber = 6 | 7 | 8 | 9;

export type SubCategoryType = 'model3d' | 'mindmap' | 'exercise' | 'virtual_lab' | 'game' | 'all';

export interface Lesson {
  id: string;
  grade: GradeNumber;
  topic: string;
  code: string;
  title: string;
  yccd: string;
  keyConcepts: string[];
}

export interface ResourceItem {
  id: string;
  lessonId: string;
  grade: GradeNumber;
  subcat: SubCategoryType;
  title: string;
  desc: string;
  link?: string;
  fileName?: string;
  fileData?: string | null;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: GradeNumber;
  room: string;
  syncCode: string;
  avatarIcon?: string;
  createdAt: string;
  lastActive: string;
}

export interface StudentProgress {
  syncCode: string;
  student: StudentProfile;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  lessonNotes: Record<string, string>;
  quizScores: Record<string, {
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
    timeSpentSeconds: number;
  }>;
  studyTimeMinutes: number;
  streakDays: number;
  lastStudyDate: string;
  lastSyncTimestamp: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  rawDate: string;
  studentName: string;
  studentClass: string;
  grade: GradeNumber;
  lessonName: string;
  action: string;
  resourceTitle?: string;
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface ClassAnalyticsSummary {
  className: string;
  grade: GradeNumber;
  studentCount: number;
  totalInteractions: number;
  completedLessonsCount: number;
  topLesson: string;
  lastActive: string;
  students: {
    name: string;
    interactions: number;
    lastSeen: string;
  }[];
}
