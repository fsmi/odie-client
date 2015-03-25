import ko from "knockout";

let formatter = {
  formatDate(date) {
    // lesser browsers will ignore the parameters and use the default locale
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

ko.bindingHandlers.date = {
  update(element, valueAccessor) {
    element.innerText = formatter.formatDate(ko.unwrap(valueAccessor()));
  }
};

export default formatter;
