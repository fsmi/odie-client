import formatter from "../ko/formatter";
import store from "../store";

export default class Document {
  constructor(data, lectureById, examinantById) {
    // replace stub (id-only) objects
    this.lectures = data.lectures.map(l => store.lecturesById.get(l.id));
    this.lectures.sort(l => l.name);
    this.examinants = data.examinants.map(e => store.examinantsById.get(e.id));
    this.examinants.sort(e => e.name);

    this.id = data.id;
    this.date = new Date(data.date);
    this.numberOfPages = data.number_of_pages;
    this.solution = data.solution;
    this.comment = data.comment;
    this.documentType = data.document_type;
    this.available = data.available;
  }

  get extendedAttributes() {
    return formatter.formatDate(this.date) + ', ' + this.comment;
  }

  get examinantsText() {
    return this.examinants.map(e => e.name).join(', ');
  }
}
