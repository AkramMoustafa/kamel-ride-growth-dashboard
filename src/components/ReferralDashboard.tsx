import React, { useEffect } from "react";
import { getReferralStats, getReferralShare } from "../utils/analytics";
import { colors, fontSize, radius, text } from "../styles/tokens";
const Arrow = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.subtleText,
      fontSize: 16,
      opacity: 0.8,   // increase from ~0.5
    }}
  >
    →
  </div>
);
/* ── Font + animation injection ─────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("rd-styles")) return;
  const el = document.createElement("style");
  el.id = "rd-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes rd-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rd-bar-grow {
      from { width: 0%; }
    }
    @keyframes rd-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .rd-row:hover { background: rgba(224,123,42,0.04) !important; }
    .rd-funnel-card { animation: rd-slide-in 0.4s ease both; }
    .rd-bar-fill    { animation: rd-bar-grow 0.9s cubic-bezier(0.22,1,0.36,1) both; }
    .rd-table-row   { animation: rd-fade 0.3s ease both; }
  `;
  document.head.appendChild(el);
};

const data = getReferralStats();

/* ── Rank medal ─────────────────────────────────────────────── */
const Medal = ({ rank }: { rank: number }) => {
  const configs: Record<number, { bg: string; color: string; label: string }> = {
    1: { bg: "#FEF0CD", color: "#C17E10", label: "1" },
    2: { bg: "#F0F0F0", color: "#6B6B6B", label: "2" },
    3: { bg: "#FDEBD7", color: "#A0522D", label: "3" },
  };
  const c = configs[rank] ?? { bg: "transparent", color: colors.mutedText, label: String(rank) };
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%",
      background: c.bg,
      color: c.color,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: "'DM Mono', monospace",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {c.label}
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────── */
export default function ReferralDashboard() {
  useEffect(() => { injectStyles(); }, []);

  const sorted = [...data].sort((a, b) => b.score - a.score);
  const referralShare = getReferralShare();

  const totalVisits   = data.reduce((s, a) => s + a.visits, 0);
  const totalSearches = data.reduce((s, a) => s + a.searches, 0);
  const totalBookings = data.reduce((s, a) => s + a.bookings, 0);

  const visitToSearch  = totalVisits   ? (totalSearches / totalVisits)   * 100 : 0;
  const searchToBook   = totalSearches ? (totalBookings / totalSearches) * 100 : 0;

  const funnelItems = [
    { label: "Visits",   value: totalVisits,   sub: `${referralShare.percentage}% From Referrals`, barPct: referralShare.percentage, highlight: false },
    { label: "Searches", value: totalSearches, sub: `${visitToSearch.toFixed(1)}% Visit → Search`,   barPct: Math.round(visitToSearch),  highlight: true  },
    { label: "Bookings", value: totalBookings, sub: `${searchToBook.toFixed(1)}% Search→Booking`,  barPct: Math.round(searchToBook),   highlight: false },
  ];

  const tableHeaders = ["", "Ambassador", "Visits", "Searches", "Bookings", "Search Rate", "Conv.", "Score"];

  return (
    <div style={{
      background: colors.cream,
      borderRadius: radius.xxl,
      border: `1.5px solid ${colors.border}`,
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Header strip ───────────────────────────────────── */}
{/* Header */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding:"24px"
  }}
>
  <div>
    <div style={text.cardHeader}>Referral Impact on Conversion</div>
{(() => {
  const overallConversion =
    totalVisits ? (totalBookings / totalVisits) * 100 : 0;

  const referralConversion = searchToBook;

  const lift = referralConversion - overallConversion;

  return (
    <div
      style={{
        ...text.hint,
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: colors.subtleText }}>
        {overallConversion.toFixed(1)}% overall
      </span>

      <span style={{ color: colors.orange, fontWeight: 600 }}>
        ↑ {referralConversion.toFixed(1)}%
      </span>

      <span style={{ color: colors.warmText }}>
        (+{lift.toFixed(1)}%)
      </span>
    </div>
  );
})()}
  </div>


</div>

      {/* ── Funnel row ─────────────────────────────────────── */}
      <div style={{ padding: "0 20px", marginBottom: "30px" }}>
<div style={{ display: "flex", alignItems: "center", gap: 20}}>
  {funnelItems.map((item, idx) => {
    const isHighlight = idx === 1;

    return (
      <React.Fragment key={item.label}>
        
        {/* CARD */}
        <div
          style={{
            flex: "0 0 auto",
            minWidth: "140px",
            
            maxWidth: "180px",
            minHeight: "130px",
            borderRadius: radius.lg,
            padding: "16px 18px",
            background: isHighlight ? colors.lightOrange : "transparent",
          }}
        >
          <div style={text.label}>{item.label}</div>

          <div
            style={{
              ...text.metric,
              color: isHighlight ? colors.orange : colors.brown,
            }}
          >
            {item.value}
          </div>

          {/* ✅ Show bar ONLY for Searches + Bookings */}
          {idx !== 0 && (
            <div
              style={{
                background: isHighlight ? colors.border : "#EDD9C0",
                borderRadius: 99,
                height: 5,
                width: "100%",
                overflow: "hidden",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: colors.orange,
                  width: `${item.barPct}%`,
                }}
                
              />
              
            </div>
          )}

          <div
            style={{
              ...text.hint,
              marginTop: 6,
              color: isHighlight ? colors.warmText : colors.subtleText,
            }}
          >
            {item.sub}
          </div>
        </div>

        {/* ARROW */}
        {idx < funnelItems.length - 1 && <Arrow />}

      </React.Fragment>
    );
  })}
</div>
</div>
      {/* ── Table ──────────────────────────────────────────── */}
      <div style={{ padding: "0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {tableHeaders.map((h) => (
                <th key={h} style={{
                  padding: h === "" ? "12px 12px 12px 20px" : "12px 16px",
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase" as const,
                  color: colors.mutedText,
                  textAlign: (h === "" || h === "Ambassador") ? "left" : "right",
                  background: "transparent",
                  whiteSpace: "nowrap" as const,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((a, idx) => {
              const isTop = idx === 0;
              return (
                <tr
                  key={a.name}
                  className={`rd-row rd-table-row`}
                  style={{
                    borderBottom: idx < sorted.length - 1 ? `1px solid ${colors.border}` : "none",
                    animationDelay: `${200 + idx * 60}ms`,
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: "14px 8px 14px 20px", width: 32 }}>
                    <Medal rank={idx + 1} />
                  </td>

                  {/* Name */}
                  <td style={{
                    padding: "14px 16px",
                    fontWeight: isTop ? 600 : 400,
                    fontSize: fontSize.md,
                    color: colors.brown,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {a.name}
                    {isTop && (
                      <span style={{
                        marginLeft: 8, fontSize: 9, fontWeight: 600,
                        letterSpacing: "0.08em", textTransform: "uppercase" as const,
                        color: colors.orange,
                        background: "rgba(224,123,42,0.1)",
                        padding: "2px 6px", borderRadius: 4,
                      }}>
                        Top
                      </span>
                    )}
                  </td>

                  {/* Stats */}
                  {[a.visits, a.searches, a.bookings].map((val, i) => (
                    <td key={i} style={{
                      padding: "14px 16px", textAlign: "right",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13, color: colors.brown,
                    }}>
                      {val}
                    </td>
                  ))}

                  <td style={{
                    padding: "14px 16px", textAlign: "right",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13, color: colors.subtleText,
                  }}>
                    {a.searchRate}%
                  </td>

                  <td style={{
                    padding: "14px 16px", textAlign: "right",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13, color: colors.subtleText,
                  }}>
                    {a.conversion}%
                  </td>

                  {/* Score */}
                  <td style={{
                    padding: "14px 20px 14px 16px", textAlign: "right",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: isTop ? 16 : 14,
                    fontWeight: isTop ? 700 : 500,
                    color: isTop ? colors.orange : colors.brown,
                  }}>
                    {a.score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}