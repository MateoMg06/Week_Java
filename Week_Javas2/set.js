// este bloque devuelve una lista sin sabores repetidos

const funcionSets = () => {
  const SaborHelado = ["chocolate", "chocolate", "vainilla", "chicle"];
  const SaborSinRepetidos = new Set(SaborHelado);

  return SaborSinRepetidos;
};

// Aqui se añade un nuevo producto con el metodo set

const MetodoAñadir = () => {
  const sabores = funcionSets();

  sabores.add("limon");

  return sabores;
};

// Aqui se verifica que un sabor exista en la lista

const MetodoHas = () => {
  const sabores = funcionSets();

  return sabores.has("chocolate");
};

// Eliminar un elemeto de la lista

const MetodoDelete = () => {
  const sabores = funcionSets();
  sabores.delete("chocolate");
  return sabores;
};

// Recorrer el new set con for of

const RecorreSet = () => {
  const sabores = funcionSets();
  for (const Sabor of sabores) {
  }
  console.log(sabores);
};
export { MetodoAñadir, funcionSets, MetodoHas, MetodoDelete, RecorreSet };
