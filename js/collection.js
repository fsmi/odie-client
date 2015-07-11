import ko from "knockout";
import { sortByOrder } from "lodash";

import api from "./api";

/** An SQL-like filter that can be evaluated both client- and server-side */
export class Filter {
  /**
   * @param {string}  params.column
   * @param {string}  params.operator
   * @param {*}       [params.value='']
   * @param {boolean} [params.disableOnEmpty=false] - whether an empty value should disable the filter
   */
  constructor(params) {
    Object.assign(this, { value: '' }, params);

    ko.track(this);
  }

  get asJSON() {
    if (this.disableOnEmpty && !this.value)
      return null;

    return {
      column: this.column,
      operator: this.operator,
      value: this.value
    };
  }

  filter(items) {
    if (this.disableOnEmpty && !this.value)
      return items;

    return items.filter(x => Filter.opImpls[this.operator](x[this.column], this.value));
  }
}

Filter.opImpls = {
  ['==']: (x, y) => x === y,
  ['!=']: (x, y) => x !== y,
};

// Much easier than supporting any 'LIKE' filters...
export class SubstringFilter {
  /**
   * @param {string}  params.column
   * @param {*}       [params.value='']
   */
  constructor(params) {
    Object.assign(this, { value: '' }, params);

    ko.track(this);
  }

  get asJSON() {
    return {
      column: this.column,
      operator: 'ilike',
      value: `%${this.value}%`
    };
  }

  filter(items) {
    return items.filter(x => x[this.column].toLowerCase().includes(this.value.toLowerCase()));
  }
}

/** A server-backed collection of entities. Supports sorting, filtering and paged loading. */
export default class Collection {
  /**
   * @param {string}  [params.endpoint]
   * @param {Filter[]} [params.filters=[]]
   * @param {Object}  [params.sortBy]
   * @param {string}  params.sortBy.column
   * @param {boolean} params.sortBy.asc
   * @param {function(respObj: Object): *} [params.deserialize]
   */
  constructor(params) {
    Object.assign(this, { filters: [] }, params);

    this._items = [];
    this.currentPages = 0;
    this.totalPages = 0;

    ko.track(this);

    ko.defineProperty(this, 'query', () => this.endpoint ? {
      operator: this.sortBy.asc ? 'order_by_asc' : 'order_by_desc',
      column: this.sortBy.column,
      value: {
        operator: 'and',
        value: this.filters.map(f => f.asJSON).filter(f => f)
      }
    } : null);
    ko.getObservable(this, 'query').subscribe(() => this.load());

    // also sort/filter client-side while the server-side request is still running
    ko.defineProperty(this, 'items', () => {
      let items = this._items.slice();
      for (let filter of this.filters)
        items = filter.filter(items);
      if (this.sortBy)
        items = sortByOrder(items, [this.sortBy.column], [this.sortBy.asc]);
      return items;
    });

    this.load();
  }

  get hasMore() { return this.currentPages < this.totalPages; }

  load(append) {
    if (this.endpoint) {
      // `currentPages` can't be part of the query observable since it's changed by the query itself
      let query = Object.assign({}, this.query, { page: append ? this.currentPages + 1 : 1 });
      api.query(this.endpoint, query).done(resp => {
        let items = resp.data;
        if (this.deserialize)
          items = items.map(this.deserialize);
        this._items = append ? this._items.concat(items) : items;
        this.currentPages = resp.page;
        this.totalPages = resp.number_of_pages;
      });
    }
  }
}

export class SelectableCollection extends Collection {
  constructor(params) {
    super(params);
    this.selected = null;

    ko.track(this, ['selected']);

    ko.getObservable(this, 'items').subscribe(() => {
      if (this.items.indexOf(this.selected) === -1)
        this.selected = null;
    });
  }

  toggleSelect(value) {
    this.selected = value === this.selected ? null : value;
  }
}
