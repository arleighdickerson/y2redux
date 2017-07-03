import * as util from './util'
const {EventEmitter} = require('events')
import BinaryStream from './BinaryStream'

export const PAYLOAD_RESERVED = 0;
export const PAYLOAD_NEW_STREAM = 1;
export const PAYLOAD_DATA = 2;
export const PAYLOAD_PAUSE = 3;
export const PAYLOAD_RESUME = 4;
export const PAYLOAD_END = 5;
export const PAYLOAD_CLOSE = 6;


export class BinaryClient extends EventEmitter {
  constructor(socket) {
    super()

    const self = this

    this.streams = {}
    this._nextId = 0;

    this._socket = socket
    this._socket.binaryType = 'arraybuffer';

    const eachStream = cb => {
      for (let stream of Object.values(this.streams)) {
        cb(stream)
      }
    }

    socket.addEventListener('open', () => eachStream(s => s.emit('open')))
    socket.addEventListener('close', (code, msg) => {
      eachStream(s => s.close())
      self.emit('close', code, msg)
    })
    socket.addEventListener('error', e => eachStream(s => s._onError(e)))
    socket.addEventListener('message', ({data}, flags) => {
      util.nextTick(() => {
        try {
          const [type, payload, streamId] = util.unpack(data)
          let stream = self.streams[streamId];
          switch (type) {
            case PAYLOAD_RESERVED:
              break;
            case PAYLOAD_NEW_STREAM:
              self.emit('stream', self._receiveStream(streamId), payload);
              console.debug('>>> ' + streamId + ' receiving new stream')
              break;
            case PAYLOAD_DATA:
              if (stream) {
                console.log(payload)
                stream._onData(payload);
                console.debug('[+] ' + streamId + ' receiving data');
              } else {
                self.emit('error', new Error('Received `data` message for unknown stream: ' + streamId));
              }
              break;
            case PAYLOAD_PAUSE:
              if (stream) {
                stream._onPause();
                console.debug('||| ' + streamId + ' paused');
              } else {
                self.emit('error', new Error('Received `pause` message for unknown stream: ' + streamId));
              }
              break;
            case PAYLOAD_RESUME:
              if (stream) {
                stream._onResume();
                console.debug(' >>' + streamId + ' resumed')
              } else {
                self.emit('error', new Error('Received `resume` message for unknown stream: ' + streamId));
              }
              break;
            case PAYLOAD_END:
              if (stream) {
                stream._onEnd();
                console.debug('[-] ' + streamId + ' ended');
              } else {
                self.emit('error', new Error('Received `end` message for unknown stream: ' + streamId));
              }
              break;
            case PAYLOAD_CLOSE:
              if (stream) {
                stream._onClose();
                console.debug('[x] ' + streamId + ' closed');
              } else {
                self.emit('error', new Error('Received `close` message for unknown stream: ' + streamId));
              }
              break;
            default:
              self.emit('error', new Error('Unrecognized message type received: ' + data[0]));
          }
        }
        catch (e) {
          if (Object.getPrototypeOf(data) === ArrayBuffer.prototype) {
            throw e
          }
        }
      });
    })
  }

  send(data, meta) {
    const stream = this.createStream(meta);
    stream.write(data);
    return stream;

  }

  _receiveStream(streamId) {
    const stream = new BinaryStream(this._socket, streamId, false);
    stream.on('close', () => delete this.streams[streamId])
    this.streams[streamId] = stream;
    return stream
  }

  createStream(meta = {}) {
    if (this._socket.readyState !== WebSocket.OPEN) {
      throw new Error('Client is not yet connected or has closed');
    }
    const streamId = this._nextId;
    this._nextId += 2;
    const stream = new BinaryStream(this._socket, streamId, true, meta);
    stream.on('close', () => delete this.streams[streamId])
    this.streams[streamId] = stream
    return stream
  }

  close() {
    this._socket.close();
  }
}

export default BinaryClient
