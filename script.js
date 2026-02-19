const apiKey = "88e73149";

function showHome(){
  hideAll();
  document.getElementById("homeSection").style.display="block";
}
function showSearch(){
  hideAll();
  document.getElementById("searchSection").style.display="block";
}
function showNews(){
  hideAll();
  document.getElementById("newsSection").style.display="block";
}
function showHistory(){
  hideAll();
  document.getElementById("historySection").style.display="block";
}

function hideAll(){
  document.getElementById("homeSection").style.display="none";
  document.getElementById("searchSection").style.display="none";
  document.getElementById("newsSection").style.display="none";
  document.getElementById("historySection").style.display="none";
}

/* SEARCH FUNCTION */
async function search(){
  const query = document.getElementById("searchInput").value;
  if(!query) return;

  const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
  const data = await res.json();

  if(data.Response === "True"){
    display(data.Search);
  } else {
    document.getElementById("movies").innerHTML = "No results found";
  }
}

/* DISPLAY MOVIES */
function display(list){
  const container = document.getElementById("movies");
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.Poster !== "N/A" ? item.Poster : ""}" width="200">
      <div style="padding:10px;">
        <strong>${item.Title}</strong><br>
        ${item.Year}
        <div class="stars" data-id="${item.imdbID}">
          ⭐ ⭐ ⭐ ⭐ ⭐
        </div>
        <textarea placeholder="Write your review..." id="review-${item.imdbID}"></textarea>
        <button onclick="saveReview('${item.imdbID}', '${item.Title}')">
          Submit Review
        </button>
        <div id="comments-${item.imdbID}"></div>
      </div>
    `;

    container.appendChild(card);

    loadReviews(item.imdbID);
    enableStars(item.imdbID);
  });
}

/* STAR RATING */
function enableStars(id){
  const starContainer = document.querySelector(`[data-id='${id}']`);
  const stars = starContainer.textContent.split(" ");
  starContainer.innerHTML = "";

  for(let i=1;i<=5;i++){
    const star = document.createElement("span");
    star.innerHTML = "⭐";
    star.style.cursor = "pointer";

    star.addEventListener("click", function(){
      localStorage.setItem("rating-"+id, i);
      highlightStars(id, i);
    });

    starContainer.appendChild(star);
  }

  const savedRating = localStorage.getItem("rating-"+id);
  if(savedRating){
    highlightStars(id, savedRating);
  }
}

function highlightStars(id, rating){
  const starContainer = document.querySelector(`[data-id='${id}']`);
  const stars = starContainer.querySelectorAll("span");

  stars.forEach((star,index)=>{
    star.style.color = index < rating ? "gold" : "gray";
  });
}

/* SAVE REVIEW */
function saveReview(id,title){
  const text = document.getElementById("review-"+id).value;
  if(!text) return;

  const reviews = JSON.parse(localStorage.getItem("reviews-"+id)) || [];
  reviews.push(text);

  localStorage.setItem("reviews-"+id, JSON.stringify(reviews));
  document.getElementById("review-"+id).value = "";

  loadReviews(id);
}

/* LOAD REVIEWS */
function loadReviews(id){
  const container = document.getElementById("comments-"+id);
  const reviews = JSON.parse(localStorage.getItem("reviews-"+id)) || [];

  container.innerHTML = "<h4>User Reviews:</h4>";
  reviews.forEach(r=>{
    const p = document.createElement("p");
    p.innerText = r;
    container.appendChild(p);
  });
}

// ===============================
// ⭐ REVIEW + RATING SYSTEM
// ===============================

// Modify your displayMovies function
// (If you already have displayMovies, replace ONLY that function)

function displayMovies(movies){
  const container = document.getElementById("movies");
  container.innerHTML="";

  movies.forEach(movie=>{

    container.innerHTML += `
      <div class="movie-card">
        <img src="${movie.Poster}" width="150">
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
function addReview(id,title){

  const text = document.getElementById(`review-${id}`).value;
  const rating = document.getElementById(`rating-${id}`).value;

  if(text.trim()===""){
    alert("Please write a review!");
    return;
  }

  const reviewData = {
    title:title,
    review:text,
    rating:Number(rating)
  };

  let reviews = JSON.parse(localStorage.getItem(id)) || [];
  reviews.push(reviewData);

  localStorage.setItem(id, JSON.stringify(reviews));

  document.getElementById(`review-${id}`).value="";

  loadReviews(id);
}


// ===============================
// 📊 LOAD REVIEWS + AVERAGE
// ===============================
function loadReviews(id){

  const reviewBox = document.getElementById(`reviews-${id}`);
  const reviews = JSON.parse(localStorage.getItem(id)) || [];

  reviewBox.innerHTML="";

  let total = 0;

  reviews.forEach(r=>{
    total += r.rating;

    reviewBox.innerHTML += `
      <p>${"⭐".repeat(r.rating)} - ${r.review}</p>
      <hr>
    `;
  });

  const avg = reviews.length ? (total/reviews.length).toFixed(1) : 0;

  document.getElementById(`avg-${id}`).innerHTML =
    `⭐ Avg Rating: ${avg} (${reviews.length} reviews)`;
}
