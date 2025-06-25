import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
