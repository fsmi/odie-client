/*global FormData XMLHttpRequest*/
import ko from "knockout";
import flatten from "lodash/array/flatten";

import api from "../api";
import makeSource from "../typeaheadsource";
import store from "../store";
import user from "./user";

function wrapLectureAlias(alias, canonical) {
  return {alias, canonical}
}

export default class DocumentSubmission {


  constructor() {
    this.selectedLectures = [];
    this.selectedExaminants = [];
    this.date = null;
    this.name = null;
    this.anonymous = false;
    this.file = null;
    this.department = 'computer science';
    this.doctype = 'oral';
    this.solution = null;
    this.comment = null;
    this.early_document_eligible = false;
    this.status = undefined; /* undefined | 'success' | 'error' | 'waiting' */
    this.errorlabel = '';
    this.submissionEnabled = true;

    ko.track(this);

    ko.getObservable(this, 'early_document_eligible').subscribe(function(changes) {
      $('[data-toggle="popover"]').popover();
    });
  }

  get examinantsTypeaheadDataset() {
    return {
      source: makeSource(store.examinants.filter(x => x.validated || user.isAuthenticated).map(e => e.name)),
      templates: {
        suggestion: l => `<a href="#" onclick="return false;">${l}</a>`,
      },
    };
  }

  get lecturesTypeaheadDataset() {
    return {
      source: makeSource(flatten(store.lectures.filter(x => x.validated || user.isAuthenticated).map(l =>
                [l.name].concat(l.aliases).map(alias => wrapLectureAlias(alias, l.name))
              )), 'alias'),
      display: 'canonical',
      valueKey: 'canonical', /* needed by bootstrap-tagsinput */
      templates: {
        suggestion: x => `<a href="#" onclick="return false;">${x.alias}${x.alias === x.canonical ? "" : ` <span class="full-name">${x.canonical}</span>`}</a>`,
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
    if (new Date() < Date.parse(this.date) && !user.isAuthenticated) {
      this.status = 'error';
      // ERROR: HACKING TOO MUCH TIME
      this.errorlabel = "Bitte verletze nicht die Kausalität.";
      return;
    }


    let fd = new FormData();
    let obj = {
      lectures: this.selectedLectures,
      examinants: this.selectedExaminants,
      date: this.date,
      document_type: this.doctype,
      student_name: this.anonymous || user.isAuthenticated ? null : this.name,
      department: this.department,
    };
    if (this.comment)
      obj.comment = this.comment;
    if (this.doctype === 'written')
      obj.solution = this.solution;

    fd.append('json', JSON.stringify(obj));
    fd.append('file', this.file);
    let req = new XMLHttpRequest();
    req.withCredentials = true;
    req.open('POST', api.baseUrl + 'documents');
    req.onerror = (e) => {
      this.status = 'error';
      this.errorlabel = e;
      this.submissionEnabled = true;
    };
    req.onreadystatechange = (data) => {
      if (req.readyState === 4) {
        switch (req.status) {
          case 200:
            this.status = 'success';
            this.errorlabel = '';
            this.submissionEnabled = user.isAuthenticated;
            let responseJson = JSON.parse(req.responseText);
            if(responseJson) this.early_document_eligible = responseJson.data.early_document_eligible;
            break;
          case 400:
            req.onerror("Ungültige Eingabe. Bitte überprüfe noch einmal alle Felder.");
            break;
          default:
            req.onerror("Ein unerwarteter Fehler. Kontaktiere odie@fsmi.uni-karlsruhe.de");
        }
      }
    };
    this.status = 'waiting';
    this.errorlabel = '';
    this.submissionEnabled = false;
    req.send(fd);
  }

  get user() { return user; }
}
