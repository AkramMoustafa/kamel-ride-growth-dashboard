import MetricsCards from "../components/MetricsCards";
import ReferralDashboard from "../components/ReferralDashboard";
import PopularDestinationsCard from "../components/PopularDestinationsCard";
import UniversityCard from "../components/UniversityCard";
import TrendCard from "../components/TrendCard";
import { text, colors } from "../styles/tokens";

export default function Dashboard() {
  return (
    <div
      style={{
        padding: "24px 24px",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 24, color: "#000", fontWeight: 700 }}>
          Kamel Ride Growth Dashboard
        </div>
        <div style={{ fontSize: 14, color: "#8a7f73", marginTop: 4 }}>
          Where to focus to increase bookings
        </div>
      </div>

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <ReferralDashboard />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: colors.white,
              border: "1px solid #e5e4e7",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={text.cardHeader}>Where to Expand Next?</div>
            <UniversityCard />
            <PopularDestinationsCard />
          </div>
        </div>
      </div>
    </div>
  );
}