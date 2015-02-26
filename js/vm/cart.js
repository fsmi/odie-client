class Cart {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.name = '';
    this.documents = [];
    ko.track(this);

    ko.defineProperty(this, 'totalPageCount', () =>
      this.documents.reduce((acc, doc) => acc + doc.pages, 0)
    );

    ko.defineProperty(this, 'includesOral', () =>
      this.documents.some(doc => doc.examType == "oral")
    );

    ko.defineProperty(this, 'lectures', () =>
      this.documents.flatMap(doc => doc.lectures)
    );

    ko.defineProperty(this, 'displayDate', () => {
      let months = ['Jan ',
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
                    'Dez '];
      let d = new Date(this.date);
      return d.getDate() + '. ' + months[d.getMonth()] + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    });
  }

  contains(doc) {
    return this.documents.some(d => d.id == doc.id);
  }

  add(doc) {
    if (!this.contains(doc)) {
      this.documents.push(doc);
    }
  }

  drop(doc) {
    this.documents.remove(doc);
  }

  dropAll() {
    this.documents = [];
  }

  save() {
    if (this.length === 0) {
      alert("Bitte wähle zuerst ein paar Protokolle oder Klausuren aus.");
      return;
    }
    if (this.name === '') {
      alert("Bitte gib' zuerst deinen Namen (oder ein Pseudonym) an.");
      return;
    }
    let docIDs = this.documents.map(doc => doc.id);
    $.ajax({
      url: this.baseUrl + '/data/carts/' + encodeURIComponent(this.name),
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(docIDs),
      success: () => this.dropAll()
    })
  }

  priceEstimate(depositCount) {
    let price = this.totalPageCount * pricePerPage;
    if (depositCount === undefined) {
      if (this.includesOral) {
        price += depositPrice;
      }
    }
    else {
      price += depositCount * depositPrice;
    }

    // round to next-highest ten-cent unit
    return Math.ceil(price / 10) * 10;
  }
}
