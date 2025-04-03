import newsData from "../data/news.json";

function NewsBoard() {
  const [selectedPage, setSelectedPage] = useState(null);

  if (selectedPage) {
    const newsItem = newsData.find((n) => n.page === selectedPage);
    return newsItem ? (
      <div className="teletext-box">
        <div className="headline">{newsItem.title}</div>
        <p>{newsItem.body}</p>
      </div>
    ) : (
      <div className="teletext-box">
        <p>Page {selectedPage} not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="teletext-box">
        <div className="headline">🔷 FRIEND GROUP FRONT PAGE</div>
        {newsData.slice(0, 5).map((item) => (
          <p key={item.page}>
            {item.page} - {item.title}
          </p>
        ))}
        <input
          type="number"
          placeholder="Enter page number (100–899)"
          onChange={(e) => setSelectedPage(parseInt(e.target.value))}
          style={{ fontSize: "1rem", marginTop: "1rem", width: "100%" }}
        />
      </div>
    </div>
  );
}

export default NewsBoard;
