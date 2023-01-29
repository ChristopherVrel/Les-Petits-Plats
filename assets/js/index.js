import { recipes } from "./data/recipes.js";
import { recipeFactory } from "./factories/recipe.js";
import { searchBar } from "./utils/searchbar.js";

function getAllIngredients(recipes) {
    return recipes
        .map(recipe => recipe.ingredients.map(d => d.ingredient.toLowerCase()))
        .reduce((prev, current) => [...prev, ...current.filter(e => !prev.includes(e.toLowerCase()))]);
}

function getAllAppliances(recipes) {
    return recipes
        .map(recipe => [recipe.appliance.toLowerCase()])
        .reduce((prev, current) => (prev.includes(...current)) ? prev : [...prev, ...current]);
}

function getAllUstensils(recipes) {
    return recipes
        .map(recipe => recipe.ustensils.map(ustensil => ustensil.toLowerCase()))
        .reduce((prev, current) => [...prev, ...current.filter(e => !prev.includes(e.toLowerCase()))]);
}

async function displayData(recipes) {
    const mainSection = document.getElementById("main");

    recipes.forEach(recipe => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();

        mainSection.appendChild(recipeCardDOM);
    });
}

// initialize function
(() => {
    const color = { blue: "#3282f7",  green: "#68d9a4",  red: "#ed6454" };
    
    const dropdows = [
        { name: "Ingredients", type: "ingredients", data: (recipes.length > 0) ? getAllIngredients(recipes) : [], color: color.blue },
        { name: "Appareils", type: "appliance", data: (recipes.length > 0) ? getAllAppliances(recipes) : [], color: color.green },
        { name: "Ustensiles", type: "ustensils", data: (recipes.length > 0) ? getAllUstensils(recipes) : [], color: color.red }
    ];

    const filteredRecipes = searchBar(recipes, dropdows);

    displayData(filteredRecipes);
})();


export {
    getAllIngredients,
    getAllAppliances,
    getAllUstensils
}