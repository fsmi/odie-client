/* global window */
import ko from "knockout";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import $ from "jquery";

import api from "../api";
import Document from "./document";
import store from "../store";

export default class Cart {
  constructor(data) {
    Object.assign(this, {name: '', documents: []}, data);
    if (this.creation_time)
      this.date = new Date(this.creation_time);

    // preserve 'null' documents for Preselection.openCart
    this.documents = this.documents.map(d => d ? new Document(d) : null);

    ko.track(this);

    ko.defineProperty(this, 'totalPageCount', () => {
        let pages = 0;
        this.documents.forEach((val) => {
            pages += val['numberOfPages'];
        });
        return pages;
    });

    ko.defineProperty(this, 'includesOral', () =>
      this.documents.some(doc => doc.documentType.includes('oral'))
    );

    ko.defineProperty(this, 'lectureNames', () => {
      let lectures = uniq(flatten(this.documents.filter(doc => doc).map(doc => doc.lectures)));
      return lectures.map(l => l.name).sort();
    });
  }

  loadFromSessionStorage() {
    if (window.sessionStorage) {
      let data = JSON.parse(window.sessionStorage.getItem('cart'));
      if (data) {
        try {
          data = data.map(d => new Document(d));
          this.add(...data);
        } catch (e) {
          // bogus data or something, reset
          window.sessionStorage.removeItem('cart');
        }
      }
    }
  }

  flushToSessionStorage() {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('cart', JSON.stringify(this.documents));
    }
  }

  contains(doc) {
    return this.documents.some(d => d.id === doc.id);
  }

  add(...docs) {
    // make linear
    let idSet = new Set(this.documents.map(d => d.id));
    for (let d of docs)
      if (d.available && !idSet.has(d.id))
        this.documents.push(d);
    this.flushToSessionStorage();
  }

  drop(doc) {
    this.documents.remove(doc);
    this.flushToSessionStorage();
  }

  dropAll() {
    this.documents = [];
    this.flushToSessionStorage();
  }

  reset() {
    this.dropAll();
    this.name = '';
  }

  save() {
    api.post('orders', {
        name: this.name,
        document_ids: this.documents.map(doc => doc.id),
    }).done(() => {
      this.reset();
      $('#cart-save-modal').modal();
    });
  }

  priceEstimate(depositCount) {
    let price = this.totalPageCount * store.config.PRICE_PER_PAGE;
    if (depositCount === undefined) {
      if (this.includesOral) {
        price += store.config.DEPOSIT_PRICE;
      }
    }
    else {
      price += depositCount * store.config.DEPOSIT_PRICE;
    }

    // round to next-highest ten-cent unit
    return Math.ceil(price / 10) * 10;
  }

}
