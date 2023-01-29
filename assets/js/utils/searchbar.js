import { displayDropdowns } from "./dropdown.js";
import { createEl, hideAndShowSortedCards } from "./utils.js";

function searchBar(recipes, dropdows) {
    const searchBar = document.querySelector("#filterBar input");
    const header = document.querySelector("header");
    const tags = [];

    let filteredRecipes = recipes;
    let inputCount = 0;

    const dropdown = displayDropdownNav();
    
    function search(e) {
        let recipesFiltered = (tags.length > 0) ? dropdown.dropdownModel.filterRecipedFromTags(recipes, tags) : filteredRecipes;
        const searchChar = e.currentTarget.value;

        inputCount = searchChar.length;
        
        if (searchChar.length >= 3) {
            const result = recipesFiltered.filter(e => 
                e.name.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1 ||
                e.description.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1 ||
                e.ingredients.filter(i => i.ingredient.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1).length > 0
            );

            hideAndShowSortedCards(result);

            dropdown.dropdownModel.hideAndShowSortedTags(result);
            
            filteredRecipes = result;
        }
        else {
            filteredRecipes = (tags.length > 0) ? dropdown.dropdownModel.filterRecipedFromTags(recipes, tags) : recipes;
            
            hideAndShowSortedCards(filteredRecipes);
            
            dropdown.dropdownModel.hideAndShowSortedTags(filteredRecipes);
        }
    }

    function getRecipes() {
        return (tags.length > 0 || inputCount >=3) ? filteredRecipes : recipes;
    }

    function displayDropdownNav() {
        const dropdownsNav = createEl(["dropdowns-nav", "d-flex", "flex-column", "flex-md-row"]);
        const tagsContainer = createEl(["dropdowns-tags", "w-100"]);

        const dropdownModel = displayDropdowns(dropdownsNav, tagsContainer, tags, filteredRecipes, dropdows, getRecipes);

        // displaying dropdowns
        dropdows.forEach(d => {
            const dropdown = dropdownModel.displayDropdown(d);
            
            d["parent"] = dropdown.querySelector(".dropdown-options ul");

            dropdownsNav.appendChild(dropdown);
        });

        header.appendChild(tagsContainer);
        header.appendChild(dropdownsNav);

        return { dropdownModel };
    }

    searchBar.addEventListener("input", search);

    return recipes;
}

export { searchBar };