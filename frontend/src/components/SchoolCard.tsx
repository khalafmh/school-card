import React from "react";
import {Box, Typography} from "@mui/material";
import {Person} from "@mui/icons-material";
import {isBlank} from "../utils";
import {aspectRatio, imageToCardRatio} from "../constants";

interface ImageProps {
    imageSrc: string
}

interface LabelProps {
    name: string
    profession: string
    traits: string
    widthModifier?: number
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

const labelsContainerStyles = (widthModifier: number) => ({
    flex: "1 1 auto",
    p: `calc(2.5vw * ${widthModifier})`,
    ["& .MuiTypography-root"]: {
        fontFamily: "'Noto Naskh Arabic', sans-serif",
    },
    ["& .MuiTypography-h5"]: {
        color: labelColor,
        fontSize: `calc(6.25vw * ${widthModifier})`,

        ["& ~ .MuiTypography-h5"]: {
            borderTop: `#b56968 calc(1.25px * ${widthModifier}) solid`,
            mt: `calc(1.25vw * ${widthModifier})`,
            pt: `calc(1.25vw * ${widthModifier})`,
        },
    },
    ["& .MuiTypography-subtitle2"]: {
        fontSize: `calc(3.75vw * ${widthModifier})`,
    },
})

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
        <Box sx={labelsContainerStyles(props?.widthModifier ?? 1)}>
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
        <CardLabels
            name={props.name}
            profession={props.profession}
            traits={props.traits}
            widthModifier={props.widthModifier}
        />
    </Box>
))
