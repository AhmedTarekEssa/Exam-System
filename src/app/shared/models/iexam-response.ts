export interface IExamResponse {
     id: number;
  title?: string;
  description: string;
  durationMinutes: number;
  questions: {
    id: number;
    text: string;
    type: string;
    points: number;
    options: {
      id: number;
      text: string;
      isCorrect?: boolean;
    }[];
  }[];
}
