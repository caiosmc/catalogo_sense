// App.js completo com a barra de busca centralizada no mobile

import { useEffect, useState } from "react";
import {
  obterCategoriasDaURL,
  obterTermoBuscaDaURL,
  atualizarParametrosURL,
  atualizarURLComBusca,
  atualizarURLComCategorias
} from "./utils/urlFiltros";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderIndex, setSliderIndex] = useState({});
  const [mostrarCategoriasMobile, setMostrarCategoriasMobile] = useState(false);

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

  useEffect(() => {
    const categoriasURL = obterCategoriasDaURL();
    const buscaURL = obterTermoBuscaDaURL();
    setCategoriasSelecionadas(categoriasURL);
    setFiltro(buscaURL);
  }, []);

  useEffect(() => {
    atualizarURLComCategorias(categoriasSelecionadas);
  }, [categoriasSelecionadas]);

  useEffect(() => {
    atualizarURLComBusca(filtro);
  }, [filtro]);

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  const toggleCategoria = (cat) => {
    if (cat === "__ALL__") {
      if (categoriasSelecionadas.length === categorias.length) {
        setCategoriasSelecionadas([]);
      } else {
        setCategoriasSelecionadas([...categorias]);
      }
    } else {
      setCategoriasSelecionadas((prev) => {
        const novaLista = prev.includes(cat)
          ? prev.filter((c) => c !== cat)
          : [...prev, cat];
        return novaLista;
      });
    }
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

  const agrupadosPorCategoria = categoriasSelecionadas.length > 0 ? categoriasSelecionadas : categorias;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const renderImagens = (p, pidx) => {
    const imagens = [p.imagem_d1, p.imagem_d2, p.imagem_d3].filter(Boolean);
    const index = sliderIndex[pidx] || 0;
    const updateIndex = (newIndex) => {
      setSliderIndex((prev) => ({ ...prev, [pidx]: newIndex }));
    };

    if (imagens.length <= 1) {
      return (
        <img src={imagens[0]} alt={p.nome} style={{ width: "100%", height: 150, objectFit: "cover" }} />
      );
    }

    return (
      <div style={{ position: "relative" }}>
        <img src={imagens[index]} alt={p.nome} style={{ width: "100%", height: 150, objectFit: "cover" }} />
        <button onClick={() => updateIndex((index - 1 + imagens.length) % imagens.length)} style={setaEstilo("left")}>❮</button>
        <button onClick={() => updateIndex((index + 1) % imagens.length)} style={setaEstilo("right")}>❯</button>
      </div>
    );
  };

  const setaEstilo = (lado) => ({
    position: "absolute",
    top: "50%",
    [lado]: 10,
    transform: "translateY(-50%)",
    background: "#f57c00",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 28,
    height: 28,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
  });

  const estiloBotaoMobile = {
    backgroundColor: "#f57c00",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    marginBottom: 10
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", color: "#4d4d4d", backgroundColor: "#f5f5f5" }}>
      {!isMobile && (
        <aside style={{ width: 200, padding: 20, borderRight: "1px solid #ddd" }}>
          <div>
            <h2 style={{ fontSize: 18, color: "#4d4d4d", marginBottom: 4 }}>Categorias</h2>
            <div style={{ height: 4, backgroundColor: "#f57c00", width: 40, marginBottom: 10 }}></div>
          </div>
          <button onClick={limparCategorias} style={{ backgroundColor: "#f57c00", color: "#fff", marginBottom: 10, padding: 6, fontSize: 12, border: "none", borderRadius: 4 }}>Limpar filtros</button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <label style={{ display: "block", fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.length === categorias.length}
                  onChange={() => toggleCategoria("__ALL__")}
                  style={{ marginRight: 8 }}
                />
                Selecionar tudo
              </label>
            </li>
            {categorias.map((cat, idx) => (
              <li key={idx}>
                <label style={{ display: "block", fontSize: 12 }}>
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
          <h1 style={{ fontSize: isMobile ? 32 : 40, color: "#4d4d4d" }}>
            <span style={{ color: "#4d4d4d" }}>Catálogo </span>
            <span style={{ color: "#f57c00" }}>Sense</span>
          </h1>
          <img src="/logo-rg.png" alt="Logo" style={{ width: isMobile ? 80 : 100 }} />
        </div>

        {isMobile && (
          <div style={{ margin: "20px 0" }}>
            <h2 style={{ color: "#4d4d4d", fontSize: 16, marginBottom: 10 }}>Filtre as Categorias</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)} style={estiloBotaoMobile}>
                {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
              </button>
              {mostrarCategoriasMobile && (
                <button onClick={limparCategorias} style={estiloBotaoMobile}>Limpar filtros</button>
              )}
            </div>
            {mostrarCategoriasMobile && (
              <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                <li>
                  <label style={{ display: "block", fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={categoriasSelecionadas.length === categorias.length}
                      onChange={() => toggleCategoria("__ALL__")}
                      style={{ marginRight: 8 }}
                    />
                    Selecionar tudo
                  </label>
                </li>
                {categorias.map((cat, idx) => (
                  <li key={idx}>
                    <label style={{ display: "block", fontSize: 14 }}>
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
            )}
          </div>
        )}

        {/* Centralizando a barra de busca */}
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
              color: "#4d4d4d"
            }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {agrupadosPorCategoria.map((cat, idx) => {
          const produtosDaCategoria = produtosFiltrados.filter((p) => p.categoria === cat);
          if (produtosDaCategoria.length === 0) return null;
          return (
            <div key={idx}>
              <h2 style={{ color: "#4d4d4d", fontSize: 22, marginTop: 40 }}>{cat} | {produtosDaCategoria.length}</h2>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
                {produtosDaCategoria.map((p, pidx) => (
                  <div key={pidx} style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", color: "#4d4d4d" }}>
                    {renderImagens(p, pidx)}
                    <div style={{ padding: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#4d4d4d" }}>{p.nome}</h3>
                      <p style={{ fontSize: 14, color: "#4d4d4d" }}>Ref: {p.referencia}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#f57c00",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
