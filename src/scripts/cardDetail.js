'use strict'
const cardsData =[] //<- "import" cards data from data.js

const params = new URLSearchParams(document.location.search.substring(1));
const cardID = params.get("id"); //<-get card id

const articleHeaderTemplate = document.getElementById('article-header-template')
const articleStoryTemplate = document.getElementById('article-story-template')
const articleContainer = document.querySelector('.article')

//pick article content
let articleTitle = articleHeaderTemplate.content.querySelector('.article__title')
let articleImg = articleHeaderTemplate.content.querySelector('.article__img')
let articleSubtitle = articleStoryTemplate.content.querySelector('.article__subtitle')
let articleBody = articleStoryTemplate.content.querySelector('.article__body')

//pick article info content
const articleInfoContainer = document.querySelector('.article-info')
const articleInfoTeamplate = document.getElementById('article-info')
let articleAuthor = articleInfoTeamplate.content.querySelector('.article-info__author')
let articleDate = articleInfoTeamplate.content.querySelector('.article-info__date')

//pick tag content
const tagsContainer = document.querySelector('.tags__list') //<- pick tag container
const tagTemplate = document.getElementById('tag-template') //<- pick tag template
let tagLink = tagTemplate.content.querySelector('.tag__link')//<- pick tag link
let tagName = tagTemplate.content.querySelector('.tags__label') //<- pick tag label

//formating date
const createDate = (date) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    return date.toLocaleDateString('en-EN', options)
}

const createArticle = (cardList ,cardID) => {
    const articleData = cardList.find(card => card._id === cardID) //<-find our article
    //create article header
    articleTitle.textContent = `${articleData.title}`
    document.title = `${articleData.title}` //<- set page title
    articleImg.setAttribute('src', `data:image/png;base64,${articleData.picture}`)
    articleContainer.append(articleHeaderTemplate.content.cloneNode(true))

    //create article story blocks
    articleData.articleBody.forEach(storyData => {
        articleSubtitle.textContent = `${storyData.storyTitle}`
        articleBody.textContent = `${storyData.storyParagraph}`
        articleContainer.append(articleStoryTemplate.content.cloneNode(true))
    })

    //create article info
    articleAuthor.textContent = `${articleData.author}`
    articleDate.textContent = createDate(new Date (articleData.date.split(' ')[0])) //<-formating date
    articleInfoContainer.append(articleInfoTeamplate.content.cloneNode(true))

    //create article tag list
    articleData.tags.forEach(tag => {
        tagLink.setAttribute('href', `listArticlesByTag.html?id=${tag}`)
        tagName.textContent = `${tag}`
        tagsContainer.append(tagTemplate.content.cloneNode(true))
    })

}

const getCards = (inputSearch, selectedTags) => {

    let url = new URL ('http://localhost:8080/cardlist')
    url.search = new URLSearchParams(params).toString();

    fetch(url)
    .then(response => response.json())
    .then(json => createArticle(json ,cardID))
}
getCards()
