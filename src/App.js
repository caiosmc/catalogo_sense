import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(["Todos os produtos"]);
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

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  const toggleCategoria = (cat) => {
    if (categoriasSelecionadas.includes(cat)) {
      const updated = categoriasSelecionadas.filter(c => c !== cat);
      setCategoriasSelecionadas(updated.length ? updated : ["Todos os produtos"]);
    } else {
      const updated = categoriasSelecionadas.filter(c => c !== "Todos os produtos").concat(cat);
      setCategoriasSelecionadas(updated);
    }
  };

  const limparCategorias = () => {
    setCategoriasSelecionadas(["Todos os produtos"]);
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriasSelecionadas.includes("Todos os produtos") || categoriasSelecionadas.includes(p.categoria);
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
        <aside style={{ width: 200, padding: 20, borderRight: "1px solid #ddd", background: cores.cinzaClaro }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: cores.cinza, borderBottom: `2px solid ${cores.laranja}`, paddingBottom: 6, letterSpacing: 0.5 }}>Categorias</h2>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            {categorias.map((cat, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <label style={{ color: cores.cinza }}>
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(cat)}
                    onChange={() => toggleCategoria(cat)}
                    style={{ marginRight: 8 }}
                  />
                  {cat}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={limparCategorias}
            style={{
              background: cores.laranja,
              color: cores.branco,
              border: "none",
              borderRadius: 6,
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 500,
              width: "100%"
            }}
          >
            Limpar filtros
          </button>
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
              multiple
              style={{ width: "100%", padding: 10, borderRadius: 6, marginTop: 8 }}
              value={categoriasSelecionadas.includes("Todos os produtos") ? [] : categoriasSelecionadas}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setCategoriasSelecionadas(selected.length ? selected : ["Todos os produtos"]);
              }}
            >
              {categorias.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <button
                onClick={limparCategorias}
                style={{
                  background: cores.laranja,
                  color: cores.branco,
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Limpar filtros
              </button>
            </div>
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

        {(categoriasSelecionadas.includes("Todos os produtos") ? categorias : categoriasSelecionadas).map((cat, idx) => {
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
                    <div key={idx} style={{ borderRadius: 10, overflow: "hidden", background: cores.branco, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", position: "relative" }}>
                      <img src={imagens[imgIndex]} alt={p.nome} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                      {imagens.length > 1 && (
                        <>
                          <button onClick={() => handlePrev(p.referencia)} style={{ position: "absolute", top: "50%", left: 5, transform: "translateY(-50%)", background: cores.branco, border: "none", borderRadius: "50%", width: 24, height: 24, fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer" }}>‹</button>
                          <button onClick={() => handleNext(p.referencia)} style={{ position: "absolute", top: "50%", right: 5, transform: "translateY(-50%)", background: cores.branco, border: "none", borderRadius: "50%", width: 24, height: 24, fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer" }}>›</button>
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
        })}
      </main>
    </div>
  );
}

export default App;
