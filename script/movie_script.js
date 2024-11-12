const apiKey = '00b908ffd48ad5ba2a4220c28f0b3c4e';
const movieContainer = document.getElementById('movie-cards-container');
const watchLaterContainer = document.getElementById('watch-later-container');

function loadMovies() {
    const sortBy = document.getElementById('sort-select').value;
    const searchTerm = document.getElementById('search-input').value;

    let url;
    if (searchTerm) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&page=1`;
    } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}&page=1`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displaySearchResults(data.results);
            } else {
                document.querySelector('.search-results').innerHTML = '<p>Фильмы не найдены.</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            alert('Что-то пошло не так при загрузке фильмов.');
        });
}

function displaySearchResults(movies) {
    const searchResultsContainer = document.querySelector('.search-results');
    searchResultsContainer.innerHTML = ''; 

    movies.forEach(movie => {
        const movieCard = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p class="movie-description">${movie.overview}</p>
                    <button class="btn" onclick="addToWatchLater(${movie.id}, '${movie.title}', '${movie.poster_path}')">Watch Later</button>
                </div>
                <div class="extra-info">
                    <p><strong>Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>Popularity:</strong> ${movie.popularity}</p>
                </div>
            </div>
        `;
        searchResultsContainer.innerHTML += movieCard;
    });
}

loadMovies();


function displaySearchResults(movies) {
    const sortBy = document.getElementById('sort-select').value;

    movies.sort((a, b) => {
        if (sortBy === 'popularity.desc') {
            return b.popularity - a.popularity;
        } else if (sortBy === 'release_date.desc') {
            return new Date(b.release_date) - new Date(a.release_date);
        } else if (sortBy === 'vote_average.desc') {
            return b.vote_average - a.vote_average;
        }
        return 0;
    });

    const searchResultsContainer = document.querySelector('.search-results');
    searchResultsContainer.innerHTML = ''; 

    movies.forEach(movie => {
        const movieCard = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p class="movie-description">${movie.overview}</p>
                    <button class="btn" onclick="addToWatchLater(${movie.id}, '${movie.title}', '${movie.overview}', '${movie.poster_path}')">Watch Later</button>
                </div>
                <div class="extra-info">
                    <p><strong>Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>Popularity:</strong> ${movie.popularity}</p>
                </div>
            </div>
        `;
        searchResultsContainer.innerHTML += movieCard;
    });
}


function addToWatchLater(id, title, description, posterPath) {
    let watchLaterMovies = JSON.parse(localStorage.getItem('watchLater')) || [];

    const movieExists = watchLaterMovies.some(movie => movie.id === id);
    if (!movieExists) {
        const movie = { id, title, description, posterPath };
        watchLaterMovies.push(movie);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterMovies));

        alert(`${title} added to Watch Later!`);
        loadWatchLaterMovies(); 
    } else {
        alert(`${title} is already in Watch Later.`);
    }
}

function loadWatchLaterMovies() {
    const watchLaterMovies = JSON.parse(localStorage.getItem('watchLater')) || [];
    const watchLaterContainer = document.getElementById('watch-later-container');
    watchLaterContainer.innerHTML = ''; 

    watchLaterMovies.forEach(movie => {
        const movieCard = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w500/${movie.posterPath}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p class="movie-description">${movie.overview}</p>
                    <button class="btn btn-remove" onclick="removeFromWatchLater(${movie.id})">Remove</button>
                </div>
                <div class="extra-info">
                    <p><strong>Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>Popularity:</strong> ${movie.popularity}</p>
                </div>
            </div>
        `;
        watchLaterContainer.innerHTML += movieCard;
    });
}

function removeFromWatchLater(id) {
    let watchLaterMovies = JSON.parse(localStorage.getItem('watchLater')) || [];
    watchLaterMovies = watchLaterMovies.filter(movie => movie.id !== id);
    localStorage.setItem('watchLater', JSON.stringify(watchLaterMovies));

    loadWatchLaterMovies();
}

loadWatchLaterMovies(); 

