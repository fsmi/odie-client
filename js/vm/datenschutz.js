import ko from "knockout";
import log from "./log";

class Datenschutz {
  constructor() {
    log.addItem('Datenschutz', 'loaded')
    ko.track(this);
  }
}
