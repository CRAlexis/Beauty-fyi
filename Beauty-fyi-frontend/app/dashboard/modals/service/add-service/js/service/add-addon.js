let addons = []
exports.initialise = (args, sourceForm) => {
    const page = args.object.page
    addons = [];
    var listview = page.getViewById("addonsListView"); try { listview.items = addons; } catch (error) { }
    sourceForm.set("serviceAddons", addons)
}

exports.addAddon = (args, sourceForm) => {
    const page = args.object.page
    var listview = page.getViewById("addonsListView")
    let id = 0
    try { id = listview.items.length } catch (error) { }
    addons = []
    listview.items.forEach(element => {
        addons.push({
            index: element.index,
            id: element.id,
            addonName: element.addonName,
            addonPrice: element.addonPrice,
            addonDuration: element.addonDuration
        })
    });

    addons.push(
        {
            index: id,
            id: "addonsListView" + id,
            addonName: "",
            addonPrice: "",
            addonDuration: "",
        },
    )
    //format photos when uploading
    listview.items = [];
    listview.items = addons;

}

exports.removeAddon = (args, sourceForm) => {

    const page = args.object.page
    var listview = page.getViewById("addonsListView")
    const length = listview.items.length
    const index = args.object.index

    addons.splice(index - 1, 1)
    let addonsHolder = addons
    addons = []
    let i = 0;
    addonsHolder.forEach(element => {
        addons.push({
            index: i,
            id: element.id,
            addonName: element.addonName,
            addonPrice: element.addonPrice,
            addonDuration: element.addonDuration
        })
        i++
    });


    listview.items = [];
    listview.items = addons;
    sourceForm.set("serviceAddons", addons)
}

exports.getData = (args, sourceForm) => {
    const page = args.object.page
    var listview = page.getViewById("addonsListView")
    let sourceFormAddon = []
    listview.items.forEach(element => {
        sourceFormAddon.push({
            index: element.index,
            id: element.id,
            addonName: element.addonName,
            addonPrice: element.addonPrice.slice(1),
            addonDuration: element.addonDuration
        })
    });
}

exports.validatePage = (args, sourceForm, forceCancel) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page;
        var listview = page.getViewById("addonsListView")
        let index = 0
        let rejectOrResolve = true;
        console.log("force cancel: " + forceCancel)
        if (forceCancel) {
            resolve()
            return true
        }
        setTimeout(() => {
            listview.items.forEach(element => {
                if (!element.addonName || !element.addonPrice || !element.addonDuration) {
                    console.log("Page is invalid")
                    rejectOrResolve = false
                }
                index++
                if (index == listview.items.length) {
                    if (rejectOrResolve) {
                        console.log("resolving addons page")
                        resolve()
                    } else {
                        console.log("rejecting addons page")
                        reject()
                    }
                }
            });
        }, 125)
    })
}