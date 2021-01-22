'use strict'
const User = use('App/Models/User')
const UserAttr = use('App/Models/UserAttr')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Database = use('Database')

class AccountDetailsController {
    async getAccountDetails({ request, session, response }) {
        console.log("Getting account details data");
        try {
            const userID = request.all().auth.userID;
            const userQuery = await User.query().where('id', userID).first()
            const instagram = await UserAttr.query().where('user_id', userID).where('attr', 'instagram').first()
            const salonName = await UserAttr.query().where('user_id', userID).where('attr', 'salon_name').first()
            let accountDetails = {
                firstName: userQuery.firstName,
                lastName: userQuery.lastName,
                email: userQuery.email,
                phoneNumber: userQuery.phoneNumber,
                instagram: instagram.value,
                salon_name: salonName.value
            }
            console.log(accountDetails)
            return { "status": "success", "accountDetails": accountDetails }
        } catch (e) {
            console.log(e)
            console.log("no account details found")
        }
        return { "status": "error" }
    }

    async addAccountDetails({ request, session, response }) {
        console.log("Setting account details data");
        const userID = request.all().auth.userID
        const content = JSON.parse(request.all().content)
        try {
            if (content.firstName) {
                const query = await Database
                    .table('users').where('id', userID)
                    .update('firstName', cleanStrings(content.firstName, "string"))
            }
            if (content.lastName) {
                const query = await Database
                    .table('users').where('id', userID)
                    .update('lastName', cleanStrings(content.lastName, "string"))
            }
            if (content.salonName) {
                const exsists = await Database
                    .table('user_attrs').where('user_id', userID)
                    .where('attr', "salon_name").first()
                if (exsists) {
                    const query = await Database
                        .table('user_attrs').where('user_id', userID).where('attr', "salon_name")
                        .update('value', cleanStrings(content.salonName, "string"))
                } else {
                    const query = await UserAttr.create({
                        user_id: userID,
                        attr: "salon_name",
                        value: content.salonName,
                    })
                }
            }
            if (content.email) {
                const exsists = await Database.table('user_attrs').where('user_id', userID).where('attr', "old_email").first()
                const oldValue = await Database.table('users').where('id', userID).first()
                console.log(oldValue.email)
                if (exsists) {const query = await Database.table('user_attrs').where('user_id', userID).where('attr', "old_email").update('value', cleanStrings(oldValue.email, "string"))
                } else {
                    const query = await UserAttr.create({user_id: userID, attr: "old_email", value: oldValue.email, })
                }
                const query = await Database.table('users').where('id', userID).update('email', cleanStrings(content.email, "string"))
            }
            if (content.phoneNumber) {
                const query = await Database
                    .table('users').where('id', userID)
                    .update('phoneNumber', cleanStrings(content.phoneNumber, "string"))
            }
            if (content.instagram) {
                const exsists = await Database
                    .table('user_attrs').where('user_id', userID)
                    .where('attr', "instagram").first()
                if (exsists) {
                    const query = await Database
                        .table('user_attrs').where('user_id', userID).where('attr', "instagram")
                        .update('value', cleanStrings(content.instagram, "string"))
                } else {
                    const query = await UserAttr.create({
                        user_id: userID,
                        attr: "instagram",
                        value: content.instagram,
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
        return { "status": "success" }
    }
}

module.exports = AccountDetailsController
