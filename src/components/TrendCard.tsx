import React, { useState } from "react";
import { getDailyTrend, getTrendInsight, getDailyReferralRate } from "../utils/analytics";
import { colors, font, fontSize, radius, text } from "../styles/tokens";

export default function TrendCard() {
  const data = getDailyTrend();
  const referralRates = getDailyReferralRate();
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 600, H = 90, PAD = 4;
  const maxValue = Math.max(...data.map(d => Math.max(d.searches, d.bookings)), 1);

  const toX = (i: number) => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const toY = (v: number) => H - 2 - (v / maxValue) * (H - PAD * 2);

  const smoothPath = (points: [number, number][]) =>
    points.reduce((path, [x, y], i) => {
      if (i === 0) return `M ${x},${y}`;
      const [px, py] = points[i - 1];
      const cpx = (px + x) / 2;
      return `${path} C ${cpx},${py} ${cpx},${y} ${x},${y}`;
    }, "");

  const searchPoints: [number, number][] = data.map((d, i) => [toX(i), toY(d.searches)]);
  const bookingPoints: [number, number][] = data.map((d, i) => [toX(i), toY(d.bookings)]);

  const areaPath = (points: [number, number][]) =>
    `${smoothPath(points)} L ${points[points.length - 1][0]},${H} L ${points[0][0]},${H} Z`;

  return (
    <div
      style={{
        background: colors.white,
        border: `1.5px solid ${colors.border}`,
        borderRadius: radius.xxl,
        overflow: "hidden",
        fontFamily: font.heading,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "16px 20px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start", 
      }}>
        <div>
          <div style={text.cardHeader}>Booking & Demand Trends</div>
          <div style={{ ...text.hint}}>
           Hover to view insights
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 2, background: colors.searchBar, borderRadius: 2 }} />
            <span style={{ ...text.hint }}> Searches</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 2, background: colors.orange, borderRadius: 2 }} />
            <span style={{ ...text.hint }}>Bookings</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "36px 0px 0" }}>
        <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.searchBar} stopOpacity="0.15" />
              <stop offset="100%" stopColor={colors.searchBar} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.orange} stopOpacity="0.12" />
              <stop offset="100%" stopColor={colors.orange} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Search area + line */}
          <path d={areaPath(searchPoints)} fill="url(#searchGrad)" />
          <path d={smoothPath(searchPoints)} fill="none" stroke={colors.searchBar} strokeWidth="1.5" strokeLinecap="round" />

          {/* Booking area + line */}
          <path d={areaPath(bookingPoints)} fill="url(#bookingGrad)" />
          <path d={smoothPath(bookingPoints)} fill="none" stroke={colors.orange} strokeWidth="1.6" strokeLinecap="round" />

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={toX(hovered)} y1={0}
              x2={toX(hovered)} y2={H}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Tooltip */}
          {hovered !== null && (() => {
            const x = toX(hovered);
            const tooltipX = hovered > data.length / 2 ? x - 78 : x + 8;
            const rate = referralRates[data[hovered].day] ?? "0";
            return (
              <g>
                <rect x={tooltipX} y={4} width={72} height={54} rx={6} fill={colors.white} stroke={colors.border} strokeWidth="1" />
                <text x={tooltipX + 8} y={16} fontSize={fontSize.xs} fill={colors.mutedText} fontFamily={font.body} fontWeight="600">
                  {data[hovered].day}
                </text>
                <circle cx={tooltipX + 8} cy={27} r="2.5" fill={colors.searchBar} />
                <text x={tooltipX + 14} y={30} fontSize={fontSize.xs} fill={colors.brown} fontFamily={font.heading} fontWeight="700">
                  {data[hovered].searches} searches
                </text>
                <circle cx={tooltipX + 8} cy={40} r="2.5" fill={colors.orange} />
                <text x={tooltipX + 14} y={43} fontSize={fontSize.xs} fill={colors.brown} fontFamily={font.heading} fontWeight="700">
                  {data[hovered].bookings} bookings
                </text>
                <text x={tooltipX + 8} y={56} fontSize={fontSize.xs} fill={colors.mutedText} fontFamily={font.body}>
                  {rate}% referral
                </text>
              </g>
            );
          })()}

          {/* Booking dots */}
          {bookingPoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y}
             r={hovered === i ? 4 : 0}
              fill={colors.orange}
              stroke={colors.cream}
              strokeWidth="1"
              style={{ transition: "r 0.15s ease" }}
            />
          ))}

          {/* Search dots (hover only) */}
          {searchPoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y}
              r={hovered === i ? 3 : 2}
              fill={colors.searchBar}
              stroke={colors.cream}
              strokeWidth="1"
            />
          ))}

          {/* Hover zones */}
          {data.map((_, i) => (
            <rect
              key={i}
              x={toX(i) - (W / data.length) / 2}
              y={0}
              width={W / data.length}
              height={H}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Day labels */}
          {data.map((d, i) => (
            <text
              key={d.day}
              x={toX(i)}
              y={H + 8}
              textAnchor="middle"
              fontSize={fontSize.xs}
              fill={hovered === i ? colors.brown : colors.mutedText}
              fontWeight={hovered === i ? "700" : "400"}
              fontFamily={font.body}
              dominantBaseline="hanging"
            >
              {d.day}
            </text>
          ))}
        </svg>
      </div>

      {/* Insight */}
      <div style={{
        margin: "14px 0 0",
        background: colors.lightOrange,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 3,
          alignSelf: "stretch",
          background: colors.orange,
          borderRadius: 2,
                opacity:"0.2",
          flexShrink: 0,
        }} />
        <div style={{ ...text.hint, fontStyle: "italic" }}>
          {getTrendInsight()}
        </div>
      </div>
    </div>
  );
}