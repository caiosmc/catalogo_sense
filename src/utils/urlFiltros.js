export function obterCategoriasDaURL() {
  const params = new URLSearchParams(window.location.search);
  const categorias = params.get("categorias");
  return categorias ? categorias.split(",") : [];
}

export function obterBuscaDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("busca") || "";
}

export function atualizarParametrosURL(categorias, busca) {
  const params = new URLSearchParams();

  if (categorias.length > 0) {
    params.set("categorias", categorias.join(","));
  }

  if (busca) {
    params.set("busca", busca);
  }

  const novaURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", novaURL);
}
