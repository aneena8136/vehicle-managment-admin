// import { ApolloClient, InMemoryCache, createHttpLink ,ApolloLink} from "@apollo/client";
// import { setContext } from '@apollo/client/link/context';

// // Create the HTTP Link for the GraphQL endpoint
// const httpLink = createHttpLink({
//   uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string, // Type assertion for environment variable
// });

// // Use setContext to attach the JWT token in headers for authentication
// const authLink = setContext((_, { headers }) => {
//   // Retrieve the token from localStorage
//   const token = localStorage.getItem('token');
//   console.log('Authorization Header:', token ? `Bearer ${token}` : 'No token'); // Log the header
//   // Return the headers with the Authorization token, if available
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "", // Attach token if it exists
//     },
//   };
// });

// const loggingLink = new ApolloLink((operation, forward) => {
//   console.log(`Starting request for ${operation.operationName}`);
//   const { headers } = operation.getContext();
//   console.log('Headers:', headers); // Log the headers
//   return forward(operation).map((response) => {
//     console.log(`Response for ${operation.operationName}:`, response);
//     return response;
//   });
// });

// // Create Apollo Client instance with the authLink and httpLink
// const client = new ApolloClient({
//   link: ApolloLink.from([loggingLink, authLink.concat(httpLink)]),
//   cache: new InMemoryCache(), // Use in-memory caching
// });

// // Export the Apollo Client instance
// export default client;

import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import {createUploadLink} from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

// Create the Upload Link for handling file uploads
const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL , // Use the correct environment variable
});

// Use setContext to attach the JWT token in headers for authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  console.log('Authorization Header:', token ? `Bearer ${token}` : 'No token'); // Log the token for debugging
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach token if exists
    },
  };
});

const loggingLink = new ApolloLink((operation, forward) => {
  console.log("eneterd operation")
  console.log(`Starting request for ${operation.operationName}`);
  const { headers } = operation.getContext();
  console.log('Headers:', headers); // Log the headers
  return forward(operation).map((response) => {
    console.log(`Response for ${operation.operationName}:`, response);
    return response;
  });
});

// Create Apollo Client instance with the authLink and uploadLink
const client = new ApolloClient({
  link: ApolloLink.from([loggingLink, authLink.concat(uploadLink)]), // Use uploadLink here
  cache: new InMemoryCache(), // Use in-memory caching
});

export default client;

