import ko from "knockout";

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
  }

  get config() { return config; }
  get user() { return user; }
}

export default new DocumentSelection();
