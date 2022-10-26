$(document).ready(() => {
  let route = window.location.href.split("/")[3];
  if (route == "") {
    $("#content").load("views/main.html", () => {});
  }
  if (route == "admin") {
    $("#content").load("views/admin.html");
  }

  if (route == "watchlist-view") $("#content").load("views/watchList.html");

  if (route.includes("moviepage")) $("#content").load("views/moviePage.html");
  console.log(route);

  if (route == "login") {
    $("#content").load("views/signIn.html");
  }

  if (route == "sign-up") {
    $("#content").load("views/signUp.html");
  }

  if (route == "about") {
    $("#content").load("views/about.html");
  }

  if (route == "contact") {
    $("#content").load("views/contact.html");
  }

  
  if (route == "news") {
    $("#content").load("views/news.html");
  }

  //load img to canvas
  var canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  var markerObj = new Image();

  markerObj.onload = function() {
      context.drawImage(markerObj, 75, 30,150,90);
  };
  markerObj.src = '/img/gigos_logo.png';
});

