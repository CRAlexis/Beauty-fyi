'use strict'

const AddEvent = use('App/Models/AddEvent')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class AddEventController {

  async AddEvent ({ request, session, response }){
    console.dir(request)
  }

}

module.exports = AddEventController
