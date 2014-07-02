var Document = function(data) {
  var self = this;
  this.lectures = data.lectures;
  this.id = data.id;
  this.pages = data.pages;
  this.date = data.date;
  this.examinants = data.examinants;
  this.examType = data.examType;
  this.comment = data.comment;
  ko.track(this);
}

Document.prototype = Object.create(Object.prototype);

Document.prototype.displayExamType = function() {
  return this.examType === "written" ? "Schriftlich" : "Mündlich"
}

Document.prototype.displayDate = function() {
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
  var d = new Date(this.date)
  return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear()
}

