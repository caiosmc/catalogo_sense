// src/utils/urlFiltros.js

export const obterCategoriasDaURL = () => {
  const params = new URLSearchParams(window.location.search);
  const categorias = params.get("categorias");
  return categorias ? categorias.split(",") : [];
};

export const atualizarURLComCategorias = (categorias) => {
  const params = new URLSearchParams(window.location.search);
  if (categorias.length > 0) {
    params.set("categorias", categorias.join(","));
  } else {
    params.delete("categorias");
  }
  const novaURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", novaURL);
};

export const obterTermoBuscaDaURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("busca") || "";
};

export const atualizarURLComBusca = (busca) => {
  const params = new URLSearchParams(window.location.search);
  if (busca) {
    params.set("busca", busca);
  } else {
    params.delete("busca");
  }
  const novaURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", novaURL);
};
