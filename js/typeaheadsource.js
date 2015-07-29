import flatten from "lodash/array/flatten";
import sortBy from "lodash/collection/sortBy";
import uniq from "lodash/array/uniq";

/** Returns a function usable as a typeahead source filtering the given items 'name' property */
export default function makeSource(items, accessor) {
  let sorted = [];
  if (accessor)
    sorted = sortBy(items, 'name');
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

    callback(uniq(flatten(regexes.map(r => sorted.filter(i => r.test(accessor ? accessor(i) : i))))));
  };
}
