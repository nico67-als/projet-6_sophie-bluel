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

// Page d'accueil -> Après authentification sur page login
const handleAuth = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
        const login = document.getElementById("login");
        login.textContent = "logout";
        login.addEventListener("click", (e) => {
            e.preventDefault(); // Pour ne pas être renvoyé sur la page login, mise en redirection sur le a   
            localStorage.removeItem("token");
            window.location.reload();
        })

        const edition = document.querySelector(".edition");
        edition.classList.remove("hidden");

        const filters = document.querySelector(".filters");
        filters.classList.add("hidden");

        const modifier = document.querySelector(".modifier");
        modifier.classList.remove("hidden");

    } else {

    }
}

// Page d'accueil : Fenêtre modale
// Ouvrir la modale
const openmodal = () => {
    const modal = document.querySelector(".modal");
    const modifier = document.querySelector(".modifier");

    modifier.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("hidden");
        displayModalWorks(allWorks);
    })
}

// Fermer la modale
const closemodal = () => {
    const modal = document.querySelector(".modal");
    const modalclose = document.querySelectorAll(".modal-close");

    modalclose.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("hidden");
        })
    })

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    })
}

// Basculer entre les deux vues
const showGalleryView = () => {
    const gallery = document.querySelector(".modal-gallery-view");
    const form = document.querySelector(".modal-form-view");
    const back = document.querySelector(".modal-back-btn");

    const goToGallery = (e) => {
        e.preventDefault();
        gallery.classList.remove("hidden"),
            form.classList.add("hidden");
    }

    back.addEventListener("click", goToGallery);

    document.addEventListener("keydown", (e) => {
        const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
        if (e.key === "Backspace" && !isTyping) {
            goToGallery(e);
        }
    })

}

const showFormView = () => {
    const gallery = document.querySelector(".modal-gallery-view");
    const form = document.querySelector(".modal-form-view");
    const addpicture = document.querySelector(".add-photo-btn");

    addpicture.addEventListener("click", (e) => {
        e.preventDefault();
        gallery.classList.add("hidden");
        form.classList.remove("hidden");
    })
}

// Modale : galerie + suppression travaux
const creerFigureModale = (imageUrl, title, id) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const buttonSuppr = document.createElement("button");

    figure.appendChild(img);
    figure.appendChild(buttonSuppr);

    img.src = imageUrl;
    img.alt = title;
    buttonSuppr.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    buttonSuppr.classList.add("modal-button-suppr");

    buttonSuppr.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
            figure.remove();
            allWorks = allWorks.filter(work => work.id !== id);
            displayWorks(allWorks);
        }
    })
    return figure;
}


const displayModalWorks = (works) => {
    const worksgrid = document.querySelector(".modal-works-grid");
    worksgrid.innerHTML = "";
    works.forEach(work => {
        const figure = creerFigureModale(work.imageUrl, work.title, work.id);
        worksgrid.appendChild(figure);
    })
}


async function init() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);
    const allCategories = await fetchCategories();
    displayCategories(allCategories);
    handleAuth();
    openmodal();
    closemodal();
    showFormView();
    showGalleryView();    
}

init();
