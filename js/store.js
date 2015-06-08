import config from "./config";

// stores entity collections assumed to be constant over the lifetime of the app
let store = {
  endpoints: ['lectures', 'examinants'],
  loaded: false,
  _onLoaded: [],

  load() {
    let loaded = 0;
    for (let endpoint of this.endpoints) {
      config.getJSON(`/api/${endpoint}`).done(resp => {
        this[endpoint] = resp.data;
        let m = new Map();
        for (let d of resp.data)
          m.set(d.id, d);
        this[`${endpoint}ById`] = m;
        loaded++;
        if (loaded === this.endpoints.length) {
          this.loaded = true;
          for (let callback of this._onLoaded)
            callback();
        }
      });
    }
  },

  ensureLoaded(callback) {
    if (!this.loaded)
      this._onLoaded.push(callback);
    else
      callback();
  }
};

store.load();

export default store;
