let recipes = [];
let cuisines = new Set();

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

    function filterRecipes() {
      const nameFilter = document.getElementById("name").value.toLowerCase();
      const cuisineFilter = document.getElementById("cuisine").value;
      const difficultyFilter = document.getElementById("difficulty").value;
      const prepTimeFilter = parseInt(
        document.getElementById("preparationTime").value,
      );

      const filteredRecipes = recipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(nameFilter) &&
          (recipe.cuisine === cuisineFilter || cuisineFilter === "") &&
          (recipe.difficulty === difficultyFilter || difficultyFilter === "") &&
          (recipe.preparationTime <= prepTimeFilter || isNaN(prepTimeFilter))
        );
      });

      document.querySelector("tbody").innerHTML = "";
      drawTable(filteredRecipes);
    }

    function resetFilters() {
      document.getElementById("name").value = "";
      document.getElementById("cuisine").value = "";
      document.getElementById("difficulty").value = "";
      document.getElementById("preparationTime").value = "";
      drawTable(recipes);
    }

    function drawTable(recipes) {
      document.querySelector("tbody").innerHTML = "";
      recipes.forEach(
        (recipe) => {
          const row = document.createElement("tr");

          const nameCell = document.createElement("td");
          nameCell.textContent = recipe.name;
          row.appendChild(nameCell);

          const cuisineCell = document.createElement("td");
          cuisineCell.textContent = recipe.cuisine;
          row.appendChild(cuisineCell);

          cuisines.add(recipe.cuisine);

          const difficultyCell = document.createElement("td");
          difficultyCell.textContent = recipe.difficulty;
          row.appendChild(difficultyCell);

          const prepTimeCell = document.createElement("td");
          prepTimeCell.textContent = recipe.preparationTime;
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
