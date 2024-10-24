// typesenseClient.js
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSEHOST, // Your Typesense host
      port: 443, // or 8108 for HTTP
      protocol: 'https', // or 'http' if not using SSL
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSEADMIN, // Your Typesense API key
});

export default client;
