import ko from "knockout";

export default class RangeSelect {
  constructor() {
    this.firstSelection = null;
    this.secondSelection = null;
    this.hoverIndex = null;

    ko.track(this);
  }

  onRowMouseOver(index) {
    // resolve data binding
    let index = index();
    this.hoverIndex = index;
  }

  onClick(index) {
    // resolve data binding
    let index = index();
    if (this.secondSelection !== null) {
      // cancel selection
      this.firstSelection = null;
      this.secondSelection = null;
      return;
    }
    if (this.firstSelection === null) {
      this.firstSelection = index;
      return;
    }
    if (this.firstSelection === index) {
      // cancel selection
      this.firstSelection = null;
      return;
    }
    this.secondSelection = index;
  }

  upperBoundVisible(index) {
    // resolve data binding
    let index = index();
    if (this.firstSelection === null) {
      return this.hoverIndex === index;
    }

    if (this.secondSelection === null) {
      // still selecting
      if (this.firstSelection > index) {
        // current row is above first selection
        return this.hoverIndex === index;
      }
      if (this.firstSelection < index) {
        return false;
      }
      return this.firstSelection <= this.hoverIndex;
    }
    // the user has selected a range
    let min = Math.min(this.firstSelection, this.secondSelection);
    return index === min;
  }

  lowerBoundVisible(index) {
    // resolve data binding
    let index = index();
    if (this.firstSelection === null) {
      return this.hoverIndex === index;
    }

    if (this.secondSelection === null) {
      if (this.firstSelection < index) {
        // current row is above first selection
        return this.hoverIndex === index;
      }
      if (this.firstSelection > index) {
        return false;
      }
      return this.firstSelection >= this.hoverIndex;
    }
    // the user has selected a range
    let max = Math.max(this.firstSelection, this.secondSelection);
    return index === max;
  }

  selectedBarVisible(index) {
    // resolve data binding
    let index = index();
    if (this.firstSelection === null) {
      return this.hoverIndex === index;
    }
    let reference = this.secondSelection === null ?
      this.hoverIndex : this.secondSelection;
    let min = Math.min(reference, this.firstSelection);
    let max = Math.max(reference, this.firstSelection);
    return min <= index && index <= max;
  }

  toggleButtonVisible(index) {
    let index = index();
    if (this.secondSelection === null) {
      return index === this.hoverIndex;
    }
    let min = Math.min(this.firstSelection, this.secondSelection);
    let max = Math.max(this.firstSelection, this.secondSelection);
    if (this.hoverIndex < min) {
      return index === min;
    }
    if (this.hoverIndex > max) {
      return index === max;
    }
    return this.hoverIndex === index;
  }

  // returns and resets selection
  commit() {
    let a = this.firstSelection;
    let b = this.secondSelection;
    if (this.firstSelection === null) {
      a = this.hoverIndex;
    }
    if (this.secondSelection === null) {
      b = this.hoverIndex;
    }
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    let indices = [];
    for (let i = min; i <= max; ++i) {
      indices.push(i);
    }
    this.firstSelection = null;
    this.secondSelection = null;
    return indices;
  }
}
