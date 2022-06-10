import { createTheme } from '@mui/material/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: blue[500],
    },
    darkTheme: {
      main: '#282c34',
      card: '#4a4f59',
    },
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: '#112D4E',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#455A7F',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 18,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 'calc(2vw + 2vh)',
            color: 'black',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h7',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: '10',
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'subtitle2',
          },
          style: {
            fontSize: 17,
            color: 'black',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'body1',
          },
          style: {
            fontSize: 15,
            color: 'black',
            fontWeight: 100,
          },
        },
      ],
    },
    MuiButtonBase: {
      defaultProps: {
        color: '#112D4E',
      },
    },
  },
});

export default theme;
