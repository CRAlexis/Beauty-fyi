'use strict'
const Service = use('App/Models/Service')
const ServiceForm = use('App/Models/ServiceForm')
const ServiceQuestion = use('App/Models/ServiceQuestion')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Database = use('Database')

class ServiceFormController {
    async addForm({ request, session, response }) {
        let userID = request.all().auth.userID;
        const content = request.all().content
        let formName = content.formName
        try {
            const serviceForm = await ServiceForm.create({
                user_id: userID,
                active: 0,
                form_name: cleanStrings(formName, "string")
            })

            await new Promise((resolve, reject) => {
                let index = 0
                content.formQuestion.forEach(async element => {
                    const serviceQuestion = await ServiceQuestion.create({
                        form_id: serviceForm.id,
                        question_index: element.index,
                        question_type_index: element.key,
                        question: cleanStrings(element.question, "string").trim(),
                        question_options: element.options ? cleanStrings(element.options, "string") : null
                    })
                    index++
                    if (index == content.formQuestion.length) {
                        resolve()
                    }
                })
            })
            return { "status": "success", "serviceFormID": serviceForm.id }
        } catch (error) {
            console.log(error)
            return { "status": "error" }
        }
    }


    async connectFormToService({ request, session, response }) {
        try {
            let userID = request.all().auth.userID;
            const content = request.all().content
            const serviceIDs = content.serviceIDs
            let serviceFormID = content.serviceFormID
            console.log(serviceIDs)

            await new Promise((resolve, reject) => {
                let index = 0
                serviceIDs.forEach(async element => {
                    const query = await Database
                        .table('services')
                        .where('id', element.serviceID).where("user_id", userID)
                        .update('form_id', serviceFormID)
                    index++
                    if (index == serviceIDs.length) {
                        resolve()
                    }
                })
            })
            const query = await Database
                .table('service_forms')
                .where('id', serviceFormID).where("user_id", userID)
                .update('active', 1)
            return { "status": "success" }
        } catch (error) {
            console.log(error)
            //return { "status": "error" }
        }
    }

    async getForms({ request, response }) {
        console.log("Getting form data");
        try {
            const userID = request.all().auth.userID;
            const serviceForms = await ServiceForm.query().where('user_id', userID).fetch()
            return { "status": "success", "serviceForms": serviceForms }
        } catch (e) {
            console.log("no services found")
        }
        return { "status": "error" }
    }

    async getFormQuestions({ request, response }) {
        console.log("hit")
        let serviceFormID = request.all().content.serviceFormID
        console.log("Getting form questions");
        try {
            const userID = request.all().auth.userID;
            const serviceFormQuestions = await ServiceQuestion.query().where("form_id", serviceFormID).fetch()
            return { "status": "success", "serviceFormQuestions": serviceFormQuestions }
        } catch (e) {
            console.log(e)
            console.log("no service questions found")
        }
        return { "status": "error" }
    }

    
}

module.exports = ServiceFormController
