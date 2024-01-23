import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend default expect for jest-axe tests
expect.extend(toHaveNoViolations);

// Mock window object native functions
global.scrollTo = jest.fn();

// Mock common hooks and dependencies
jest.mock('./components/contexts/LanguageContext', () => ({
  useLanguageContext: () => ({
    language: 'en',
  }),
}));
