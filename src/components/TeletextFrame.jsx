import { useState } from "react";
import FrontPage from "./FrontPage";
import NewsPage from "./NewsPage";
import newsData from "../data/news.json";
import AdminPage from "./AdminPage";

function TeletextFrame() {
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(100); // Default to the front page (100)

  const renderPage = () => {
    if (page === 100) {
      return <FrontPage />;
    }
    if (page === 765) {
      return <AdminPage />;
    }
    return <NewsPage page={page} />;
  };

  return (
    <div>
      <div className="header-bar">PALLI-TV</div>
      <div className="teletext-box">
        <div className="headline">KUUMIMMAT UUTISET</div>
        <input
          className="page-input"
          type="number"
          placeholder={page}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const number = parseInt(pageInput);
              if (number >= 100 && number <= 899) {
                setPage(number);
              }
            }
          }}
        />
        {/* <div className="page-indicator">Sivu: {page}</div> */}
      </div>
      {renderPage()}
    </div>
  );
}

export default TeletextFrame;
