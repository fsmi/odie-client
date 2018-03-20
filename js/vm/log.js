/* global window */
import ko from "knockout";
import sum from "lodash/sum";

import formatter from "../ko/formatter";

export class LogItem {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
    this.selected = false;

    ko.track(this);
  }
}

export class Log {
  constructor() {
    this.items = [];
    this.givenAmount = null;

    ko.track(this);

    if (window.sessionStorage) {
      let data = JSON.parse(window.sessionStorage.getItem('log'));
      if (data) {
        this.items = data.map(d => new LogItem(d.description, d.amount));
      }
    }
  }

  addItem(description, amount) {
    this.items.push(new LogItem(description, amount));
    this.items.forEach(item => item.selected = false);
    if (window.sessionStorage) {
      window.sessionStorage.setItem('log', JSON.stringify(this.items));
    }
  }

  get totalAmount() {
    let monetaryLogs = this.items.filter(item => item.amount !== undefined);
    let selectedMonetaryLogs = monetaryLogs.filter(item => item.selected);
    return sum(selectedMonetaryLogs.length > 0 ? selectedMonetaryLogs : monetaryLogs, 'amount');
  }

    get returnAmount() {
        let givenCents = this.givenAmount * 100;
        return givenCents - this.totalAmount;
    }

  get formatter() { return formatter; }
}

export default new Log();
