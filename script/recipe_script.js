const apiKey = "338d5d63ef2246248b9c1ed588417aca"; 

const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.getElementById("search-results-container");
const recipeModal = document.getElementById("recipe-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalIngredients = document.getElementById("modal-ingredients");
const modalTime = document.getElementById("modal-time");
const favouritesContainer = document.getElementById("favourites-container");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length > 1) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?query=${query}&number=5&apiKey=${apiKey}`);
            const suggestions = await response.json();
            showSuggestions(suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }
});

function showSuggestions(suggestions) {
    const suggestionBox = document.createElement("div");
    suggestionBox.classList.add("suggestion-box");
    suggestionBox.innerHTML = suggestions
        .map(suggestion => `<p onclick="selectSuggestion('${suggestion.title}')">${suggestion.title}</p>`)
        .join("");
    searchInput.parentNode.appendChild(suggestionBox);

    document.addEventListener("click", () => suggestionBox.remove(), { once: true });
}

function selectSuggestion(title) {
    searchInput.value = title;
    searchRecipes();
}

async function searchRecipes() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${apiKey}`);
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

function displaySearchResults(recipes) {
    searchResultsContainer.innerHTML = recipes
        .map(recipe => `
            <div class="recipe-item" onclick="openModal(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>Время приготовления: ${recipe.readyInMinutes ? recipe.readyInMinutes + " мин" : "Недоступно"}</p>
            </div>
        `)
        .join("");
}

async function openModal(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipe = await response.json();

        modalTitle.textContent = recipe.title;
        modalDescription.textContent = recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : "Описание недоступно";
        modalIngredients.textContent = recipe.extendedIngredients
            .map(ing => `${ing.original}`)
            .join(", ");
        modalTime.textContent = `Время приготовления: ${recipe.readyInMinutes || "Недоступно"}`;

        recipeModal.style.display = "block"; 
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

function closeModal() {
    recipeModal.style.display = "none";
}

function addToFavorites() {
    const favoriteRecipe = {
        title: modalTitle.textContent,
        description: modalDescription.textContent,
        image: document.querySelector(".modal img") ? document.querySelector(".modal img").src : "",
    };

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(favoriteRecipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favouritesContainer.innerHTML = favorites
        .map((fav, index) => `
            <div class="recipe-item">
                <img src="${fav.image}" alt="${fav.title}">
                <h3>${fav.title}</h3>
                <p>${fav.description.slice(0, 50)}...</p>
                <button onclick="removeFavorite(${index})">Удалить из избранного</button>
            </div>
        `)
        .join("");
}

function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

window.onload = displayFavorites;
