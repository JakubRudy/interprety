let recipes = [];
let cuisines = new Set();
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

fetch("https://dummyjson.com/recipes/tags")
  .then((res) => res.json())
  .then((tags) => {
    const tagSelect = document.getElementById("tag");
    tags.forEach((tag) => {
      tagSelect.appendChild(new Option(tag, tag));
    });
  });

fetch("https://dummyjson.com/recipes")
  .then((response) => response.json())
  .then((data) => {
    recipes = data.recipes;
    drawTable(recipes);

    const cuisineSelect = document.getElementById("cuisine");

    cuisines.forEach((cuisineName) => {
      const newOption = new Option(cuisineName, cuisineName);
      cuisineSelect.appendChild(newOption);
    });

    addEventListener("input", filterRecipes);
    addEventListener("change", filterRecipes);

    addEventListener("reset", resetFilters);

    document.getElementById("tag").addEventListener("change", (e) => {
      const selectedTag = e.target.value;
      const url = selectedTag
        ? `https://dummyjson.com/recipes/tag/${selectedTag}`
        : "https://dummyjson.com/recipes";

      fetch(url)
        .then((res) => res.json())
        .then((newData) => {
          recipes = newData.recipes;
          filterRecipes();
        });
    });


    function filterRecipes() {
      const nameFilter = document.getElementById("name").value.toLowerCase();
      const cuisineFilter = document.getElementById("cuisine").value;
      const difficultyFilter = document.getElementById("difficulty").value;
      const prepTimeFilter = parseInt(
        document.getElementById("preparationTime").value,
      );

      document.getElementById("timeValue").textContent = prepTimeFilter;

      const filteredRecipes = recipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(nameFilter) &&
          (recipe.cuisine === cuisineFilter || cuisineFilter === "") &&
          (recipe.difficulty === difficultyFilter || difficultyFilter === "") &&
          (recipe.prepTimeMinutes <= prepTimeFilter || isNaN(prepTimeFilter))
        );
      });

      document.querySelector("tbody").innerHTML = "";
      drawTable(filteredRecipes);
    }

    function resetFilters() {
      document.getElementById("name").value = "";
      document.getElementById("cuisine").value = "";
      document.getElementById("difficulty").value = "";
      document.getElementById("preparationTime").value = 60;
      document.getElementById("timeValue").textContent = 60;
      document.getElementById("tag").value = "";

      fetch("https://dummyjson.com/recipes")
        .then((res) => res.json())
        .then((newData) => {
          recipes = newData.recipes;
          drawTable(recipes);
        });
    }

    function drawTable(recipes) {
      document.querySelector("tbody").innerHTML = "";
      recipes.forEach(
        (recipe) => {
          const row = document.createElement("tr");

          if (favorites.includes(recipe.id)) {
            row.classList.add("table-warning");
          }
          row.addEventListener("click", () => {
            if (favorites.includes(recipe.id)) {
              favorites = favorites.filter((id) => id !== recipe.id);
              row.classList.remove("table-warning");
            } else {
              favorites.push(recipe.id);
              row.classList.add("table-warning");
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
          });

          const nameCell = document.createElement("td");
          nameCell.textContent = recipe.name;
          nameCell.style.cursor = "pointer";

          nameCell.addEventListener("click", (e) => {
            e.stopPropagation();
            alert(
              "Ingredients:\n" +
                recipe.ingredients.join(", ") +
                "\n\nInstructions:\n" +
                recipe.instructions.join(" "),
            );
          });




          row.appendChild(nameCell);

          const cuisineCell = document.createElement("td");
          cuisineCell.textContent = recipe.cuisine;
          row.appendChild(cuisineCell);

          cuisines.add(recipe.cuisine);

          const difficultyCell = document.createElement("td");
          difficultyCell.textContent = recipe.difficulty;
          row.appendChild(difficultyCell);

          const prepTimeCell = document.createElement("td");
          prepTimeCell.textContent = recipe.prepTimeMinutes;
          row.appendChild(prepTimeCell);

          const ratingCell = document.createElement("td");
          ratingCell.textContent = recipe.rating;
          row.appendChild(ratingCell);

          document.querySelector("tbody").appendChild(row);
        },
        (document.getElementById("recipeCount").textContent = recipes.length),
      );
    }

    document.getElementById("apiData").textContent = JSON.stringify(
      data,
      null,
      2,
    );
  });
