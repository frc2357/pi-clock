import type { PropsWithChildren } from "react";
import Navbar from "../components/Navbar";

export default function DefaultLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
