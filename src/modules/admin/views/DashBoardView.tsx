"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import Dashboard from "../components/Dashboard";

export default function DashboardView(){
    return(
        <ApolloProvider client={client}>
            <Dashboard/>
        </ApolloProvider>
    )
}