import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import TopCategories from "@/components/TopCategories";
import CardSection from "@/components/CardSection";
import MovieSection from "@/components/MovieSection";
import TrendingBusinesses from "@/components/TrendingBusinesses";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <main className="bg-[#f5f6f7]">
      <Header />
      <SearchHero />
      <TopCategories />
      <CardSection />
      <MovieSection />
      <TrendingBusinesses />
      <Footer />
      <BottomNav />
    </main>
  );
}
