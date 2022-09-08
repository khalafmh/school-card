import React from "react";
import {Box, Typography} from "@mui/material";
import {Person} from "@mui/icons-material";
import {constrain, isBlank} from "./utils";
import {imageToCardRatio} from "./constants";

interface ImageProps {
    imageSrc: string
    zoom: number
    panFromTop: number
    panFromLeft: number
}

interface LabelProps {
    name: string
    profession: string
    traits: string
}

const rootStyles = {
    display: "flex",
    flexDirection: "row",
    aspectRatio: "12 / 7",
    backgroundColor: "white",
    overflow: "hidden",
}

const imageStyles = (props: ImageProps) => {
    const zoomedWidth = 100 / props.zoom;
    return ({
        flex: `0 1 ${imageToCardRatio * 100}%`,
        position: "relative",
        backgroundColor: "lightGray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        [`& img`]: {
            width: `${props.zoom * 100}%`,
            height: `${props.zoom * 100}%`,
            objectFit: "cover",
            position: "absolute",
            top: `${constrain(-(100 - zoomedWidth) * props.zoom, -(props.panFromTop) * props.zoom, 0)}%`,
            left: `${constrain(-(100 - zoomedWidth) * props.zoom, -(props.panFromLeft) * props.zoom, 0)}%`,
        },
        [`& .MuiSvgIcon-root`]: {
            width: "50%",
            height: "50%",
        },
    });
}

const labelColor = `#b56968`;

const labelsContainerStyles = {
    flex: "1 1 auto",
    p: "2vw",
    ["& .MuiTypography-root"]: {
        fontFamily: "'Noto Naskh Arabic', serif",
    },
    ["& .MuiTypography-h5"]: {
        color: labelColor,
        fontSize: "5vw",

        ["& ~ .MuiTypography-h5"]: {
            borderTop: "#b56968 1px solid",
            mt: "1vw",
            pt: "1vw",
        },
    },
    ["& .MuiTypography-subtitle2"]: {
        fontSize: "3vw",
    },
}

const CardImage = (props: ImageProps) => (
    <Box sx={imageStyles(props)}>
        {isBlank(props.imageSrc) ? <Person/> : <img src={props.imageSrc} alt={"صورة الطالبة"}/>}
    </Box>
)

const CardLabels = (props: LabelProps) => {
    const name = isBlank(props.name) ? "فلانة بنت فلان الفلاني" : props.name
    const profession = isBlank(props.profession) ? "فلاحة" : props.profession
    const traits = isBlank(props.traits) ? "سطر 1\nسطر 2" : props.traits

    return (
        <Box sx={labelsContainerStyles}>
            <Typography variant="h5">اسمي</Typography>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="h5">مهنتي المستقبلية</Typography>
            <Typography variant="subtitle2">{profession}</Typography>
            <Typography variant="h5">صفاتي</Typography>
            {traits.split("\n").map((line, index) => (
                <Typography key={index} variant="subtitle2">{line}</Typography>
            ))}
        </Box>
    );
}

export const SchoolCard = (props: ImageProps & LabelProps) => {
    return (
        <Box sx={rootStyles} className={"school-card"}>
            <CardImage {...props}/>
            <CardLabels name={props.name} profession={props.profession} traits={props.traits}/>
        </Box>
    )
}
