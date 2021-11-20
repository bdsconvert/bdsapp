/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
export function json2xml(o, tab) {
  var toXml = function (v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
        for (var i = 0, n = v.length; i < n; i++) xml += ind + toXml(v[i], name, ind + "\t") + "\n";
      } else if (typeof v === "object") {
        var hasChild = false;
        xml += ind + "<" + name;
        for (var m in v) {
          if (m.charAt(0) === "@") xml += " " + m.substr(1) + '="' + v[m].toString() + '"';
          else hasChild = true;
        }
        xml += hasChild ? ">" : "/>";
        if (hasChild) {
          for (var m in v) {
            if (m === "#text") xml += v[m];
            else if (m === "#cdata") xml += "<![CDATA[" + v[m] + "]]>";
            else if (m.charAt(0) !== "@") xml += toXml(v[m], m, ind + "\t");
          }
          xml += (xml.charAt(xml.length - 1) === "\n" ? ind : "") + "</" + name + ">";
        }
      } else {
        xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
      }
      return xml;
    },
    xml = "";
  for (var m in o) xml += toXml(o[m], m, "");
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
////////////////////////////////////////////////////////////////////////////

export function xml2json(xml, tab) {
  let X = {
    toObj: function (xml) {
      let o = {};
      if (xml.nodeType === 1) {
        // element node ..
        if (xml.attributes.length)
          // element with attributes  ..
          for (let i = 0; i < xml.attributes.length; i++)
            o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
        if (xml.firstChild) {
          // element has child nodes ..
          let textChild = 0,
            cdataChild = 0,
            hasElementChild = false;
          for (let n = xml.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 1) hasElementChild = true;
            else if (n.nodeType === 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++;
            // non-whitespace text
            else if (n.nodeType === 4) cdataChild++; // cdata section node
          }
          if (hasElementChild) {
            if (textChild < 2 && cdataChild < 2) {
              // structured element with evtl. a single text or/and cdata node ..
              X.removeWhite(xml);
              for (let n = xml.firstChild; n; n = n.nextSibling) {
                if (n.nodeType === 3)
                  // text node
                  o["#text"] = X.escape(n.nodeValue);
                else if (n.nodeType === 4)
                  // cdata node
                  o["#cdata"] = X.escape(n.nodeValue);
                else if (o[n.nodeName]) {
                  // multiple occurence of element ..
                  if (o[n.nodeName] instanceof Array) o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                  else o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                } // first occurence of element..
                else o[n.nodeName] = X.toObj(n);
              }
            } else {
              // mixed content
              if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
              else o["#text"] = X.escape(X.innerXml(xml));
            }
          } else if (textChild) {
            // pure text
            if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
            else o["#text"] = X.escape(X.innerXml(xml));
          } else if (cdataChild) {
            // cdata
            if (cdataChild > 1) o = X.escape(X.innerXml(xml));
            else for (var n = xml.firstChild; n; n = n.nextSibling) o["#cdata"] = X.escape(n.nodeValue);
          }
        }
        if (!xml.attributes.length && !xml.firstChild) o = null;
      } else if (xml.nodeType === 9) {
        // document.node
        o = X.toObj(xml.documentElement);
      } else alert("unhandled node type: " + xml.nodeType);

      return o;
    },
    toJson: function (o, name, ind) {
      let json = name ? '"' + name + '"' : "";
      if (o instanceof Array) {
        for (let i = 0, n = o.length; i < n; i++) o[i] = X.toJson(o[i], "", ind + "\t");
        json += (name ? ":[" : "[") + (o.length > 1 ? "\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind : o.join("")) + "]";
      } else if (o == null) json += (name && ":") + "null";
      else if (typeof o === "object") {
        let arr = [];
        for (let m in o) arr[arr.length] = X.toJson(o[m], m, ind + "\t");
        json += (name ? ":{" : "{") + (arr.length > 1 ? "\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind : arr.join("")) + "}";
      } else if (typeof o === "string") json += (name && ":") + '"' + o.toString() + '"';
      else json += (name && ":") + o.toString();
      return json;
    },
    innerXml: function (node) {
      let s = "";
      if ("innerHTML" in node) s = node.innerHTML;
      else {
        let asXml = function (n) {
          let s = "";
          if (n.nodeType === 1) {
            s += "<" + n.nodeName;
            for (let i = 0; i < n.attributes.length; i++)
              s += " " + n.attributes[i].nodeName + '="' + (n.attributes[i].nodeValue || "").toString() + '"';
            if (n.firstChild) {
              s += ">";
              for (let c = n.firstChild; c; c = c.nextSibling) s += asXml(c);
              s += "</" + n.nodeName + ">";
            } else s += "/>";
          } else if (n.nodeType === 3) s += n.nodeValue;
          else if (n.nodeType === 4) s += "<![CDATA[" + n.nodeValue + "]]>";
          return s;
        };
        for (let c = node.firstChild; c; c = c.nextSibling) s += asXml(c);
      }
      return s;
    },
    escape: function (txt) {
      return txt.replace(/[\\]/g, "\\\\").replace(/["]/g, '"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");
    },
    removeWhite: function (e) {
      e.normalize();
      for (let n = e.firstChild; n; ) {
        if (n.nodeType === 3) {
          // text node
          if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
            // pure whitespace text node
            let nxt = n.nextSibling;
            e.removeChild(n);
            n = nxt;
          } else n = n.nextSibling;
        } else if (n.nodeType === 1) {
          // element node
          X.removeWhite(n);
          n = n.nextSibling;
        } // any other node
        else n = n.nextSibling;
      }
      return e;
    }
  };
  if (xml.nodeType === 9)
    // document node
    xml = xml.documentElement;
  return X.toObj(X.removeWhite(xml));
  //var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
  //return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}
////////////////////////////////////////////////////////////////////////////

//  var flattendObj = {};
// const flattenObject = (obj, keyName) => {
//   Object.keys(obj).forEach(key => {
//     var newKey = `${keyName}_${key}`
//     if (typeof obj[key] === "object") {
//       // calling the function again
//       flattenObject(obj[key], newKey);
//     } else {
//       flattendObj[newKey] = obj[key];
//     }
//   });
// };
// console.log(flattendObj);
////////////////////////////////////////////////////////////////////////////

export function flatten(obj, parent) {
  let objflat = {};
  let flat = function (obj, parent) {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null && Array.isArray(obj[key]) === false) {
        flat(obj[key], parent + "_" + key);
      } else if (Array.isArray(obj[key]) === true) {
        flat({ ...obj[key] }, parent + "_" + key);
      } else {
        objflat[parent + "_" + key] = obj[key];
      }
    }
  };
  flat(obj, parent);
  return objflat;
}
////////////////////////////////////////////////////////////////////////////

