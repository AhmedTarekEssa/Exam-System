export interface IExamResult {
  id: number;
  score: number;
  totalPoints: number;
  startTime: string;
  endTime: string;
  userId: string;
  examId: number;
  user?: {
    id: string;
    userName: string;
    email: string;
    // ...other user props
  };
  exam?: {
    id: number;
    title: string;
    description: string;
    // ...other exam props
  };
  answers?: any[];
  percentage?: number; // optional for UI
  duration?: string;   // optional for UI
  studentName?: string; // for displaying name in UI
  status?: 'completed' | 'incomplete' | 'failed'; // custom status
}
