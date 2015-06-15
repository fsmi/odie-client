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

    ko.defineProperty(this, 'totalPageCount', () => sum(this.documents, 'numberOfPages'));

    ko.defineProperty(this, 'includesOral', () =>
      this.documents.some(doc => doc.documentType !== 'written')
    );

    ko.defineProperty(this, 'lectures', () =>
      flatten(this.documents.map(doc => doc.lectures))
    );
  }

  clone() {
    let miniMe = new Cart();
    miniMe.name = this.name;
    miniMe.documents = this.documents.slice();
    return miniMe;
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
    config.post('/api/orders', {
        name: this.name,
        document_ids: this.documents.map(doc => doc.id)
    }).done(() => this.reset());
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
