/*global window*/

import ko from "knockout";

import api from "../api";
import { Filter, SelectableCollection, SubstringFilter } from "../collection";
import Document from "./document";
import log from "./log";
import user from "./user";

export default class DepositReturn {
  constructor() {
    this.filter = new SubstringFilter({ column: 'name' });
    this.documentFilter = new SubstringFilter({ column: 'submitted_by' });
    this.depositFilter = new SubstringFilter({ column: 'name' });

    this.documents = new SelectableCollection({
      endpoint: 'documents',
      filters: [
        this.documentFilter,
        new SubstringFilter({ column: 'submitted_by', value: ko.getObservable(this.filter, 'value') }),
        new Filter({ column: 'submitted_by', operator: '!=', value: null }),
      ],
      sortBy: { column: 'date', asc: false },
      deserialize: data => new Document(data),
    });
    this.deposits = new SelectableCollection({
      endpoint: 'deposits',
      filters: [this.filter, this.depositFilter],
      sortBy: { column: 'date', asc: false },
      deserialize: data => {
        data.date = new Date(data.date);
        return data;
      },
    });
  }

  validate() {
    window.open(this.documents.selected.previewURL, '_blank');
    this.documents.selected.validated = true;
  }

  cashOut() {
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
}
