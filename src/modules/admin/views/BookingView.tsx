"use client"
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import ViewBookings from "../components/ViewBooking";

export default function BookingView(){
    return(
        <ApolloProvider client={client}>
           <ViewBookings/>
        </ApolloProvider>
    )
}