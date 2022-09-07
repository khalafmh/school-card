import React, {useLayoutEffect, useRef, useState} from "react";
import {Box, Button, createTheme, Dialog, TextField, Theme, ThemeProvider, Typography} from "@mui/material";
import {SchoolCard} from "./SchoolCard";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {UploadFile} from "@mui/icons-material";
import {constrain} from "./utils";

const cornerWidth = 5;

interface ImageCropValues {
    panFromTop: number
    panFromLeft: number
    width: number
    height: number
}

const theme = createTheme({
    direction: "rtl",
} as any)

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
    return <CacheProvider value={cacheRtl}>{props.children as any}</CacheProvider>;
}

const rootStyles = (theme: Theme) => ({
    minHeight: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    px: "8px",
    py: "48px",
    backgroundColor: theme.palette.grey.A200,
    ["& > form"]: {
        display: "contents",
    },
    ["& .school-card"]: {
        boxShadow: 10,
    },
    ["& > *, & > form > :not(.default-width)"]: {
        width: ["80vw"],
    },
})

// noinspection JSSuspiciousNameCombination
const dialogStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    p: "8px",
    ["& .image-container"]: {
        position: "relative",
        ["& img"]: {
            width: "100%",
            objectFit: "contain"
        },
        ["& .image-area-selection"]: {
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0%",
            left: "0%",
            cursor: "grab",
            ["& .corner"]: {
                position: "absolute",
                width: `${cornerWidth}%`,
                height: `${cornerWidth}%`,
            },
        },
    },
}

const ImageAreaSelection = (props: ImageCropValues & { onChange: (values: ImageCropValues) => void }) => {
    const {panFromTop, panFromLeft, width, height} = props
    const cornerColor = "black"
    const cornerThickness = "4px"
    const ref = useRef<HTMLElement>()
    const topLeftRef = useRef<HTMLElement>()
    const topRightRef = useRef<HTMLElement>()
    const bottomRightRef = useRef<HTMLElement>()
    const bottomLeftRef = useRef<HTMLElement>()

    useLayoutEffect(() => {
        const abortController = new AbortController()
        const abortSignal = abortController.signal
        setTimeout(() => {
            const parent = ref.current.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const baseX = parentRect.right
            const baseY = ref.current.getBoundingClientRect().y
            const parentDragoverListener = e => e.preventDefault();
            parent.addEventListener("dragover", parentDragoverListener, {signal: abortSignal})
            // ref.current.addEventListener("drag", e => {
            //     // TODO
            //     console.log(e)
            //     props.onChange({
            //         panFromLeft: ((baseX - e.clientX) / parentRect.width) * 100,
            //         panFromTop: ((e.clientY - baseY) / parentRect.height) * 100,
            //         width: width,
            //         height: height,
            //     })
            // })
            const cornerDragStartListeners = Array.from(ref.current.children).map(() =>
                e => {
                    e.dataTransfer.setDragImage(document.createElement("div"), 0, 0)
                    e.dataTransfer.effectAllowed = "move"
                }
            )
            const cornerDragListeners = Array.from(ref.current.children).map(corner =>
                (e: MouseEvent) => {
                    const newRawPanFromLeft = corner === topLeftRef.current || corner === bottomLeftRef.current
                        ? ((baseX - e.clientX) / parentRect.width) * 100
                        : panFromLeft;
                    const newPanFromLeft = constrain(0, newRawPanFromLeft, 100 - cornerWidth - 5)
                    const newRawPanFromTop = corner === topLeftRef.current || corner === topRightRef.current
                        ? ((e.clientY - baseY) / parentRect.height) * 100
                        : panFromTop
                    const newPanFromTop = constrain(0, newRawPanFromTop, 100 - cornerWidth - 5)
                    const newRawWidth = corner === topLeftRef.current || corner === bottomLeftRef.current
                        ? width - (newPanFromLeft - panFromLeft)
                        : ((baseX - e.clientX) / parentRect.width) * 100 - newPanFromLeft
                    const newWidth = constrain(2 * cornerWidth, newRawWidth, 100 - newPanFromLeft)
                    const newRawHeight = corner === topLeftRef.current || corner === topRightRef.current
                        ? height + panFromTop - newPanFromTop
                        : ((e.clientY - baseY) / parentRect.height) * 100 - newPanFromTop
                    const newHeight = constrain(2 * cornerWidth, newRawHeight, 100 - newPanFromTop)
                    props.onChange({
                        panFromLeft: newPanFromLeft,
                        panFromTop: newPanFromTop,
                        width: newWidth,
                        height: newHeight,
                    })
                })
            Array.from(ref.current.children).forEach((corner, index) => {
                corner.addEventListener("dragstart", cornerDragStartListeners[index], {signal: abortSignal})
                corner.addEventListener("drag", cornerDragListeners[index], {signal: abortSignal})
            })
        }, 1)
        return () => {
            abortController.abort()
        }
    }, [panFromLeft, panFromTop, width, height])

    const topLeft = (
        <Box className={"corner"} ref={topLeftRef} draggable sx={{
            top: `${panFromTop}%`,
            left: `${panFromLeft}%`,
            borderTop: `${cornerColor} ${cornerThickness} solid`,
            borderLeft: `${cornerColor} ${cornerThickness} solid`,
            cursor: "nesw-resize",
        }}/>
    )
    const topRight = (
        <Box className={"corner"} ref={topRightRef} draggable sx={{
            top: `${panFromTop}%`,
            left: `calc(${width}% - ${cornerWidth}% + ${panFromLeft}%)`,
            borderTop: `${cornerColor} ${cornerThickness} solid`,
            borderRight: `${cornerColor} ${cornerThickness} solid`,
            cursor: "nwse-resize",
        }}/>
    )
    const bottomRight = (
        <Box className={"corner"} ref={bottomRightRef} draggable sx={{
            top: `calc(${height}% - ${cornerWidth}% - ${cornerThickness} + ${panFromTop}%)`,
            left: `calc(${width}% - ${cornerWidth}% + ${panFromLeft}%)`,
            borderBottom: `${cornerColor} ${cornerThickness} solid`,
            borderRight: `${cornerColor} ${cornerThickness} solid`,
            cursor: "nesw-resize",
        }}/>
    )
    const bottomLeft = (
        <Box className={"corner"} ref={bottomLeftRef} draggable sx={{
            top: `calc(${height}% - ${cornerWidth}% - ${cornerThickness} + ${panFromTop}%)`,
            left: `${panFromLeft}%`,
            borderBottom: `${cornerColor} ${cornerThickness} solid`,
            borderLeft: `${cornerColor} ${cornerThickness} solid`,
            cursor: "nwse-resize",
        }}/>
    )

    return (
        <Box className={"image-area-selection"} ref={ref}>
            {topLeft}
            {topRight}
            {bottomRight}
            {bottomLeft}
        </Box>
    );
}

