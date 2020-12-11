let questions = [];

exports.initAddFormPage = (args) =>{
    //args.object.page.getViewById("continueButton").text = 
}

exports.addQuestion = (args) =>{
    const mainView = args.object;
    let context = mainView.optionContext.split(",")

    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
        if (result.localeCompare("Textbox") == '0'){ createQuestion(args, 1) }
        if (result.localeCompare("Drop down list") == '0') { createQuestion(args, 2) }
        if (result.localeCompare("Yes/No choice") == '0') { createQuestion(args, 3) }
    })
}

exports.removeQuestion = (args) => {
    const page = args.object.page
    var listview = page.getViewById("addFormListView")
    const length = listview.items.length
    const index = args.object.index
    console.log(index)
    if (length > 0) {
        questions.splice(index - 1, 1)
        let questionsHolder = questions
        questions = []
        let i = 1;
        questionsHolder.forEach(element => {
            questions.push({
                index: i,
                id: element.id,
                id2: element.id2,
                questionType: element.questionType,
                text: page.getViewById(element.id).text,
                textViewText: page.getViewById(element.id2).text,
                visibilityDropDown: element.visibilityDropDown
            })
            i++
        });
    }
    listview.items = [];
    listview.items = questions;
}

function createQuestion(args, type){
    const page = args.object.page
    var listview = page.getViewById("addFormListView")
    let id = 1
    try { id = listview.items.length + 1 } catch (error) { }

    questions = []
    try { listview.items.forEach(element => {    
            questions.push({
                index: element.index,
                id: element.id,
                id2: element.id2,
                questionType: element.questionType,
                text: page.getViewById(element.id).text,
                textViewText: page.getViewById(element.id2).text,
                visibilityDropDown: element.visibilityDropDown
            })
        });
       
    } catch (error) { }
    
    
    switch (type) {
        case 1:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'textbox',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'collapsed'
                },
            )
            break;
        case 2:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'dropdown',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'visible'
                },
            )
            break;
        case 3:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'checkbox',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'collapsed'
                },
            )
            break;
        default:
            break;
    }
    
    try {
        listview.items = [];
        listview.items = questions;
    } catch (error) {
     
    }
}