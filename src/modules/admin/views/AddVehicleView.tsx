"use client"

import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import AddVehicleForm from "../components/AddVehicleForm";


export default function AddVehicleView()  {
    return(
        <ApolloProvider client={client}>
            <AddVehicleForm/>
        </ApolloProvider>
    )
}