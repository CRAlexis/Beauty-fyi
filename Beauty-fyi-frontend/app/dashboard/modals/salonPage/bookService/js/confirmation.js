const animation = require("~/controllers/animationController").loadAnimation;
const addNewCardModal = require("~/dashboard/includes/bookService/add-new-card")
const application = require('application'); 
let modalActive = false;
exports.initialise = (args) => {
    createReciept(args)
    createPaymentMethodList(args)
}

function createReciept(args){
    const page = args.object.page;
    let recieptList = []
    recieptList.push(
        {
            serviceName: 'Hair deep conditioning, treatment & mask',
            servicePrice: "£100",
            class: "h5"
        },
        {
            serviceName: 'Extra shampoo',
            servicePrice: "£30",
            class: "h5"
        },
        {
            serviceName: 'Deposit',
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

exports.paymentMethodAction = (args) => {
    object = args.object;
    index = object.index;
    const page = object.page
    animation(args.object.getChildAt(2), "arrow swipe").then(function () {

    })

    switch (index) {
        case '0':
            //change card
            console.log("should be here")
            break;
        case '1':
            //add new card
            addNewCardModal.openModal(args).then((result) => {
                modalActive = result
            })
            break;
        case '2':
            //add voucher
            break;
    }
}

exports.closeModal = (args) => {
    closeModal(args)
}

function closeModal(args) {
    args.cancel = true;
    addNewCardModal.closeModal(args).then((result) => {
        modalActive = result
    })
}

exports.pageClicked = (args) => {
    return new Promise((resolve, reject) =>{
        if (modalActive) {
            addNewCardModal.closeModal(args).then((result) => {
                modalActive = result
                resolve()
            })
        }
    })
    
}