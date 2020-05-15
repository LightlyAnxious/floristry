// Focus manager

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.focusManager = factory();
  }
}(this, function() {
"use strict";

function isAncestor(ancestor, descendant) {
  var element = descendant;
  while (element) {
    if (element === ancestor) {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}

function isDisabled(element) {
  return element.disabled === true;
}

function isFocusable(element) {
  return Boolean(element) && element.tabIndex >= 0 && !isDisabled(element);
}

function makeFocusable(element) {
  // A tabIndex is needed to make the element focusable
  // A tabIndex of -1 means that the element is only programmatically focusable
  if (isDisabled(element)) {
    element.disabled = false;
  }

  if (!isFocusable(element)) {
    element.tabIndex = -1;
  }
}

// Find the first focusable element.
// The candidates are the element and it's descendants.
// The search is performed depth-first.
function findFirstFocusableElement(element) {
  if (isFocusable(element)) {
    return element;
  }

  var children = element.children;
  var length = children.length;
  var child;
  var focusableDescendant;

  for (var i = 0; i < length; i += 1) {
    child = children[i];

    focusableDescendant = findFirstFocusableElement(child);

    if (focusableDescendant) {
      return focusableDescendant;
    }
  }

  return null;
}

// Find the first focusable element.
// The candidates are the element and it's descendants.
// The search is performed depth-first.
function findLastFocusableElement(element) {
  var children = element.children;
  var length = children.length;
  var child;
  var focusableDescendant;

  for (var i = length -1; i >= 0; i -= 1) {
    child = children[i];

    focusableDescendant = findLastFocusableElement(child);

    if (focusableDescendant) {
      return focusableDescendant;
    }
  }

  if (isFocusable(element)) {
    return element;
  }

  return null;
}

function focus(element) {
  makeFocusable(element);
  element.focus();
  state.lastFocus = element;
}

function resolveFocus(parent, defaultFocus) {
  var focusElement;

  if (defaultFocus) {
    focusElement = defaultFocus;
  } else {
    focusElement = findFirstFocusableElement(parent) || parent;

    if (focusElement === state.lastFocus) {
      focusElement = findLastFocusableElement(parent) || parent;
    }
  }

  focus(focusElement);
}

function focusFirstInElement(element) {
  var focusElement = findFirstFocusableElement(element) || element;
  focus(focusElement);
}

function focusLastInElement(element) {
  var focusElement = findLastFocusableElement(element) || element;
  focus(focusElement);
}

// State is kept is these variables.
// Since only one modal dialog can capture focus at a time the state is a singleton.
var state = {
  eventListenerArguments: null,
  eventListenerContext: null,
  lastFocus: null
};

function releaseModalFocus(focusElement) {
  var eventListenerContext = state.eventListenerContext;
  var eventListenerArguments = state.eventListenerArguments;

  if (eventListenerContext && eventListenerArguments) {
    eventListenerContext.removeEventListener.apply(eventListenerContext, eventListenerArguments);
  }

  // Reset the state object
  state.eventListenerContext = null;
  state.eventListenerArguments = null;
  state.lastFocus = null;

  if (focusElement) {
    focusElement.focus();
  }
}

// Keep focus inside the modal
function restrictFocus(modal, focusedElement) {
  if (isAncestor(modal, focusedElement)) {
    state.lastFocus = focusedElement;
  } else {
    resolveFocus(modal);
  }
}

// modal, the element in which to contain focus
// focusElement (optional), the element inside the modal to focus when opening
// backgroundElement (optional), All focus events within this element are redirected to the modal. Defaults to document
function captureModalFocus(modal, focusElement, backgroundElement) {

  // without a modal there is nothing to capture
  if (!modal) {
    return null;
  }

  // If any focus is already being captured, release it now
  releaseModalFocus();

  // focus the modal so the user knows it was opened
  resolveFocus(modal, focusElement);

  // Whenever an element outside of the modal is focused, the modal is focused instead
  function focusCallback(evnt) {
    restrictFocus(modal, evnt.target);
  }

  // The focus event does not bubble
  // however it can be captured on an ancestor element
  // by setting useCapture to true
  var eventListenerContext = backgroundElement || document;
  var eventListenerArguments = ["focus", focusCallback, true];

  // Save the eventListener data in the state object so it can be removed later
  // by the releaseModalFocus function
  state.eventListenerContext = eventListenerContext;
  state.eventListenerArguments = eventListenerArguments;

  eventListenerContext.addEventListener.apply(eventListenerContext, eventListenerArguments);
}

var focusManager = {
  capture: captureModalFocus,
  release: releaseModalFocus,
  focusFirstInElement: focusFirstInElement,
  focusLastInElement: focusLastInElement
};
return focusManager;
}));


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

/**
* Swiper 5.3.1
* Most modern mobile touch slider and framework with hardware accelerated transitions
* http://swiperjs.com
*
* Copyright 2014-2020 Vladimir Kharlampidi
*
* Released under the MIT License
*
* Released on: May 14, 2020
*/

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Swiper=t()}(this,(function(){"use strict";var e="undefined"==typeof document?{body:{},addEventListener:function(){},removeEventListener:function(){},activeElement:{blur:function(){},nodeName:""},querySelector:function(){return null},querySelectorAll:function(){return[]},getElementById:function(){return null},createEvent:function(){return{initEvent:function(){}}},createElement:function(){return{children:[],childNodes:[],style:{},setAttribute:function(){},getElementsByTagName:function(){return[]}}},location:{hash:""}}:document,t="undefined"==typeof window?{document:e,navigator:{userAgent:""},location:{},history:{},CustomEvent:function(){return this},addEventListener:function(){},removeEventListener:function(){},getComputedStyle:function(){return{getPropertyValue:function(){return""}}},Image:function(){},Date:function(){},screen:{},setTimeout:function(){},clearTimeout:function(){}}:window,i=function(e){for(var t=0;t<e.length;t+=1)this[t]=e[t];return this.length=e.length,this};function s(s,a){var n=[],r=0;if(s&&!a&&s instanceof i)return s;if(s)if("string"==typeof s){var l,o,d=s.trim();if(d.indexOf("<")>=0&&d.indexOf(">")>=0){var h="div";for(0===d.indexOf("<li")&&(h="ul"),0===d.indexOf("<tr")&&(h="tbody"),0!==d.indexOf("<td")&&0!==d.indexOf("<th")||(h="tr"),0===d.indexOf("<tbody")&&(h="table"),0===d.indexOf("<option")&&(h="select"),(o=e.createElement(h)).innerHTML=d,r=0;r<o.childNodes.length;r+=1)n.push(o.childNodes[r])}else for(l=a||"#"!==s[0]||s.match(/[ .<>:~]/)?(a||e).querySelectorAll(s.trim()):[e.getElementById(s.trim().split("#")[1])],r=0;r<l.length;r+=1)l[r]&&n.push(l[r])}else if(s.nodeType||s===t||s===e)n.push(s);else if(s.length>0&&s[0].nodeType)for(r=0;r<s.length;r+=1)n.push(s[r]);return new i(n)}function a(e){for(var t=[],i=0;i<e.length;i+=1)-1===t.indexOf(e[i])&&t.push(e[i]);return t}s.fn=i.prototype,s.Class=i,s.Dom7=i;var n={addClass:function(e){if(void 0===e)return this;for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s]&&void 0!==this[s].classList&&this[s].classList.add(t[i]);return this},removeClass:function(e){for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s]&&void 0!==this[s].classList&&this[s].classList.remove(t[i]);return this},hasClass:function(e){return!!this[0]&&this[0].classList.contains(e)},toggleClass:function(e){for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s]&&void 0!==this[s].classList&&this[s].classList.toggle(t[i]);return this},attr:function(e,t){var i=arguments;if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var s=0;s<this.length;s+=1)if(2===i.length)this[s].setAttribute(e,t);else for(var a in e)this[s][a]=e[a],this[s].setAttribute(a,e[a]);return this},removeAttr:function(e){for(var t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},data:function(e,t){var i;if(void 0!==t){for(var s=0;s<this.length;s+=1)(i=this[s]).dom7ElementDataStorage||(i.dom7ElementDataStorage={}),i.dom7ElementDataStorage[e]=t;return this}if(i=this[0]){if(i.dom7ElementDataStorage&&e in i.dom7ElementDataStorage)return i.dom7ElementDataStorage[e];var a=i.getAttribute("data-"+e);return a||void 0}},transform:function(e){for(var t=0;t<this.length;t+=1){var i=this[t].style;i.webkitTransform=e,i.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var t=0;t<this.length;t+=1){var i=this[t].style;i.webkitTransitionDuration=e,i.transitionDuration=e}return this},on:function(){for(var e,t=[],i=arguments.length;i--;)t[i]=arguments[i];var a=t[0],n=t[1],r=t[2],l=t[3];function o(e){var t=e.target;if(t){var i=e.target.dom7EventData||[];if(i.indexOf(e)<0&&i.unshift(e),s(t).is(n))r.apply(t,i);else for(var a=s(t).parents(),l=0;l<a.length;l+=1)s(a[l]).is(n)&&r.apply(a[l],i)}}function d(e){var t=e&&e.target&&e.target.dom7EventData||[];t.indexOf(e)<0&&t.unshift(e),r.apply(this,t)}"function"==typeof t[1]&&(a=(e=t)[0],r=e[1],l=e[2],n=void 0),l||(l=!1);for(var h,p=a.split(" "),u=0;u<this.length;u+=1){var c=this[u];if(n)for(h=0;h<p.length;h+=1){var v=p[h];c.dom7LiveListeners||(c.dom7LiveListeners={}),c.dom7LiveListeners[v]||(c.dom7LiveListeners[v]=[]),c.dom7LiveListeners[v].push({listener:r,proxyListener:o}),c.addEventListener(v,o,l)}else for(h=0;h<p.length;h+=1){var f=p[h];c.dom7Listeners||(c.dom7Listeners={}),c.dom7Listeners[f]||(c.dom7Listeners[f]=[]),c.dom7Listeners[f].push({listener:r,proxyListener:d}),c.addEventListener(f,d,l)}}return this},off:function(){for(var e,t=[],i=arguments.length;i--;)t[i]=arguments[i];var s=t[0],a=t[1],n=t[2],r=t[3];"function"==typeof t[1]&&(s=(e=t)[0],n=e[1],r=e[2],a=void 0),r||(r=!1);for(var l=s.split(" "),o=0;o<l.length;o+=1)for(var d=l[o],h=0;h<this.length;h+=1){var p=this[h],u=void 0;if(!a&&p.dom7Listeners?u=p.dom7Listeners[d]:a&&p.dom7LiveListeners&&(u=p.dom7LiveListeners[d]),u&&u.length)for(var c=u.length-1;c>=0;c-=1){var v=u[c];n&&v.listener===n?(p.removeEventListener(d,v.proxyListener,r),u.splice(c,1)):n&&v.listener&&v.listener.dom7proxy&&v.listener.dom7proxy===n?(p.removeEventListener(d,v.proxyListener,r),u.splice(c,1)):n||(p.removeEventListener(d,v.proxyListener,r),u.splice(c,1))}}return this},trigger:function(){for(var i=[],s=arguments.length;s--;)i[s]=arguments[s];for(var a=i[0].split(" "),n=i[1],r=0;r<a.length;r+=1)for(var l=a[r],o=0;o<this.length;o+=1){var d=this[o],h=void 0;try{h=new t.CustomEvent(l,{detail:n,bubbles:!0,cancelable:!0})}catch(t){(h=e.createEvent("Event")).initEvent(l,!0,!0),h.detail=n}d.dom7EventData=i.filter((function(e,t){return t>0})),d.dispatchEvent(h),d.dom7EventData=[],delete d.dom7EventData}return this},transitionEnd:function(e){var t,i=["webkitTransitionEnd","transitionend"],s=this;function a(n){if(n.target===this)for(e.call(this,n),t=0;t<i.length;t+=1)s.off(i[t],a)}if(e)for(t=0;t<i.length;t+=1)s.on(i[t],a);return this},outerWidth:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetWidth+parseFloat(t.getPropertyValue("margin-right"))+parseFloat(t.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetHeight+parseFloat(t.getPropertyValue("margin-top"))+parseFloat(t.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},offset:function(){if(this.length>0){var i=this[0],s=i.getBoundingClientRect(),a=e.body,n=i.clientTop||a.clientTop||0,r=i.clientLeft||a.clientLeft||0,l=i===t?t.scrollY:i.scrollTop,o=i===t?t.scrollX:i.scrollLeft;return{top:s.top+l-n,left:s.left+o-r}}return null},css:function(e,i){var s;if(1===arguments.length){if("string"!=typeof e){for(s=0;s<this.length;s+=1)for(var a in e)this[s].style[a]=e[a];return this}if(this[0])return t.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(s=0;s<this.length;s+=1)this[s].style[e]=i;return this}return this},each:function(e){if(!e)return this;for(var t=0;t<this.length;t+=1)if(!1===e.call(this[t],t,this[t]))return this;return this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:void 0;for(var t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(a){var n,r,l=this[0];if(!l||void 0===a)return!1;if("string"==typeof a){if(l.matches)return l.matches(a);if(l.webkitMatchesSelector)return l.webkitMatchesSelector(a);if(l.msMatchesSelector)return l.msMatchesSelector(a);for(n=s(a),r=0;r<n.length;r+=1)if(n[r]===l)return!0;return!1}if(a===e)return l===e;if(a===t)return l===t;if(a.nodeType||a instanceof i){for(n=a.nodeType?[a]:a,r=0;r<n.length;r+=1)if(n[r]===l)return!0;return!1}return!1},index:function(){var e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(e){if(void 0===e)return this;var t,s=this.length;return new i(e>s-1?[]:e<0?(t=s+e)<0?[]:[this[t]]:[this[e]])},append:function(){for(var t,s=[],a=arguments.length;a--;)s[a]=arguments[a];for(var n=0;n<s.length;n+=1){t=s[n];for(var r=0;r<this.length;r+=1)if("string"==typeof t){var l=e.createElement("div");for(l.innerHTML=t;l.firstChild;)this[r].appendChild(l.firstChild)}else if(t instanceof i)for(var o=0;o<t.length;o+=1)this[r].appendChild(t[o]);else this[r].appendChild(t)}return this},prepend:function(t){var s,a;for(s=0;s<this.length;s+=1)if("string"==typeof t){var n=e.createElement("div");for(n.innerHTML=t,a=n.childNodes.length-1;a>=0;a-=1)this[s].insertBefore(n.childNodes[a],this[s].childNodes[0])}else if(t instanceof i)for(a=0;a<t.length;a+=1)this[s].insertBefore(t[a],this[s].childNodes[0]);else this[s].insertBefore(t,this[s].childNodes[0]);return this},next:function(e){return this.length>0?e?this[0].nextElementSibling&&s(this[0].nextElementSibling).is(e)?new i([this[0].nextElementSibling]):new i([]):this[0].nextElementSibling?new i([this[0].nextElementSibling]):new i([]):new i([])},nextAll:function(e){var t=[],a=this[0];if(!a)return new i([]);for(;a.nextElementSibling;){var n=a.nextElementSibling;e?s(n).is(e)&&t.push(n):t.push(n),a=n}return new i(t)},prev:function(e){if(this.length>0){var t=this[0];return e?t.previousElementSibling&&s(t.previousElementSibling).is(e)?new i([t.previousElementSibling]):new i([]):t.previousElementSibling?new i([t.previousElementSibling]):new i([])}return new i([])},prevAll:function(e){var t=[],a=this[0];if(!a)return new i([]);for(;a.previousElementSibling;){var n=a.previousElementSibling;e?s(n).is(e)&&t.push(n):t.push(n),a=n}return new i(t)},parent:function(e){for(var t=[],i=0;i<this.length;i+=1)null!==this[i].parentNode&&(e?s(this[i].parentNode).is(e)&&t.push(this[i].parentNode):t.push(this[i].parentNode));return s(a(t))},parents:function(e){for(var t=[],i=0;i<this.length;i+=1)for(var n=this[i].parentNode;n;)e?s(n).is(e)&&t.push(n):t.push(n),n=n.parentNode;return s(a(t))},closest:function(e){var t=this;return void 0===e?new i([]):(t.is(e)||(t=t.parents(e).eq(0)),t)},find:function(e){for(var t=[],s=0;s<this.length;s+=1)for(var a=this[s].querySelectorAll(e),n=0;n<a.length;n+=1)t.push(a[n]);return new i(t)},children:function(e){for(var t=[],n=0;n<this.length;n+=1)for(var r=this[n].childNodes,l=0;l<r.length;l+=1)e?1===r[l].nodeType&&s(r[l]).is(e)&&t.push(r[l]):1===r[l].nodeType&&t.push(r[l]);return new i(a(t))},filter:function(e){for(var t=[],s=0;s<this.length;s+=1)e.call(this[s],s,this[s])&&t.push(this[s]);return new i(t)},remove:function(){for(var e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var i,a;for(i=0;i<e.length;i+=1){var n=s(e[i]);for(a=0;a<n.length;a+=1)this[this.length]=n[a],this.length+=1}return this},styles:function(){return this[0]?t.getComputedStyle(this[0],null):{}}};Object.keys(n).forEach((function(e){s.fn[e]=s.fn[e]||n[e]}));var r={deleteProps:function(e){var t=e;Object.keys(t).forEach((function(e){try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}}))},nextTick:function(e,t){return void 0===t&&(t=0),setTimeout(e,t)},now:function(){return Date.now()},getTranslate:function(e,i){var s,a,n;void 0===i&&(i="x");var r=t.getComputedStyle(e,null);return t.WebKitCSSMatrix?((a=r.transform||r.webkitTransform).split(",").length>6&&(a=a.split(", ").map((function(e){return e.replace(",",".")})).join(", ")),n=new t.WebKitCSSMatrix("none"===a?"":a)):s=(n=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===i&&(a=t.WebKitCSSMatrix?n.m41:16===s.length?parseFloat(s[12]):parseFloat(s[4])),"y"===i&&(a=t.WebKitCSSMatrix?n.m42:16===s.length?parseFloat(s[13]):parseFloat(s[5])),a||0},parseUrlQuery:function(e){var i,s,a,n,r={},l=e||t.location.href;if("string"==typeof l&&l.length)for(n=(s=(l=l.indexOf("?")>-1?l.replace(/\S*\?/,""):"").split("&").filter((function(e){return""!==e}))).length,i=0;i<n;i+=1)a=s[i].replace(/#\S+/g,"").split("="),r[decodeURIComponent(a[0])]=void 0===a[1]?void 0:decodeURIComponent(a[1])||"";return r},isObject:function(e){return"object"==typeof e&&null!==e&&e.constructor&&e.constructor===Object},extend:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=Object(e[0]),s=1;s<e.length;s+=1){var a=e[s];if(null!=a)for(var n=Object.keys(Object(a)),l=0,o=n.length;l<o;l+=1){var d=n[l],h=Object.getOwnPropertyDescriptor(a,d);void 0!==h&&h.enumerable&&(r.isObject(i[d])&&r.isObject(a[d])?r.extend(i[d],a[d]):!r.isObject(i[d])&&r.isObject(a[d])?(i[d]={},r.extend(i[d],a[d])):i[d]=a[d])}}return i}},l={touch:t.Modernizr&&!0===t.Modernizr.touch||!!(t.navigator.maxTouchPoints>0||"ontouchstart"in t||t.DocumentTouch&&e instanceof t.DocumentTouch),pointerEvents:!!t.PointerEvent&&"maxTouchPoints"in t.navigator&&t.navigator.maxTouchPoints>0,observer:"MutationObserver"in t||"WebkitMutationObserver"in t,passiveListener:function(){var e=!1;try{var i=Object.defineProperty({},"passive",{get:function(){e=!0}});t.addEventListener("testPassiveListener",null,i)}catch(e){}return e}(),gestures:"ongesturestart"in t},o=function(e){void 0===e&&(e={});var t=this;t.params=e,t.eventsListeners={},t.params&&t.params.on&&Object.keys(t.params.on).forEach((function(e){t.on(e,t.params.on[e])}))},d={components:{configurable:!0}};o.prototype.on=function(e,t,i){var s=this;if("function"!=typeof t)return s;var a=i?"unshift":"push";return e.split(" ").forEach((function(e){s.eventsListeners[e]||(s.eventsListeners[e]=[]),s.eventsListeners[e][a](t)})),s},o.prototype.once=function(e,t,i){var s=this;if("function"!=typeof t)return s;function a(){for(var i=[],n=arguments.length;n--;)i[n]=arguments[n];s.off(e,a),a.f7proxy&&delete a.f7proxy,t.apply(s,i)}return a.f7proxy=t,s.on(e,a,i)},o.prototype.off=function(e,t){var i=this;return i.eventsListeners?(e.split(" ").forEach((function(e){void 0===t?i.eventsListeners[e]=[]:i.eventsListeners[e]&&i.eventsListeners[e].length&&i.eventsListeners[e].forEach((function(s,a){(s===t||s.f7proxy&&s.f7proxy===t)&&i.eventsListeners[e].splice(a,1)}))})),i):i},o.prototype.emit=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var i,s,a,n=this;if(!n.eventsListeners)return n;"string"==typeof e[0]||Array.isArray(e[0])?(i=e[0],s=e.slice(1,e.length),a=n):(i=e[0].events,s=e[0].data,a=e[0].context||n);var r=Array.isArray(i)?i:i.split(" ");return r.forEach((function(e){if(n.eventsListeners&&n.eventsListeners[e]){var t=[];n.eventsListeners[e].forEach((function(e){t.push(e)})),t.forEach((function(e){e.apply(a,s)}))}})),n},o.prototype.useModulesParams=function(e){var t=this;t.modules&&Object.keys(t.modules).forEach((function(i){var s=t.modules[i];s.params&&r.extend(e,s.params)}))},o.prototype.useModules=function(e){void 0===e&&(e={});var t=this;t.modules&&Object.keys(t.modules).forEach((function(i){var s=t.modules[i],a=e[i]||{};s.instance&&Object.keys(s.instance).forEach((function(e){var i=s.instance[e];t[e]="function"==typeof i?i.bind(t):i})),s.on&&t.on&&Object.keys(s.on).forEach((function(e){t.on(e,s.on[e])})),s.create&&s.create.bind(t)(a)}))},d.components.set=function(e){this.use&&this.use(e)},o.installModule=function(e){for(var t=[],i=arguments.length-1;i-- >0;)t[i]=arguments[i+1];var s=this;s.prototype.modules||(s.prototype.modules={});var a=e.name||Object.keys(s.prototype.modules).length+"_"+r.now();return s.prototype.modules[a]=e,e.proto&&Object.keys(e.proto).forEach((function(t){s.prototype[t]=e.proto[t]})),e.static&&Object.keys(e.static).forEach((function(t){s[t]=e.static[t]})),e.install&&e.install.apply(s,t),s},o.use=function(e){for(var t=[],i=arguments.length-1;i-- >0;)t[i]=arguments[i+1];var s=this;return Array.isArray(e)?(e.forEach((function(e){return s.installModule(e)})),s):s.installModule.apply(s,[e].concat(t))},Object.defineProperties(o,d);var h={updateSize:function(){var e,t,i=this.$el;e=void 0!==this.params.width?this.params.width:i[0].clientWidth,t=void 0!==this.params.height?this.params.height:i[0].clientHeight,0===e&&this.isHorizontal()||0===t&&this.isVertical()||(e=e-parseInt(i.css("padding-left"),10)-parseInt(i.css("padding-right"),10),t=t-parseInt(i.css("padding-top"),10)-parseInt(i.css("padding-bottom"),10),r.extend(this,{width:e,height:t,size:this.isHorizontal()?e:t}))},updateSlides:function(){var e=this.params,i=this.$wrapperEl,s=this.size,a=this.rtlTranslate,n=this.wrongRTL,l=this.virtual&&e.virtual.enabled,o=l?this.virtual.slides.length:this.slides.length,d=i.children("."+this.params.slideClass),h=l?this.virtual.slides.length:d.length,p=[],u=[],c=[];function v(t){return!e.cssMode||t!==d.length-1}var f=e.slidesOffsetBefore;"function"==typeof f&&(f=e.slidesOffsetBefore.call(this));var m=e.slidesOffsetAfter;"function"==typeof m&&(m=e.slidesOffsetAfter.call(this));var g=this.snapGrid.length,w=this.snapGrid.length,b=e.spaceBetween,T=-f,C=0,x=0;if(void 0!==s){var y,S;"string"==typeof b&&b.indexOf("%")>=0&&(b=parseFloat(b.replace("%",""))/100*s),this.virtualSize=-b,a?d.css({marginLeft:"",marginTop:""}):d.css({marginRight:"",marginBottom:""}),e.slidesPerColumn>1&&(y=Math.floor(h/e.slidesPerColumn)===h/this.params.slidesPerColumn?h:Math.ceil(h/e.slidesPerColumn)*e.slidesPerColumn,"auto"!==e.slidesPerView&&"row"===e.slidesPerColumnFill&&(y=Math.max(y,e.slidesPerView*e.slidesPerColumn)));for(var E,M=e.slidesPerColumn,k=y/M,P=Math.floor(h/e.slidesPerColumn),L=0;L<h;L+=1){S=0;var O=d.eq(L);if(e.slidesPerColumn>1){var z=void 0,I=void 0,B=void 0;if("row"===e.slidesPerColumnFill&&e.slidesPerGroup>1){var A=Math.floor(L/(e.slidesPerGroup*e.slidesPerColumn)),D=L-e.slidesPerColumn*e.slidesPerGroup*A,$=0===A?e.slidesPerGroup:Math.min(Math.ceil((h-A*M*e.slidesPerGroup)/M),e.slidesPerGroup);z=(I=D-(B=Math.floor(D/$))*$+A*e.slidesPerGroup)+B*y/M,O.css({"-webkit-box-ordinal-group":z,"-moz-box-ordinal-group":z,"-ms-flex-order":z,"-webkit-order":z,order:z})}else"column"===e.slidesPerColumnFill?(B=L-(I=Math.floor(L/M))*M,(I>P||I===P&&B===M-1)&&(B+=1)>=M&&(B=0,I+=1)):I=L-(B=Math.floor(L/k))*k;O.css("margin-"+(this.isHorizontal()?"top":"left"),0!==B&&e.spaceBetween&&e.spaceBetween+"px")}if("none"!==O.css("display")){if("auto"===e.slidesPerView){var G=t.getComputedStyle(O[0],null),V=O[0].style.transform,N=O[0].style.webkitTransform;if(V&&(O[0].style.transform="none"),N&&(O[0].style.webkitTransform="none"),e.roundLengths)S=this.isHorizontal()?O.outerWidth(!0):O.outerHeight(!0);else if(this.isHorizontal()){var H=parseFloat(G.getPropertyValue("width")),F=parseFloat(G.getPropertyValue("padding-left")),R=parseFloat(G.getPropertyValue("padding-right")),j=parseFloat(G.getPropertyValue("margin-left")),W=parseFloat(G.getPropertyValue("margin-right")),X=G.getPropertyValue("box-sizing");S=X&&"border-box"===X?H+j+W:H+F+R+j+W}else{var Y=parseFloat(G.getPropertyValue("height")),q=parseFloat(G.getPropertyValue("padding-top")),K=parseFloat(G.getPropertyValue("padding-bottom")),U=parseFloat(G.getPropertyValue("margin-top")),_=parseFloat(G.getPropertyValue("margin-bottom")),Q=G.getPropertyValue("box-sizing");S=Q&&"border-box"===Q?Y+U+_:Y+q+K+U+_}V&&(O[0].style.transform=V),N&&(O[0].style.webkitTransform=N),e.roundLengths&&(S=Math.floor(S))}else S=(s-(e.slidesPerView-1)*b)/e.slidesPerView,e.roundLengths&&(S=Math.floor(S)),d[L]&&(this.isHorizontal()?d[L].style.width=S+"px":d[L].style.height=S+"px");d[L]&&(d[L].swiperSlideSize=S),c.push(S),e.centeredSlides?(T=T+S/2+C/2+b,0===C&&0!==L&&(T=T-s/2-b),0===L&&(T=T-s/2-b),Math.abs(T)<.001&&(T=0),e.roundLengths&&(T=Math.floor(T)),x%e.slidesPerGroup==0&&p.push(T),u.push(T)):(e.roundLengths&&(T=Math.floor(T)),(x-Math.min(this.params.slidesPerGroupSkip,x))%this.params.slidesPerGroup==0&&p.push(T),u.push(T),T=T+S+b),this.virtualSize+=S+b,C=S,x+=1}}if(this.virtualSize=Math.max(this.virtualSize,s)+m,a&&n&&("slide"===e.effect||"coverflow"===e.effect)&&i.css({width:this.virtualSize+e.spaceBetween+"px"}),e.setWrapperSize&&(this.isHorizontal()?i.css({width:this.virtualSize+e.spaceBetween+"px"}):i.css({height:this.virtualSize+e.spaceBetween+"px"})),e.slidesPerColumn>1&&(this.virtualSize=(S+e.spaceBetween)*y,this.virtualSize=Math.ceil(this.virtualSize/e.slidesPerColumn)-e.spaceBetween,this.isHorizontal()?i.css({width:this.virtualSize+e.spaceBetween+"px"}):i.css({height:this.virtualSize+e.spaceBetween+"px"}),e.centeredSlides)){E=[];for(var Z=0;Z<p.length;Z+=1){var J=p[Z];e.roundLengths&&(J=Math.floor(J)),p[Z]<this.virtualSize+p[0]&&E.push(J)}p=E}if(!e.centeredSlides){E=[];for(var ee=0;ee<p.length;ee+=1){var te=p[ee];e.roundLengths&&(te=Math.floor(te)),p[ee]<=this.virtualSize-s&&E.push(te)}p=E,Math.floor(this.virtualSize-s)-Math.floor(p[p.length-1])>1&&p.push(this.virtualSize-s)}if(0===p.length&&(p=[0]),0!==e.spaceBetween&&(this.isHorizontal()?a?d.filter(v).css({marginLeft:b+"px"}):d.filter(v).css({marginRight:b+"px"}):d.filter(v).css({marginBottom:b+"px"})),e.centeredSlides&&e.centeredSlidesBounds){var ie=0;c.forEach((function(t){ie+=t+(e.spaceBetween?e.spaceBetween:0)}));var se=(ie-=e.spaceBetween)-s;p=p.map((function(e){return e<0?-f:e>se?se+m:e}))}if(e.centerInsufficientSlides){var ae=0;if(c.forEach((function(t){ae+=t+(e.spaceBetween?e.spaceBetween:0)})),(ae-=e.spaceBetween)<s){var ne=(s-ae)/2;p.forEach((function(e,t){p[t]=e-ne})),u.forEach((function(e,t){u[t]=e+ne}))}}r.extend(this,{slides:d,snapGrid:p,slidesGrid:u,slidesSizesGrid:c}),h!==o&&this.emit("slidesLengthChange"),p.length!==g&&(this.params.watchOverflow&&this.checkOverflow(),this.emit("snapGridLengthChange")),u.length!==w&&this.emit("slidesGridLengthChange"),(e.watchSlidesProgress||e.watchSlidesVisibility)&&this.updateSlidesOffset()}},updateAutoHeight:function(e){var t,i=[],s=0;if("number"==typeof e?this.setTransition(e):!0===e&&this.setTransition(this.params.speed),"auto"!==this.params.slidesPerView&&this.params.slidesPerView>1)for(t=0;t<Math.ceil(this.params.slidesPerView);t+=1){var a=this.activeIndex+t;if(a>this.slides.length)break;i.push(this.slides.eq(a)[0])}else i.push(this.slides.eq(this.activeIndex)[0]);for(t=0;t<i.length;t+=1)if(void 0!==i[t]){var n=i[t].offsetHeight;s=n>s?n:s}s&&this.$wrapperEl.css("height",s+"px")},updateSlidesOffset:function(){for(var e=this.slides,t=0;t<e.length;t+=1)e[t].swiperSlideOffset=this.isHorizontal()?e[t].offsetLeft:e[t].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this&&this.translate||0);var t=this.params,i=this.slides,a=this.rtlTranslate;if(0!==i.length){void 0===i[0].swiperSlideOffset&&this.updateSlidesOffset();var n=-e;a&&(n=e),i.removeClass(t.slideVisibleClass),this.visibleSlidesIndexes=[],this.visibleSlides=[];for(var r=0;r<i.length;r+=1){var l=i[r],o=(n+(t.centeredSlides?this.minTranslate():0)-l.swiperSlideOffset)/(l.swiperSlideSize+t.spaceBetween);if(t.watchSlidesVisibility){var d=-(n-l.swiperSlideOffset),h=d+this.slidesSizesGrid[r];(d>=0&&d<this.size-1||h>1&&h<=this.size||d<=0&&h>=this.size)&&(this.visibleSlides.push(l),this.visibleSlidesIndexes.push(r),i.eq(r).addClass(t.slideVisibleClass))}l.progress=a?-o:o}this.visibleSlides=s(this.visibleSlides)}},updateProgress:function(e){if(void 0===e){var t=this.rtlTranslate?-1:1;e=this&&this.translate&&this.translate*t||0}var i=this.params,s=this.maxTranslate()-this.minTranslate(),a=this.progress,n=this.isBeginning,l=this.isEnd,o=n,d=l;0===s?(a=0,n=!0,l=!0):(n=(a=(e-this.minTranslate())/s)<=0,l=a>=1),r.extend(this,{progress:a,isBeginning:n,isEnd:l}),(i.watchSlidesProgress||i.watchSlidesVisibility)&&this.updateSlidesProgress(e),n&&!o&&this.emit("reachBeginning toEdge"),l&&!d&&this.emit("reachEnd toEdge"),(o&&!n||d&&!l)&&this.emit("fromEdge"),this.emit("progress",a)},updateSlidesClasses:function(){var e,t=this.slides,i=this.params,s=this.$wrapperEl,a=this.activeIndex,n=this.realIndex,r=this.virtual&&i.virtual.enabled;t.removeClass(i.slideActiveClass+" "+i.slideNextClass+" "+i.slidePrevClass+" "+i.slideDuplicateActiveClass+" "+i.slideDuplicateNextClass+" "+i.slideDuplicatePrevClass),(e=r?this.$wrapperEl.find("."+i.slideClass+'[data-swiper-slide-index="'+a+'"]'):t.eq(a)).addClass(i.slideActiveClass),i.loop&&(e.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass));var l=e.nextAll("."+i.slideClass).eq(0).addClass(i.slideNextClass);i.loop&&0===l.length&&(l=t.eq(0)).addClass(i.slideNextClass);var o=e.prevAll("."+i.slideClass).eq(0).addClass(i.slidePrevClass);i.loop&&0===o.length&&(o=t.eq(-1)).addClass(i.slidePrevClass),i.loop&&(l.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass),o.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass))},updateActiveIndex:function(e){var t,i=this.rtlTranslate?this.translate:-this.translate,s=this.slidesGrid,a=this.snapGrid,n=this.params,l=this.activeIndex,o=this.realIndex,d=this.snapIndex,h=e;if(void 0===h){for(var p=0;p<s.length;p+=1)void 0!==s[p+1]?i>=s[p]&&i<s[p+1]-(s[p+1]-s[p])/2?h=p:i>=s[p]&&i<s[p+1]&&(h=p+1):i>=s[p]&&(h=p);n.normalizeSlideIndex&&(h<0||void 0===h)&&(h=0)}if(a.indexOf(i)>=0)t=a.indexOf(i);else{var u=Math.min(n.slidesPerGroupSkip,h);t=u+Math.floor((h-u)/n.slidesPerGroup)}if(t>=a.length&&(t=a.length-1),h!==l){var c=parseInt(this.slides.eq(h).attr("data-swiper-slide-index")||h,10);r.extend(this,{snapIndex:t,realIndex:c,previousIndex:l,activeIndex:h}),this.emit("activeIndexChange"),this.emit("snapIndexChange"),o!==c&&this.emit("realIndexChange"),(this.initialized||this.runCallbacksOnInit)&&this.emit("slideChange")}else t!==d&&(this.snapIndex=t,this.emit("snapIndexChange"))},updateClickedSlide:function(e){var t=this.params,i=s(e.target).closest("."+t.slideClass)[0],a=!1;if(i)for(var n=0;n<this.slides.length;n+=1)this.slides[n]===i&&(a=!0);if(!i||!a)return this.clickedSlide=void 0,void(this.clickedIndex=void 0);this.clickedSlide=i,this.virtual&&this.params.virtual.enabled?this.clickedIndex=parseInt(s(i).attr("data-swiper-slide-index"),10):this.clickedIndex=s(i).index(),t.slideToClickedSlide&&void 0!==this.clickedIndex&&this.clickedIndex!==this.activeIndex&&this.slideToClickedSlide()}};var p={getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");var t=this.params,i=this.rtlTranslate,s=this.translate,a=this.$wrapperEl;if(t.virtualTranslate)return i?-s:s;if(t.cssMode)return s;var n=r.getTranslate(a[0],e);return i&&(n=-n),n||0},setTranslate:function(e,t){var i=this.rtlTranslate,s=this.params,a=this.$wrapperEl,n=this.wrapperEl,r=this.progress,l=0,o=0;this.isHorizontal()?l=i?-e:e:o=e,s.roundLengths&&(l=Math.floor(l),o=Math.floor(o)),s.cssMode?n[this.isHorizontal()?"scrollLeft":"scrollTop"]=this.isHorizontal()?-l:-o:s.virtualTranslate||a.transform("translate3d("+l+"px, "+o+"px, 0px)"),this.previousTranslate=this.translate,this.translate=this.isHorizontal()?l:o;var d=this.maxTranslate()-this.minTranslate();(0===d?0:(e-this.minTranslate())/d)!==r&&this.updateProgress(e),this.emit("setTranslate",this.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e,t,i,s,a){var n;void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0),void 0===s&&(s=!0);var r=this,l=r.params,o=r.wrapperEl;if(r.animating&&l.preventInteractionOnTransition)return!1;var d,h=r.minTranslate(),p=r.maxTranslate();if(d=s&&e>h?h:s&&e<p?p:e,r.updateProgress(d),l.cssMode){var u=r.isHorizontal();return 0===t?o[u?"scrollLeft":"scrollTop"]=-d:o.scrollTo?o.scrollTo(((n={})[u?"left":"top"]=-d,n.behavior="smooth",n)):o[u?"scrollLeft":"scrollTop"]=-d,!0}return 0===t?(r.setTransition(0),r.setTranslate(d),i&&(r.emit("beforeTransitionStart",t,a),r.emit("transitionEnd"))):(r.setTransition(t),r.setTranslate(d),i&&(r.emit("beforeTransitionStart",t,a),r.emit("transitionStart")),r.animating||(r.animating=!0,r.onTranslateToWrapperTransitionEnd||(r.onTranslateToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.$wrapperEl[0].removeEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].removeEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd),r.onTranslateToWrapperTransitionEnd=null,delete r.onTranslateToWrapperTransitionEnd,i&&r.emit("transitionEnd"))}),r.$wrapperEl[0].addEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].addEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd))),!0}};var u={setTransition:function(e,t){this.params.cssMode||this.$wrapperEl.transition(e),this.emit("setTransition",e,t)},transitionStart:function(e,t){void 0===e&&(e=!0);var i=this.activeIndex,s=this.params,a=this.previousIndex;if(!s.cssMode){s.autoHeight&&this.updateAutoHeight();var n=t;if(n||(n=i>a?"next":i<a?"prev":"reset"),this.emit("transitionStart"),e&&i!==a){if("reset"===n)return void this.emit("slideResetTransitionStart");this.emit("slideChangeTransitionStart"),"next"===n?this.emit("slideNextTransitionStart"):this.emit("slidePrevTransitionStart")}}},transitionEnd:function(e,t){void 0===e&&(e=!0);var i=this.activeIndex,s=this.previousIndex,a=this.params;if(this.animating=!1,!a.cssMode){this.setTransition(0);var n=t;if(n||(n=i>s?"next":i<s?"prev":"reset"),this.emit("transitionEnd"),e&&i!==s){if("reset"===n)return void this.emit("slideResetTransitionEnd");this.emit("slideChangeTransitionEnd"),"next"===n?this.emit("slideNextTransitionEnd"):this.emit("slidePrevTransitionEnd")}}}};var c={slideTo:function(e,t,i,s){var a;void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0);var n=this,r=e;r<0&&(r=0);var l=n.params,o=n.snapGrid,d=n.slidesGrid,h=n.previousIndex,p=n.activeIndex,u=n.rtlTranslate,c=n.wrapperEl;if(n.animating&&l.preventInteractionOnTransition)return!1;var v=Math.min(n.params.slidesPerGroupSkip,r),f=v+Math.floor((r-v)/n.params.slidesPerGroup);f>=o.length&&(f=o.length-1),(p||l.initialSlide||0)===(h||0)&&i&&n.emit("beforeSlideChangeStart");var m,g=-o[f];if(n.updateProgress(g),l.normalizeSlideIndex)for(var w=0;w<d.length;w+=1)-Math.floor(100*g)>=Math.floor(100*d[w])&&(r=w);if(n.initialized&&r!==p){if(!n.allowSlideNext&&g<n.translate&&g<n.minTranslate())return!1;if(!n.allowSlidePrev&&g>n.translate&&g>n.maxTranslate()&&(p||0)!==r)return!1}if(m=r>p?"next":r<p?"prev":"reset",u&&-g===n.translate||!u&&g===n.translate)return n.updateActiveIndex(r),l.autoHeight&&n.updateAutoHeight(),n.updateSlidesClasses(),"slide"!==l.effect&&n.setTranslate(g),"reset"!==m&&(n.transitionStart(i,m),n.transitionEnd(i,m)),!1;if(l.cssMode){var b=n.isHorizontal();return 0===t?c[b?"scrollLeft":"scrollTop"]=-g:c.scrollTo?c.scrollTo(((a={})[b?"left":"top"]=-g,a.behavior="smooth",a)):c[b?"scrollLeft":"scrollTop"]=-g,!0}return 0===t?(n.setTransition(0),n.setTranslate(g),n.updateActiveIndex(r),n.updateSlidesClasses(),n.emit("beforeTransitionStart",t,s),n.transitionStart(i,m),n.transitionEnd(i,m)):(n.setTransition(t),n.setTranslate(g),n.updateActiveIndex(r),n.updateSlidesClasses(),n.emit("beforeTransitionStart",t,s),n.transitionStart(i,m),n.animating||(n.animating=!0,n.onSlideToWrapperTransitionEnd||(n.onSlideToWrapperTransitionEnd=function(e){n&&!n.destroyed&&e.target===this&&(n.$wrapperEl[0].removeEventListener("transitionend",n.onSlideToWrapperTransitionEnd),n.$wrapperEl[0].removeEventListener("webkitTransitionEnd",n.onSlideToWrapperTransitionEnd),n.onSlideToWrapperTransitionEnd=null,delete n.onSlideToWrapperTransitionEnd,n.transitionEnd(i,m))}),n.$wrapperEl[0].addEventListener("transitionend",n.onSlideToWrapperTransitionEnd),n.$wrapperEl[0].addEventListener("webkitTransitionEnd",n.onSlideToWrapperTransitionEnd))),!0},slideToLoop:function(e,t,i,s){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0);var a=e;return this.params.loop&&(a+=this.loopedSlides),this.slideTo(a,t,i,s)},slideNext:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating,n=this.activeIndex<s.slidesPerGroupSkip?1:s.slidesPerGroup;if(s.loop){if(a)return!1;this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft}return this.slideTo(this.activeIndex+n,e,t,i)},slidePrev:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating,n=this.snapGrid,r=this.slidesGrid,l=this.rtlTranslate;if(s.loop){if(a)return!1;this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft}function o(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}var d,h=o(l?this.translate:-this.translate),p=n.map((function(e){return o(e)})),u=(r.map((function(e){return o(e)})),n[p.indexOf(h)],n[p.indexOf(h)-1]);return void 0===u&&s.cssMode&&n.forEach((function(e){!u&&h>=e&&(u=e)})),void 0!==u&&(d=r.indexOf(u))<0&&(d=this.activeIndex-1),this.slideTo(d,e,t,i)},slideReset:function(e,t,i){return void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),this.slideTo(this.activeIndex,e,t,i)},slideToClosest:function(e,t,i,s){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),void 0===s&&(s=.5);var a=this.activeIndex,n=Math.min(this.params.slidesPerGroupSkip,a),r=n+Math.floor((a-n)/this.params.slidesPerGroup),l=this.rtlTranslate?this.translate:-this.translate;if(l>=this.snapGrid[r]){var o=this.snapGrid[r];l-o>(this.snapGrid[r+1]-o)*s&&(a+=this.params.slidesPerGroup)}else{var d=this.snapGrid[r-1];l-d<=(this.snapGrid[r]-d)*s&&(a-=this.params.slidesPerGroup)}return a=Math.max(a,0),a=Math.min(a,this.slidesGrid.length-1),this.slideTo(a,e,t,i)},slideToClickedSlide:function(){var e,t=this,i=t.params,a=t.$wrapperEl,n="auto"===i.slidesPerView?t.slidesPerViewDynamic():i.slidesPerView,l=t.clickedIndex;if(i.loop){if(t.animating)return;e=parseInt(s(t.clickedSlide).attr("data-swiper-slide-index"),10),i.centeredSlides?l<t.loopedSlides-n/2||l>t.slides.length-t.loopedSlides+n/2?(t.loopFix(),l=a.children("."+i.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+i.slideDuplicateClass+")").eq(0).index(),r.nextTick((function(){t.slideTo(l)}))):t.slideTo(l):l>t.slides.length-n?(t.loopFix(),l=a.children("."+i.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+i.slideDuplicateClass+")").eq(0).index(),r.nextTick((function(){t.slideTo(l)}))):t.slideTo(l)}else t.slideTo(l)}};var v={loopCreate:function(){var t=this,i=t.params,a=t.$wrapperEl;a.children("."+i.slideClass+"."+i.slideDuplicateClass).remove();var n=a.children("."+i.slideClass);if(i.loopFillGroupWithBlank){var r=i.slidesPerGroup-n.length%i.slidesPerGroup;if(r!==i.slidesPerGroup){for(var l=0;l<r;l+=1){var o=s(e.createElement("div")).addClass(i.slideClass+" "+i.slideBlankClass);a.append(o)}n=a.children("."+i.slideClass)}}"auto"!==i.slidesPerView||i.loopedSlides||(i.loopedSlides=n.length),t.loopedSlides=Math.ceil(parseFloat(i.loopedSlides||i.slidesPerView,10)),t.loopedSlides+=i.loopAdditionalSlides,t.loopedSlides>n.length&&(t.loopedSlides=n.length);var d=[],h=[];n.each((function(e,i){var a=s(i);e<t.loopedSlides&&h.push(i),e<n.length&&e>=n.length-t.loopedSlides&&d.push(i),a.attr("data-swiper-slide-index",e)}));for(var p=0;p<h.length;p+=1)a.append(s(h[p].cloneNode(!0)).addClass(i.slideDuplicateClass));for(var u=d.length-1;u>=0;u-=1)a.prepend(s(d[u].cloneNode(!0)).addClass(i.slideDuplicateClass))},loopFix:function(){this.emit("beforeLoopFix");var e,t=this.activeIndex,i=this.slides,s=this.loopedSlides,a=this.allowSlidePrev,n=this.allowSlideNext,r=this.snapGrid,l=this.rtlTranslate;this.allowSlidePrev=!0,this.allowSlideNext=!0;var o=-r[t]-this.getTranslate();if(t<s)e=i.length-3*s+t,e+=s,this.slideTo(e,0,!1,!0)&&0!==o&&this.setTranslate((l?-this.translate:this.translate)-o);else if(t>=i.length-s){e=-i.length+t+s,e+=s,this.slideTo(e,0,!1,!0)&&0!==o&&this.setTranslate((l?-this.translate:this.translate)-o)}this.allowSlidePrev=a,this.allowSlideNext=n,this.emit("loopFix")},loopDestroy:function(){var e=this.$wrapperEl,t=this.params,i=this.slides;e.children("."+t.slideClass+"."+t.slideDuplicateClass+",."+t.slideClass+"."+t.slideBlankClass).remove(),i.removeAttr("data-swiper-slide-index")}};var f={setGrabCursor:function(e){if(!(l.touch||!this.params.simulateTouch||this.params.watchOverflow&&this.isLocked||this.params.cssMode)){var t=this.el;t.style.cursor="move",t.style.cursor=e?"-webkit-grabbing":"-webkit-grab",t.style.cursor=e?"-moz-grabbin":"-moz-grab",t.style.cursor=e?"grabbing":"grab"}},unsetGrabCursor:function(){l.touch||this.params.watchOverflow&&this.isLocked||this.params.cssMode||(this.el.style.cursor="")}};var m,g,w,b,T,C,x,y,S,E,M,k,P,L,O,z={appendSlide:function(e){var t=this.$wrapperEl,i=this.params;if(i.loop&&this.loopDestroy(),"object"==typeof e&&"length"in e)for(var s=0;s<e.length;s+=1)e[s]&&t.append(e[s]);else t.append(e);i.loop&&this.loopCreate(),i.observer&&l.observer||this.update()},prependSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&this.loopDestroy();var a=s+1;if("object"==typeof e&&"length"in e){for(var n=0;n<e.length;n+=1)e[n]&&i.prepend(e[n]);a=s+e.length}else i.prepend(e);t.loop&&this.loopCreate(),t.observer&&l.observer||this.update(),this.slideTo(a,0,!1)},addSlide:function(e,t){var i=this.$wrapperEl,s=this.params,a=this.activeIndex;s.loop&&(a-=this.loopedSlides,this.loopDestroy(),this.slides=i.children("."+s.slideClass));var n=this.slides.length;if(e<=0)this.prependSlide(t);else if(e>=n)this.appendSlide(t);else{for(var r=a>e?a+1:a,o=[],d=n-1;d>=e;d-=1){var h=this.slides.eq(d);h.remove(),o.unshift(h)}if("object"==typeof t&&"length"in t){for(var p=0;p<t.length;p+=1)t[p]&&i.append(t[p]);r=a>e?a+t.length:a}else i.append(t);for(var u=0;u<o.length;u+=1)i.append(o[u]);s.loop&&this.loopCreate(),s.observer&&l.observer||this.update(),s.loop?this.slideTo(r+this.loopedSlides,0,!1):this.slideTo(r,0,!1)}},removeSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&(s-=this.loopedSlides,this.loopDestroy(),this.slides=i.children("."+t.slideClass));var a,n=s;if("object"==typeof e&&"length"in e){for(var r=0;r<e.length;r+=1)a=e[r],this.slides[a]&&this.slides.eq(a).remove(),a<n&&(n-=1);n=Math.max(n,0)}else a=e,this.slides[a]&&this.slides.eq(a).remove(),a<n&&(n-=1),n=Math.max(n,0);t.loop&&this.loopCreate(),t.observer&&l.observer||this.update(),t.loop?this.slideTo(n+this.loopedSlides,0,!1):this.slideTo(n,0,!1)},removeAllSlides:function(){for(var e=[],t=0;t<this.slides.length;t+=1)e.push(t);this.removeSlide(e)}},I=(m=t.navigator.platform,g=t.navigator.userAgent,w={ios:!1,android:!1,androidChrome:!1,desktop:!1,iphone:!1,ipod:!1,ipad:!1,edge:!1,ie:!1,firefox:!1,macos:!1,windows:!1,cordova:!(!t.cordova&&!t.phonegap),phonegap:!(!t.cordova&&!t.phonegap),electron:!1},b=t.screen.width,T=t.screen.height,C=g.match(/(Android);?[\s\/]+([\d.]+)?/),x=g.match(/(iPad).*OS\s([\d_]+)/),y=g.match(/(iPod)(.*OS\s([\d_]+))?/),S=!x&&g.match(/(iPhone\sOS|iOS)\s([\d_]+)/),E=g.indexOf("MSIE ")>=0||g.indexOf("Trident/")>=0,M=g.indexOf("Edge/")>=0,k=g.indexOf("Gecko/")>=0&&g.indexOf("Firefox/")>=0,P="Win32"===m,L=g.toLowerCase().indexOf("electron")>=0,O="MacIntel"===m,!x&&O&&l.touch&&(1024===b&&1366===T||834===b&&1194===T||834===b&&1112===T||768===b&&1024===T)&&(x=g.match(/(Version)\/([\d.]+)/),O=!1),w.ie=E,w.edge=M,w.firefox=k,C&&!P&&(w.os="android",w.osVersion=C[2],w.android=!0,w.androidChrome=g.toLowerCase().indexOf("chrome")>=0),(x||S||y)&&(w.os="ios",w.ios=!0),S&&!y&&(w.osVersion=S[2].replace(/_/g,"."),w.iphone=!0),x&&(w.osVersion=x[2].replace(/_/g,"."),w.ipad=!0),y&&(w.osVersion=y[3]?y[3].replace(/_/g,"."):null,w.ipod=!0),w.ios&&w.osVersion&&g.indexOf("Version/")>=0&&"10"===w.osVersion.split(".")[0]&&(w.osVersion=g.toLowerCase().split("version/")[1].split(" ")[0]),w.webView=!(!(S||x||y)||!g.match(/.*AppleWebKit(?!.*Safari)/i)&&!t.navigator.standalone)||t.matchMedia&&t.matchMedia("(display-mode: standalone)").matches,w.webview=w.webView,w.standalone=w.webView,w.desktop=!(w.ios||w.android)||L,w.desktop&&(w.electron=L,w.macos=O,w.windows=P,w.macos&&(w.os="macos"),w.windows&&(w.os="windows")),w.pixelRatio=t.devicePixelRatio||1,w);function B(i){var a=this.touchEventsData,n=this.params,l=this.touches;if(!this.animating||!n.preventInteractionOnTransition){var o=i;o.originalEvent&&(o=o.originalEvent);var d=s(o.target);if(("wrapper"!==n.touchEventsTarget||d.closest(this.wrapperEl).length)&&(a.isTouchEvent="touchstart"===o.type,(a.isTouchEvent||!("which"in o)||3!==o.which)&&!(!a.isTouchEvent&&"button"in o&&o.button>0||a.isTouched&&a.isMoved)))if(n.noSwiping&&d.closest(n.noSwipingSelector?n.noSwipingSelector:"."+n.noSwipingClass)[0])this.allowClick=!0;else if(!n.swipeHandler||d.closest(n.swipeHandler)[0]){l.currentX="touchstart"===o.type?o.targetTouches[0].pageX:o.pageX,l.currentY="touchstart"===o.type?o.targetTouches[0].pageY:o.pageY;var h=l.currentX,p=l.currentY,u=n.edgeSwipeDetection||n.iOSEdgeSwipeDetection,c=n.edgeSwipeThreshold||n.iOSEdgeSwipeThreshold;if(!u||!(h<=c||h>=t.screen.width-c)){if(r.extend(a,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),l.startX=h,l.startY=p,a.touchStartTime=r.now(),this.allowClick=!0,this.updateSize(),this.swipeDirection=void 0,n.threshold>0&&(a.allowThresholdMove=!1),"touchstart"!==o.type){var v=!0;d.is(a.formElements)&&(v=!1),e.activeElement&&s(e.activeElement).is(a.formElements)&&e.activeElement!==d[0]&&e.activeElement.blur();var f=v&&this.allowTouchMove&&n.touchStartPreventDefault;(n.touchStartForcePreventDefault||f)&&o.preventDefault()}this.emit("touchStart",o)}}}}function A(t){var i=this.touchEventsData,a=this.params,n=this.touches,l=this.rtlTranslate,o=t;if(o.originalEvent&&(o=o.originalEvent),i.isTouched){if(!i.isTouchEvent||"mousemove"!==o.type){var d="touchmove"===o.type&&o.targetTouches&&(o.targetTouches[0]||o.changedTouches[0]),h="touchmove"===o.type?d.pageX:o.pageX,p="touchmove"===o.type?d.pageY:o.pageY;if(o.preventedByNestedSwiper)return n.startX=h,void(n.startY=p);if(!this.allowTouchMove)return this.allowClick=!1,void(i.isTouched&&(r.extend(n,{startX:h,startY:p,currentX:h,currentY:p}),i.touchStartTime=r.now()));if(i.isTouchEvent&&a.touchReleaseOnEdges&&!a.loop)if(this.isVertical()){if(p<n.startY&&this.translate<=this.maxTranslate()||p>n.startY&&this.translate>=this.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else if(h<n.startX&&this.translate<=this.maxTranslate()||h>n.startX&&this.translate>=this.minTranslate())return;if(i.isTouchEvent&&e.activeElement&&o.target===e.activeElement&&s(o.target).is(i.formElements))return i.isMoved=!0,void(this.allowClick=!1);if(i.allowTouchCallbacks&&this.emit("touchMove",o),!(o.targetTouches&&o.targetTouches.length>1)){n.currentX=h,n.currentY=p;var u=n.currentX-n.startX,c=n.currentY-n.startY;if(!(this.params.threshold&&Math.sqrt(Math.pow(u,2)+Math.pow(c,2))<this.params.threshold)){var v;if(void 0===i.isScrolling)this.isHorizontal()&&n.currentY===n.startY||this.isVertical()&&n.currentX===n.startX?i.isScrolling=!1:u*u+c*c>=25&&(v=180*Math.atan2(Math.abs(c),Math.abs(u))/Math.PI,i.isScrolling=this.isHorizontal()?v>a.touchAngle:90-v>a.touchAngle);if(i.isScrolling&&this.emit("touchMoveOpposite",o),void 0===i.startMoving&&(n.currentX===n.startX&&n.currentY===n.startY||(i.startMoving=!0)),i.isScrolling)i.isTouched=!1;else if(i.startMoving){this.allowClick=!1,a.cssMode||o.preventDefault(),a.touchMoveStopPropagation&&!a.nested&&o.stopPropagation(),i.isMoved||(a.loop&&this.loopFix(),i.startTranslate=this.getTranslate(),this.setTransition(0),this.animating&&this.$wrapperEl.trigger("webkitTransitionEnd transitionend"),i.allowMomentumBounce=!1,!a.grabCursor||!0!==this.allowSlideNext&&!0!==this.allowSlidePrev||this.setGrabCursor(!0),this.emit("sliderFirstMove",o)),this.emit("sliderMove",o),i.isMoved=!0;var f=this.isHorizontal()?u:c;n.diff=f,f*=a.touchRatio,l&&(f=-f),this.swipeDirection=f>0?"prev":"next",i.currentTranslate=f+i.startTranslate;var m=!0,g=a.resistanceRatio;if(a.touchReleaseOnEdges&&(g=0),f>0&&i.currentTranslate>this.minTranslate()?(m=!1,a.resistance&&(i.currentTranslate=this.minTranslate()-1+Math.pow(-this.minTranslate()+i.startTranslate+f,g))):f<0&&i.currentTranslate<this.maxTranslate()&&(m=!1,a.resistance&&(i.currentTranslate=this.maxTranslate()+1-Math.pow(this.maxTranslate()-i.startTranslate-f,g))),m&&(o.preventedByNestedSwiper=!0),!this.allowSlideNext&&"next"===this.swipeDirection&&i.currentTranslate<i.startTranslate&&(i.currentTranslate=i.startTranslate),!this.allowSlidePrev&&"prev"===this.swipeDirection&&i.currentTranslate>i.startTranslate&&(i.currentTranslate=i.startTranslate),a.threshold>0){if(!(Math.abs(f)>a.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,n.startX=n.currentX,n.startY=n.currentY,i.currentTranslate=i.startTranslate,void(n.diff=this.isHorizontal()?n.currentX-n.startX:n.currentY-n.startY)}a.followFinger&&!a.cssMode&&((a.freeMode||a.watchSlidesProgress||a.watchSlidesVisibility)&&(this.updateActiveIndex(),this.updateSlidesClasses()),a.freeMode&&(0===i.velocities.length&&i.velocities.push({position:n[this.isHorizontal()?"startX":"startY"],time:i.touchStartTime}),i.velocities.push({position:n[this.isHorizontal()?"currentX":"currentY"],time:r.now()})),this.updateProgress(i.currentTranslate),this.setTranslate(i.currentTranslate))}}}}}else i.startMoving&&i.isScrolling&&this.emit("touchMoveOpposite",o)}function D(e){var t=this,i=t.touchEventsData,s=t.params,a=t.touches,n=t.rtlTranslate,l=t.$wrapperEl,o=t.slidesGrid,d=t.snapGrid,h=e;if(h.originalEvent&&(h=h.originalEvent),i.allowTouchCallbacks&&t.emit("touchEnd",h),i.allowTouchCallbacks=!1,!i.isTouched)return i.isMoved&&s.grabCursor&&t.setGrabCursor(!1),i.isMoved=!1,void(i.startMoving=!1);s.grabCursor&&i.isMoved&&i.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);var p,u=r.now(),c=u-i.touchStartTime;if(t.allowClick&&(t.updateClickedSlide(h),t.emit("tap click",h),c<300&&u-i.lastClickTime<300&&t.emit("doubleTap doubleClick",h)),i.lastClickTime=r.now(),r.nextTick((function(){t.destroyed||(t.allowClick=!0)})),!i.isTouched||!i.isMoved||!t.swipeDirection||0===a.diff||i.currentTranslate===i.startTranslate)return i.isTouched=!1,i.isMoved=!1,void(i.startMoving=!1);if(i.isTouched=!1,i.isMoved=!1,i.startMoving=!1,p=s.followFinger?n?t.translate:-t.translate:-i.currentTranslate,!s.cssMode)if(s.freeMode){if(p<-t.minTranslate())return void t.slideTo(t.activeIndex);if(p>-t.maxTranslate())return void(t.slides.length<d.length?t.slideTo(d.length-1):t.slideTo(t.slides.length-1));if(s.freeModeMomentum){if(i.velocities.length>1){var v=i.velocities.pop(),f=i.velocities.pop(),m=v.position-f.position,g=v.time-f.time;t.velocity=m/g,t.velocity/=2,Math.abs(t.velocity)<s.freeModeMinimumVelocity&&(t.velocity=0),(g>150||r.now()-v.time>300)&&(t.velocity=0)}else t.velocity=0;t.velocity*=s.freeModeMomentumVelocityRatio,i.velocities.length=0;var w=1e3*s.freeModeMomentumRatio,b=t.velocity*w,T=t.translate+b;n&&(T=-T);var C,x,y=!1,S=20*Math.abs(t.velocity)*s.freeModeMomentumBounceRatio;if(T<t.maxTranslate())s.freeModeMomentumBounce?(T+t.maxTranslate()<-S&&(T=t.maxTranslate()-S),C=t.maxTranslate(),y=!0,i.allowMomentumBounce=!0):T=t.maxTranslate(),s.loop&&s.centeredSlides&&(x=!0);else if(T>t.minTranslate())s.freeModeMomentumBounce?(T-t.minTranslate()>S&&(T=t.minTranslate()+S),C=t.minTranslate(),y=!0,i.allowMomentumBounce=!0):T=t.minTranslate(),s.loop&&s.centeredSlides&&(x=!0);else if(s.freeModeSticky){for(var E,M=0;M<d.length;M+=1)if(d[M]>-T){E=M;break}T=-(T=Math.abs(d[E]-T)<Math.abs(d[E-1]-T)||"next"===t.swipeDirection?d[E]:d[E-1])}if(x&&t.once("transitionEnd",(function(){t.loopFix()})),0!==t.velocity){if(w=n?Math.abs((-T-t.translate)/t.velocity):Math.abs((T-t.translate)/t.velocity),s.freeModeSticky){var k=Math.abs((n?-T:T)-t.translate),P=t.slidesSizesGrid[t.activeIndex];w=k<P?s.speed:k<2*P?1.5*s.speed:2.5*s.speed}}else if(s.freeModeSticky)return void t.slideToClosest();s.freeModeMomentumBounce&&y?(t.updateProgress(C),t.setTransition(w),t.setTranslate(T),t.transitionStart(!0,t.swipeDirection),t.animating=!0,l.transitionEnd((function(){t&&!t.destroyed&&i.allowMomentumBounce&&(t.emit("momentumBounce"),t.setTransition(s.speed),t.setTranslate(C),l.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()})))}))):t.velocity?(t.updateProgress(T),t.setTransition(w),t.setTranslate(T),t.transitionStart(!0,t.swipeDirection),t.animating||(t.animating=!0,l.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()})))):t.updateProgress(T),t.updateActiveIndex(),t.updateSlidesClasses()}else if(s.freeModeSticky)return void t.slideToClosest();(!s.freeModeMomentum||c>=s.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}else{for(var L=0,O=t.slidesSizesGrid[0],z=0;z<o.length;z+=z<s.slidesPerGroupSkip?1:s.slidesPerGroup){var I=z<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;void 0!==o[z+I]?p>=o[z]&&p<o[z+I]&&(L=z,O=o[z+I]-o[z]):p>=o[z]&&(L=z,O=o[o.length-1]-o[o.length-2])}var B=(p-o[L])/O,A=L<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;if(c>s.longSwipesMs){if(!s.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(B>=s.longSwipesRatio?t.slideTo(L+A):t.slideTo(L)),"prev"===t.swipeDirection&&(B>1-s.longSwipesRatio?t.slideTo(L+A):t.slideTo(L))}else{if(!s.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(h.target===t.navigation.nextEl||h.target===t.navigation.prevEl)?h.target===t.navigation.nextEl?t.slideTo(L+A):t.slideTo(L):("next"===t.swipeDirection&&t.slideTo(L+A),"prev"===t.swipeDirection&&t.slideTo(L))}}}function $(){var e=this.params,t=this.el;if(!t||0!==t.offsetWidth){e.breakpoints&&this.setBreakpoint();var i=this.allowSlideNext,s=this.allowSlidePrev,a=this.snapGrid;this.allowSlideNext=!0,this.allowSlidePrev=!0,this.updateSize(),this.updateSlides(),this.updateSlidesClasses(),("auto"===e.slidesPerView||e.slidesPerView>1)&&this.isEnd&&!this.params.centeredSlides?this.slideTo(this.slides.length-1,0,!1,!0):this.slideTo(this.activeIndex,0,!1,!0),this.autoplay&&this.autoplay.running&&this.autoplay.paused&&this.autoplay.run(),this.allowSlidePrev=s,this.allowSlideNext=i,this.params.watchOverflow&&a!==this.snapGrid&&this.checkOverflow()}}function G(e){this.allowClick||(this.params.preventClicks&&e.preventDefault(),this.params.preventClicksPropagation&&this.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))}function V(){var e=this.wrapperEl;this.previousTranslate=this.translate,this.translate=this.isHorizontal()?-e.scrollLeft:-e.scrollTop,-0===this.translate&&(this.translate=0),this.updateActiveIndex(),this.updateSlidesClasses();var t=this.maxTranslate()-this.minTranslate();(0===t?0:(this.translate-this.minTranslate())/t)!==this.progress&&this.updateProgress(this.translate),this.emit("setTranslate",this.translate,!1)}var N=!1;function H(){}var F={init:!0,direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,preventInteractionOnTransition:!1,edgeSwipeDetection:!1,edgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,slidesPerGroupSkip:0,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!1,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopFillGroupWithBlank:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0},R={update:h,translate:p,transition:u,slide:c,loop:v,grabCursor:f,manipulation:z,events:{attachEvents:function(){var t=this.params,i=this.touchEvents,s=this.el,a=this.wrapperEl;this.onTouchStart=B.bind(this),this.onTouchMove=A.bind(this),this.onTouchEnd=D.bind(this),t.cssMode&&(this.onScroll=V.bind(this)),this.onClick=G.bind(this);var n=!!t.nested;if(!l.touch&&l.pointerEvents)s.addEventListener(i.start,this.onTouchStart,!1),e.addEventListener(i.move,this.onTouchMove,n),e.addEventListener(i.end,this.onTouchEnd,!1);else{if(l.touch){var r=!("touchstart"!==i.start||!l.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};s.addEventListener(i.start,this.onTouchStart,r),s.addEventListener(i.move,this.onTouchMove,l.passiveListener?{passive:!1,capture:n}:n),s.addEventListener(i.end,this.onTouchEnd,r),i.cancel&&s.addEventListener(i.cancel,this.onTouchEnd,r),N||(e.addEventListener("touchstart",H),N=!0)}(t.simulateTouch&&!I.ios&&!I.android||t.simulateTouch&&!l.touch&&I.ios)&&(s.addEventListener("mousedown",this.onTouchStart,!1),e.addEventListener("mousemove",this.onTouchMove,n),e.addEventListener("mouseup",this.onTouchEnd,!1))}(t.preventClicks||t.preventClicksPropagation)&&s.addEventListener("click",this.onClick,!0),t.cssMode&&a.addEventListener("scroll",this.onScroll),t.updateOnWindowResize?this.on(I.ios||I.android?"resize orientationchange observerUpdate":"resize observerUpdate",$,!0):this.on("observerUpdate",$,!0)},detachEvents:function(){var t=this.params,i=this.touchEvents,s=this.el,a=this.wrapperEl,n=!!t.nested;if(!l.touch&&l.pointerEvents)s.removeEventListener(i.start,this.onTouchStart,!1),e.removeEventListener(i.move,this.onTouchMove,n),e.removeEventListener(i.end,this.onTouchEnd,!1);else{if(l.touch){var r=!("onTouchStart"!==i.start||!l.passiveListener||!t.passiveListeners)&&{passive:!0,capture:!1};s.removeEventListener(i.start,this.onTouchStart,r),s.removeEventListener(i.move,this.onTouchMove,n),s.removeEventListener(i.end,this.onTouchEnd,r),i.cancel&&s.removeEventListener(i.cancel,this.onTouchEnd,r)}(t.simulateTouch&&!I.ios&&!I.android||t.simulateTouch&&!l.touch&&I.ios)&&(s.removeEventListener("mousedown",this.onTouchStart,!1),e.removeEventListener("mousemove",this.onTouchMove,n),e.removeEventListener("mouseup",this.onTouchEnd,!1))}(t.preventClicks||t.preventClicksPropagation)&&s.removeEventListener("click",this.onClick,!0),t.cssMode&&a.removeEventListener("scroll",this.onScroll),this.off(I.ios||I.android?"resize orientationchange observerUpdate":"resize observerUpdate",$)}},breakpoints:{setBreakpoint:function(){var e=this.activeIndex,t=this.initialized,i=this.loopedSlides;void 0===i&&(i=0);var s=this.params,a=this.$el,n=s.breakpoints;if(n&&(!n||0!==Object.keys(n).length)){var l=this.getBreakpoint(n);if(l&&this.currentBreakpoint!==l){var o=l in n?n[l]:void 0;o&&["slidesPerView","spaceBetween","slidesPerGroup","slidesPerGroupSkip","slidesPerColumn"].forEach((function(e){var t=o[e];void 0!==t&&(o[e]="slidesPerView"!==e||"AUTO"!==t&&"auto"!==t?"slidesPerView"===e?parseFloat(t):parseInt(t,10):"auto")}));var d=o||this.originalParams,h=s.slidesPerColumn>1,p=d.slidesPerColumn>1;h&&!p?a.removeClass(s.containerModifierClass+"multirow "+s.containerModifierClass+"multirow-column"):!h&&p&&(a.addClass(s.containerModifierClass+"multirow"),"column"===d.slidesPerColumnFill&&a.addClass(s.containerModifierClass+"multirow-column"));var u=d.direction&&d.direction!==s.direction,c=s.loop&&(d.slidesPerView!==s.slidesPerView||u);u&&t&&this.changeDirection(),r.extend(this.params,d),r.extend(this,{allowTouchMove:this.params.allowTouchMove,allowSlideNext:this.params.allowSlideNext,allowSlidePrev:this.params.allowSlidePrev}),this.currentBreakpoint=l,c&&t&&(this.loopDestroy(),this.loopCreate(),this.updateSlides(),this.slideTo(e-i+this.loopedSlides,0,!1)),this.emit("breakpoint",d)}}},getBreakpoint:function(e){if(e){var i=!1,s=Object.keys(e).map((function(e){if("string"==typeof e&&e.startsWith("@")){var i=parseFloat(e.substr(1));return{value:t.innerHeight*i,point:e}}return{value:e,point:e}}));s.sort((function(e,t){return parseInt(e.value,10)-parseInt(t.value,10)}));for(var a=0;a<s.length;a+=1){var n=s[a],r=n.point;n.value<=t.innerWidth&&(i=r)}return i||"max"}}},checkOverflow:{checkOverflow:function(){var e=this.params,t=this.isLocked,i=this.slides.length>0&&e.slidesOffsetBefore+e.spaceBetween*(this.slides.length-1)+this.slides[0].offsetWidth*this.slides.length;e.slidesOffsetBefore&&e.slidesOffsetAfter&&i?this.isLocked=i<=this.size:this.isLocked=1===this.snapGrid.length,this.allowSlideNext=!this.isLocked,this.allowSlidePrev=!this.isLocked,t!==this.isLocked&&this.emit(this.isLocked?"lock":"unlock"),t&&t!==this.isLocked&&(this.isEnd=!1,this.navigation.update())}},classes:{addClasses:function(){var e=this.classNames,t=this.params,i=this.rtl,s=this.$el,a=[];a.push("initialized"),a.push(t.direction),t.freeMode&&a.push("free-mode"),t.autoHeight&&a.push("autoheight"),i&&a.push("rtl"),t.slidesPerColumn>1&&(a.push("multirow"),"column"===t.slidesPerColumnFill&&a.push("multirow-column")),I.android&&a.push("android"),I.ios&&a.push("ios"),t.cssMode&&a.push("css-mode"),a.forEach((function(i){e.push(t.containerModifierClass+i)})),s.addClass(e.join(" "))},removeClasses:function(){var e=this.$el,t=this.classNames;e.removeClass(t.join(" "))}},images:{loadImage:function(e,i,s,a,n,r){var l;function o(){r&&r()}e.complete&&n?o():i?((l=new t.Image).onload=o,l.onerror=o,a&&(l.sizes=a),s&&(l.srcset=s),i&&(l.src=i)):o()},preloadImages:function(){var e=this;function t(){null!=e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(var i=0;i<e.imagesToLoad.length;i+=1){var s=e.imagesToLoad[i];e.loadImage(s,s.currentSrc||s.getAttribute("src"),s.srcset||s.getAttribute("srcset"),s.sizes||s.getAttribute("sizes"),!0,t)}}}},j={},W=function(e){function t(){for(var i,a,n,o=[],d=arguments.length;d--;)o[d]=arguments[d];1===o.length&&o[0].constructor&&o[0].constructor===Object?n=o[0]:(a=(i=o)[0],n=i[1]),n||(n={}),n=r.extend({},n),a&&!n.el&&(n.el=a),e.call(this,n),Object.keys(R).forEach((function(e){Object.keys(R[e]).forEach((function(i){t.prototype[i]||(t.prototype[i]=R[e][i])}))}));var h=this;void 0===h.modules&&(h.modules={}),Object.keys(h.modules).forEach((function(e){var t=h.modules[e];if(t.params){var i=Object.keys(t.params)[0],s=t.params[i];if("object"!=typeof s||null===s)return;if(!(i in n&&"enabled"in s))return;!0===n[i]&&(n[i]={enabled:!0}),"object"!=typeof n[i]||"enabled"in n[i]||(n[i].enabled=!0),n[i]||(n[i]={enabled:!1})}}));var p=r.extend({},F);h.useModulesParams(p),h.params=r.extend({},p,j,n),h.originalParams=r.extend({},h.params),h.passedParams=r.extend({},n),h.$=s;var u=s(h.params.el);if(a=u[0]){if(u.length>1){var c=[];return u.each((function(e,i){var s=r.extend({},n,{el:i});c.push(new t(s))})),c}var v,f,m;return a.swiper=h,u.data("swiper",h),a&&a.shadowRoot&&a.shadowRoot.querySelector?(v=s(a.shadowRoot.querySelector("."+h.params.wrapperClass))).children=function(e){return u.children(e)}:v=u.children("."+h.params.wrapperClass),r.extend(h,{$el:u,el:a,$wrapperEl:v,wrapperEl:v[0],classNames:[],slides:s(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:function(){return"horizontal"===h.params.direction},isVertical:function(){return"vertical"===h.params.direction},rtl:"rtl"===a.dir.toLowerCase()||"rtl"===u.css("direction"),rtlTranslate:"horizontal"===h.params.direction&&("rtl"===a.dir.toLowerCase()||"rtl"===u.css("direction")),wrongRTL:"-webkit-box"===v.css("display"),activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,allowSlideNext:h.params.allowSlideNext,allowSlidePrev:h.params.allowSlidePrev,touchEvents:(f=["touchstart","touchmove","touchend","touchcancel"],m=["mousedown","mousemove","mouseup"],l.pointerEvents&&(m=["pointerdown","pointermove","pointerup"]),h.touchEventsTouch={start:f[0],move:f[1],end:f[2],cancel:f[3]},h.touchEventsDesktop={start:m[0],move:m[1],end:m[2]},l.touch||!h.params.simulateTouch?h.touchEventsTouch:h.touchEventsDesktop),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,formElements:"input, select, option, textarea, button, video, label",lastClickTime:r.now(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:h.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),h.useModules(),h.params.init&&h.init(),h}}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var i={extendedDefaults:{configurable:!0},defaults:{configurable:!0},Class:{configurable:!0},$:{configurable:!0}};return t.prototype.slidesPerViewDynamic=function(){var e=this.params,t=this.slides,i=this.slidesGrid,s=this.size,a=this.activeIndex,n=1;if(e.centeredSlides){for(var r,l=t[a].swiperSlideSize,o=a+1;o<t.length;o+=1)t[o]&&!r&&(n+=1,(l+=t[o].swiperSlideSize)>s&&(r=!0));for(var d=a-1;d>=0;d-=1)t[d]&&!r&&(n+=1,(l+=t[d].swiperSlideSize)>s&&(r=!0))}else for(var h=a+1;h<t.length;h+=1)i[h]-i[a]<s&&(n+=1);return n},t.prototype.update=function(){var e=this;if(e&&!e.destroyed){var t=e.snapGrid,i=e.params;i.breakpoints&&e.setBreakpoint(),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),e.params.freeMode?(s(),e.params.autoHeight&&e.updateAutoHeight()):(("auto"===e.params.slidesPerView||e.params.slidesPerView>1)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0))||s(),i.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}function s(){var t=e.rtlTranslate?-1*e.translate:e.translate,i=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(i),e.updateActiveIndex(),e.updateSlidesClasses()}},t.prototype.changeDirection=function(e,t){void 0===t&&(t=!0);var i=this.params.direction;return e||(e="horizontal"===i?"vertical":"horizontal"),e===i||"horizontal"!==e&&"vertical"!==e?this:(this.$el.removeClass(""+this.params.containerModifierClass+i).addClass(""+this.params.containerModifierClass+e),this.params.direction=e,this.slides.each((function(t,i){"vertical"===e?i.style.width="":i.style.height=""})),this.emit("changeDirection"),t&&this.update(),this)},t.prototype.init=function(){this.initialized||(this.emit("beforeInit"),this.params.breakpoints&&this.setBreakpoint(),this.addClasses(),this.params.loop&&this.loopCreate(),this.updateSize(),this.updateSlides(),this.params.watchOverflow&&this.checkOverflow(),this.params.grabCursor&&this.setGrabCursor(),this.params.preloadImages&&this.preloadImages(),this.params.loop?this.slideTo(this.params.initialSlide+this.loopedSlides,0,this.params.runCallbacksOnInit):this.slideTo(this.params.initialSlide,0,this.params.runCallbacksOnInit),this.attachEvents(),this.initialized=!0,this.emit("init"))},t.prototype.destroy=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);var i=this,s=i.params,a=i.$el,n=i.$wrapperEl,l=i.slides;return void 0===i.params||i.destroyed?null:(i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),s.loop&&i.loopDestroy(),t&&(i.removeClasses(),a.removeAttr("style"),n.removeAttr("style"),l&&l.length&&l.removeClass([s.slideVisibleClass,s.slideActiveClass,s.slideNextClass,s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),i.emit("destroy"),Object.keys(i.eventsListeners).forEach((function(e){i.off(e)})),!1!==e&&(i.$el[0].swiper=null,i.$el.data("swiper",null),r.deleteProps(i)),i.destroyed=!0,null)},t.extendDefaults=function(e){r.extend(j,e)},i.extendedDefaults.get=function(){return j},i.defaults.get=function(){return F},i.Class.get=function(){return e},i.$.get=function(){return s},Object.defineProperties(t,i),t}(o),X={name:"device",proto:{device:I},static:{device:I}},Y={name:"support",proto:{support:l},static:{support:l}},q={isEdge:!!t.navigator.userAgent.match(/Edge/g),isSafari:function(){var e=t.navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)},K={name:"browser",proto:{browser:q},static:{browser:q}},U={name:"resize",create:function(){var e=this;r.extend(e,{resize:{resizeHandler:function(){e&&!e.destroyed&&e.initialized&&(e.emit("beforeResize"),e.emit("resize"))},orientationChangeHandler:function(){e&&!e.destroyed&&e.initialized&&e.emit("orientationchange")}}})},on:{init:function(){t.addEventListener("resize",this.resize.resizeHandler),t.addEventListener("orientationchange",this.resize.orientationChangeHandler)},destroy:function(){t.removeEventListener("resize",this.resize.resizeHandler),t.removeEventListener("orientationchange",this.resize.orientationChangeHandler)}}},_={func:t.MutationObserver||t.WebkitMutationObserver,attach:function(e,i){void 0===i&&(i={});var s=this,a=new(0,_.func)((function(e){if(1!==e.length){var i=function(){s.emit("observerUpdate",e[0])};t.requestAnimationFrame?t.requestAnimationFrame(i):t.setTimeout(i,0)}else s.emit("observerUpdate",e[0])}));a.observe(e,{attributes:void 0===i.attributes||i.attributes,childList:void 0===i.childList||i.childList,characterData:void 0===i.characterData||i.characterData}),s.observer.observers.push(a)},init:function(){if(l.observer&&this.params.observer){if(this.params.observeParents)for(var e=this.$el.parents(),t=0;t<e.length;t+=1)this.observer.attach(e[t]);this.observer.attach(this.$el[0],{childList:this.params.observeSlideChildren}),this.observer.attach(this.$wrapperEl[0],{attributes:!1})}},destroy:function(){this.observer.observers.forEach((function(e){e.disconnect()})),this.observer.observers=[]}},Q={name:"observer",params:{observer:!1,observeParents:!1,observeSlideChildren:!1},create:function(){r.extend(this,{observer:{init:_.init.bind(this),attach:_.attach.bind(this),destroy:_.destroy.bind(this),observers:[]}})},on:{init:function(){this.observer.init()},destroy:function(){this.observer.destroy()}}},Z={update:function(e){var t=this,i=t.params,s=i.slidesPerView,a=i.slidesPerGroup,n=i.centeredSlides,l=t.params.virtual,o=l.addSlidesBefore,d=l.addSlidesAfter,h=t.virtual,p=h.from,u=h.to,c=h.slides,v=h.slidesGrid,f=h.renderSlide,m=h.offset;t.updateActiveIndex();var g,w,b,T=t.activeIndex||0;g=t.rtlTranslate?"right":t.isHorizontal()?"left":"top",n?(w=Math.floor(s/2)+a+o,b=Math.floor(s/2)+a+d):(w=s+(a-1)+o,b=a+d);var C=Math.max((T||0)-b,0),x=Math.min((T||0)+w,c.length-1),y=(t.slidesGrid[C]||0)-(t.slidesGrid[0]||0);function S(){t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),t.lazy&&t.params.lazy.enabled&&t.lazy.load()}if(r.extend(t.virtual,{from:C,to:x,offset:y,slidesGrid:t.slidesGrid}),p===C&&u===x&&!e)return t.slidesGrid!==v&&y!==m&&t.slides.css(g,y+"px"),void t.updateProgress();if(t.params.virtual.renderExternal)return t.params.virtual.renderExternal.call(t,{offset:y,from:C,to:x,slides:function(){for(var e=[],t=C;t<=x;t+=1)e.push(c[t]);return e}()}),void S();var E=[],M=[];if(e)t.$wrapperEl.find("."+t.params.slideClass).remove();else for(var k=p;k<=u;k+=1)(k<C||k>x)&&t.$wrapperEl.find("."+t.params.slideClass+'[data-swiper-slide-index="'+k+'"]').remove();for(var P=0;P<c.length;P+=1)P>=C&&P<=x&&(void 0===u||e?M.push(P):(P>u&&M.push(P),P<p&&E.push(P)));M.forEach((function(e){t.$wrapperEl.append(f(c[e],e))})),E.sort((function(e,t){return t-e})).forEach((function(e){t.$wrapperEl.prepend(f(c[e],e))})),t.$wrapperEl.children(".swiper-slide").css(g,y+"px"),S()},renderSlide:function(e,t){var i=this.params.virtual;if(i.cache&&this.virtual.cache[t])return this.virtual.cache[t];var a=i.renderSlide?s(i.renderSlide.call(this,e,t)):s('<div class="'+this.params.slideClass+'" data-swiper-slide-index="'+t+'">'+e+"</div>");return a.attr("data-swiper-slide-index")||a.attr("data-swiper-slide-index",t),i.cache&&(this.virtual.cache[t]=a),a},appendSlide:function(e){if("object"==typeof e&&"length"in e)for(var t=0;t<e.length;t+=1)e[t]&&this.virtual.slides.push(e[t]);else this.virtual.slides.push(e);this.virtual.update(!0)},prependSlide:function(e){var t=this.activeIndex,i=t+1,s=1;if(Array.isArray(e)){for(var a=0;a<e.length;a+=1)e[a]&&this.virtual.slides.unshift(e[a]);i=t+e.length,s=e.length}else this.virtual.slides.unshift(e);if(this.params.virtual.cache){var n=this.virtual.cache,r={};Object.keys(n).forEach((function(e){var t=n[e],i=t.attr("data-swiper-slide-index");i&&t.attr("data-swiper-slide-index",parseInt(i,10)+1),r[parseInt(e,10)+s]=t})),this.virtual.cache=r}this.virtual.update(!0),this.slideTo(i,0)},removeSlide:function(e){if(null!=e){var t=this.activeIndex;if(Array.isArray(e))for(var i=e.length-1;i>=0;i-=1)this.virtual.slides.splice(e[i],1),this.params.virtual.cache&&delete this.virtual.cache[e[i]],e[i]<t&&(t-=1),t=Math.max(t,0);else this.virtual.slides.splice(e,1),this.params.virtual.cache&&delete this.virtual.cache[e],e<t&&(t-=1),t=Math.max(t,0);this.virtual.update(!0),this.slideTo(t,0)}},removeAllSlides:function(){this.virtual.slides=[],this.params.virtual.cache&&(this.virtual.cache={}),this.virtual.update(!0),this.slideTo(0,0)}},J={name:"virtual",params:{virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null,addSlidesBefore:0,addSlidesAfter:0}},create:function(){r.extend(this,{virtual:{update:Z.update.bind(this),appendSlide:Z.appendSlide.bind(this),prependSlide:Z.prependSlide.bind(this),removeSlide:Z.removeSlide.bind(this),removeAllSlides:Z.removeAllSlides.bind(this),renderSlide:Z.renderSlide.bind(this),slides:this.params.virtual.slides,cache:{}}})},on:{beforeInit:function(){if(this.params.virtual.enabled){this.classNames.push(this.params.containerModifierClass+"virtual");var e={watchSlidesProgress:!0};r.extend(this.params,e),r.extend(this.originalParams,e),this.params.initialSlide||this.virtual.update()}},setTranslate:function(){this.params.virtual.enabled&&this.virtual.update()}}},ee={handle:function(i){var s=this.rtlTranslate,a=i;a.originalEvent&&(a=a.originalEvent);var n=a.keyCode||a.charCode;if(!this.allowSlideNext&&(this.isHorizontal()&&39===n||this.isVertical()&&40===n||34===n))return!1;if(!this.allowSlidePrev&&(this.isHorizontal()&&37===n||this.isVertical()&&38===n||33===n))return!1;if(!(a.shiftKey||a.altKey||a.ctrlKey||a.metaKey||e.activeElement&&e.activeElement.nodeName&&("input"===e.activeElement.nodeName.toLowerCase()||"textarea"===e.activeElement.nodeName.toLowerCase()))){if(this.params.keyboard.onlyInViewport&&(33===n||34===n||37===n||39===n||38===n||40===n)){var r=!1;if(this.$el.parents("."+this.params.slideClass).length>0&&0===this.$el.parents("."+this.params.slideActiveClass).length)return;var l=t.innerWidth,o=t.innerHeight,d=this.$el.offset();s&&(d.left-=this.$el[0].scrollLeft);for(var h=[[d.left,d.top],[d.left+this.width,d.top],[d.left,d.top+this.height],[d.left+this.width,d.top+this.height]],p=0;p<h.length;p+=1){var u=h[p];u[0]>=0&&u[0]<=l&&u[1]>=0&&u[1]<=o&&(r=!0)}if(!r)return}this.isHorizontal()?(33!==n&&34!==n&&37!==n&&39!==n||(a.preventDefault?a.preventDefault():a.returnValue=!1),(34!==n&&39!==n||s)&&(33!==n&&37!==n||!s)||this.slideNext(),(33!==n&&37!==n||s)&&(34!==n&&39!==n||!s)||this.slidePrev()):(33!==n&&34!==n&&38!==n&&40!==n||(a.preventDefault?a.preventDefault():a.returnValue=!1),34!==n&&40!==n||this.slideNext(),33!==n&&38!==n||this.slidePrev()),this.emit("keyPress",n)}},enable:function(){this.keyboard.enabled||(s(e).on("keydown",this.keyboard.handle),this.keyboard.enabled=!0)},disable:function(){this.keyboard.enabled&&(s(e).off("keydown",this.keyboard.handle),this.keyboard.enabled=!1)}},te={name:"keyboard",params:{keyboard:{enabled:!1,onlyInViewport:!0}},create:function(){r.extend(this,{keyboard:{enabled:!1,enable:ee.enable.bind(this),disable:ee.disable.bind(this),handle:ee.handle.bind(this)}})},on:{init:function(){this.params.keyboard.enabled&&this.keyboard.enable()},destroy:function(){this.keyboard.enabled&&this.keyboard.disable()}}};var ie={lastScrollTime:r.now(),lastEventBeforeSnap:void 0,recentWheelEvents:[],event:function(){return t.navigator.userAgent.indexOf("firefox")>-1?"DOMMouseScroll":function(){var t="onwheel"in e;if(!t){var i=e.createElement("div");i.setAttribute("onwheel","return;"),t="function"==typeof i.onwheel}return!t&&e.implementation&&e.implementation.hasFeature&&!0!==e.implementation.hasFeature("","")&&(t=e.implementation.hasFeature("Events.wheel","3.0")),t}()?"wheel":"mousewheel"},normalize:function(e){var t=0,i=0,s=0,a=0;return"detail"in e&&(i=e.detail),"wheelDelta"in e&&(i=-e.wheelDelta/120),"wheelDeltaY"in e&&(i=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=i,i=0),s=10*t,a=10*i,"deltaY"in e&&(a=e.deltaY),"deltaX"in e&&(s=e.deltaX),e.shiftKey&&!s&&(s=a,a=0),(s||a)&&e.deltaMode&&(1===e.deltaMode?(s*=40,a*=40):(s*=800,a*=800)),s&&!t&&(t=s<1?-1:1),a&&!i&&(i=a<1?-1:1),{spinX:t,spinY:i,pixelX:s,pixelY:a}},handleMouseEnter:function(){this.mouseEntered=!0},handleMouseLeave:function(){this.mouseEntered=!1},handle:function(e){var t=e,i=this,a=i.params.mousewheel;i.params.cssMode&&t.preventDefault();var n=i.$el;if("container"!==i.params.mousewheel.eventsTarged&&(n=s(i.params.mousewheel.eventsTarged)),!i.mouseEntered&&!n[0].contains(t.target)&&!a.releaseOnEdges)return!0;t.originalEvent&&(t=t.originalEvent);var l=0,o=i.rtlTranslate?-1:1,d=ie.normalize(t);if(a.forceToAxis)if(i.isHorizontal()){if(!(Math.abs(d.pixelX)>Math.abs(d.pixelY)))return!0;l=d.pixelX*o}else{if(!(Math.abs(d.pixelY)>Math.abs(d.pixelX)))return!0;l=d.pixelY}else l=Math.abs(d.pixelX)>Math.abs(d.pixelY)?-d.pixelX*o:-d.pixelY;if(0===l)return!0;if(a.invert&&(l=-l),i.params.freeMode){var h={time:r.now(),delta:Math.abs(l),direction:Math.sign(l)},p=i.mousewheel.lastEventBeforeSnap,u=p&&h.time<p.time+500&&h.delta<=p.delta&&h.direction===p.direction;if(!u){i.mousewheel.lastEventBeforeSnap=void 0,i.params.loop&&i.loopFix();var c=i.getTranslate()+l*a.sensitivity,v=i.isBeginning,f=i.isEnd;if(c>=i.minTranslate()&&(c=i.minTranslate()),c<=i.maxTranslate()&&(c=i.maxTranslate()),i.setTransition(0),i.setTranslate(c),i.updateProgress(),i.updateActiveIndex(),i.updateSlidesClasses(),(!v&&i.isBeginning||!f&&i.isEnd)&&i.updateSlidesClasses(),i.params.freeModeSticky){clearTimeout(i.mousewheel.timeout),i.mousewheel.timeout=void 0;var m=i.mousewheel.recentWheelEvents;m.length>=15&&m.shift();var g=m.length?m[m.length-1]:void 0,w=m[0];if(m.push(h),g&&(h.delta>g.delta||h.direction!==g.direction))m.splice(0);else if(m.length>=15&&h.time-w.time<500&&w.delta-h.delta>=1&&h.delta<=6){var b=l>0?.8:.2;i.mousewheel.lastEventBeforeSnap=h,m.splice(0),i.mousewheel.timeout=r.nextTick((function(){i.slideToClosest(i.params.speed,!0,void 0,b)}),0)}i.mousewheel.timeout||(i.mousewheel.timeout=r.nextTick((function(){i.mousewheel.lastEventBeforeSnap=h,m.splice(0),i.slideToClosest(i.params.speed,!0,void 0,.5)}),500))}if(u||i.emit("scroll",t),i.params.autoplay&&i.params.autoplayDisableOnInteraction&&i.autoplay.stop(),c===i.minTranslate()||c===i.maxTranslate())return!0}}else{var T={time:r.now(),delta:Math.abs(l),direction:Math.sign(l),raw:e},C=i.mousewheel.recentWheelEvents;C.length>=2&&C.shift();var x=C.length?C[C.length-1]:void 0;if(C.push(T),x?(T.direction!==x.direction||T.delta>x.delta)&&i.mousewheel.animateSlider(T):i.mousewheel.animateSlider(T),i.mousewheel.releaseScroll(T))return!0}return t.preventDefault?t.preventDefault():t.returnValue=!1,!1},animateSlider:function(e){return e.delta>=6&&r.now()-this.mousewheel.lastScrollTime<60||(e.direction<0?this.isEnd&&!this.params.loop||this.animating||(this.slideNext(),this.emit("scroll",e.raw)):this.isBeginning&&!this.params.loop||this.animating||(this.slidePrev(),this.emit("scroll",e.raw)),this.mousewheel.lastScrollTime=(new t.Date).getTime(),!1)},releaseScroll:function(e){var t=this.params.mousewheel;if(e.direction<0){if(this.isEnd&&!this.params.loop&&t.releaseOnEdges)return!0}else if(this.isBeginning&&!this.params.loop&&t.releaseOnEdges)return!0;return!1},enable:function(){var e=ie.event();if(this.params.cssMode)return this.wrapperEl.removeEventListener(e,this.mousewheel.handle),!0;if(!e)return!1;if(this.mousewheel.enabled)return!1;var t=this.$el;return"container"!==this.params.mousewheel.eventsTarged&&(t=s(this.params.mousewheel.eventsTarged)),t.on("mouseenter",this.mousewheel.handleMouseEnter),t.on("mouseleave",this.mousewheel.handleMouseLeave),t.on(e,this.mousewheel.handle),this.mousewheel.enabled=!0,!0},disable:function(){var e=ie.event();if(this.params.cssMode)return this.wrapperEl.addEventListener(e,this.mousewheel.handle),!0;if(!e)return!1;if(!this.mousewheel.enabled)return!1;var t=this.$el;return"container"!==this.params.mousewheel.eventsTarged&&(t=s(this.params.mousewheel.eventsTarged)),t.off(e,this.mousewheel.handle),this.mousewheel.enabled=!1,!0}},se={update:function(){var e=this.params.navigation;if(!this.params.loop){var t=this.navigation,i=t.$nextEl,s=t.$prevEl;s&&s.length>0&&(this.isBeginning?s.addClass(e.disabledClass):s.removeClass(e.disabledClass),s[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass)),i&&i.length>0&&(this.isEnd?i.addClass(e.disabledClass):i.removeClass(e.disabledClass),i[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass))}},onPrevClick:function(e){e.preventDefault(),this.isBeginning&&!this.params.loop||this.slidePrev()},onNextClick:function(e){e.preventDefault(),this.isEnd&&!this.params.loop||this.slideNext()},init:function(){var e,t,i=this.params.navigation;(i.nextEl||i.prevEl)&&(i.nextEl&&(e=s(i.nextEl),this.params.uniqueNavElements&&"string"==typeof i.nextEl&&e.length>1&&1===this.$el.find(i.nextEl).length&&(e=this.$el.find(i.nextEl))),i.prevEl&&(t=s(i.prevEl),this.params.uniqueNavElements&&"string"==typeof i.prevEl&&t.length>1&&1===this.$el.find(i.prevEl).length&&(t=this.$el.find(i.prevEl))),e&&e.length>0&&e.on("click",this.navigation.onNextClick),t&&t.length>0&&t.on("click",this.navigation.onPrevClick),r.extend(this.navigation,{$nextEl:e,nextEl:e&&e[0],$prevEl:t,prevEl:t&&t[0]}))},destroy:function(){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;t&&t.length&&(t.off("click",this.navigation.onNextClick),t.removeClass(this.params.navigation.disabledClass)),i&&i.length&&(i.off("click",this.navigation.onPrevClick),i.removeClass(this.params.navigation.disabledClass))}},ae={update:function(){var e=this.rtl,t=this.params.pagination;if(t.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var i,a=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,n=this.pagination.$el,r=this.params.loop?Math.ceil((a-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length;if(this.params.loop?((i=Math.ceil((this.activeIndex-this.loopedSlides)/this.params.slidesPerGroup))>a-1-2*this.loopedSlides&&(i-=a-2*this.loopedSlides),i>r-1&&(i-=r),i<0&&"bullets"!==this.params.paginationType&&(i=r+i)):i=void 0!==this.snapIndex?this.snapIndex:this.activeIndex||0,"bullets"===t.type&&this.pagination.bullets&&this.pagination.bullets.length>0){var l,o,d,h=this.pagination.bullets;if(t.dynamicBullets&&(this.pagination.bulletSize=h.eq(0)[this.isHorizontal()?"outerWidth":"outerHeight"](!0),n.css(this.isHorizontal()?"width":"height",this.pagination.bulletSize*(t.dynamicMainBullets+4)+"px"),t.dynamicMainBullets>1&&void 0!==this.previousIndex&&(this.pagination.dynamicBulletIndex+=i-this.previousIndex,this.pagination.dynamicBulletIndex>t.dynamicMainBullets-1?this.pagination.dynamicBulletIndex=t.dynamicMainBullets-1:this.pagination.dynamicBulletIndex<0&&(this.pagination.dynamicBulletIndex=0)),l=i-this.pagination.dynamicBulletIndex,d=((o=l+(Math.min(h.length,t.dynamicMainBullets)-1))+l)/2),h.removeClass(t.bulletActiveClass+" "+t.bulletActiveClass+"-next "+t.bulletActiveClass+"-next-next "+t.bulletActiveClass+"-prev "+t.bulletActiveClass+"-prev-prev "+t.bulletActiveClass+"-main"),n.length>1)h.each((function(e,a){var n=s(a),r=n.index();r===i&&n.addClass(t.bulletActiveClass),t.dynamicBullets&&(r>=l&&r<=o&&n.addClass(t.bulletActiveClass+"-main"),r===l&&n.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),r===o&&n.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next"))}));else{var p=h.eq(i),u=p.index();if(p.addClass(t.bulletActiveClass),t.dynamicBullets){for(var c=h.eq(l),v=h.eq(o),f=l;f<=o;f+=1)h.eq(f).addClass(t.bulletActiveClass+"-main");if(this.params.loop)if(u>=h.length-t.dynamicMainBullets){for(var m=t.dynamicMainBullets;m>=0;m-=1)h.eq(h.length-m).addClass(t.bulletActiveClass+"-main");h.eq(h.length-t.dynamicMainBullets-1).addClass(t.bulletActiveClass+"-prev")}else c.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),v.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next");else c.prev().addClass(t.bulletActiveClass+"-prev").prev().addClass(t.bulletActiveClass+"-prev-prev"),v.next().addClass(t.bulletActiveClass+"-next").next().addClass(t.bulletActiveClass+"-next-next")}}if(t.dynamicBullets){var g=Math.min(h.length,t.dynamicMainBullets+4),w=(this.pagination.bulletSize*g-this.pagination.bulletSize)/2-d*this.pagination.bulletSize,b=e?"right":"left";h.css(this.isHorizontal()?b:"top",w+"px")}}if("fraction"===t.type&&(n.find("."+t.currentClass).text(t.formatFractionCurrent(i+1)),n.find("."+t.totalClass).text(t.formatFractionTotal(r))),"progressbar"===t.type){var T;T=t.progressbarOpposite?this.isHorizontal()?"vertical":"horizontal":this.isHorizontal()?"horizontal":"vertical";var C=(i+1)/r,x=1,y=1;"horizontal"===T?x=C:y=C,n.find("."+t.progressbarFillClass).transform("translate3d(0,0,0) scaleX("+x+") scaleY("+y+")").transition(this.params.speed)}"custom"===t.type&&t.renderCustom?(n.html(t.renderCustom(this,i+1,r)),this.emit("paginationRender",this,n[0])):this.emit("paginationUpdate",this,n[0]),n[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](t.lockClass)}},render:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,i=this.pagination.$el,s="";if("bullets"===e.type){for(var a=this.params.loop?Math.ceil((t-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length,n=0;n<a;n+=1)e.renderBullet?s+=e.renderBullet.call(this,n,e.bulletClass):s+="<"+e.bulletElement+' class="'+e.bulletClass+'"></'+e.bulletElement+">";i.html(s),this.pagination.bullets=i.find("."+e.bulletClass)}"fraction"===e.type&&(s=e.renderFraction?e.renderFraction.call(this,e.currentClass,e.totalClass):'<span class="'+e.currentClass+'"></span> / <span class="'+e.totalClass+'"></span>',i.html(s)),"progressbar"===e.type&&(s=e.renderProgressbar?e.renderProgressbar.call(this,e.progressbarFillClass):'<span class="'+e.progressbarFillClass+'"></span>',i.html(s)),"custom"!==e.type&&this.emit("paginationRender",this.pagination.$el[0])}},init:function(){var e=this,t=e.params.pagination;if(t.el){var i=s(t.el);0!==i.length&&(e.params.uniqueNavElements&&"string"==typeof t.el&&i.length>1&&1===e.$el.find(t.el).length&&(i=e.$el.find(t.el)),"bullets"===t.type&&t.clickable&&i.addClass(t.clickableClass),i.addClass(t.modifierClass+t.type),"bullets"===t.type&&t.dynamicBullets&&(i.addClass(""+t.modifierClass+t.type+"-dynamic"),e.pagination.dynamicBulletIndex=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&i.addClass(t.progressbarOppositeClass),t.clickable&&i.on("click","."+t.bulletClass,(function(t){t.preventDefault();var i=s(this).index()*e.params.slidesPerGroup;e.params.loop&&(i+=e.loopedSlides),e.slideTo(i)})),r.extend(e.pagination,{$el:i,el:i[0]}))}},destroy:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.pagination.$el;t.removeClass(e.hiddenClass),t.removeClass(e.modifierClass+e.type),this.pagination.bullets&&this.pagination.bullets.removeClass(e.bulletActiveClass),e.clickable&&t.off("click","."+e.bulletClass)}}},ne={makeElFocusable:function(e){return e.attr("tabIndex","0"),e},addElRole:function(e,t){return e.attr("role",t),e},addElLabel:function(e,t){return e.attr("aria-label",t),e},disableEl:function(e){return e.attr("aria-disabled",!0),e},enableEl:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){var t=this.params.a11y;if(13===e.keyCode){var i=s(e.target);this.navigation&&this.navigation.$nextEl&&i.is(this.navigation.$nextEl)&&(this.isEnd&&!this.params.loop||this.slideNext(),this.isEnd?this.a11y.notify(t.lastSlideMessage):this.a11y.notify(t.nextSlideMessage)),this.navigation&&this.navigation.$prevEl&&i.is(this.navigation.$prevEl)&&(this.isBeginning&&!this.params.loop||this.slidePrev(),this.isBeginning?this.a11y.notify(t.firstSlideMessage):this.a11y.notify(t.prevSlideMessage)),this.pagination&&i.is("."+this.params.pagination.bulletClass)&&i[0].click()}},notify:function(e){var t=this.a11y.liveRegion;0!==t.length&&(t.html(""),t.html(e))},updateNavigation:function(){if(!this.params.loop&&this.navigation){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;i&&i.length>0&&(this.isBeginning?this.a11y.disableEl(i):this.a11y.enableEl(i)),t&&t.length>0&&(this.isEnd?this.a11y.disableEl(t):this.a11y.enableEl(t))}},updatePagination:function(){var e=this,t=e.params.a11y;e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.bullets.each((function(i,a){var n=s(a);e.a11y.makeElFocusable(n),e.a11y.addElRole(n,"button"),e.a11y.addElLabel(n,t.paginationBulletMessage.replace(/{{index}}/,n.index()+1))}))},init:function(){this.$el.append(this.a11y.liveRegion);var e,t,i=this.params.a11y;this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&(this.a11y.makeElFocusable(e),this.a11y.addElRole(e,"button"),this.a11y.addElLabel(e,i.nextSlideMessage),e.on("keydown",this.a11y.onEnterKey)),t&&(this.a11y.makeElFocusable(t),this.a11y.addElRole(t,"button"),this.a11y.addElLabel(t,i.prevSlideMessage),t.on("keydown",this.a11y.onEnterKey)),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.on("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)},destroy:function(){var e,t;this.a11y.liveRegion&&this.a11y.liveRegion.length>0&&this.a11y.liveRegion.remove(),this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&e.off("keydown",this.a11y.onEnterKey),t&&t.off("keydown",this.a11y.onEnterKey),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.off("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)}},re={setTranslate:function(){for(var e=this.slides,t=0;t<e.length;t+=1){var i=this.slides.eq(t),s=-i[0].swiperSlideOffset;this.params.virtualTranslate||(s-=this.translate);var a=0;this.isHorizontal()||(a=s,s=0);var n=this.params.fadeEffect.crossFade?Math.max(1-Math.abs(i[0].progress),0):1+Math.min(Math.max(i[0].progress,-1),0);i.css({opacity:n}).transform("translate3d("+s+"px, "+a+"px, 0px)")}},setTransition:function(e){var t=this,i=t.slides,s=t.$wrapperEl;if(i.transition(e),t.params.virtualTranslate&&0!==e){var a=!1;i.transitionEnd((function(){if(!a&&t&&!t.destroyed){a=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],i=0;i<e.length;i+=1)s.trigger(e[i])}}))}}},le=[X,Y,K,U,Q,J,te,{name:"mousewheel",params:{mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarged:"container"}},create:function(){r.extend(this,{mousewheel:{enabled:!1,enable:ie.enable.bind(this),disable:ie.disable.bind(this),handle:ie.handle.bind(this),handleMouseEnter:ie.handleMouseEnter.bind(this),handleMouseLeave:ie.handleMouseLeave.bind(this),animateSlider:ie.animateSlider.bind(this),releaseScroll:ie.releaseScroll.bind(this),lastScrollTime:r.now(),lastEventBeforeSnap:void 0,recentWheelEvents:[]}})},on:{init:function(){!this.params.mousewheel.enabled&&this.params.cssMode&&this.mousewheel.disable(),this.params.mousewheel.enabled&&this.mousewheel.enable()},destroy:function(){this.params.cssMode&&this.mousewheel.enable(),this.mousewheel.enabled&&this.mousewheel.disable()}}},{name:"navigation",params:{navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock"}},create:function(){r.extend(this,{navigation:{init:se.init.bind(this),update:se.update.bind(this),destroy:se.destroy.bind(this),onNextClick:se.onNextClick.bind(this),onPrevClick:se.onPrevClick.bind(this)}})},on:{init:function(){this.navigation.init(),this.navigation.update()},toEdge:function(){this.navigation.update()},fromEdge:function(){this.navigation.update()},destroy:function(){this.navigation.destroy()},click:function(e){var t,i=this.navigation,a=i.$nextEl,n=i.$prevEl;!this.params.navigation.hideOnClick||s(e.target).is(n)||s(e.target).is(a)||(a?t=a.hasClass(this.params.navigation.hiddenClass):n&&(t=n.hasClass(this.params.navigation.hiddenClass)),!0===t?this.emit("navigationShow",this):this.emit("navigationHide",this),a&&a.toggleClass(this.params.navigation.hiddenClass),n&&n.toggleClass(this.params.navigation.hiddenClass))}}},{name:"pagination",params:{pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:function(e){return e},formatFractionTotal:function(e){return e},bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",modifierClass:"swiper-pagination-",currentClass:"swiper-pagination-current",totalClass:"swiper-pagination-total",hiddenClass:"swiper-pagination-hidden",progressbarFillClass:"swiper-pagination-progressbar-fill",progressbarOppositeClass:"swiper-pagination-progressbar-opposite",clickableClass:"swiper-pagination-clickable",lockClass:"swiper-pagination-lock"}},create:function(){r.extend(this,{pagination:{init:ae.init.bind(this),render:ae.render.bind(this),update:ae.update.bind(this),destroy:ae.destroy.bind(this),dynamicBulletIndex:0}})},on:{init:function(){this.pagination.init(),this.pagination.render(),this.pagination.update()},activeIndexChange:function(){this.params.loop?this.pagination.update():void 0===this.snapIndex&&this.pagination.update()},snapIndexChange:function(){this.params.loop||this.pagination.update()},slidesLengthChange:function(){this.params.loop&&(this.pagination.render(),this.pagination.update())},snapGridLengthChange:function(){this.params.loop||(this.pagination.render(),this.pagination.update())},destroy:function(){this.pagination.destroy()},click:function(e){this.params.pagination.el&&this.params.pagination.hideOnClick&&this.pagination.$el.length>0&&!s(e.target).hasClass(this.params.pagination.bulletClass)&&(!0===this.pagination.$el.hasClass(this.params.pagination.hiddenClass)?this.emit("paginationShow",this):this.emit("paginationHide",this),this.pagination.$el.toggleClass(this.params.pagination.hiddenClass))}}},{name:"a11y",params:{a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}"}},create:function(){var e=this;r.extend(e,{a11y:{liveRegion:s('<span class="'+e.params.a11y.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>')}}),Object.keys(ne).forEach((function(t){e.a11y[t]=ne[t].bind(e)}))},on:{init:function(){this.params.a11y.enabled&&(this.a11y.init(),this.a11y.updateNavigation())},toEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},fromEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},paginationUpdate:function(){this.params.a11y.enabled&&this.a11y.updatePagination()},destroy:function(){this.params.a11y.enabled&&this.a11y.destroy()}}},{name:"effect-fade",params:{fadeEffect:{crossFade:!1}},create:function(){r.extend(this,{fadeEffect:{setTranslate:re.setTranslate.bind(this),setTransition:re.setTransition.bind(this)}})},on:{beforeInit:function(){if("fade"===this.params.effect){this.classNames.push(this.params.containerModifierClass+"fade");var e={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};r.extend(this.params,e),r.extend(this.originalParams,e)}},setTranslate:function(){"fade"===this.params.effect&&this.fadeEffect.setTranslate()},setTransition:function(e){"fade"===this.params.effect&&this.fadeEffect.setTransition(e)}}}];return void 0===W.use&&(W.use=W.Class.use,W.installModule=W.Class.installModule),W.use(le),W}));
//# sourceMappingURL=swiper.min.js.map

/*!
* Masonry PACKAGED v4.2.2
* Cascading grid layout library
* https://masonry.desandro.com
* MIT License
* by David DeSandro
*/

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(t,r),delete n[r]),r.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s=200==Math.round(t(o.width)),r.isBoxSizeOuter=s,i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,E=d&&s,b=t(r.width);b!==!1&&(a.width=b+(E?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(E?0:g+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+z),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var o=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var r=i.toDashed(n),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(o&&o.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,n,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=parseFloat(n),s=parseFloat(o),a=this.layout.size;-1!=n.indexOf("%")&&(r=r/100*a.width),-1!=o.indexOf("%")&&(s=s/100*a.height),r=isNaN(r)?0:r,s=isNaN(s)?0:s,r-=e?a.paddingLeft:a.paddingRight,s-=i?a.paddingTop:a.paddingBottom,this.position.x=r,this.position.y=s},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),o&&!this.isTransitioning)return void this.layoutPosition();var r=t-i,s=e-n,a={};a.transform=this.getTranslate(r,s),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",r=this[o](n,t),s={x:this.columnWidth*r.col,y:r.y},a=r.y+t.size.outerHeight,h=n+r.col,u=r.col;h>u;u++)this.colYs[u]=a;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(2>e)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,n=t>1&&i+t>this.cols;i=n?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
