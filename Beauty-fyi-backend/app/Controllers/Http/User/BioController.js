'use strict'

const Bio = use('App/Models/Bio')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class BioController {

  async AddBio ({ request, session, response }){
    const {bio} = request.all()
    userId = 1;

    // create bio
    const bio =  await Bio.create({
      user_id: userId,
      bio: cleanStrings(bio, "string"),
    })

    return {"status" : "success"}

  }

  async GetBio ({ request, session, response }){
    console.log("bio starting...");

    userId = request.input('userId');

    //Get data by user_id
    const bio = await Bio.query().where('user_id', userId)

    return {"status" : "success", "bio" : bio}
  }

}

module.exports = BioController
