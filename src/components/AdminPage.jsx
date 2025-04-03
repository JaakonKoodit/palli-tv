import React from "react";
import { useState, useEffect } from "react";
import specialPages from "../data/specialPages.json";
import { supabase } from "../lib/supabase";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

function AdminPage() {
  const [deletePageInput, setDeletePageInput] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const reservedPages = specialPages.map((p) => p.page);
  const existingPinned = newsList.find((n) => n.pinned);
  const [isEvent, setIsEvent] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [editInput, setEditInput] = useState("");

  const initialFormState = {
    title: "",
    body: "",
    page: null, // This will be dynamically set using getNextAvailablePage()
    pinned: false,
    date: getTodayDate(),
    event_date: null,
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });

    if (!error) setNewsList(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getNextAvailablePage = () => {
    const usedPages = newsList.map((item) => item.page);

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
    ...initialFormState,
    page: getNextAvailablePage(), // Dynamically set the initial page
  });

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      page: getNextAvailablePage(),
    }));
  }, [newsList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPage !== null) {
      // Update existing post
      const { error } = await supabase
        .from("news")
        .update(form)
        .eq("page", editingPage);

      if (error) {
        alert("Päivitys epäonnistui");
        console.error(error);
      } else {
        alert("Uutinen päivitetty ✅");
        setEditingPage(null);
        setForm({ ...initialFormState, page: getNextAvailablePage() }); // Reset form
        setIsEvent(false);
        fetchNews();
      }
      return;
    }

    // If this is pinned, unpin any existing one first
    if (form.pinned) {
      await supabase.from("news").update({ pinned: false }).eq("pinned", true);
    }

    const { error } = await supabase.from("news").insert([form]);

    if (error) {
      alert("Jokin meni pieleen 😢");
      console.error(error);
    } else {
      alert("Uutinen lisätty ✅");
      setForm({ ...initialFormState, page: getNextAvailablePage() }); // Reset form
      fetchNews(); // Refetch live data after insert
    }
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
            Page: {form.page}
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
            <label>
              <input
                type="checkbox"
                checked={isEvent}
                onChange={(e) => {
                  setIsEvent(e.target.checked);
                  if (!e.target.checked) {
                    setForm({ ...form, event_date: null });
                  }
                }}
              />
              Event?
            </label>
          </p>

          {isEvent && (
            <p>
              <label>
                Päivämäärä:
                <input
                  type="date"
                  value={form.event_date || ""}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
                  }
                  required
                />
              </label>
            </p>
          )}

          {form.pinned && existingPinned && (
            <p style={{ color: "yellow", fontWeight: "bold" }}>
              ⚠ Page {existingPinned.page} – {existingPinned.title} will be
              unpinned.
            </p>
          )}

          <button type="submit" className="add-news-button">
            Lisää uutinen
          </button>
        </form>
        <div style={{ marginTop: "2rem" }}>
          <div className="headline">✏️ Muokkaa sivua</div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const pageNum = parseInt(editInput);
              if (isNaN(pageNum)) return;

              const { data, error } = await supabase
                .from("news")
                .select("*")
                .eq("page", pageNum)
                .single();

              if (error || !data) {
                alert("Sivua ei löytynyt");
                return;
              }

              setEditingPage(pageNum);
              setForm({
                title: data.title,
                body: data.body,
                page: data.page,
                date: data.date,
                pinned: data.pinned,
                event_date: data.event_date,
              });
              setIsEvent(!!data.event_date);
            }}
          >
            <input
              type="number"
              placeholder="Sivunumero"
              className="page-input-wide"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
            />
            <button type="submit" className="edit-button">
              Hae
            </button>
          </form>
        </div>

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
              onClick={async () => {
                const { error } = await supabase
                  .from("news")
                  .delete()
                  .eq("page", pendingDelete.page);

                if (error) {
                  alert("Poisto epäonnistui 😢");
                  console.error(error);
                } else {
                  alert("Poistettu ✅");
                  setPendingDelete(null);
                  setDeletePageInput("");
                  fetchNews(); // Update local list
                }
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
