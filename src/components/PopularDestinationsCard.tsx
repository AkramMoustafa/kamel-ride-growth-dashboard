import React from "react";
import { getDemandByDestination, getUniversityStats } from "../utils/analytics";
import RankingCard from "./RankingCard";

export default function PopularDestinationsCard() {
  const universities = getUniversityStats().map(u => u.name);
  const sorted = [...getDemandByDestination()]
    .filter(d => !universities.includes(d.destination))
    .sort((a, b) => b.unmetDemand * b.count - a.unmetDemand * a.count);

  const top = sorted[0];

  return (
    <RankingCard
      caption="High-demand destinations where conversion is low, indicating opportunities to increase bookings."
      headline={`${top?.destination} (${top?.count} searches)`}
      rows={sorted.slice(0, 3).map(d => ({
        key: d.destination,
        label: d.destination,
        stat: `${d.count} searches • ${d.conversion}%`,
      }))}
    />
  );
}