import React, {useCallback, useState} from "react";
import {
    Alert,
    Box,
    Button,
    createTheme,
    Dialog,
    Snackbar,
    TextField,
    Theme,
    ThemeProvider,
    Typography
} from "@mui/material";
import {SchoolCard} from "./components/SchoolCard";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {UploadFile} from "@mui/icons-material";
import {cropImagePercent, initiateDownload} from "./utils";
import {aspectRatio, imageToCardRatio} from "./constants";
import ReactCrop, {Crop} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {ContactMeList} from "./components/ContactMeList";

const theme = createTheme({
    direction: "rtl",
} as any)

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props: any) {
    return <CacheProvider value={cacheRtl}>{props.children as any}</CacheProvider>;
}

const rootStyles = (theme: Theme) => ({
    minHeight: "inherit",
    backgroundColor: theme.palette.grey.A200,
    ["& .footer"]: {
        backgroundColor: "#222222",
        color: "white",
        p: "8px",
        fontFamily: "'Noto Naskh Arabic', Roboto, sans-serif",
        ["& p:first-of-type"]: {
            mt: 0,
        },
        ["& p:last-of-type"]: {
            mb: 0,
        },
    },
})

const mainStyles = (theme: Theme) => ({
    minHeight: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    px: "8px",
    py: "48px",
    ["& > form"]: {
        display: "contents",
    },
    ["& .school-card"]: {
        boxShadow: 10,
        width: ["80vw"],
    },
    ["& > *, & > form > :not(.default-width)"]: {
        width: ["80vw", "60vw", "50vw", "40vw"],
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
    const [error, setError] = useState<Error | null>(null)
    const [infoMessage, setInfoMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const originalImageRef = useCallback((node: any) => {
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
            }, 500)
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <RTL>
                <Box sx={rootStyles}>
                    <Box sx={mainStyles}>
                        <Typography variant={"h2"} component={"h1"} align={"center"}>بطاقة الطالبة</Typography>
                        <SchoolCard
                            imageSrc={cardImageData}
                            name={name}
                            profession={profession}
                            traits={traits}
                            widthModifier={80 / 100}
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
                            <Button
                                variant={"contained"}
                                className={"default-width"}
                                onClick={async () => {
                                    setInfoMessage("بانتظار التنزيل")
                                    const error = await initiateDownload(name, profession, traits, cardImageData);
                                    setInfoMessage(null)
                                    setSuccessMessage(null)
                                    setError(null)
                                    if (error != null) {
                                        console.error(error)
                                        setError(error)
                                    } else {
                                        setSuccessMessage("تم التنزيل")
                                    }
                                }}
                            >
                                حفظ
                            </Button>
                        </form>
                    </Box>
                    <Box className={"footer"}>
                        <p>
                            تطوير: مهدي الخلف
                            <br/>
                            للتواصل:
                        </p>
                        <ContactMeList/>
                    </Box>
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
                                    if (crop == null) return
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
                    <Snackbar
                        open={error != null}
                        onClose={() => setError(null)}
                        autoHideDuration={5000}
                    >
                        <Alert severity="error" onClose={() => setError(null)}>{error?.message}</Alert>
                    </Snackbar>
                    <Snackbar
                        open={infoMessage != null}
                        onClose={() => setInfoMessage(null)}
                        autoHideDuration={5000}
                    >
                        <Alert severity="info" onClose={() => setInfoMessage(null)}>{infoMessage ?? ""}</Alert>
                    </Snackbar>
                    <Snackbar
                        open={successMessage != null}
                        onClose={() => setSuccessMessage(null)}
                        autoHideDuration={5000}
                    >
                        <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage ?? ""}</Alert>
                    </Snackbar>
                </Box>
            </RTL>
        </ThemeProvider>
    )
}

export default App
