$(document).ready(function () {
  
  const body = document.getElementById("body");

  fetchWatch().then((movies) => {
    setWatchHeadLine();
    displayMovies(movies, body);
  });
});

function removeFromWatch(e) {
  let movieName = e.target.name;
  const Http = new XMLHttpRequest();
  const url =
    "http://localhost:8080/removeFromWl?movieName=" +
    movieName +
    "&userName=" +
    ClientUser.userName;
  Http.open("POST", url);
  Http.send();
  location.reload();
}
