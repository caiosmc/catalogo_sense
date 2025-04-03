import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarProdutos = async () => {
      console.log("Fazendo requisição para o Supabase...");
      const { data, error } = await supabase
        .from("tbl_produtos_xbz")
        .select("*");

      if (error) {
        console.error("Erro ao buscar dados:", error);
        setErro(error.message);
      } else {
        console.log("Dados recebidos:", data);
        setProdutos(data);
      }
    };

    carregarProdutos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Teste de Conexão com Supabase</h1>
      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}
      <pre>{JSON.stringify(produtos, null, 2)}</pre>
    </div>
  );
}

export default App;
