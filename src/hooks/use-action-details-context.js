import { createContext, useContext } from 'react';

export const ActionDetailsContext = createContext({
  selectedDate: '',
  actionItemValues: [],
  totalCO2Saved: 0,
  skipBonusQuestion: false,
  quiz: null,
  quizAnswered: false,
  firstQuizAnswerCorrect: false,
  selectedImage: null,
  validationSuccess: false,
});

export const useActionDetailsContext = () => {
  return useContext(ActionDetailsContext);
};
