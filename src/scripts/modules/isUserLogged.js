'use strict'

const navContainer = document.querySelector('.nav')
const userLoggedTemplate = document.getElementById('user-logged-template')
const userNoLoggedTemplate = document.getElementById('user-no-logged-template')
const logOutBtn = userLoggedTemplate.content.getElementById('logout')

const isLogged = () => {
    navContainer.innerHTML = ''
    if (localStorage.getItem('isLogin')) {
        navContainer.append(userLoggedTemplate.content.cloneNode(true))
    } else {
        navContainer.append(userNoLoggedTemplate.content.cloneNode(true))
    }
}

const logOut = () => {
    localStorage.removeItem('isLogin')
    if (window.location.href.includes('formCreateArticle.html')) {
        document.location.href = "index.html"
    }
    isLogged()
}

isLogged()