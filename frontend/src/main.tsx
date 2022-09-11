import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SchoolCardPage} from "./components/SchoolCardPage";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<App/>}/>
                <Route path={"/school-card"} element={<SchoolCardPage/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
