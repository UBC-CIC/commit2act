import React, { useEffect } from 'react';

import useTranslation from '../customHooks/translations';
import { updateSubmittedAction } from '../../graphql/mutations';
import { API } from 'aws-amplify';

const ShareOnSocialPanel = ({
  quizAnswered,
  firstQuizAnswerCorrect,
  quizId,
  userId,
  totalCO2Saved,
  actionId,
  actionDate,
}) => {
  useEffect(() => {
    submitBonus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitBonus = async () => {
    //creates and submits the action, returns the submitted action id that is stored in database

    await API.graphql({
      query: updateSubmittedAction,
      variables: {
        action_id: actionId,
        date_of_action: actionDate,
        first_quiz_answer_correct: firstQuizAnswerCorrect,
        g_co2_saved: totalCO2Saved,
        is_validated: false,
        points_earned: Math.ceil(totalCO2Saved),
        quiz_answered: quizAnswered,
        user_id: userId,
        quiz_id: quizId,
      },
    });
  };
  const translation = useTranslation();

  //Update submitted action here and add quizAnswered and firstQuizAnswerCorrect

  return <div>I dare you to match my action by...</div>;
};

export default ShareOnSocialPanel;
