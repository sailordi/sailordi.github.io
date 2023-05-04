import {ApolloClient,InMemoryCache,ApolloPeovider,HttpLink,from,onError} from 'apollo-client'
import {Data} from 'const.js'

const client = new ApolloClient({
    uri: `https://${Data.Domain}/api/graphql-engine/v1/graphql`,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });