import './App.css';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SelfReportMenu from './components/SelfReportMenu';
import FindGroupPage from './pages/FindGroupPage';
import InfoPage from './pages/InfoPage';
import LandingPage from './pages/LandingPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/find-group" element={<FindGroupPage />} />
          <Route exact path="/report-action" element={<SelfReportMenu />} />
          <Route exact path="/info" element={<InfoPage />} />
          <Route
            exact
            path="/account-settings"
            element={<AccountSettingsPage />}
          />
          {/* catch all route */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
