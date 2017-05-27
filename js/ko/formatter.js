import ko from "knockout";

let formatter = {
  formatDate(date) {
    // lesser browsers will ignore the parameters and use the default locale
    if(typeof date == "string") date = new Date(date);
    return date ? date.toLocaleDateString('de-DE', {day: 'numeric', month: 'short', year: 'numeric'}) : '';
  },

  formatPrice(amount) {
    return '€' + amount.toFixed(2);
  },
};

ko.bindingHandlers.date = {
  update(element, valueAccessor) {
    element.innerHTML = formatter.formatDate(ko.unwrap(valueAccessor()));
  },
};

ko.bindingHandlers.price = {
  update(element, valueAccessor) {
    element.innerHTML = formatter.formatPrice(ko.unwrap(valueAccessor()));
  },
};

export default formatter;
