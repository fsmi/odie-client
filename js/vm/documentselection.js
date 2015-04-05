import ko from "knockout";
import pager from "pagerjs";

import config from "../config";
import user from "./user";
import Cart from "./cart";
import DocumentList from "./documentlist";
import LectureList from "./lecturelist";
import RangeSelect from "./rangeselect";

class DocumentSelection {
  constructor() {
    this.cart = new Cart();
    this.documentlist = new DocumentList();
    this.lecturelist = new LectureList();
    this.rangeSelect = new RangeSelect(this.cart);

    ko.track(this);

    ko.getObservable(this.documentlist, 'lecture').subscribe(name =>
        pager.navigate('documentselection' + (name ? '/' + encodeURIComponent(name) : ''))
    );
  }

  get config() { return config; }
  get user() { return user; }
}

export default new DocumentSelection();
