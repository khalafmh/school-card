import React from "react";
import {Box, Typography} from "@mui/material";
import {Person} from "@mui/icons-material";
import {isBlank} from "./utils";
import {aspectRatio, imageToCardRatio} from "./constants";

interface ImageProps {
    imageSrc: string
}

interface LabelProps {
    name: string
    profession: string
    traits: string
}

const rootStyles = {
    display: "flex",
    flexDirection: "row",
    aspectRatio: aspectRatio.toString(),
    backgroundColor: "white",
    overflow: "hidden",
}

const imageStyles = {
    flex: `0 1 ${imageToCardRatio * 100}%`,
    position: "relative",
    backgroundColor: "lightGray",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    [`& img`]: {
        width: `100%`,
        height: `100%`,
        objectFit: "cover",
    },
    [`& .MuiSvgIcon-root`]: {
        width: "50%",
        height: "50%",
    },
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
    <Box sx={imageStyles}>
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

export const SchoolCard = React.forwardRef((props: ImageProps & LabelProps, ref: any) => (
    <Box ref={ref} sx={rootStyles} className={"school-card"}>
        <CardImage imageSrc={props.imageSrc}/>
        <CardLabels name={props.name} profession={props.profession} traits={props.traits}/>
    </Box>
))
