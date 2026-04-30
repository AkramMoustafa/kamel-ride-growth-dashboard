import { events } from "../data/events";

export const getTotalVisits = () =>
  events.filter(e => e.event_type === "website_visit").length;

export const getTotalSearches = () =>
  events.filter(e => e.event_type === "ride_search").length;

export const getTotalBookings = () =>
  events.filter(e => e.event_type === "booking_completed").length;

export const getDailyReferralRate = (): Record<string, string> => {
  const rates: Record<string, { total: number; referred: number }> = {};

  events.forEach(e => {
    if (e.event_type !== "website_visit") return;
    const day = new Date(e.timestamp).toLocaleDateString("en-US", { weekday: "short" });
    if (!rates[day]) rates[day] = { total: 0, referred: 0 };
    rates[day].total += 1;
    if (e.source) rates[day].referred += 1;
  });

  return Object.fromEntries(
    Object.entries(rates).map(([day, { total, referred }]) => [
      day,
      total > 0 ? ((referred / total) * 100).toFixed(0) : "0"
    ])
  );
};


export const getTrendInsight = (): string => {
  const trend = getDailyTrend();
  if (trend.length < 2) return "Not enough data yet.";

  const fullDay: Record<string, string> = {
    Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
    Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"
  };
  const name = (day: string) => fullDay[day] ?? day;

  const latest = trend[trend.length - 1];
  const previous = trend[trend.length - 2];

  const bookingsUp = latest.bookings > previous.bookings;
  const searchesUp = latest.searches > previous.searches;
  const convLatest = latest.searches > 0 ? latest.bookings / latest.searches : 0;
  const convPrev = previous.searches > 0 ? previous.bookings / previous.searches : 0;
  const convUp = convLatest > convPrev;

  const bestDay = trend.reduce((best, d) => d.bookings > best.bookings ? d : best, trend[0]);

  if (bookingsUp && searchesUp) return `Momentum is strong — both searches and bookings grew on ${name(latest.day)}.`;
  if (bookingsUp && !searchesUp) return `Conversion is improving — more bookings despite fewer searches on ${name(latest.day)}.`;
  if (!bookingsUp && searchesUp) return `High demand but low conversion on ${name(latest.day)} — worth investigating.`;
  if (!bookingsUp && !convUp) return `${name(latest.day)} saw a dip. ${name(bestDay.day)} remains the strongest day with ${bestDay.bookings} bookings.`;
  return `${name(bestDay.day)} is your strongest day with ${bestDay.bookings} bookings.`;
};

export const getConversionRate = () => {
  const visits = getTotalVisits();
  const bookings = getTotalBookings();

  if (visits === 0) return 0;

  return ((bookings / visits) * 100).toFixed(1);
};
export const getReferralShare = () => {
  const visitEvents = events.filter(e => e.event_type === "website_visit");

  const totalUsers = new Set(visitEvents.map(e => e.user_id));
  const referralUsers = new Set(
    visitEvents
      .filter(e => e.source)
      .map(e => e.user_id)
  );

  const organicUsers = new Set(
    visitEvents
      .filter(e => !e.source)
      .map(e => e.user_id)
  );

  return {
    total: totalUsers.size,
    referral: referralUsers.size,
    organic: organicUsers.size,
    percentage:
      totalUsers.size > 0
        ? ((referralUsers.size / totalUsers.size) * 100).toFixed(1)
        : "0"
  };
};
export const getReferralStats = () => {
  const stats: Record<string, any> = {};

  events.forEach(e => {
    if (e.event_type === "website_visit" && e.source) {
      if (!stats[e.source]) {
        stats[e.source] = {
          visits: 0,
          searches: 0,
          bookings: 0
        };
      }

      stats[e.source].visits += 1;
    }

    if (e.event_type === "ride_search") {
      const visit = events.find(
        v => v.user_id === e.user_id && v.event_type === "website_visit"
      );

      if (visit?.source) {
        stats[visit.source].searches += 1;
      }
    }

    if (e.event_type === "booking_completed") {
      const visit = events.find(
        v => v.user_id === e.user_id && v.event_type === "website_visit"
      );

      if (visit?.source) {
        stats[visit.source].bookings += 1;
      }
    }
  });

  return Object.entries(stats).map(([name, data]) => {
    const searchRate =
      data.visits > 0 ? ((data.searches / data.visits) * 100).toFixed(1) : 0;

    const conversion =
      data.visits > 0 ? ((data.bookings / data.visits) * 100).toFixed(1) : 0;

    const score = data.bookings * 2 + data.searches;

    return {
      name,
      ...data,
      searchRate,
      conversion,
      score
    };
  });
};

export const getDemandByDestination = () => {
  const demand: Record<string, { searches: number; bookings: number }> = {};

  events.forEach(e => {
    // Track searches
    if (e.event_type === "ride_search" && e.destination) {
      if (!demand[e.destination]) {
        demand[e.destination] = { searches: 0, bookings: 0 };
      }
      demand[e.destination].searches += 1;
    }

    // Track bookings
    if (e.event_type === "booking_completed" && e.destination) {
      if (!demand[e.destination]) {
        demand[e.destination] = { searches: 0, bookings: 0 };
      }
      demand[e.destination].bookings += 1;
    }
  });

  return Object.entries(demand)
.map(([destination, data]) => {
  const searches = data.searches;
  const bookings = data.bookings;

  const conversion =
    searches > 0 ? bookings / searches : 0;

  const unmetDemand =
    searches > 0 ? searches * (1 - conversion) : 0;

  return {
    destination,
    count: searches,
    bookings,
    conversion: Number((conversion * 100).toFixed(1)),
    unmetDemand: Math.round(unmetDemand)
  };
})
    .sort((a, b) => b.count - a.count);
};

export const getTopDestination = () => {
  const demand = getDemandByDestination();
  return demand[0];
};

export const getDailyTrend = () => {
  const trend: Record<string, any> = {};

  events.forEach(e => {
    const day = new Date(e.timestamp).toLocaleDateString("en-US", {
  weekday: "short"
});

    if (!trend[day]) {
      trend[day] = {
        searches: 0,
        bookings: 0
      };
    }

    if (e.event_type === "ride_search") {
      trend[day].searches += 1;
    }

    if (e.event_type === "booking_completed") {
      trend[day].bookings += 1;
    }
  });

  return Object.entries(trend).map(([day, data]) => ({
    day,
    ...data
  }));
};
export const getUniversityStats = () => {
  const stats: Record<string, {
    name: string;
    searches: number;
    bookings: number;
  }> = {};

  events.forEach(e => {
    // Only care about search + booking events
    if (
      e.event_type !== "ride_search" &&
      e.event_type !== "booking_completed"
    ) return;

    // 🔑 Find the user's university from visit
    const visit = events.find(
      v =>
        v.user_id === e.user_id &&
        v.event_type === "website_visit"
    );

    const university = visit?.university;
    if (!university) return;

    // Initialize
    if (!stats[university]) {
      stats[university] = {
        name: university,
        searches: 0,
        bookings: 0,
      };
    }

    // Count events
    if (e.event_type === "ride_search") {
      stats[university].searches++;
    }

    if (e.event_type === "booking_completed") {
      stats[university].bookings++;
    }
  });

  return Object.values(stats);
};