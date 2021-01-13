'use strict'

const AddService = use('App/Models/AddService')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class AddServiceController {


  async AddService ({ request, session, response }){

    userId = 1;
    var Code = request.all().content.code
    var V_Image = request.all().content.image
    var Name = request.all().content.name
    var Price = request.all().content.price
    var Category = request.all().content.category
    var Description = request.all().content.description
    var Rgba_colour = request.all().content.rgba_colour
    var Padding_before = request.all().content.padding_before
    var Padding_after = request.all().content.padding_after

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
