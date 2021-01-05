const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
const application = require('application');
let modalActive = false
let pageObject;
let formId;
exports.loaded = (args) => {
    const page = args.object.page
    page.on('formModalOpened', (args) => {
        console.log(args)
        formId = args.formId
        //Do request to get data
    })
}

exports.editForm = (args) => {
    const mainView = args.object
    const { modifyBackEvent} = require("~/dashboard/modals/settings/settingsMenu/intakeForm/intake-forms-menu")
    modifyBackEvent(false)
    navigation.navigateToModal({formId: formId, state: 'edit'}, mainView, 22, true).then(function (result) {
        modifyBackEvent(true)
    })
}

exports.openModal = async (args) => {
    return new Promise((resolve, reject) => {
        pageObject = args.object.page
        if (!modalActive) {
            setTimeout(async function () {
                const object = args.object;
                const page = object.page
                modalActive = true
                await animation(page.getViewById("profilePageContainer"), "fade out", { opacity: 0.2 })
                page.getViewById("intakeFormModal").visibility = 'visible';
                await animation(page.getViewById("intakeFormModal"), "fade in")
                loadForm(args)
                loadServicesForm(args)
                resolve(true)
            }, 100)
        }
    })

}

exports.closeModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (modalActive) {
            //const page = args.object.page
            await animation(pageObject.getViewById("intakeFormModal"), "fade out")
            await animation(pageObject.getViewById("profilePageContainer"), "fade in")
            pageObject.getViewById("intakeFormModal").visibility = 'collapsed';
            modalActive = false
            resolve(false)
        }
    })
}

function loadForm(args){
    const page = args.object.page
    const intakeFormQuestions = [];
    intakeFormQuestions.push(
        {
            formQuestion: 'The first question?',
            formContent: '( Yes/No )'
        },
        {
            formQuestion: 'The second question?',
            formContent: false
        },
        {
            formQuestion: 'The third question?',
            formContent: false
        },
        {
            formQuestion: 'The fourth question?',
            formContent: '( Option 1, Option 2, Option 3, )'
        },
    )
    page.getViewById("intakeFormRepeater").items = intakeFormQuestions
}

function loadServicesForm(args) {
    const page = args.object.page
    const intakeFormServices = [];
    intakeFormServices.push(
        {
            serviceName: 'Washing service',
        },
        {
            serviceName: 'Styling service',
        },

    )
    page.getViewById("intakeFormServicesRepeater").items = intakeFormServices
}
