'use strict'

const Bio = use('App/Models/Bio')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Database = use('Database')

class BioController {

  async AddBio({ request, session, response }) {
    let text = request.all().content.bio.trim()
    let userID = request.all().auth.userID;
    try {
      const bioCheck = await Database.select('bio').from('bios').where("user_id", userID).first()
      if (bioCheck) {
        console.log("updating bio: " + text)
        const affectedRows = await Database
          .table('bios')
          .where('user_id', userID)
          .update('bio', cleanStrings(text, "string"))
      } else {
        console.log("Adding bio: " + text)
        const bio = await Bio.create({
          user_id: userID,
          bio: cleanStrings(text, "string"),
        })
      }
    } catch (error) {
      console.log(error)
      // Probably log the error
    }

    return { "status": "success" }
  }

  async GetBio({ request, session, response }) {
    console.log("Getting bio data");
    try {
      const userID = request.all().auth.userID;
      const bio = await Bio.query().where('user_id', userID).first()
      return { "status": "success", "bio": bio.bio }
    } catch (e) {
      console.log("no bio found")
    }
    return { "status": "error" }
  }

}

module.exports = BioController
