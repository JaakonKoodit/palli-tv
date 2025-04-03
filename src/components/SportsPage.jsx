function SportsPage() {
  return (
    <div className="teletext-box">
      <div className="headline">🏅 URHEILU – SIVU 200</div>
      <p>Tämän päivän urheilukuva:</p>
      <img
        src="/salainen.jpg"
        alt="Urheilukuva"
        style={{
          maxWidth: "40%",
          border: "2px solid white",
          marginTop: "1rem",
        }}
      />
    </div>
  );
}

export default SportsPage;

/* ("https://archive.ph/mqb12/01cba01a6f3bf7f3cf9411a0fb9e904dfbf40caf.jpg"); */
