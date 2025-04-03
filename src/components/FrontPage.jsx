import React from "react";
import specialPages from "../data/specialPages.json";

function FrontPage({ newsList, setPage }) {
  const pinnedItem = newsList.find((item) => item.pinned);
  const latestItems = newsList
    .filter((item) => !item.pinned)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Filter for news that has an event_date today or later
  const upcomingEvents = newsList
    .filter((item) => {
      if (!item.event_date) return false;

      const eventDate = new Date(item.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // strip time for clean comparison

      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 5); // Only next 5

  return (
    <div>
      <div className="teletext-box">
        <div className="headline">ETUSIVU - 100</div>

        {pinnedItem && (
          <div
            className="pinned-headline clickable"
            onClick={() => setPage(pinnedItem.page)}
          >
            {pinnedItem.page} - {pinnedItem.title}
          </div>
        )}

        {latestItems.map((item) => (
          <p
            className="clickable latest-entry"
            key={item.page}
            onClick={() => setPage(item.page)}
          >
            {item.page} - {item.title}
          </p>
        ))}

        <div className="category-event-box">
          {/* Left side – categories */}
          <div className="category-column">
            <div className="headline">📺 Kategoriat</div>
            {specialPages
              .filter((p) => !p.hidden && p.page !== 100)
              .map((p) => (
                <p
                  key={p.page}
                  onClick={() => setPage(p.page)}
                  className="clickable-entry"
                >
                  <span className="page-code">{p.page}</span> – {p.label}
                </p>
              ))}
          </div>

          {/* Right side – upcoming events */}
          <div className="event-column">
            <div className="headline-event">📅 Tapahtumat</div>
            {upcomingEvents.length === 0 ? (
              <p className="no-events">Ei tulevia tapahtumia</p>
            ) : (
              upcomingEvents.map((item) => (
                <p
                  key={item.page}
                  onClick={() => setPage(item.page)}
                  className="clickable-entry event-entry"
                >
                  {item.event_date} – {item.title}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
