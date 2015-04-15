import ko from "knockout";

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
    return this.items.filter(item => item.selected).reduce((acc, item) => acc + item.amount, 0);
  }

  get formatter() { return formatter; }
}

export default new Log();
