'use strict'
const User = use('App/Models/User')
const getStream = use('get-stream')
const Database = use('Database')

class UploadPhotoController {

  async uploadPhoto ({ request }) {
    const scenarioFiles = []

    request.multipart.file('scenario_files[]', {}, async function (file) {
      const fileContent = await getStream.buffer(file.stream)

      const user = await User.query().where('username', request.username).where('is_active', true).first()

      scenarioFiles.push({
        user_id : user.id,
        name: file.clientName,
        filecontents: fileContent,
        type: `${file.type}/${this.subtype}`
      })
    })

    await request.multipart.process()

    // now all files have been processed
    await Database.table('user_medias').insert(scenarioFiles)
  }

}

module.exports = UploadPhotoController
