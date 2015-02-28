class App {
  constructor() {
    this.lecturelist = new LectureList();
    this.documentlist = new DocumentList();
    this.cart = new Cart();
    this.printJob = new PrintJob(this.cart);
    this.user = new User();
    this.preselection = new CartList();
    this.rangeSelect = new RangeSelect(this.cart);
    this.correction = new Correction();
    this.depositReturn = new DepositReturn();
    this.previewPrefix = $.cookie('previewPrefix') || '/home/mi/info_Dokumente/';
    this.isPreviewConfigured = $.cookie('previewPrefix') !== undefined;
    this.visible = 'documents';
    this.cartID = '';

    ko.track(this);
  }

  lecturesVisible() {
    return this.visible === 'lectures';
  }

  documentsVisible() {
    return this.visible === 'documents' ||
      this.visible === 'cart';
  }

  cartVisible() {
    return this.visible === 'documents' ||
      this.visible === 'cart';
  }

  loginVisible() {
    return !this.user.isAuthenticated && this.visible === 'login';
  }

  printVisible() {
    return this.user.isAuthenticated && this.visible === 'print';
  }

  correctionVisible() {
    return this.user.isAuthenticated && this.visible === 'correction';
  }

  depositReturnVisible() {
    return this.user.isAuthenticated && this.visible === 'depositreturn';
  }

  show(name) {
    this.visible = name;
    // special casing for in-page navigation to cart
    // Sadly this can't be done by setting the <a>'s href in the html
    if (name === 'cart') {
      document.location.href = '#cart';
    }
  }

  openLecture(lecture) {
    this.documentlist.load(lecture.name);
    this.visible = 'documents';
  }

  // causes actual login and handles application state change
  login() {
    this.user.login(() => {
      this.show('documents');
      this.preselection.loadCarts();
    });
  }

  // causes actual logout and moves away to selection view
  logout() {
    this.user.logout(() => this.show('documents'));
  }

  openCart(cart) {
    this.cart.dropAll();
    cart.documents.forEach(d => this.cart.add(d));
  }

  configurePreview() {
    $.cookie('previewPrefix', this.previewPrefix, {expires: 10000});
    this.isPreviewConfigured = true;
  }
}

$(document).ready(() => {
  infuser.defaults.useLoadingTemplate = false;

  let app = new App();
  window.app = app; // for debugging
  ko.applyBindings(app);
});
