import React from "react";
import {Box} from "@mui/material";
import email from "../icons/email.png";
import whatsapp from "../icons/whatsapp.png";
import telegram from "../icons/telegram.png";
import {Phone} from "@mui/icons-material";

const rootStyles = {
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
    ["& > .content"]: {
        display: "grid",
        gridTemplateColumns: [2, 2, 4].map(count => `repeat(${count}, 1fr)`),
        alignItems: "start",
        justifyItems: "start",
        textAlign: "center",
        width: ["100%", "70%", "90%"],
    },
}

const contactStyles = {
    display: "flex",
    flexDirection: "row",
    gap: "4px",
    alignItems: "center",
    justifyContent: "flex-start",
    textDecoration: "none",
    color: "inherit",
    ["& img, & .MuiSvgIcon-root"]: {
        width: "24px",
        clipPath: "circle()",
    },
    ["& .MuiSvgIcon-root"]: {
        p: "2px",
        backgroundColor: "white",
        color: "black",
    },
}

const Contact = ({href, icon, alt, children}: { href: string, icon: any, alt?: string, children: any }) => {
    return (
        <Box sx={contactStyles} component={"a"} href={href}>
            {typeof (icon) === "string" ? <img src={icon} alt={alt || "ايقونة قناة التواصل"}/> : icon}
            {children}
        </Box>
    )
}

export const ContactMeList = (props: any) => (
    <Box sx={rootStyles} dir={"ltr"}>
        <Box className={"content"}>
            <Contact href={"mailto:m@mahdi.pro"} icon={email} alt={"email"}>m@mahdi.pro</Contact>
            <Contact href={"tel:+966541447555"} icon={<Phone/>} alt={"phone"}>+966-541447555</Contact>
            <Contact href={"https://wa.me/966541447555"} icon={whatsapp} alt={"whatsapp"}>+966-541447555</Contact>
            <Contact href={"https://t.me/khalafmh"} icon={telegram} alt={"telegram"}>@khalafmh</Contact>
        </Box>
    </Box>
)