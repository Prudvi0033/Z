// Footer component
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Montserrat } from "next/font/google";

const monte = Montserrat({ subsets: ["latin"], weight: ["700"] });

const Footer = () => {
  return (
    <div
      className={`min-h-screen overflow-hidden bg-neutral-900 ${monte.className}`}
    >
      <div className="w-full h-fit relative top-[39rem] px-16">
        <TextHoverEffect text="Alpha" duration={0.3} />
      </div>
    </div>
  );
};

export default Footer;
