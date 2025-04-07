// api/produtos.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("tbl_produtos_xbz")
    .select("*");

  if (error) {
    return res.status(500).json({ erro: "Erro ao buscar produtos" });
  }

  res.status(200).json(data);
}
