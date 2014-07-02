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
  var parts = this.date.split('-')
  var d = new Date(parts[0], parts[1] - 1, parts[2])
  return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear()
}

Document.prototype.preview = function() {
  window.open('file:///home/mi/info_Dokumente/' + (this.examType == 'oral' ? 'protokolle' : 'klausuren') + '/scanned/' + Math.floor(this.id/2) + '.pdf');
}

