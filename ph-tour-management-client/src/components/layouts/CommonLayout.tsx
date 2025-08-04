import type { iChildren } from "@/global-interfaces";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function CommonLayout({ children }: iChildren) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
