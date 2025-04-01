export function obterTermoBuscaDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("busca") || "";
}

export function atualizarTermoBuscaNaURL(termo) {
  const params = new URLSearchParams(window.location.search);
  if (termo) {
    params.set("busca", termo);
  } else {
    params.delete("busca");
  }
  const novaUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", novaUrl);
}
