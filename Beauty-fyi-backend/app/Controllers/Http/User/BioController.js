'use strict'

const Bio = use('App/Models/Bio')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class BioController {

  async AddBio ({ request, session, response }){
    console.log("1")
    var text = request.all().content.bio.trim()
    var userID = request.all().auth.userID;

    console.log(text)

    // create bio
    try{
    const bio =  await Bio.create({
      user_id: userID,
      bio: cleanStrings(text, "string"),
    })
  }catch(e){
    console.log(e)
  }

    return {"status" : "success"}

  }

  async GetBio ({ request, session, response }){
    console.log("bio starting...");

    try{
    var userID = request.all().auth.userID;

    //Get data by user_id
    const bio = await Bio.query().where('user_id', userID).first()

    return {"status" : "success", "bio" : bio.bio}
    }catch(e){
      console.log(e)
    }

    return {"status" : "error"}

  }

}

module.exports = BioController
