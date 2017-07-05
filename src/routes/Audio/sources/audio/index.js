import BinaryClient from './BinaryClient'

let _isRecording = false
let _client = null
let _outbound = null

function setClient(newClient) {
  disconnect()
  _client = newClient
  if (!_client) {
    return
  }
  _client.on('stream', inbound => {
    _nextTime = 0;
    let init = false;
    let audioCache = [];

    console.debug('>>> Receiving Audio Stream');

    inbound.on('data', data => {
      let array = new Float32Array(data);
      let buffer = speakerContext.createBuffer(1, 2048, 44100);
      buffer.copyToChannel(array, 0);
      audioCache.push(buffer);
      // make sure we put at least 5 chunks in the buffer before starting
      if ((init === true) || ((init === false) && (audioCache.length > 5))) {
        init = true;
        playCache(audioCache);
      }
    });

    inbound.on('end', () => console.debug('||| End of Audio Stream'))
  })
}

// ========================================================
// Devices
// ========================================================

let _nextTime = 0
let _recorder = null

const audioContext = window.AudioContext || window.webkitAudioContext;

const mediaDevices = (() => {
  const mediaDevices = navigator.mediaDevices ||
    ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
      getUserMedia: function (c) {
        return new Promise(function (y, n) {
          (navigator.mozGetUserMedia ||
          navigator.webkitGetUserMedia).call(navigator, c, y, n);
        });
      }
    } : null);
  mediaDevices
    .getUserMedia({
      audio: true,
      video: false
    })
    .then(stream => {
      let context = new audioContext();
      let audioInput = context.createMediaStreamSource(stream);
      let bufferSize = 2048;
      _recorder = context.createScriptProcessor(bufferSize, 1, 1);
      // specify the processing function
      _recorder.onaudioprocess = recorderProcess;
      // connect stream to our recorder
      audioInput.connect(_recorder);
      // connect our recorder to the previous destination
      _recorder.connect(context.destination);
    })
    .catch(console.error)
  if (!mediaDevices) {
    console.error("getUserMedia() not supported.");
  }
  return mediaDevices
})()

// ========================================================
// TX
// ========================================================

const recorderProcess = e => {
  let chunk = e.inputBuffer.getChannelData(0);
  if (isRecording() && isConnected()) {
    _outbound.write(chunk);
  }
};

// ========================================================
// RX
// ========================================================

const speakerContext = new AudioContext();

const playCache = cache => {
  while (cache.length) {
    let buffer = cache.shift();
    let source = speakerContext.createBufferSource();
    source.buffer = buffer;
    source.connect(speakerContext.destination);
    if (_nextTime === 0) {
      // add a delay of 0.05 seconds
      _nextTime = speakerContext.currentTime + 0.05;
    }
    source.start(_nextTime);
    _nextTime += source.buffer.duration;
  }
};

// ========================================================
// Exports
// ========================================================

export function isConnected() {
  return !!_client && _client._socket.readyState === 1
}

export function connect(username) {
  disconnect()
  return new Promise((resolve, reject) => {
    const queryString = username ? ('?username=' + username) : ''
    const url = 'wss://' + location.host + '/ws' + queryString
    const ws = new WebSocket(url)
    const client = new BinaryClient(ws)
    client.on('open', () => resolve(true))
    client.on('error', e => reject(e))
    setClient(client)
  })
}

export function disconnect() {
  stopRecording()
  if (_client !== null) {
    _client.close()
  }
}

export function isRecording() {
  return _isRecording
}

export function startRecording() {
  if (!isConnected()) {
    throw new Error("not connected to server")
  }
  if (!isRecording()) {
    console.debug('>>> Start Recording');
    _isRecording = true
    _outbound = _client.createStream({data: 'audio'});
  }
};

export function stopRecording() {
  if (isRecording()) {
    console.debug('||| Stop Recording');
    _isRecording = false
    _outbound.end()
    _outbound.close()
    _outbound = null
  }
};

export function cleanup() {
  if (_outbound !== null) {
    _outbound.end()
  }
  if (_client !== null) {
    _client._socket.close()
  }
}
