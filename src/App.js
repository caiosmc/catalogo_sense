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

  const cores = {
    laranja: "#F58220",
    cinza: "#4D4D4D",
    cinzaClaro: "#F0F0F0",
    branco: "#FFFFFF",
  };

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  const toggleCategoria = (cat) => {
    if (categoriasSelecionadas.includes(cat)) {
      const novaLista = categoriasSelecionadas.filter((c) => c !== cat);
      setCategoriasSelecionadas(novaLista.length ? novaLista : ["Todos os produtos"]);
    } else {
      const novaLista = categoriasSelecionadas
        .filter((c) => c !== "Todos os produtos")
        .concat(cat);
      setCategoriasSelecionadas(novaLista);
    }
  };

  const limparCategorias = () => {
    setCategoriasSelecionadas(["Todos os produtos"]);
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriasSelecionadas.includes("Todos os produtos") ||
      categoriasSelecionadas.includes(p.categoria);
    return matchNome && matchCategoria;
  });

  const handleNext = (ref) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) + 1 > 2 ? 0 : (prev[ref] || 0) + 1,
    }));
  };

  const handlePrev = (ref) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) - 1 < 0 ? 2 : (prev[ref] || 0) - 1,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* CATEGORIAS DESKTOP */}
      {!isMobile && (
        <aside
          style={{
            width: 200,
            padding: 20,
            borderRight: "1px solid #ddd",
            background: cores.cinzaClaro,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              color: cores.cinza,
              borderBottom: `2px solid ${cores.laranja}`,
              paddingBottom: 6,
              letterSpacing: 0.5,
            }}
          >
            Categorias
          </h2>
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
              width: "100%",
              marginBottom: 16,
            }}
          >
            Limpar filtros
          </button>
          <ul style={{ listStyle: "none", padding: 0 }}>
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
        </aside>
      )}

      {/* MAIN */}
      <main style={{ flex: 1, padding: 20, background: cores.cinzaClaro }}>
        {/* TÍTULO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              fontSize: 36,
              color: cores.cinza,
              fontWeight: 700,
              margin: 0,
              padding: "10px 20px",
              background: cores.branco,
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Catálogo Sense
          </h1>
          <img src="/logo-rg.png" alt="Logo RG" style={{ height: 70 }} />
        </div>

        {/* MOBILE FILTRO */}
        {isMobile && (
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: cores.cinza,
                marginBottom: 8,
              }}
            >
              Categorias
            </h2>
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
                marginBottom: 12,
              }}
            >
              Limpar filtros
            </button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {categorias.map((cat, idx) => (
                <label key={idx} style={{ color: cores.cinza }}>
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.includes(cat)}
                    onChange={() => toggleCategoria(cat)}
                    style={{ marginRight: 6 }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* BARRA DE PESQUISA */}
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
            marginInline: isMobile ? "auto" : 0,
          }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {/* GRID DE PRODUTOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {produtosFiltrados.map((p, idx) => {
            const imagemAtual = p[`imagem_d${(sliderIndex[p.referencia] || 0) + 1}`];
            return (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                {imagemAtual && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={imagemAtual}
                      alt={p.nome}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => handlePrev(p.referencia)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 5,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => handleNext(p.referencia)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 5,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      ▶
                    </button>
                  </div>
                )}
                <div style={{ padding: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: "bold", color: cores.cinza }}>
                    {p.nome}
                  </h3>
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
