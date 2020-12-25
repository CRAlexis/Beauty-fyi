exports.initialise = (args) => {
    console.log("running: " + args.object.page)
    createReciept(args)
    createPaymentMethodList(args)
}

function createReciept(args){
    const page = args.object.page;
    let recieptList = []
    recieptList.push(
        {
            serviceName: 'Braid Installation',
            servicePrice: "£100",
            class: "h5"
        },
        {
            serviceName: '24 inch hair',
            servicePrice: "£30",
            class: "h5"
        },
        {
            serviceName: 'To pay now',
            servicePrice: "£75",
            class: "h5 font-bold"
        },
        {
            serviceName: 'Total',
            servicePrice: "£150",
            class: "h5 font-bold"
        }
    )

    var listview = page.getViewById("recieptList");
    try {
        listview.items = recieptList;
    } catch (error) {
        console.log("error1: " + error)
    }
    
}

function createPaymentMethodList(args){
    const page = args.object.page;
    let paymentMethodList = []
    paymentMethodList.push(
        {
            index: '0',
            text: "Pay with: *1234",
        },
        {
            index: '1',
            text: "Add a card",
        },
        {
            action: '2',
            text: "Apply a voucher",
        },

    )

    var listview = page.getViewById("paymentMethodList");

    try{
        listview.items = paymentMethodList;
    } catch (error) {
        console.log("error2 " + error)
    }
}