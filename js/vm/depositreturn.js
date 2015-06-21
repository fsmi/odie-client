import ko from "knockout";

import api from "../api";
import log from "./log";
import store from "../store";

export default class DepositReturn {
  constructor() {
    this.studentName = '';
    this.deposits = [];
    ko.track(this);
  }

  getDeposits() {
    api.getJSON('deposits/' + encodeURIComponent(this.studentName))
      .done(data => this.deposits = data);
  }

  cashOutDeposit(id) {
    api.ajax({
      url: 'deposits/' + id,
      type: 'DELETE'
    }).done(() => {
      // remove it from the displayed list
      let index = this.deposits.findIndex(d => d.id === id);
      this.deposits.splice(index, 1);

      log.addItem('Pfandrückgabe', -store.config.DEPOSIT_PRICE);
    });
  }
}
