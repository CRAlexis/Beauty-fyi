function loadAnimation(element, animation){
    return new Promise(resolve => {
        switch (animation) {
            case "arrow swipe":
                arrowSwipe(element)           
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


exports.loadAnimation = loadAnimation;