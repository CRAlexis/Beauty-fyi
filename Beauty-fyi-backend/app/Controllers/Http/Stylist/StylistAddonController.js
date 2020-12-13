'use strict'

const StylistAddon = use('App/Models/StylistAddon')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistAddonController {

  async AddStylistAddon ({ request, session, response }){

    Index = request.input('index')
    Name = request.input('name')
    Price = request.input('price')
    Duration = request.input('duration')

    // create StylistAddon
    const stylistAddon =  await StylistAddon.create({
      index: cleanStrings(Index, "int"),
      name: cleanStrings(Name, "string"),
      price: cleanStrings(Price, "int"),
      duration: cleanStrings(Duration, "int"),
    })

    return {"status" : "success"}

  }

}

module.exports = StylistAddonController
