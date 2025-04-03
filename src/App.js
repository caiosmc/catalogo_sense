""import React, { useEffect, useState } from "react";
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
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);

  useEffect(() => {
    async function fetchProdutosPaginado() {
      console.log("Iniciando fetch de produtos...");
      let todosProdutos = [];
      let pagina = 0;
      const tamanhoPagina = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("tbl_produtos_xbz")
          .select("*")
          .order("categoria", { ascending: true })
          .order("subcategoria", { ascending: true })
          .order("nome", { ascending: true })
          .range(pagina * tamanhoPagina, (pagina + 1) * tamanhoPagina - 1);

        if (error) {
          console.error("Erro ao buscar dados do Supabase:", error);
          break;
        }

        if (!data || data.length === 0) break;

        todosProdutos = todosProdutos.concat(data);
        if (data.length < tamanhoPagina) break;
        pagina++;
      }

      console.log("Produtos recebidos:", todosProdutos.length);
      setProdutos(todosProdutos);
    }

    fetchProdutosPaginado();

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

  useEffect(() => {
    const handleScroll = () => {
      setMostrarVoltarTopo(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const obterImagemValida = (produto) => {
    return (
      produto.imagem ||
      produto.imagem_d1 ||
      produto.imagem_d2 ||
      produto.imagem_d3 ||
      produto.imagem_d4 ||
      produto.imagem_d5 ||
      produto.imagem_d6 ||
      produto.imagem_d7 ||
      "https://via.placeholder.com/300x300.png?text=Sem+Imagem"
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <div style={{ display: "flex", alignItems: "center", padding: 20 }}>
        <img
          src="/logo-rg.png"
          alt="Logo"
          style={{
            width: isMobile ? 80 : 105,
            marginRight: 10,
            transition: "all 0.3s ease",
          }}
        />
        <h1
          style={{
            fontSize: isMobile ? 24 : 48,
            transition: "all 0.3s ease",
          }}
        >
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
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)}
                  style={buttonStyle}
                >
                  {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
                </button>
                <button onClick={limparCategorias} style={buttonStyle}>
                  Limpar filtros
                </button>
              </div>
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
              width: isMobile ? "90%" : "100%",
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
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(180px, 1fr))",
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
                        src={obterImagemValida(p)}
                        alt={p.nome}
                        style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: 10 }}
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

      {mostrarVoltarTopo && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#f57c00",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          ↑
        </button>
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

export default App;
