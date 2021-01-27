let steps = []
exports.initialise = (args, sourceForm) => {
    const page = args.object.page
    steps = [];
    steps.push(
        {
            index: 1,
            id: "stepListView" + 1,
            stepName: "",
            stepDuration: "",
            checked: "false"
        }
    )
    //format photos when uploading
    var listview = page.getViewById("stepsListView")
    listview.items = steps;
    sourceForm.set("serviceSteps", steps)
}

exports.addSteps = (args, sourceForm) => {
    const page = args.object.page
    var listview = page.getViewById("stepsListView")
    const id = listview.items.length + 1

    steps = []
    try {
        listview.items.forEach(element => {
            steps.push({
                index: element.index,
                id: element.id,
                stepName: element.stepName,
                stepDuration: element.stepDuration,
                checked: element.checked
            })
        });
    } catch (error) { }

    steps.push(
        {
            index: id,
            id: "stepListView" + id,
            stepName: "",
            stepDuration: "",
            checked: "false"
        },
    )

    //format photos when uploading
    listview.items = [];
    listview.items = steps;

    sourceForm.set("serviceSteps", steps)

}

exports.removeStep = (args, sourceForm) => {
    const page = args.object.page
    var listview = page.getViewById("stepsListView")
    const length = listview.items.length
    const index = args.object.index
    if (length > 1) {
        steps.splice(index - 1, 1)
        let stepsHolder = steps
        steps = []
        let i = 1;
        stepsHolder.forEach(element => {
            steps.push({
                index: i,
                id: element.id,
                stepName: element.stepName,
                stepDuration: element.stepDuration,
                checked: element.checked
            })
            i++;
        });
    }
    listview.items = [];
    listview.items = steps;
    sourceForm.set("serviceSteps", steps)
}

exports.validatePage = (args, sourceForm) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page;
        const listview = page.getViewById("stepsListView")
        let index = 0
        let rejectOrResolve = true;
        setTimeout(() => {
            listview.items.forEach(element => {
                if (!element.stepName || !element.stepDuration) {
                    console.log("Page is invalid")
                    rejectOrResolve = false
                }
                index++
                if (index == listview.items.length) {
                    if (rejectOrResolve) {
                        console.log("resolving step page")
                        resolve()
                    } else {
                        console.log("rejecting step page")
                        reject()
                    }
                }
            });
        }, 125)
    })
}