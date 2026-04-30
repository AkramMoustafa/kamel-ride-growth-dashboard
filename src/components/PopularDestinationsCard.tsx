import React from "react";
import { getDemandByDestination } from "../utils/analytics";
import { colors, font, radius, text } from "../styles/tokens";

type Destination = {
  destination: string;
  count: number;
  bookings: number;
  conversion: number;
  unmetDemand: number;
};

const getBarColor = (d: Destination) => {
  if (d.unmetDemand > 50) return "#E05C5C";
  if (d.unmetDemand > 20) return "#E0A030";
  return colors.orange;
};

export default function PopularDestinationsCard() {
  const data = getDemandByDestination();

  const sorted = [...data].sort((a, b) => b.unmetDemand - a.unmetDemand);
  const top = sorted[0];
  const maxCount = Math.max(...sorted.map(d => d.count), 1);

  return (
    <div
      style={{
        background: colors.cream,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: font.heading,
      }}
    >
      {/* Header */}
      {/* <div>
        <div style={text.cardHeader}>Destination Demand</div>
        <div style={text.hint}>
          Search demand and conversion by destination
        </div>
      </div> */}

      {/* Top destination (simplified) */}

{top && (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <div style={text.caption}> Top demand</div>
    <div style={{ ...text.heading, fontWeight: 700 }}>
      <span style={{ color: colors.orange }}>
      {top.destination} ({top.count} searches)
      </span>
    </div>
  </div>
)}
      {/* Top 3 list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.slice(0, 3).map((d, idx) => {
          const barWidth = `${(d.count / maxCount) * 100}%`;
          const barColor = getBarColor(d);

          return (
            <div key={d.destination}>
              {/* Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={text.caption}>{idx + 1}.</span>
                  <span style={{ ...text.body, fontWeight: 600 }}>
                    {d.destination}
                  </span>
                </div>

                <div style={text.caption}>
                  {d.count} searches • {d.conversion}%
                </div>
              </div>

              {/* Bar */}
              <div
                style={{
                  height: 5,
                  background: colors.border,
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: barWidth,
                    background: idx === 0 ? colors.orange : barColor,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}