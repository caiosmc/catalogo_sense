export function atualizarCategoriasNaURL(categorias) {
  const params = new URLSearchParams(window.location.search);
  if (categorias.length > 0) {
    params.set("categorias", categorias.join(","));
  } else {
    params.delete("categorias");
  }
  const novaUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", novaUrl);
}

export function obterCategoriasDaURL() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("categorias");
  return raw ? raw.split(",") : [];
}
