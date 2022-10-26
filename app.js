const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const port = 8080;
var hash = require("object-hash");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

var http = require("http");
var server = http.createServer(app);
var io = require("socket.io")(server);
server.listen(port);
console.log("server strarted on port: " + port);

// ****************** Socket IO functions ****************\\
io.sockets.on("connection", function (ClientSocket) {
  // Event for login request.
  ClientSocket.on("login", function (data) {
    var _username = data.username;
    var password = data.password;
    var is_admin = data.is_admin;
    autheticateUser(_username, password);
  });

  // Event for sign up request.
  ClientSocket.on("sign-up", function (data) {
    var _username = data.username;
    var password = data.password;
    var is_admin = data.is_admin;
    createUser(_username, password);
  });

  // Event for get user request.
  ClientSocket.on("getUser", function (data) {
    var _username = data.username;
    getUser(_username);
  });
});

app.post("");

const { MongoClient, ServerApiVersion } = require("mongodb");
// const { json } = require("stream/consumers");
// const { dir } = require("console");
const { unwatchFile } = require("fs");
const e = require("express");
const uri =
  "mongodb+srv://Shaharkozi:S123456@gigos.kdk9a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Admin test
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/moviepage", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/watchlist-view", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/sign-up", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.get("/news", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

/**************************************************
 =================DataBase Functions===============
 **************************************************/

function createUser(userName, password, res) {
  //helper function for signup
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();

  currentDate = String(day) + "/" + String(month) + "/" + String(year);
  const users = client.db("gigos").collection("users");
  var pass = hash(password);
  const doc = {
    userName: userName,
    password: pass,
    isAdmin: false,
    watchList: [],
    signupDate: currentDate,
  };
  const valid = {
    userName: userName,
  };
  users.findOne(valid, function (err, result) {
    if (err) throw err;
    if (result != null) {
      io.sockets.emit("sign-up", { is_valid: false });
      return;
    }
    users.insertOne(doc);
    io.sockets.emit("sign-up", { is_valid: true });
  });
}

function removeUser(adminName, userNameToDelete, res) {
  const users = client.db("gigos").collection("users");
  const admin = {
    userName: adminName,
  };
  users.findOne(admin, function (err, result) {
    if (err) throw err;
    if (result != null) {
      //check if user exist
      if (result.isAdmin == true) {
        //check if user is admin
        var myquery = { userName: userNameToDelete };
        users.remove(myquery, function (err, obj) {
          //remove user
          if (err) throw err;
          res.send("userName " + userNameToDelete + " is deleted");
          console.log(" document(s) deleted");
        });
      } else {
        res.send("you are not admin");
      }
    }
  });
}

function autheticateUser(userName, password, res) {
  //pull thr data from DB for the /get/authenticateUsre
  const users = client.db("gigos").collection("users");
  var pass = hash(password);
  const doc = {
    userName: userName,
    password: pass,
  };
  users.findOne(doc, function (err, result) {
    if (err) throw err;
    if (result != null) {
      io.sockets.emit("login", { is_valid: true, userName: userName });
    } else {
      io.sockets.emit("login", { is_valid: false });
    }
  });
}

function getUser(userName, res) {
  //pull thr data from DB for the /get/user
  const users = client.db("gigos").collection("users");
  const doc = {
    userName: userName,
  };
  users.findOne(doc, function (err, result) {
    if (err) throw err;
    if (result == null) {
      io.sockets.emit("getUser", { user: null });
      return;
    } else {
      if (res) {
        res.send(result);
        return;
      }
      io.sockets.emit("getUser", { user: result });
    }
  });
}

function addMovie(
  userName,
  movieName,
  description,
  locations,
  trailer,
  duration,
  director,
  stars,
  img,
  releaseYear,
  genre,
  res
) {
  const users = client.db("gigos").collection("users");
  const movies = client.db("gigos").collection("movies");
  const user = {
    userName: userName,
  };
  const rate = { totalRate: 0 };
  const movie = {
    movieName: movieName,
    description: description,
    locations: locations,
    trailer: trailer,
    rate: JSON.stringify(rate),
    duration: duration,
    director: director,
    stars: stars,
    img: img,
    releaseYear: releaseYear,
    genre: genre,
  };
  users.findOne(user, function (err, result) {
    if (err) throw err;
    if (result != null && result.isAdmin) {
      movies.findOne(movie, function (err, result) {
        if (err) throw err;
        if (result != null) {
          res.send("this movie is already exist");
        } else {
          movies.insertOne(movie);
          res.send("insert movie: " + movieName);
        }
        return;
      });
    } else {
      res.send("user is not admin");
    }
  });
}

