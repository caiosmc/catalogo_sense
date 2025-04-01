import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao carregar produtos:", err));

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  const toggleCategoria = (cat) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const limparCategorias = () => {
    setCategoriasSelecionadas([]);
    setFiltro("");
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria =
      categoriasSelecionadas.length === 0 ||
      categoriasSelecionadas.includes(p.categoria);
    return matchNome && matchCategoria;
  });

  const agrupadosPorCategoria =
    categoriasSelecionadas.length > 0 ? categoriasSelecionadas : categorias;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#4d4d4d",
      }}
    >
      {!isMobile && (
        <aside style={{ width: 200, padding: 20, borderRight: "1px solid #ddd" }}>
          <h2
            style={{
              fontSize: 20,
              color: "#4d4d4d",
              marginBottom: 10,
              textDecoration: "underline",
            }}
          >
            Categorias
          </h2>
          <button onClick={limparCategorias} style={{ marginBottom: 10, padding: 6, fontSize: 12 }}>
            Limpar filtros
          </button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {categorias.map((cat, idx) => (
              <li key={idx}>
                <label style={{ display: "block", fontSize: 14, color: "#4d4d4d" }}>
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

      <main style={{ flex: 1, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 32, color: "#4d4d4d" }}>Catálogo Sense</h1>
          <img src="/logo-rg.png" alt="Logo" style={{ width: isMobile ? 80 : 100 }} />
        </div>

        {isMobile && (
          <div style={{ margin: "20px 0" }}>
            <label style={{ color: "#4d4d4d", fontSize: 16 }}>Filtre a categoria desejada</label>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {categorias.map((cat, idx) => (
                <li key={idx}>
                  <label style={{ display: "block", fontSize: 14, color: "#4d4d4d" }}>
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
              <li>
                <button
                  onClick={limparCategorias}
                  style={{ marginTop: 10, padding: 6, fontSize: 12 }}
                >
                  Limpar filtros
                </button>
              </li>
            </ul>
          </div>
        )}

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
            marginLeft: "auto",
            marginRight: "auto",
            color: "#4d4d4d",
          }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {agrupadosPorCategoria.map((cat, idx) => (
          <div key={idx}>
            <h2 style={{ color: "#4d4d4d", fontSize: 22, marginTop: 40 }}>{cat}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 20,
              }}
            >
              {produtosFiltrados.filter((p) => p.categoria === cat).map((p, pidx) => (
                <ProdutoCard key={pidx} produto={p} />
              ))}
            </div>
          </div>
        ))}
      </main>

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: 10,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#f57c00",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  );
}

function ProdutoCard({ produto }) {
  const imagens = [produto.imagem_d1, produto.imagem_d2, produto.imagem_d3].filter(Boolean);
  const [index, setIndex] = useState(0);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        color: "#4d4d4d",
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imagens[index]}
          alt={produto.nome}
          style={{ width: "100%", height: 150, objectFit: "cover" }}
        />
        {imagens.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) => (prev - 1 + imagens.length) % imagens.length);
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                background: "#ffffffcc",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) => (prev + 1) % imagens.length);
              }}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                background: "#ffffffcc",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
      <div style={{ padding: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#4d4d4d" }}>{produto.nome}</h3>
        <p style={{ fontSize: 14, color: "#4d4d4d" }}>Ref: {produto.referencia}</p>
      </div>
    </div>
  );
}

export default App;
