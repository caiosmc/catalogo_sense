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

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  const handleCategoriaToggle = (categoria) => {
    setCategoriasSelecionadas(prev =>
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const limparFiltros = () => {
    setCategoriasSelecionadas([]);
    setFiltro("");
  };

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(p.categoria);
    return matchNome && matchCategoria;
  });

  const handlePrev = (ref, total) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] > 0 ? prev[ref] : total) - 1,
    }));
  };

  const handleNext = (ref, total) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: ((prev[ref] || 0) + 1) % total,
    }));
  };

  const setaEstilo = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#fff",
    border: "none",
    fontSize: 18,
    padding: "4px 10px",
    cursor: "pointer",
    borderRadius: "50%",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    zIndex: 2,
    left: 0,
  };

  const categoriasParaRenderizar = categoriasSelecionadas.length > 0 ? categoriasSelecionadas : categorias;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* MENU LATERAL - DESKTOP */}
      {!isMobile && (
        <aside style={{ width: 200, padding: 20, background: "#f1f1f1" }}>
          <h3 style={{ fontSize: 18, color: "#333", marginBottom: 10 }}>Categorias</h3>
          <button onClick={limparFiltros} style={{
            marginBottom: 12,
            background: "#ff6600",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12
          }}>Limpar filtros</button>
          {categorias.map((cat, idx) => (
            <div key={idx}>
              <label style={{ fontSize: 14 }}>
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

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, padding: 20, background: "#f7f7f7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}>Catálogo Sense</h1>
          <img src="/logo-rg.png" alt="Logo" style={{ height: 45 }} />
        </div>

        {/* MOBILE: CATEGORIAS */}
        {isMobile && (
          <div style={{ margin: "20px 0" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
              Filtre a categoria desejada:
            </label>
            <select
              value=""
              onChange={(e) => handleCategoriaToggle(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6 }}
            >
              <option value="" disabled>Escolha uma categoria</option>
              {categorias.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            {categoriasSelecionadas.length > 0 && (
              <button onClick={limparFiltros} style={{
                marginTop: 10,
                background: "#ff6600",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12
              }}>Limpar filtros</button>
            )}
          </div>
        )}

        {/* BUSCA */}
        <input
          placeholder="Buscar por nome do produto..."
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 30,
            display: "block",
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto"
          }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {/* CATEGORIAS E PRODUTOS */}
        {categoriasParaRenderizar.map((cat, idx) => {
          const itens = produtosFiltrados.filter(p => p.categoria === cat);
          if (itens.length === 0) return null;
          return (
            <div key={idx} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, color: "#444", margin: "30px 0 10px" }}>{cat}</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 20
              }}>
                {itens.map((p, i) => {
                  const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
                  const totalImagens = imagens.length;
                  const indice = sliderIndex[p.referencia] || 0;
                  const imagemAtual = imagens[indice];

                  return (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                      }}
                    >
                      {totalImagens > 0 && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={imagemAtual}
                            alt={p.nome}
                            style={{ width: "100%", height: 150, objectFit: "cover" }}
                          />
                          {totalImagens > 1 && (
                            <>
                              <button onClick={() => handlePrev(p.referencia, totalImagens)} style={setaEstilo}>◀</button>
                              <button onClick={() => handleNext(p.referencia, totalImagens)} style={{ ...setaEstilo, right: 0, left: "auto" }}>▶</button>
                            </>
                          )}
                        </div>
                      )}
                      <div style={{ padding: 12 }}>
                        <h3 style={{ fontSize: 16, fontWeight: "bold" }}>{p.nome}</h3>
                        <p style={{ fontSize: 14, color: "#555" }}>Ref: {p.referencia}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* BOTÃO VOLTAR AO TOPO */}
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
            padding: 10,
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          ▲
        </button>
      )}
    </div>
  );
}

export default App;
