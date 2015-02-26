class Document {
  constructor(data) {
    Object.assign(this, data);
    this.path = (this.examType == 'oral' ? 'protokolle' : 'klausuren') + '/scanned/' + Math.floor(this.id/2) + '.pdf';

    ko.track(this);
  }

  displayExamType() {
    return this.examType === "written" ? "Schriftlich" : "Mündlich";
  }

  displayDate() {
    let months = ['Jan ', 'Feb ', 'Mär ', 'Apr ', 'Mai ', 'Jun ', 'Jul ', 'Aug ', 'Sep ', 'Okt ', 'Nov ', 'Dez '];
    let [year, mon, day] = this.date.split('-');
    let d = new Date(year, mon, day);
    return `${d.getDate()}. ${months[d.getMonth()]}${d.getFullYear()}`;
  }
}
