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
    Padding_before = request.input('padding_before')
    Padding_after = request.input('padding_after')

    // create service
    const service =  await AddService.create({
      user_id: userId,
      image: cleanStrings(V_Image, "string"),
      name: cleanStrings(Name, "string"),
      price: cleanStrings(Price, "int"),
      category: cleanStrings(Category, "string"),
      description: cleanStrings(Description, "string"),
      rgba_colour: cleanStrings(Rgba_colour, "string"),
      padding_before: cleanStrings(Padding_before, "int"),
      padding_after: cleanStrings(Padding_after, "int")
    })

    return {"status" : "success"}

  }

}

module.exports = AddServiceController
