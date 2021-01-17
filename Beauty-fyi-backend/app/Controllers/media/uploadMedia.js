const Drive = use('Drive')
const logError = use('App/Models/LogError')

exports.uploadMedia = (request, auth) => {
    return new Promise(async (resolve, reject)=>{
        let uploadedImages = []
        let uploadedVideos = []
        await request.multipart.file('photo[]', {}, async (file) => {
            try {
                await Drive.put(Date.now() + '.png', (file.stream))//Upload file
                uploadedImages.push(Date.now() + '.png')
            } catch (e) {
                // return unsuccessful
                reject()
                console.log(e)
            }
        })
        await request.multipart.file('video[]', {}, async (file) => {
            try {
                await Drive.put(Date.now() + '.mp4', (file.stream))//Upload file
                uploadedVideos.push(Date.now() + '.mp4')
            } catch (e) {
                // return unsuccessful
                reject()
                console.log(e)
            }
        })
        await request.multipart.process()
        resolve({images: uploadedImages, videos: uploadedVideos})
    })
}