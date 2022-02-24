import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
});
const client = new ApolloClient({
  cache,
  link,
});

export default client;
