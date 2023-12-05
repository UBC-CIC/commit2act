import { API } from 'aws-amplify';
import { useEffect } from 'react';
import { updateSubmittedAction } from '../../graphql/mutations';

export const getPointsEarnedFromCO2Saved = (CO2Saved = 0) =>
  Math.ceil(CO2Saved);

export const useUpdateSubmittedAction = (
  updateData = {},
  autoUpdateOnInit = false
) => {
  const transformDataForRequest = (initialData) => {
    const {
      actionId,
      actionDate,
      firstQuizAnswerCorrect,
      totalCO2Saved,
      isValidated = false,
      quizAnswered,
      userId,
      quizId,
    } = initialData;

    return {
      action_id: actionId,
      date_of_action: actionDate,
      first_quiz_answer_correct: firstQuizAnswerCorrect,
      g_co2_saved: totalCO2Saved,
      is_validated: isValidated,
      points_earned: getPointsEarnedFromCO2Saved(totalCO2Saved),
      quiz_answered: quizAnswered,
      user_id: userId,
      quiz_id: quizId,
    };
  };

  // Creates and submits the action, returns the submitted action id that is stored in database
  const sendUpdate = async () =>
    await API.graphql({
      query: updateSubmittedAction,
      variables: transformDataForRequest(updateData),
    });

  useEffect(() => {
    if (autoUpdateOnInit) {
      sendUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sendUpdate,
    updateData,
  };
};
