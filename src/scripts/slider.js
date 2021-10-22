'use strict'
//select slider and buttons
const nextBtn = document.querySelector('.slider__arrow-btn--right')
const prevBtn = document.querySelector('.slider__arrow-btn--left')
const slideContainer = document.querySelector('.slider')
const slide = document.querySelector('.slider__list')

//slider's move interval
const sliderInterval = 3000

let slides = document.querySelectorAll('.slider__item')
let slideIndex = 1
let slideId

//clone first and last slides
const firstClone = slides[0].cloneNode(true)
const lastClone = slides[slides.length - 1].cloneNode(true)

firstClone.id = 'first-clone'
lastClone.id = 'last-clone'

//add first and last slides in slider-list
slide.append(firstClone)
slide.prepend(lastClone)

const slideWidth = slides[slideIndex].clientWidth // <- change css propety for move slide list
slide.style.transform = `translateX(${-slideWidth * slideIndex}px)`

//interval move slider
const startSlide = () => {
    slideId = setInterval(() => {
       moveToNextSlide()
    }, sliderInterval)
}

const getSlides = () => document.querySelectorAll('.slider__item')

slide.addEventListener('transitionend', () => {
    slides = getSlides()
    if (slides[slideIndex].id === firstClone.id) {
        slide.style.transition = 'none'
        slideIndex = 1
        slide.style.transform = `translateX(${-slideWidth * slideIndex}px)`
    }
    if (slides[slideIndex].id === lastClone.id) {
        slide.style.transition = 'none'
        slideIndex = slides.length - 2
        slide.style.transform = `translateX(${-slideWidth * slideIndex}px)`
    }
})

//function for shift the slide to the left
const moveToNextSlide = () => {
    slides = getSlides()
    if (slideIndex >= slides.length -1) return
        slideIndex++
        slide.style.transform = `translateX(${-slideWidth * slideIndex}px)`
        slide.style.transition = '1.2s'
}

// function for shift the slide to the right
const moveToPrevSlide = () => {
    if (slideIndex <= 0) return
    slideIndex--
    slide.style.transform = `translateX(${-slideWidth * slideIndex}px)`
    slide.style.transition = '1.2s'
}

slideContainer.addEventListener('mouseenter', () => {
    clearInterval(slideId)
})

slideContainer.addEventListener('mouseleave', startSlide)

nextBtn.addEventListener('click', moveToNextSlide)
prevBtn.addEventListener('click', moveToPrevSlide)

startSlide()