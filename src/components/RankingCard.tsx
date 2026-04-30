import { colors, font, radius, text } from "../styles/tokens";

type Row = {
  key: string;
  label: string;
  stat: string;
  logo?: string;
};

type Props = {
  caption: string;
  headline: string;
  rows: Row[];
};

export default function RankingCard({ caption, headline, rows }: Props) {
  return (
    <div
      style={{
        background: "transparent",
        borderRadius: radius.lg,
        padding: 7.5,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: font.heading,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={text.caption}>{caption}</div>
        <div style={{ ...text.heading, fontWeight: 700 }}>
          <span style={{ color: colors.orange }}>{headline}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row, idx) => (
          <div
            key={row.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={text.caption}>{idx + 1}.</span>
              {row.logo && (
                <img
                  src={row.logo}
                  alt={row.label}
                  style={{ width: 18, height: 18, objectFit: "contain", opacity: 0.9 }}
                />
              )}
              <span style={{ ...text.body, fontWeight: 600 }}>{row.label}</span>
            </div>
            <div style={text.caption}>{row.stat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}