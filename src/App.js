// Atualizações detalhadas para App.js
// Aplicadas as correções descritas: grid responsivo, filtros visíveis, cores, logos, fonte menu lateral, seta topo

import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderIndex, setSliderIndex] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  const handleCategoriaToggle = (categoria) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );
  };

  const limparFiltros = () => {
    setCategoriasSelecionadas([]);
    setFiltro("");
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(p.categoria);
    return matchNome && matchCategoria;
  });

  const handlePrev = (ref, total) => {
    setSliderIndex((prev) => ({ ...prev, [ref]: (prev[ref] > 0 ? prev[ref] : total) - 1 }));
  };

  const handleNext = (ref, total) => {
    setSliderIndex((prev) => ({ ...prev, [ref]: ((prev[ref] || 0) + 1) % total }));
  };

  const categoriasParaRenderizar =
    categoriasSelecionadas.length > 0 ? categoriasSelecionadas : categorias;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {!isMobile && (
        <aside style={{ width: 180, padding: 20, background: "#f1f1f1" }}>
          <h3 style={{ fontSize: 16, color: "#444", marginBottom: 10 }}>Categorias</h3>
          <button onClick={limparFiltros} style={{ marginBottom: 12 }}>Limpar filtros</button>
          {categorias.map((cat, idx) => (
            <div key={idx}>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat)}
                  onChange={() => handleCategoriaToggle(cat)}
                  style={{ marginRight: 6 }}
                />
                {cat}
              </label>
            </div>
          ))}
        </aside>
      )}

      <main style={{ flex: 1, padding: 20, background: "#f7f7f7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#444" }}>Catálogo Sense</h1>
          <img src="/logo-rg.png" alt="Logo" style={{ height: isMobile ? 50 : 70 }} />
        </div>

        {isMobile && (
          <div style={{ margin: "20px 0" }}>
            <h3 style={{ fontSize: 16, color: "#444", marginBottom: 10 }}>Filtre a categoria desejada:</h3>
            {categorias.map((cat, idx) => (
              <label key={idx} style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat)}
                  onChange={() => handleCategoriaToggle(cat)}
                  style={{ marginRight: 6 }}
                />
                {cat}
              </label>
            ))}
            <button onClick={limparFiltros} style={{ marginTop: 10 }}>Limpar filtros</button>
          </div>
        )}

        <input
          placeholder="Buscar por nome do produto..."
          style={{ width: "100%", maxWidth: 400, padding: 10, borderRadius: 6, marginBottom: 30 }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {categoriasParaRenderizar.map((cat, idx) => {
          const itens = produtosFiltrados.filter((p) => p.categoria === cat);
          if (itens.length === 0) return null;
          return (
            <div key={idx} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, color: "#444", marginBottom: 12 }}>{cat}</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 20,
                }}
              >
                {itens.map((p, i) => {
                  const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
                  const total = imagens.length;
                  const index = sliderIndex[p.referencia] || 0;

                  return (
                    <div key={i} style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                      {total > 0 && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={imagens[index]}
                            alt={p.nome}
                            style={{ width: "100%", height: 150, objectFit: "cover" }}
                          />
                          {total > 1 && (
                            <>
                              <button onClick={() => handlePrev(p.referencia, total)} style={{ position: "absolute", top: "50%", left: 8 }}>◀</button>
                              <button onClick={() => handleNext(p.referencia, total)} style={{ position: "absolute", top: "50%", right: 8 }}>▶</button>
                            </>
                          )}
                        </div>
                      )}
                      <div style={{ padding: 10 }}>
                        <h3 style={{ fontSize: 15, fontWeight: "bold" }}>{p.nome}</h3>
                        <p style={{ fontSize: 13, color: "#555" }}>Ref: {p.referencia}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            border: "none",
            background: "#ff6600",
            color: "#fff",
            fontSize: 22,
            width: 40,
            height: 40,
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
