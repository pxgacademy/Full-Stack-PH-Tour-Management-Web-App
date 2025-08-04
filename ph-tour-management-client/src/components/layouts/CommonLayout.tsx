import type { iChildren } from "@/global-interfaces";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function CommonLayout({ children }: iChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      <div className="grow-1" />
      <Footer />
    </div>
  );
}
