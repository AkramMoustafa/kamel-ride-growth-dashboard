import { getUniversityStats } from "../utils/analytics";
import RankingCard from "./RankingCard";
import cmuLogo from "../assets/cmu_logo.png";
import msuLogo from "../assets/msu_logo.png";
import uofmLogo from "../assets/UofM_logo.png";
import wayneLogo from "../assets/wayne_logo.png";

const logoMap: Record<string, string> = {
  CMU: cmuLogo, MSU: msuLogo, UofM: uofmLogo, Wayne: wayneLogo,
};

const bookingRate = (u: { searches: number; bookings: number }) =>
  u.searches ? (u.bookings / u.searches) * 100 : 0;

export default function UniversityCard() {
  const sorted = [...getUniversityStats()].sort((a, b) => bookingRate(b) - bookingRate(a));
  const top = sorted[0];

  return (
    <RankingCard
      caption="Top universities to focus on based on conversion"
      headline={`${top?.name} (${bookingRate(top).toFixed(0)}%)`}
      rows={sorted.slice(0, 3).map(u => ({
        key: u.name,
        label: u.name,
        stat: `${u.bookings} bookings • ${bookingRate(u).toFixed(0)}%`,
        logo: logoMap[u.name],
      }))}
    />
  );
}