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

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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
    setSliderIndex((prev) => ({ ...prev, [ref]: (prev[ref] || 0) + 1 > 2 ? 0 : (prev[ref] || 0) + 1 }));
  };

  const handlePrev = (ref) => {
    setSliderIndex((prev) => ({ ...prev, [ref]: (prev[ref] || 0) - 1 < 0 ? 2 : (prev[ref] || 0) - 1 }));
  };

  const cores = {
    laranja: "#F58220",
    cinza: "#4D4D4D",
    cinzaClaro: "#F0F0F0",
    branco: "#FFFFFF"
  };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>

      {!isMobile && (
        <aside style={{ width: 180, padding: 20, borderRight: "1px solid #ddd", background: cores.cinzaClaro }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 16,
              color: cores.cinza,
              borderBottom: `2px solid ${cores.laranja}`,
              paddingBottom: 6,
              letterSpacing: 0.5
            }}
          >
            Categorias
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categorias.map((cat, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setCategoriaSelecionada(cat)}
                  style={{
                    background: categoriaSelecionada === cat ? cores.laranja : "transparent",
                    color: categoriaSelecionada === cat ? cores.branco : cores.cinza,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: "8px 12px",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontWeight: 500
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <main style={{ flex: 1, padding: 20, background: cores.cinzaClaro }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 32, color: cores.cinza }}>Catálogo Sense</h1>
          <img src="/logo-rg.png" alt="Logo RG" style={{ height: 70 }} />
        </div>

        {isMobile && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>Filtre a categoria desejada:</label>
            <select
              style={{ width: "100%", padding: 10, borderRadius: 6, marginTop: 8 }}
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

        {categoriaSelecionada === "Todos os produtos"
          ? categorias.filter(c => c !== "Todos os produtos").map((cat, idx) => {
              const produtosDaCategoria = produtosFiltrados.filter(p => p.categoria === cat);
              if (!produtosDaCategoria.length) return null;
              return (
                <div key={idx} style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 22, color: cores.cinza, marginBottom: 16 }}>{cat}</h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 20
                  }}>
                    {produtosDaCategoria.map((p, idx) => {
                      const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
                      const imgIndex = sliderIndex[p.referencia] || 0;

                      return (
                        <div key={idx} style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          background: cores.branco,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          position: "relative"
                        }}>
                          <img
                            src={imagens[imgIndex]}
                            alt={p.nome}
                            style={{ width: "100%", height: 160, objectFit: "cover" }}
                          />
                          {imagens.length > 1 && (
                            <>
                              <button onClick={() => handlePrev(p.referencia)} style={{
                                position: "absolute", top: "50%", left: 5, transform: "translateY(-50%)",
                                background: cores.branco, border: "none", borderRadius: "50%",
                                width: 24, height: 24, fontSize: 14,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer"
                              }}>‹</button>
                              <button onClick={() => handleNext(p.referencia)} style={{
                                position: "absolute", top: "50%", right: 5, transform: "translateY(-50%)",
                                background: cores.branco, border: "none", borderRadius: "50%",
                                width: 24, height: 24, fontSize: 14,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer"
                              }}>›</button>
                            </>
                          )}
                          <div style={{ padding: 12 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: cores.cinza }}>{p.nome}</h3>
                            <p style={{ fontSize: 13, color: "#888" }}>Ref: {p.referencia}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20
            }}>
              {produtosFiltrados.map((p, idx) => {
                const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
                const imgIndex = sliderIndex[p.referencia] || 0;

                return (
                  <div key={idx} style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    background: cores.branco,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    position: "relative"
                  }}>
                    <img
                      src={imagens[imgIndex]}
                      alt={p.nome}
                      style={{ width: "100%", height: 160, objectFit: "cover" }}
                    />
                    {imagens.length > 1 && (
                      <>
                        <button onClick={() => handlePrev(p.referencia)} style={{
                          position: "absolute", top: "50%", left: 5, transform: "translateY(-50%)",
                          background: cores.branco, border: "none", borderRadius: "50%",
                          width: 24, height: 24, fontSize: 14,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer"
                        }}>‹</button>
                        <button onClick={() => handleNext(p.referencia)} style={{
                          position: "absolute", top: "50%", right: 5, transform: "translateY(-50%)",
                          background: cores.branco, border: "none", borderRadius: "50%",
                          width: 24, height: 24, fontSize: 14,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer"
                        }}>›</button>
                      </>
                    )}
                    <div style={{ padding: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: cores.cinza }}>{p.nome}</h3>
                      <p style={{ fontSize: 13, color: "#888" }}>Ref: {p.referencia}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}

export default App;
