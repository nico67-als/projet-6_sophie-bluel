const API_URL = "http://localhost:5678/api"

document.querySelector(".login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    error.classList.add("hidden");

    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    });   

    if(response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "./index.html";
    } else {
        error.classList.remove("hidden");
    }
})