var User = function(baseUrl) {
  this.baseUrl = baseUrl;
  this.username = '';
  this.password = '';
  this.errorThrown = '';
  ko.track(this);
}

User.prototype = Object.create(Array.prototype);

User.prototype.login = function(success) {
  var self = this;
  $.ajax({
    url: this.baseUrl + '/data/login',
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({user: this.username, password: this.password}),
    error: function(_, _, errorThrown) {
      self.errorThrown = errorThrown;
    },
    success: function() {
      self.password = '';
      success();
    }
  });
  this.errorThrown = '';
}
