const shoppingCart = require("~/dashboard/modals/appointments/shopping-cart.js")
exports.goToNextSlide = function (args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source){
    return new Promise(resolve => {
    const page = args.object.page
    switch (slideIndex) {
        case 4:
            shoppingCart.addToShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function () {
                slideIndex++
                animateToNextSlide(page.getViewById('bookAppointmentFourthSlideContainer'), page.getViewById('bookAppointmentFifthSlideContainer'), slideIndex, source)
                resolve(slideIndex)
            })
            break;
        case 3:
            shoppingCart.addToShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function () {
                slideIndex++
                animateToNextSlide(page.getViewById('bookAppointmentThirdSlideContainer'), page.getViewById('bookAppointmentFourthSlideContainer'), slideIndex, source)
                resolve(slideIndex)
            })
            break;
        case 2:
            shoppingCart.addToShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function () {
                slideIndex++
                animateToNextSlide(page.getViewById('bookAppointmentSecondSlideContainer'), page.getViewById('bookAppointmentThirdSlideContainer'), slideIndex, source)
                resolve(slideIndex)
            })    
            break;
        case 1:
            shoppingCart.addToShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function(){
                slideIndex++
                animateToNextSlide(page.getViewById('bookAppointmentFirstSlideContainer'), page.getViewById('bookAppointmentSecondSlideContainer'), slideIndex, source)
                resolve(slideIndex)
            })    
            break; 
        }
    })
}

exports.goToPreviousSlide = function (args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source){
    return new Promise(resolve => {
        const page = args.object.page // If service drop down is still showing, this will close it
        if (serviceDropDownActive[0] != false && slideIndex == 1) {
            const page = args.object.page;
            const object = serviceDropDownActive[0];
            const parent = page.getViewById('bookAppointmentFirstSlideButtonContainer')
            const children = parent.getChildrenCount();
            let indexSelected;
            indexSelected = object.id;
            object.serviceTapped = 'false';
            serviceDropDownActive[0] = false
            animation(object, "reduce section down", { height: '60', duration: 500 }).then(function () {
                object.getChildAt(1).visibility = "collapsed"
            })
            if (children > 1) { // This will make the other services re appear
                for (let index = 1; index < children + 1; index++) {
                    if (index != indexSelected) {
                        animation(parent.getChildAt(index - 1), "fade in").then(function () {
                            parent.getChildAt(index - 1).visibility = 'visible'
                        })
                    }
                }     
            }
            resolve(slideIndex)
        } else {
            switch (slideIndex) {
                case 2:
                    shoppingCart.removeFromShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function () {
                        slideIndex--
                        animateToNextSlide(page.getViewById('bookAppointmentSecondSlideContainer'), page.getViewById('bookAppointmentFirstSlideContainer'), slideIndex, source)
                        resolve(slideIndex)
                    })
                    
                    break;
                case 3:
                    shoppingCart.removeFromShoppingCart(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function () {
                        slideIndex--
                        animateToNextSlide(page.getViewById('bookAppointmentThirdSlideContainer'), page.getViewById('bookAppointmentSecondSlideContainer'), slideIndex, source)
                        resolve(slideIndex)
                    })
                    break;
                case 4:
                    slideIndex--
                    animateToNextSlide(page.getViewById('bookAppointmentFourthSlideContainer'), page.getViewById('bookAppointmentThirdSlideContainer'), slideIndex, source)
                    resolve(slideIndex)
                    break;
                case 5:
                    slideIndex--
                    animateToNextSlide(page.getViewById('bookAppointmentFifthSlideContainer'), page.getViewById('bookAppointmentFourthSlideContainer'), slideIndex, source)
                    resolve(slideIndex)
                    break;
            }
        }
    })
}

async function animateToNextSlide(currentSlide, nextSlide, slideIndex, source) {
    animation(currentSlide, 'fade out').then(function () {
        currentSlide.visibility = 'collapsed';
    }).then(function () {
        nextSlide.visibility = 'visible';
        animation(nextSlide, 'fade in')
    })
    switch (slideIndex) {
        case 1:
            source.set("slideTitle", "Choose appointment")
            source.set("nextSlideTitle", "Choose a date")
            break;
        case 2:
            source.set("slideTitle", "Choose a date")
            source.set("nextSlideTitle", "Consultation")
            break;
        case 3:
            source.set("slideTitle", "Consultation")
            source.set("nextSlideTitle", "Payment")
            break;
        case 4:
            source.set("slideTitle", "Payment")
            source.set("nextSlideTitle", "Preview")
            break;
        case 5:
            source.set("slideTitle", "Preview")
            source.set("nextSlideTitle", "Confirm")
            break;
    }
}

