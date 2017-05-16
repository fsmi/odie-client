/*global window*/

import ko from "knockout";

import api from "../api";
import {Filter, SelectableCollection, SubstringFilter} from "../collection";
import Document from "./document";
import log from "./log";
import user from "./user";

export default class DepositReturn {
  constructor() {
    this.filter = new SubstringFilter({column: 'name'});
    this.documentFilter = new SubstringFilter({column: 'submitted_by'});
    this.depositFilter = new SubstringFilter({column: 'name'});

    this.validatedIDs = []; //window.localStorage && JSON.parse(localStorage.getItem("Odie_ValidatedDocuments")) || [];
    this.documents = new SelectableCollection({
      endpoint: 'documents',
      filters: [
        this.documentFilter,
        new SubstringFilter({column: 'submitted_by', value: ko.getObservable(this.filter, 'value')}),
        new Filter({column: 'submitted_by', operator: '!=', value: null}),
      ],
      sortBy: {column: 'date', asc: false},
      deserialize: data => {
        if(this.validatedIDs.indexOf(data.id) !== -1) data.validated = true;
        return new Document(data);
      },
    });
    this.deposits = new SelectableCollection({
      endpoint: 'deposits',
      filters: [this.filter, this.depositFilter],
      sortBy: {column: 'date', asc: false},
      deserialize: data => {
        data.date = new Date(data.date);
        return data;
      },
    });
  }

  validate(document) {
    window.open(document.previewURL, '_blank');
    document.validated = true;
    if(this.validatedIDs.indexOf(document.id) === -1) this.validatedIDs.push(document.id);
    //if(window.localStorage) window.localStorage.setItem("Odie_ValidatedDocuments",JSON.stringify(this.validatedIDs));
  }

  cashOutDeposit() {
    let data = {
      id: this.deposits.selected.id,
      cash_box: user.officeConfig.cash_boxes[0],
    };

    if (this.documents.selected)
      data.document_id = this.documents.selected.id;

    api.post('log_deposit_return', data).done(() => {
      log.addItem('Pfandrückgabe', -this.deposits.selected.price);
      this.documents.load();
      this.deposits.load();
    });
  }

  cashOutEarlyDocument() {
    let data = {
      id: this.documents.selected.id,
      cash_box: user.officeConfig.cash_boxes[0],
    };

    api.post('log_early_document_reward', data).done((data) => {
      log.addItem('Erstprotokoll', -data.data.disbursal);
      this.documents.load();
    });
  }
}
