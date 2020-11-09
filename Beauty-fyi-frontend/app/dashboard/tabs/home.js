source.set("addYourServicesTapped", async function (args) {
    const button = page.getViewById("addYourServicesArrowId");
    try {
        const page = button.page;
        await animation(button, "arrow swipe").then(function(){
            const navEntryWithContext = {
                moduleName: "~/dashboard/schedule/schedule",
                clearHistory: false,
                context: {
                    placeholder: "placeholder",  
                },
            };
            page.frame.navigate(navEntryWithContext); 
        })   
    } catch (error) {
        console.log(error)
    }
})

source.set("setYourScheduleTapped", function (args) {
    const button = page.getViewById("setYourScheduleArrowId");
    animation(button, "arrow swipe");
})

source.set("addYourIntakeFormTapped", function (args) {
    const button = page.getViewById("addYourIntakeFormArrowId");
    animation(button, "arrow swipe");
})
