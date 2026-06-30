// Page d'accueil : Images + Titre
const API_URL = "http://localhost:5678/api"
let allWorks = [];

async function fetchWorks() {
    const response = await fetch(`${API_URL}/works`);
    const data = await response.json();
    return data;
}

const creerFigure = (imageUrl, title) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    figure.appendChild(img);
    figure.appendChild(figcaption);

    img.src = imageUrl;
    img.alt = title;
    figcaption.textContent = title;

    return figure;
}

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = creerFigure(work.imageUrl, work.title);
        gallery.appendChild(figure);
    })
}



// Page d'accueil : Filtres
async function fetchCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data;
}

const creerFiltres = (name) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("filters-button");
    return button;
}

function displayCategories(categories) {
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";

    const tous = creerFiltres("Tous");
    filters.appendChild(tous);
    tous.addEventListener("click", () => {
        displayWorks(allWorks);
    });

    categories.forEach(category => {
        const button = creerFiltres(category.name);
        filters.appendChild(button);
        button.addEventListener("click", () => {
        const filtered = allWorks.filter(work => work.categoryId === category.id);
        displayWorks(filtered);
        })
    }) 
    
}

async function init() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);
    const allCategories = await fetchCategories();
    displayCategories(allCategories);
}

init();
