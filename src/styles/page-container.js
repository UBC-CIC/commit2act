import { makeStyles } from 'tss-react/mui';

const drawerWidth = 312;

export const usePageContainerStyles = makeStyles()((theme) => {
  return {
    menuClosed: {
      pointerEvents: 'none',
    },
    drawerContainer: {
      overflow: 'auto',
      backgroundColor: '#303839',
      height: '100%',
      width: drawerWidth,
      '& .MuiListItem-button, & .MuiListItemButton-root': {
        paddingTop: 16,
        paddingBottom: 16,
      },
      '& svg': {
        fontSize: 30,
      },
      '& .MuiDivider-root': {
        margin: '1rem 0',
      },
    },
    content: {
      flexGrow: 1,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
      },
      padding: theme.spacing(8),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      maxWidth: '100%',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: '70%',
      },
    },
    logAction: {
      background: 'linear-gradient(274.34deg, #33AF99 6.31%, #56C573 77.35%)',
      marginBottom: 10,
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 5,
      width: 'auto',
      '& span': {
        color: '#000',
        fontWeight: 500,
      },
      '& img': {
        fontSize: 30,
        color: '#000',
        filter: 'invert(1)',
      },
    },
    skip_button: {
      position: 'absolute',
      background: '#fff',
      color: '#262a2c',
      textDecoration: 'none',
      borderRadius: '0.25em',
      padding: '0.5em 1em',
      margin: '0.25em',
      transform: 'translateY(-150%)',
      transition: 'transform 0.3s',
      '&:focus': {
        transform: 'translateY(0%)',
        zIndex: '2000',
      },
    },
  };
});
