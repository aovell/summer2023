const apiKey = "010673d20468141444290cf8f7d499ae";
const apiUrl = "https://api.themoviedb.org/3";

function searchByTitle() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput === "") {
        alert("Please enter a title to search.");
        return;
    }

    const url = `${apiUrl}/search/movie?api_key=${apiKey}&query=${searchInput}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => displayResults(data.results))
        .catch((error) => console.log(error));
}

function discoverPopularMovies() {
    const url = `${apiUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => displayResults(data.results))
        .catch((error) => console.log(error));
}

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        resultsDiv.appendChild(movieCard);
    });
}
// ... existing code ...

function sortResultsAlphabetically() {
    const resultsDiv = document.getElementById("results");
    const movieCards = Array.from(resultsDiv.querySelectorAll(".movie-card"));

    movieCards.sort((a, b) => {
        const titleA = a.querySelector("h2").textContent.toLowerCase();
        const titleB = b.querySelector("h2").textContent.toLowerCase();
        return titleA.localeCompare(titleB);
    });

    movieCards.forEach((movieCard) => resultsDiv.appendChild(movieCard));
}

// ... existing code ...
// ... (existing code)

// Function to sort the search results by release date
function sortResultsByReleaseDate() {
    const resultsDiv = document.getElementById("results");
    const movies = Array.from(resultsDiv.children); // Convert results to an array

    movies.sort((a, b) => {
        const aReleaseDate = new Date(a.querySelector('p').textContent.split(': ')[1]);
        const bReleaseDate = new Date(b.querySelector('p').textContent.split(': ')[1]);
        return bReleaseDate - aReleaseDate;
    });

    resultsDiv.innerHTML = ""; // Clear the current results

    movies.forEach((movie) => {
        resultsDiv.appendChild(movie); // Add the sorted movies back to the resultsDiv
    });
}

// ... (existing code)


function createMovieCard(movie) {
    
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const image = document.createElement("img");
    image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    image.alt = movie.title;
    movieCard.appendChild(image);

    
    const title = document.createElement("h2");
    title.textContent = movie.title;
    movieCard.appendChild(title);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    movieCard.appendChild(releaseDate);

    movieCard.onclick = function () {
        displayMovieDetails(movie.id);
    };
const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.textContent = "Add to Favorites";
    addToFavoritesButton.onclick = function () {
        addToFavorites(movie);
    };
    movieCard.appendChild(addToFavoritesButton);

    return movieCard;
}

function displayMovieDetails(movieId) {
    const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => showDetails(data))
        .catch((error) => console.log(error));
}

function showDetails(movie) {
    const detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = movie.title;
    detailsDiv.appendChild(title);

    const overview = document.createElement("p");
    overview.textContent = movie.overview;
    detailsDiv.appendChild(overview);

    const castTitle = document.createElement("h3");
    castTitle.textContent = "Cast:";
    detailsDiv.appendChild(castTitle);

    const castDetails = document.createElement("div");
    castDetails.id = "cast-details";

    movie.credits.cast.slice(0, 5).forEach((cast) => {
        const castCard = createCastCard(cast);
        castDetails.appendChild(castCard);
    });

    detailsDiv.appendChild(castDetails);

    detailsDiv.style.display = "block";
}

function createCastCard(cast) {
    const castCard = document.createElement("div");

    const profileImage = document.createElement("img");
    profileImage.src = `https://image.tmdb.org/t/p/w185/${cast.profile_path}`;
    profileImage.alt = cast.name;
    castCard.appendChild(profileImage);

    const name = document.createElement("h4");
    name.textContent = cast.name;
    castCard.appendChild(name);

    const character = document.createElement("p");
    character.textContent = `Character: ${cast.character}`;
    castCard.appendChild(character);

    return castCard;
}

// ... (existing code)

// Add the following code at the end of script.js

function addToFavorites(movie) {
  const favorites = getFavorites();
  favorites.push(movie);
  saveFavorites(favorites);
}

function removeFromFavorites(movieId) {
  let favorites = getFavorites();
  favorites = favorites.filter((movie) => movie.id !== movieId);
  saveFavorites(favorites);
}

function getFavorites() {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function saveFavorites(favorites) {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem("favorites", favoritesJSON);
}

function displayFavorites() {
  const favorites = getFavorites();
  const favoritesDiv = document.getElementById("favorites");
  favoritesDiv.innerHTML = "";

  const favoritesWrapper = document.createElement("div");
  favoritesWrapper.className = "favorites-wrapper";

  favorites.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove from Favorites";
    removeButton.onclick = function () {
      removeFromFavorites(movie.id);
      displayFavorites();
    };

    movieCard.appendChild(removeButton);
    favoritesWrapper.appendChild(movieCard);
  });

  favoritesDiv.appendChild(favoritesWrapper);
}