export function unflatten(data) {
  var objunflat = {};
  for (var i in data) {
    var keys = i.split("_");
    keys.reduce(function (r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? data[i] : {}) : []);
    }, objunflat);
  }
  return objunflat;
}
////////////////////////////////////////////////////////////////////////////

export function formatJson(json) {
  const js = json ? JSON.parse(json.replace(/[Pp]roduct\./g, "")) : "";
  let table = `<style>
					tr:nth-child(odd) {background-color:rgb(250, 250, 250);}
					td {max-width:24vw;overflow-wrap:break-word;border-right:5px solid white;padding:5px;} 
				 </style> 
				 <table><tbody>`;
  //white-space:nowrap;text-overflow:ellipsis;
  for (let key in js) {
    table += `<tr><td>${key}</td><td>${js[key]}</td></tr>`;
  }
  table += `</tbody></table>`;
  return table;
}
////////////////////////////////////////////////////////////////////////////

export function formatXml(xml) {
  xml = xml.trim().replace(/\s*(>)\s*(\r\n)*\n*\s*(<)(\/*)/g, "$1\r\n$3$4");
  let xmlrows = xml.split("\r\n");
  let formated = "";
  let pad = 0;
  xmlrows.forEach((row) => {
    let indent = 0;
    let padding = "";
    let expand = "";
    if (row.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (row.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (row.match(/^<\w([^>]*[^\/])?>.*$/)) {
      indent = 1;
      // expand = `<span>${
      //   pad === 2
      // 	? "&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
      // 	: pad === 3
      // 	? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;"
      // 	: pad === 4
      // 	? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
      // 	:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
      // }</span>`;
    } else {
      indent = 0;
    }

    for (let i = 0; i < pad; i++) {
      if (expand !== "") {
        padding += "&nbsp;&nbsp;&nbsp;&nbsp;";
      } else {
        padding += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
    }
    formated +=
      padding +
      expand +
      row
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/&lt;/g, "<lt style='color:blue'>&lt;</lt>")
        .replace(/&gt;/g, "<gt style='color:blue'>&gt;</gt>")
        .replace(/(<\/lt>)[\/]+([\w]+)(<gt)/g, "/$1<elem style='color:brown'>$2</elem>$3")
        .replace(/(<\/lt>)([\w]+)(<gt>)/g, "$1<elem style='color:brown'>$2</elem>$3")
        .replace(/(<\/lt>)([^<]*)(<gt)/g, "$1<elem style='color:brown'>$2</elem>$3")
        .replace(/(<\/lt>)([\w]+[\s]*[\/]+)(<gt>)/g, "$1<elem style='color:brown'>$2</elem>$3")
        .replace(/<lt>&lt;<\/lt>!--[\s]*/g, "<cmnt style='color:gray'>&lt;!--")
        .replace(/[\s]*--<gt>&gt;<\/gt>/g, "--&gt;</cmnt>")
        .replace(/<lt>&lt;<\/lt>![[][\s]*/g, "<cmnt style='color:gray'>&lt;[")
        .replace(/[\s]*]<gt>&gt;<\/gt>/g, "]&gt;</cmnt>")
        .replace(/&quot;([\w]+)&quot;/g, "&quot;<attr style='color:black'>$1</attr>&quot;")
        .replace(/&quot;/g, "<quote style='color:blue'>&quot;</quote>") +
      "<br/>";
    pad += indent;
  });
  //console.log(formated);
  return formated;
}
////////////////////////////////////////////////////////////////////////////

export const unique = function (arr1, arr2) {
  var a = arr1.concat(arr2);
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};
////////////////////////////////////////////////////////////////////////////

export function union(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}
////////////////////////////////////////////////////////////////////////////
