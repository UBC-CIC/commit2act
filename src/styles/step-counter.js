export const getStepCounterStyles = (color) => ({
  '--action-styles-color': color,
  margin: '0 auto',
  mt: {
    xs: '1.5em',
    sm: '2em',
    md: '2.5em',
  },
  textAlign: 'center',
  fontSize: {
    xs: '0.725rem',
    sm: '0.825rem',
    md: '0.925rem',
    lg: '1.175rem',
  },
  ol: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    padding: '0',
    margin: '1em 0',
    gap: {
      xs: '0.75em',
      lg: '1.25em',
    },
  },
  li: {
    color: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: {
      xs: 'block',
      md: 'flex',
    },
    '&:before': {
      background: 'rgba(255,255,255,0.75)',
      borderRadius: '1em',
      outline: 'solid 0.15em transparent',
      outlineOffset: '0.15em',
      lineHeight: '1.75',
      display: 'block',
      color: 'black',
      width: {
        xs: '2.25em',
        md: '1.75em',
      },
      height: {
        xs: '0.5em',
        md: '1.75em',
      },
    },
    '&.current:before, &.completed:before': {
      background: 'var(--action-styles-color)',
    },
    '&.current:before': {
      outlineColor: 'var(--action-styles-color)',
    },
  },
  '.title': {
    margin: {
      xs: '0',
      md: '0 0.5em',
      lg: '0 0.75em',
    },
    display: {
      xs: 'none',
      md: 'block',
    },
  },
});
