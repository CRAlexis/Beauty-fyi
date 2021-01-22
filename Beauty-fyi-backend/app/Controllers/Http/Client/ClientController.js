'use strict'
const Database = use('Database')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const UserClient = use('App/Models/UserClient')
class ClientController {
    async getClients({ request, session, response }) {
        try {
            const content = request.all().content;
            const userID = request.all().auth.userID
            const row = content.row
            let continueRequests = true
            let clientProfiles = []
            const query = await Database.table('user_clients').where('user_id', userID).paginate(row, 10)
            await new Promise((resolve, reject) => {
                let index = 0
                query.data.forEach(async element => {
                    const clientID = element.client_id
                    const userQuery = await Database.table('users').where('id', clientID).first()
                    clientProfiles.push({
                        firstName: userQuery.firstName,
                        lastName: userQuery.lastName,
                        clientID: clientID
                    })
                    index++
                    if (index == query.data.length) {
                        resolve()
                    }    
                })
            })
            let total = query.total
            let page = query.page
            let perPage = query.perPage
            if (page * perPage >= total) {
                continueRequests = false
            } else {
                continueRequests = true
            }
            return { status: "success", clients: clientProfiles, continueRequests: continueRequests }
        } catch (error) {
            console.log(error)
        }
    }

    async clientGetImage({ request, response }) {
        console.log("getting image")
        const clientID = request.all().content.clientID
        const query = await Database.table('client_medias').where('user_id', clientID).first()
        let image;
        image = query.file_path
        console.log("Got client image: " + image)
        response.download(
            Helpers.tmpPath(image),
        )
    }

}

module.exports = ClientController
