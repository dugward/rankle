var firebaseConfig = {
  apiKey: "AIzaSyDNG2Skyb72cf9rOdLzXZgE-0CANwTlYXQ",
  authDomain: "rankle-a08ce.firebaseapp.com",
  projectId: "rankle-a08ce",
  storageBucket: "rankle-a08ce.appspot.com",
  messagingSenderId: "187542012455",
  appId: "1:187542012455:web:e53314adca3fe4c32f0402",
  measurementId: "G-P4P06G7JS1",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
var files = db.collection("users");
userDoc = db.collection("users").doc(userID);
var provider = new firebase.auth.GoogleAuthProvider();

//buckets

var userInfo, userID, userName, userDoc, userMarvel, userStarWars;

//The login button
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
  firebase.auth().signInWithRedirect(provider);
});

//The logout button
document.getElementById("logout").addEventListener("click", () => {
  firebase.auth().signOut();
});

//on login thingy happening

firebase.auth().onAuthStateChanged(function (user) {
  //ui changes
  const logout = document.getElementById("logout");
  logout.style.display = "inline";
  loginButton.style.display = "none";
  //grab some user info
  if (user) {
    userInfo = firebase.auth().currentUser;
    userID = userInfo.uid;
    userName = userInfo.displayName;

    console.log(`${userName} signed in`);

    //check if user doc exists

    userDoc.get().then(function (doc) {
      if (doc.exists) {
        userMarvel = doc.data().marvel;
        userStarWars = doc.data().starWars;
      } else {
        //create user doc if not there
        files.doc(userID).set({
          starWars: starWarsMovies,
          marvel: marvelMovies,
          name: userName,
        });
        userMarvel = marvelMovies;
        userStarWars = starWarsMovies;
      }
      marvelUp(userMarvel, "yours");
      starWarsUp(userStarWars, "yours");
      document
        .querySelectorAll(".users")[0]
        .insertAdjacentHTML(
          "afterbegin",
          `<option value="${userName}">${userName}</option>`
        );
      files.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().name != userName) {
            document
              .querySelectorAll(".users")[0]
              .insertAdjacentHTML(
                "beforeend",
                `<option value="${doc.data().name}">${doc.data().name}</option>`
              );
          }
        });
      });
    });
    //ui changes if logged off
  } else {
    console.log("Signed out");
    logout.style.display = "none";
    userMarvel = marvelMovies;
    userStarWars = starWarsMovies;
    marvelUp(userMarvel, "yours");
    starWarsUp(userStarWars, "yours");
    document.querySelectorAll(".users")[0].innerHTML = "";
    document.querySelectorAll(".yours")[0].style.display = "none";
    document
      .querySelectorAll(".users")[0]
      .insertAdjacentHTML("afterbegin", `<option value="you">You?</option>`);
    files.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        document
          .querySelectorAll(".users")[0]
          .insertAdjacentHTML(
            "beforeend",
            `<option value="${doc.data().name}">${doc.data().name}</option>`
          );
      });
    });
    loginButton.style.display = "block";
  }
});

document.querySelectorAll(".users")[0].onchange = () => {
  var val = document.querySelectorAll(".users")[0].value;
  console.log(val);
  if (val == userName) {
    document.querySelectorAll(".yours")[0].style.display = "block";
    document.querySelectorAll(".otheruser")[0].style.display = "none";
    loginButton.style.display = "none";
  } else if (val == "you") {
    document.querySelectorAll(".yours")[0].style.display = "none";
    document.querySelectorAll(".otheruser")[0].style.display = "none";
    loginButton.style.display = "block";
  } else {
    document.querySelectorAll(".yours")[0].style.display = "none";
    loginButton.style.display = "none";
    document.querySelectorAll(".otheruser")[0].style.display = "block";
    //put up the lists for the selected user
    files
      .where("name", "==", val)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const thisMarvel = doc.data().marvel;
          const thisStarWars = doc.data().starWars;
          marvelUp(thisMarvel, "otheruser");
          starWarsUp(thisStarWars, "otheruser");
        });
      });
  }
};

function marvelUp(list, div) {
  document
    .querySelectorAll(`.${div}`)[0]
    .querySelectorAll("#marvel")[0].innerHTML = "";
  var counter = 0;
  list.forEach((el) => {
    counter++;
    document
      .querySelectorAll(`.${div}`)[0]
      .querySelectorAll("#marvel")[0]
      .insertAdjacentHTML(
        "beforeend",
        `<li class="item"><span class="number"></span><span class="title">${el}</span></li>`
      );
  });
  putNumbers();
}

