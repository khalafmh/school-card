import React, {useState} from "react";
import {SchoolCard} from "./SchoolCard";
import {Box, Button} from "@mui/material";

const hiddenInputStyles = {
    opacity: 0,
    position: "fixed",
    left: 0,
    top: 0,
}

export const SchoolCardPage = (props: any) => {
    const [imageDataUrl, setImageDataUrl] = useState("")
    console.log("update")
    console.log(imageDataUrl)

    const queryParams = new URL(window.location.href).searchParams;
    const name = queryParams.get("name") ?? ""
    const profession = queryParams.get("profession") ?? ""
    const traits = queryParams.get("traits") ?? ""
    return (
        <div>
            <Box sx={hiddenInputStyles}>
                <input
                    id="imageDataUrl"
                    type="text"
                    maxLength={20971520}
                />
                <Button
                    id="imageUpdateButton"
                    onClick={e => {
                        setImageDataUrl((document.getElementById("imageDataUrl")!! as HTMLInputElement).value);
                    }}
                />
            </Box>
            <SchoolCard imageSrc={imageDataUrl} name={name} profession={profession} traits={traits}/>
        </div>
    )
}