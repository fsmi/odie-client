class DepositReturn {
  constructor() {
    this.studentName = '';
    this.deposits = [];
    ko.track(this);
  }

  getDeposits() {
    config.getJSON('/data/deposits/' + encodeURIComponent(this.studentName))
      .done(data => this.deposits = data);
  }

  cashOutDeposit(id) {
    config.ajax({
      url: '/data/deposits/' + id,
      type: 'DELETE'
    }).done(() => {
      // remove it from the displayed list
      let index = this.deposits.findIndex(d => d.id === id);
      this.deposits.splice(index, 1);
    });
  }
}
