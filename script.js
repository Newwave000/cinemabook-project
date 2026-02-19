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

 
