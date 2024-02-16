
import { redirect } from "next/navigation"
import React from "react";

export default async function SetupLayout({
    children
}:{
    children : React.ReactNode;
}){

    return (
        <>
            {children}
        </>
    )
}