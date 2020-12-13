const animation = require("~/controllers/animationController").loadAnimation;
exports.goToNextSlide =  (args, slideIndex, source, slides) => {
    return new Promise(resolve => {
        animateToNextSlide(slides[slideIndex], slides[slideIndex + 1], slideIndex, source)
        slideIndex++
        resolve(slideIndex)  
    })
}

exports.goToPreviousSlide = (args, slideIndex, source, slides) => {
    return new Promise(resolve => {
        animateToNextSlide(slides[slideIndex], slides[slideIndex - 1], slideIndex, source)
        slideIndex--
        resolve(slideIndex)
    })
}

exports.goToCustomSlide = (args, currentSlideIndex, nextSlideIndex, source, slides) => {
    return new Promise(resolve => {
        animateToNextSlide(slides[currentSlideIndex], slides[nextSlideIndex], null, source)
        resolve(nextSlideIndex)
    })
}

async function animateToNextSlide(currentSlide, nextSlide, slideIndex, source) {
    animation(currentSlide, 'fade out').then(function () {
        currentSlide.visibility = 'collapsed';
    }).then(function () {
        nextSlide.visibility = 'visible';
        animation(nextSlide, 'fade in')
    })
}

