import PropTypes from 'prop-types';

const { node, string, object, oneOfType, func } = PropTypes;

// This can be replaced with a TS interface extending React's
// Component type when the codebase is migrated to fully TS.
export const BaseComponent = {
  children: node,
  className: string,
  style: object,
};

export const LinkComponent = {
  ...BaseComponent,
  to: oneOfType([string, object]),
  onClick: func,
};
