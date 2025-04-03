import React from "react";
import newsData from "../data/news.json";

function FrontPage() {
  const frontItems = newsData.slice(0, 5);
  const pinnedItem = newsData.find((item) => item.pinned);
  const latestItems = newsData
    .filter((item) => !item.pinned)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <div className="teletext-box">
        <div className="headline">ETUSIVU - 100</div>

        {pinnedItem && (
          <div className="pinned-headline">
            {pinnedItem.page} - {pinnedItem.title}
          </div>
        )}

        {latestItems.map((item) => (
          <p key={item.page}>
            {item.page} - {item.title}
          </p>
        ))}

        <div className="category-box">
          <p>
            <span className="page-code">110</span> – SÄÄ (Weather)
          </p>
          <p>
            <span className="page-code">200</span> – URHEILU (Sports)
          </p>
          <p>
            <span className="page-code">800</span> – ASETUKSET (Settings)
          </p>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
