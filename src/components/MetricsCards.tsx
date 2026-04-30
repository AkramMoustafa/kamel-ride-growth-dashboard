import React from "react";
import {
  getTotalVisits,
  getTotalSearches,
  getTotalBookings,
  getConversionRate,
  getDailyTrend,
} from "../utils/analytics";
import { colors, font, radius, text } from "../styles/tokens";

type SparklineProps = { data: number[]; color: string };
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
const Sparkline: React.FC<SparklineProps> = ({ data, color }) => {

  const W = 80, H = 24, PAD = 2;
  const max = Math.max(...data, 1);
  const toX = (i: number) => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const toY = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const points: [number, number][] = data.map((v, i) => [toX(i), toY(v)]);

  const linePath = points.reduce((path, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = points[i - 1];
    const cpx = (px + x) / 2;
    return `${path} C ${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1][0]},${H} L ${points[0][0]},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 24, overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2" fill={color} />
    </svg>
  );
};

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
  sparkData: number[];
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, highlight, sparkData }) => (
  <div
    style={{
      background: highlight ? colors.lightOrange : colors.cream,
      padding: "14px 16px",
      borderRadius: radius.lg,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    <div style={text.label}>{title}</div>
    <div style={{
      fontSize: 26,
      fontWeight: 800,
      color: highlight ? colors.orange : colors.brown,
      fontFamily: font.heading,
      lineHeight: 1,
    }}>
      {value}
    </div>
    <Sparkline data={sparkData} color={highlight ? colors.orange : colors.searchBar} />
    {subtitle && (
      <div style={{ ...text.hint, color: highlight ? colors.warmText : colors.subtleText }}>
        {subtitle}
      </div>
    )}
  </div>
);

const MetricsCards: React.FC = () => {
  const trend = getDailyTrend();
  const conversionRate = Number(getConversionRate());

  const visitSpark   = trend.map(d => d.searches + d.bookings);
  const searchSpark  = trend.map(d => d.searches);
  const bookingSpark = trend.map(d => d.bookings);
  const convSpark    = trend.map(d =>
    d.searches > 0 ? Math.round((d.bookings / d.searches) * 100) : 0
  );

  const qualityLabel =
    conversionRate >= 60 ? "Strong quality" :
    conversionRate >= 40 ? "Moderate quality" :
    "Needs improvement";

  return (
    <div
      style={{
        background: colors.cream,
        borderRadius: radius.xxl,
        overflow: "hidden",
        border: `1.5px solid ${colors.border}`,
        fontFamily: font.heading,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
    <div style={{
      padding: "16px 20px 14px",
    }}>
      <div style={text.cardHeader}>Demand → Booking Funnel</div>

      <div
        style={{
          ...text.hint,
          marginTop: 3,
          color: colors.subtleText,
        }}
      >
        Overall conversion: {conversionRate.toFixed(1)}%
      </div>
    </div>

      {/* Cards grid */}
      <div style={{
        display: "grid",
     gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
        gap: 12,
        padding: 16,
      }}>
        <MetricCard
          title="Visits"
          value={getTotalVisits().toLocaleString()}
          subtitle="All traffic sources"
          sparkData={visitSpark}
        />
          <Arrow />
        <MetricCard
          title="Searches"
          value={getTotalSearches().toLocaleString()}
          subtitle="Ride demand"
          highlight
          sparkData={searchSpark}
        />
          <Arrow />
        <MetricCard
          title="Bookings"
          value={getTotalBookings().toLocaleString()}
          subtitle="Completed bookings"
          sparkData={bookingSpark}
        />
         <Arrow />
        <MetricCard
          title="Rate"
          value={`${getConversionRate()}%`}
          subtitle={qualityLabel}
          sparkData={convSpark}
        />
      </div>
    </div>
  );
};

export default MetricsCards;