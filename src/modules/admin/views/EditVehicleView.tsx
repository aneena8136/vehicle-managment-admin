"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import { useParams } from 'next/navigation';


import EditVehicleForm from "../../admin/components/EditVehicleForm";

export default function EditVehicleView(){
    const params = useParams();
    const id = params.id as string;
    return(
        <ApolloProvider client={client}>
        <EditVehicleForm id={id}/>
        </ApolloProvider>
    )
}