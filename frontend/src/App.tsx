import React, {useState} from "react";
import {Box, Button, createTheme, TextField, Theme, ThemeProvider, Typography} from "@mui/material";
import {SchoolCard} from "./SchoolCard";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {UploadFile} from "@mui/icons-material";

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

function App() {
    const [name, setName] = useState("")
    const [profession, setProfession] = useState("")
    const [traits, setTraits] = useState("")
    const [image, setImage] = useState("")

    return (
        <ThemeProvider theme={theme}>
            <RTL>
                <Box sx={rootStyles}>
                    <Typography variant={"h2"} component={"h1"} align={"center"}>بطاقة الطالبة</Typography>
                    <SchoolCard
                        imageSrc={image}
                        zoom={0}
                        panFromLeft={0}
                        panFromTop={0}
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
                                onChange={e => {
                                    if (e.target.files?.[0] != null) {
                                        setImage(URL.createObjectURL(e.target.files?.[0]))
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
                </Box>
            </RTL>
        </ThemeProvider>
    )
}

export default App
