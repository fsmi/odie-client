var App = function(baseUrl) {
  this.lectures = new LectureList(baseUrl);
  this.lecture = new Lecture(baseUrl);
  this.cart = new Cart(baseUrl);

  this.visible = 'lectures';
  this.cartID = '';

  ko.track(this);
}

App.prototype.lecturesVisible = function () {
  return this.visible === 'lectures';
}

App.prototype.documentsVisible = function() {
  return this.visible === 'documents';
}

App.prototype.cartVisible = function() {
  return this.visible === 'cart';
}

App.prototype.show = function(name) {
  this.visible = name
}

App.prototype.openLecture = function(lecture) {
  this.lecture.load(lecture.name)
  this.visible = 'documents'
}

$(document).ready(function() {
  var live = false
  var url = live ? 'http://odie.fsmi.uni-karlsruhe.de' : 'http://localhost:8000'
  var app = new App(url);
  window.app = app;
  ko.applyBindings(app);
})
