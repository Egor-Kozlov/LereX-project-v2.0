'use strict'

const form = document.querySelector('.login__form')
const welcomeUserName = document.querySelector('.login__welcome')
const userDontExistTemplate = document.getElementById('user-no-logged-template')

async function SendForm(e)
{
    e.preventDefault();

    let response = await fetch('http://localhost:8080/', {
        method: 'POST',         
        body: new FormData(form) 
    });

    let result = await response.json();
    if (result.userDontExist) {
      form.append(userDontExistTemplate.content.cloneNode(true))
      return
    }

    localStorage.setItem('isLogin', JSON.stringify(result))

    if (localStorage.getItem('isLogin')) {
      form.remove()
      welcomeUserName.textContent = `, ${result.login} 🎉`
      setTimeout(() => document.location.href = "index.html", 3000)
    }
  };

form.onsubmit = SendForm;