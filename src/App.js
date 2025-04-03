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
  const [mostrarTopo, setMostrarTopo] = useState(false);

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

    const aoRolar = () => setMostrarTopo(window.scrollY > 200);
    window.addEventListener("scroll", aoRolar);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", aoRolar);
    };
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
        <img
          src="/logo-rg.png"
          alt="Logo"
          style={{ width: isMobile ? 70 : 135, marginRight: 10 }}
        />
        <h1 style={{ fontSize: isMobile ? 27 : 48 }}>
          <span style={{ color: "#4d4d4d" }}>Catálogo </span>
          <span style={{ color: "#f57c00" }}>Sense</span>
        </h1>
      </div>
      {/* ... restante do código permanece igual ... */}
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