async function updateMovie(
  userName,
  oldName,
  newName,
  description,
  locations,
  trailer,
  duration,
  director,
  stars,
  img,
  releaseYear,
  genre,
  res
) {
  const users = client.db("gigos").collection("users");
  const movies = client.db("gigos").collection("movies");
  const user = {
    userName: userName,
  };
  const movie = {
    movieName: oldName,
  };
  if (oldName != newName) {
    const moviesArr = await movies.find().toArray();
    for (let i = 0; i < moviesArr.length; i++) {
      //validation test
      if (moviesArr[i].movieName == newName) {
        res.send("new name is already exist");
        return;
      }
    }
  }

  users.findOne(user, function (err, result) {
    //find the user that invoke the update
    if (err) throw err;
    if (result != null && result.isAdmin) {
      //check if the user is admin
      movies.findOne(movie, async function (err, result) {
        //find movie to update
        if (err) throw err;
        if (result != null) {
          const options = { upsert: true };
          const updateDoc = {
            //set the new movie
            $set: {
              movieName: newName,
              description: description,
              locations: locations,
              trailer: trailer,
              duration: duration,
              director: director,
              stars: stars,
              img: img,
              releaseYear: releaseYear,
              genre: genre,
            },
          };
          const movieToUpdate = {
            //movie to update
            movieName: oldName,
          };
          await movies.updateOne(movieToUpdate, updateDoc, options); //update
          res.send("update movie: " + newName);
        } else {
          res.send("movie dont exist");
        }
      });
    } else {
      res.send("user is not admin");
    }
  });
}

function removeMovie(userName, movieName, res) {
  const users = client.db("gigos").collection("users");
  const user = {
    userName: userName,
  };
  users.findOne(user, async function (err, result) {
    if (err) throw err;
    if (result != null) {
      //check if user exist
      if (result.isAdmin == true) {
        //check if user is admin
        const movies = client.db("gigos").collection("movies");
        var myquery = { movieName: movieName };
        movies.remove(myquery, function (err, obj) {
          //remove movie
          if (err) throw err;
          console.log(" document(s) deleted");
          res.send(movieName + " is removed");
        });
        usersArr = await users.find().toArray();
        for (let i = 0; i < usersArr.length; i++) {
          if (usersArr[i].watchList.includes(movieName)) {
            //if the movie is in the watchList of the user
            let tmpArr = usersArr[i].watchList;
            let newArr = [];
            for (let j = 0; j < tmpArr.length; j++) {
              //delete the movie from watchList
              if (tmpArr[j] != movieName) {
                newArr.push(tmpArr[j]);
              }
            }
            const options = { upsert: true };
            const updateDoc = {
              //set the new watchList
              $set: {
                watchList: newArr,
              },
            };
            let userToUpdate = {
              //user object to update
              userName: usersArr[i].userName,
            };
            await users.updateOne(userToUpdate, updateDoc, options); //update
          }
        }
      }
    }
  });
}

async function getAllMovies(userName, res) {
  //helper function for signup
  var movies = await client.db("gigos").collection("movies").find().toArray();
  if (userName != null) {
    //case that wants movies with content of user
    const users = client.db("gigos").collection("users");
    const user = {
      userName: userName,
    };
    users.findOne(user, async function (err, result) {
      var filterMov = [];
      var wl = result.watchList;
      if (err) throw err;
      if (result == null) {
        return;
      } else {
        var filterMov = [];
        var wl = result.watchList;
        for (let i = 0; i < movies.length; i++) {
          for (let j = 0; j < wl.length; j++) {
            if (movies[i].movieName == wl[j]) {
              filterMov.push(movies[i]);
            }
          }
        }
      }
      if (filterMov.length == 0) {
        //case that the user dont has watchlist
        res.send(movies);
      } else {
        //case that the user has watchlist
        var json = {
          action: 0,
          drama: 0,
          comedy: 0,
          biography: 0,
          animation: 0,
        };
        for (var i = 0; i < filterMov.length; i++) {
          json[filterMov[i].genre] += 1;
        }
        var maxGenre = "action";
        for (var key of Object.keys(json)) {
          //iterate over all the rating values
          if (json[key] >= json[maxGenre]) {
            maxGenre = key;
          }
        }
        console.log(maxGenre);
        getMoviesByGenre(maxGenre, res);
      }
    });
  } else {
    //case that wants all movies without content of user
    res.send(movies);
  }
}

