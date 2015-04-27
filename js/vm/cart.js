import ko from "knockout";
import flatten from "lodash/array/flatten";
import sum from "lodash/collection/sum";

import config from "../config";
import user from "./user";

export default class Cart {
  constructor() {
    this.name = '';
    this.documents = [];
    ko.track(this);

    ko.defineProperty(this, 'totalPageCount', () => sum(this.documents, 'pages'));

    ko.defineProperty(this, 'includesOral', () =>
      this.documents.some(doc => doc.examType == "oral")
    );

    ko.defineProperty(this, 'lectures', () =>
      flatten(this.documents.map(doc => doc.lectures))
    );
  }

  contains(doc) {
    return this.documents.some(d => d.id == doc.id);
  }

  add(doc) {
    if (!this.contains(doc)) {
      this.documents.push(doc);
    }
  }

  drop(doc) {
    this.documents.remove(doc);
  }

  dropAll() {
    this.documents = [];
  }

  reset() {
    this.dropAll();
    this.name = '';
  }

  save() {
    if (this.length === 0) {
      alert("Bitte wähle zuerst ein paar Protokolle oder Klausuren aus.");
      return;
    }
    if (this.name === '') {
      alert("Bitte gib' zuerst deinen Namen (oder ein Pseudonym) an.");
      return;
    }
    config.post(
        '/data/carts/' + encodeURIComponent(this.name),
        this.documents.map(doc => doc.id)
    ).done(() => this.reset());
  }

  priceEstimate(depositCount) {
    let price = this.totalPageCount * config.pricePerPage;
    if (depositCount === undefined) {
      if (this.includesOral) {
        price += config.depositPrice;
      }
    }
    else {
      price += depositCount * config.depositPrice;
    }

    // round to next-highest ten-cent unit
    return Math.ceil(price / 10) * 10;
  }

  get config() { return config; }
  get user() { return user; }
}
