
var movieName;

$(document).ready(function(){
    
    const fixedStars  =[...document.getElementsByClassName("fa fa-star")];
    const ratingStars = [...document.getElementsByClassName("rating__star")];

    const facebookBtn = document.querySelector(".facebook-btn");
    const twitterBtn = document.querySelector(".twitter-btn");
    const whatsappBtn = document.querySelector(".whatsapp-btn");

    movieName = getMovieName();
    fetchMovieByName(movieName).then((movie) => {
        loadPageFromDB(movie);
        addLocations(movie);
        initSocials();
    });
    
    function getMovieName(){
        let thisPageUrl = window.location.href;
        let urlSplit = [];
        urlSplit = thisPageUrl.split("moviename=");
        let query = urlSplit[1];
        let querySplit = [];
        querySplit = query.split("%20");
        movieName = querySplit.join(" ");
        return movieName;
    }
    
    async function fetchMovieByName(movieName){
        let url = "http://localhost:8080/searchMovie?movieName=" + movieName;
        let movieJason = await fetch(url);
        const movie = await movieJason.json();
        return movie[0];
    }
    
    function loadPageFromDB(item){
      
        document.getElementById("movieName").innerHTML = item.movieName;
        document.getElementById("description").innerHTML ="Description: " + item.description;
        document.getElementById("duration").innerHTML = "Duration: " + item.duration;
        document.getElementById("director").innerHTML ="Director: " + item.director;
        document.getElementById("stars").innerHTML ="Stars: " + item.stars;
        document.getElementById("image").setAttribute("src" ,item.img);
        let url =fixUrl(item.trailer);
        document.getElementById("movie").setAttribute("src" ,url);
         
        showStarsFromDBrate(fixedStars,item);
        rateStars(ratingStars,item);
    }

    function initSocials(){
        let url = 'https://www.facebook.com/Gigos-Rate-104140762405866';
        let postTitle = encodeURI("Hi everyone, please check this out:");
        facebookBtn.setAttribute("href" ,`https://www.facebook.com/sharer.php?u=${url}` );
        twitterBtn.setAttribute("href" , `https://twitter.com/share?url=${url}&text=[post-title]`);
        whatsappBtn.setAttribute("href" , `https://api.whatsapp.com/send?text=${postTitle} ${url}`);
    }

    function fixUrl(url){
        let splitUrl = [];
        splitUrl = url.split("watch?v=");
        finalUrl = splitUrl.join("embed/");
        finalUrl = finalUrl.concat('' ,'?autoplay=1');
        return finalUrl;
    }
    function showStarsFromDBrate(stars , item){
        const starClassActive = "fa fa-star checked";
        const starClassInactive = "fa fa-star-o";
        const halfStarClass = "fa fa-star-half-full";
        const starsLength = stars.length;
        var rateJson =JSON.parse(item.rate);
        var rate =Number.parseFloat(rateJson['totalRate']);
        rate = rate.toFixed(1);
        let boolienFlag = false;
        document.getElementById("rate").innerHTML = rate;
        var roundRate =  Math.floor(rate);
        for (let idx = 0; idx < starsLength; idx++) {
            if(idx < roundRate){
                stars[idx].className = starClassActive;
            }else{
                if((rate-roundRate)>= 0.5 && boolienFlag==false ){
                    stars[idx].className = halfStarClass;
                    boolienFlag = true;
                }else{
                    stars[idx].className = starClassInactive;
                }
            }
        } 
    }
    
    function rateStars(stars,item) {
        const starClassActive = "rating__star fas fa-star";
        const starClassInactive = "rating__star far fa-star";
        const starsLength = stars.length;   
        let i;
        let rate = parseFloat(item.rate);
        let clientRate;
        stars.map((star) => {
            star.onclick = () => {
                if(ClientUser==null){
                    alert("Log in required");
                }else{
                    i = stars.indexOf(star);       
                    if (star.className === starClassInactive) {
                        clientRate = i+1;
                        for (i; i >= 0; --i) stars[i].className = starClassActive;
                    } else {
                        clientRate = i;
                        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
                    }
                    changeRateInDB(clientRate);
                    fetchMovieByName(movieName).then((movie) => {
                        showStarsFromDBrate(fixedStars,movie)
                    });
                }
            };
        });   
            
        
    }
});

function addToWatch() {
    if(ClientUser==null){
        alert("Log in required");
    }
    else{
        const Http = new XMLHttpRequest();
        const url =
          "http://localhost:8080/addToWl?movieName=" +
          movieName +
          "&userName=" +
          ClientUser.userName;
        Http.open("POST", url);
        Http.send();
    }
}

function changeRateInDB(rate) {
    const Http = new XMLHttpRequest();
    const url =
      "http://localhost:8080/rate?movieName=" +
      movieName +
      "&userName=" +
      ClientUser.userName + 
      "&rate="+
      rate;
    Http.open("POST", url);
    Http.send();
}

async function getCoordsFromCountryName(country){
    let url =
    "http://localhost:8080/country?country=" + country;
    let coordsJason = await fetch(url);
    const coords = await coordsJason.json();
    return coords;
}

var map;
function initMap() {
    let worldCenter = {lat: 40.52, lng: 34.34};
    var options = {
        zoom: 2,
        center: worldCenter
    }
    map = new google.maps.Map(document.getElementById('map'), options); 
}

function addLocations(item){
    locations = [];
    locations = item.locations.split(",");
    for (let i = 0; i < locations.length; i++) {
        getCoordsFromCountryName(locations[i]).then((coords)=>{
            var location = new google.maps.Marker({
                position:coords,
                map:map
            });
        }); 
    } 
}

function scrollToTop() {
    $(window).scrollTop(0);
}     