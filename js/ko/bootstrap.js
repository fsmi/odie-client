ko.modal = function(template, viewModel) {
    ko.renderTemplate(template, viewModel, {
      afterRender: function() {
        $('#modal').children().modal('show');
      }
    }, document.getElementById('modal'));
};
