function Home() {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "24px",
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    }}>
      <h1 style={{ marginBottom: "16px" }}>
        💈 Barber Booking
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
        Dobrodošli u sistem za online rezervaciju termina u barber shopu.
      </p>

      <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <li>✔️ Pregled svih usluga i cena</li>
        <li>✔️ Brza rezervacija slobodnih termina</li>
        <li>✔️ Pregled i otkazivanje rezervacija</li>
        <li>✔️ Admin panel za upravljanje uslugama</li>
      </ul>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        Počni tako što ćeš otvoriti stranicu <i>Usluge</i> u meniju.
      </p>
    </div>
  )
}

export default Home
