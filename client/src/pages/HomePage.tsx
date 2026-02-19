import { Footer } from "../components/home/Footer";
import { Hero } from "../components/home/Hero";
import { HomeNav } from "../components/home/HomeNav";
import { Navbar } from "../components/ui/resizable-navbar";

export default function HomePage() {
  return (
    <div className="relative w-full">
      <HomeNav></HomeNav>
      <Hero></Hero>
      <Footer></Footer>
    </div>
  );
}
