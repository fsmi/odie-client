ko.modal = (template, viewModel) =>
  ko.renderTemplate(template, viewModel, {
    afterRender: () => $('#modal').children().modal('show')
  }, document.getElementById('modal'));
