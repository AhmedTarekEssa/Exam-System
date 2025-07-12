export interface IQuestion {
  id: number;
  text: string;
  type: string;
  position: number;
  options?: IQuestionOption[];
  examId: number;
}

export interface IQuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}
