// src/utils/urlFiltros.js

export function obterCategoriasDaURL() {
  const params = new URLSearchParams(window.location.search);
  const categorias = params.get("categorias");
  return categorias ? categorias.split(",") : [];
}

export function atualizarURLComCategorias(categorias) {
  const params = new URLSearchParams(window.location.search);
  if (categorias.length > 0) {
    params.set("categorias", categorias.join(","));
  } else {
    params.delete("categorias");
  }
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

export function obterBuscaDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("busca") || "";
}

export function atualizarURLComBusca(busca) {
  const params = new URLSearchParams(window.location.search);
  if (busca) {
    params.set("busca", busca);
  } else {
    params.delete("busca");
  }
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}
