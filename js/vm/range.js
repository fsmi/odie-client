var RangeSelect = function(cart) {
  var self = this;
  self.firstSelection = null;
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
  if (this.firstSelection === null) {
    this.firstSelection = index;
    return;
  }
  if (this.firstSelection === index) {
    // cancel selection
    this.firstSelection = null;
    return;
  }
  this.commit(index, list);
}

RangeSelect.prototype.upperBoundVisible = function(index) {
  // resolve data binding
  var index = index();
  if (this.firstSelection === null) {
    return this.hoverIndex === index;
  }
  if (this.firstSelection > index) {
    // current row is above first selection
    return this.hoverIndex === index;
  }
  if (this.firstSelection < index) {
    return false;
  }
  return this.firstSelection <= this.hoverIndex;
}

RangeSelect.prototype.lowerBoundVisible = function(index) {
  // resolve data binding
  var index = index();
  if (this.firstSelection === null) {
    return this.hoverIndex === index;
  }
  if (this.firstSelection < index) {
    // current row is above first selection
    return this.hoverIndex === index;
  }
  if (this.firstSelection > index) {
    return false;
  }
  return this.firstSelection >= this.hoverIndex;
}

RangeSelect.prototype.selectedBarVisible = function(index) {
  // resolve data binding
  var index = index();
  if (this.firstSelection === null) {
    return this.hoverIndex === index;
  }
  if (index >= this.hoverIndex
      && index <= this.firstSelection) {
    return true;
  }
  if (index <= this.hoverIndex
      && index >= this.firstSelection) {
    return true;
  }
  return false;
}

RangeSelect.prototype.commit = function(secondSelection, docList) {
  var min = Math.min(this.firstSelection, secondSelection);
  var max = Math.max(this.firstSelection, secondSelection);
  for (var i = min; i <= max; ++i) {
    this.cart.add(docList[i]);
  }
  this.firstSelection = null;
}
