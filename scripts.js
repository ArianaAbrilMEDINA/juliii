document.addEventListener("DOMContentLoaded", function () {

  // --- 1. Expandibles por año ---
  const secciones = [
    { id: "primerContainer", titulo: "PRIMER AÑO" },
    { id: "segundoContainer", titulo: "SEGUNDO AÑO" },
    { id: "tercerContainer", titulo: "TERCER AÑO" },
    { id: "cuartoContainer", titulo: "CUARTO AÑO" },
    { id: "electivasContainer", titulo: "MATERIAS ELECTIVAS" }
  ];

  secciones.forEach(sec => {
    const contenedor = document.getElementById(sec.id);
    if (!contenedor) return;

    // Buscar el elemento .career-tag-1 que contiene ese título
    const todosTitulos = document.querySelectorAll(".career-tag-1");
    todosTitulos.forEach(titulo => {
      if (titulo.textContent.trim().toUpperCase().includes(sec.titulo)) {
        titulo.style.cursor = "pointer";
        titulo.addEventListener("click", () => {
          const visible = window.getComputedStyle(contenedor).display !== "none";
          contenedor.style.display = visible ? "none" : "block";
        });
      }
    });
  });

  // --- 2. Funcionalidad de materias ---
  const allButtons = document.querySelectorAll(".btn-materia");

  function actualizarDesbloqueos() {
    allButtons.forEach(button => {
      const dependsOn = button.dataset.dependsOn;
      if (dependsOn) {
        const deps = dependsOn.split(",").map(dep => dep.trim());
        const allApproved = deps.every(depId => localStorage.getItem(depId) === "tachado");
        button.disabled = !allApproved;
        button.classList.toggle("disabled", !allApproved);
        button.style.opacity = allApproved ? "1" : "0.5";
      }
    });
  }

  // --- 3. Progreso general ---
  function actualizarProgreso() {
    const total = allButtons.length;
    const completadas = Array.from(allButtons).filter(btn => btn.classList.contains("tachado")).length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    const barra = document.getElementById("progresoInterno");
    barra.style.width = `${porcentaje}%`;
    barra.textContent = `${porcentaje}%`;
  }

  // --- 4. Estado inicial (localStorage) ---
  allButtons.forEach(button => {
    const id = button.dataset.id;
    if (!id) return;

    if (localStorage.getItem(id) === "tachado") {
      button.classList.add("tachado");
    }

    button.addEventListener("click", function () {
      if (button.disabled) return;

      button.classList.toggle("tachado");
      const isTachado = button.classList.contains("tachado");

      if (isTachado) {
        localStorage.setItem(id, "tachado");
      } else {
        localStorage.removeItem(id);
      }

      actualizarDesbloqueos();
      actualizarProgreso();
    });
  });

  actualizarDesbloqueos();
  actualizarProgreso();
});
