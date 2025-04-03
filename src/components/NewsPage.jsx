import React from "react";
import newsData from "../data/news.json";

function NewsPage({ page }) {
  const item = newsData.find((n) => n.page === page);

  if (!item) {
    <div className="teletext-box">
      <div className="headline">SIVUA EI OLE OLEMASSA</div>
      <p>Yritä eri sivua</p>
    </div>;
  }

  return (
    <div className="teletext-box">
      <div className="headline">{item.title}</div>
      <p>{item.body}</p>
    </div>
  );
}

export default NewsPage;
{
}
