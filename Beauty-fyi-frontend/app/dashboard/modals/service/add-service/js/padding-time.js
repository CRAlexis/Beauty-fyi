exports.getPaddingData = (args, sourceForm) => {
    const page = args.object.page;
    sourceForm.set("paddingBefore", page.getViewById("paddingBefore").text)
    sourceForm.set("paddingAfter", page.getViewById("paddingAfter").text)
}