var RangeSelect = function(cart) {
  var self = this;
  self.firstSelection = null;
  self.secondSelection = null;
  self.cart = cart;
  self.hoverIndex = null;

  ko.track(this);
}

RangeSelect.prototype = Object.create(Object.prototype);

RangeSelect.prototype.onRowMouseOver = function(index) {
  // resolve data binding
  var index = index();
  this.hoverIndex = index;
}

RangeSelect.prototype.onClick = function(index, list) {
  // resolve data binding
  var index = index();
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

RangeSelect.prototype.upperBoundVisible = function(index) {
  // resolve data binding
  var index = index();
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
  var min = Math.min(this.firstSelection, this.secondSelection);
  return index === min;
}

RangeSelect.prototype.lowerBoundVisible = function(index) {
  // resolve data binding
  var index = index();
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
  var max = Math.max(this.firstSelection, this.secondSelection);
  return index === max;
}

RangeSelect.prototype.selectedBarVisible = function(index) {
  // resolve data binding
  var index = index();
  if (this.firstSelection === null) {
    return this.hoverIndex === index;
  }
  var reference = this.secondSelection === null ?
    this.hoverIndex : this.secondSelection;
  var min = Math.min(reference, this.firstSelection);
  var max = Math.max(reference, this.firstSelection);
  if (min <= index && index <= max) {
    return true;
  }
  return false;
}

RangeSelect.prototype.toggleButtonVisible = function(index) {
  var index = index();
  if (this.secondSelection === null) {
    return index === this.hoverIndex;
  }
  var min = Math.min(this.firstSelection, this.secondSelection);
  var max = Math.max(this.firstSelection, this.secondSelection);
  if (this.hoverIndex < min) {
    return index === min;
  }
  if (this.hoverIndex > max) {
    return index === max;
  }
  return this.hoverIndex === index;
}

RangeSelect.prototype.commit = function(docList) {
  var a = this.firstSelection;
  var b = this.secondSelection;
  if (this.firstSelection === null) {
    a = this.hoverIndex;
  }
  if (this.secondSelection === null) {
    b = this.hoverIndex;
  }
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  for (var i = min; i <= max; ++i) {
    this.cart.add(docList[i]);
  }
  this.firstSelection = null;
  this.secondSelection = null;
}
