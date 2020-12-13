'use strict'

const AddService = use('App/Models/AddService')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class AddServiceController {


  async AddService ({ request, session, response }){

    userId = 1;

    V_Image = request.input('image')
    Name = request.input('name')
    Price = request.input('price')
    Category = request.input('category')
    Description = request.input('description')
    Rgba_colour = request.input('rgba_colour')

    // create service
    const service =  await AddService.create({
      userId: user_id,
      image: cleanStrings(V_Image, "string"),
      name: cleanStrings(Name, "string"),
      price: cleanStrings(Price, "int"),
      category: cleanStrings(Category, "string"),
      description: cleanStrings(Description, "string"),
      rgba_colour: cleanStrings(Rgba_colour, "string")
    })

    return {"status" : "success"}

  }

}

module.exports = AddServiceController
