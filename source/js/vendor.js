// ! Trap Focus

const CANDIDATES = `
  a, button, input, select, textarea, svg, area, details, summary,
  iframe, object, embed, li,
  [tabindex], [contenteditable]
`;

const trapFocus = (focusNode, rootNode = document) => {
  const nodes = [...rootNode.querySelectorAll(CANDIDATES)]
    .filter(node => !focusNode.contains(node) && node.getAttribute('tabindex') !== '-1');
  nodes.forEach(node => node.setAttribute('tabindex', '-1'));
  return {
    release() {
      nodes.forEach(node => node.removeAttribute('tabindex'));
    },
  };
};

// startWith polyfill

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

// zenscroll
! function(t, e) {
  "function" == typeof define && define.amd ? define([], e()) : "object" == typeof module && module.exports ? module.exports = e() : function n() {
    document && document.body ? t.zenscroll = e() : setTimeout(n, 9)
  }()
}(this, function() {
  "use strict";
  var t = function(t) {
    return t && "getComputedStyle" in window && "smooth" === window.getComputedStyle(t)["scroll-behavior"]
  };
  if ("undefined" == typeof window || !("document" in window)) return {};
  var e = function(e, n, o) {
      n = n || 999, o || 0 === o || (o = 9);
      var i, r = function(t) {
          i = t
        },
        u = function() {
          clearTimeout(i), r(0)
        },
        c = function(t) {
          return Math.max(0, e.getTopOf(t) - o)
        },
        a = function(o, i, c) {
          if (u(), 0 === i || i && i < 0 || t(e.body)) e.toY(o), c && c();
          else {
            var a = e.getY(),
              f = Math.max(0, o) - a,
              s = (new Date).getTime();
            i = i || Math.min(Math.abs(f), n),
              function t() {
                r(setTimeout(function() {
                  var n = Math.min(1, ((new Date).getTime() - s) / i),
                    o = Math.max(0, Math.floor(a + f * (n < .5 ? 2 * n * n : n * (4 - 2 * n) - 1)));
                  e.toY(o), n < 1 && e.getHeight() + o < e.body.scrollHeight ? t() : (setTimeout(u, 99), c && c())
                }, 9))
              }()
          }
        },
        f = function(t, e, n) {
          a(c(t), e, n)
        },
        s = function(t, n, i) {
          var r = t.getBoundingClientRect().height,
            u = e.getTopOf(t) + r,
            s = e.getHeight(),
            l = e.getY(),
            d = l + s;
          c(t) < l || r + o > s ? f(t, n, i) : u + o > d ? a(u - s + o, n, i) : i && i()
        },
        l = function(t, n, o, i) {
          a(Math.max(0, e.getTopOf(t) - e.getHeight() / 2 + (o || t.getBoundingClientRect().height / 2)), n, i)
        };
      return {
        setup: function(t, e) {
          return (0 === t || t) && (n = t), (0 === e || e) && (o = e), {
            defaultDuration: n,
            edgeOffset: o
          }
        },
        to: f,
        toY: a,
        intoView: s,
        center: l,
        stop: u,
        moving: function() {
          return !!i
        },
        getY: e.getY,
        getTopOf: e.getTopOf
      }
    },
    n = document.documentElement,
    o = function() {
      return window.scrollY || n.scrollTop
    },
    i = e({
      body: document.scrollingElement || document.body,
      toY: function(t) {
        window.scrollTo(0, t)
      },
      getY: o,
      getHeight: function() {
        return window.innerHeight || n.clientHeight
      },
      getTopOf: function(t) {
        return t.getBoundingClientRect().top + o() - n.offsetTop
      }
    });
  if (i.createScroller = function(t, o, i) {
      return e({
        body: t,
        toY: function(e) {
          t.scrollTop = e
        },
        getY: function() {
          return t.scrollTop
        },
        getHeight: function() {
          return Math.min(t.clientHeight, window.innerHeight || n.clientHeight)
        },
        getTopOf: function(t) {
          return t.offsetTop
        }
      }, o, i)
    }, "addEventListener" in window && !window.noZensmooth && !t(document.body)) {
    var r = "history" in window && "pushState" in history,
      u = r && "scrollRestoration" in history;
    u && (history.scrollRestoration = "auto"), window.addEventListener("load", function() {
      u && (setTimeout(function() {
        history.scrollRestoration = "manual"
      }, 9), window.addEventListener("popstate", function(t) {
        t.state && "zenscrollY" in t.state && i.toY(t.state.zenscrollY)
      }, !1)), window.location.hash && setTimeout(function() {
        var t = i.setup().edgeOffset;
        if (t) {
          var e = document.getElementById(window.location.href.split("#")[1]);
          if (e) {
            var n = Math.max(0, i.getTopOf(e) - t),
              o = i.getY() - n;
            0 <= o && o < 9 && window.scrollTo(0, n)
          }
        }
      }, 9)
    }, !1);
    var c = new RegExp("(^|\\s)noZensmooth(\\s|$)");
    window.addEventListener("click", function(t) {
      for (var e = t.target; e && "A" !== e.tagName;) e = e.parentNode;
      if (!(!e || 1 !== t.which || t.shiftKey || t.metaKey || t.ctrlKey || t.altKey)) {
        if (u) {
          var n = history.state && "object" == typeof history.state ? history.state : {};
          n.zenscrollY = i.getY();
          try {
            history.replaceState(n, "")
          } catch (t) {}
        }
        var o = e.getAttribute("href") || "";
        if (0 === o.indexOf("#") && !c.test(e.className)) {
          var a = 0,
            f = document.getElementById(o.substring(1));
          if ("#" !== o) {
            if (!f) return;
            a = i.getTopOf(f)
          }
          t.preventDefault();
          var s = function() {
              window.location = o
            },
            l = i.setup().edgeOffset;
          l && (a = Math.max(0, a - l), r && (s = function() {
            history.pushState({}, "", o)
          })), i.toY(a, null, s)
        }
      }
    }, !1)
  }
  return i
});

