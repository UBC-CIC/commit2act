import { createContext, useContext } from 'react';

export const ActiveStepContext = createContext({
  activeStep: 0,
  actionStyle: { color: '#fff' },
  selectedAction: null,
});

export const useActiveStepContext = () => {
  const { activeStep, actionStyle, selectedAction } =
    useContext(ActiveStepContext);
  return { activeStep, actionStyle, selectedAction };
};
