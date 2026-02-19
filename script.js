<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Review Popcorn Ultimate</title>

<style>
/* ===== GENERAL ===== */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #121212;
  color: white;
}

header {
  background: #1f1f1f;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  color: #f5c518;
  margin: 0;
}

nav button {
  background: #f5c518;
  border: none;
  padding: 8px 12px;
  margin: 5px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.2s;
}

nav button:hover { opacity: 0.8; }

/* ===== HERO SECTION ===== */
#heroSection {
  background: url('https://via.placeholder.com/1200x400') center/cover no-repeat;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-overlay {
  background: rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-content h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.hero-content p {
  font-size: 1.1em;
  margin-bottom: 15px;
}

.hero-content button {
  background: #f5c518;
  border: none;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.2s;
}

.hero-content button:hover { opacity: 0.8; }

/* ===== SECTIONS ===== */
section { padding: 20px; }

.search-box {
  text-align: center;
  margin-bottom: 20px;
}

.search-box input {
  padding: 8px;
  width: 250px;
  border-radius: 5px;
  border: none;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.movie-card {
  background: #1e1e1e;
  width: 260px;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  transition: transform 0.2s;
}

.movie-card:hover { transform: scale(1.05); }

.movie-card img { width: 100%; border-radius: 8px; }

.movie-card input,
.movie-card select {
  width: 90%;
  padding: 6px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
}

.movie-card button {
  width: 95%;
  margin-top: 5px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background: #f5c518;
  font-weight: bold;
  transition: 0.2s;
}

.movie-card button:hover { opacity: 0.8; }

.review-box {
  background: #2a2a2a;
  padding: 8px;
  margin-top: 10px;
  border-radius: 6px;
  max-height: 150px;
  overflow-y: auto;
  text-align: left;
}

hr { border: 0.5px solid #444; }

/* ===== RESPONSIVE ===== */
@media screen and (max-width: 600px){
  .movie-card { width: 90%; }
  .search-box input { width: 80%; }
}
</style>
</head>
<body>

<header>
  <h2>🍿 Review Popcorn</h2>
  <nav>
    <button onclick="showHome()">Home</button>
    <button onclick="showSearch()">Search</button>
    <button onclick="showHistory()">History</button>
    <button onclick="showNews()">News</button>
  </nav>
</header>

<section id="heroSection">
  <div class="hero-overlay">
    <div class="hero-content">
      <h1>Find & Review Movies You Love 🎬</h1>
      <p>Discover trending films, rate them, and share your reviews with the world.</p>
      <button onclick="showSearch()">Browse Movies</button>
    </div>
  </div>
</section>

<section id="homeSection">
  <h1>Welcome to Review Popcorn 🎬</h1>
  <p>Discover • Review • Save • Rate</p>
</section>

<section id="searchSection" style="display:none;">
  <div class="search-box">
    <input id="searchInput" placeholder="Search movies...">
    <button onclick="search()">Search</button>
  </div>
  <div id="movies" class="grid"></div>
</section>

<section id="newsSection" style="display:none;">
  <h2>Latest Movie News 📰</h2>
  <p>Coming soon...</p>
</section>

<section id="historySection" style="display:none;">
  <h2>Your Viewed Movies 📜</h2>
  <p>Coming soon...</p>
</section>

<script>
const apiKey = "88e73149"; // OMDb API key

// ===============================
// ➖ SECTION NAVIGATION
// ===============================
function showHome(){ hideAll(); document.getElementById("homeSection").style.display="block"; }
function showSearch(){ hideAll(); document.getElementById("searchSection").style.display="block"; }
function showNews(){ hideAll(); document.getElementById("newsSection").style.display="block"; }
function showHistory(){ hideAll(); document.getElementById("historySection").style.display="block"; }

function hideAll(){
  ["homeSection","searchSection","newsSection","historySection"].forEach(id => {
    document.getElementById(id).style.display="none";
  });
}

// ===============================
// 🔍 SEARCH FUNCTION
// ===============================
async function search(){
  const query = document.getElementById("searchInput").value.trim();
  if(!query) return;

  const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
  const data = await res.json();

  if(data.Response === "True"){
    displayMovies(data.Search);
  } else {
    document.getElementById("movies").innerHTML = "No results found";
  }
}

// ===============================
// 🎬 DISPLAY MOVIES + REVIEW SYSTEM
// ===============================
function displayMovies(movies){
  const container = document.getElementById("movies");
  container.innerHTML="";

  movies.forEach(movie => {
    const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150";

    container.innerHTML += `
      <div class="movie-card">
        <img src="${poster}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>

        <p id="avg-${movie.imdbID}">⭐ Avg Rating: 0</p>

        <input type="text" id="review-${movie.imdbID}" placeholder="Write your review">
        
        <select id="rating-${movie.imdbID}">
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>

        <button onclick="addReview('${movie.imdbID}','${movie.Title}')">Submit Review</button>

        <div id="reviews-${movie.imdbID}" class="review-box"></div>
      </div>
    `;

    loadReviews(movie.imdbID);
  });
}

// ===============================
// ➕ ADD REVIEW
// ===============================
function addReview(id, title){
  const text = document.getElementById(`review-${id}`).value.trim();
  const rating = Number(document.getElementById(`rating-${id}`).value);

  if(!text){
    alert("Please write a review!");
    return;
  }

  const reviewData = { title, review: text, rating };
  let reviews = JSON.parse(localStorage.getItem(id)) || [];
  reviews.push(reviewData);
  localStorage.setItem(id, JSON.stringify(reviews));

  document.getElementById(`review-${id}`).value = "";
  loadReviews(id);
}

// ===============================
// 📊 LOAD REVIEWS + AVERAGE
// ===============================
function loadReviews(id){
  const reviewBox = document.getElementById(`reviews-${id}`);
  const reviews = JSON.parse(localStorage.getItem(id)) || [];

  reviewBox.innerHTML = "";
  let total = 0;

  reviews.forEach(r => {
    total += r.rating;
    reviewBox.innerHTML += `<p>${"⭐".repeat(r.rating)} - ${r.review}</p><hr>`;
  });

  const avg = reviews.length ? (total / reviews.length).toFixed(1) : 0;
  document.getElementById(`avg-${id}`).innerHTML = `⭐ Avg Rating: ${avg} (${reviews.length} reviews)`;
}
</script>

</body>
</html>