function App() {
    const [name, setName] = useState("")
    const [profession, setProfession] = useState("")
    const [traits, setTraits] = useState("")
    const [image, setImage] = useState("")
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [panFromTop, setPanFromTop] = useState(0)
    const [panFromLeft, setPanFromLeft] = useState(0)
    const [cropWidth, setCropWidth] = useState(100)
    const [cropHeight, setCropHeight] = useState(100)

    return (
        <ThemeProvider theme={theme}>
            <RTL>
                <Box sx={rootStyles}>
                    <Typography variant={"h2"} component={"h1"} align={"center"}>بطاقة الطالبة</Typography>
                    <SchoolCard
                        imageSrc={image}
                        zoom={Math.min(100 / cropWidth, 100 / cropHeight)}
                        panFromLeft={panFromLeft}
                        panFromTop={panFromTop}
                        name={name}
                        profession={profession}
                        traits={traits}
                    />
                    <form>
                        <Button variant={"outlined"} startIcon={<UploadFile/>} component="label">
                            الصورة
                            <input
                                hidden
                                type={"file"}
                                accept={"image/jpeg,image/png,.jpg,.jpeg,.png"}
                                onClick={e => (e.target as HTMLInputElement).value = ""}
                                onInput={e => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files?.[0] != null) {
                                        setImage(URL.createObjectURL(target.files?.[0]))
                                        setImageDialogOpen(true)
                                    }
                                }}
                            />
                        </Button>
                        <TextField
                            variant={"filled"}
                            label={"الاسم"}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            variant={"filled"}
                            label={"المهنة المستقبلية"}
                            value={profession}
                            onChange={e => setProfession(e.target.value)}
                        />
                        <TextField
                            variant={"filled"}
                            label={"الصفات"}
                            multiline
                            minRows={2}
                            value={traits}
                            onChange={e => setTraits(e.target.value)}
                        />
                        <Button variant={"contained"} className={"default-width"}>حفظ</Button>
                    </form>
                    <Dialog open={imageDialogOpen}>
                        <Box sx={dialogStyles}>
                            <Box className={"image-container"}>
                                <img src={image} alt={"صورة الطالبة"}/>
                                <ImageAreaSelection
                                    panFromTop={panFromTop}
                                    panFromLeft={panFromLeft}
                                    width={cropWidth}
                                    height={cropHeight}
                                    onChange={(values: ImageCropValues) => {
                                        setPanFromTop(values.panFromTop)
                                        setPanFromLeft(values.panFromLeft)
                                        setCropWidth(values.width)
                                        setCropHeight(values.height)
                                    }}
                                />
                            </Box>
                            <Button variant={"contained"} onClick={() => setImageDialogOpen(false)}>موافق</Button>
                        </Box>
                    </Dialog>
                </Box>
            </RTL>
        </ThemeProvider>
    )
}

export default App
