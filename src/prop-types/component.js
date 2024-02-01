import PropTypes from 'prop-types';

// This can be replaced with a TS interface extending React's
// Component type when the codebase is migrated to fully TS.
export const BaseComponent = {
  children: PropTypes.node,
  className: PropTypes.string,
};
