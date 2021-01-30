exports.firstNameInput = (fieldSource, validationSource) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var regExCheck = /^[a-zA-Z_]*$/;
            if (fieldSource.length == 0) { source.set("firstNameValidation", [false, false]); return }
            if (!source.get("firstName").trim().match(regExCheck)) {
                source.set("firstNameValidation", [false, true])
            } else {
                source.set("firstNameValidation", [true, true])
            }
        }, 100)
    })
    
}

exports.lastNameInput = (args) => {
    pageStateChanged = true
    setTimeout(() => {
        var regExCheck = /^[a-zA-Z_]*$/;
        if (source.get("lastName").length == 0) { source.set("lastNameValidation", [false, false]); return }
        if (!source.get("lastName").trim().match(regExCheck)) {
            source.set("lastNameValidation", [false, true])
        } else {
            source.set("lastNameValidation", [true, true])
        }
    }, 100)
}

exports.salonNameInput = (args) => {
    pageStateChanged = true
    setTimeout(() => {
        var regExCheck = /^[a-zA-Z0-9-,. ]+$/;
        if (source.get("salonName").length == 0) { source.set("salonNameValidation", [false, false]); return }
        if (!source.get("salonName").trim().match(regExCheck)) {
            source.set("salonNameValidation", [false, true])
        } else {
            source.set("salonNameValidation", [true, true])
        }
    }, 100)
}

exports.emailInput = (args) => {
    pageStateChanged = true
    setTimeout(() => {
        const httpParameters = {
            url: 'isemailavailable',
            method: 'POST',
            content: { email: source.get("email") },
        }
        var regExCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;;
        if (source.get("email").length == 0) { source.set("emailValidation", [false, false]); return }
        if (!source.get("email").trim().match(regExCheck)) {
            source.set("emailValidation", [false, true])
        } else {
            sendHTTP(httpParameters)
                .then((response) => {
                    if (response.JSON.emailAvailable) {
                        source.set("emailValidation", [true, true])
                    } else {
                        source.set("emailValidation", [false, true])
                    }
                }, (e) => {
                    source.set("emailValidation", [false, true])
                })

        }
    }, 100)
}

exports.phoneNumberInput = (args) => {
    pageStateChanged = true
    const httpParameters = {
        url: 'isphonenumberavailable',
        method: 'POST',
        content: { phoneNumber: source.get("phoneNumber") },
    }
    setTimeout(() => {
        if (source.get("phoneNumber").length == 0) { source.set("phoneNumberValidation", [false, false]); return }
        if (source.get("phoneNumber").length < 9) {
            source.set("phoneNumberValidation", [false, true])
        } else {
            sendHTTP(httpParameters)
                .then((response) => {
                    if (response.JSON.phoneNumberAvailable) {
                        source.set("phoneNumberValidation", [true, true])
                    } else {
                        source.set("phoneNumberValidation", [false, true])
                    }
                }, (e) => {
                    source.set("phoneNumberValidation", [false, true])
                })
        }
    }, 100)
}