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
        </h1>
      </div>

      <div style={{ display: "flex" }}>
        {!isMobile && (
          <aside style={{ width: 220, padding: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Categorias</h3>
            <button onClick={limparCategorias} style={buttonStyle}>
              Limpar filtros
            </button>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 12 }}>
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
              <button onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)} style={buttonStyle}>
                {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
              </button>
              {mostrarCategoriasMobile && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: 10, fontSize: 12 }}>
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
                      <label style={{ fontSize: 12 }}>
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

          {/* resto do código continua aqui... */}
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

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: 20,
  maxWidth: 900,
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
  borderRadius: 10,
};

const modalCloseStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
};

export default App;
