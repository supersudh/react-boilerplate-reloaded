/* eslint-disable */
import isEqual from 'lodash/isEqual';

// Super compare algorithm for two objects.
function superCompare(objectA, objectB, propsToIgnore = []) {
  // console.log('Supercompare got -> ', {objectA}, {objectB});
  if (propsToIgnore.length) {
    propsToIgnore.forEach(propToIgnore => {
      delete objectA[propToIgnore];
      delete objectB[propToIgnore];
    });
  }
  var context = {};

  // Get an object with all keys of both. We iterate through objectA, deleting all keys
  // we encounter. Any left over at the end must be from objectB, so we'll assign all those values to context
  var allKeysObject = Object.assign({}, objectA, objectB);

  for (var k in objectA) {

    // Found the key so remove it
    delete allKeysObject[k];

    var valueA = objectA[k];
    var valueB = objectB[k];
    if (valueA !== 'undefined' && valueB !== 'undefined' && !(isEqual(valueA, valueB))) {
      if ((typeof valueA == 'object' || typeof valueB == 'object') && !Array.isArray(valueA)) {
        if (valueA) {
          var temp = superCompare(valueA, valueB);
          if (Object.keys(temp).length != 0) context[k] = temp;
        } else {
          context[k] = valueB;
        }
      } else if (valueA != valueB) {
        context[k] = valueB;
      }
    }
  }

  // Now apply all of the remaining keys from objectB to context
  for (var p in allKeysObject) {
    if (objectB[p] !== 'undefined') {
      context[p] = objectB[p];
    }
  }
  return context;
};

export default superCompare;