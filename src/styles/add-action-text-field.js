const commonStyles = {
  fontSize: 'inherit',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  lineHeight: '1.35',
  margin: '0',
  padding: '0',
  color: 'white',
  display: 'block',
  position: 'initial',
  width: 'auto',
  boxSizing: 'border-box',
};

export const getContainerStyles = (color) => ({
  ...commonStyles,
  '--action-style-color': color,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
  margin: '2.5em auto',
  maxWidth: '36em',
});

export const labelStyles = {
  ...commonStyles,
  flex: '1 1',
  flexBasis: {
    xs: '50%',
    sm: '60%',
  },
  overflow: 'visible',
  transform: 'none',
  whiteSpace: 'normal',
  fontWeight: 'bold',
  fontSize: {
    xs: '1em',
    sm: '1.1em',
    md: '1.15em',
  },
  paddingRight: '1em',
  transition: 'color 100ms',
  '&.Mui-focused': {
    color: 'var(--action-style-color)',
  },
};

export const inputStyles = {
  ...commonStyles,
  flex: '0 1',
  flexBasis: {
    xs: '50%',
    sm: '40%',
  },
  maxWidth: '100%',
  'label + &': {
    marginTop: '0',
  },
  '& > input': {
    ...commonStyles,
    height: 'auto',
    textAlign: 'center',
    background: 'white',
    padding: '0.5em 0.75em',
    borderRadius: '2em',
    color: 'black',
    width: '100%',
    outline: 'solid 0.125em var(--action-style-color)',
    transition: 'outline 100ms',
    '&:focus': {
      outline: 'solid 0.3em var(--action-style-color)',
    },
  },
};

export const helperTextStyles = {
  ...commonStyles,
  fontSize: {
    xs: '0.75em',
    sm: '0.85em',
  },
  marginTop: '0.75em',
  flexBasis: '100%',
  '&.Mui-focused': {
    color: 'white',
  },
};
