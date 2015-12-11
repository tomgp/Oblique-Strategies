(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-arrays', ['exports'], factory) :
  factory((global.d3_arrays = {}));
}(this, function (exports) { 'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  };

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  };

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;
  var bisectLeft = ascendingBisect.left;

  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };

  function number(x) {
    return x === null ? NaN : +x;
  };

  function variance(array, f) {
    var n = array.length,
        m = 0,
        a,
        d,
        s = 0,
        i = -1,
        j = 0;

    if (arguments.length === 1) {
      while (++i < n) {
        if (!isNaN(a = number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    else {
      while (++i < n) {
        if (!isNaN(a = number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    if (j > 1) return s / (j - 1);
  };

  function deviation() {
    var v = variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };

  function entries(map) {
    var entries = [];
    for (var key in map) entries.push({key: key, value: map[key]});
    return entries;
  };

  function extent(array, f) {
    var i = -1,
        n = array.length,
        a,
        b,
        c;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    return [a, c];
  };

  function keys(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };

  var prefix = "$";

  function Map() {}

  Map.prototype = map.prototype = {
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f.call(this, this[property], property.slice(1));
    }
  };

  function map(object, f) {
    var map = new Map;

    // Copy constructor.
    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (arguments.length === 1) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function max(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }

    return a;
  };

  function mean(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1,
        j = n;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
    }

    else {
      while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) s += a; else --j;
    }

    if (j) return s / j;
  };

  // R-7 per <http://en.wikipedia.org/wiki/Quantile>
  function quantile(values, p) {
    var H = (values.length - 1) * p + 1,
        h = Math.floor(H),
        v = +values[h - 1],
        e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };

  function median(array, f) {
    var numbers = [],
        n = array.length,
        a,
        i = -1;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
    }

    else {
      while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) numbers.push(a);
    }

    if (numbers.length) return quantile(numbers.sort(ascending), .5);
  };

  function merge(arrays) {
    var n = arrays.length,
        m,
        i = -1,
        j = 0,
        merged,
        array;

    while (++i < n) j += arrays[i].length;
    merged = new Array(j);

    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }

    return merged;
  };

  function min(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }

    return a;
  };

  function nest() {
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;

    function apply(array, depth, createResult, setResult) {
      if (depth >= keys.length) return rollup
          ? rollup.call(nest, array) : (sortValues
          ? array.sort(sortValues)
          : array);

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map(),
          values,
          result = createResult();

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.each(function(values, key) {
        setResult(result, key, apply(values, depth, createResult, setResult));
      });

      return result;
    }

    function entries(map, depth) {
      if (depth >= keys.length) return map;

      var array = [],
          sortKey = sortKeys[depth++];

      map.each(function(value, key) {
        array.push({key: key, values: entries(value, depth)});
      });

      return sortKey
          ? array.sort(function(a, b) { return sortKey(a.key, b.key); })
          : array;
    }

    return nest = {
      object: function(array) { return apply(array, 0, createObject, setObject); },
      map: function(array) { return apply(array, 0, createMap, setMap); },
      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
      key: function(d) { keys.push(d); return nest; },
      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
      sortValues: function(order) { sortValues = order; return nest; },
      rollup: function(f) { rollup = f; return nest; }
    };
  };

  function createObject() {
    return {};
  }

  function setObject(object, key, value) {
    object[key] = value;
  }

  function createMap() {
    return map();
  }

  function setMap(map, key, value) {
    map.set(key, value);
  }

  function pairs(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [p0 = p1, p1 = array[++i]];
    return pairs;
  };

  function permute(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };

  function range(start, stop, step) {
    if ((n = arguments.length) < 3) {
      step = 1;
      if (n < 2) {
        stop = start;
        start = 0;
      }
    }

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  };

  function Set() {}

  var proto = map.prototype;

  Set.prototype = set.prototype = {
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = true;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f.call(this, property.slice(1));
    }
  };

  function set(object) {
    var set = new Set;

    // Copy constructor.
    if (object instanceof Set) object.each(function(value) { set.add(value); });

    // Otherwise, assume it’s an array.
    else if (object) for (var i = 0, n = object.length; i < n; ++i) set.add(object[i]);

    return set;
  }

  function shuffle(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }

    var m = i1 - i0,
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }

    return array;
  };

  function sum(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = +array[i])) s += a; // Note: zero and null are equivalent.
    }

    else {
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
    }

    return s;
  };

  function transpose(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  };

  function length(d) {
    return d.length;
  }

  function values(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };

  function zip() {
    return transpose(arguments);
  };

  var version = "0.3.1";

  exports.version = version;
  exports.bisect = bisectRight;
  exports.bisectRight = bisectRight;
  exports.bisectLeft = bisectLeft;
  exports.ascending = ascending;
  exports.bisector = bisector;
  exports.descending = descending;
  exports.deviation = deviation;
  exports.entries = entries;
  exports.extent = extent;
  exports.keys = keys;
  exports.map = map;
  exports.max = max;
  exports.mean = mean;
  exports.median = median;
  exports.merge = merge;
  exports.min = min;
  exports.nest = nest;
  exports.pairs = pairs;
  exports.permute = permute;
  exports.quantile = quantile;
  exports.range = range;
  exports.set = set;
  exports.shuffle = shuffle;
  exports.sum = sum;
  exports.transpose = transpose;
  exports.values = values;
  exports.variance = variance;
  exports.zip = zip;

}));
},{}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-dispatch', ['exports'], factory) :
  factory((global.d3_dispatch = {}));
}(this, function (exports) { 'use strict';

  function dispatch() {
    return new Dispatch(arguments);
  }

  function Dispatch(types) {
    var i = -1,
        n = types.length,
        callbacksByType = {},
        callbackByName = {},
        type,
        that = this;

    that.on = function(type, callback) {
      type = parseType(type);

      // Return the current callback, if any.
      if (arguments.length < 2) {
        return (callback = callbackByName[type.name]) && callback.value;
      }

      // If a type was specified…
      if (type.type) {
        var callbacks = callbacksByType[type.type],
            callback0 = callbackByName[type.name],
            i;

        // Remove the current callback, if any, using copy-on-remove.
        if (callback0) {
          callback0.value = null;
          i = callbacks.indexOf(callback0);
          callbacksByType[type.type] = callbacks = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
          delete callbackByName[type.name];
        }

        // Add the new callback, if any.
        if (callback) {
          callback = {value: callback};
          callbackByName[type.name] = callback;
          callbacks.push(callback);
        }
      }

      // Otherwise, if a null callback was specified, remove all callbacks with the given name.
      else if (callback == null) {
        for (var otherType in callbacksByType) {
          if (callback = callbackByName[otherType + type.name]) {
            callback.value = null;
            var callbacks = callbacksByType[otherType], i = callbacks.indexOf(callback);
            callbacksByType[otherType] = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
            delete callbackByName[callback.name];
          }
        }
      }

      return that;
    };

    while (++i < n) {
      type = types[i] + "";
      if (!type || (type in that)) throw new Error("illegal or duplicate type: " + type);
      callbacksByType[type] = [];
      that[type] = applier(type);
    }

    function parseType(type) {
      var i = (type += "").indexOf("."), name = type;
      if (i >= 0) type = type.slice(0, i); else name += ".";
      if (type && !callbacksByType.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      return {type: type, name: name};
    }

    function applier(type) {
      return function() {
        var callbacks = callbacksByType[type], // Defensive reference; copy-on-remove.
            callback,
            callbackValue,
            i = -1,
            n = callbacks.length;

        while (++i < n) {
          if (callbackValue = (callback = callbacks[i]).value) {
            callbackValue.apply(this, arguments);
          }
        }

        return that;
      };
    }
  }

  dispatch.prototype = Dispatch.prototype;

  var version = "0.2.4";

  exports.version = version;
  exports.dispatch = dispatch;

}));
},{}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-dsv', ['exports'], factory) :
  factory((global.d3_dsv = {}));
}(this, function (exports) { 'use strict';

  function dsv(delimiter) {
    return new Dsv(delimiter);
  }

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function Dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    this.parse = function(text, f) {
      var convert, columns, rows = this.parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns;
      return rows;
    };

    this.parseRows = function(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    this.format = function(rows, columns) {
      if (arguments.length < 2) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      })).join("\n");
    };

    this.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }
  };

  dsv.prototype = Dsv.prototype;

  var csv = dsv(",");
  var tsv = dsv("\t");

  var version = "0.1.12";

  exports.version = version;
  exports.dsv = dsv;
  exports.csv = csv;
  exports.tsv = tsv;

}));
},{}],4:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-arrays'), require('d3-dispatch'), require('d3-dsv')) :
  typeof define === 'function' && define.amd ? define('d3-request', ['exports', 'd3-arrays', 'd3-dispatch', 'd3-dsv'], factory) :
  factory((global.d3_request = {}),global.d3_arrays,global.d3_dispatch,global.d3_dsv);
}(this, function (exports,d3Arrays,d3Dispatch,d3Dsv) { 'use strict';

  function request(url, callback) {
    var request,
        event = d3Dispatch.dispatch("beforesend", "progress", "load", "error"),
        mimeType,
        headers = d3Arrays.map(),
        xhr = new XMLHttpRequest,
        response,
        responseType;

    // If IE does not support CORS, use XDomainRequest.
    if (typeof XDomainRequest !== "undefined"
        && !("withCredentials" in xhr)
        && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

    "onload" in xhr
        ? xhr.onload = xhr.onerror = respond
        : xhr.onreadystatechange = function() { xhr.readyState > 3 && respond(); };

    function respond() {
      var status = xhr.status, result;
      if (!status && hasResponse(xhr)
          || status >= 200 && status < 300
          || status === 304) {
        if (response) {
          try {
            result = response.call(request, xhr);
          } catch (e) {
            event.error.call(request, e);
            return;
          }
        } else {
          result = xhr;
        }
        event.load.call(request, result);
      } else {
        event.error.call(request, xhr);
      }
    }

    xhr.onprogress = function(e) {
      event.progress.call(request, e);
    };

    request = {
      header: function(name, value) {
        name = (name + "").toLowerCase();
        if (arguments.length < 2) return headers.get(name);
        if (value == null) headers.remove(name);
        else headers.set(name, value + "");
        return request;
      },

      // If mimeType is non-null and no Accept header is set, a default is used.
      mimeType: function(value) {
        if (!arguments.length) return mimeType;
        mimeType = value == null ? null : value + "";
        return request;
      },

      // Specifies what type the response value should take;
      // for instance, arraybuffer, blob, document, or text.
      responseType: function(value) {
        if (!arguments.length) return responseType;
        responseType = value;
        return request;
      },

      // Specify how to convert the response content to a specific type;
      // changes the callback value on "load" events.
      response: function(value) {
        response = value;
        return request;
      },

      // Alias for send("GET", …).
      get: function(data, callback) {
        return request.send("GET", data, callback);
      },

      // Alias for send("POST", …).
      post: function(data, callback) {
        return request.send("POST", data, callback);
      },

      // If callback is non-null, it will be used for error and load events.
      send: function(method, data, callback) {
        if (!callback && typeof data === "function") callback = data, data = null;
        if (callback && callback.length === 1) callback = fixCallback(callback);
        xhr.open(method, url, true);
        if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
        if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
        if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
        if (responseType != null) xhr.responseType = responseType;
        if (callback) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
        event.beforesend.call(request, xhr);
        xhr.send(data == null ? null : data);
        return request;
      },

      abort: function() {
        xhr.abort();
        return request;
      },

      on: function() {
        var value = event.on.apply(event, arguments);
        return value === event ? request : value;
      }
    };

    return callback
        ? request.get(callback)
        : request;
  };

  function fixCallback(callback) {
    return function(error, xhr) {
      callback(error == null ? xhr : null);
    };
  }

  function hasResponse(xhr) {
    var type = xhr.responseType;
    return type && type !== "text"
        ? xhr.response // null on error
        : xhr.responseText; // "" on error
  }

  function requestType(defaultMimeType, response) {
    return function(url, callback) {
      var r = request(url).mimeType(defaultMimeType).response(response);
      return callback ? r.get(callback) : r;
    };
  };

  var html = requestType("text/html", function(xhr) {
    return document.createRange().createContextualFragment(xhr.responseText);
  });

  var json = requestType("application/json", function(xhr) {
    return JSON.parse(xhr.responseText);
  });

  var text = requestType("text/plain", function(xhr) {
    return xhr.responseText;
  });

  var xml = requestType("application/xml", function(xhr) {
    var xml = xhr.responseXML;
    if (!xml) throw new Error("parse error");
    return xml;
  });

  function requestDsv(defaultMimeType, dsv) {
    return function(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var r = request(url).mimeType(defaultMimeType);
      r.row = function(_) { return arguments.length ? r.response(responseOf(dsv, row = _)) : row; };
      r.row(row);
      return callback ? r.get(callback) : r;
    };
  };

  function responseOf(dsv, row) {
    return function(request) {
      return dsv.parse(request.responseText, row);
    };
  }

  var csv = requestDsv("text/csv", d3Dsv.csv);

  var tsv = requestDsv("text/tab-separated-values", d3Dsv.tsv);

  var version = "0.2.3";

  exports.version = version;
  exports.request = request;
  exports.html = html;
  exports.json = json;
  exports.text = text;
  exports.xml = xml;
  exports.csv = csv;
  exports.tsv = tsv;

}));
},{"d3-arrays":1,"d3-dispatch":2,"d3-dsv":3}],5:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-selection', ['exports'], factory) :
  factory((global.d3_selection = {}));
}(this, function (exports) { 'use strict';

  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  function requote(string) {
    return string.replace(requoteRe, "\\$&");
  };

  var filterEvents = {};

  exports.event = null;

  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!("onmouseenter" in element)) {
      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
    }
  }

  function selection_event(type, listener, capture) {
    var n = arguments.length,
        key = "__on" + type,
        filter,
        root = this._root;

    if (n < 2) return (n = this.node()[key]) && n._listener;

    if (n < 3) capture = false;
    if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);
    if (filter = filterEvents.hasOwnProperty(type)) type = filterEvents[type];

    function add() {
      var ancestor = root, i = arguments.length >> 1, ancestors = new Array(i);
      while (--i >= 0) ancestor = ancestor[arguments[(i << 1) + 1]], ancestors[i] = i ? ancestor._parent : ancestor;
      var l = listenerOf(listener, ancestors, arguments);
      if (filter) l = filterListenerOf(l);
      remove.call(this);
      this.addEventListener(type, this[key] = l, l._capture = capture);
      l._listener = listener;
    }

    function remove() {
      var l = this[key];
      if (l) {
        this.removeEventListener(type, l, l._capture);
        delete this[key];
      }
    }

    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l._capture);
          delete this[name];
        }
      }
    }

    return this.each(listener
        ? (n ? add : noop) // Attempt to add untyped listener is ignored.
        : (n ? remove : removeAll));
  };

  function listenerOf(listener, ancestors, args) {
    return function(event1) {
      var i = ancestors.length, event0 = exports.event; // Events can be reentrant (e.g., focus).
      while (--i >= 0) args[i << 1] = ancestors[i].__data__;
      exports.event = event1;
      try {
        listener.apply(ancestors[0], args);
      } finally {
        exports.event = event0;
      }
    };
  }

  function filterListenerOf(listener) {
    return function(event) {
      var related = event.relatedTarget;
      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
        listener(event);
      }
    };
  }

  function noop() {}

  function sourceEvent() {
    var current = exports.event, source;
    while (source = current.sourceEvent) current = source;
    return current;
  };

  function defaultView$1(node) {
    return node
        && ((node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
            || (node.document && node) // node is a Window
            || node.defaultView); // node is a Document
  };

  function selection_dispatch(type, params) {

    function dispatchConstant() {
      return dispatchEvent(this, type, params);
    }

    function dispatchFunction() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    }

    return this.each(typeof params === "function" ? dispatchFunction : dispatchConstant);
  };

  function dispatchEvent(node, type, params) {
    var window = defaultView$1(node),
        event = window.CustomEvent;

    if (event) {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function selection_datum(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
  };

  function selection_remove() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  };

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var i = name.indexOf(":"), prefix = name;
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
  };

  function selectorOf(selector) {
    return function() {
      return this.querySelector(selector);
    };
  };

  function selection_append(creator, selector) {
    if (typeof creator !== "function") creator = creatorOf(creator);

    function append() {
      return this.appendChild(creator.apply(this, arguments));
    }

    function insert() {
      return this.insertBefore(creator.apply(this, arguments), selector.apply(this, arguments) || null);
    }

    return this.select(arguments.length < 2
        ? append
        : (typeof selector !== "function" && (selector = selectorOf(selector)), insert));
  };

  function creatorOf(name) {
    name = namespace(name);

    function creator() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri
          ? document.createElementNS(uri, name)
          : document.createElement(name);
    }

    function creatorNS() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    }

    return name.local ? creatorNS : creator;
  }

  function selection_html(value) {
    if (!arguments.length) return this.node().innerHTML;

    function setConstant() {
      this.innerHTML = value;
    }

    function setFunction() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    }

    if (value == null) value = "";

    return this.each(typeof value === "function" ? setFunction : setConstant);
  };

  function selection_text(value) {
    if (!arguments.length) return this.node().textContent;

    function setConstant() {
      this.textContent = value;
    }

    function setFunction() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    }

    if (value == null) value = "";

    return this.each(typeof value === "function" ? setFunction : setConstant);
  };

  function selection_class(name, value) {
    name = (name + "").trim().split(/^|\s+/);
    var n = name.length;

    if (arguments.length < 2) {
      var node = this.node(), i = -1;
      if (value = node.classList) { // SVG elements may not support DOMTokenList!
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    name = name.map(classerOf);

    function setConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }

    function setFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }

    return this.each(typeof value === "function" ? setFunction : setConstant);
  };

  function classerOf(name) {
    var re;
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      if (!re) re = classedRe(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", collapse(c + " " + name));
      } else {
        node.setAttribute("class", collapse(c.replace(re, " ")));
      }
    };
  }

  function collapse(string) {
    return string.trim().replace(/\s+/g, " ");
  }

  function classedRe(name) {
    return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
  }

  function selection_property(name, value) {
    if (arguments.length < 2) return this.node()[name];

    function remove() {
      delete this[name];
    }

    function setConstant() {
      this[name] = value;
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name];
      else this[name] = x;
    }

    return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
  };

  function selection_style(name, value, priority) {
    var n = arguments.length;

    if (n < 2) return defaultView$1(n = this.node()).getComputedStyle(n, null).getPropertyValue(name);

    if (n < 3) priority = "";

    function remove() {
      this.style.removeProperty(name);
    }

    function setConstant() {
      this.style.setProperty(name, value, priority);
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name);
      else this.style.setProperty(name, x, priority);
    }

    return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
  };

  function selection_attr(name, value) {
    name = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    function remove() {
      this.removeAttribute(name);
    }

    function removeNS() {
      this.removeAttributeNS(name.space, name.local);
    }

    function setConstant() {
      this.setAttribute(name, value);
    }

    function setConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name);
      else this.setAttribute(name, x);
    }

    function setFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local);
      else this.setAttributeNS(name.space, name.local, x);
    }

    return this.each(value == null
        ? (name.local ? removeNS : remove)
        : (typeof value === "function"
            ? (name.local ? setFunctionNS : setFunction)
            : (name.local ? setConstantNS : setConstant)));
  };

  function selection_each(callback) {
    var depth = this._depth,
        stack = new Array(depth);

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node;

      if (--depth) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;
        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            visit(node, depth);
          }
        }
      }

      else {
        while (++i < n) {
          if (node = nodes[i]) {
            stack[0] = node.__data__, stack[1] = i;
            callback.apply(node, stack);
          }
        }
      }
    }

    visit(this._root, depth);
    return this;
  };

  function selection_empty() {
    return !this.node();
  };

  function selection_size() {
    var size = 0;
    this.each(function() { ++size; });
    return size;
  };

  function selection_node() {
    return firstNode(this._root, this._depth);
  };

  function firstNode(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node;

    if (--depth) {
      while (++i < n) {
        if (node = nodes[i]) {
          if (node = firstNode(node, depth)) {
            return node;
          }
        }
      }
    }

    else {
      while (++i < n) {
        if (node = nodes[i]) {
          return node;
        }
      }
    }
  }

  function selection_nodes() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  };

  function selection_call() {
    var callback = arguments[0];
    callback.apply(arguments[0] = this, arguments);
    return this;
  };

  // The leaf groups of the selection hierarchy are initially NodeList,
  // and then lazily converted to arrays when mutation is required.
  function arrayify(selection) {
    return selection._root = arrayifyNode(selection._root, selection._depth);
  };

  function arrayifyNode(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node;

    if (--depth) {
      while (++i < n) {
        if (node = nodes[i]) {
          nodes[i] = arrayifyNode(node, depth);
        }
      }
    }

    else if (!Array.isArray(nodes)) {
      var array = new Array(n);
      while (++i < n) array[i] = nodes[i];
      array._parent = nodes._parent;
      nodes = array;
    }

    return nodes;
  }

  function selection_sort(comparator) {
    if (!comparator) comparator = ascending;

    function compare(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    }

    function visit(nodes, depth) {
      if (--depth) {
        var i = -1,
            n = nodes.length,
            node;
        while (++i < n) {
          if (node = nodes[i]) {
            visit(node, depth);
          }
        }
      }

      else {
        nodes.sort(compare);
      }
    }

    visit(arrayify(this), this._depth);
    return this.order();
  };

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_order() {
    orderNode(this._root, this._depth);
    return this;
  };

  function orderNode(nodes, depth) {
    var i = nodes.length,
        node,
        next;

    if (--depth) {
      while (--i >= 0) {
        if (node = nodes[i]) {
          orderNode(node, depth);
        }
      }
    }

    else {
      next = nodes[--i];
      while (--i >= 0) {
        if (node = nodes[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
  }

  function emptyOf(selection) {
    return new Selection(emptyNode(arrayify(selection), selection._depth), selection._depth);
  };

  function emptyNode(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node,
        empty = new Array(n);

    if (--depth) {
      while (++i < n) {
        if (node = nodes[i]) {
          empty[i] = emptyNode(node, depth);
        }
      }
    }

    empty._parent = nodes._parent;
    return empty;
  }

  // Lazily constructs the exit selection for this (update) selection.
  // Until this selection is joined to data, the exit selection will be empty.
  function selection_exit() {
    return this._exit || (this._exit = emptyOf(this));
  };

  // Lazily constructs the enter selection for this (update) selection.
  // Until this selection is joined to data, the enter selection will be empty.
  function selection_enter() {
    if (!this._enter) {
      this._enter = emptyOf(this);
      this._enter._update = this;
    }
    return this._enter;
  };

  var keyPrefix = "$";

  // The value may either be an array or a function that returns an array.
  // An optional key function may be specified to control how data is bound;
  // if no key function is specified, data is bound to nodes by index.
  // Or, if no arguments are specified, this method returns all bound data.
  function selection_data(value, key) {
    if (!value) {
      var data = new Array(this.size()), i = -1;
      this.each(function(d) { data[++i] = d; });
      return data;
    }

    var depth = this._depth - 1,
        stack = new Array(depth * 2),
        bind = key ? bindKey : bindIndex;

    if (typeof value !== "function") value = valueOf_(value);
    visit(this._root, this.enter()._root, this.exit()._root, depth);

    function visit(update, enter, exit, depth) {
      var i = -1,
          n,
          node;

      if (depth--) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;

        n = update.length;

        while (++i < n) {
          if (node = update[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            visit(node, enter[i], exit[i], depth);
          }
        }
      }

      else {
        var j = 0,
            before;

        bind(update, enter, exit, value.apply(update._parent, stack));
        n = update.length;

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        while (++i < n) {
          if (before = enter[i]) {
            if (i >= j) j = i + 1;
            while (!(node = update[j]) && ++j < n);
            before._next = node || null;
          }
        }
      }
    }

    function bindIndex(update, enter, exit, data) {
      var i = 0,
          node,
          nodeLength = update.length,
          dataLength = data.length,
          minLength = Math.min(nodeLength, dataLength);

      // Clear the enter and exit arrays, and then initialize to the new length.
      enter.length = 0, enter.length = dataLength;
      exit.length = 0, exit.length = nodeLength;

      for (; i < minLength; ++i) {
        if (node = update[i]) {
          node.__data__ = data[i];
        } else {
          enter[i] = new EnterNode(update._parent, data[i]);
        }
      }

      // Note: we don’t need to delete update[i] here because this loop only
      // runs when the data length is greater than the node length.
      for (; i < dataLength; ++i) {
        enter[i] = new EnterNode(update._parent, data[i]);
      }

      // Note: and, we don’t need to delete update[i] here because immediately
      // following this loop we set the update length to data length.
      for (; i < nodeLength; ++i) {
        if (node = update[i]) {
          exit[i] = update[i];
        }
      }

      update.length = dataLength;
    }

    function bindKey(update, enter, exit, data) {
      var i,
          node,
          dataLength = data.length,
          nodeLength = update.length,
          nodeByKeyValue = {},
          keyStack = new Array(2).concat(stack),
          keyValues = new Array(nodeLength),
          keyValue;

      // Clear the enter and exit arrays, and then initialize to the new length.
      enter.length = 0, enter.length = dataLength;
      exit.length = 0, exit.length = nodeLength;

      // Compute the keys for each node.
      for (i = 0; i < nodeLength; ++i) {
        if (node = update[i]) {
          keyStack[0] = node.__data__, keyStack[1] = i;
          keyValues[i] = keyValue = keyPrefix + key.apply(node, keyStack);

          // Is this a duplicate of a key we’ve previously seen?
          // If so, this node is moved to the exit selection.
          if (nodeByKeyValue[keyValue]) {
            exit[i] = node;
          }

          // Otherwise, record the mapping from key to node.
          else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Now clear the update array and initialize to the new length.
      update.length = 0, update.length = dataLength;

      // Compute the keys for each datum.
      for (i = 0; i < dataLength; ++i) {
        keyStack[0] = data[i], keyStack[1] = i;
        keyValue = keyPrefix + key.apply(update._parent, keyStack);

        // Is there a node associated with this key?
        // If not, this datum is added to the enter selection.
        if (!(node = nodeByKeyValue[keyValue])) {
          enter[i] = new EnterNode(update._parent, data[i]);
        }

        // Did we already bind a node using this key? (Or is a duplicate?)
        // If unique, the node and datum are joined in the update selection.
        // Otherwise, the datum is ignored, neither entering nor exiting.
        else if (node !== true) {
          update[i] = node;
          node.__data__ = data[i];
        }

        // Record that we consumed this key, either to enter or update.
        nodeByKeyValue[keyValue] = true;
      }

      // Take any remaining nodes that were not bound to data,
      // and place them in the exit selection.
      for (i = 0; i < nodeLength; ++i) {
        if ((node = nodeByKeyValue[keyValues[i]]) !== true) {
          exit[i] = node;
        }
      }
    }

    return this;
  };

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next || this._next); }
  };

  function valueOf_(value) { // XXX https://github.com/rollup/rollup/issues/12
    return function() {
      return value;
    };
  }

  // The filter may either be a selector string (e.g., ".foo")
  // or a function that returns a boolean.
  function selection_filter(filter) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    if (typeof filter !== "function") filter = filterOf(filter);

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node,
          subnodes;

      if (--depth) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;
        subnodes = new Array(n);
        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            subnodes[i] = visit(node, depth);
          }
        }
      }

      // The filter operation does not preserve the original index,
      // so the resulting leaf groups are dense (not sparse).
      else {
        subnodes = [];
        while (++i < n) {
          if (node = nodes[i]) {
            stack[0] = node.__data__, stack[1] = i;
            if (filter.apply(node, stack)) {
              subnodes.push(node);
            }
          }
        }
      }

      subnodes._parent = nodes._parent;
      return subnodes;
    }

    return new Selection(visit(this._root, depth), depth);
  };

  var filterOf = function(selector) {
    return function() {
      return this.matches(selector);
    };
  };

  if (typeof document !== "undefined") {
    var element$1 = document.documentElement;
    if (!element$1.matches) {
      var vendorMatches = element$1.webkitMatchesSelector || element$1.msMatchesSelector || element$1.mozMatchesSelector || element$1.oMatchesSelector;
      filterOf = function(selector) { return function() { return vendorMatches.call(this, selector); }; };
    }
  }

  // The selector may either be a selector string (e.g., ".foo")
  // or a function that optionally returns an array of nodes to select.
  // This is the only operation that increases the depth of a selection.
  function selection_selectAll(selector) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    if (typeof selector !== "function") selector = selectorAllOf(selector);

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node,
          subnode,
          subnodes = new Array(n);

      if (--depth) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;
        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            subnodes[i] = visit(node, depth);
          }
        }
      }

      // Data is not propagated since there is a one-to-many mapping.
      // The parent of the new leaf group is the old node.
      else {
        while (++i < n) {
          if (node = nodes[i]) {
            stack[0] = node.__data__, stack[1] = i;
            subnodes[i] = subnode = selector.apply(node, stack);
            subnode._parent = node;
          }
        }
      }

      subnodes._parent = nodes._parent;
      return subnodes;
    }

    return new Selection(visit(this._root, depth), depth + 1);
  };

  function selectorAllOf(selector) {
    return function() {
      return this.querySelectorAll(selector);
    };
  }

  // The selector may either be a selector string (e.g., ".foo")
  // or a function that optionally returns the node to select.
  function selection_select(selector) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    if (typeof selector !== "function") selector = selectorOf(selector);

    function visit(nodes, update, depth) {
      var i = -1,
          n = nodes.length,
          node,
          subnode,
          subnodes = new Array(n);

      if (--depth) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;
        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            subnodes[i] = visit(node, update && update[i], depth);
          }
        }
      }

      // The leaf group may be sparse if the selector returns a falsey value;
      // this preserves the index of nodes (unlike selection.filter).
      // Propagate data to the new node only if it is defined on the old.
      // If this is an enter selection, materialized nodes are moved to update.
      else {
        while (++i < n) {
          if (node = nodes[i]) {
            stack[0] = node.__data__, stack[1] = i;
            if (subnode = selector.apply(node, stack)) {
              if ("__data__" in node) subnode.__data__ = node.__data__;
              if (update) update[i] = subnode, delete nodes[i];
              subnodes[i] = subnode;
            }
          }
        }
      }

      subnodes._parent = nodes._parent;
      return subnodes;
    }

    return new Selection(visit(this._root, this._update && this._update._root, depth), depth);
  };

  // When depth = 1, root = [Node, …].
  // When depth = 2, root = [[Node, …], …].
  // When depth = 3, root = [[[Node, …], …], …]. etc.
  // Note that [Node, …] and NodeList are used interchangeably; see arrayify.
  function Selection(root, depth) {
    this._root = root;
    this._depth = depth;
    this._enter = this._update = this._exit = null;
  };

  function selection() {
    return new Selection([document.documentElement], 1);
  }

  Selection.prototype = selection.prototype = {
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    class: selection_class,
    classed: selection_class, // deprecated alias
    text: selection_text,
    html: selection_html,
    append: selection_append,
    insert: selection_append, // deprecated alias
    remove: selection_remove,
    datum: selection_datum,
    event: selection_event,
    on: selection_event, // deprecated alias
    dispatch: selection_dispatch
  };

  function select(selector) {
    return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
  };

  var bug44083 = typeof navigator !== "undefined" && /WebKit/.test(navigator.userAgent) ? -1 : 0; // https://bugs.webkit.org/show_bug.cgi?id=44083

  function point(node, event) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (bug44083 < 0) {
        var window = defaultView(node);
        if (window.scrollX || window.scrollY) {
          svg = select(window.document.body).append("svg").style({position: "absolute", top: 0, left: 0, margin: 0, padding: 0, border: "none"}, "important");
          var ctm = svg.node().getScreenCTM();
          bug44083 = !(ctm.f || ctm.e);
          svg.remove();
        }
      }
      if (bug44083) point.x = event.pageX, point.y = event.pageY;
      else point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  };

  function mouse(node, event) {
    if (arguments.length < 2) event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point(node, event);
  };

  function selectAll(selector) {
    return new Selection(typeof selector === "string" ? document.querySelectorAll(selector) : selector, 1);
  };

  function touch(node, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;
    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return point(node, touch);
      }
    }
    return null;
  };

  function touches(node, touches) {
    if (arguments.length < 2) touches = sourceEvent().touches;
    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
      points[i] = point(node, touches[i]);
    }
    return points;
  };

  var version = "0.4.12";

  exports.version = version;
  exports.mouse = mouse;
  exports.namespace = namespace;
  exports.namespaces = namespaces;
  exports.requote = requote;
  exports.select = select;
  exports.selectAll = selectAll;
  exports.selection = selection;
  exports.touch = touch;
  exports.touches = touches;

}));
},{}],6:[function(require,module,exports){
'use strict';

var d3 = {
	csv:require('d3-request').csv,
	select:require('d3-selection').select
};

d3.csv('data/obliquestrategies.csv')
	.get(function(error, csvData){
		draw(csvData, 5);
	});

function draw(data, displaySet){
	if(displaySet !== undefined) displaySet = 5;

	var filtered = data.filter(function(d){
		return Number(d.edition) === displaySet;
	});

	d3.select('button.random').on('click',function(){
		goTo( Math.floor( Math.random()*filtered.length ) );
	});

	d3.select('button.info').on('click',function(){
		document.getElementById('info').scrollIntoView();
	});


	var dataJoin = d3.select('article')
		.selectAll('section.card')
		.data(filtered);
	
	dataJoin
		.enter()
		.append('section')
		.attr('class','card unselected');
	
	dataJoin
		.attr('id',function(d,i){ return 'card-'+i; })
		.attr('class', function(d,i){
			return 'card unselected';
		})
		.text(function(d){
			if(d.card_text === '[blank white card]') return '';
			return d.card_text;
		});

	goTo( Math.floor( Math.random()*filtered.length ) );
}

function goTo(id){
	var card = d3.select('#card-'+id)
	card.node().scrollIntoView();
	d3.select('article').selectAll('.card').attr('class', function(d,i){
		if(i===id) return 'card selected'
		return 'card unselected';
	})
}
},{"d3-request":4,"d3-selection":5}]},{},[6]);
