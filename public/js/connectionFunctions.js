// Create first connection with the server socket io.
var socket = io.connect("http://localhost:8080");

// Switch the page into the sign up page.
function SignUpPage() {
  const url = "http://localhost:8080/sign-up";
  window.location = url;
}

// Switch the page into the sign in page.
function SignInPage() {
  $(document).ready(function () {
    $("#content").load("views/signIn.html");
  });    
}

// Switch the page into the admin page.
function AdminPage() {
  const url = "http://localhost:8080/admin";
  window.location = url;
}

// Switch the page into the main page.
function MainPageSwitch(){
  const url = "http://localhost:8080";
  window.location = url;
}

// Checks if the user already logged after refresh/page swap.
$(document).ready(() => {
  if(sessionStorage.getItem('user')!=null){
    ClientUser = JSON.parse(sessionStorage.getItem('user'));
    if(ClientUser!=null){
      $("#sign-up").remove();
      $("#sign-in").remove();
      if(ClientUser.isAdmin==true){
        $("#top-bar").append(
          '<li id="admin" onclick="AdminPage()"><a>Admin</a></li>'
        );
      }
      $("#top-bar").append(
        '<li id="sign-out" onclick="ShowLi()"><a>Sign out</a></li>'
      );
      $("#top-bar").append(
        '<li id="watch list"><a href="watchlist-view">WatchList</a></li>'
      );
    }
  }
});

  // Show the labels after the user signed out.
function ShowLi() {
  if(ClientUser.isAdmin==true){
    $("#admin").remove();  
  }
  $("#sign-out").remove();
  $("[id='watch list']").remove();

  $("#top-bar").append(
    '<li id="sign-up" onclick="SignUpPage()"><a>Sign up</a></li>'
  );
  $("#top-bar").append(
    '<li id="sign-in" onclick="SignInPage()"><a>Sign in</a></li>'
  );
  sessionStorage.removeItem('user');
  ClientUser = null;
  MainPageSwitch();
}

// Handle the login event from the server. 
socket.on("login", function (data) {
  if (data.is_valid == true) {
    getUser(data.userName);
  } else {
    var SignInLabel = document.getElementById("value");
    if(SignInLabel == null){
      $("#respond").append("<p id=\"value\">username/password are incorrect.</p>");
    }
  }
});

// Handle the sign up event from the server. 
socket.on("sign-up", function (data) {
  if (data.is_valid == true) {
    const url = "http://localhost:8080";
    window.location = url;
    // HideLi();
  } else {
    var SignUpLabel = document.getElementById("value");
    if(SignUpLabel == null){
    $("#Sign-Up-Respond").append("<p id=\"value\">User already exist.</p>");
    }
    else{
      $("p#value").text("User already exist.");
    }
  }
});

// the user object from the DB.
var ClientUser;

// Handle the getUser event from the server. 
socket.on("getUser", function (data) {
  if (data.user == null) {
  } else {
    ClientUser = data.user;
    if(ClientUser!=null){
      HideLi();
    }
  }
});

