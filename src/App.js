import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos os produtos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data));

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categorias = ["Todos os produtos", ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriaSelecionada === "Todos os produtos" || p.categoria === categoriaSelecionada;
    return matchNome && matchCategoria;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Menu responsivo */}
      {isMobile ? (
        <div style={{ padding: 20 }}>
          <label style={{ fontWeight: "bold" }}>Categorias:</label>
          <select
            style={{ width: "100%", padding: 10, marginTop: 10 }}
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            {categorias.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      ) : (
        <aside style={{ width: 240, padding: 20, borderRight: "1px solid #ddd" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Categorias</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categorias.map((cat, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setCategoriaSelecionada(cat)}
                  style={{
                    background: categoriaSelecionada === cat ? "#eee" : "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: categoriaSelecionada === cat ? "bold" : "normal",
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Conteúdo principal */}
      <main style={{ flex: 1, padding: 20 }}>
        <h1 style={{ fontSize: 28, textAlign: "center", marginBottom: 20 }}>Catálogo Sense</h1>

        <input
          placeholder="Buscar por nome do produto..."
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 30,
          }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {produtosFiltrados.map((p, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <img
                src={p.imagem_d1}
                alt={p.nome}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />
              <div style={{ padding: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: "bold" }}>{p.nome}</h3>
                <p style={{ fontSize: 14, color: "#555" }}>Ref: {p.referencia}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
