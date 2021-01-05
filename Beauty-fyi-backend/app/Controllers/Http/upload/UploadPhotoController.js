'use strict'
const User = use('App/Models/User')
const UserMedia = use('App/Models/UserMedia')
const getStream = use('get-stream')
const Database = use('Database')

class UploadPhotoController {

  async uploadPhoto ({ request }) {


    const databaseObject = []
    console.log(2)
    request.multipart.file('filepathtestt', {}, async (file) => {
      const fileContent = await getStream.buffer(file.stream)
      console.log(fileContent)
      databaseObject.push({
        user_id : null,
        name: "test name",
        filecontents: fileContent,
        type: "test type",
        created_at: Database.fn.now(),
        updated_at: Database.fn.now()
      })
    })

    await request.multipart.process()

    console.log(3)
    try {
      await Database.table('user_medias').insert(databaseObject)
      //await UserMedia.query().

    } catch (error) {
      console.log(Object.keys(error))
      console.log(error.sqlMessage)
    }
    console.log(4)

    return 'success'


  }
}

module.exports = UploadPhotoController
