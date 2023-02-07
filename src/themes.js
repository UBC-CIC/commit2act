import { createTheme } from '@mui/material/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
  palette: {
    mode:'dark',
    primary: {
      main: '#BCF10C',
    },
    secondary: {
      main: '#380FD1',
    },
    error: {
      main: '#ff8512',
    },
    invalid: {
      main: '#ff8512',
    },
    darkTheme: {
      main: '#262a2c',
      card: '#16191f',
    },
  },
  typography: {
    fontFamily: [
      'Inter', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',

    ].join(','),
  },
  components: {
    MuiSvgIcon: {
     variants: [
      {
        props: {
          variant: 'invalid',
        },
        style: {
          color: '#ff8512',
        },
      },
      ]
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#131516', 
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: {
            variant: 'contained',
          },
          style: {
            background: '#380FD1',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'text',
          },
          style: {
            textDecoration: 'underline',
            fontSize: 17,
            fontWeight: 500,
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#131516', 
        },
      },
    },
    MuiFormLabel: {
      fontSize: '18px'
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#212426', 
          backgroundImage: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#fff'
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        main: '#404642',
      },
    },
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d0f0f', 
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'p',
          },
          style: {
            fontSize: 16,
            color: '#fff',
          },
        },
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 60,
            color: '#fff',
            fontWeight: 600,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#fff',
            fontWeight: 500,
            letterSpacing: -0.85,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 18,
            color: '#fff',
            fontWeight: 400,
          },
        },

        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: '#000',
            fontWeight: 600,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 'calc(2vw + 2vh)',
            color: '#000',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h6',
          },
          style: {
            color: '#5BD048',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h7',
          },
          style: {
            fontSize: 20,
            color: '#fff',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: '10',
            color: '#fff',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'subtitle2',
          },
          style: {
            fontSize: 17,
            color: '#BCF10C',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'body1',
          },
          style: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 400,
          },
        },
      ],
    }
  },
});

export default theme;
