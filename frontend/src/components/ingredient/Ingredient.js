import React, { useState, useEffect } from "react";
import Recipe from "../recipe/Recipe";
import AllRecipes from "../allRecipes/AllRecipes";
import Spinner from "../spinner/spinner";
import IngredientList from "../ingredientList/IngredientList";

const Ingredient = ({ navigate }) => {
  const [checked, setChecked] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [searchIngredients, setSearchIngredients] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unchecked, setUnchecked] = useState(true);

  const getRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/recipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetIngredients: searchIngredients,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (!Array.isArray(data.result)) {
        throw new Error("Data is not an array");
      }

      await setMatchedRecipes(data.result);
      console.log(matchedRecipes);
      setLoading(false);
      setSearchIngredients([]);
      setChecked([]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleCheck = (event) => {
    let updatedList = [...checked];
    let lowerCaseList = [...searchIngredients];

    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
      lowerCaseList = [...searchIngredients, event.target.value.toLowerCase()];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
    setSearchIngredients(lowerCaseList);
  };

  const handleUncheckAll = () => {
    setChecked([]);
    setCollapse(false);
    setUnchecked(true);
  };

  let checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  let isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (checked.length === 0) {
      throw "No Items Checked";
    } else {
      getRecipes();

      setCollapse(true);
      setUnchecked(false);
    }
  };

  const onclick = () => {
    setCollapse(!collapse);
  };
  return (
    <div className="bg-cover bg-scroll h-screen bg-background-body">
      <div className="bg-orange-200 ml-10 mr-10 rounded-lg">
        <div className="recipe-generator"></div>
        <div
          className="ingredient-header"
          class="mt-16 mb-8 flex justify-center text-2xl font-bold"
        >
          <div className="mt-5 ml-5">
            <h1 class="mx-auto text-orange-600">Ingredients</h1>
          </div>
          <p class="ml-auto" style={{ cursor: "pointer" }} onClick={onclick}>
            {" "}
            {collapse ? "+" : "-"}{" "}
          </p>
        </div>
        <div
          className="list-container"
          style={{
            height: collapse ? "0px" : "200px",
            transition: "height 0.5s ease-in",
          }}
          class={
            collapse
              ? "flex grid grid-flow-col grid-rows-5 gap-4 truncate pl-4 font-bold"
              : "flex grid grid-flow-col grid-rows-5 gap-4 pl-4 font-bold"
          }
        >
          {IngredientList.map((item, index) => (
            <div key={index} className="flex items-center">
              <input
                value={item}
                type="checkbox"
                onChange={handleCheck}
                checked={checked.includes(item)}
                class="mr-2"
              />
              <span className={isChecked(item)}>{item}</span>
            </div>
          ))}

          <div />
        </div>
        <div className="mt-5 mb-4 flex gap-10">
          <div>
            <div className="ml-5">{`Items checked are: ${checkedItems}`}</div>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="w-40 ml-5 mb-5 mr-5 rounded-md w-1/2 bg-orange-600 py-2 px-3 text-sm font-semibold text-white shadow hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 eatgpt-2"
            onClick={handleUncheckAll}
          >
            Uncheck All
          </button>
          <button
            type="submit"
            class="w-40 mb-5 rounded-md w-1/2 bg-orange-600 py-2 px-3 text-sm font-semibold text-white shadow hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 eatgpt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {loading === true && <Spinner></Spinner>}
        </div>

        <div>
          {matchedRecipes.length > 0 && unchecked === false && (
            <div
              className="matched-recipes"
              data-cy="matched-recipes"
              class=" grid-auto-rows mt-4 grid"
            >
              <h2 className="flex justify-center text-2xl font-bold">
                Matched Recipes
              </h2>
              <AllRecipes recipes={matchedRecipes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ingredient;
// const FetchData = () => {
//   setLoading(true);
//   fetch(
//     "https://westeurope.azure.data.mongodb-api.com/app/recipe_api-eixns/endpoint/recipes"
//   )
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       const result = JSON.parse(JSON.stringify(data));
//       setChecked(
//         checked.map((str) => {
//           return str.toLowerCase();
//         })
//       );
//       const rec = result.filter((recipe) => {
//         return searchIngredients.every((ingredient) =>
//           recipe.Ingredients.includes(ingredient)
//         );
//       });
//       setLoading(false);
//       setMatchedRecipes(rec);
//       setSearchIngredients([]);
//       setChecked([]);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// }
