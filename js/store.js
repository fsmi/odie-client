import api from "./api";

// stores api responses assumed to be constant over the lifetime of the app
let store = {
  started: 0,
  loaded: 0,
  _onLoaded: [],

  load(endpoint, callback) {
    this.started++;
    api.getJSON(endpoint).done(resp => {
      this[endpoint] = resp.data;
      this.loaded++;
      if (callback)
        callback(resp.data);
      if (this.loaded === this.started)
        for (let callback of this._onLoaded)
          callback();
    });
  },

  ensureLoaded(callback) {
    if (this.loaded !== this.started)
      this._onLoaded.push(callback);
    else
      callback();
  },
};

store.load('config');

function mkIdMap(data) {
  let m = new Map();
  for (let d of data)
    m.set(d.id, d);
  return m;
}

store.load('examinants', data => store.examinantsById = mkIdMap(data));
store.load('lectures', data => store.lecturesById = mkIdMap(data));

export default store;
