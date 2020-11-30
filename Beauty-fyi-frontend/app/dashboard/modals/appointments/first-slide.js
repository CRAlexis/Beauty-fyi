exports.serviceTapped = function (args, serviceDropDownActive){
    if (!serviceDropDownActive[1]) {
        serviceDropDownActive[1] = true
        const page = args.object.page;
        const object = args.object;
        const parent = page.getViewById('bookAppointmentFirstSlideButtonContainer')
        const children = parent.getChildrenCount();
        let indexSelected;
        indexSelected = object.id;
        if (object.serviceTapped != 'false') {
            object.serviceTapped = 'false';
            serviceDropDownActive[0] = false
            animation(object, "reduce section down", { height: '60', duration: 500 }).then(function () {
                object.getChildAt(1).visibility = "collapsed"
            })
            if (children > 1) {
                for (let index = 1; index < children + 1; index++) {
                    if (index != indexSelected) {
                        animation(parent.getChildAt(index - 1), "fade in").then(function () {
                            parent.getChildAt(index - 1).visibility = 'visible'
                        })
                    }
                }
            }
        } else {
            object.serviceTapped = 'true';
            serviceDropDownActive[0] = object;
            if (children > 1) {
                for (let index = 1; index < children + 1; index++) {
                    if (index != indexSelected) {
                        animation(parent.getChildAt(index - 1), "fade out").then(function () {
                            parent.getChildAt(index - 1).visibility = 'collapse'
                        })
                    }
                }
            }
            animation(object, "expand section down", { height: '460', duration: 500 }).then(function () {
                object.getChildAt(1).visibility = "visible"
            })
        }
        setTimeout(function () {
            serviceDropDownActive[1] = false
        }, 1500)
    }
}