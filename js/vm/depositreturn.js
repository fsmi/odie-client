var DepositReturn = function(baseUrl) {
  var self = this;
  this.baseUrl = baseUrl;
  this.studentName = '';
  this.deposits = [];
  ko.track(this);
}

DepositReturn.prototype = Object.create(Object.prototype);

DepositReturn.prototype.getDeposits = function() {
  var self = this;
  var url = this.baseUrl + '/data/deposits/' + encodeURIComponent(this.studentName);
  $.getJSON(url, function(data) {
    self.deposits = data;
  });
}

DepositReturn.prototype.cashOutDeposit = function(id) {
  var self = this;
  $.ajax({
    url: this.baseUrl + '/data/deposits/' + id,
    type: 'DELETE',
    success: function() {
      // remove it from the displayed list
      for (var i = 0; i < self.deposits.length; i++) {
        if (self.deposits[i].id === id) {
          var index = i;
          break;
        }
      }
      self.deposits.splice(index, 1);
    }
  });
}
