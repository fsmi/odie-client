import ko from "knockout";

export default class SortableColumn {
  /**
   * @param {Collection} coll
   * @param {string}     column
   * @param {boolean}    [asc=true]
   */
  constructor(params) {
    Object.assign(this, params);
    if (this.asc === undefined)
      this.asc = true;

    ko.track(this);
  }

  get active() { return this.coll.sortBy && this.coll.sortBy.column === this.column; }

  toggle() {
    if (this.active)
      this.asc = !this.asc;
    this.coll.sortBy = { column: this.column, asc: this.asc };
  }
}
