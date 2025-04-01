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
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: cores.cinza, borderBottom: `2px solid ${cores.laranja}`, paddingBottom: 6, letterSpacing: 0.5 }}>Categorias</h2>
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
              marginBottom: 16
            }}
          >
            Limpar filtros
          </button>
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
        </aside>
      )}

      <main style={{ flex: 1, padding: 20, background: cores.cinzaClaro }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 36,
              color: cores.cinza,
              fontWeight: 700,
              margin: 0,
              padding: "10px 20px",
              background: cores.branco,
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            Catálogo Sense
          </h1>
          <img src="/logo-rg.png" alt="Logo RG" style={{ height: 70 }} />
        </div>

        {/* restante do código continua igual... */}
