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

    // Mobile Menu Styling Work

    mobileNav: {
      display: 'flex',
      height: '80px',
      width: '100%',
      padding: '0 15px',

      '> *': {
        flexGrow: '1',
        flexBasis: '0',
        minWidth: '0',
      },

      '.MuiListItemButton-root': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      '.MuiListItemIcon-root': {
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '25px'
      }
    },
    drawerClose: {
      position: 'absolute',
      top: '60px',
      right: '0',
    },
    moreDrawer: {
      width: '40vw',
      padding: '100px 20px 0 20px',
      position: 'relative',

      '.MuiList-root': {
        borderBottom: '1px solid #A9A9A9',
        marginBottom: '20px'
      }
    },
    menuButton: {
      display: 'flex-inline',
      flexDirection: 'column',
      flexGrow: '1',
      flexBasis: '0',
      alignItems: 'center',
      fontSize: '1rem',
      padding: '8px 16px',
      borderRadius: '0',
      margin: '0',
      'span': {
        margin: '8px 0 14px 0',
      },

      '&:hover, &:focus': {
        borderRadius: '0',
      }
    },
    languageLabel: {
      paddingLeft: '15px',
    },
    logActionMobile: {
      flexGrow: '0',
      minWidth: 'auto',
      background: '#380FD1',
      borderRadius: '99em',
      marginTop: '-20px',
      alignSelf: 'flex-start',
      height: '60px',
      width: '60px',
      display: 'inline-flex',
      alignItems: 'center',
      border: '4px solid #121212',

      '&:hover': {
        background: '#380FD1',
      },

      '.MuiListItemIcon-root': {
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
      },
    },
    logOut: {
      'span': {
        marginRight: '10px',
      }
    }
  };
});
