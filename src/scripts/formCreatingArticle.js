'use strict'
let base64String = "";
// pick tag content
const tagsContainer = document.querySelector('.tags__list') //<- pick tag container
const tagTemplate = document.getElementById('tag-template') //<- pick tag template
let tagName = tagTemplate.content.querySelector('.tags__label') //<- pick tag label
let tagInput = tagTemplate.content.querySelector('.tags__checkbox') //<- pick tag input

const form = document.querySelector('.article-form')
const storyBlockContainer = document.querySelector('.article-form__container')
const storyBlockTeamplate = document.getElementById('story-block-teamplate')
const addBlockBtn = document.querySelector('.article__add-btn')

const articleSubtitle = storyBlockTeamplate.content.querySelector('.article-form__input--subtitle')
const articleTextarea = storyBlockTeamplate.content.querySelector('.article-form__input--textarea')

let storyNumber = 2

const addBlock = () => {
    articleSubtitle.setAttribute('name', `articleSubtitle/id:${storyNumber}`)
    articleTextarea.setAttribute('name', `articleTextarea/id:${storyNumber}`)
    storyBlockContainer.append(storyBlockTeamplate.content.cloneNode(true))
    storyNumber++
}
addBlockBtn.addEventListener('click',() => addBlock())

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
}

const getTagsList = () => {
    fetch('http://localhost:8080/tag-list')
    .then(response => response.json())
    .then(json => {
        tagsRender(json)
        createStateCheckboxes()
    })
}

getTagsList()


function imageUploaded() {
    let file = document.querySelector(
        'input[type=file]')['files'][0];
  
    let reader = new FileReader();
      
    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
    }
    reader.readAsDataURL(file);
}

async function SendForm(e)
{
    e.preventDefault();

    const trueTags = []
    for (const key in stateChecboxesValue) {
        if (Object.hasOwnProperty.call(stateChecboxesValue, key)) {
            const element = stateChecboxesValue[key];
            if (element) {
                trueTags.push(key)
            }
        }
    }

    let formData = new FormData(form)
    formData.append('tags', trueTags);
    formData.append('picture', base64String);
 
    let response = await fetch('http://localhost:8080/create-article', {
        method: 'POST',       
        body: formData 
    });

    let result = await response.json();
    document.location.href = `cardDetail.html?id=${result._id}`
};

form.onsubmit = SendForm;
