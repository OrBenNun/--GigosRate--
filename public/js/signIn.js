// Send login request to the server socket io.
function Login(_userame,_password,_isAdmin){
    socket.emit("login", {
        username: _userame,
        password: _password,
        is_admin: _isAdmin
      });
}

// Takse the values from the sign in page and send them to the server -> DB check.
function LoginButton(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("Password").value;
    var is_admin = false;
    Login(username,password,is_admin);
}

// Send request to the server socket io to receive the user object.
function getUser(username) {
    socket.emit("getUser", {
      username: username,
    });
  }

  // Remove the unnecessary labels from the top bar.
  function HideLi() {
    // saves the user data if he refresh the page.
    saveUserData();
    $("#sign-up").remove();
    $("#sign-in").remove();
    if(IsAdmin(ClientUser)==true){
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
    // change the page to the main page.
    const url = "http://localhost:8080";
    window.location = url;
  }

  // Save the user data if he refresh the page.
  function saveUserData(){
    sessionStorage.setItem('user',JSON.stringify(ClientUser));
  }

  // Show the labels after the user signed out.
  function ShowLi() {
    if(IsAdmin(ClientUser)==true){
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
    // remove the user.
    ClientUser = null;
  }

  // checks if the user is an admin.
  function IsAdmin(user){
    if(user.isAdmin == true){
      return true;
    }
    return false;
  }
