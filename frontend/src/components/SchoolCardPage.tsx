import React, {useEffect, useRef, useState} from "react";
import {SchoolCard} from "./SchoolCard";
import {Box, Button} from "@mui/material";

const hiddenInputStyles = {
    opacity: 0,
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1,
}

interface CardData {
    name: string
    profession: string
    traits: string
    imageDataUrl: string
}

const emptyCardData: CardData = {
    name: "",
    profession: "",
    traits: "",
    imageDataUrl: "",
}

export const SchoolCardPage = () => {
    const [cardData, setCardData] = useState<CardData>(() => {
        const queryParams = new URL(window.location.href).searchParams
        return {
            ...emptyCardData,
            name: queryParams.get("name") ?? "",
            profession: queryParams.get("profession") ?? "",
            traits: queryParams.get("traits") ?? "",
        }
    })
    const [renderVersion, setRenderVersion] = useState(0)
    const nameInput = useRef<HTMLInputElement>(null)
    const professionInput = useRef<HTMLInputElement>(null)
    const traitsInput = useRef<HTMLTextAreaElement>(null)
    const imageInput = useRef<HTMLInputElement>(null)
    const legacyImageInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (window.location.search) {
            window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.hash}`)
        }
    }, [])

    return (
        <div id="cardRenderRoot" data-render-version={renderVersion}>
            <Box sx={hiddenInputStyles} aria-hidden={true}>
                <input ref={nameInput} id="cardName" type="text" autoComplete="off"/>
                <input ref={professionInput} id="cardProfession" type="text" autoComplete="off"/>
                <textarea ref={traitsInput} id="cardTraits" autoComplete="off"/>
                <input
                    ref={imageInput}
                    id="cardImageDataUrl"
                    type="text"
                    autoComplete="off"
                    maxLength={20971520}
                />
                <Button
                    id="cardUpdateButton"
                    onClick={() => {
                        setCardData({
                            name: nameInput.current?.value ?? "",
                            profession: professionInput.current?.value ?? "",
                            traits: traitsInput.current?.value ?? "",
                            imageDataUrl: imageInput.current?.value ?? "",
                        })
                        setRenderVersion(current => current + 1)
                    }}
                />
                {/* Remove these legacy controls after the new backend is deployed. */}
                <input
                    ref={legacyImageInput}
                    id="imageDataUrl"
                    type="text"
                    autoComplete="off"
                    maxLength={20971520}
                />
                <Button
                    id="imageUpdateButton"
                    onClick={() => {
                        setCardData(current => ({
                            ...current,
                            imageDataUrl: legacyImageInput.current?.value ?? "",
                        }))
                        setRenderVersion(current => current + 1)
                    }}
                />
            </Box>
            <SchoolCard
                imageSrc={cardData.imageDataUrl}
                name={cardData.name}
                profession={cardData.profession}
                traits={cardData.traits}
                widthModifier={1}
            />
        </div>
    )
}