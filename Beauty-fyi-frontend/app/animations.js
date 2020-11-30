var colorModule = require("tns-core-modules/color");

function loadAnimation(element, animation, context){
    return new Promise(resolve => {
        switch (animation) {
            case "arrow swipe":
                arrowSwipe(element)           
                break;
            case "expand section down":
                expandSectionDown(element, context)
                break;
            case "reduce section down":
                reduceSectionDown(element, context)
                break;
            case "fade out":
                fadeOut(element)
                break;
            case "fade in":
                fadeIn(element)
                break;
            case "change background color":
                changeBackgroundColor(element, context)
                break;
            default:
                break;
        } 
        setTimeout(() => {
            resolve();
        }, 250);
    });
}

function arrowSwipe(element){
    element.animate({
        translate: { x: 30, y: 0 },
        duration: 250,
        curve: enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
    }).then(function () {
        element.animate({
            translate: { x: 0, y: 0 },
            duration: 250,
            curve: enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        });
    })
}

function expandSectionDown(element, context) {
    if (context.duration){
        element.animate({
            height: context.height,
            duration: context.duration
        })
    }else{
        element.animate({
            height: context.height,
            duration: 500
        })
    }
    
}

function reduceSectionDown(element, context) {
    element.animate({
        height: context.height,
        duration: 500,
    })
}

function fadeOut(element) {
    element.animate({
        opacity: 0,
        duration: 250,
    })
}

function fadeIn(element) {
    element.animate({
        opacity: 1,
        duration: 250,
    })
}

function changeBackgroundColor(element, context){
    console.log(context);
    element.animate({
        backgroundColor: new colorModule.Color(context.color), duration: context.duration 
    });
    console.log("here")
}

//https://docs.nativescript.org/ui/animation-code
exports.loadAnimation = loadAnimation;