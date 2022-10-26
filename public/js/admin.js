
//initial load
var lastEditedLine;
var lastEditedMovieName;
var displayedMovies;
var displayUsers; // needs to add
var lastWeekUsers;
var moviesByGenere;
var userStatisticsData;
var userStatLargest;
var movieGenreData;
let onUsers = false;
let userChart = true;

$( document ).ready(function() {
    httpGetAsync("http://localhost:8080/firstMovies?num=10",handleMovies);
    httpGetAsync("http://localhost:8080/userStatics",handleUserStatics);
    httpGetAsync("http://localhost:8080/movStatics",handleMovieStatics);
});


function handleMovies(movies){
    displayedMovies= JSON.parse(movies);
    displayLoadedMovies();
}
function handleSearchedUser(user){
    displayUsers = JSON.parse(user);
    displayLoadedUser();
}
function handleSearchedMovie(movie){
    if(movie != "this movie is not exist"){
        displayedMovies = [];
        displayedMovies = JSON.parse(movie);
        displayLoadedMovies();    
    }
    else{
        displayedMovies = [];
        displayLoadedMovies();    
    }
}

function displayLoadedUser(){
    if(onUsers && displayUsers!=null){
        $(".list").empty();
        let line =         `          <div class="line">
        <div class="name"> ${displayUsers.userName}</div>
        <img id="${displayUsers.userName}" onclick="deleteUser(this.id)" class="delete" src="img/deleteIcon.png" />
      </div>`;
        $(".list").append(line);

    }
}

function displayLoadedMovies(){
    $( document ).ready(function() {
        if(!onUsers){
            $(".list").empty();
            for(let i=0; i<displayedMovies.length && i<10;i++){
                var nameWithoutSpaces = displayedMovies[i].movieName.replace(/\s/g,'');
                let line =         `          <div id="line${nameWithoutSpaces}" class="line">
                <div class="name"> ${displayedMovies[i].movieName}</div>
                <img id="${displayedMovies[i].movieName}" onclick="addEditMoviePanel(this.id)"  class="edit" src="img/editIcon.png"/>
                <img id="${displayedMovies[i].movieName}" onclick="deleteMovie(this.id)" class="delete" src="img/deleteIcon.png" />
              </div>`;
                $(".list").append(line);
            }        
        }
    });
}

function deleteMovie(name){
    httpPostAsync(`http://localhost:8080/removeMovie?userName=${JSON.parse(sessionStorage.getItem('user')).userName}&movieName=${name}`,"",search);
}

function deleteUser(user){
    httpPostAsync(`http://localhost:8080/removeUser?userName=${JSON.parse(sessionStorage.getItem('user')).userName}&toDelete=${user}`,"",search);

}

function addEditMoviePanel(movieName) {
    lastEditedMovieName = movieName;
    var lineElementID = 'line'+movieName.replace(/\s/g,'');
    console.log(lineElementID);

    if($('.editContainer').length){
        if(lastEditedLine == lineElementID){
            $('.editContainer').remove();
            return;
        }
        else
        $('.editContainer').remove();
    }

    lastEditedLine = lineElementID;
    $(`        <div class="editContainer">
    <div class="editTitle">Edit Movie</div>
    <div class="editData">
      <div class="addName"> Movie name:</div>
      <input id="editmovieName" class="movieInput" type="text" placeholder="Movie name.." name="movieName">
      <div class="addName">Description:</div>
      <textarea rows="4" cols="40" id="editmovieDescription" type="text" placeholder="Movie description.." name="movieDescription" 
      style="width: 100%;"></textarea>
      <div class="addName">Locations:</div>
      <input id="editlocations" class="movieInput" type="text" placeholder="Locations.." name="locations">
      <div class="name">Duration:</div>
      <input id="editduration" class="movieInput" type="text" placeholder="Duration.." name="duration">
      <div class="addName">Trailer link:</div>
      <input id="edittrailerLink" class="movieInput" type="text" placeholder="Trailer.." name="trailer">
      <div class="addName">Img link:</div>
      <input id="editimgLink" class="movieInput" type="text" placeholder="Img.." name="imgLink">
      <div class="addName">Director:</div>
      <input id="editdirector" class="movieInput" type="text" placeholder="Director.." name="director">
      <div class="addName">Stars:</div>
      <input id="editstars" class="movieInput" type="text" placeholder="Stars.." name="stars">
      <div class="addName">Release year: </div>
      <input id="editreleaseYear" class="movieInput" type="text" placeholder="Release year.." name="releaseYear">
      <div class="addName">Genre </div>
      <input id="editgenre" class="movieInput" type="text" placeholder="Genre.." name="genre">  
    </div>
    <div onclick="onSaveEdit()" class="saveBtn">
      Save Changes
    </div>
  </div>
`).insertAfter(`#${lineElementID}`,httpGetAsync(`http://localhost:8080/searchMovie?movieName=${movieName}`,insertEditMovieFields));

}

function changeOnUsers(state){
    onUsers = state;
    // console.log(onUsers);
    if(onUsers){
        $('.list').empty();
        $("#moviesOption").removeClass();
        $("#usersOption").removeClass();
        $("#moviesOption").addClass("innerOption");
        $("#usersOption").addClass("selectetOption");

    }
    else {
        displayLoadedMovies();
        $("#moviesOption").removeClass();
        $("#usersOption").removeClass();
        $("#usersOption").addClass("innerOption");
        $("#moviesOption").addClass("selectetOption");

    }
}

