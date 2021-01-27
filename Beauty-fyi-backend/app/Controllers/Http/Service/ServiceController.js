'use strict'
const { uploadMedia } = require("../../media/uploadMedia")
const Service = use('App/Models/Service')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const ServiceSteps = use('App/Models/ServiceStep')
const ServiceAddon = use('App/Models/ServiceAddon')
const Database = use('Database')
const Helpers = use('Helpers')
class ServiceController {
    async AddService({ request, session, response }) {
        let auth;
        let content;
        let uploadedFiles
        let serviceSteps;
        let serviceAddons;
        await request.multipart.field((name, value) => {
            if (name == "auth") { auth = JSON.parse(value) }
            if (name == "content") { content = JSON.parse(value) }
        })
        try {


            //const trx = await Database.beginTransaction()
            uploadedFiles = await uploadMedia(request, "serviceMedia")

            // create service
            const service = await Service.create({
                user_id: auth.userID,
                image_one: uploadedFiles.images[0] ? uploadedFiles.images[0] : null,
                image_two: uploadedFiles.images[1] ? uploadedFiles.images[1] : null,
                image_three: uploadedFiles.images[2] ? uploadedFiles.images[2] : null,
                image_four: uploadedFiles.images[3] ? uploadedFiles.images[3] : null,
                image_five: uploadedFiles.images[4] ? uploadedFiles.images[4] : null,
                image_six: uploadedFiles.images[5] ? uploadedFiles.images[5] : null,
                name: cleanStrings(content.serviceName, "string"),
                price: cleanStrings(content.servicePrice, "int"),
                category: cleanStrings(content.serviceCategory, "string"),
                description: cleanStrings(content.serviceDescription, "string"),
                rgba_colour: content.rgbaColour._argb ? content.rgbaColour._argb : null,
                padding_before: content.paddingBefore ? cleanStrings(content.paddingBefore, "int") : null,
                padding_after: content.paddingAfter ? cleanStrings(content.paddingAfter, "int") : null,
                form_ID: content.serviceForm ? cleanStrings(content.serviceForm, "int") : null,
                optional_question: cleanStrings(content.optionalQuestion, "string"),
                payment_type: cleanStrings(content.paymentType, "string"),
            } /*trx*/)

            content.serviceSteps.forEach(async element => {
                serviceSteps = await ServiceSteps.create({
                    user_id: auth.userID,
                    service_id: service.id,
                    index: element.index,
                    name: element.stepName ? element.stepName : "",
                    duration: element.stepDuration ? element.stepDuration : 0,
                    capture_footage_in_this_step: element.checked ? 1 : 0,
                } /*trx*/)
            });

            content.serviceAddons.forEach(async element => {
                serviceAddons = await ServiceAddon.create({
                    user_id: auth.userID,
                    service_id: service.id,
                    index: element.index,
                    name: element.addonName ? element.addonName : "",
                    price: element.addonPrice ? element.addonPrice : 0,
                    duration: element.addonDuration ? element.addonDuration : 0,
                } /*trx*/)
            });

            if (content.serviceForm) {
                const query = await Database
                    .table('service_forms')
                    .where('id', content.serviceForm).where("user_id", auth.userID)
                    .update('active', 1)
                console.log("set service form to active")
            }
            //await trx.commit()
        } catch (error) {
            console.log(error)
        }
        return { "status": "success" }
    }

    async deleteService({ request, session, response }) {
        const userID = request.all().auth.userID
        const content = request.all().content
        const serviceID = content.serviceID
        console.log(serviceID)
        try {
            const query = await Database
                .table('services')
                .where('id', serviceID).where("user_id", userID)
                .update('deleted', 1).update('active', 0)
            console.log("deleted service: " + query)

            const queryTwo = await Database.table('services').where('id', serviceID).where("user_id", userID).first()
            const serviceFormID = queryTwo.form_id
            if (serviceFormID){
                const servicesUsingForm = await Database.table('services').where("form_id", serviceFormID)
                if (servicesUsingForm.length == 1) {
                    await Database
                        .table('service_Forms').where('id', serviceFormID).where("user_id", userID).update("active", 0)
                    console.log("set form to not active")
                }
            }
            return { status: "success" }
        } catch (error) {
            //console.log(error)
            return { status: "error" }
        }

    }

    async setServiceActive({ request, session, response }) {
        const userID = request.all().auth.userID
        const content = request.all().content
        const serviceID = content.serviceID
        const active = content.active
        try {
            const query = await Database
                .table('services')
                .where('id', serviceID).where("user_id", userID)
                .update('active', cleanStrings(active, "boolean"))
            console.log(query)
            return { status: "success" }
        } catch (error) {
            console.log(error)
        }
    }

    async getServiceImage({ request, session, response }) {
        const serviceID = request.all().content.serviceID
        const index = request.all().content.index
        const query = await Database.table('services').where('id', serviceID).where("deleted", 0).first()
        let image;
        switch (index) {
            case 0: image = query.image_one; break
            case 1: image = query.image_two; break
            case 2: image = query.image_three; break
            case 3: image = query.image_four; break
            case 4: image = query.image_five; break
            case 5: image = query.image_six; break
        }
        console.log("serviceID: " + serviceID + " at index " + index)
        response.download(
            Helpers.tmpPath(image),
        )
    }

    async getServiceData({ request, session, response }) {
        const userID = request.all().auth.userID
        const content = request.all().content
        const serviceID = content.serviceID
        const row = content.row
        let continueRequests = true
        try {
            const query = await Database.table('services').where('user_id', userID).where("active", 1).where("deleted", 0).paginate(row, 10)
            let total = query.total
            let page = query.page
            let perPage = query.perPage
            if (page * perPage >= total) {
                continueRequests = false
            } else {
                continueRequests = true
            }
            return { status: "success", service: query.data, continueRequests: continueRequests }
        } catch (error) {
            console.log(error)
            return { status: "error" }
        }
    }

    async getAddonData({ request, session, response }) {
        const userID = request.all().auth.userID
        const content = request.all().content
        const serviceID = content.serviceID
        try {
            const query = await Database.table('service_addons').where('service_id', serviceID)
            return { addons: query }
        } catch (error) {
            console.log(error)
        }
    }

    async getServiceTime({ request, session, response }) {
        const content = request.all().content
        const serviceID = content.serviceID
        let serviceTime = 0;
        let hours;
        let minutes;
        try {
            const query = await Database.table('service_steps').where('service_id', serviceID)
            await query.forEach(element => { serviceTime += parseInt(element.duration) })
            serviceTime = Math.round(serviceTime / 5) * 5
            if (serviceTime > 179) { hours = 3; minutes = serviceTime - 180 } else
                if (serviceTime > 119) { hours = 2; minutes = serviceTime - 120 } else
                    if (serviceTime > 60) { hours = 1; minutes = serviceTime - 60 } else { return { time: serviceTime + " minutes" } }
            return { time: hours + " hour " + minutes + " minutes" }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ServiceController
