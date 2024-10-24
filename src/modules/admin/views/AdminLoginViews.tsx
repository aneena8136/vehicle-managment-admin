"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";



import LoginForm from "../components/login/LoginForm";

export default function AdminLoginView(){
    
    return(
        <ApolloProvider client={client}>
        <LoginForm/>
        </ApolloProvider>
    )
}