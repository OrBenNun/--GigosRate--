async function fetchMovies(movieName) {
  let url;
  if (movieName != null) {
    url = "http://localhost:8080/searchMovie?";
    if (movieName[0] != null) url += "movieName=" + movieName[0];
    if (movieName[1] != null) url += "&genre=" + movieName[1];
    if (movieName[2] != null) url += "&startYear=" + movieName[2];
    if (movieName[3] != null) url += "&endYear=" + movieName[3];
  } else {
    url = "http://localhost:8080/allMovies";
  }
  let res = await fetch(url);
  const movies = await res.json();
  return movies;
}

async function fetchWatch() {
  let url = "http://localhost:8080/watchList?userName=" + ClientUser.userName;
  const res = await fetch(url);
  const movies = await res.json();
  return movies;
}

function displayMovies(movies, e) {
  e.replaceChildren();
  let imgOpenTemp = "<img class='img' name= '";
  let imgSrc = "' src='"; // append img url + imgCloseTemp
  let star = "<span class=" + "'fa fa-star checked'" + "></span>";
  let rateOpen = "<span class=rate>";
  let rateClose = "</span>";
  let imgCloseTemp = " 'onclick = 'moveToMoviePage(event)' >";
  let movieDivOpenTemp = "<html>"; // append movie + movieDivCloseTemp
  let movieDivCloseTemp = "</html>";
  let movieSpanOpenTemp = "<div class ='movieDiv' name='"; // append img + text + movieSpanCloseTemp
  let movieSpanCloseTemp = "</div>";
  let textOpenTemp = "<p class = 'text'>"; // append movie name + textCloseTemp
  let textCloseTemp = "</p>";

  let div = null;
  let tmpArray = [];
  for (let i = 0; i < movies.length && i < 20; i++) {
    if (i % 4 == 0) {
      div = document.createElement("div");
      div.setAttribute("class", "movieRow");
    }

    let totalRate = Number(JSON.parse(movies[i].rate).totalRate);
    totalRate = totalRate.toFixed(1);
    let name = movies[i].movieName;
    let movieDivName = movieSpanOpenTemp + name + "'>";
    let rate = rateOpen + totalRate + rateClose;
    let text = "<span>" + textOpenTemp + name + textCloseTemp + "</span>";
    let rateSpan = "<span class='rateSpan'>" + star + rate + "</span>";
    let img = imgOpenTemp + name + imgSrc + movies[i].img + imgCloseTemp;
    let movie = movieDivName + img + text + rateSpan + movieSpanCloseTemp;
    tmpArray.push(movie);
    if (tmpArray.length == 4) {
      e.appendChild(div);
      let movieDiv = movieDivOpenTemp;
      while (tmpArray.length != 0) {
        movieDiv += tmpArray.pop();
      }
      movieDiv += movieDivCloseTemp;
      div.innerHTML = movieDiv;
    }
  }
  if (tmpArray.length != 0) {
    div = document.createElement("div");
    div.setAttribute("class", "movieRow");
    e.appendChild(div);
    let movieDiv = movieDivOpenTemp;
    while (tmpArray.length != 0) {
      movieDiv += tmpArray.pop();
    }
    movieDiv += movieDivCloseTemp;
    div.innerHTML = movieDiv;
  }
  addWatchListButton();
}

function addWatchListButton() {
  let route = window.location.href;
  let arr = document.getElementsByClassName("movieDiv");
  for (let i = 0; i < arr.length; i++) {
    let name = arr[i].getAttribute("name");
    let button = document.createElement("button");
    let span = document.createElement("span");
    span.setAttribute("class", "watchList");
    span.appendChild(button);
    button.setAttribute("class", "watch-list");
    button.setAttribute("name", name);
    if (route.includes("watch")) {
      button.setAttribute("onclick", "removeFromWatch(event)");
      button.innerHTML = "Remove From Watch List";
    } else {
      button.setAttribute("onclick", "addToWatch(event)");
      button.innerHTML = "Add to Watch List";
    }
    arr[i].appendChild(span);
  }
}

function resetPicks() {
  let genre = (document.getElementById("genre").options.selectedIndex = 0);
  let year = (document.getElementById("year").options.selectedIndex = 0);
}
function moveToMoviePage(e) {
  let movieName = e.target.name;
  const url = "http://localhost:8080/moviepage?moviename=" + movieName;
  window.location = url;
}

function setWatchHeadLine() {
  let text = "Hello " + ClientUser.userName + "! here is your watch list";
  const p = document.getElementById("headLine");
  p.textContent = text;
}
