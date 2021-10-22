'use strict'
const cardsData = data //<- "import" cards data from data.js

let visibleCardsList = []
let countCardsPerPage = cardsData.length >= 8 ? 8 : cardsData.length

const cardTemplate = document.getElementById('card-template') // <- pick card template from index.html
const cardsContainer = document.querySelector('.cards') // <- pick cards container
const moreCardsBtn = document.querySelector('.load-more-btn') // <- pick button show more
const searchInput = document.querySelector('.search-input')

// pick card content
let cardTitle = cardTemplate.content.querySelector('.card__title')
let cardDescription = cardTemplate.content.querySelector('.card__description')
let cardPicture = cardTemplate.content.querySelector('.card__img')
// pick tag content
const tagsContainer = document.querySelector('.tags__list') //<- pick tag container
const tagTemplate = document.getElementById('tag-template') //<- pick tag template
let tagName = tagTemplate.content.querySelector('.tags__label') //<- pick tag label
let tagInput = tagTemplate.content.querySelector('.tags__checkbox') //<- pick tag input

const emptyResultTemplate = document.querySelector('.empty-result')

//prepare tags list
const uniqueTagsList = [] //<- list of unique tags
const stateChecboxesValue = {} //<- a list of user-selected tags

moreCardsBtn.addEventListener('click', () => {

})

const createTagList = () => {
    for (const card of cardsData) {
        card.tags.map((tag) => {
            if (!uniqueTagsList.includes(tag)) {
                uniqueTagsList.push(tag)
            }
        })
    }
}

createTagList()

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

tagsRender(uniqueTagsList)

const createStateCheckboxes = () => { //<- create object with all tags that cards object include 
    for (const tag of uniqueTagsList) {
        stateChecboxesValue[tag] = false
    }
}

createStateCheckboxes()

const onChangeStateChecboxes = (value) => { //<- change boolean value state in "stateChecboxesValue" after click
    stateChecboxesValue[value] = !stateChecboxesValue[value]
    filterCardList()
}

const getTrueTag = () => { //<- get list of true tags
    const tagsArr = []
    for (const key in stateChecboxesValue) {
        if (stateChecboxesValue[key] == true) {
            tagsArr.push(key)
        }
    }
    return tagsArr //<- return names of tags, that are true
}

//input search value
let inputSeachValue
searchInput.oninput = function() {
    inputSeachValue = searchInput.value
    filterCardList(searchInput.value)
};

const createCard = (cards) => {
    const cardsTemplate = cards.map((card, index) => {
        cardPicture.setAttribute('src', `${card.picture}`)
        cardTitle.textContent = `${card.title}` // <- pick title from cardsData
        cardDescription.textContent = `${card.description}` // <- pick description from cardsData
        cardDescription.setAttribute('title', `${cardsData[index].description}`)
        return cardTemplate.content.cloneNode(true); 
    })
    return cardsTemplate
}

const renderCards = (cardsTemplate) => {
    cardsContainer.innerHTML = ''
    cardsTemplate.length ? cardsTemplate.forEach(element => {
        cardsContainer.append(element) 
    }) : cardsContainer.append(emptyResultTemplate.content.cloneNode(true))
}

const filterCardList = () => {
    const trueTag = getTrueTag()
    let filteredCard = []

    if (trueTag.length && inputSeachValue) { // <-if user pick some tags and use input search together
        filteredCard = cardsData.filter((card) => {
            return card.tags.some((tagName) => {
                return trueTag.includes(tagName)
            })
        }).filter((card) => {
            return card.title.toLowerCase().includes(inputSeachValue.toLowerCase())
        })
    } else if (inputSeachValue) { // <-if user use input search 
        filteredCard = cardsData.filter((card) => {
            return card.title.toLowerCase().includes(inputSeachValue.toLowerCase())
        })
    } else if (trueTag.length) { // <-if user pick some tags
        filteredCard = cardsData.filter((card) => {
            return card.tags.some((tagName) => {
                return trueTag.includes(tagName)
            })
        })
    } else { // <-if user pick nothing
        filteredCard = cardsData
    }

    renderCards(createCard(filteredCard))
}

filterCardList()