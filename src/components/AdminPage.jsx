import React from "react";
import { useState } from "react";
import newsData from "../data/news.json";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

function AdminPage() {
  const getNextAvailablePage = () => {
    const reservedPages = [100, 110, 200, 765, 800];
    const usedPages = newsData.map((item) => item.page);

    for (let i = 101; i <= 899; i++) {
      if (!usedPages.includes(i) && !reservedPages.includes(i)) {
        return i;
      }
    }

    return 899; // fallback
  };

  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [form, setForm] = useState({
    title: "",
    body: "",
    page: getNextAvailablePage(),
    pinned: false,
    date: getTodayDate(),
  });

  const [deletePageInput, setDeletePageInput] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [newsList, setNewsList] = useState(newsData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  if (!unlocked) {
    return (
      <div className="teletext-box">
        <div className="headline">🔐 Enter Admin Password</div>
        <input
          type="password"
          className="page-input-wide"
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && passwordInput === correctPassword) {
              setUnlocked(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div className="teletext-box">
        <div className="headline">🔧 PALLI-TV EDITORI – PAGE 765</div>

        <form onSubmit={handleSubmit}>
          <p>
            Page: {getNextAvailablePage()}
            {/*             <input
              type="number"
              name="page"
              value={form.page}
              onChange={handleChange}
            /> */}
          </p>
          <p>
            Title:{" "}
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </p>
          <p>
            Body:{" "}
            <textarea name="body" value={form.body} onChange={handleChange} />
          </p>

          <p>
            <label>
              <input
                type="checkbox"
                name="pinned"
                checked={form.pinned}
                onChange={handleChange}
              />
              Pinned?
            </label>
          </p>
          <button type="submit" className="add-news-button">
            Lisää uutinen
          </button>
        </form>
        <div style={{ marginTop: "2rem" }}>
          <div className="headline">🗑️ Remove News Item</div>

          <p>Existing Pages:</p>
          {newsList.map((item) => (
            <p key={item.page}>
              {item.page} – {item.title}
            </p>
          ))}

          <input
            type="number"
            placeholder="Poistettava sivu"
            value={deletePageInput}
            onChange={(e) => setDeletePageInput(e.target.value)}
            className="page-input-wide"
          />

          {pendingDelete ? (
            <button
              className="add-news-button"
              onClick={() => {
                setNewsList(
                  newsList.filter((n) => n.page !== pendingDelete.page)
                );
                setPendingDelete(null);
                setDeletePageInput("");
              }}
            >
              Poistetaanko? {pendingDelete.page}: {pendingDelete.title}
            </button>
          ) : (
            <button
              className="add-news-button"
              onClick={() => {
                const reservedPages = [100, 110, 200, 765, 800];
                const pageNum = parseInt(deletePageInput);
                const item = newsList.find((n) => n.page === pageNum);

                if (!item || reservedPages.includes(pageNum)) {
                  alert("That page number can't be deleted.");
                  return;
                }

                setPendingDelete(item);
              }}
            >
              Check Page to Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
