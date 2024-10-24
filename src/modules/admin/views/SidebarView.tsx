"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import Sidebar from "../components/Sidebar";

export default function SidebarView(){
    return(
        <ApolloProvider client={client}>
            <Sidebar/>
        </ApolloProvider>
    )
}