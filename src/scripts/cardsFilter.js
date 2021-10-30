'use strict'
// const cardsData = data //<- "import" cards data from data.js

let inputSeachValue
// let filteredCard = data
let countOfRenderedCards = 0
const cardPerPage = 8

const cardTemplate = document.getElementById('card-template') // <- pick card template from index.html
const cardsContainer = document.querySelector('.cards') // <- pick cards container
const moreCardsBtn = document.querySelector('.load-more-btn')
const searchInput = document.querySelector('.search-input')

// pick card content
let cardTitle = cardTemplate.content.querySelector('.card__title')
let cardDescription = cardTemplate.content.querySelector('.card__description')
let cardPicture = cardTemplate.content.querySelector('.card__img')
let cardLink = cardTemplate.content.querySelector('.card__link')

// pick tag content
const tagsContainer = document.querySelector('.tags__list') //<- pick tag container
const tagTemplate = document.getElementById('tag-template') //<- pick tag template
let tagName = tagTemplate.content.querySelector('.tags__label') //<- pick tag label
let tagInput = tagTemplate.content.querySelector('.tags__checkbox') //<- pick tag input

const emptyResultTemplate = document.querySelector('.empty-result') //<- pick empty result container

//prepare tags list
let uniqueTagsList = [] //<- list of unique tags
const stateChecboxesValue = {} //<- a list of user-selected tags

const tagsRender = (tagList) => { //<- render actual tags per page
    for (const tagData of tagList) {
        tagName.textContent = `${tagData}`
        tagName.setAttribute('for', `${tagData}`)
        tagInput.setAttribute('id', `${tagData}`)
        tagInput.setAttribute('value', `${tagData}`)
        tagInput.setAttribute('onclick', `onChangeStateChecboxes(value)`)
        tagsContainer.append(tagTemplate.content.cloneNode(true))
    }
}

const createStateCheckboxes = () => { //<- create object with all tags that cards object include 
    for (const tag of uniqueTagsList) {
        stateChecboxesValue[tag] = false
    }
}

const onChangeStateChecboxes = (value) => { //<- change boolean value state in "stateChecboxesValue" after click
    stateChecboxesValue[value] = !stateChecboxesValue[value]
    getCards()
}

const getTrueTag = () => { //<- get list of true tags
    const tagsArr = []
    for (const key in stateChecboxesValue) {
        if (stateChecboxesValue[key] === true) {
            tagsArr.push(key)
        }
    }
    return tagsArr //<- return names of tags, that are true
}

//input search value

searchInput.oninput = function() {
    inputSeachValue = searchInput.value
    getCards(searchInput.value)
};

const createCard = (cards) => {
    return cards.map((card, index) => {
        
        cardPicture.setAttribute('src', `data:image/png;base64, ${card.picture}`)
        cardTitle.textContent = `${card.title}` // <- pick title from cardsData
        cardDescription.textContent = `${card.articleBody[0].storyParagraph}` // <- pick description from cardsData
        cardDescription.setAttribute('title', `${cards[index].articleBody[0].storyParagraph}`)
        cardLink.setAttribute('href', `cardDetail.html?id=${card._id}`)
        return cardTemplate.content.cloneNode(true); 
    })
}

const renderCards = (cardsTemplate) => {
    cardsContainer.innerHTML = ''
    if (cardsTemplate.length < cardPerPage) {
        cardsTemplate.length ? cardsTemplate.forEach(element => {
            cardsContainer.append(element) 
        }) : cardsContainer.append(emptyResultTemplate.content.cloneNode(true))
        countOfRenderedCards = cardsTemplate.length
        setVisibilityLoadMoreBtn(false)
    } else {
        let maxCount = cardPerPage + countOfRenderedCards > cardsTemplate.length ? cardsTemplate.length : cardPerPage + countOfRenderedCards
        for (let index = 0; index < maxCount; index++) {
            cardsContainer.append(cardsTemplate[index])
        }
        countOfRenderedCards = maxCount
        setVisibilityLoadMoreBtn(true)
    }
    if (countOfRenderedCards === cardsTemplate.length) {
        setVisibilityLoadMoreBtn(false)
    }
}

const setVisibilityLoadMoreBtn = (isVisible) => {
    moreCardsBtn.style.visibility = isVisible ? 'visible' : 'hidden'
}

moreCardsBtn.addEventListener('click', () => {
    renderCards(createCard(filteredCard))
})

const getTagsList = () => {
    fetch('http://localhost:8080/tag-list')
    .then(response => response.json())
    .then(json => {
        tagsRender(json)
        createStateCheckboxes()
    })
}

const getCards = (inputSearch, selectedTags) => {
    let selectedTagsString = ''
    for (const key in stateChecboxesValue) {
        if (Object.hasOwnProperty.call(stateChecboxesValue, key)) {
            const element = stateChecboxesValue[key];
            if (element) {
                selectedTagsString += `${key}-`
            }
        }
    }  

    let url = new URL ('http://localhost:8080/cards')
    var params = {inputSearch: inputSeachValue === undefined ? '' :inputSeachValue, selectedTags: selectedTagsString} 

    url.search = new URLSearchParams(params).toString();

    fetch(url)
    .then(response => response.json())
    .then(json => renderCards(createCard(json)))
}

const firstRenderCads = () => {
    getTagsList()
    getCards() 
}

firstRenderCads()
