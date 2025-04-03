import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function CalendarPage({ setPage }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .not("event_date", "is", null)
        .order("event_date", { ascending: true });

      setEvents(data || []);
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fi-FI", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    });
  };

  return (
    <div className="teletext-box">
      <div className="headline">📆 Kalenteri – Sivu 120</div>
      {events.length === 0 ? (
        <p>Ei tapahtumia</p>
      ) : (
        events.map((e) => (
          <p
            key={e.page}
            onClick={() => setPage && setPage(e.page)}
            className="clickable-entry"
          >
            {formatDate(e.event_date)} – {e.title}
          </p>
        ))
      )}
    </div>
  );
}

export default CalendarPage;
