import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(["Todos os produtos"]);
  const [isMobile, setIsMobile] = useState(false);
  const [mostrarCategoriasMobile, setMostrarCategoriasMobile] = useState(false);
  const [sliderIndex, setSliderIndex] = useState({});
  const [mostrarTopo, setMostrarTopo] = useState(false);

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data));

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarTopo(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const produtosFiltradosPorCategoria = categoriasSelecionadas.includes("Todos os produtos")
    ? categorias.map((cat) => ({
        categoria: cat,
        produtos: produtos.filter(
          (p) => p.nome.toLowerCase().includes(filtro.toLowerCase()) && p.categoria === cat
        ),
      }))
    : categoriasSelecionadas.map((cat) => ({
        categoria: cat,
        produtos: produtos.filter(
          (p) => p.nome.toLowerCase().includes(filtro.toLowerCase()) && p.categoria === cat
        ),
      }));

  const handleNext = (ref, total) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) + 1 >= total ? 0 : (prev[ref] || 0) + 1,
    }));
  };

  const handlePrev = (ref, total) => {
    setSliderIndex((prev) => ({
      ...prev,
      [ref]: (prev[ref] || 0) - 1 < 0 ? total - 1 : (prev[ref] || 0) - 1,
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
      {/* ... restante do código ... */}

      {mostrarTopo && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: cores.laranja,
            color: cores.branco,
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          ▲
        </button>
      )}
    </div>
  );
}

export default App;
