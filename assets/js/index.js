import { recipes } from "./data/recipes.js";
import { displayDropdowns } from "./utils/dropdown.js";
import { recipeFactory } from "./factories/recipe.js";
import { searchBar } from "./utils/searchbar.js";
import { createEl } from "./utils/utils.js";

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

function displayDropdownNav(color) {
    const dropdownsNav = createEl(["dropdowns-nav", "d-flex", "flex-column", "flex-md-row"]);
    const tagsContainer = createEl(["dropdowns-tags", "w-100"]);
    const tags = [];

    const dropdows = [
        { name: "Ingredients", type: "ingredients", data: getAllIngredients(recipes), color: color.blue },
        { name: "Appareils", type: "appliance", data: getAllAppliances(recipes), color: color.green },
        { name: "Ustensiles", type: "ustensils", data: getAllUstensils(recipes), color: color.red }
    ];

    const dropdownModel = displayDropdowns(dropdownsNav, tagsContainer, tags, recipes, dropdows);

    // displaying dropdowns
    dropdows.forEach(d => {
        const dropdown = dropdownModel.displayDropdown(d);
        d["parent"] = dropdown.querySelector(".dropdown-options ul");

        dropdownsNav.appendChild(dropdown);
    });

    return { tagsContainer, dropdownsNav, tags, dropdownModel };
}


// initialize function
(() => {
    const header = document.querySelector("header");
    const color = { blue: "#3282f7",  green: "#68d9a4",  red: "#ed6454" }

    // header
    const dropdown = displayDropdownNav(color);

    header.appendChild(dropdown.tagsContainer);
    header.appendChild(dropdown.dropdownsNav);
    
    // main
    displayData(recipes);

    searchBar(dropdown.dropdownModel, dropdown.tags);
})();


export {
    getAllIngredients,
    getAllAppliances,
    getAllUstensils
}