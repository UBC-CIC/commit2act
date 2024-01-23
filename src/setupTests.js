// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend default expect for jest-axe tests
expect.extend(toHaveNoViolations);

// Mock common hooks and dependencies
jest.mock('./components/contexts/LanguageContext', () => ({
  useLanguageContext: () => ({
    language: 'en',
  }),
}));
