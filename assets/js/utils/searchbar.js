import { hideAndShowSortedCards } from "./utils.js";

function searchBar(dropModel) {
    const searchBar = document.querySelector("#filterBar input");

    function search(e) {
        const recipesFiltered = dropModel.getFilteredRecipes();
        const searchChar = e.currentTarget.value;
        const result = [];

        if (searchChar.length >= 3) {
            for (let i = 0; i < recipesFiltered.length; i++) {
                if (recipesFiltered[i].name.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1) {
                    result.push(recipesFiltered[i]);
                }
                else {
                    if (recipesFiltered[i].description.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1) {
                        result.push(recipesFiltered[i]);
                    }
                    else {
                        for (let e = 0; e < recipesFiltered[i].ingredients.length; e++) {
                            if (recipesFiltered[i].ingredients[e].ingredient.toLowerCase().indexOf(searchChar.toLowerCase()) !== -1) {
                                result.push(recipesFiltered[i]);
                            }
                        }
                    }
                }
            }

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