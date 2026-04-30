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
        gap: "16px", // slightly increased for spacing
      }}
    >

      {/* ✅ HEADER */}
      <div>
        <div style={{ fontSize: 24, color: "#0e0e0e",fontWeight: 700 }}>
          kamel Ride Growth Dashboard
        </div>
        <div style={{ fontSize: 14, color: "#0e0e0e", marginTop: 4 }}>
          Where to focus to increase bookings
        </div>
      </div>

      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "16px",
          alignItems: "stretch",
        }}
      >
        <MetricsCards />
        <TrendCard />
      </div>

      {/* BOTTOM GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <ReferralDashboard />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <UniversityCard />
          <PopularDestinationsCard />
        </div>
      </div>

    </div>
  );
}