class DepositReturn {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.studentName = '';
    this.deposits = [];
    ko.track(this);
  }

  getDeposits() {
    let url = this.baseUrl + '/data/deposits/' + encodeURIComponent(this.studentName);
    $.getJSON(url, data => this.deposits = data);
  }

  cashOutDeposit(id) {
    $.ajax({
      url: this.baseUrl + '/data/deposits/' + id,
      type: 'DELETE',
      success: () => {
        // remove it from the displayed list
        let index = this.deposits.findIndex(d => d.id === id);
        this.deposits.splice(index, 1);
      }
    });
  }
}
