import {decode, encode} from "msgpack-lite";

export const pack = encode
export const unpack = data => decode(new Uint8Array(data))

export const nextTick = (() => {
  let queue = []
    , dirty = false
    , fn
    , hasPostMessage = !!window.postMessage
    , messageName = 'nexttick';

  function flushQueue() {
    while (fn = queue.shift()) {
      fn();
    }
    dirty = false;
  }

  let trigger = (function () {
    return hasPostMessage
      ? function () {
        window.postMessage(messageName, '*')
      }
      : function () {
        setTimeout(function () {
          processQueue();
        }, 0)
      };
  }());
  let processQueue = (function () {
    return hasPostMessage
      ? function (event) {
        if (event.source === window && event.data === messageName) {
          event.stopPropagation();
          flushQueue();
        }
      }
      : flushQueue;
  })();

  function nextTick(fn) {
    queue.push(fn);
    if (dirty) return;
    dirty = true;
    trigger();
  }

  hasPostMessage
  && (nextTick.listener = window.addEventListener('message', processQueue, true));

  nextTick.removeListener = function () {
    window.removeEventListener('message', processQueue, true);
  }

  return nextTick;
})();
