import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(["Todos os produtos"]);
  const [isMobile, setIsMobile] = useState(false);
  const [mostrarCategoriasMobile, setMostrarCategoriasMobile] = useState(false);
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
      {/* aside e header mantidos como antes */}
      <main style={{ flex: 1, padding: 20, background: cores.cinzaClaro }}>
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
              fontSize: isMobile ? 24 : 34,
              fontWeight: 700,
              color: cores.cinza,
              margin: 0,
            }}
          >
            Catálogo Sense
          </h1>
          <img src="/logo-rg.png" alt="Logo RG" style={{ height: 70 }} />
        </div>

        {/* categorias mobile e input de busca mantidos */}

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

        {produtosFiltradosPorCategoria.map(({ categoria, produtos }) => (
          <div key={categoria} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: cores.cinza, marginBottom: 16 }}>
              {categoria}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {produtos.map((p, idx) => {
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
                          style={{ width: "100%", height: 150, objectFit: "cover" }}
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
                      <h3 style={{ fontSize: 16, fontWeight: "bold", color: cores.cinza }}>{p.nome}</h3>
                      <p style={{ fontSize: 14, color: "#555" }}>Ref: {p.referencia}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
