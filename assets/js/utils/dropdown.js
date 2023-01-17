import { getAllAppliances, getAllIngredients, getAllUstensils } from "../index.js";
import { createButton, createEl, createInput, hideAndShowSortedCards, strFirstUpp } from "./utils.js";

function displayDropdowns(dropdownsNav, tagsContainer, tags, recipes, dropdows) {
    let filteredRecipes = recipes;
    const maxOptions = 30;

    function addTag(e, type, data, color) {
        const curr = e.currentTarget;
        const currValue = curr.innerText.toLowerCase();

        if (data.indexOf(currValue) != -1 && tags.findIndex(e => e.value === currValue) == -1) {
            const buttonIcon = createEl(["fa-regular", "fa-circle-xmark"], undefined, undefined, "i");
            const button = createButton(["mb-3", "btn"], {"background-color": color}, strFirstUpp(currValue), buttonIcon);

            tagsContainer.appendChild(button);

            tags.push({ type: type, value: currValue });
            
            function removeThisButton(e) {
                tags.forEach((tag, i) => {
                    if (currValue === tag.value) {
                        tags.splice(i, 1);

                        button.remove();

                        filteredRecipes = filterRecipedFromTags(recipes, tags);

                        hideAndShowSortedTags(filteredRecipes);
                        hideAndShowSortedCards(filteredRecipes);

                        e.target.style.display = "inline-flex";
                        e.target.classList.remove("tag-active");
                    }
                });
            }

            e.target.classList.add("tag-active");

            filteredRecipes = filterRecipedFromTags(recipes, tags);

            hideAndShowSortedTags(filteredRecipes);
            hideAndShowSortedCards(filteredRecipes);
            
            button.addEventListener("click", () => removeThisButton(e));
        }
    }

    function hideAndShowSortedTags(filteredRecipes) {
        dropdows.forEach(dropdow => {
            const allTagsElement = dropdow.parent.querySelectorAll("li");
            
            if (dropdow.type === "appliance") {
                const appliances = getAllAppliances(filteredRecipes);

                tagsLoop(allTagsElement, appliances);

                hideAndShowTagMessage(dropdow.parent, allTagsElement);
            }

            if (dropdow.type === "ingredients") {
                const ingredients = getAllIngredients(filteredRecipes);

                tagsLoop(allTagsElement, ingredients);

                hideAndShowTagMessage(dropdow.parent, allTagsElement);
            }

            if (dropdow.type === "ustensils") {
                const ustensils = getAllUstensils(filteredRecipes);

                tagsLoop(allTagsElement, ustensils);

                hideAndShowTagMessage(dropdow.parent, allTagsElement);
            }
        });


        function tagsLoop(allTagsElement, array) {
            allTagsElement.forEach((tagElement, i) => {
                if (!array.includes(tagElement.innerText.toLowerCase()) || tagElement.classList.contains("tag-active") || i >= maxOptions) {
                    tagElement.style.display = "none";
                }
                else {
                    tagElement.style.display = "inline-flex";
                }
            });
        }
    }

    function hideAndShowTagMessage(ulElement, allTagsElement) {
        const allTagsElementShow = [...allTagsElement].filter(e => window.getComputedStyle(e).display !== "none").length;
        const tagMsgElement = ulElement.parentNode.querySelector(".dropdown-msg");

        if (allTagsElementShow > 0 && tagMsgElement.style.display !== "none") {
            tagMsgElement.style.display = "none";
        }

        if (allTagsElementShow == 0 && tagMsgElement.style.display === "none") {
            tagMsgElement.style.display = "block";
        }
    }

    function getFilteredRecipes() {
        return filteredRecipes;
    }

    function filterRecipedFromTags(recipes, tags) {
        let filteredRecipes = recipes;
        
        tags.forEach(tag => {
            filteredRecipes = filterRecipedFromTag(filteredRecipes, tag);
        });

        function filterRecipedFromTag(recipes, tag) {
            return recipes.filter(e =>
                tag.type === "appliance" && e.appliance.toLowerCase() === tag.value ||
                tag.type === "ingredients" && e.ingredients.some(d => d.ingredient.toLowerCase() === tag.value.toLowerCase()) ||
                tag.type === "ustensils" && e.ustensils.some(d => d.toLowerCase() === tag.value.toLowerCase())
            );
        }

        return filteredRecipes;
    }

    function displayDropdown({ name, type, data, color }) {
        const dropdownContainer = createEl(["dropdown-container"]);
        const activeDropdown = createEl(["dropdown-active"], {"background-color": color});
        const activeDropdownEl = createEl(undefined, undefined, name);
        const activeDropdownSearch = createInput(["form-control", "input-search"], {"display": "none"}, undefined, `Rechercher un ${name.toLowerCase()}`);
        const arrowDropdown = createEl(["fa-solid", "fa-chevron-down"], undefined, undefined, "span");
        const optionsDropdown = createEl(["dropdown-options", "row"], {"background-color": color});
        const optionsMsg = createEl(["dropdown-msg"], {"display": "none"}, "Il n'y a plus de tags disponible.");
        const optionsList = createEl(["dropdown-option"], undefined, undefined, "ul");
        

        const tags = data.map((el, i) => {
            const option = createEl(["dropdown-option"], undefined, strFirstUpp(el), "li");
            
            option.addEventListener("click", (e) => addTag(e, type, data, color));

            (i >= maxOptions) ? option.style.display = "none" : "";
            
            optionsList.appendChild(option); 
            
            return option;
        });

        // setting option container height to fit content
        // optionsList.style.height = data.length > 10 ? `${10 * 1.85}rem` : `${data.length * 1.85}rem`;
        setOptionsHeight(data.length);

        dropdownContainer.appendChild(activeDropdown);
        activeDropdown.appendChild(activeDropdownEl);
        activeDropdown.appendChild(activeDropdownSearch);
        activeDropdown.appendChild(arrowDropdown);
        dropdownContainer.appendChild(optionsDropdown);
        optionsDropdown.appendChild(optionsMsg);
        optionsDropdown.appendChild(optionsList);

        function closeDropdowns() {
            const containerOpened = document.querySelectorAll(".dropdown-opened")

            containerOpened.forEach(e => {
                e.querySelector(".dropdown-options").style.height = "0";
                e.querySelector(".dropdown-active > div").style.display = "block";
                e.querySelector(".dropdown-active > input").style.display = "none";

                e.classList.remove("dropdown-opened");
            });
        }

        // hide/show tags when input match
        function searchTags(e) {
            e.stopPropagation();

            const currentSearch = e.currentTarget.value;

            tags.forEach((el, i) => {
                if (el.innerText.toLowerCase().indexOf(currentSearch.toLowerCase()) === -1) {
                    el.style.display = "none";
                }
                else {
                    (i >= maxOptions) ? el.style.display = "none" : el.style.display = "block";
                }
            });
        }

        activeDropdown.addEventListener("click", async (e) => {
            e.stopPropagation();

            const containerOpened = document.querySelectorAll(".dropdown-opened");

            // on click if contain class opened => close
            if (dropdownContainer.classList.contains("dropdown-opened")) {
                // setting the height to 0 and removing the class after 1s(= css transition value)
                optionsDropdown.style.height = "0";
                activeDropdownEl.style.display = "block";
                activeDropdownSearch.style.display = "none";

                setTimeout(() => {
                    dropdownContainer.classList.remove("dropdown-opened");
                }, 1000);
            }
            else {
                // closing every other dropdown
                containerOpened.forEach(el => {
                    el.querySelector(".dropdown-options").style.height = "0";
                    el.querySelector(".dropdown-active > div").style.display = "block";
                    el.querySelector(".dropdown-active > input").style.display = "none";

                    el.classList.remove("dropdown-opened");
                });

                // open the selected dropdown
                dropdownContainer.classList.add("dropdown-opened");

                activeDropdownEl.style.display = "none";
                activeDropdownSearch.style.display = "block";

                // return the dropdown container full width 
                const dropdownContainerMaxWidth = await (() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            return resolve(dropdownContainer.offsetWidth)
                        }, (dropdownContainer.offsetWidth < dropdownsNav.offsetWidth) ? 1000 : 0);
                    });
                })();
    
                // setting the options height if container width == options width 
                if (optionsDropdown.offsetWidth == dropdownContainerMaxWidth) {
                    const tagMsg = optionsDropdown.querySelector(".dropdown-msg");
                    const firstChild = optionsDropdown.querySelector("ul");
                    const allTagsShowed = [...firstChild.querySelectorAll("li")].filter(tag => getComputedStyle(tag).display !== "none").length;

                    setOptionsHeight(allTagsShowed);

                    if (allTagsShowed > 0) {
                        optionsDropdown.style.height = `${32 + firstChild.offsetHeight}px`;
                    }
                    else {
                        optionsDropdown.style.height = `${32 + tagMsg.offsetHeight}px`;
                    }
                }
            }
        });

        function setOptionsHeight(length) {
            optionsList.style.height = length > 10 ? `${10 * 1.85}rem` : `${length * 1.85}rem`;
        }

        activeDropdownSearch.addEventListener("click", (e) => e.stopPropagation());
        activeDropdownSearch.addEventListener("input", searchTags);

        document.addEventListener("scroll", closeDropdowns);
        document.addEventListener("click", closeDropdowns);

        return dropdownContainer;
    }

    return { displayDropdown, tags, getFilteredRecipes };
}

export { displayDropdowns };