async function getFirstsMovies(num, res) {
  //helper function for signup
  var movies = await client
    .db("gigos")
    .collection("movies")
    .find()
    .limit(Number.parseInt(num))
    .toArray();
  res.send(movies);
}

function rate(movieName, userName, newRate) {
  //functionality of update rate
  const movies = client.db("gigos").collection("movies");
  const movie = {
    movieName: movieName,
  };
  movies.findOne(movie, async function (err, result) {
    //find the movie that we want to update his rate
    if (err) throw err;
    if (result != null) {
      //if the movie exist
      var jsonRate = JSON.parse(result.rate); //take the json of the rate value
      var tRate = 0; //calculate the new total rate
      var i = 0;
      for (var key of Object.keys(jsonRate)) {
        //iterate over all the rating values
        if (key != "totalRate") {
          i++;
          tRate += Number.parseFloat(jsonRate[key]);
        }
      }
      i++;
      tRate += Number.parseFloat(newRate);
      tRate /= i;
      jsonRate["totalRate"] = tRate; //assign the new totalRate to the json
      jsonRate[userName] = newRate; //append the new rating to json
      result.rate = JSON.stringify(jsonRate);
      var movie = {
        movieName: movieName,
      };
      var newValues = { $set: result };
      client
        .db("gigos")
        .collection("movies")
        .updateOne(movie, newValues, function (err, res) {
          //update the values at the DB
          if (err) throw err;
          console.log("1 document updated");
        });
    } else return; //if the movie dont exist return
  });
}

function addToWatchList(userName, movieName) {
  var user = {
    userName: userName,
  };
  var movie = {
    movieName: movieName,
  };
  client
    .db("gigos")
    .collection("users")
    .findOne(user, function (err, userRes) {
      if (err) throw err;
      client
        .db("gigos")
        .collection("movies")
        .findOne(movie, function (err, movieRes) {
          if (movieRes != null) {
            var tmpWL = userRes.watchList;
            for (let i = 0; i < tmpWL.length; i++) {
              if (tmpWL[i] == movieName) {
                return;
              }
            }
            tmpWL.push(movieName);
            var json = {
              watchList: tmpWL,
            };
            var newValues = { $set: json };
            client
              .db("gigos")
              .collection("users")
              .updateOne(user, newValues, function (err, res) {
                //update the values at the DB
                if (err) throw err;
                console.log("1 document updated");
              });
          } else {
            return;
          }
        });
    });
}

async function getMoviesByGenre(genre, res) {
  var movies = await client.db("gigos").collection("movies").find().toArray();
  var genreArr = [];
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].genre == genre) {
      genreArr.push(movies[i]);
    }
  }
  res.send(genreArr);
}

async function getWatchListByUserName(userName, res) {
  const users = client.db("gigos").collection("users");
  const user = {
    userName: userName,
  };
  users.findOne(user, async function (err, result) {
    var filterMov = [];
    var wl = result.watchList;
    if (err) throw err;
    if (result == null) {
      return;
    } else {
      var movies = await client
        .db("gigos")
        .collection("movies")
        .find()
        .toArray();
      var filterMov = [];
      var wl = result.watchList;
      for (let i = 0; i < movies.length; i++) {
        for (let j = 0; j < wl.length; j++) {
          if (movies[i].movieName == wl[j]) {
            filterMov.push(movies[i]);
          }
        }
      }
      res.send(filterMov);
    }
  });
}

async function groupByGenre(res) {
  const movies = client.db("gigos").collection("movies");
  const query = [{ $group: { _id: "$genre", count: { $sum: 1 } } }];
  const aggCursor = movies.aggregate(query);
  var groups = [];
  for await (const doc of aggCursor) {
    groups.push(doc);
  }
  res.send(groups);
}

