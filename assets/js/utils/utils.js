function getAllIngredients(data) {
    console.log("displaying dropdown");
}

function createEl(classes = [], style = {}, innerText = null, type = "div", attributes = {}) {
    const div = document.createElement(type);

    setClasses(div, classes);
    setStyle(div, style);
    setAttributes(div, attributes);

    if (innerText) {
        div.innerText = innerText;
    }

    return div;
}

function createInput(classes = [], style = {}, type = "text", placeholder = "") {
    const input = document.createElement("input");

    setClasses(input, classes);
    setStyle(input, style);

    input.type = type;
    input.placeholder = placeholder;

    return input;
}

function createButton(classes = [], style = {}, textContent = "", icon = null) {
    const button = document.createElement("button");

    setClasses(button, classes);
    setStyle(button, style);

    button.textContent = textContent;

    if (icon) {
        button.appendChild(icon);
    }
    
    return button;
}

function setClasses(parent, classes) {
    classes.forEach(c => {
        parent.classList.add(c);
    });
}

function setStyle(parent, style) {
    for (const prop in style) {
        if (Object.hasOwnProperty.call(style, prop)) {
            parent.style[prop] = style[prop];
        }
    }
}

function setAttributes(parent, attributes) {
    for (const prop in attributes) {
        if (Object.hasOwnProperty.call(attributes, prop)) {
            parent.setAttribute(prop, attributes[prop]);
        }
    }
}

function hideAndShowSortedCards(result) {
    const allCards = document.querySelectorAll("#main div article");
    const errorMsg = document.querySelector("#error-msg");
    let toShow = [];

    // getting all cards index that don't need to be hide
    result.forEach(e => {
        toShow.push([...allCards].findIndex(el => el.getAttribute("data-id") === e.id.toString()));
    });

    // hide all the rest
    allCards.forEach((card, index) => {
        if (toShow.indexOf(index) == -1) {
            let ds = card.parentNode;
            ds.style.setProperty("display", "none", "important");
        }
        else {
            let ds = card.parentNode;
            ds.style.setProperty("display", "flex", "important");
        }
    });

    if (toShow.length <= 0) {
        console.log("show error message");
        errorMsg.style.display = "block";
        errorMsg.innerText = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
    }
    else {
        errorMsg.style.display = "none";
    }
}

function strFirstUpp(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
}


export {
    createEl,
    createInput,
    createButton,
    hideAndShowSortedCards,
    strFirstUpp
}