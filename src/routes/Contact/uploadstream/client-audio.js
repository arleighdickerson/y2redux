function createController(client) {
  ss(socket).on('audio', function (stream) {
    console.debug(stream);
    controller.nextTime = 0;
    let init = false;
    let audioCache = [];

    console.log('>>> Receiving Audio Stream');

    stream.on('data', function (data) {
      let array = new Float32Array(data.buffer)
      let buffer = controller.speakerContext.createBuffer(1, 2048, 44100);
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


  let controller = {};

// TX -------------------------------------------------------------------------
  controller.recording = false;

  let audioContext = window.AudioContext || window.webkitAudioContext;

  let mediaDevices = navigator.mediaDevices ||
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
    let context = new audioContext();
    let audioInput = context.createMediaStreamSource(stream);
    let bufferSize = 2048;
    // create a javascript node
    controller.recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    controller.recorder.onaudioprocess = controller.recorderProcess;
    // connect stream to our recorder
    audioInput.connect(controller.recorder);
    // connect our recorder to the previous destination
    controller.recorder.connect(context.destination);
  });

  controller.device.catch(console.error)

  function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
  }

  controller.recorderProcess = function (e) {
    let chunk = e.inputBuffer.getChannelData(0);
    if (controller.recording === true) {
      controller.stream.write(new ss.Buffer(chunk.buffer))
    }
  };

  controller.startRecording = function () {

    if (controller.recording === false) {
      console.log('>>> Start Recording');
      //open binary stream
      controller.stream = createStream()
      controller.recording = true;
      ss(socket).emit('audio', controller.stream)
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
      let buffer = cache.shift();
      let source = controller.speakerContext.createBufferSource();
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
}
module.exports = new Promise((resolve, reject) => {
  require('./connection')()
    .then(client => resolve(createController(client)))
    .error(e => reject(e))
})
