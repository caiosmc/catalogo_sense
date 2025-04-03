import React, { useEffect, useState } from "react";
import {
  obterCategoriasDaURL,
  atualizarURLComCategorias,
  obterTermoBuscaDaURL,
  atualizarURLComBusca,
} from "./utils/urlFiltros";
import { supabase } from "./supabase";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [modalProduto, setModalProduto] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [mostrarCategoriasMobile, setMostrarCategoriasMobile] = useState(false);

  useEffect(() => {
    const carregarProdutos = async () => {
      const { data, error } = await supabase
        .from("tabela_produtos_xbz")
        .select("*")
        .range(0, 9999)
        .order("categoria", { ascending: true })
        .order("subcategoria", { ascending: true })
        .order("nome", { ascending: true });

      if (error) {
        console.error("Erro ao buscar dados do Supabase:", error);
      } else {
        const produtosFiltrados = data.filter((p) => p.categoria !== null);
        setProdutos(produtosFiltrados);
      }
    };

    carregarProdutos();

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
    const matchNome = p.nome?.toLowerCase().includes(filtro.toLowerCase());
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
              <button onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)} style={buttonStyle}>
                {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
              </button>
              <button onClick={limparCategorias} style={{ ...buttonStyle, marginLeft: 10 }}>
                Limpar filtros
              </button>
              {mostrarCategoriasMobile && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: 10, fontSize: 14 }}>
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

          {agrupadosPorCategoria.map((cat, idx) => (
            <div key={idx}>
              <h2 style={{ marginTop: 40 }}>{cat}</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 20,
                }}
              >
                {produtosFiltrados
                  .filter((p) => p.categoria === cat)
                  .map((p, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                      onClick={() => abrirModal(p)}
                    >
                      <img
                        src={p.imagem_d1}
                        alt={p.nome}
                        style={{ width: "100%", height: 150, objectFit: "cover", marginBottom: 10 }}
                      />
                      <h4>{p.nome}</h4>
                      <p style={{ fontSize: 13, color: "#666" }}>Ref: {p.referencia}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {modalProduto && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={fecharModal} style={modalCloseStyle}>✖</button>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
              <div style={{ flex: 1, padding: 10 }}>
                <img
                  src={modalProduto[`imagem_d${imagemAtiva + 1}`]}
                  alt={modalProduto.nome}
                  style={{ width: "100%", height: 300, objectFit: "contain", marginBottom: 10 }}
                />
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  {[1, 2, 3, 4, 5].map((n, i) => {
                    const img = modalProduto[`imagem_d${n}`];
                    if (!img) return null;
                    return (
                      <img
                        key={i}
                        src={img}
                        alt={`mini-${n}`}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          border: i === imagemAtiva ? "2px solid #f57c00" : "1px solid #ccc",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                        onClick={() => setImagemAtiva(i)}
                      />
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1, padding: 10 }}>
                <h2>{modalProduto.nome}</h2>
                <p style={{ fontStyle: "italic", marginBottom: 8 }}>Ref: {modalProduto.referencia}</p>
                <p>{modalProduto.descricao}</p>
                {modalProduto.medidas && (
                  <>
                    <h4 style={{ marginTop: 20 }}>Medidas</h4>
                    <p>{modalProduto.medidas}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
