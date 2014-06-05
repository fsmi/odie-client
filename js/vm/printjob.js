var PrintJob = function(baseUrl) {
  var self = this
  this.baseUrl = baseUrl
  ko.track(this)
}

PrintJob.prototype = Object.create(Array.prototype)

PrintJob.prototype.submit = function() {
  console.log('PC LOAD LETTER')
}
