$().ready(() => {
  $(".loading-screen").fadeOut(500);
  $("body").css("overflow", "visible");

  // add regex method to jquery validate
  $.validator.addMethod(
    "regex",
    function (value, element, regexp) {
      var re = new RegExp(regexp);
      return this.optional(element) || re.test(value);
    },
    "Please check your input."
  );

  searchByName("").then(() => {});
});

$("#sideMenuButton").on("click", toggleSideMenu);
function toggleSideMenu() {
  if ($("#sideMenuButton").hasClass("fa-align-justify")) {
    $(".side-menu").animate({ left: 0 }, 500);
    $("#sideMenuButton").removeClass("fa-align-justify");
    $("#sideMenuButton").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
      $(".links-list li")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + 5) * 100
        );
    }
  } else {
    let menuWidth = $(".menu-body").outerWidth();

    $(".side-menu").animate({ left: -menuWidth }, 500);
    $("#sideMenuButton").addClass("fa-align-justify");
    $("#sideMenuButton").removeClass("fa-x");

    $(".links-list li").animate(
      {
        top: 300,
      },
      500
    );
  }
}

$(".links-list li").on("click", toggleSideMenu);

function showSearchInputs() {
  $("#searchContainer").html(`
    <div class="container-fluid">
      <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control" type="text" placeholder="Search By First Letter">
        </div>
    </div>
    </div>
    `);
  $(".data").html("");
}

async function searchByName(term) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  response = await response.json();

  response.meals ? showMeals(response.meals) : showMeals([]);
  $(".loading-screen").fadeOut(300);
}

async function searchByFLetter(term) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  term == "" ? (term = "a") : "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
  response = await response.json();

  response.meals ? showMeals(response.meals) : showMeals([]);
  $(".loading-screen").fadeOut(300);
}
/*  */
function showMeals(meals) {
  $(".data").html("");
  if (meals.length > 20) {
    meals = meals.slice(0, 20);
  }
  meals.forEach((meal) => {
    let mealElement = $("<div/>", {
      class: "col-lg-3 p-3",
      html: `
        <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${meal.strMeal}</h3>
            </div>
        </div>
      `,
      appendTo: $(".data"),
    });
  });
}

async function loadCategories() {
  $(".loading-screen").fadeIn(300);
  $("#searchContainer").html("");

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  response = await response.json();

  showCategories(response.categories);
  $(".loading-screen").fadeOut(300);
}

function showCategories(categories) {
  $(".data").html("");
  categories.forEach((category) => {
    let categoryElement = $("<div/>", {
      class: "col-lg-3 p-3",
      html: `
        <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category.strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category.strCategory}</h3>
                        <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
      `,
      appendTo: $(".data"),
    });
  });
}

async function loadArea() {
  $(".loading-screen").fadeIn(300);
  $("#searchContainer").html("");

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  response = await response.json();

  showAreas(response.meals);
  $(".loading-screen").fadeOut(300);
}

function showAreas(areas) {
  $(".data").html("");
  console.log(areas);
  areas.forEach((area) => {
    let categoryElement = $("<div/>", {
      class: "col-lg-3 p-3",
      html: `
        <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area.strArea}</h3>
                </div>
      `,
      appendTo: $(".data"),
    });
  });
}

async function loadIngredients() {
  $(".loading-screen").fadeIn(300);
  $("#searchContainer").html("");

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  response = await response.json();

  showIngredients(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

function showIngredients(ingredients) {
  $(".data").html("");
  ingredients.forEach((ingredient) => {
    let categoryElement = $("<div/>", {
      class: "col-lg-3 p-3",
      html: `
          <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                  <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                  <h3>${ingredient.strIngredient}</h3>
                  <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
          </div>
      `,
      appendTo: $(".data"),
    });
  });
}

function showContacts() {
  $("#searchContainer").html("");
  $(".data").html(`
  <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <form id="contactForm">
          <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" name="name" type="text" class="form-control" placeholder="Enter Your Name">
            </div>
            <div class="col-md-6">
                <input id="emailInput" name="email" type="email" class="form-control " placeholder="Enter Your Email">
            </div>
            <div class="col-md-6">
                <input id="phoneInput" name="phone" type="text" class="form-control " placeholder="Enter Your Phone">
            </div>
            <div class="col-md-6">
                <input id="ageInput" name="age" type="number" class="form-control " placeholder="Enter Your Age">
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" name="password" type="password" class="form-control " placeholder="Enter Your Password">
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" name="rePassword" type="password" class="form-control " placeholder="Repassword">
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </form>
    </div>
  </div> `);

  $("#contactForm").validate({
    rules: {
      name: {
        required: true,
        regex: /^[a-zA-Z ]+$/,
      },
      email: {
        required: true,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      },
      phone: {
        required: true,
        regex: /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/,
      },
      age: {
        required: true,
        regex: /^(0?[1-9]|[1-9][0-9]|100)$/,
      },
      password: {
        required: true,
        regex: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
      },
      rePassword: {
        required: true,
        equalTo: "#passwordInput",
      },
    },
    messages: {
      name: {
        required: "please enter your name",
        regex: "Name cannot have special characters",
      },
      email: {
        required: "please enter your email",
        regex: "Please enter a valid email address",
      },
      phone: {
        required: "please enter your phone",
        regex: "please enter correct phone number",
      },
      age: {
        required: "please enter your age",
        regex: "please enter correct age (0-100)",
      },
      password: {
        required: "please enter password",
        regex: "password should contain Minimum eight characters, at least one letter and one number",
      },
      rePassword: {
        required: "please enter password",
        equalTo: "password does not match",
      },
    },
  });

  $("#contactForm").on("change", function () {
    if ($(this).valid()) {
      $("#submitBtn").attr("disabled", false);
    } else {
      $("#submitBtn").attr("disabled", true);
    }
  });

  $("#submitBtn").click(function (event) {
    event.preventDefault();
  });
}

async function getCategoryMeals(category) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  response = await response.json();

  showMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getAreaMeals(area) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  response = await response.json();

  showMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getIngredientsMeals(ingredients) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  response = await response.json();

  showMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getMealDetails(mealID) {
  $(".data").html("");
  $(".loading-screen").fadeIn(300);

  $("#searchContainer").html("");
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealDetails(respone.meals[0]);
  $(".loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
  $("#searchContainer").html("");

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  // let tags = meal.strTags.split(",")
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let mealContent = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success me-3">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  $(".data").html(mealContent);
}
