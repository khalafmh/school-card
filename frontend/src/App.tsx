import React, {useCallback, useState} from "react";
import {Box, Button, createTheme, Dialog, TextField, Theme, ThemeProvider, Typography} from "@mui/material";
import {SchoolCard} from "./SchoolCard";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {UploadFile} from "@mui/icons-material";
import {cropImagePercent} from "./utils";
import {aspectRatio, imageToCardRatio} from "./constants";
import ReactCrop, {Crop} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
}

function App() {
    const [name, setName] = useState("")
    const [profession, setProfession] = useState("")
    const [traits, setTraits] = useState("")
    const [image, setImage] = useState("")
    const [cardImageData, setCardImageData] = useState("")
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [crop, setCrop] = useState<Crop>()
    const originalImageRef = useCallback(node => {
        if (node != null) {
            setTimeout(() => {
                const originalImageAspectRatio = node.width / node.height
                const desiredImageAspectRatio = aspectRatio * imageToCardRatio;
                const percentBasedAspectRatio = desiredImageAspectRatio / originalImageAspectRatio
                setCrop({
                    unit: "%",
                    x: 0,
                    y: 0,
                    width: Math.min(100, 100 * percentBasedAspectRatio),
                    height: Math.min(100, 100 / percentBasedAspectRatio),
                })
            }, 10)
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <RTL>
                <Box sx={rootStyles}>
                    <Typography variant={"h2"} component={"h1"} align={"center"}>بطاقة الطالبة</Typography>
                    <SchoolCard
                        imageSrc={cardImageData}
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
                            <ReactCrop
                                aspect={aspectRatio * imageToCardRatio}
                                keepSelection
                                crop={crop}
                                onChange={(_, c) => setCrop(c)}
                            >
                                <img ref={originalImageRef} src={image} alt={"صورة الطالبة قبل التعديل"}/>
                            </ReactCrop>
                            <Button
                                variant={"contained"}
                                onClick={async () => {
                                    setImageDialogOpen(false);
                                    const croppedImageDataUrl = await cropImagePercent(
                                        image,
                                        crop.width,
                                        crop.height,
                                        crop.x,
                                        crop.y
                                    )
                                    setCardImageData(croppedImageDataUrl)
                                }}
                            >
                                موافق
                            </Button>
                        </Box>
                    </Dialog>
                </Box>
            </RTL>
        </ThemeProvider>
    )
}

export default App
