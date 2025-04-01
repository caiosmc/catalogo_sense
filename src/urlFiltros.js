export function getFiltersFromURL() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const filters = {};

  for (const [key, value] of params.entries()) {
    filters[key] = value;
  }

  return filters;
}

export function setFiltersToURL(filters) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newURL);
}
