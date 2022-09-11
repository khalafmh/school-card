import React from "react";
import {SchoolCard} from "./SchoolCard";

export const SchoolCardPage = (props: any) => {
    const queryParams = new URL(window.location.href).searchParams;
    const name = queryParams.get("name") ?? ""
    const profession = queryParams.get("profession") ?? ""
    const traits = queryParams.get("traits") ?? ""
    const imageSrc = queryParams.get("imageSrc") ?? ""
    return (
        <SchoolCard imageSrc={imageSrc} name={name} profession={profession} traits={traits}/>
    )
}