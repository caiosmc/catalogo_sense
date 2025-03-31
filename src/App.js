
import { useState, useEffect } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("/produtos.json")
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const categorias = [...new Set(filtrados.map(p => p.categoria))];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Catálogo Sense</h1>
      <input
        placeholder="Buscar por nome..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 30 }}
      />
      {categorias.map((categoria, idx) => (
        <div key={idx}>
          <h2>{categoria}</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20
          }}>
            {filtrados.filter(p => p.categoria === categoria).map((p, i) => (
              <div key={i} style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 10,
                textAlign: "center"
              }}>
                <img src={p.imagem_d1} alt={p.nome} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8 }} />
                <h3 style={{ margin: "10px 0 5px" }}>{p.nome}</h3>
                <p style={{ fontSize: 14, color: "#555" }}>Ref: {p.referencia}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
