import './App.css';
import SelfReportMenu from './components/SelfReportMenu';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import Navbar from './components/Navbar';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Navbar />
        <header className="App-header">
          <SelfReportMenu />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
