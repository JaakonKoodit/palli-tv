import React from "react";

function NewsPage({ page, newsList }) {
  const item = newsList.find((n) => n.page === page);

  if (!item) {
    return (
      <div className="teletext-box">
        <div className="headline">SIVUA EI OLE OLEMASSA</div>
        <p>Yritä eri sivua</p>
      </div>
    );
  }

  return (
    <div className="teletext-box">
      <div className="headline">{item.title}</div>
      <p>{item.body}</p>
    </div>
  );
}

export default NewsPage;
