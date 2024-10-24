declare module 'apollo-upload-client' {
    import { ApolloLink } from '@apollo/client';
    import { DocumentNode } from 'graphql';
  
    export interface UploadLinkOptions {
      uri: string;
      headers?: Record<string, string>;
      includeExtensions?: boolean;
      fetch?: typeof window.fetch;
      fetchOptions?: RequestInit;
    }
  
    export function createUploadLink(options: UploadLinkOptions): ApolloLink;
  
    export default createUploadLink;
  }
  