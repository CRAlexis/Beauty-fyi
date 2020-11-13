
exports.loadClients = async function (page) { // am not able to get page object
    page.bindingContext = source;
    const clients = [];
    clients.push(
        {
            clientImage: "~/temp.png",
            clientName: "Felicia",
        },
        {
            clientImage: "~/temp1.png",
            clientName: "Phoebe",
        },
        {
            clientImage: "~/temp2.png",
            clientName: "Amie",
        },
        {
            clientImage: "~/temp3.png",
            clientName: "Renee",
        },
        {
            clientImage: "~/temp1.png",
            clientName: "Toby",
        },
        {
            clientImage: "~/temp4.png",
            clientName: "Chiedza",
        },
        {
            clientImage: "~/temp.png",
            clientName: "Felicia",
        },
        {
            clientImage: "~/temp1.png",
            clientName: "Phoebe",
        },
        {
            clientImage: "~/temp2.png",
            clientName: "Amie",
        },
        {
            clientImage: "~/temp3.png",
            clientName: "Renee",
        },
        {
            clientImage: "~/temp1.png",
            clientName: "Toby",
        },
        {
            clientImage: "~/temp4.png",
            clientName: "Chiedza",
        },
    )
    //format photos when uploading
    //source.set("clientList")
    var listview = page.getViewById("clientList");
    listview.items = clients;
}



