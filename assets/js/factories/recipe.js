import { createEl } from "../utils/utils.js";

function recipeFactory(data) {
    const { id, description, name, time, ingredients } = data;

    function getRecipeCardDOM() {
        const divContainer = createEl(["d-flex", "col-12", "col-md-6", "col-lg-4"]);
        const article = createEl(["article", "card"], undefined, undefined, "article", {"data-id": id});
        const imgContainer = createEl(["card-img-placeholder"]);
        const cardBody = createEl(["card-body"]);
        const cardTitleContainer = createEl(["d-flex", "justify-content-between", "mb-4"]);
        const cardTitle = createEl(["card-title"], undefined, name, "h1");
        const cardTimeContainer = createEl(["card-time"])
        const cardTimIcon = createEl(["fa-regular", "fa-clock"], undefined, undefined, "i");
        const cardTime = createEl(undefined, undefined, `${time} min`, "span");
        const cardBodyContent = createEl(["row", "m-0"]);
        const cardBodyContentLeft = createEl(["col-6", "p-0"]);
        const cardBodyContentRight = createEl(["col-6", "p-0", "recipe"]);
        const cardDesc = createEl(undefined, undefined, description, "p");

        divContainer.appendChild(article);
        article.appendChild(imgContainer);
        article.appendChild(cardBody);
        cardBody.appendChild(cardTitleContainer);
        cardTitleContainer.appendChild(cardTitle);
        cardTitleContainer.appendChild(cardTimeContainer);
        cardTimeContainer.appendChild(cardTimIcon);
        cardTimeContainer.appendChild(cardTime);
        cardBody.appendChild(cardBodyContent);
        cardBodyContent.appendChild(cardBodyContentLeft);
        cardBodyContent.appendChild(cardBodyContentRight);
        cardBodyContentRight.appendChild(cardDesc);

        ingredients.forEach(e => {
            const quantity = (e.hasOwnProperty("quantity")) ? e.quantity : false;
            const ingredient = createEl(["ingredient"], undefined, strUnit(e, quantity));
            const ingredientName = createEl(undefined, undefined, `${e.ingredient}${(quantity) ? ":" : ""}`, "span");

            cardBodyContentLeft.appendChild(ingredient);
            ingredient.prepend(ingredientName);   
        });

        // unit check & reduce
        function strUnit(e, quantity) {
            let unit = (e.hasOwnProperty("unit")) ? e.unit : false;
            let withSpace = true;

            if (unit) {
                switch (unit) {
                    case "grammes":
                        unit = "g";
                        withSpace = false;
                        break;
                    case "cl":
                        withSpace = false;
                        break;
                    case "ml":
                        withSpace = false;
                        break;
                    case "kg":
                        withSpace = false;
                        break;
                    case "cuillères à soupe":
                    case "cuillère à soupe":
                        unit = "c. à soupe";
                        break;
                    case "cuillères à café":
                    case "cuillère à café":
                        unit = "c. à café";
                        break;
                }
            }

            return ` ${(quantity) ? quantity : ""}${(withSpace) ? " " : ""}${(unit) ? unit : ""}`
        }

        return (divContainer);
    }

    return { 
        getRecipeCardDOM
    }
}

export { recipeFactory };