async function groupBySignupDate(res) {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();

  currentDate = String(day) + "/" + String(month) + "/" + String(year);
  var arr = currentDate.split("/");
  var today = new Date(arr[2], parseInt(arr[1]) - 1, arr[0]);
  var weekAgo = new Date(arr[2], parseInt(arr[1]) - 1, parseInt(arr[0]) - 7);
  console.log(today);
  console.log(weekAgo);
  const users = client.db("gigos").collection("users");
  const query = [{ $group: { _id: "$signupDate", count: { $sum: 1 } } }];
  const aggCursor = users.aggregate(query);
  var groups = [];
  for await (const doc of aggCursor) {
    var d = doc._id.split("/");
    var date = new Date(d[2], parseInt(d[1]) - 1, d[0]);
    if (date <= today && date >= weekAgo) {
      groups.push(doc);
    }
  }
  res.send(groups);
}

function getCountry(country, res) {
  const map = client.db("gigos").collection("map");
  var doc = {
    name: "map",
  };
  map.findOne(doc, async function (err, result) {
    if (err) throw err;
    if (result != null) {
      var countrysArr = result.map.split("&");
      for (var i = 0; i < countrysArr.length; i++) {
        var countryJson = JSON.parse(countrysArr[i]);
        if (countryJson["country"] == country) {
          var returnJson = {
            lng: countryJson["longitude"],
            lat: countryJson["latitude"],
          };
          res.send(returnJson);
        }
      }
    }
  });
}

async function search(movieName, genre, startYear, endYear, res) {
  const movies = client.db("gigos").collection("movies");
  var moviesByNameArr = [];
  var moviesByYearArr = [];
  var moviesByGenreArr = [];
  var moviesArr = await movies.find().toArray();

  /*-----find by movie name-------*/
  if (movieName != null) {
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesArr[i].movieName.includes(movieName)) {
        moviesByNameArr.push(i);
      }
    }
  }

  /*--------find by movie year------- */
  if (startYear != null && endYear != null) {
    let start = Number.parseInt(startYear);
    let end = Number.parseInt(endYear);
    for (let i = 0; i < moviesArr.length; i++) {
      let relYear = Number.parseInt(moviesArr[i].releaseYear);
      if (relYear >= start && relYear <= end) {
        moviesByYearArr.push(i);
      }
    }
  }

  /*--------find by movie genre------- */
  if (genre != null) {
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesArr[i].genre == genre) {
        moviesByGenreArr.push(i);
      }
    }
  }

  /*-------------Intersection------------*/

  var filterMovies = [];
  if (
    startYear != null &&
    endYear != null &&
    movieName != null &&
    genre != null
  ) {
    /*case that search by all the params*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (
        moviesByGenreArr.includes(i) &&
        moviesByYearArr.includes(i) &&
        moviesByNameArr.includes(i)
      ) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear == null &&
    endYear == null &&
    movieName != null &&
    genre != null
  ) {
    /*case that search by the params: movieName and genre*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByGenreArr.includes(i) && moviesByNameArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear != null &&
    endYear != null &&
    movieName == null &&
    genre != null
  ) {
    /*case that search by the params: year and genre*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByGenreArr.includes(i) && moviesByYearArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear != null &&
    endYear != null &&
    movieName != null &&
    genre == null
  ) {
    /*case that search by the params: movieName and year*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByYearArr.includes(i) && moviesByNameArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear == null &&
    endYear == null &&
    movieName == null &&
    genre != null
  ) {
    /*case that search by the params: genre*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByGenreArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear == null &&
    endYear == null &&
    movieName != null &&
    genre == null
  ) {
    /*case that search by the params: movieName*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByNameArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  } else if (
    startYear != null &&
    endYear != null &&
    movieName == null &&
    genre == null
  ) {
    /*case that search by the params: year*/
    for (let i = 0; i < moviesArr.length; i++) {
      if (moviesByYearArr.includes(i)) {
        filterMovies.push(moviesArr[i]);
      }
    }
  }
  res.send(filterMovies);
}

function removeFromWl(userName, movieName) {
  const users = client.db("gigos").collection("users");
  const user = {
    userName: userName,
  };
  users.findOne(user, async function (err, result) {
    if (err) throw err;
    if (result != null) {
      let tmpArr = result.watchList;
      let newArr = [];
      for (let j = 0; j < tmpArr.length; j++) {
        //delete the movie from watchList
        if (tmpArr[j] != movieName) {
          newArr.push(tmpArr[j]);
        }
      }
      const options = { upsert: true };
      const updateDoc = {
        //set the new watchList
        $set: {
          watchList: newArr,
        },
      };
      let userToUpdate = {
        //user object to update
        userName: userName,
      };
      await users.updateOne(userToUpdate, updateDoc, options); //update
    }
  });
}

