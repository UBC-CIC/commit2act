import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BaseComponent } from './prop-types/component';
import { BrowserRouter } from 'react-router-dom';
import PageContainer from './views/pageContainer/PageContainer';
import { Amplify, Hub } from 'aws-amplify';
import awsmobile from './aws-exports';
import { StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/material/styles';
import Login from './components/authentication/Login_material';
import { connect } from 'react-redux';
import { updateLoginState } from './actions/loginActions';
import theme from './themes';
import ScrollToTop from './components/ScrollToTop';
import { useContentTranslationsContext } from './components/contexts/ContentTranslationsContext';
import { getAllTranslations } from './services/translations';
import './App.css';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectURL, productionRedirectURL] =
  awsmobile.oauth.redirectSignIn.split(',');

const updatedAwsConfig = {
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: isLocalhost ? localRedirectURL : productionRedirectURL,
    redirectSignOut: isLocalhost ? localRedirectURL : productionRedirectURL,
  },
};

Amplify.configure(updatedAwsConfig);

function App(props) {
  const { loginState, updateLoginState } = props;

  const [currentLoginState, updateCurrentLoginState] = useState(loginState);
  const { setContentTranslations } = useContentTranslationsContext();

  useEffect(() => {
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

    setAuthListener();
  }, [updateLoginState]);

  useEffect(() => {
    updateCurrentLoginState(loginState);
  }, [loginState]);

  useEffect(() => {
    const downloadTranslations = async (langCode) => {
      let translations;
      switch (langCode) {
        case 'fr':
          translations = await getAllTranslations();
          setContentTranslations(translations);
          break;
        default:
          break;
      }
    };

    downloadTranslations('fr');
  }, [setContentTranslations]);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div style={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
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

App.propTypes = {
  ...BaseComponent,
  loginState: PropTypes.object,
  updateLoginState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState.currentState,
  };
};

const mapDispatchToProps = {
  updateLoginState,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