function starWarsUp(list, div) {
  document
    .querySelectorAll(`.${div}`)[0]
    .querySelectorAll("#starwars")[0].innerHTML = "";
  var counter = 0;
  list.forEach((el) => {
    counter++;
    document
      .querySelectorAll(`.${div}`)[0]
      .querySelectorAll("#starwars")[0]
      .insertAdjacentHTML(
        "beforeend",
        `<li class="item"><span class="number"></span><span class="title">${el}</span></li>`
      );
  });
  putNumbers();
}

function putNumbers() {
  const uls = document.querySelectorAll("ul");
  uls.forEach((list) => {
    const lis = list.querySelectorAll("li");
    var counter = 0;
    lis.forEach((li) => {
      counter++;
      if (
        li.classList.contains("draggable-mirror") == false &&
        li.classList.contains("draggable--original") == false
      ) {
        li.querySelectorAll("span")[0].innerText = `${counter}`;
      }
    });
  });
}

const marvelMovies = [
  "Iron Man",
  "The Incredible Hulk",
  "Iron Man 2",
  "Thor",
  "Captain America: First Avenger",
  "Marvel's The Avengers",
  "Iron Man 3",
  "Thor: The Dark World",
  "Captain America: Winter Soldier",
  "Guardians of the Galaxy",
  "Avengers: Age of Ultron",
  "Ant-Man",
  "Captain America: Civil War",
  "Doctor Strange",
  "Guardians of the Galaxy Vol. 2",
  "Spider-Man: Homecoming",
  "Thor: Ragnarok",
  "Black Panther",
  "Avengers: Infinity War",
  "Ant-Man and the Wasp",
  "Captain Marvel",
  "Avengers: Endgame",
  "Spider-Man: Far From Home",
  "Black Widow",
  "Shang-Chi",
  "Eternals",
  "Spider-Man: No Way Home",
];

const starWarsMovies = [
  "IV A New Hope",
  "V The Empire Strikes Back",
  "VI Return of the Jedi",
  "I The Phantom Menace",
  "II Attack of the Clones",
  "III Revenge of the Sith",
  "VII The Force Awakens",
  "VIII The Last Jedi",
  "IX The Rise of Skywalker",
  "Rogue One",
  "Solo",
];

const marvelsortable = new Draggable.Sortable(
  document.getElementById("marvel"),
  {
    draggable: "li",
    mirror: {
      constrainDimensions: true,
    },
  }
);

const starWarssortable = new Draggable.Sortable(
  document.getElementById("starwars"),
  {
    draggable: "li",
    mirror: {
      constrainDimensions: true,
    },
  }
);

marvelsortable.on("sortable:stop", () => {
  console.log("sortable:stop");
  userMarvel = [];
  const kids = document.getElementById("marvel").querySelectorAll("li");
  kids.forEach((el) => {
    if (
      el.classList.contains("draggable-mirror") == false &&
      el.classList.contains("draggable--original") == false
    ) {
      const title = el.querySelectorAll(".title")[0];
      userMarvel.push(title.innerText);
    }
  });

  console.log(userMarvel);
  if (userID != undefined) {
    db.collection("users")
      .doc(userID)
      .update({
        marvel: userMarvel,
      })
      .then(() => {
        putNumbers();
      });
  }
});

starWarssortable.on("sortable:stop", () => {
  console.log("sortable:stop");
  userStarWars = [];
  const kids = document.getElementById("starwars").querySelectorAll("li");
  kids.forEach((el) => {
    if (
      el.classList.contains("draggable-mirror") == false &&
      el.classList.contains("draggable--original") == false
    ) {
      const title = el.querySelectorAll(".title")[0];
      userStarWars.push(title.innerText);
    }
  });
  console.log(userStarWars);
  if (userID != undefined) {
    db.collection("users")
      .doc(userID)
      .update({
        starWars: userStarWars,
      })
      .then(() => {
        putNumbers();
      });
  }
});

const selects = document.querySelectorAll(".listItem");
selects.forEach((el) => {
  el.addEventListener("click", () => {
    if (el.classList.contains("clicked") != true) {
      document.querySelectorAll(".clicked")[0].classList.remove("clicked");
      el.classList.add("clicked");
      document.querySelectorAll(".list").forEach((el) => {
        el.style.display = "none";
      });
      var thisList = document.querySelectorAll(`#${el.classList[0]}`);
      thisList.forEach((el) => {
        el.style.display = "block";
      });
    }
  });
});
