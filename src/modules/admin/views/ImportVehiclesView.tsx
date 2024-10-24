"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import ImportVehicles from "../components/ImportVehicle";

export default function ImportVehiclesView(){
    return(
        <ApolloProvider client={client}>
            <ImportVehicles/>
        </ApolloProvider>
    )
}