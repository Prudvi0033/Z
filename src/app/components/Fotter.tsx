// Footer component
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Montserrat } from "next/font/google";

const monte = Montserrat({ subsets: ["latin"], weight: ["700"] });

const Footer = () => {
  return (
    <div
      className={`min-h-screen overflow-hidden bg-red-900 ${monte.className}`}
    >
    </div>
  );
};

export default Footer;
