import ko from "knockout";

import config from "../config";
import log from "./log";

export default class DepositReturn {
  constructor() {
    this.studentName = '';
    this.deposits = [];
    ko.track(this);
  }

  getDeposits() {
    config.getJSON('/api/deposits/' + encodeURIComponent(this.studentName))
      .done(data => this.deposits = data);
  }

  cashOutDeposit(id) {
    config.ajax({
      url: '/data/deposits/' + id,
      type: 'DELETE'
    }).done(() => {
      // remove it from the displayed list
      let index = this.deposits.findIndex(d => d.id === id);
      this.deposits.splice(index, 1);

      log.addItem('Pfandrückgabe', -config.depositPrice);
    });
  }
}
