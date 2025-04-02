import React, { useEffect, useState } from "react";
import {
  obterCategoriasDaURL,
  atualizarURLComCategorias,
  obterTermoBuscaDaURL,
  atualizarURLComBusca,
} from "./utils/urlFiltros";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [modalProduto, setModalProduto] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [mostrarCategoriasMobile, setMostrarCategoriasMobile] = useState(false);
  const [mostrarTopo, setMostrarTopo] = useState(false);

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao carregar produtos:", err));

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const aoRolar = () => setMostrarTopo(window.scrollY > 200);
    window.addEventListener("scroll", aoRolar);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const categoriasDaURL = obterCategoriasDaURL();
    const buscaDaURL = obterTermoBuscaDaURL();
    setCategoriasSelecionadas(categoriasDaURL);
    setFiltro(buscaDaURL);
  }, []);

  useEffect(() => {
    atualizarURLComCategorias(categoriasSelecionadas);
  }, [categoriasSelecionadas]);

  useEffect(() => {
    atualizarURLComBusca(filtro);
  }, [filtro]);

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  const toggleCategoria = (cat) => {
    if (cat === "__all__") {
      setCategoriasSelecionadas([]);
    } else {
      setCategoriasSelecionadas((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
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

  const agrupadosPorCategoria = categorias.filter((cat) =>
    produtosFiltrados.some((p) => p.categoria === cat)
  );

  const abrirModal = (produto) => {
    setModalProduto(produto);
    setImagemAtiva(0);
  };

  const fecharModal = () => {
    setModalProduto(null);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <div style={{ display: "flex", alignItems: "center", padding: 20 }}>
        <img src="/logo-rg.png" alt="Logo" style={{ width: 50, marginRight: 10 }} />
        <h1 style={{ fontSize: 30 }}>
          <span style={{ color: "#4d4d4d" }}>Catálogo </span>
          <span style={{ color: "#f57c00" }}>Sense</span>
          <span style={{ color: "#888", fontSize: 18, marginLeft: 10 }}>(HML)</span>
        </h1>
      </div>

      <div style={{ display: "flex" }}>
        {!isMobile && (
          <aside style={{ width: 220, padding: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Categorias</h3>
            <button onClick={limparCategorias} style={buttonStyle}>
              Limpar filtros
            </button>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 14 }}>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={categoriasSelecionadas.length === 0}
                    onChange={() => toggleCategoria("__all__")}
                    style={{ marginRight: 8 }}
                  />
                  Selecionar tudo ({produtosFiltrados.length})
                </label>
              </li>
              {categorias.map((cat) => (
                <li key={cat}>
                  <label>
                    <input
                      type="checkbox"
                      checked={categoriasSelecionadas.includes(cat)}
                      onChange={() => toggleCategoria(cat)}
                      style={{ marginRight: 8 }}
                    />
                    {cat} ({produtosFiltrados.filter((p) => p.categoria === cat).length})
                  </label>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <main style={{ flex: 1, padding: 20 }}>
          {isMobile && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)} style={buttonStyle}>
                  {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
                </button>
                <button onClick={limparCategorias} style={buttonStyle}>
                  Limpar filtros
                </button>
              </div>
              {mostrarCategoriasMobile && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={categoriasSelecionadas.length === 0}
                        onChange={() => toggleCategoria("__all__")}
                        style={{ marginRight: 8 }}
                      />
                      Selecionar tudo ({produtosFiltrados.length})
                    </label>
                  </li>
                  {categorias.map((cat) => (
                    <li key={cat}>
                      <label>
                        <input
                          type="checkbox"
                          checked={categoriasSelecionadas.includes(cat)}
                          onChange={() => toggleCategoria(cat)}
                          style={{ marginRight: 8 }}
                        />
                        {cat} ({produtosFiltrados.filter((p) => p.categoria === cat).length})
                      </label>
                    </li>
                  ))}
                </ul>
              )}
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
            }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          {/* restante do código permanece inalterado */}
        </main>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#f57c00",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  marginBottom: 12,
  cursor: "pointer",
};

export default App;
