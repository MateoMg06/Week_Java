// ==============================
// Constantes y referencias al DOM
// ==============================
const apiUrl = "https://jsonplaceholder.typicode.com/posts";
const storageKey = "week4Productos";

const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productCategoryInput = document.getElementById("productCategory");
const productDescriptionInput = document.getElementById("productDescription");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const syncButton = document.getElementById("syncButton");
const productList = document.getElementById("productList");
const messageBox = document.getElementById("messageBox");
const counter = document.getElementById("counter");
const storagePreview = document.getElementById("storagePreview");

console.log("Formulario:", productForm);
console.log("Lista:", productList);
console.log("Boton sincronizar:", syncButton);

// =========================================
// Estado global: arrays, set, map y objetos
// =========================================
let products = JSON.parse(localStorage.getItem(storageKey)) || [];
let editingProductId = null;
const categorySet = new Set();
const productMap = new Map();

// =======================
// Utilidades de la pagina
// =======================
function createProductId() {
    return Date.now().toString();
}

function showMessage(text, type = "success") {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    console.log(text);
}

function resetForm() {
    productForm.reset();
    productIdInput.value = "";
    editingProductId = null;
    saveButton.textContent = "Agregar producto";
    cancelButton.hidden = true;
    productNameInput.focus();
}

function validateProduct(product) {
    if (!product.name || !product.description || !product.category) {
        return "Completa nombre, categoria y descripcion.";
    }

    if (Number.isNaN(product.price) || product.price <= 0) {
        return "El precio debe ser mayor que cero.";
    }

    return "";
}

function readProductFromForm() {
    return {
        id: productIdInput.value || createProductId(),
        apiId: null,
        name: productNameInput.value.trim(),
        price: Number(productPriceInput.value),
        category: productCategoryInput.value.trim(),
        description: productDescriptionInput.value.trim()
    };
}

// ==================================
// Local Storage y estructuras de dato
// ==================================
function refreshCollections() {
    categorySet.clear();
    productMap.clear();

    products.forEach((product) => {
        categorySet.add(product.category);
        productMap.set(product.id, product);
    });
}

function saveProducts() {
    localStorage.setItem(storageKey, JSON.stringify(products));
    refreshCollections();
    updateStoragePreview();
    console.log("Local Storage actualizado:", products);
}

function updateStoragePreview() {
    storagePreview.textContent = localStorage.getItem(storageKey) || "[]";
}

function getSafeApiId(product) {
    return product.apiId && product.apiId <= 100 ? product.apiId : 1;
}

// ============================
// Render dinamico de productos
// ============================
function createProductItem(product) {
    const item = document.createElement("li");
    item.className = "product-item";
    item.dataset.id = product.id;

    const content = document.createElement("div");
    content.className = "product-content";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const meta = document.createElement("p");
    meta.textContent = `$${product.price.toFixed(2)} - ${product.category}`;

    const description = document.createElement("p");
    description.textContent = product.description;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "item-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "secondary";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => startEditProduct(product.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteProduct(product.id, item));

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(description);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    item.appendChild(content);
    item.appendChild(buttonGroup);

    return item;
}

function renderProducts() {
    productList.textContent = "";

    products.forEach((product) => {
        const item = createProductItem(product);
        productList.appendChild(item);
    });

    counter.textContent = `${products.length} productos`;
    updateStoragePreview();
}

// ===================
// CRUD con Fetch API
// ===================
async function getProductsFromApi() {
    try {
        showMessage("Consultando productos de la API...", "info");
        const response = await fetch(`${apiUrl}?_limit=5`);

        if (!response.ok) {
            throw new Error(`GET fallo con estado ${response.status}`);
        }

        const apiProducts = await response.json();
        products = apiProducts.map((post) => ({
            id: `api-${post.id}`,
            apiId: post.id,
            name: post.title.slice(0, 32),
            price: Number((post.id * 12.5).toFixed(2)),
            category: "API",
            description: post.body
        }));

        saveProducts();
        renderProducts();
        showMessage(`GET correcto: ${products.length} productos cargados.`, "success");
        console.log("Respuesta GET:", apiProducts);
    } catch (error) {
        showMessage(`Error en GET: ${error.message}`, "error");
        console.error("Error GET:", error);
    }
}

