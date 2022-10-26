$(document).ready(function () {
  var userName;
  if (ClientUser != null) addHelloUser();
  //document.getElementById("showAll").setAttribute("onclick", "showAll()");
  const movieContent = document.getElementById("movieContent");
  const body = document.getElementById("body");
  fetchMovies().then((movies) => {
    displayMovies(movies, movieContent);
  });
  function addHelloUser() {
    userName = ClientUser.userName;
    let div = document.getElementById("HelloUser");
    let p = document.createElement("p");
    p.setAttribute("id", "helloUser");
    div.appendChild(p);
    p.innerHTML = "Hello " + userName;
  }

  $(".showAll").click(function () {
    resetPicks();
    let head = document.getElementById("headLine");
    head.innerHTML = "GigosRate - rate the best movies out there!";
    fetchMovies().then((movies) => {
      displayMovies(movies, movieContent);
    });
  });
});

function addToWatch(e) {
  if (ClientUser != null) {
    let movieName = e.target.name;
    const Http = new XMLHttpRequest();
    const url =
      "http://localhost:8080/addToWl?movieName=" +
      movieName +
      "&userName=" +
      ClientUser.userName;
    Http.open("POST", url);
    Http.send();
  } else alert("Log in required");
}

function displaySorted() {
  let head = document.getElementById("headLine");
  head.innerHTML = "GigosRate - rate the best movies out there!";
  let genre = document.getElementById("genre").value;
  let year = document.getElementById("year").value;
  if (genre === "all genres" && year === "all years") {
    fetchMovies().then((movies) => {
      displayMovies(movies, movieContent);
    });
  } else {
    let arr = new Array(4);
    if (year != "all years") {
      if (year.includes("-")) {
        let yearArr = year.split("-");
        arr[2] = yearArr[0];
        arr[3] = yearArr[1];
      } else {
        arr[2] = year;
        arr[3] = year;
      }
    }
    if (genre != "all genres") {
      arr[1] = genre;
    }
    fetchMovies(arr).then((movies) => {
      displayMovies(movies, movieContent);
    });
  }
}

function searchName() {
  let name = document.getElementById("search").value;
  // $(".movie-search").val("");
  resetPicks();
  if (name != null) {
    let arr = new Array(4);
    arr[0] = name;
    fetchMovies(arr).then((movies) => {
      displayMovies(movies, movieContent);
    });
  } else {
    fetchMovies().then((movies) => {
      displayMovies(movies, movieContent);
    });
  }
}

function topPicks() {
  resetPicks();
  if (ClientUser == null) {
    alert("Log in required");
    return;
  } else {
    userName = ClientUser.userName;
    let p = document.getElementById("helloUser");
    p.innerHTML = "Hello " + userName;
    let head = document.getElementById("headLine");
    head.innerHTML = "Our best picks for you";
    async function fetchAllMovies() {
      let url = "http://localhost:8080/allMovies";
      if (userName != null) url += "?userName=" + userName;
      let res = await fetch(url);
      const movies = await res.json();
      return movies;
    }
    fetchAllMovies().then((movies) => {
      displayMovies(movies, movieContent);
    });
  }
}
