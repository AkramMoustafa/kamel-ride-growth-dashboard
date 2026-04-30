import React from "react";
import { colors, font, radius, text } from "../styles/tokens";
import { getUniversityStats } from "../utils/analytics";

type University = {
  name: string;
  searches: number;
  bookings: number;
};

const bookingRate = (u: University) =>
  u.searches ? (u.bookings / u.searches) * 100 : 0;

export default function UniversityCard() {
  const data = getUniversityStats();

  const sorted = [...data].sort(
    (a, b) => bookingRate(b) - bookingRate(a)
  );

  const top = sorted[0];
  const maxBookings = Math.max(...sorted.map(u => u.bookings), 1);

  return (
    <div
      style={{
        background: colors.cream,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: font.heading,
      }}
    >
      {/* Top performer (simplified) */}
{top && (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
  
    <div style={text.caption}> Top universities to focus on based on conversion</div>
   
    <div style={{ ...text.heading, fontWeight: 700 }}>
      <span style={{ color: colors.orange }}>
        {top.name} ({bookingRate(top).toFixed(0)}%)
      </span>
    </div>
  </div>
)}
      {/* Top 3 list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.slice(0, 3).map((u, idx) => {
          const rate = bookingRate(u);
          const barWidth = `${(u.bookings / maxBookings) * 100}%`;

          return (
            <div key={u.name}>
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
                    {u.name}
                  </span>
                </div>

                <div style={text.caption}>
                  {u.bookings} bookings • {rate.toFixed(0)}%
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
                    background: idx === 0 ? colors.orange : colors.searchBar,
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