let addons = []
exports.initialise = (args, sourceForm) => {
    const page = args.object.page
    addons = [];
    addons.push(
        {
            index: 1,
            id: "addonsListView" + 1,
            addonName: "",
            addonPrice: "",
            addonDuration: "",
        },
    )
    var listview = page.getViewById("addonsListView"); try { listview.items = addons; } catch (error) { }
    sourceForm.set("serviceAddons", addons)
}

exports.addAddon = (args, sourceForm) => {
    const page = args.object.page
    var listview = page.getViewById("addonsListView")
    const id = listview.items.length + 1

    addons = []
    try {
        listview.items.forEach(element => {
            addons.push({
                index: element.index,
                id: element.id,
                addonName: element.addonName,
                addonPrice: element.addonPrice,
                addonDuration: element.addonDuration
            })
        });
    } catch (error) { }
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
    sourceForm.set("serviceAddons", addons)
}

exports.removeAddon = (args, sourceForm) => {

    const page = args.object.page
    var listview = page.getViewById("addonsListView")
    const length = listview.items.length
    const index = args.object.index
    
    if (length > 1) {
        addons.splice(index - 1, 1)
        let addonsHolder = addons
        addons = []
        let i = 1;
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
    }

    listview.items = [];
    listview.items = addons;
    sourceForm.set("serviceAddons", addons)
}