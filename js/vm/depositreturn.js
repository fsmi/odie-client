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

    this.locallyValidatedIDs = []; //window.localStorage && JSON.parse(localStorage.getItem("Odie_ValidatedDocuments")) || [];
    this.documents = new SelectableCollection({
      endpoint: 'documents',
      filters: [
        this.documentFilter,
        new SubstringFilter({column: 'submitted_by', value: ko.getObservable(this.filter, 'value')}),
        new Filter({column: 'submitted_by', operator: '!=', value: null}),
      ],
      sortBy: {column: 'date', asc: false},
      deserialize: data => {
        if(this.locallyValidatedIDs.indexOf(data.id) !== -1) data.validated = true;
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
    if(!document.validated) {
      document.validated = true;
      if(this.locallyValidatedIDs.indexOf(document.id) === -1) this.locallyValidatedIDs.push(document.id);
    }
    //if(window.localStorage) window.localStorage.setItem("Odie_ValidatedDocuments",JSON.stringify(this.locallyValidatedIDs));
  }

  currentSelectionEligibleForRejection() {
    // lets not fail the servers delete_document pre-condition
    let selected = this.documents.selected;
    return selected &&
        (selected.early_document_eligible || selected.deposit_return_eligible) && // be still eligible for smth
        (!selected.validated || this.locallyValidatedIDs.indexOf(selected.id) === 1); // either locally validated or not at all
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

  rejectDocument() {
    api.delete(`documents/${this.documents.selected.id}`).done((data) => {
      this.documents.load();
    });
  }
}
