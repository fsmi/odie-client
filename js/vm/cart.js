var Cart = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.name = '';
  this.documents = [];
  ko.track(this);

  ko.defineProperty(this, 'totalPageCount', function() {
    return this.documents.reduce(function(acc, doc) { return acc + doc.pages; }, 0);
  });

  ko.defineProperty(this, 'includesOral', function() {
    return this.documents.some(function(doc) { return doc.examType == "oral"; });
  });

  ko.defineProperty(this, 'lectures', function() {
    return this.documents.flatMap(function(doc) { return doc.lectures; });
  });

  ko.defineProperty(this, 'displayDate', function() {
    var months = ['Jan ',
                  'Feb ',
                  'Mär ',
                  'Apr ',
                  'Mai ',
                  'Jun ',
                  'Jul ',
                  'Aug ',
                  'Sep ',
                  'Okt ',
                  'Nov ',
                  'Dez '];
    var d = new Date(this.date);
    return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
  });
}

Cart.prototype.contains = function(doc) {
  return this.documents.some(function(d) { return d.id == doc.id; });
}

Cart.prototype.add = function(doc) {
  if (!this.contains(doc)) {
    this.documents.push(doc);
  }
}

Cart.prototype.drop = function(doc) {
  this.documents.remove(doc);
}

Cart.prototype.dropAll = function() {
  this.documents = [];
}

Cart.prototype.save = function() {
  var self = this;
  if (this.length === 0) {
    alert("Bitte wähle zuerst ein paar Protokolle oder Klausuren aus.");
    return;
  }
  if (this.name === '') {
    alert("Bitte gib' zuerst deinen Namen (oder ein Pseudonym) an.");
    return;
  }
  var docIDs = this.documents.map(function(doc) { return doc.id; });
  $.ajax({
    url: this.baseUrl + '/data/carts/' + encodeURIComponent(this.name),
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(docIDs),
    success: function() {
      self.dropAll();
    }
  })
}

Cart.prototype.priceEstimate = function(depositCount) {
  var price = this.totalPageCount;
  if (depositCount === undefined) {
    if (this.includesOral) {
      price += depositPrice;
    }
  }
  else {
    price += depositCount * depositPrice;
  }

  // round to next-highest ten-cent unit
  return Math.ceil(price / 10) * 10;
}
