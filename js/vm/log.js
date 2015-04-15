import ko from "knockout";
import sum from "lodash/collection/sum";

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

    ko.track(this);
  }

  addItem(description, amount) {
    this.items.push(new LogItem(description, amount));
    this.items.forEach(item => item.selected = false);
  }

  get totalAmount() {
    return sum(this.items.filter(item => item.selected), 'amount');
  }

  get formatter() { return formatter; }
}

export default new Log();
