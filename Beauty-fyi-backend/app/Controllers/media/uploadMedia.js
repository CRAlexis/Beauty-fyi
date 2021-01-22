const Drive = use('Drive')
const logError = use('App/Models/LogError')

exports.uploadMedia = (request, prefix) => {
    return new Promise(async (resolve, reject)=>{
        let uploadedImages = []
        let uploadedVideos = []
        await request.multipart.file('photo[]', {}, async (file) => {
            try {
                let filePath = prefix + "/" + Date.now() + '.png'
                await Drive.put(filePath, (file.stream))//Upload file
                uploadedImages.push(filePath)
                console.log("saving png file" + filePath)
            } catch (e) {
                // return unsuccessful
                reject()
                console.log(e)
            }
        })
        await request.multipart.file('video[]', {}, async (file) => {
            try {
                let filePath = prefix + "/" + Date.now() + '.mp4'
                await Drive.put(Date.now() + '.mp4', (file.stream))//Upload file
                uploadedVideos.push(filePath)
                console.log("saving mp4 file")
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