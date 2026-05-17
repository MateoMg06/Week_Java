import funcionProductos from "./productos.js";

const FuncioMap = () => {
  const productos = funcionProductos()
  const ClaveValor = new Map ()
  for (const producto of productos) {
    if (!ClaveValor.has(producto.categoria)) {
      ClaveValor.set(producto.categoria,[])
    }
    ClaveValor.get(producto.categoria).push(producto.nombre)
  }
  return ClaveValor
}

export default FuncioMap