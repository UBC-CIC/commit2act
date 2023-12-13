import { useCallback, useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { getActionItemsForAction } from '../graphql/queries';
import { useActiveStepContext } from './use-active-step-context';
import { useContentTranslationsContext } from '../components/contexts/ContentTranslationsContext';
import useTranslation from '../components/customHooks/translations';

export const useGetActionItems = () => {
  const { selectedAction } = useActiveStepContext();
  const [actionItems, setActionItems] = useState();
  const [loadingItems, setLoadingItems] = useState(false);
  const { contentTranslations } = useContentTranslationsContext();
  const translation = useTranslation();

  const getActionItems = useCallback(async () => {
    setLoadingItems(true);

    if (translation.getLanguage() !== 'en') {
      const relevantTranslationObject = contentTranslations.find(
        (contentTranslation) =>
          contentTranslation.langCode.toLowerCase() ===
          translation.getLanguage().toLowerCase()
      );
      const relevantAction =
        relevantTranslationObject?.translationJSON?.actions?.find(
          (action) => action.action_id === selectedAction?.action_id
        );
      setActionItems(relevantAction?.action_items || []);
      setLoadingItems(false);
      return;
    }

    try {
      const res = await API.graphql({
        query: getActionItemsForAction,
        variables: { action_id: selectedAction?.action_id },
      });
      const items = await res.data.getActionItemsForAction;
      setActionItems(items || []);
      setLoadingItems(false);
    } catch (e) {
      console.log('Unable to fetch action items', e);
      setLoadingItems(false);
    }
  }, [contentTranslations, translation, selectedAction]);

  useEffect(() => {
    if (selectedAction?.action_id && !actionItems) getActionItems();
  }, [selectedAction, actionItems, getActionItems]);

  return {
    actionItems,
    loadingItems,
  };
};
