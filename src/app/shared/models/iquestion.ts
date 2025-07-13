export interface IQuestion {
  id: number;
  text: string;
  type: string;
  points: number;
  options?: IQuestionOption[];
  examId: number;
}

export interface IQuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}
