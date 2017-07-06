import * as util from "./util";
import {Stream} from "stream";
import {
  PAYLOAD_CLOSE,
  PAYLOAD_DATA,
  PAYLOAD_END,
  PAYLOAD_NEW_STREAM,
  PAYLOAD_PAUSE,
  PAYLOAD_RESUME
} from "./BinaryClient";

export class BinaryStream extends Stream {
  constructor(socket, id, create, meta) {
    super()
    this.id = id
    this._socket = socket

    this.writable = true
    this.readable = true
    this.paused = false

    this._closed = false
    this._ended = false

    if (create) {
      this._write(PAYLOAD_NEW_STREAM, meta, this.id)
    }
  }

  write(data) {
    if (this.writable) {
      let out = this._write(PAYLOAD_DATA, data, this.id);
      return !this.paused && out;
    } else {
      this.emit('error', new Error('Stream is not writable'));
      return false;
    }
  }

  pause() {
    if (!this.paused) {
      this._onPause();
      this._write(PAYLOAD_PAUSE, null, this.id);
    }
  }

  resume() {
    if (this.paused) {
      this._onResume();
      this._write(PAYLOAD_RESUME, null, this.id);
    }
  }

  end() {
    if (!this._ended) {
      this._onEnd()
      this._write(PAYLOAD_END, null, this.id);
    }
  }

  close() {
    if (!this._closed) {
      this.end()
      this._onClose();
      this._write(PAYLOAD_CLOSE, null, this.id);
    }
  }

  _write(code, data, bonus) {
    if (this._socket.readyState !== this._socket.constructor.OPEN) {
      return false;
    }
    let message = util.pack([code, data, bonus]);
    return this._socket.send(message) !== false;
  }

  _onData(data) {
    this.emit('data', data);
  }

  _onPause() {
    this.paused = true;
    this.emit('pause');
  }

  _onResume() {
    this.paused = false;
    this.emit('resume');
  }

  _onEnd() {
    this._ended = true;
    this.readable = false;
    this.emit('end');
  }

  _onClose() {
    this.readable = false;
    this.writable = false;
    this._closed = true;
    this.emit('close');
  }

  _onError(error) {
    this.readable = false;
    this.writable = false;
    this.emit('error', error);
  }
}
