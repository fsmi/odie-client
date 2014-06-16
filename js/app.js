var App = function(baseUrl) {
  this.lectures = new LectureList(baseUrl);
  this.lecture = new Lecture(baseUrl);
  this.cart = new Cart(baseUrl);
  this.user = new User(baseUrl);
  this.print= new Print(baseUrl);

  this.visible = 'documents';
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
  return this.visible === 'documents';
}

App.prototype.loginVisible = function() {
  return !this.user.isAuthenticated && this.visible === 'print';
}

App.prototype.printVisible = function() {
  return this.user.isAuthenticated && this.visible === 'print';
}

App.prototype.show = function(name) {
  this.visible = name
}

App.prototype.openLecture = function(lecture) {
  this.lecture.load(lecture.name)
  this.visible = 'documents'
}

App.prototype.login = function() {
  this.user.login(function() {
    this.visible = 'cart';
  });
}

App.prototype.germanExamType = function(examType) {
  return examType === "written" ? "Schriftlich" : "Mündlich"
}

App.prototype.germanDate = function(dateString) {
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
                'Dez ']
  // what follows is a hack to get around iOS' JS not supporting our date format
  var parts = dateString.split('-')
  var d = new Date(parts[0], parts[1] - 1, parts[2])
  return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear()
}

App.prototype.executeHelpAssistant = function() {
  $('.cart-add').hideBalloon();
}

App.prototype.enterCartAddButton = function(doc, e) {
  if (1 & e.buttons) {
    this.selection.push(doc);
  } else {
    this.selection.removeAll();
    if (!$.cookie('helpAssistantExecuted')) {
      $.cookie('helpAssistantExecuted', true, { expires: 10000 });
      $(e.target).showBalloon({
        contents: $('#help-assistant').clone().css('display', ''),
        position: 'right',
        classname: 'help-assistant',
        css: null
      });
    }
  }
}

$(document).ready(function() {
  // global config
  depositPrice = 500
  pricePerPage = 3

  var live = true
  var url = live ? 'https://odie-test.fsmi.uni-karlsruhe.de' : 'http://localhost:8000'
  var app = new App(url);
  window.app = app;
  ko.applyBindings(app);
})
