{isMobile && (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
      <button
        onClick={() => setMostrarCategoriasMobile(!mostrarCategoriasMobile)}
        style={buttonStyle}
      >
        {mostrarCategoriasMobile ? "Ocultar categorias" : "Mostrar categorias"}
      </button>
      {mostrarCategoriasMobile && (
        <button onClick={limparCategorias} style={buttonStyle}>
          Limpar filtros
        </button>
      )}
    </div>

    {mostrarCategoriasMobile && (
      <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
        <li>
          <label>
            <input
              type="checkbox"
              checked={categoriasSelecionadas.length === 0}
              onChange={() => toggleCategoria("__all__")}
              style={{ marginRight: 8 }}
            />
            Selecionar tudo ({produtosFiltrados.length})
          </label>
        </li>
        {categorias.map((cat) => (
          <li key={cat}>
            <label>
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(cat)}
                onChange={() => toggleCategoria(cat)}
                style={{ marginRight: 8 }}
              />
              {cat} ({produtosFiltrados.filter((p) => p.categoria === cat).length})
            </label>
          </li>
        ))}
      </ul>
    )}
  </div>
)}
export default App;
