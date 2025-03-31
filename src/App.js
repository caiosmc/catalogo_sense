
import { useEffect, useState } from "react";

export default function CatalogoComMenu() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos os produtos");

  useEffect(() => {
    fetch("/produtos.json")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const categorias = [
    "Todos os produtos",
    ...Array.from(new Set(produtos.map((p) => p.categoria)))
  ];

  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const categoriaMatch = categoriaSelecionada === "Todos os produtos" || p.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Menu lateral */}
      <aside className="md:w-64 w-full md:h-screen p-4 border-r border-gray-200 sticky top-0">
        <h2 className="text-xl font-semibold mb-4">Categorias</h2>
        <ul className="space-y-2">
          {categorias.map((cat, idx) => (
            <li key={idx}>
              <button
                onClick={() => setCategoriaSelecionada(cat)}
                className={\`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition \${categoriaSelecionada === cat ? "bg-gray-200 font-bold" : ""}\`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Catálogo Sense</h1>

        <input
          placeholder="Buscar por nome do produto..."
          className="w-full max-w-md mb-6 p-2 border rounded-md"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((p, idx) => (
            <div key={idx} className="border rounded-xl shadow-sm overflow-hidden">
              <img
                src={p.imagem_d1}
                alt={p.nome}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base">{p.nome}</h3>
                <p className="text-sm text-gray-500">Ref: {p.referencia}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