async function postProductToApi(product) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: product.name,
            body: product.description,
            userId: 1
        })
    });

    if (!response.ok) {
        throw new Error(`POST fallo con estado ${response.status}`);
    }

    return response.json();
}

async function putProductInApi(product) {
    const apiId = getSafeApiId(product);
    const response = await fetch(`${apiUrl}/${apiId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: apiId,
            title: product.name,
            body: product.description,
            userId: 1
        })
    });

    if (!response.ok) {
        throw new Error(`PUT fallo con estado ${response.status}`);
    }

    return response.json();
}

async function deleteProductFromApi(product) {
    const apiId = getSafeApiId(product);
    const response = await fetch(`${apiUrl}/${apiId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`DELETE fallo con estado ${response.status}`);
    }

    return true;
}

// =============================
// Eventos: agregar, editar, borrar
// =============================
async function addProduct(product) {
    try {
        const apiResponse = await postProductToApi(product);
        product.apiId = apiResponse.id;
        products.push(product);
        saveProducts();
        renderProducts();
        resetForm();
        showMessage("POST correcto: producto agregado.", "success");
        console.log("Respuesta POST:", apiResponse);
    } catch (error) {
        showMessage(`Error en POST: ${error.message}`, "error");
        console.error("Error POST:", error);
    }
}

async function updateProduct(product) {
    try {
        const savedProduct = productMap.get(product.id);
        product.apiId = savedProduct ? savedProduct.apiId : null;

        const apiResponse = await putProductInApi(product);
        products = products.map((currentProduct) => {
            return currentProduct.id === product.id ? product : currentProduct;
        });

        saveProducts();
        renderProducts();
        resetForm();
        showMessage("PUT correcto: producto actualizado.", "success");
        console.log("Respuesta PUT:", apiResponse);
    } catch (error) {
        showMessage(`Error en PUT: ${error.message}`, "error");
        console.error("Error PUT:", error);
    }
}

function startEditProduct(productId) {
    const product = productMap.get(productId);

    if (!product) {
        showMessage("No se encontro el producto para editar.", "error");
        return;
    }

    editingProductId = product.id;
    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    productCategoryInput.value = product.category;
    productDescriptionInput.value = product.description;
    saveButton.textContent = "Actualizar producto";
    cancelButton.hidden = false;
    productNameInput.focus();
    showMessage("Editando producto seleccionado.", "info");
}

async function deleteProduct(productId, item) {
    const product = productMap.get(productId);

    if (!product) {
        showMessage("No se encontro el producto para eliminar.", "error");
        return;
    }

    try {
        await deleteProductFromApi(product);
        productList.removeChild(item);
        products = products.filter((currentProduct) => currentProduct.id !== productId);
        saveProducts();
        renderProducts();
        showMessage("DELETE correcto: producto eliminado.", "success");
        console.log("Producto eliminado:", product);
    } catch (error) {
        showMessage(`Error en DELETE: ${error.message}`, "error");
        console.error("Error DELETE:", error);
    }
}

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const product = readProductFromForm();
    const validationMessage = validateProduct(product);

    if (validationMessage) {
        showMessage(validationMessage, "error");
        return;
    }

    if (editingProductId) {
        product.id = editingProductId;
        updateProduct(product);
        return;
    }

    addProduct(product);
});

cancelButton.addEventListener("click", resetForm);
syncButton.addEventListener("click", getProductsFromApi);

// ===========================
// Carga inicial de la pagina
// ===========================
refreshCollections();
renderProducts();
showMessage(`Carga inicial: ${products.length} productos desde Local Storage.`, "info");
console.log("Categorias registradas:", Array.from(categorySet));
console.log("Mapa de productos:", productMap);
