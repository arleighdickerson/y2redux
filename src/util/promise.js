export function runQueue(promises) {
  return new Promise((resolve, reject) => {
    const shift = (accum = []) => {
      promises.shift().then(v => {
        accum.push(v)
        promises.length > 0 ? resolve(accum) : shift(accum)
      }).catch(e => reject(e))
    }
    promises.length > 0 ? shift() : []
  })
}

/*
function Deferred(){
  this._done = [];
  this._fail = [];
}
Deferred.prototype = {
  execute: function(list, args){
    var i = list.length;

    // convert arguments to an array
    // so they can be sent to the
    // callbacks via the apply method
    args = Array.prototype.slice.call(args);

    while(i--) list[i].apply(null, args);
  },
  resolve: function(){
    this.execute(this._done, arguments);
  },
  reject: function(){
    this.execute(this._fail, arguments);
  },
  done: function(callback){
    this._done.push(callback);
  },
  fail: function(callback){
    this._fail.push(callback);
  }
}
*/
