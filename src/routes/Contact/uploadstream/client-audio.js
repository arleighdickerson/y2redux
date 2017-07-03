function createController(client) {
  client.on('stream', function (stream) {
    controller.nextTime = 0;
    var init = false;
    var audioCache = [];

    console.log('>>> Receiving Audio Stream');

    stream.on('data', function (data) {
      var array = new Float32Array(data);
      var buffer = controller.speakerContext.createBuffer(1, 2048, 44100);
      buffer.copyToChannel(array, 0);

      audioCache.push(buffer);
      // make sure we put at least 5 chunks in the buffer before starting
      if ((init === true) || ((init === false) && (audioCache.length > 5))) {
        init = true;
        controller.playCache(audioCache);
      }
    });

    stream.on('end', function () {
      console.log('||| End of Audio Stream');
    });

  });
  var controller = {};

// TX -------------------------------------------------------------------------
  controller.recording = false;

  var audioContext = window.AudioContext || window.webkitAudioContext;

  var mediaDevices = navigator.mediaDevices ||
    ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
      getUserMedia: function (c) {
        return new Promise(function (y, n) {
          (navigator.mozGetUserMedia ||
          navigator.webkitGetUserMedia).call(navigator, c, y, n);
        });
      }
    } : null);

  if (!mediaDevices) {
    console.log("getUserMedia() not supported.");
  }

  controller.device = mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  controller.device.then(function (stream) {
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;
    // create a javascript node
    controller.recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    controller.recorder.onaudioprocess = controller.recorderProcess;
    // connect stream to our recorder
    audioInput.connect(controller.recorder);
    // connect our recorder to the previous destination
    controller.recorder.connect(context.destination);
  });

  controller.device.catch(function (err) {
    console.log("The following error occured: " + err.name);
  });

  controller.recorderProcess = function (e) {
    var left = e.inputBuffer.getChannelData(0);
    if (controller.recording === true) {
      // var chunk = convertFloat32ToInt16(left);
      var chunk = left;
      console.dir(chunk);
      controller.stream.write(chunk);
    }
  };

  controller.startRecording = function () {

    if (controller.recording === false) {
      console.log('>>> Start Recording');

      //open binary stream
      controller.stream = client.createStream({data: 'audio'});
      controller.recording = true;
    }

  };

  controller.stopRecording = function () {

    if (controller.recording === true) {
      console.log('||| Stop Recording');

      controller.recording = false;

      //close binary stream
      controller.stream.end();
    }
  };
// RX -------------------------------------------------------------------------
  controller.speakerContext = new AudioContext();

  controller.playCache = function (cache) {
    while (cache.length) {
      var buffer = cache.shift();
      var source = controller.speakerContext.createBufferSource();
      source.buffer = buffer;
      source.connect(controller.speakerContext.destination);
      if (controller.nextTime == 0) {
        // add a delay of 0.05 seconds
        controller.nextTime = controller.speakerContext.currentTime + 0.05;
      }
      source.start(controller.nextTime);
      // schedule buffers to be played consecutively
      controller.nextTime += source.buffer.duration;
    }
  };

  return controller
}
module.exports = new Promise((resolve, reject) => {
  const acquire = require('./connection')
  acquire()
    .then(client => resolve(createController(client)))
    .catch(e => reject(e))
})
