import HomeCapabilities from "@/components/public/home/HomeCapabilities";
import HomeCompany from "@/components/public/home/HomeCompany";
import HomeCta from "@/components/public/home/HomeCta";
import HomeHero from "@/components/public/home/HomeHero";
import HomePartners from "@/components/public/home/HomePartners";
import HomeSocials from "@/components/public/home/HomeSocials";
import HomeStats from "@/components/public/home/HomeStats";
import HomeTestimonials from "@/components/public/home/HomeTestimonials";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <HomeHero />
      <HomeStats />
      <HomeCompany />
      <HomeCapabilities />
      <HomePartners />
      <HomeTestimonials />
      <HomeCta />
      {/* <HomeSocials /> */}
    </div>
  );
}
