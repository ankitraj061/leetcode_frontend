'use client';

import { useSelector } from "react-redux";

import Home from "./Home";
import HomeWithoutLogin from "./HomeWithoutLogin";

export default function Page() {
    const { isAuthenticated, user, } = useSelector(state => state.auth);

    

    return (
        <>
            {isAuthenticated && user ? <Home /> : <HomeWithoutLogin />}
        </>
    );
}
