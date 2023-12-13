import { createContext, useContext } from 'react';

export const ActiveStepContext = createContext({
  activeStep: 0,
  actionStyle: { color: '#fff' },
  selectedAction: null,
  setActiveStep: () => {},
});

export const useActiveStepContext = () => {
  return useContext(ActiveStepContext);
};
