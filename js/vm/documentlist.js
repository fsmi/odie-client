import ko from "knockout";
import indexBy from "lodash/collection/indexBy";

import api from "../api";
import Collection, {Filter} from "../collection";
import Document from "./document";
import RangeSelect from "./rangeselect";
import user from "./user";

class DocumentType {
  constructor(params) {
    Object.assign(this, params);

    ko.defineProperty(this, 'selected', {
      get: () => this.list.typeFilter.value.indexOf(this.name) !== -1,
      set: b => b ? this.list.typeFilter.value.push(this.name) : this.list.typeFilter.value.remove(this.name),
    });
  }

  get count() {
    return this.list.scrubbedDocuments.filter(doc => doc.documentType === this.name).length;
  }

  get totalCount() {
    return this.list.metadata['total_' + this.name.replace(' ', '_')];
  }
}

export default class DocumentList {
  /**
   * @param {Cart}    params.cart
   * @param {object}  [params.requestParams] - additional params for the /documents GET request
   */
  constructor(params) {
    this.cart = ko.unwrap(params.cart);

    this.documentTypes = [
      new DocumentType({list: this, name: 'written', title: 'schriftlich', icon: '<span class="icon-pencil" style="margin-right: 2px"></span>'}),
      new DocumentType({list: this, name: 'oral', title: 'mündlich', icon: '<span class="icon-chat" style="margin-right: 2px"></span>'}),
      new DocumentType({list: this, name: 'oral reexam', title: 'mündliche Nachprüfung', icon: '<span class="icon-chat"><strong style="margin-left: -2px; cursor: default">!</strong></span>'}),
      new DocumentType({list: this, name: 'mock exam', title: 'Probeklausur', icon: '<span class="icon-pencil"><strong style="margin-left: -2px; cursor: default">!</strong></span>'}),
    ];
    this.documentTypeByName = indexBy(this.documentTypes, t => t.name);
    this.solutionTypeByName = {
      'official': {title: 'Offizielle Lösung', iconClass: 'icon-circle'},
      'inofficial': {title: 'Inoffizielle Lösung', iconClass: 'icon-ajust'},
      'none': {title: 'Ohne Lösung', iconClass: 'icon-circle-empty'},
    };

    this.typeFilter = new Filter({column: 'document_type', operator: 'in_', value: ['written', 'oral', 'oral reexam', 'mock exam']});

    this.coll = new Collection({
      endpoint: 'documents',
      requestParams: params.requestParams,
      filters: [this.typeFilter],
      sortBy: {column: 'date', asc: false},
      deserialize: d => new Document(d),
      autoload: false, // we don't want onRequest to fire while 'this.coll' is still undefined
      onRequest: () =>
        api.ajax({
          url: 'documents/meta',
          data: Object.assign({}, ko.unwrap(params.requestParams), {q: this.coll.query}),
        }).done(metadata => {
          this.metadata = metadata.data;
        }),
    });
    this.coll.load();

    this.rangeSelect = new RangeSelect();
    this.metadata = {};
    this.scrubDocuments = true;
    ko.track(this, ['metadata', 'scrubDocuments']);
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

  addRange() {
    this.cart.add(...this.rangeSelect.commit().map(i => this.scrubbedDocuments[i]));
  }

  addAll() {
    this.cart.add(...this.scrubbedDocuments);
  }

  get user() { return user; }
}
