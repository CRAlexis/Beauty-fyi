exports.updateBarValue = (args, value) => {
    const progressBar = args.object.page.getViewById("progressBar").getChildAt(0)
    progressBar.width = value + "%"

}