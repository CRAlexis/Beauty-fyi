'use strict'

var ffmpeg = require('ffmpeg');

class FfmpegController {

  async test(){
    try {
      var process = new ffmpeg('/path/to/your_movie.avi');
      process.then(function (video) {
        // Video metadata
        console.log(video.metadata);
        video.fnExtractFrameToJPG('/path/to/save_your_frames', {
          frame_rate : 1,
          number : 1,
          file_name : 'my_frame_%t_%s'
        }, function (error, files) {
          if (!error)
            console.log('Frames: ' + files);
        });
        // FFmpeg configuration
        console.log(video.info_configuration);
      }, function (err) {
        console.log('Error: ' + err);
      });
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
    }
  }
}

module.exports = FfmpegController
