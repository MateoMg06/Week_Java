const inputNota = document.getElementById("inputNota");
const btnAgregar = document.getElementById("btnAgregar");
const listaNotas = document.getElementById("listaNotas");

console.log("Input seleccionado:", inputNota);
console.log("Boton seleccionado:", btnAgregar);
console.log("Lista seleccionada:", listaNotas);

let notas = JSON.parse(localStorage.getItem("notas")) || [];

function guardarNotas() {
    localStorage.setItem("notas", JSON.stringify(notas));
    console.log("Notas guardadas en Local Storage:", notas);
}

function crearElementoNota(textoNota, indice) {
    const li = document.createElement("li");
    li.textContent = textoNota + " ";

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", () => {
        listaNotas.removeChild(li);
        notas.splice(indice, 1);
        guardarNotas();
        console.log("Se elimino la nota:", textoNota);
        renderizarNotas();
    });

    li.appendChild(btnEliminar);
    return li;
}

function renderizarNotas() {
    listaNotas.textContent = "";

    notas.forEach((nota, indice) => {
        const li = crearElementoNota(nota, indice);
        listaNotas.appendChild(li);
    });
}

btnAgregar.addEventListener("click", () => {
    const textoNota = inputNota.value.trim();

    if (textoNota === "") {
        alert("Por favor, escribe una nota antes de agregarla.");
        inputNota.focus();
        return;
    }

    notas.push(textoNota);
    const li = crearElementoNota(textoNota, notas.length - 1);
    listaNotas.appendChild(li);
    guardarNotas();
    console.log("Se agrego la nota:", textoNota);

    inputNota.value = "";
    inputNota.focus();
});

renderizarNotas();
console.log(`Se cargaron ${notas.length} notas desde Local Storage.`);
