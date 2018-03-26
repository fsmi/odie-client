import flatten from "lodash/flatten";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";

/** Returns a function usable as a typeahead source filtering the given items property */
export default function makeSource(items, property) {
  let sorted = [];
  if (property)
    sorted = sortBy(items, property);
  else
    sorted = items.sort();

  return (query, callback) => {
    // filter precedence:
    // 1. case-insensitive prefix match
    // 2. PascalCase match for queries with more than one capitcal char
    // 3. case-insensitive substring match

    let regexes = [new RegExp('^' + query, 'i')];

    if (/^([A-Z][a-z]*){2,}$/.test(query))
      regexes.push(new RegExp(query.split(/(?=[A-Z])/).join('[^A-Z]*')));

    regexes.push(new RegExp(query, 'i'));

    callback(uniq(flatten(regexes.map(r => sorted.filter(i => r.test(property ? i[property] : i))))));
  };
}
