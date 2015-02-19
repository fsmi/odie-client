class CartList {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.carts = [];
    this.filter = '';
    this.defaultLimit = 15;
    this.limit = this.defaultLimit;

    ko.track(this);

    this.loadCarts();
  }

  filteredCarts() {
    let regex = new RegExp(this.filter);
    let filtered = this.carts.filter(c => regex.test(c.name));

    // sort by creation time in descending order
    filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      // make sure there's some deterministic order even for simultaneously
      // created carts
      return a.name < b.name ? -1 : -1;
    });
    if (this.limit !== -1) {
      filtered = filtered.slice(0, this.limit - 1);
    }
    return filtered;
  }

  showAllCarts() {
    this.limit = -1;
  }

  loadCarts() {
    $.ajax({
      url: this.baseUrl + '/data/carts',
      success: data => {
        this.carts = data.map(d => {
          let c = new Cart(this.baseUrl);
          c.id = d.id;
          c.name = d.name;
          c.date = d.creationTime;
          d.documents.forEach(doc => c.add(new Document(doc)));
          return c;
        });
      },
      error: (_, __, errorThrown) => console.log("Couldn't get carts -- are you logged in?")
    });
    this.limit = this.defaultLimit;
  }

  deleteCart(cart) {
    $.ajax({
      url: this.baseUrl + '/data/carts/' + cart.id,
      type: 'DELETE',
      success: () => {
        let i = this.carts.indexOf(cart);
        if (i > -1) {
          // remove from cart listing
          this.carts.splice(i, 1);
        }
      }
    });
  }
}
