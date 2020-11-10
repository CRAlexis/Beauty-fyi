exports.navigateToDashboard =  function (response, page) {
    const navEntryWithContext = {
        moduleName: "~/dashboard/dashboard",
        clearHistory: true,
        context: {
            name: "John",
            age: 25,
            isProgramer: true
        },
    };
    page.frame.navigate(navEntryWithContext);
}
exports.navigateToLandingPage = function (page) {
    const navEntryWithContext = {
        moduleName: "~auth/landing/landing-page",
        clearHistory: false,
    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignInPage = function (context, page){
    const navEntryWithContext = {
        moduleName: "~/auth/sign-in/sign-in",
        clearHistory: false,
        context: {
            context
        },
    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignUpPage = function (page) {
    const navEntryWithContext = {
        moduleName: "~/auth/sign-up/pro/sign-up-professional-form-page",
        clearHistory: false,
    };
    page.frame.navigate(navEntryWithContext);
}
exports.navigateToSignInPageAsExsistingUser = function (page) {
    const navEntryWithContext = {
        moduleName: "~/auth/sign-up/pro/exsisting-user/sign-up-professional-form-client-page",
        clearHistory: false,

    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignUpProfessionalLandingPage = function (page) {
    page.frame.navigate("~/auth/sign-up/pro/sign-up-professional-landing-page");
}

exports.navigateToSchedule = function (context, page) {
    const navEntryWithContext = {
        moduleName: "~/dashboard/schedule/schedule",
        clearHistory: false,
        context: {
            placeholder: "placeholder",
        },
    };
    page.frame.navigate(navEntryWithContext);
}