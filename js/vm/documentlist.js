import ko from "knockout";

import Collection, {Filter} from "../collection";
import Document from "./document";
import RangeSelect from "./rangeselect";
import user from "./user";

export default class DocumentList {
  /**
   * @param {Cart}    params.cart
   * @param {string}  [params.endpoint] - an API endpoint that returns a list of documents
   */
  constructor(params) {
    this.cart = ko.unwrap(params.cart);

    // TODO: replace with collection filters the DB can understand
    // this.examinantsFilter = '';
    // this.typeFilter = '';
    this.typeFilter = new Filter({column: 'document_type', operator: '==', disableOnEmpty: true});
    this.coll = new Collection({
      endpoint: params.endpoint,
      filters: [this.typeFilter],
      sortBy: {column: 'date', asc: false},
      deserialize: d => new Document(d),
    });

    this.rangeSelect = new RangeSelect();
    this.scrubDocuments = true;
    ko.track(this, ['scrubDocuments']);
    ko.defineProperty(this, 'scrubbedDocuments', () =>
        this.scrubDocuments ? this.coll.items.filter(d => d.validated) : this.coll.items
    );
  }

  toggleTypeFilter(type) {
    if (!this.typeFilter.value || type !== this.typeFilter.value)
      this.typeFilter.value = type;
    else
      this.typeFilter.value = '';
  }

  countType(type) {
    return this.coll.items.filter(doc => doc.documentType === type).length;
  }

  addRange() {
    this.rangeSelect.commit().forEach(i => this.cart.add(this.coll.items[i]));
  }

  addAll() {
    this.coll.items.forEach(d => this.cart.add(d));
  }

  get user() { return user; }
}
