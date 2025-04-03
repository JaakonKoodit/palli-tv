import { useState, useEffect } from "react";
import FrontPage from "./FrontPage";
import NewsPage from "./NewsPage";
import AdminPage from "./AdminPage";
import WeatherPage from "./WeatherPage";
import SportsPage from "./SportsPage";
import CalendarPage from "./CalendarPage";
import { supabase } from "../lib/supabase";

function TeletextFrame() {
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(100); // Default to the front page (100)
  const [requestedPage, setRequestedPage] = useState(100); // Default to the front page (100)
  const [displayedPage, setDisplayedPage] = useState(100); // Default to the front page (100)

  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (data) setNewsList(data);
    };

    fetch();
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      if (
        requestedPage === 765 ||
        requestedPage === 110 ||
        requestedPage === 200 ||
        requestedPage === 120 ||
        requestedPage === 100
      ) {
        setDisplayedPage(requestedPage); // instantly allowed
        return;
      }

      const { data, error } = await supabase
        .from("news")
        .select("page")
        .eq("page", requestedPage);

      if (data?.length > 0) {
        setDisplayedPage(requestedPage); // only switch when it exists
      } else {
        setDisplayedPage(null); // Set to null if the page does not exist
      }
    };

    loadPage();
  }, [requestedPage]);

  const renderPage = () => {
    if (displayedPage === 100) {
      return <FrontPage newsList={newsList} setPage={setRequestedPage} />;
    }
    if (displayedPage === 765) {
      return <AdminPage />;
    }
    if (displayedPage === 110) {
      return <WeatherPage />;
    }
    if (displayedPage === 200) {
      return <SportsPage />;
    }
    if (displayedPage === 120) {
      return <CalendarPage setPage={setRequestedPage} />;
    }
    if (displayedPage === null) {
      return (
        <div className="teletext-box">
          <div className="headline">SIVUA EI OLE OLEMASSA</div>
          <p>Yritä eri sivua</p>
        </div>
      );
    }
    return <NewsPage page={displayedPage} newsList={newsList} />;
  };

  return (
    <div>
      <div
        className="header-bar clickable"
        onClick={() => setDisplayedPage(100)}
      >
        PALLI-TV
      </div>
      <div className="teletext-box">
        <div className="headline">KUUMIMMAT UUTISET</div>
        <input
          className="page-input"
          type="number"
          placeholder={displayedPage}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const number = parseInt(pageInput);
              if (number >= 100 && number <= 899) {
                setRequestedPage(number);
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
