import { hideAndShowSortedCards } from "./utils.js";

function searchBar(dropModel) {
    const searchBar = document.querySelector("#filterBar input");

    function search(e) {
        const recipesFiltered = dropModel.getFilteredRecipes();
        const searchChar = e.currentTarget.value;

        if (searchChar.length >= 3) {
            const result = recipesFiltered.filter(e => 
                e.name.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1 ||
                e.description.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1 ||
                e.ingredients.filter(i => i.ingredient.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1).length > 0
            );

            hideAndShowSortedCards(result);
        }
        else {
            hideAndShowSortedCards(dropModel.getFilteredRecipes());
        }
    }

    searchBar.addEventListener("input", search);

    return searchBar;
}

export { searchBar };