// import UtilizationCard from './UtilizationCard'
// import BookingConversionCard from './BookingConversionCard'
// import PopularDestinationsCard from './PopularDestinationsCard'
// import ConversionFunnel from "./ConversionFunnel";
import MetricsCards from "../components/MetricsCards";
import ReferralDashboard from "../components/ReferralDashboard"
import PopularDestinationsCard from "../components/PopularDestinationsCard"
import UniversityCard from "../components/UniversityCard"
import TrendCard from  "../components/TrendCard"

export default function Dashboard() {
  return (
   <div
  style={{
   padding: "24px 24px",
    maxWidth: "1400px",     
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",              }}
>

     <div
  style={{
    display: "grid",
   gridTemplateColumns: "1.7fr 1fr",
    gap: "16px",
    flexDirection: "column",
    alignItems: "stretch",
  }}
>
  <MetricsCards />
  <TrendCard />
</div>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1.7fr 1fr",
    gap: "16px",
    alignItems: "start", // 👈 was "stretch", now cards only take their natural height
  }}
>
  <ReferralDashboard />

  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    <UniversityCard />
    <PopularDestinationsCard />
  </div>
</div>
    </div>
  );
}