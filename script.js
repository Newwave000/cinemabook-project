const apiKey = "88e73149";

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
  console.log(data); // debugging

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
        <img src="${poster}" width="150">
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

        <button onclick="addReview('${movie.imdbID}','${movie.Title}')">
          Submit Review
        </button>

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
