'use strict'

const AddProduct = use('App/Models/AddProduct')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class AddProductController {

  async AddProduct ({ request, session, response }){
    console.log(request.all())
  }
}

module.exports = AddProductController