/*********************************************************
=================GET/POST handlers========================
**********************************************************/

app.post("/signUp", (req, res) => {
  //req  parameters:  userName and password.isAdmin is false always if the user name is already exist return res = "this user name is not available"
  createUser(req.query.userName, req.query.password, res);
});

app.post("/removeUser", (req, res) => {
  //get the parameters:  adminName, toDelete . adminName - is the user commit the act, toDelete - is the user that need to delere
  removeUser(req.query.adminName, req.query.toDelete, res);
});

app.get("/authenticateUsre", (req, res) => {
  //get the parameters:  userName and password. return Json key: "isExist": value:false/true
  autheticateUser(req.query.userName, req.query.password, res);
});

app.get("/user", (req, res) => {
  //get the parameters:  userName . return Json of the user, if user is not exist return this Json {     key:"userName": value:"this user is not exist" }
  getUser(req.query.userName, res);
});

app.post("/addMovie", (req, res) => {
  //req  parameters:  user name, movieName, description, locations, trailer,duration, director, stars, img,
  //releaseYear, genre. if the movie is already exist return res = "this movie is already exist", case that the user is not admin return none
  addMovie(
    req.query.userName,
    req.query.movieName,
    req.query.description,
    req.query.locations,
    req.query.trailer,
    req.query.duration,
    req.query.director,
    req.query.stars,
    req.query.img,
    req.query.releaseYear,
    req.query.genre,
    res
  );
});

app.post("/updateMovie", (req, res) => {
  //req  parameters:  user name, oldName, newName, description, locations, trailer,duration, director, stars, img,
  //releaseYear, genre. if the movie is already exist return res = "this movie is already exist", case that the user is not admin return none
  updateMovie(
    req.query.userName,
    req.query.oldName,
    req.query.newName,
    req.query.description,
    req.query.locations,
    req.query.trailer,
    req.query.duration,
    req.query.director,
    req.query.stars,
    req.query.img,
    req.query.releaseYear,
    req.query.genre,
    res
  );
});

app.post("/removeMovie", (req, res) => {
  //req  parameters:  userName ,movieName. remove movie
  removeMovie(req.query.userName, req.query.movieName, res);
});

app.get("/searchMovie", (req, res) => {
  /*req  parameters:  movieName, genre, startYear, endYear.
   if the not exist return empty arr, else return arr of movies json.*/
  search(
    req.query.movieName,
    req.query.genre,
    req.query.startYear,
    req.query.endYear,
    res
  );
});

app.get("/allMovies", (req, res) => {
  //req  parameters:  userName
  getAllMovies(req.query.userName, res);
});

app.get("/firstMovies", (req, res) => {
  //req  parameters:  number of the firsts
  getFirstsMovies(req.query.num, res);
});

app.post("/rate", (req, res) => {
  //req  parameters:  movieName, userName, rate
  rate(req.query.movieName, req.query.userName, req.query.rate, res);
});

app.post("/addToWl", (req, res) => {
  //req  parameters:  movieName, userName. if the movie is already exist in the watchList this func do nothing
  addToWatchList(req.query.userName, req.query.movieName);
});

app.post("/removeFromWl", (req, res) => {
  //req  parameters:  movieName, userName. if the movie is exist in the watchList this func remove him, else do nothing
  removeFromWl(req.query.userName, req.query.movieName);
});

app.get("/moviesByGenre", (req, res) => {
  //req  parameters:  genre. if dont find return empty arr
  getMoviesByGenre(req.query.genre, res);
});

app.get("/watchList", (req, res) => {
  //req  parameters:  userName. if dont find return empty arr
  getWatchListByUserName(req.query.userName, res);
});

app.get("/movStatics", (req, res) => {
  //req  parameters:  none. if dont exist movie in genre the res dont contain this genre.
  groupByGenre(res);
});

app.get("/userStatics", (req, res) => {
  //req  parameters:  none. this func return json contains key:date value: count of how many users signs up at
  //everyday last week if at specific day there is 0 signs up this date will not be included at the response json.
  groupBySignupDate(res);
});

app.get("/country", (req, res) => {
  //req  parameters: country.
  getCountry(req.query.country, res);
});