// numbered

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    root.Numbered = factory()
  }
}(this, function() {
  'use strict';
  var defaults = {
    mask: '+7 (###) ### - ## - ##',
    numbered: '#',
    empty: '_',
    placeholder: !1
  };
  var Numbered = function(target, params) {
    var self = this;
    if (typeof target !== 'object') {
      self.inputs = document.querySelectorAll(target)
    } else if (typeof target.length !== 'undefined') {
      self.inputs = target
    } else {
      self.inputs = [target]
    }
    self.inputs = Array.prototype.slice.call(self.inputs);
    params = params || (typeof self.inputs[0].numbered !== 'undefined' ? self.inputs[0].numbered.params : {});
    for (var def in defaults) {
      if (typeof params[def] === 'undefined') {
        params[def] = defaults[def]
      }
    }
    self.params = params;
    self.config = {};
    self.config.placeholder = self.params.mask.replace(new RegExp(self.params.numbered, 'g'), self.params.empty);
    self.config.numbered = self.params.numbered.replace(/([()[\]\.^\#$|?+-])/g, '\\\\$1');
    self.config.numberedCol = self.params.mask.split(self.params.numbered).length - 1;
    self.config.empty = self.params.empty.replace(/([()[\]\.^\#$|?+-])/g, '\\$1');
    self.config.mask = self.params.mask.replace(/([()[\]\.^\#$|?+-])/g, '\\$1').replace(new RegExp(self.config.numbered, 'g'), '(\\d)');
    self.config.maskNums = self.params.mask.replace(/[^\d]/gi, '').split('');
    self.config.maskNumsCol = self.config.maskNums.length;
    self.config.regexp = new RegExp('^' + self.config.mask + '$');
    self.config.events = ['input', 'change', 'click', 'focusin', 'blur'];
    self._eventFire = function(el, etype) {
      if (el.fireEvent) {
        el.fireEvent('on' + etype)
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, !0, !1);
        el.dispatchEvent(evObj)
      }
    };
    self._getSelectionRange = function(oElm) {
      var r = {
        text: '',
        start: 0,
        end: 0,
        length: 0
      };
      if (oElm.setSelectionRange) {
        r.start = oElm.selectionStart;
        r.end = oElm.selectionEnd;
        r.text = (r.start != r.end) ? oElm.value.substring(r.start, r.end) : ''
      } else if (document.selection) {
        var oR;
        if (oElm.tagName && oElm.tagName === 'TEXTAREA') {
          var oS = document.selection.createRange().duplicate();
          oR = oElm.createTextRange();
          var sB = oS.getBookmark();
          oR.moveToBookmark(sB)
        } else {
          oR = document.selection.createRange().duplicate()
        }
        r.text = oR.text;
        for (; oR.moveStart('character', -1) !== 0; r.start++);
        r.end = r.text.length + r.start
      }
      r.length = r.text.length;
      return r
    };
    self.magic = function(event) {
      var numbered = this.numbered;
      var value = numbered.input.value || ' ';
      var valueFormatted = value.replace(/[^\d]/gi, '').split('').join('');
      var valueFormattedArr = valueFormatted.split('');
      var valueFormattedCol = valueFormattedArr.length;
      var valueFormattedIndex = 0;
      var positionStart = -1;
      var positionEnd = -1;
      var positionOld = self._getSelectionRange(numbered.input);
      var maskNumsIndex = 0;
      var valueFormattedRes = [];
      var maskSplit = numbered.params.mask.split('');
      for (var key in maskSplit) {
        var val = maskSplit[key];
        key = parseInt(key);
        if (maskNumsIndex <= numbered.config.maskNumsCol && val == numbered.config.maskNums[maskNumsIndex] && val == valueFormattedArr[valueFormattedIndex]) {
          valueFormattedRes.push(val);
          maskNumsIndex++;
          valueFormattedIndex++
        } else if (val == numbered.params.numbered) {
          if (positionStart < 0) {
            positionStart = key
          }
          if (valueFormattedIndex < valueFormattedCol) {
            valueFormattedRes.push(valueFormattedArr[valueFormattedIndex]);
            valueFormattedIndex++;
            positionEnd = key
          } else {
            valueFormattedRes.push(numbered.params.empty)
          }
        } else {
          valueFormattedRes.push(val)
        }
      }
      value = valueFormattedRes.join('');
      var position = (positionEnd >= 0 ? positionEnd + 1 : positionStart);
      if (event.type !== 'click') {
        if ((event.type === 'blur' || event.type === 'change') && valueFormattedIndex - maskNumsIndex === 0 && !numbered.params.placeholder) {
          this.value = ''
        } else if (numbered.oldValue !== numbered.input.value || event.type === 'focusin') {
          this.value = value
        }
      }
      if (event.type !== 'change' && event.type !== 'blur' && (event.type !== 'click' || (numbered.lastEvent === 'focusin' && event.type === 'click'))) {
        if (numbered.input.setSelectionRange) {
          numbered.input.setSelectionRange(position, position)
        } else if (numbered.input.createTextRange) {
          var range = numbered.input.createTextRange();
          range.collapse(!0);
          range.moveEnd('character', position);
          range.moveStart('character', position);
          range.select()
        }
      }
      numbered.oldValue = this.value;
      numbered.lastEvent = event.type;
      return event.target
    };
    for (var index in self.inputs) {
      var $input = self.inputs[index];
      var is = !1;
      if (typeof $input.numbered === 'оbject' || typeof $input.numbered !== 'undefined') {
        is = !0
      }
      $input.numbered = {
        input: self.inputs[index],
        config: self.config,
        params: self.params,
        oldValue: !1
      };
      if (!is) {
        for (var key in self.config.events) {
          $input.addEventListener(self.config.events[key], self.magic)
        }
        self._eventFire($input, 'blur')
      }
      self.inputs[index] = $input
    }
    self.destroy = function() {
      var self = this;
      for (var index in self.inputs) {
        var $input = self.inputs[index];
        for (var key in self.config.events) {
          $input.removeEventListener(self.config.events[key], self.magic);
          $input.numbered = null
        }
      }
      return null
    };
    self.validate = function(i) {
      var input = i || !1;
      var self = this;
      var res = self.inputs.length > 1 ? [] : !1;
      var inputs = input !== !1 ? [input] : self.inputs;
      for (var index in inputs) {
        var $input = inputs[index];
        var validate;
        if (inputs[index].numbered.config.regexp.test(inputs[index].numbered.input.value)) {
          validate = 1
        } else if (inputs[index].numbered.input.value === '' || inputs[index].numbered.input.value === inputs[index].numbered.config.placeholder) {
          validate = 0
        } else {
          validate = -1
        }
        if (inputs.length > 1) {
          res.push(validate)
        } else {
          res = validate
        }
      }
      return res
    };
    self.reInit = function() {
      var self = this;
      var res = self.inputs.length > 1 ? [] : !1;
      for (var index in self.inputs) {
        var $input = self.inputs[index];
        self._eventFire($input, 'blur')
      }
      return res
    };
    self.setVal = function(value) {
      var self = this;
      var res = self.inputs.length > 1 ? [] : !1;
      for (var index in self.inputs) {
        var $input = self.inputs[index];
        $input.value = value;
        self._eventFire($input, 'blur')
      }
      return res
    };
    self.getVal = function(r) {
      var raw = r || !1;
      var values = [];
      for (var index in this.inputs) {
        var $input = this.inputs[index];
        var value = $input.value;
        if (raw) {
          if (this.validate($input) > 0) {
            var arr = value.match(this.config.regexp);
            value = arr.slice(1, arr.length).join('')
          } else {
            value = $input.value.replace(/[^\d]/gi, '')
          }
        }
        values.push(value)
      }
      return values.length > 1 ? values : values[0]
    };
    return self
  };
  return Numbered
}))

// yall.js

// yall.js

var yall = function() {
  "use strict";
  return function(e) {
    var n = (e = e || {}).lazyClass || "lazy",
      t = e.lazyBackgroundClass || "lazy-bg",
      o = "idleLoadTimeout" in e ? e.idleLoadTimeout : 200,
      i = e.observeChanges || !1,
      r = e.events || {},
      a = window,
      s = "requestIdleCallback",
      u = "IntersectionObserver",
      c = ["srcset", "src", "poster"],
      d = [],
      queryDOM = function(e, o) {
        return d.slice.call((o || document).querySelectorAll(e || "img." + n + ",video." + n + ",iframe." + n + ",." + t))
      },
      yallLoad = function(n) {
        var o = n.parentNode;
        "PICTURE" == o.nodeName && yallApplyFn(queryDOM("source", o), yallFlipDataAttrs), "VIDEO" == n.nodeName && yallApplyFn(queryDOM("source", n), yallFlipDataAttrs), yallFlipDataAttrs(n), n.autoplay && n.load();
        var i = n.classList;
        i.contains(t) && (i.remove(t), i.add(e.lazyBackgroundLoaded || "lazy-bg-loaded"))
      },
      yallBindEvents = function(e) {
        for (var n in r) e.addEventListener(n, r[n].listener || r[n], r[n].options || void 0)
      },
      yallFlipDataAttrs = function(e) {
        var _loop = function(n) {
          c[n] in e.dataset && a.requestAnimationFrame((function() {
            e.setAttribute(c[n], e.dataset[c[n]])
          }))
        };
        for (var n in c) _loop(n)
      },
      yallApplyFn = function(e, n) {
        for (var t = 0; t < e.length; t++) n instanceof a[u] ? n.observe(e[t]) : n(e[t])
      },
      yallIntersectionObserve = function(e) {
        if (e.isIntersecting || e.intersectionRatio) {
          var t = e.target;
          s in a && o ? a[s]((function() {
            yallLoad(t)
          }), {
            timeout: o
          }) : yallLoad(t), t.classList.remove(n), f.unobserve(t), (l = l.filter((function(e) {
            return e != t
          }))).length || i || f.disconnect()
        }
      },
      yallMutationObserve = function(e) {
        l.indexOf(e) < 0 && (l.push(e), yallBindEvents(e), f.observe(e))
      },
      l = queryDOM();
    if (/baidu|(?:google|bing|yandex|duckduck)bot/i.test(navigator.userAgent)) yallApplyFn(l, yallLoad);
    else if (u in a && u + "Entry" in a) {
      var f = new a[u]((function(e) {
        yallApplyFn(e, yallIntersectionObserve)
      }), {
        rootMargin: ("threshold" in e ? e.threshold : 200) + "px 0%"
      });
      yallApplyFn(l, yallBindEvents), yallApplyFn(l, f), i && yallApplyFn(queryDOM(e.observeRootSelector || "body"), (function(n) {
        new MutationObserver((function() {
          yallApplyFn(queryDOM(), yallMutationObserve)
        })).observe(n, e.mutationObserverOptions || {
          childList: !0,
          subtree: !0
        })
      }))
    }
  }
}();
