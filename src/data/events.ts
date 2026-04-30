export const events = (() => {
  const universities = ["CMU", "MSU", "UofM", "Wayne"];
  const sources = ["Sarah", "John", "Ali", null]; // null = organic
  const cities = ["Detroit", "Chicago", "Toronto"];

  const events: any[] = [];
  let id = 1;

  const getRandom = (arr: any[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const getDate = (day: number) =>
    `2026-01-${String(day).padStart(2, "0")}`;

  for (let i = 1; i <= 40; i++) {
    const user_id = `u${i}`;
    const university = getRandom(universities);
    const source = getRandom(sources);
    const day = (i % 20) + 1;

    // 1️⃣ Website Visit (always exists)
    events.push({
      id: String(id++),
      event_type: "website_visit",
      user_id,
      university,
      ...(source ? { source } : {}),
      timestamp: getDate(day),
    });

    if (Math.random() < 0.8) {
      const isOut = Math.random() < 0.5;
      const city = getRandom(cities);

      const origin = isOut ? university : city;
      const destination = isOut ? city : university;
      const direction = isOut ? "OUT" : "IN";

      events.push({
        id: String(id++),
        event_type: "ride_search",
        user_id,
        origin,
        destination,
        direction,
        timestamp: getDate(day),
      });

      // 3️⃣ 60% of search → booking
      if (Math.random() < 0.6) {
        events.push({
          id: String(id++),
          event_type: "booking_completed",
          user_id,
          origin,
          destination,
          direction,
          timestamp: getDate(day),
        });
      }
    }
  }

  return events;
})();