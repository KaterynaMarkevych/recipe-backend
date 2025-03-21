import Image from "next/image";
import HeroSection from "../components/HomePage/HeroSection/HeroSection";
import AboutUs from "@/components/HomePage/AboutUsSection/AboutUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutUs />
    </>
  );
}
