import {
  MetodoAñadir,
  funcionSets,
  MetodoHas,
  MetodoDelete,
  RecorreSet,
} from "./set.js";
import funcionProductos from "./productos.js";
import FuncioMap from "./map.js";

//Objeto que almacena id (unico), nombre de producto, precio (valor numerico)

const EjecutarfuncionProductos = funcionProductos();

console.log(EjecutarfuncionProductos);

// funcion set que devuelve una nueva lista sin elementos repetidos

const EjecutarfuncionSet = funcionSets();
console.log(EjecutarfuncionSet);

// Metodo que añade elemento a una lista

const EjecutarMetodoAdd = MetodoAñadir();
console.log(EjecutarMetodoAdd);

// Metodo que verifica que un elemento exista en la lista

const EjecutarMetodoHas = MetodoHas();
console.log(EjecutarMetodoHas);

// Metodo para eliminar un elemento

const EjecutarMetodoDelete = MetodoDelete();
console.log(EjecutarMetodoDelete);

// recorrer el set con for of

RecorreSet();

// Funcion Map que devuelve la clave y valor de producto

const EjecutarfuncionMap = FuncioMap();
console.log(EjecutarfuncionMap);
