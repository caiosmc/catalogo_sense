import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos os produtos");
  const [isMobile, setIsMobile] = useState(false);
  const [sliderIndex, setSliderIndex] = useState({});

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

  const handleNext = (ref) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) + 1 > 2 ? 0 : (prev[ref] || 0) + 1
    }));
  };

  const handlePrev = (ref) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) - 1 < 0 ? 2 : (prev[ref] || 0) - 1
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {!isMobile && (
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

      <main style={{ flex: 1, padding: 20 }}>
        <h1 style={{ fontSize: 28, textAlign: "center", marginBottom: 20 }}>Catálogo Sense</h1>

        {isMobile && (
          <div style={{ paddingBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>Filtre a categoria desejada:</label>
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
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            placeholder="Buscar por nome do produto..."
            style={{
              width: "100%",
              maxWidth: 400,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 30,
              textAlign: "left"
            }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20
        }}>
          {produtosFiltrados.map((p, idx) => {
            const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
            const imgIndex = sliderIndex[p.referencia] || 0;

            return (
              <div key={idx} style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff", position: "relative" }}>
                <img
                  src={imagens[imgIndex]}
                  alt={p.nome}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
                {imagens.length > 1 && (
                  <>
                    <button
                      onClick={() => handlePrev(p.referencia)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 5,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >‹</button>
                    <button
                      onClick={() => handleNext(p.referencia)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 5,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >›</button>
                  </>
                )}
                <div style={{ padding: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: "bold" }}>{p.nome}</h3>
                  <p style={{ fontSize: 14, color: "#555" }}>Ref: {p.referencia}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
