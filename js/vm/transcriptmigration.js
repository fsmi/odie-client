/*global FormData XMLHttpRequest*/
import ko from "knockout";

import api from "../api";
import makeSource from "../typeaheadsource";
import store from "../store";
import Document from "./document";

export default class TranscriptMigration {
  constructor() {
    this.selectedLectures = [];
    this.selectedExaminants = [];
    this.similar = [];
    this.date = '';
    this.doctype = 'oral';
    this.name = "(Migration)";
    this.file = null;
    this.status = undefined; /* undefined | 'success' | 'error' | 'waiting' */
    this.errorlabel = '';
    this.submissionEnabled = true;
    this.proxyCnt = 0;
    ko.track(this);

    ko.getObservable(this, 'selectedLectures').subscribe(this.getSimilar.bind(this));
    ko.getObservable(this, 'selectedExaminants').subscribe(this.getSimilar.bind(this));
    ko.getObservable(this, 'date').subscribe(this.getSimilar.bind(this));
  }

  getSimilar() {
    let job = {
      department: 'mathematics',
      student_name: "(Migration)",
      date: this.date,
      document_type: this.doctype,
      lectures: this.selectedLectures,
      examinants: this.selectedExaminants,
    };
    api.post('similar', job).done(data => {
      if (data.data !== undefined)
        this.similar = data.data.map(e => new Document(e));
    });
  }

  typeaheadDataset(type) {
    return {
      source: makeSource(store[type].map(e => e.name)),
      templates: {
        suggestion: l => `<a href="#" onclick="return false;">${l}</a>`,
      },
    };
  }

  submit() {
    /* input validation */
    if (this.selectedLectures.length === 0) {
      this.status = 'error';
      this.errorlabel = "Bitte gib die in der Prüfung geprüften Vorlesungen an.";
      return;
    }
    if (this.selectedExaminants.length === 0) {
      this.status = 'error';
      this.errorlabel = "Bitte gib die in der Prüfung anwesenden PrüferInnen an.";
      return;
    }
    // even though we set the input field to only accept pdfs, Chrome allows any file to be selected
    if (!this.file || !this.file.name.toLowerCase().endsWith('.pdf')) {
      this.status = 'error';
      this.errorlabel = "Bitte gib eine Pdf-Datei zum Hochladen an.";
      return;
    }
    if (new Date() < Date.parse(this.date)) {
      this.status = 'error';
      // ERROR: HACKING TOO MUCH TIME
      this.errorlabel = "Bitte verletze nicht die Kausalität.";
      return;
    }


    let fd = new FormData();
    fd.append('json', JSON.stringify({
      lectures: this.selectedLectures,
      examinants: this.selectedExaminants,
      date: this.date,
      document_type: this.doctype,
      student_name: this.name,
      department: this.department,
    }));
    fd.append('file', this.file);
    let req = new XMLHttpRequest();
    req.open('POST', api.baseUrl + 'documents');
    req.onerror = (e) => {
      this.status = 'error';
      this.errorlabel = e;
      this.submissionEnabled = true;
    };
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        switch (req.status) {
          case 200:
            this.status = 'success';
            this.errorlabel = '';
            this.submissionEnabled = true;
            break;
          case 400:
            req.onerror("Ungültige Eingabe. Bitte überprüfe noch einmal alle Felder.");
            break;
          default:
            req.onerror(req.requestText);
        }
      }
    };
    this.status = 'waiting';
    this.errorlabel = '';
    this.submissionEnabled = false;
    req.send(fd);
  }
}
