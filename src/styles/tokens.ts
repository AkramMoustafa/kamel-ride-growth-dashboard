export const colors = {
  orange: "#F5920A",
  brown: "#2C1A0E",
  cream: "#FDF5EE",
  lightOrange: "#FEE9CC",
  border: "#EDD9C0",
  borderStrong: "#F5C97A",
  mutedText: "#A0826D",
  subtleText: "#C4A882",
  warmText: "#C4935A",
  searchBar: "#D8B892",
  white: "#FFFFFF",
} as const;

export const radius = {
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
  xxl: 8,
} as const;
export const font = {
  heading: "'Nunito', sans-serif",
  body: "'Nunito Sans', sans-serif",
} as const;

export const fontSize = {
  xs: 9,
  sm: 11,
  base: 12,
  md: 13,
  lg: 16,
  xl: 22,
  xxl: 26,
  display: 36,
} as const;
export const text = {
  // Labels & captions
  caption: {
    fontSize: 10,
    fontFamily: font.body,
    color: colors.subtleText,
  },

  // Subtitles & hints  
  hint: {
    fontSize: 12, // 👈 slightly bigger
    fontFamily: font.body,
    color: colors.mutedText,
  },

  // Body / table cells
  body: {
    fontSize: 13,
    fontFamily: font.body,
    color: colors.brown,
  },

  // Card labels
  label: {
    fontSize: 12,
    fontFamily: font.body,
    color: colors.mutedText,
  },

  // Card headers (keep subtle)
  cardHeader: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: font.body, // 👈 remove heading here (less competition)
    color: colors.mutedText,
  },

heading: {
  fontSize: 30,               
  fontWeight: 900,            
  fontFamily: font.heading,  
  color: "#1A120B",           
  letterSpacing: "-0.5px",
  lineHeight: 1.15,
},
  // Metric values
  metric: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: font.heading,
    color: colors.brown,
  },

  // Large display numbers
  display: {
    fontSize: 36,
    fontWeight: 800,
    fontFamily: font.heading,
    color: colors.brown,
  },
} as const;