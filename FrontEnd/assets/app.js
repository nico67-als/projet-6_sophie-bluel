const API_URL = "http://localhost:5678/api"
let allWorks = [];

// Page d'accueil : Galerie dynamique
async function fetchWorks() {
    const response = await fetch(`${API_URL}/works`);
    return response.json();
}

function creerFigure(imageUrl, title) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = title;

    const figure = document.createElement("figure");
    figure.appendChild(img);
    figure.appendChild(figcaption);

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
    return response.json();
}

function creerFiltres(name) {
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
function handleAuth() {
    const token = localStorage.getItem("token");
    if (token !== null) {
        const login = document.getElementById("login");
        login.textContent = "logout";
        login.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        })

        const edition = document.querySelector(".edition");
        edition.classList.remove("hidden");

        const filters = document.querySelector(".filters");
        filters.classList.add("hidden");

        const modifier = document.querySelector(".modifier");
        modifier.classList.remove("hidden");

    }
}

// Page d'accueil : Fenêtre modale
// Ouvrir la modale
function openmodal() {
    const modal = document.querySelector(".modal");
    const modifier = document.querySelector(".modifier");

    modifier.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("hidden");
        displayModalWorks(allWorks);
    })
}

// Fermer la modale
function closemodal() {
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
function showGalleryView() {
    document.querySelector(".modal-gallery-view").classList.remove("hidden");
    document.querySelector(".modal-form-view").classList.add("hidden");
}

document.querySelector(".modal-back-btn").addEventListener("click", showGalleryView);
document.addEventListener("keydown", (e) => {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if (e.key === "Backspace" && !isTyping) {
        showGalleryView();
    }
})

function showFormView() {
    document.querySelector(".modal-gallery-view").classList.add("hidden");
    document.querySelector(".modal-form-view").classList.remove("hidden");
}

const addpicture = document.querySelector(".add-photo-btn");
addpicture.addEventListener("click", showFormView);

// Modale : galerie + suppression travaux
function creerFigureModale(imageUrl, title, id) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;

    const buttonSuppr = document.createElement("button");
    buttonSuppr.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    buttonSuppr.classList.add("modal-button-suppr");


    const figure = document.createElement("figure");
    figure.appendChild(img);
    figure.appendChild(buttonSuppr);

    buttonSuppr.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
            allWorks = allWorks.filter(work => work.id !== id);
            displayWorks(allWorks);
            displayModalWorks(allWorks);
        } else {
            console.log("erreur")
        }
    })

    return figure;
}

function displayModalWorks(works) {
    const worksgrid = document.querySelector(".modal-works-grid");
    worksgrid.innerHTML = "";
    works.forEach(work => {
        const figure = creerFigureModale(work.imageUrl, work.title, work.id);
        worksgrid.appendChild(figure);
    })
}

// Modale : Formulaire
function categorySelect(categories) {
    const select = document.getElementById("work-category");
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    })
}

function photoPreview() {
    const input = document.getElementById("photo-input");
    input.addEventListener("change", () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector(".photo-preview").classList.remove("hidden");
            document.querySelector(".upload-placeholder").classList.add("hidden");
            document.querySelector(".photo-preview").src = e.target.result;
        }

        const fichier = input.files[0];
        reader.readAsDataURL(fichier);
    });
}

function formValidation() {
    document.getElementById("work-title").addEventListener("input", checkFormValidity);
    document.getElementById("work-category").addEventListener("change", checkFormValidity);
    document.getElementById("photo-input").addEventListener("change", checkFormValidity);
}

function checkFormValidity() {
    const image = document.getElementById("photo-input").files[0];
    const titre = document.getElementById("work-title").value;
    const category = document.getElementById("work-category").value;

    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = !(image && titre && category);
}

function setupAddWorkForm(categories) {
    categorySelect(categories);
    photoPreview();
    formValidation();
}

async function sendFormData(e) {
    e.preventDefault();
    const formData = new FormData();
    const titre = document.getElementById("work-title").value;
    formData.append("title", titre);
    const image = document.getElementById("photo-input").files[0];
    formData.append("image", image);
    const category = document.getElementById("work-category").value;
    formData.append("category", category);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    })

    if (response.ok) {
        const newWork = await response.json();
        allWorks.push(newWork);
        displayWorks(allWorks);
        displayModalWorks(allWorks);
        document.querySelector(".modal").classList.add("hidden");
    }

    showGalleryView();
}

document.querySelector(".add-work-form").addEventListener("submit", sendFormData);

async function init() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);
    const allCategories = await fetchCategories();
    displayCategories(allCategories);
    handleAuth();
    openmodal();
    closemodal();
    showGalleryView();
    setupAddWorkForm(allCategories);
}

init();
