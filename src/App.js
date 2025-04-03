import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    console.log("🔄 Iniciando fetch de produtos");

    async function fetchProdutos() {
      const { data, error } = await supabase.from("tbl_produtos_xbz").select("*");

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        setErro("Erro ao buscar produtos");
      } else {
        console.log("✅ Produtos recebidos:", data);
        setProdutos(data);
      }
    }

    fetchProdutos();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Catálogo Supabase</h1>

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}
      {!erro && produtos.length === 0 && <p>🔄 Carregando produtos...</p>}
      {!erro && produtos.length > 0 && (
        <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 4 }}>
          {JSON.stringify(produtos, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
