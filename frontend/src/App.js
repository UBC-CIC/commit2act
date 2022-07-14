import './App.css';
import { BrowserRouter } from 'react-router-dom';
import PageContainer from './views/pageContainer/PageContainer';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/material/styles';
import Login from './components/authentication/Login_material';
import { Hub } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateLoginState } from './actions/loginActions';
import theme from './themes';
import ScrollToTop from './components/ScrollToTop';

Amplify.configure(awsmobile);

function App(props) {
  const { loginState, updateLoginState } = props;

  const [currentLoginState, updateCurrentLoginState] = useState(loginState);

  useEffect(() => {
    setAuthListener();
  }, []);

  useEffect(() => {
    updateCurrentLoginState(loginState);
  }, [loginState]);

  async function setAuthListener() {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signOut':
          updateLoginState('signIn');
          break;
        default:
          break;
      }
    });
  }

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div style={{ width: '100vw', height: '100vh' }}>
          {currentLoginState !== 'signedIn' && (
            /* Login component options:
             *
             * [logo: "custom", "none"]
             * [type: "video", "image", "static"]
             * [themeColor: "standard", "#012144" (color hex value in quotes) ]
             *  Suggested alternative theme colors: #037dad, #5f8696, #495c4e, #4f2828, #ba8106, #965f94
             * [animateTitle: true, false]
             * [title: string]
             * [darkMode (changes font/logo color): true, false]
             * [disableSignUp: true, false]
             * */
            <Login
              logo={'custom'}
              type={'image'}
              themeColor={'standard'}
              animateTitle={false}
              title={'Commit2Act'}
              darkMode={true}
              disableSignUp={false}
            />
          )}
          {currentLoginState === 'signedIn' && (
            <BrowserRouter>
              <ScrollToTop />
              <PageContainer />
            </BrowserRouter>
          )}
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState.currentState,
  };
};

const mapDispatchToProps = {
  updateLoginState,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
