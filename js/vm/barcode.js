/* global EventSource */
import ko from "knockout";

import api from "../api";
import Document from "./document";
import store from "../store";
import user from "./user";

export default class BarcodeScanner {
  constructor(cart) {
    this.cart = cart;
    this.stream = null;
    this.selectedScanner = null;
    this.isActive = false;
    this.scanners = [];

    ko.track(this);

    store.ensureLoaded(() => {
      this.scanners = user.officeConfig.scanners;
      this.selectedScanner = this.scanners[0];
    });

    ko.getObservable(user, 'office').subscribe(() => {
      this.scanners = user.officeConfig.scanners;
      this.selectedScanner = this.scanners[0];
    });

  }

  cleanUp() {
    this.stream.close();
    this.isActive = false;
  }

  toggleButton() {
    if (this.isActive) {
      this.cleanUp();
    }
    else {
      let idx = this.scanners.indexOf(this.selectedScanner);
      this.stream = new EventSource(api.baseUrl + `scanner/${user.office}/${idx}`);
      this.stream.onerror = () => { this.cleanUp(); };
      this.stream.onmessage = (msg) => {
        this.cart.add(new Document(JSON.parse(msg.data)));
      };
      this.isActive = true;
    }
  }

}
