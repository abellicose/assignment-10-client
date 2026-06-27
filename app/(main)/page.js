import Banner from "@/components/home/Banner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TopLocations from "@/components/home/TopLocations";
import RentalStats from "@/components/home/RentalStats";
import CustomerReviews from "@/components/home/CustomerReviews";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedProperties />
      <WhyChooseUs />
      <TopLocations />
      <RentalStats />
      <CustomerReviews />
    </>
  );
}
