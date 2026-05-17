import funcionSets from "./set.js";
import funcionProductos from "./productos.js";
import FuncioMap from "./map.js";

//Objeto que almacena id (unico), nombre de producto, precio (valor numerico)

const EjecutarfuncionProductos = funcionProductos()

console.log(EjecutarfuncionProductos);

// funcion set que devuelve una nueva lista sin elementos repetidos

const EjecutarfuncionSet = funcionSets()
console.log(EjecutarfuncionSet);

// Funcion Map que devuelve la clave y valor de producto

const EjecutarfuncionMap = FuncioMap()
console.log(EjecutarfuncionMap);