$( document ).ready(function() {
    var input = document.getElementById("searchInput");

    input.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            search();
        }
      });
    
});


  function search(){
    var txt =  $('#searchInput').val();
    if($('.editContainer').length){
        $('.editContainer').remove();  
    }        
    if(!onUsers){
        if(txt != "")
            httpGetAsync(`http://localhost:8080/searchMovie?movieName=${txt}`,handleSearchedMovie);
        else 
            httpGetAsync("http://localhost:8080/firstMovies?num=10",handleMovies);
    }
    else{
        httpGetAsync(`http://localhost:8080/user?userName=${txt}`,handleSearchedUser);
    }
    // console.log(txt);
}

function onAddMovie(){
    var movieName =  $('#movieName').val();
    var movieDesc = $('#movieDescription').val();
    var locations= $('#locations').val();
    var trailer= $('#trailerLink').val();
    var duration= $('#duration').val();
    var director= $('#director').val();
    var stars= $('#stars').val();
    var img= $('#imgLink').val();
    var releaseYear = $('#releaseYear').val();
    var genre = $('#genre').val();
    httpPostAsync(`http://localhost:8080/addMovie?userName=${JSON.parse(sessionStorage.getItem('user')).userName}&movieName=${movieName}&description=${movieDesc}&locations=${locations}&trailer=${trailer}&rate=0&duration=${duration}&director=${director}&stars=${stars}&img=${img}&releaseYear=${releaseYear}&genre=${genre}`,"",
    function (value){
        alert(value);
        $('#movieName').val("");
        $('#movieDescription').val("");
        $('#locations').val("");
        $('#trailerLink').val("");
        $('#duration').val("");
        $('#director').val("");
        $('#stars').val("");
        $('#imgLink').val("");
        $('#releaseYear').val("");
        $('#genre').val("");
    });
    //var json = `{   "movieName":"${movieName}",   "movieDescription":"${movieDesc}",   "locations":"${locations}",   "trailer":"${trailer}",   "duration":"${duration}",   "director":"${director}",   "stars":"${stars}",   "img":"${img}" }`;
    // console.log(JSON.parse(json));
}

function changeChart(uChart){
    userChart = uChart;
    if(userChart){
        createUserBarChart(userStatisticsData,userStatLargest + 5);
        $("#userChartOption").removeClass();
        $("#genreChartOption").removeClass();
        $("#userChartOption").addClass("selectedChartOption");
        $("#genreChartOption").addClass("chartOption");

    }
    else
    {
        createPieChart(movieGenreData);
        $("#userChartOption").removeClass();
        $("#genreChartOption").removeClass();
        $("#userChartOption").addClass("chartOption");
        $("#genreChartOption").addClass("selectedChartOption");
    }    
}

function handleUserStatics(res){
    // res = res.sort(custom_sort);
    userStatisticsData = JSON.parse(res);
    userStatLargest = 0;
    for(let i=0; i<userStatisticsData.length;i++){
        if(userStatisticsData[i].count > userStatLargest)
            largest = userStatisticsData[i].count;
    }
    userStatisticsData = userStatisticsData.sort((a, b) => {
        var parts = a._id.split("/");
        var dtA = new Date(parseInt(parts[2], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[0], 10));

        var parts = b._id.split("/");

        var dtB = new Date(parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10));

        return dtA - dtB;
      });
    createUserBarChart(userStatisticsData,userStatLargest+5);
}

function handleMovieStatics(res){
    movieGenreData = JSON.parse(res);
}

function onSaveEdit(){
    var movieName =  $('#editmovieName').val();
    var movieDesc = $('#editmovieDescription').val();
    var locations= $('#editlocations').val();
    var trailer= $('#edittrailerLink').val();
    var duration= $('#editduration').val();
    var director= $('#editdirector').val();
    var stars= $('#editstars').val();
    var img= $('#editimgLink').val();
    var releaseYear = $('#editreleaseYear').val();
    var genre = $('#genre').val();
    httpPostAsync(`http://localhost:8080/updateMovie?userName=${JSON.parse(sessionStorage.getItem('user')).userName}&oldName=${lastEditedMovieName}&newName=${movieName}&description=${movieDesc}&locations=${locations}&trailer=${trailer}&rate=0&duration=${duration}&director=${director}&stars=${stars}&img=${img}&releaseYear=${releaseYear}&genre=${genre}`,"",
    function (value){
        alert(value);
    });

}

function insertEditMovieFields(movie){
    $( document ).ready(function() {
        var parsedMovie = JSON.parse(movie);
        console.log(parsedMovie);
        $('#editmovieName').val(parsedMovie[0].movieName);
        $('#editmovieDescription').val(parsedMovie[0].description);
        $('#editlocations').val(parsedMovie[0].locations);
        $('#edittrailerLink').val(parsedMovie[0].trailer);
        $('#editduration').val(parsedMovie[0].duration);
        $('#editdirector').val(parsedMovie[0].director);
        $('#editstars').val(parsedMovie[0].stars);
        $('#editimgLink').val(parsedMovie[0].img);
        $('#editreleaseYear').val(parsedMovie[0].releaseYear);
        $('#editgenre').val(parsedMovie[0].genre);
    
    });
}