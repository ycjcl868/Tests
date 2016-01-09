function FastClick(e, t) {
    "use strict";
    function r(e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }

    var n;
    t = t || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = t.touchBoundary || 10, this.layer = e, this.tapDelay = t.tapDelay || 200;
    if (FastClick.notNeeded(e))return;
    var i = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], s = this;
    for (var o = 0, u = i.length; o < u; o++)s[i[o]] = r(s[i[o]], s);
    deviceIsAndroid && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function (t, n, r) {
        var i = Node.prototype.removeEventListener;
        t === "click" ? i.call(e, t, n.hijacked || n, r) : i.call(e, t, n, r)
    }, e.addEventListener = function (t, n, r) {
        var i = Node.prototype.addEventListener;
        t === "click" ? i.call(e, t, n.hijacked || (n.hijacked = function (e) {
                e.propagationStopped || n(e)
            }), r) : i.call(e, t, n, r)
    }), typeof e.onclick == "function" && (n = e.onclick, e.addEventListener("click", function (e) {
        n(e)
    }, !1), e.onclick = null)
}
var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0, deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent), deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent), deviceIsIOSWithBadTarget = deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick = function (e) {
    "use strict";
    switch (e.nodeName.toLowerCase()) {
        case"button":
        case"select":
        case"textarea":
            if (e.disabled)return !0;
            break;
        case"input":
            if (deviceIsIOS && e.type === "file" || e.disabled)return !0;
            break;
        case"label":
        case"video":
            return !0
    }
    return /\bneedsclick\b/.test(e.className)
}, FastClick.prototype.needsFocus = function (e) {
    "use strict";
    switch (e.nodeName.toLowerCase()) {
        case"textarea":
            return !0;
        case"select":
            return !deviceIsAndroid;
        case"input":
            switch (e.type) {
                case"button":
                case"checkbox":
                case"file":
                case"image":
                case"radio":
                case"submit":
                    return !1
            }
            return !e.disabled && !e.readOnly;
        default:
            return /\bneedsfocus\b/.test(e.className)
    }
}, FastClick.prototype.sendClick = function (e, t) {
    "use strict";
    var n, r;
    document.activeElement && document.activeElement !== e && document.activeElement.blur(), r = t.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, e.dispatchEvent(n)
}, FastClick.prototype.determineEventType = function (e) {
    "use strict";
    return deviceIsAndroid && e.tagName.toLowerCase() === "select" ? "mousedown" : "click"
}, FastClick.prototype.focus = function (e) {
    "use strict";
    var t;
    deviceIsIOS && e.setSelectionRange && e.type.indexOf("date") !== 0 && e.type !== "time" ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
}, FastClick.prototype.updateScrollParent = function (e) {
    "use strict";
    var t, n;
    t = e.fastClickScrollParent;
    if (!t || !t.contains(e)) {
        n = e;
        do {
            if (n.scrollHeight > n.offsetHeight) {
                t = n, e.fastClickScrollParent = n;
                break
            }
            n = n.parentElement
        } while (n)
    }
    t && (t.fastClickLastScrollTop = t.scrollTop)
}, FastClick.prototype.getTargetElementFromEventTarget = function (e) {
    "use strict";
    return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
}, FastClick.prototype.onTouchStart = function (e) {
    "use strict";
    var t, n, r;
    if (e.targetTouches.length > 1)return !0;
    t = this.getTargetElementFromEventTarget(e.target), n = e.targetTouches[0];
    if (deviceIsIOS) {
        r = window.getSelection();
        if (r.rangeCount && !r.isCollapsed)return !0;
        if (!deviceIsIOS4) {
            if (n.identifier === this.lastTouchIdentifier)return e.preventDefault(), !1;
            this.lastTouchIdentifier = n.identifier, this.updateScrollParent(t)
        }
    }
    return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = n.pageX, this.touchStartY = n.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
}, FastClick.prototype.touchHasMoved = function (e) {
    "use strict";
    var t = e.changedTouches[0], n = this.touchBoundary;
    return Math.abs(t.pageX - this.touchStartX) > n || Math.abs(t.pageY - this.touchStartY) > n ? !0 : !1
}, FastClick.prototype.onTouchMove = function (e) {
    "use strict";
    if (!this.trackingClick)return !0;
    if (this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e))this.trackingClick = !1, this.targetElement = null;
    return !0
}, FastClick.prototype.findControl = function (e) {
    "use strict";
    return e.control !== undefined ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
}, FastClick.prototype.onTouchEnd = function (e) {
    "use strict";
    var t, n, r, i, s, o = this.targetElement;
    if (!this.trackingClick)return !0;
    if (e.timeStamp - this.lastClickTime < this.tapDelay)return this.cancelNextClick = !0, !0;
    this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, n = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, deviceIsIOSWithBadTarget && (s = e.changedTouches[0], o = document.elementFromPoint(s.pageX - window.pageXOffset, s.pageY - window.pageYOffset) || o, o.fastClickScrollParent = this.targetElement.fastClickScrollParent), r = o.tagName.toLowerCase();
    if (r === "label") {
        t = this.findControl(o);
        if (t) {
            this.focus(o);
            if (deviceIsAndroid)return !1;
            o = t
        }
    } else if (this.needsFocus(o)) {
        if (e.timeStamp - n > 100 || deviceIsIOS && window.top !== window && r === "input")return this.targetElement = null, !1;
        this.focus(o), this.sendClick(o, e);
        if (!deviceIsIOS || r !== "select")this.targetElement = null, e.preventDefault();
        return !1
    }
    if (deviceIsIOS && !deviceIsIOS4) {
        i = o.fastClickScrollParent;
        if (i && i.fastClickLastScrollTop !== i.scrollTop)return !0
    }
    return this.needsClick(o) || (e.preventDefault(), this.sendClick(o, e)), !1
}, FastClick.prototype.onTouchCancel = function () {
    "use strict";
    this.trackingClick = !1, this.targetElement = null
}, FastClick.prototype.onMouse = function (e) {
    "use strict";
    return this.targetElement ? e.forwardedTouchEvent ? !0 : e.cancelable ? !this.needsClick(this.targetElement) || this.cancelNextClick ? (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1) : !0 : !0 : !0
}, FastClick.prototype.onClick = function (e) {
    "use strict";
    var t;
    return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : e.target.type === "submit" && e.detail === 0 ? !0 : (t = this.onMouse(e), t || (this.targetElement = null), t)
}, FastClick.prototype.destroy = function () {
    "use strict";
    var e = this.layer;
    deviceIsAndroid && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
}, FastClick.notNeeded = function (e) {
    "use strict";
    var t, n;
    if (typeof window.ontouchstart == "undefined")return !0;
    n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
    if (n) {
        if (!deviceIsAndroid)return !0;
        t = document.querySelector("meta[name=viewport]");
        if (t) {
            if (t.content.indexOf("user-scalable=no") !== -1)return !0;
            if (n > 31 && document.documentElement.scrollWidth <= window.outerWidth)return !0
        }
    }
    return e.style.msTouchAction === "none" ? !0 : !1
}, FastClick.attach = function (e, t) {
    "use strict";
    return new FastClick(e, t)
}, typeof define != "undefined" && define.amd ? define(function () {
    "use strict";
    return FastClick
}) : typeof module != "undefined" && module.exports ? (module.exports = FastClick.attach, module.exports.FastClick = FastClick) : window.FastClick = FastClick, function (e, t) {
    function H(e) {
        var t = e.length, n = w.type(e);
        return w.isWindow(e) ? !1 : e.nodeType === 1 && t ? !0 : n === "array" || n !== "function" && (t === 0 || typeof t == "number" && t > 0 && t - 1 in e)
    }

    function j(e) {
        var t = B[e] = {};
        return w.each(e.match(S) || [], function (e, n) {
            t[n] = !0
        }), t
    }

    function q(e, n, r, i) {
        if (!w.acceptData(e))return;
        var s, o, u = w.expando, a = e.nodeType, f = a ? w.cache : e, l = a ? e[u] : e[u] && u;
        if ((!l || !f[l] || !i && !f[l].data) && r === t && typeof n == "string")return;
        l || (a ? l = e[u] = c.pop() || w.guid++ : l = u), f[l] || (f[l] = a ? {} : {toJSON: w.noop});
        if (typeof n == "object" || typeof n == "function")i ? f[l] = w.extend(f[l], n) : f[l].data = w.extend(f[l].data, n);
        return o = f[l], i || (o.data || (o.data = {}), o = o.data), r !== t && (o[w.camelCase(n)] = r), typeof n == "string" ? (s = o[n], s == null && (s = o[w.camelCase(n)])) : s = o, s
    }

    function R(e, t, n) {
        if (!w.acceptData(e))return;
        var r, i, s = e.nodeType, o = s ? w.cache : e, u = s ? e[w.expando] : w.expando;
        if (!o[u])return;
        if (t) {
            r = n ? o[u] : o[u].data;
            if (r) {
                w.isArray(t) ? t = t.concat(w.map(t, w.camelCase)) : t in r ? t = [t] : (t = w.camelCase(t), t in r ? t = [t] : t = t.split(" ")), i = t.length;
                while (i--)delete r[t[i]];
                if (n ? !z(r) : !w.isEmptyObject(r))return
            }
        }
        if (!n) {
            delete o[u].data;
            if (!z(o[u]))return
        }
        s ? w.cleanData([e], !0) : w.support.deleteExpando || o != o.window ? delete o[u] : o[u] = null
    }

    function U(e, n, r) {
        if (r === t && e.nodeType === 1) {
            var i = "data-" + n.replace(I, "-$1").toLowerCase();
            r = e.getAttribute(i);
            if (typeof r == "string") {
                try {
                    r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : +r + "" === r ? +r : F.test(r) ? w.parseJSON(r) : r
                } catch (s) {
                }
                w.data(e, n, r)
            } else r = t
        }
        return r
    }

    function z(e) {
        var t;
        for (t in e) {
            if (t === "data" && w.isEmptyObject(e[t]))continue;
            if (t !== "toJSON")return !1
        }
        return !0
    }

    function it() {
        return !0
    }

    function st() {
        return !1
    }

    function ot() {
        try {
            return o.activeElement
        } catch (e) {
        }
    }

    function ct(e, t) {
        do e = e[t]; while (e && e.nodeType !== 1);
        return e
    }

    function ht(e, t, n) {
        if (w.isFunction(t))return w.grep(e, function (e, r) {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType)return w.grep(e, function (e) {
            return e === t !== n
        });
        if (typeof t == "string") {
            if (ut.test(t))return w.filter(t, e, n);
            t = w.filter(t, e)
        }
        return w.grep(e, function (e) {
            return w.inArray(e, t) >= 0 !== n
        })
    }

    function pt(e) {
        var t = dt.split("|"), n = e.createDocumentFragment();
        if (n.createElement)while (t.length)n.createElement(t.pop());
        return n
    }

    function Mt(e, t) {
        return w.nodeName(e, "table") && w.nodeName(t.nodeType === 1 ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function _t(e) {
        return e.type = (w.find.attr(e, "type") !== null) + "/" + e.type, e
    }

    function Dt(e) {
        var t = Ct.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function Pt(e, t) {
        var n, r = 0;
        for (; (n = e[r]) != null; r++)w._data(n, "globalEval", !t || w._data(t[r], "globalEval"))
    }

    function Ht(e, t) {
        if (t.nodeType !== 1 || !w.hasData(e))return;
        var n, r, i, s = w._data(e), o = w._data(t, s), u = s.events;
        if (u) {
            delete o.handle, o.events = {};
            for (n in u)for (r = 0, i = u[n].length; r < i; r++)w.event.add(t, n, u[n][r])
        }
        o.data && (o.data = w.extend({}, o.data))
    }

    function Bt(e, t) {
        var n, r, i;
        if (t.nodeType !== 1)return;
        n = t.nodeName.toLowerCase();
        if (!w.support.noCloneEvent && t[w.expando]) {
            i = w._data(t);
            for (r in i.events)w.removeEvent(t, r, i.handle);
            t.removeAttribute(w.expando)
        }
        if (n === "script" && t.text !== e.text)_t(t).text = e.text, Dt(t); else if (n === "object")t.parentNode && (t.outerHTML = e.outerHTML), w.support.html5Clone && e.innerHTML && !w.trim(t.innerHTML) && (t.innerHTML = e.innerHTML); else if (n === "input" && xt.test(e.type))t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value); else if (n === "option")t.defaultSelected = t.selected = e.defaultSelected; else if (n === "input" || n === "textarea")t.defaultValue = e.defaultValue
    }

    function jt(e, n) {
        var r, s, o = 0, u = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
        if (!u)for (u = [], r = e.childNodes || e; (s = r[o]) != null; o++)!n || w.nodeName(s, n) ? u.push(s) : w.merge(u, jt(s, n));
        return n === t || n && w.nodeName(e, n) ? w.merge([e], u) : u
    }

    function Ft(e) {
        xt.test(e.type) && (e.defaultChecked = e.checked)
    }

    function tn(e, t) {
        if (t in e)return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = en.length;
        while (i--) {
            t = en[i] + n;
            if (t in e)return t
        }
        return r
    }

    function nn(e, t) {
        return e = t || e, w.css(e, "display") === "none" || !w.contains(e.ownerDocument, e)
    }

    function rn(e, t) {
        var n, r, i, s = [], o = 0, u = e.length;
        for (; o < u; o++) {
            r = e[o];
            if (!r.style)continue;
            s[o] = w._data(r, "olddisplay"), n = r.style.display, t ? (!s[o] && n === "none" && (r.style.display = ""), r.style.display === "" && nn(r) && (s[o] = w._data(r, "olddisplay", an(r.nodeName)))) : s[o] || (i = nn(r), (n && n !== "none" || !i) && w._data(r, "olddisplay", i ? n : w.css(r, "display")))
        }
        for (o = 0; o < u; o++) {
            r = e[o];
            if (!r.style)continue;
            if (!t || r.style.display === "none" || r.style.display === "")r.style.display = t ? s[o] || "" : "none"
        }
        return e
    }

    function sn(e, t, n) {
        var r = $t.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function on(e, t, n, r, i) {
        var s = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0, o = 0;
        for (; s < 4; s += 2)n === "margin" && (o += w.css(e, n + Zt[s], !0, i)), r ? (n === "content" && (o -= w.css(e, "padding" + Zt[s], !0, i)), n !== "margin" && (o -= w.css(e, "border" + Zt[s] + "Width", !0, i))) : (o += w.css(e, "padding" + Zt[s], !0, i), n !== "padding" && (o += w.css(e, "border" + Zt[s] + "Width", !0, i)));
        return o
    }

    function un(e, t, n) {
        var r = !0, i = t === "width" ? e.offsetWidth : e.offsetHeight, s = qt(e), o = w.support.boxSizing && w.css(e, "boxSizing", !1, s) === "border-box";
        if (i <= 0 || i == null) {
            i = Rt(e, t, s);
            if (i < 0 || i == null)i = e.style[t];
            if (Jt.test(i))return i;
            r = o && (w.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + on(e, t, n || (o ? "border" : "content"), r, s) + "px"
    }

    function an(e) {
        var t = o, n = Qt[e];
        if (!n) {
            n = fn(e, t);
            if (n === "none" || !n)It = (It || w("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (It[0].contentWindow || It[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = fn(e, t), It.detach();
            Qt[e] = n
        }
        return n
    }

    function fn(e, t) {
        var n = w(t.createElement(e)).appendTo(t.body), r = w.css(n[0], "display");
        return n.remove(), r
    }

    function vn(e, t, n, r) {
        var i;
        if (w.isArray(t))w.each(t, function (t, i) {
            n || cn.test(e) ? r(e, i) : vn(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
        }); else if (!n && w.type(t) === "object")for (i in t)vn(e + "[" + i + "]", t[i], n, r); else r(e, t)
    }

    function _n(e) {
        return function (t, n) {
            typeof t != "string" && (n = t, t = "*");
            var r, i = 0, s = t.toLowerCase().match(S) || [];
            if (w.isFunction(n))while (r = s[i++])r[0] === "+" ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function Dn(e, t, n, r) {
        function o(u) {
            var a;
            return i[u] = !0, w.each(e[u] || [], function (e, u) {
                var f = u(t, n, r);
                if (typeof f == "string" && !s && !i[f])return t.dataTypes.unshift(f), o(f), !1;
                if (s)return !(a = f)
            }), a
        }

        var i = {}, s = e === An;
        return o(t.dataTypes[0]) || !i["*"] && o("*")
    }

    function Pn(e, n) {
        var r, i, s = w.ajaxSettings.flatOptions || {};
        for (i in n)n[i] !== t && ((s[i] ? e : r || (r = {}))[i] = n[i]);
        return r && w.extend(!0, e, r), e
    }

    function Hn(e, n, r) {
        var i, s, o, u, a = e.contents, f = e.dataTypes;
        while (f[0] === "*")f.shift(), s === t && (s = e.mimeType || n.getResponseHeader("Content-Type"));
        if (s)for (u in a)if (a[u] && a[u].test(s)) {
            f.unshift(u);
            break
        }
        if (f[0]in r)o = f[0]; else {
            for (u in r) {
                if (!f[0] || e.converters[u + " " + f[0]]) {
                    o = u;
                    break
                }
                i || (i = u)
            }
            o = o || i
        }
        if (o)return o !== f[0] && f.unshift(o), r[o]
    }

    function Bn(e, t, n, r) {
        var i, s, o, u, a, f = {}, l = e.dataTypes.slice();
        if (l[1])for (o in e.converters)f[o.toLowerCase()] = e.converters[o];
        s = l.shift();
        while (s) {
            e.responseFields[s] && (n[e.responseFields[s]] = t), !a && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), a = s, s = l.shift();
            if (s)if (s === "*")s = a; else if (a !== "*" && a !== s) {
                o = f[a + " " + s] || f["* " + s];
                if (!o)for (i in f) {
                    u = i.split(" ");
                    if (u[1] === s) {
                        o = f[a + " " + u[0]] || f["* " + u[0]];
                        if (o) {
                            o === !0 ? o = f[i] : f[i] !== !0 && (s = u[0], l.unshift(u[1]));
                            break
                        }
                    }
                }
                if (o !== !0)if (o && e["throws"])t = o(t); else try {
                    t = o(t)
                } catch (c) {
                    return {state: "parsererror", error: o ? c : "No conversion from " + a + " to " + s}
                }
            }
        }
        return {state: "success", data: t}
    }

    function zn() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {
        }
    }

    function Wn() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {
        }
    }

    function Yn() {
        return setTimeout(function () {
            Xn = t
        }), Xn = w.now()
    }

    function Zn(e, t, n) {
        var r, i = (Gn[t] || []).concat(Gn["*"]), s = 0, o = i.length;
        for (; s < o; s++)if (r = i[s].call(n, t, e))return r
    }

    function er(e, t, n) {
        var r, i, s = 0, o = Qn.length, u = w.Deferred().always(function () {
            delete a.elem
        }), a = function () {
            if (i)return !1;
            var t = Xn || Yn(), n = Math.max(0, f.startTime + f.duration - t), r = n / f.duration || 0, s = 1 - r, o = 0, a = f.tweens.length;
            for (; o < a; o++)f.tweens[o].run(s);
            return u.notifyWith(e, [f, s, n]), s < 1 && a ? n : (u.resolveWith(e, [f]), !1)
        }, f = u.promise({
            elem: e,
            props: w.extend({}, t),
            opts: w.extend(!0, {specialEasing: {}}, n),
            originalProperties: t,
            originalOptions: n,
            startTime: Xn || Yn(),
            duration: n.duration,
            tweens: [],
            createTween: function (t, n) {
                var r = w.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
                return f.tweens.push(r), r
            },
            stop: function (t) {
                var n = 0, r = t ? f.tweens.length : 0;
                if (i)return this;
                i = !0;
                for (; n < r; n++)f.tweens[n].run(1);
                return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
            }
        }), l = f.props;
        tr(l, f.opts.specialEasing);
        for (; s < o; s++) {
            r = Qn[s].call(f, e, l, f.opts);
            if (r)return r
        }
        return w.map(l, Zn, f), w.isFunction(f.opts.start) && f.opts.start.call(e, f), w.fx.timer(w.extend(a, {
            elem: e,
            anim: f,
            queue: f.opts.queue
        })), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
    }

    function tr(e, t) {
        var n, r, i, s, o;
        for (n in e) {
            r = w.camelCase(n), i = t[r], s = e[n], w.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = w.cssHooks[r];
            if (o && "expand"in o) {
                s = o.expand(s), delete e[r];
                for (n in s)n in e || (e[n] = s[n], t[n] = i)
            } else t[r] = i
        }
    }

    function nr(e, t, n) {
        var r, i, s, o, u, a, f = this, l = {}, c = e.style, h = e.nodeType && nn(e), p = w._data(e, "fxshow");
        n.queue || (u = w._queueHooks(e, "fx"), u.unqueued == null && (u.unqueued = 0, a = u.empty.fire, u.empty.fire = function () {
            u.unqueued || a()
        }), u.unqueued++, f.always(function () {
            f.always(function () {
                u.unqueued--, w.queue(e, "fx").length || u.empty.fire()
            })
        })), e.nodeType === 1 && ("height"in t || "width"in t) && (n.overflow = [c.overflow, c.overflowX, c.overflowY], w.css(e, "display") === "inline" && w.css(e, "float") === "none" && (!w.support.inlineBlockNeedsLayout || an(e.nodeName) === "inline" ? c.display = "inline-block" : c.zoom = 1)), n.overflow && (c.overflow = "hidden", w.support.shrinkWrapBlocks || f.always(function () {
            c.overflow = n.overflow[0], c.overflowX = n.overflow[1], c.overflowY = n.overflow[2]
        }));
        for (r in t) {
            i = t[r];
            if ($n.exec(i)) {
                delete t[r], s = s || i === "toggle";
                if (i === (h ? "hide" : "show"))continue;
                l[r] = p && p[r] || w.style(e, r)
            }
        }
        if (!w.isEmptyObject(l)) {
            p ? "hidden"in p && (h = p.hidden) : p = w._data(e, "fxshow", {}), s && (p.hidden = !h), h ? w(e).show() : f.done(function () {
                w(e).hide()
            }), f.done(function () {
                var t;
                w._removeData(e, "fxshow");
                for (t in l)w.style(e, t, l[t])
            });
            for (r in l)o = Zn(h ? p[r] : 0, r, f), r in p || (p[r] = o.start, h && (o.end = o.start, o.start = r === "width" || r === "height" ? 1 : 0))
        }
    }

    function rr(e, t, n, r, i) {
        return new rr.prototype.init(e, t, n, r, i)
    }

    function ir(e, t) {
        var n, r = {height: e}, i = 0;
        t = t ? 1 : 0;
        for (; i < 4; i += 2 - t)n = Zt[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function sr(e) {
        return w.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
    }

    var n, r, i = typeof t, s = e.location, o = e.document, u = o.documentElement, a = e.jQuery, f = e.$, l = {}, c = [], h = "1.10.2", p = c.concat, d = c.push, v = c.slice, m = c.indexOf, g = l.toString, y = l.hasOwnProperty, b = h.trim, w = function (e, t) {
        return new w.fn.init(e, t, r)
    }, E = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, S = /\S+/g, x = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, T = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, N = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, C = /^[\],:{}\s]*$/, k = /(?:^|:|,)(?:\s*\[)+/g, L = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, A = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, O = /^-ms-/, M = /-([\da-z])/gi, _ = function (e, t) {
        return t.toUpperCase()
    }, D = function (e) {
        if (o.addEventListener || e.type === "load" || o.readyState === "complete")P(), w.ready()
    }, P = function () {
        o.addEventListener ? (o.removeEventListener("DOMContentLoaded", D, !1), e.removeEventListener("load", D, !1)) : (o.detachEvent("onreadystatechange", D), e.detachEvent("onload", D))
    };
    w.fn = w.prototype = {
        jquery: h, constructor: w, init: function (e, n, r) {
            var i, s;
            if (!e)return this;
            if (typeof e == "string") {
                e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? i = [null, e, null] : i = T.exec(e);
                if (i && (i[1] || !n)) {
                    if (i[1]) {
                        n = n instanceof w ? n[0] : n, w.merge(this, w.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : o, !0));
                        if (N.test(i[1]) && w.isPlainObject(n))for (i in n)w.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                        return this
                    }
                    s = o.getElementById(i[2]);
                    if (s && s.parentNode) {
                        if (s.id !== i[2])return r.find(e);
                        this.length = 1, this[0] = s
                    }
                    return this.context = o, this.selector = e, this
                }
                return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : w.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), w.makeArray(e, this))
        }, selector: "", length: 0, toArray: function () {
            return v.call(this)
        }, get: function (e) {
            return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
        }, pushStack: function (e) {
            var t = w.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        }, each: function (e, t) {
            return w.each(this, e, t)
        }, ready: function (e) {
            return w.ready.promise().done(e), this
        }, slice: function () {
            return this.pushStack(v.apply(this, arguments))
        }, first: function () {
            return this.eq(0)
        }, last: function () {
            return this.eq(-1)
        }, eq: function (e) {
            var t = this.length, n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        }, map: function (e) {
            return this.pushStack(w.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        }, end: function () {
            return this.prevObject || this.constructor(null)
        }, push: d, sort: [].sort, splice: [].splice
    }, w.fn.init.prototype = w.fn, w.extend = w.fn.extend = function () {
        var e, n, r, i, s, o, u = arguments[0] || {}, a = 1, f = arguments.length, l = !1;
        typeof u == "boolean" && (l = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !w.isFunction(u) && (u = {}), f === a && (u = this, --a);
        for (; a < f; a++)if ((s = arguments[a]) != null)for (i in s) {
            e = u[i], r = s[i];
            if (u === r)continue;
            l && r && (w.isPlainObject(r) || (n = w.isArray(r))) ? (n ? (n = !1, o = e && w.isArray(e) ? e : []) : o = e && w.isPlainObject(e) ? e : {}, u[i] = w.extend(l, o, r)) : r !== t && (u[i] = r)
        }
        return u
    }, w.extend({
        expando: "jQuery" + (h + Math.random()).replace(/\D/g, ""), noConflict: function (t) {
            return e.$ === w && (e.$ = f), t && e.jQuery === w && (e.jQuery = a), w
        }, isReady: !1, readyWait: 1, holdReady: function (e) {
            e ? w.readyWait++ : w.ready(!0)
        }, ready: function (e) {
            if (e === !0 ? --w.readyWait : w.isReady)return;
            if (!o.body)return setTimeout(w.ready);
            w.isReady = !0;
            if (e !== !0 && --w.readyWait > 0)return;
            n.resolveWith(o, [w]), w.fn.trigger && w(o).trigger("ready").off("ready")
        }, isFunction: function (e) {
            return w.type(e) === "function"
        }, isArray: Array.isArray || function (e) {
            return w.type(e) === "array"
        }, isWindow: function (e) {
            return e != null && e == e.window
        }, isNumeric: function (e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }, type: function (e) {
            return e == null ? String(e) : typeof e == "object" || typeof e == "function" ? l[g.call(e)] || "object" : typeof e
        }, isPlainObject: function (e) {
            var n;
            if (!e || w.type(e) !== "object" || e.nodeType || w.isWindow(e))return !1;
            try {
                if (e.constructor && !y.call(e, "constructor") && !y.call(e.constructor.prototype, "isPrototypeOf"))return !1
            } catch (r) {
                return !1
            }
            if (w.support.ownLast)for (n in e)return y.call(e, n);
            for (n in e);
            return n === t || y.call(e, n)
        }, isEmptyObject: function (e) {
            var t;
            for (t in e)return !1;
            return !0
        }, error: function (e) {
            throw new Error(e)
        }, parseHTML: function (e, t, n) {
            if (!e || typeof e != "string")return null;
            typeof t == "boolean" && (n = t, t = !1), t = t || o;
            var r = N.exec(e), i = !n && [];
            return r ? [t.createElement(r[1])] : (r = w.buildFragment([e], t, i), i && w(i).remove(), w.merge([], r.childNodes))
        }, parseJSON: function (t) {
            if (e.JSON && e.JSON.parse)return e.JSON.parse(t);
            if (t === null)return t;
            if (typeof t == "string") {
                t = w.trim(t);
                if (t && C.test(t.replace(L, "@").replace(A, "]").replace(k, "")))return (new Function("return " + t))()
            }
            w.error("Invalid JSON: " + t)
        }, parseXML: function (n) {
            var r, i;
            if (!n || typeof n != "string")return null;
            try {
                e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
            } catch (s) {
                r = t
            }
            return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && w.error("Invalid XML: " + n), r
        }, noop: function () {
        }, globalEval: function (t) {
            t && w.trim(t) && (e.execScript || function (t) {
                e.eval.call(e, t)
            })(t)
        }, camelCase: function (e) {
            return e.replace(O, "ms-").replace(M, _)
        }, nodeName: function (e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        }, each: function (e, t, n) {
            var r, i = 0, s = e.length, o = H(e);
            if (n)if (o)for (; i < s; i++) {
                r = t.apply(e[i], n);
                if (r === !1)break
            } else for (i in e) {
                r = t.apply(e[i], n);
                if (r === !1)break
            } else if (o)for (; i < s; i++) {
                r = t.call(e[i], i, e[i]);
                if (r === !1)break
            } else for (i in e) {
                r = t.call(e[i], i, e[i]);
                if (r === !1)break
            }
            return e
        }, trim: b && !b.call("??") ? function (e) {
            return e == null ? "" : b.call(e)
        } : function (e) {
            return e == null ? "" : (e + "").replace(x, "")
        }, makeArray: function (e, t) {
            var n = t || [];
            return e != null && (H(Object(e)) ? w.merge(n, typeof e == "string" ? [e] : e) : d.call(n, e)), n
        }, inArray: function (e, t, n) {
            var r;
            if (t) {
                if (m)return m.call(t, e, n);
                r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
                for (; n < r; n++)if (n in t && t[n] === e)return n
            }
            return -1
        }, merge: function (e, n) {
            var r = n.length, i = e.length, s = 0;
            if (typeof r == "number")for (; s < r; s++)e[i++] = n[s]; else while (n[s] !== t)e[i++] = n[s++];
            return e.length = i, e
        }, grep: function (e, t, n) {
            var r, i = [], s = 0, o = e.length;
            n = !!n;
            for (; s < o; s++)r = !!t(e[s], s), n !== r && i.push(e[s]);
            return i
        }, map: function (e, t, n) {
            var r, i = 0, s = e.length, o = H(e), u = [];
            if (o)for (; i < s; i++)r = t(e[i], i, n), r != null && (u[u.length] = r); else for (i in e)r = t(e[i], i, n), r != null && (u[u.length] = r);
            return p.apply([], u)
        }, guid: 1, proxy: function (e, n) {
            var r, i, s;
            return typeof n == "string" && (s = e[n], n = e, e = s), w.isFunction(e) ? (r = v.call(arguments, 2), i = function () {
                return e.apply(n || this, r.concat(v.call(arguments)))
            }, i.guid = e.guid = e.guid || w.guid++, i) : t
        }, access: function (e, n, r, i, s, o, u) {
            var a = 0, f = e.length, l = r == null;
            if (w.type(r) === "object") {
                s = !0;
                for (a in r)w.access(e, n, a, r[a], !0, o, u)
            } else if (i !== t) {
                s = !0, w.isFunction(i) || (u = !0), l && (u ? (n.call(e, i), n = null) : (l = n, n = function (e, t, n) {
                    return l.call(w(e), n)
                }));
                if (n)for (; a < f; a++)n(e[a], r, u ? i : i.call(e[a], a, n(e[a], r)))
            }
            return s ? e : l ? n.call(e) : f ? n(e[0], r) : o
        }, now: function () {
            return (new Date).getTime()
        }, swap: function (e, t, n, r) {
            var i, s, o = {};
            for (s in t)o[s] = e.style[s], e.style[s] = t[s];
            i = n.apply(e, r || []);
            for (s in t)e.style[s] = o[s];
            return i
        }
    }), w.ready.promise = function (t) {
        if (!n) {
            n = w.Deferred();
            if (o.readyState === "complete")setTimeout(w.ready); else if (o.addEventListener)o.addEventListener("DOMContentLoaded", D, !1), e.addEventListener("load", D, !1); else {
                o.attachEvent("onreadystatechange", D), e.attachEvent("onload", D);
                var r = !1;
                try {
                    r = e.frameElement == null && o.documentElement
                } catch (i) {
                }
                r && r.doScroll && function s() {
                    if (!w.isReady) {
                        try {
                            r.doScroll("left")
                        } catch (e) {
                            return setTimeout(s, 50)
                        }
                        P(), w.ready()
                    }
                }()
            }
        }
        return n.promise(t)
    }, w.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
        l["[object " + t + "]"] = t.toLowerCase()
    }), r = w(o), function (e, t) {
        function ot(e, t, n, i) {
            var s, o, u, a, f, l, p, m, g, w;
            (t ? t.ownerDocument || t : E) !== h && c(t), t = t || h, n = n || [];
            if (!e || typeof e != "string")return n;
            if ((a = t.nodeType) !== 1 && a !== 9)return [];
            if (d && !i) {
                if (s = Z.exec(e))if (u = s[1]) {
                    if (a === 9) {
                        o = t.getElementById(u);
                        if (!o || !o.parentNode)return n;
                        if (o.id === u)return n.push(o), n
                    } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(u)) && y(t, o) && o.id === u)return n.push(o), n
                } else {
                    if (s[2])return H.apply(n, t.getElementsByTagName(e)), n;
                    if ((u = s[3]) && r.getElementsByClassName && t.getElementsByClassName)return H.apply(n, t.getElementsByClassName(u)), n
                }
                if (r.qsa && (!v || !v.test(e))) {
                    m = p = b, g = t, w = a === 9 && e;
                    if (a === 1 && t.nodeName.toLowerCase() !== "object") {
                        l = mt(e), (p = t.getAttribute("id")) ? m = p.replace(nt, "\\$&") : t.setAttribute("id", m), m = "[id='" + m + "'] ", f = l.length;
                        while (f--)l[f] = m + gt(l[f]);
                        g = $.test(e) && t.parentNode || t, w = l.join(",")
                    }
                    if (w)try {
                        return H.apply(n, g.querySelectorAll(w)), n
                    } catch (S) {
                    } finally {
                        p || t.removeAttribute("id")
                    }
                }
            }
            return Nt(e.replace(W, "$1"), t, n, i)
        }

        function ut() {
            function t(n, r) {
                return e.push(n += " ") > s.cacheLength && delete t[e.shift()], t[n] = r
            }

            var e = [];
            return t
        }

        function at(e) {
            return e[b] = !0, e
        }

        function ft(e) {
            var t = h.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function lt(e, t) {
            var n = e.split("|"), r = e.length;
            while (r--)s.attrHandle[n[r]] = t
        }

        function ct(e, t) {
            var n = t && e, r = n && e.nodeType === 1 && t.nodeType === 1 && (~t.sourceIndex || O) - (~e.sourceIndex || O);
            if (r)return r;
            if (n)while (n = n.nextSibling)if (n === t)return -1;
            return e ? 1 : -1
        }

        function ht(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return n === "input" && t.type === e
            }
        }

        function pt(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return (n === "input" || n === "button") && t.type === e
            }
        }

        function dt(e) {
            return at(function (t) {
                return t = +t, at(function (n, r) {
                    var i, s = e([], n.length, t), o = s.length;
                    while (o--)n[i = s[o]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function vt() {
        }

        function mt(e, t) {
            var n, r, i, o, u, a, f, l = N[e + " "];
            if (l)return t ? 0 : l.slice(0);
            u = e, a = [], f = s.preFilter;
            while (u) {
                if (!n || (r = X.exec(u)))r && (u = u.slice(r[0].length) || u), a.push(i = []);
                n = !1;
                if (r = V.exec(u))n = r.shift(), i.push({value: n, type: r[0].replace(W, " ")}), u = u.slice(n.length);
                for (o in s.filter)(r = G[o].exec(u)) && (!f[o] || (r = f[o](r))) && (n = r.shift(), i.push({
                    value: n,
                    type: o,
                    matches: r
                }), u = u.slice(n.length));
                if (!n)break
            }
            return t ? u.length : u ? ot.error(e) : N(e, a).slice(0)
        }

        function gt(e) {
            var t = 0, n = e.length, r = "";
            for (; t < n; t++)r += e[t].value;
            return r
        }

        function yt(e, t, n) {
            var r = t.dir, s = n && r === "parentNode", o = x++;
            return t.first ? function (t, n, i) {
                while (t = t[r])if (t.nodeType === 1 || s)return e(t, n, i)
            } : function (t, n, u) {
                var a, f, l, c = S + " " + o;
                if (u) {
                    while (t = t[r])if (t.nodeType === 1 || s)if (e(t, n, u))return !0
                } else while (t = t[r])if (t.nodeType === 1 || s) {
                    l = t[b] || (t[b] = {});
                    if ((f = l[r]) && f[0] === c) {
                        if ((a = f[1]) === !0 || a === i)return a === !0
                    } else {
                        f = l[r] = [c], f[1] = e(t, n, u) || i;
                        if (f[1] === !0)return !0
                    }
                }
            }
        }

        function bt(e) {
            return e.length > 1 ? function (t, n, r) {
                var i = e.length;
                while (i--)if (!e[i](t, n, r))return !1;
                return !0
            } : e[0]
        }

        function wt(e, t, n, r, i) {
            var s, o = [], u = 0, a = e.length, f = t != null;
            for (; u < a; u++)if (s = e[u])if (!n || n(s, r, i))o.push(s), f && t.push(u);
            return o
        }

        function Et(e, t, n, r, i, s) {
            return r && !r[b] && (r = Et(r)), i && !i[b] && (i = Et(i, s)), at(function (s, o, u, a) {
                var f, l, c, h = [], p = [], d = o.length, v = s || Tt(t || "*", u.nodeType ? [u] : u, []), m = e && (s || !t) ? wt(v, h, e, u, a) : v, g = n ? i || (s ? e : d || r) ? [] : o : m;
                n && n(m, g, u, a);
                if (r) {
                    f = wt(g, p), r(f, [], u, a), l = f.length;
                    while (l--)if (c = f[l])g[p[l]] = !(m[p[l]] = c)
                }
                if (s) {
                    if (i || e) {
                        if (i) {
                            f = [], l = g.length;
                            while (l--)(c = g[l]) && f.push(m[l] = c);
                            i(null, g = [], f, a)
                        }
                        l = g.length;
                        while (l--)(c = g[l]) && (f = i ? j.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
                    }
                } else g = wt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : H.apply(o, g)
            })
        }

        function St(e) {
            var t, n, r, i = e.length, o = s.relative[e[0].type], u = o || s.relative[" "], a = o ? 1 : 0, l = yt(function (e) {
                return e === t
            }, u, !0), c = yt(function (e) {
                return j.call(t, e) > -1
            }, u, !0), h = [function (e, n, r) {
                return !o && (r || n !== f) || ((t = n).nodeType ? l(e, n, r) : c(e, n, r))
            }];
            for (; a < i; a++)if (n = s.relative[e[a].type])h = [yt(bt(h), n)]; else {
                n = s.filter[e[a].type].apply(null, e[a].matches);
                if (n[b]) {
                    r = ++a;
                    for (; r < i; r++)if (s.relative[e[r].type])break;
                    return Et(a > 1 && bt(h), a > 1 && gt(e.slice(0, a - 1).concat({value: e[a - 2].type === " " ? "*" : ""})).replace(W, "$1"), n, a < r && St(e.slice(a, r)), r < i && St(e = e.slice(r)), r < i && gt(e))
                }
                h.push(n)
            }
            return bt(h)
        }

        function xt(e, t) {
            var n = 0, r = t.length > 0, o = e.length > 0, u = function (u, a, l, c, p) {
                var d, v, m, g = [], y = 0, b = "0", w = u && [], E = p != null, x = f, T = u || o && s.find.TAG("*", p && a.parentNode || a), N = S += x == null ? 1 : Math.random() || .1;
                E && (f = a !== h && a, i = n);
                for (; (d = T[b]) != null; b++) {
                    if (o && d) {
                        v = 0;
                        while (m = e[v++])if (m(d, a, l)) {
                            c.push(d);
                            break
                        }
                        E && (S = N, i = ++n)
                    }
                    r && ((d = !m && d) && y--, u && w.push(d))
                }
                y += b;
                if (r && b !== y) {
                    v = 0;
                    while (m = t[v++])m(w, g, a, l);
                    if (u) {
                        if (y > 0)while (b--)!w[b] && !g[b] && (g[b] = D.call(c));
                        g = wt(g)
                    }
                    H.apply(c, g), E && !u && g.length > 0 && y + t.length > 1 && ot.uniqueSort(c)
                }
                return E && (S = N, f = x), w
            };
            return r ? at(u) : u
        }

        function Tt(e, t, n) {
            var r = 0, i = t.length;
            for (; r < i; r++)ot(e, t[r], n);
            return n
        }

        function Nt(e, t, n, i) {
            var o, u, f, l, c, h = mt(e);
            if (!i && h.length === 1) {
                u = h[0] = h[0].slice(0);
                if (u.length > 2 && (f = u[0]).type === "ID" && r.getById && t.nodeType === 9 && d && s.relative[u[1].type]) {
                    t = (s.find.ID(f.matches[0].replace(rt, it), t) || [])[0];
                    if (!t)return n;
                    e = e.slice(u.shift().value.length)
                }
                o = G.needsContext.test(e) ? 0 : u.length;
                while (o--) {
                    f = u[o];
                    if (s.relative[l = f.type])break;
                    if (c = s.find[l])if (i = c(f.matches[0].replace(rt, it), $.test(u[0].type) && t.parentNode || t)) {
                        u.splice(o, 1), e = i.length && gt(u);
                        if (!e)return H.apply(n, i), n;
                        break
                    }
                }
            }
            return a(e, h)(i, t, !d, n, $.test(e)), n
        }

        var n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b = "sizzle" + -(new Date), E = e.document, S = 0, x = 0, T = ut(), N = ut(), C = ut(), k = !1, L = function (e, t) {
            return e === t ? (k = !0, 0) : 0
        }, A = typeof t, O = 1 << 31, M = {}.hasOwnProperty, _ = [], D = _.pop, P = _.push, H = _.push, B = _.slice, j = _.indexOf || function (e) {
                var t = 0, n = this.length;
                for (; t < n; t++)if (this[t] === e)return t;
                return -1
            }, F = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", I = "[\\x20\\t\\r\\n\\f]", q = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", R = q.replace("w", "w#"), U = "\\[" + I + "*(" + q + ")" + I + "*(?:([*^$|!~]?=)" + I + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + R + ")|)|)" + I + "*\\]", z = ":(" + q + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + U.replace(3, 8) + ")*)|.*)\\)|)", W = new RegExp("^" + I + "+|((?:^|[^\\\\])(?:\\\\.)*)" + I + "+$", "g"), X = new RegExp("^" + I + "*," + I + "*"), V = new RegExp("^" + I + "*([>+~]|" + I + ")" + I + "*"), $ = new RegExp(I + "*[+~]"), J = new RegExp("=" + I + "*([^\\]'\"]*)" + I + "*\\]", "g"), K = new RegExp(z), Q = new RegExp("^" + R + "$"), G = {
            ID: new RegExp("^#(" + q + ")"),
            CLASS: new RegExp("^\\.(" + q + ")"),
            TAG: new RegExp("^(" + q.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + U),
            PSEUDO: new RegExp("^" + z),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + I + "*(even|odd|(([+-]|)(\\d*)n|)" +
                I + "*(?:([+-]|)" + I + "*(\\d+)|))" + I + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + F + ")$", "i"),
            needsContext: new RegExp("^" + I + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + I + "*((?:-\\d)?\\d*)" + I + "*\\)|)(?=[^-]|$)", "i")
        }, Y = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, nt = /'|\\/g, rt = new RegExp("\\\\([\\da-f]{1,6}" + I + "?|(" + I + ")|.)", "ig"), it = function (e, t, n) {
            var r = "0x" + t - 65536;
            return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, r & 1023 | 56320)
        };
        try {
            H.apply(_ = B.call(E.childNodes), E.childNodes), _[E.childNodes.length].nodeType
        } catch (st) {
            H = {
                apply: _.length ? function (e, t) {
                    P.apply(e, B.call(t))
                } : function (e, t) {
                    var n = e.length, r = 0;
                    while (e[n++] = t[r++]);
                    e.length = n - 1
                }
            }
        }
        u = ot.isXML = function (e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? t.nodeName !== "HTML" : !1
        }, r = ot.support = {}, c = ot.setDocument = function (e) {
            var t = e ? e.ownerDocument || e : E, n = t.defaultView;
            if (t === h || t.nodeType !== 9 || !t.documentElement)return h;
            h = t, p = t.documentElement, d = !u(t), n && n.attachEvent && n !== n.top && n.attachEvent("onbeforeunload", function () {
                c()
            }), r.attributes = ft(function (e) {
                return e.className = "i", !e.getAttribute("className")
            }), r.getElementsByTagName = ft(function (e) {
                return e.appendChild(t.createComment("")), !e.getElementsByTagName("*").length
            }), r.getElementsByClassName = ft(function (e) {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", e.getElementsByClassName("i").length === 2
            }), r.getById = ft(function (e) {
                return p.appendChild(e).id = b, !t.getElementsByName || !t.getElementsByName(b).length
            }), r.getById ? (s.find.ID = function (e, t) {
                if (typeof t.getElementById !== A && d) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, s.filter.ID = function (e) {
                var t = e.replace(rt, it);
                return function (e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete s.find.ID, s.filter.ID = function (e) {
                var t = e.replace(rt, it);
                return function (e) {
                    var n = typeof e.getAttributeNode !== A && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), s.find.TAG = r.getElementsByTagName ? function (e, t) {
                if (typeof t.getElementsByTagName !== A)return t.getElementsByTagName(e)
            } : function (e, t) {
                var n, r = [], i = 0, s = t.getElementsByTagName(e);
                if (e === "*") {
                    while (n = s[i++])n.nodeType === 1 && r.push(n);
                    return r
                }
                return s
            }, s.find.CLASS = r.getElementsByClassName && function (e, t) {
                    if (typeof t.getElementsByClassName !== A && d)return t.getElementsByClassName(e)
                }, m = [], v = [];
            if (r.qsa = Y.test(t.querySelectorAll))ft(function (e) {
                e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || v.push("\\[" + I + "*(?:value|" + F + ")"), e.querySelectorAll(":checked").length || v.push(":checked")
            }), ft(function (e) {
                var n = t.createElement("input");
                n.setAttribute("type", "hidden"), e.appendChild(n).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && v.push("[*^$]=" + I + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:")
            });
            return (r.matchesSelector = Y.test(g = p.webkitMatchesSelector || p.mozMatchesSelector || p.oMatchesSelector || p.msMatchesSelector)) && ft(function (e) {
                r.disconnectedMatch = g.call(e, "div"), g.call(e, "[s!='']:x"), m.push("!=", z)
            }), v = v.length && new RegExp(v.join("|")), m = m.length && new RegExp(m.join("|")), y = Y.test(p.contains) || p.compareDocumentPosition ? function (e, t) {
                var n = e.nodeType === 9 ? e.documentElement : e, r = t && t.parentNode;
                return e === r || !!r && r.nodeType === 1 && !!(n.contains ? n.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16)
            } : function (e, t) {
                if (t)while (t = t.parentNode)if (t === e)return !0;
                return !1
            }, L = p.compareDocumentPosition ? function (e, n) {
                if (e === n)return k = !0, 0;
                var i = n.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(n);
                if (i)return i & 1 || !r.sortDetached && n.compareDocumentPosition(e) === i ? e === t || y(E, e) ? -1 : n === t || y(E, n) ? 1 : l ? j.call(l, e) - j.call(l, n) : 0 : i & 4 ? -1 : 1;
                return e.compareDocumentPosition ? -1 : 1
            } : function (e, n) {
                var r, i = 0, s = e.parentNode, o = n.parentNode, u = [e], a = [n];
                if (e === n)return k = !0, 0;
                if (!s || !o)return e === t ? -1 : n === t ? 1 : s ? -1 : o ? 1 : l ? j.call(l, e) - j.call(l, n) : 0;
                if (s === o)return ct(e, n);
                r = e;
                while (r = r.parentNode)u.unshift(r);
                r = n;
                while (r = r.parentNode)a.unshift(r);
                while (u[i] === a[i])i++;
                return i ? ct(u[i], a[i]) : u[i] === E ? -1 : a[i] === E ? 1 : 0
            }, t
        }, ot.matches = function (e, t) {
            return ot(e, null, null, t)
        }, ot.matchesSelector = function (e, t) {
            (e.ownerDocument || e) !== h && c(e), t = t.replace(J, "='$1']");
            if (r.matchesSelector && d && (!m || !m.test(t)) && (!v || !v.test(t)))try {
                var n = g.call(e, t);
                if (n || r.disconnectedMatch || e.document && e.document.nodeType !== 11)return n
            } catch (i) {
            }
            return ot(t, h, null, [e]).length > 0
        }, ot.contains = function (e, t) {
            return (e.ownerDocument || e) !== h && c(e), y(e, t)
        }, ot.attr = function (e, n) {
            (e.ownerDocument || e) !== h && c(e);
            var i = s.attrHandle[n.toLowerCase()], o = i && M.call(s.attrHandle, n.toLowerCase()) ? i(e, n, !d) : t;
            return o === t ? r.attributes || !d ? e.getAttribute(n) : (o = e.getAttributeNode(n)) && o.specified ? o.value : null : o
        }, ot.error = function (e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, ot.uniqueSort = function (e) {
            var t, n = [], i = 0, s = 0;
            k = !r.detectDuplicates, l = !r.sortStable && e.slice(0), e.sort(L);
            if (k) {
                while (t = e[s++])t === e[s] && (i = n.push(s));
                while (i--)e.splice(n[i], 1)
            }
            return e
        }, o = ot.getText = function (e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (!i)for (; t = e[r]; r++)n += o(t); else if (i === 1 || i === 9 || i === 11) {
                if (typeof e.textContent == "string")return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling)n += o(e)
            } else if (i === 3 || i === 4)return e.nodeValue;
            return n
        }, s = ot.selectors = {
            cacheLength: 50,
            createPseudo: at,
            match: G,
            attrHandle: {},
            find: {},
            relative: {
                ">": {dir: "parentNode", first: !0},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: !0},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                ATTR: function (e) {
                    return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                }, CHILD: function (e) {
                    return e[1] = e[1].toLowerCase(), e[1].slice(0, 3) === "nth" ? (e[3] || ot.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd")), e[5] = +(e[7] + e[8] || e[3] === "odd")) : e[3] && ot.error(e[0]), e
                }, PSEUDO: function (e) {
                    var n, r = !e[5] && e[2];
                    return G.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && K.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function (e) {
                    var t = e.replace(rt, it).toLowerCase();
                    return e === "*" ? function () {
                        return !0
                    } : function (e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                }, CLASS: function (e) {
                    var t = T[e + " "];
                    return t || (t = new RegExp("(^|" + I + ")" + e + "(" + I + "|$)")) && T(e, function (e) {
                            return t.test(typeof e.className == "string" && e.className || typeof e.getAttribute !== A && e.getAttribute("class") || "")
                        })
                }, ATTR: function (e, t, n) {
                    return function (r) {
                        var i = ot.attr(r, e);
                        return i == null ? t === "!=" : t ? (i += "", t === "=" ? i === n : t === "!=" ? i !== n : t === "^=" ? n && i.indexOf(n) === 0 : t === "*=" ? n && i.indexOf(n) > -1 : t === "$=" ? n && i.slice(-n.length) === n : t === "~=" ? (" " + i + " ").indexOf(n) > -1 : t === "|=" ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                    }
                }, CHILD: function (e, t, n, r, i) {
                    var s = e.slice(0, 3) !== "nth", o = e.slice(-4) !== "last", u = t === "of-type";
                    return r === 1 && i === 0 ? function (e) {
                        return !!e.parentNode
                    } : function (t, n, a) {
                        var f, l, c, h, p, d, v = s !== o ? "nextSibling" : "previousSibling", m = t.parentNode, g = u && t.nodeName.toLowerCase(), y = !a && !u;
                        if (m) {
                            if (s) {
                                while (v) {
                                    c = t;
                                    while (c = c[v])if (u ? c.nodeName.toLowerCase() === g : c.nodeType === 1)return !1;
                                    d = v = e === "only" && !d && "nextSibling"
                                }
                                return !0
                            }
                            d = [o ? m.firstChild : m.lastChild];
                            if (o && y) {
                                l = m[b] || (m[b] = {}), f = l[e] || [], p = f[0] === S && f[1], h = f[0] === S && f[2], c = p && m.childNodes[p];
                                while (c = ++p && c && c[v] || (h = p = 0) || d.pop())if (c.nodeType === 1 && ++h && c === t) {
                                    l[e] = [S, p, h];
                                    break
                                }
                            } else if (y && (f = (t[b] || (t[b] = {}))[e]) && f[0] === S)h = f[1]; else while (c = ++p && c && c[v] || (h = p = 0) || d.pop())if ((u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) && ++h) {
                                y && ((c[b] || (c[b] = {}))[e] = [S, h]);
                                if (c === t)break
                            }
                            return h -= i, h === r || h % r === 0 && h / r >= 0
                        }
                    }
                }, PSEUDO: function (e, t) {
                    var n, r = s.pseudos[e] || s.setFilters[e.toLowerCase()] || ot.error("unsupported pseudo: " + e);
                    return r[b] ? r(t) : r.length > 1 ? (n = [e, e, "", t], s.setFilters.hasOwnProperty(e.toLowerCase()) ? at(function (e, n) {
                        var i, s = r(e, t), o = s.length;
                        while (o--)i = j.call(e, s[o]), e[i] = !(n[i] = s[o])
                    }) : function (e) {
                        return r(e, 0, n)
                    }) : r
                }
            },
            pseudos: {
                not: at(function (e) {
                    var t = [], n = [], r = a(e.replace(W, "$1"));
                    return r[b] ? at(function (e, t, n, i) {
                        var s, o = r(e, null, i, []), u = e.length;
                        while (u--)if (s = o[u])e[u] = !(t[u] = s)
                    }) : function (e, i, s) {
                        return t[0] = e, r(t, null, s, n), !n.pop()
                    }
                }), has: at(function (e) {
                    return function (t) {
                        return ot(e, t).length > 0
                    }
                }), contains: at(function (e) {
                    return function (t) {
                        return (t.textContent || t.innerText || o(t)).indexOf(e) > -1
                    }
                }), lang: at(function (e) {
                    return Q.test(e || "") || ot.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), function (t) {
                        var n;
                        do if (n = d ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))return n = n.toLowerCase(), n === e || n.indexOf(e + "-") === 0; while ((t = t.parentNode) && t.nodeType === 1);
                        return !1
                    }
                }), target: function (t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                }, root: function (e) {
                    return e === p
                }, focus: function (e) {
                    return e === h.activeElement && (!h.hasFocus || h.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                }, enabled: function (e) {
                    return e.disabled === !1
                }, disabled: function (e) {
                    return e.disabled === !0
                }, checked: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return t === "input" && !!e.checked || t === "option" && !!e.selected
                }, selected: function (e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                }, empty: function (e) {
                    for (e = e.firstChild; e; e = e.nextSibling)if (e.nodeName > "@" || e.nodeType === 3 || e.nodeType === 4)return !1;
                    return !0
                }, parent: function (e) {
                    return !s.pseudos.empty(e)
                }, header: function (e) {
                    return tt.test(e.nodeName)
                }, input: function (e) {
                    return et.test(e.nodeName)
                }, button: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return t === "input" && e.type === "button" || t === "button"
                }, text: function (e) {
                    var t;
                    return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === e.type)
                }, first: dt(function () {
                    return [0]
                }), last: dt(function (e, t) {
                    return [t - 1]
                }), eq: dt(function (e, t, n) {
                    return [n < 0 ? n + t : n]
                }), even: dt(function (e, t) {
                    var n = 0;
                    for (; n < t; n += 2)e.push(n);
                    return e
                }), odd: dt(function (e, t) {
                    var n = 1;
                    for (; n < t; n += 2)e.push(n);
                    return e
                }), lt: dt(function (e, t, n) {
                    var r = n < 0 ? n + t : n;
                    for (; --r >= 0;)e.push(r);
                    return e
                }), gt: dt(function (e, t, n) {
                    var r = n < 0 ? n + t : n;
                    for (; ++r < t;)e.push(r);
                    return e
                })
            }
        }, s.pseudos.nth = s.pseudos.eq;
        for (n in{radio: !0, checkbox: !0, file: !0, password: !0, image: !0})s.pseudos[n] = ht(n);
        for (n in{submit: !0, reset: !0})s.pseudos[n] = pt(n);
        vt.prototype = s.filters = s.pseudos, s.setFilters = new vt, a = ot.compile = function (e, t) {
            var n, r = [], i = [], s = C[e + " "];
            if (!s) {
                t || (t = mt(e)), n = t.length;
                while (n--)s = St(t[n]), s[b] ? r.push(s) : i.push(s);
                s = C(e, xt(i, r))
            }
            return s
        }, r.sortStable = b.split("").sort(L).join("") === b, r.detectDuplicates = k, c(), r.sortDetached = ft(function (e) {
            return e.compareDocumentPosition(h.createElement("div")) & 1
        }), ft(function (e) {
            return e.innerHTML = "<a href='#'></a>", e.firstChild.getAttribute("href") === "#"
        }) || lt("type|href|height|width", function (e, t, n) {
            if (!n)return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2)
        }), (!r.attributes || !ft(function (e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), e.firstChild.getAttribute("value") === ""
        })) && lt("value", function (e, t, n) {
            if (!n && e.nodeName.toLowerCase() === "input")return e.defaultValue
        }), ft(function (e) {
            return e.getAttribute("disabled") == null
        }) || lt(F, function (e, t, n) {
            var r;
            if (!n)return (r = e.getAttributeNode(t)) && r.specified ? r.value : e[t] === !0 ? t.toLowerCase() : null
        }), w.find = ot, w.expr = ot.selectors, w.expr[":"] = w.expr.pseudos, w.unique = ot.uniqueSort, w.text = ot.getText, w.isXMLDoc = ot.isXML, w.contains = ot.contains
    }(e);
    var B = {};
    w.Callbacks = function (e) {
        e = typeof e == "string" ? B[e] || j(e) : w.extend({}, e);
        var n, r, i, s, o, u, a = [], f = !e.once && [], l = function (t) {
            r = e.memory && t, i = !0, o = u || 0, u = 0, s = a.length, n = !0;
            for (; a && o < s; o++)if (a[o].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                r = !1;
                break
            }
            n = !1, a && (f ? f.length && l(f.shift()) : r ? a = [] : c.disable())
        }, c = {
            add: function () {
                if (a) {
                    var t = a.length;
                    (function i(t) {
                        w.each(t, function (t, n) {
                            var r = w.type(n);
                            r === "function" ? (!e.unique || !c.has(n)) && a.push(n) : n && n.length && r !== "string" && i(n)
                        })
                    })(arguments), n ? s = a.length : r && (u = t, l(r))
                }
                return this
            }, remove: function () {
                return a && w.each(arguments, function (e, t) {
                    var r;
                    while ((r = w.inArray(t, a, r)) > -1)a.splice(r, 1), n && (r <= s && s--, r <= o && o--)
                }), this
            }, has: function (e) {
                return e ? w.inArray(e, a) > -1 : !!a && !!a.length
            }, empty: function () {
                return a = [], s = 0, this
            }, disable: function () {
                return a = f = r = t, this
            }, disabled: function () {
                return !a
            }, lock: function () {
                return f = t, r || c.disable(), this
            }, locked: function () {
                return !f
            }, fireWith: function (e, t) {
                return a && (!i || f) && (t = t || [], t = [e, t.slice ? t.slice() : t], n ? f.push(t) : l(t)), this
            }, fire: function () {
                return c.fireWith(this, arguments), this
            }, fired: function () {
                return !!i
            }
        };
        return c
    }, w.extend({
        Deferred: function (e) {
            var t = [["resolve", "done", w.Callbacks("once memory"), "resolved"], ["reject", "fail", w.Callbacks("once memory"), "rejected"], ["notify", "progress", w.Callbacks("memory")]], n = "pending", r = {
                state: function () {
                    return n
                }, always: function () {
                    return i.done(arguments).fail(arguments), this
                }, then: function () {
                    var e = arguments;
                    return w.Deferred(function (n) {
                        w.each(t, function (t, s) {
                            var o = s[0], u = w.isFunction(e[t]) && e[t];
                            i[s[1]](function () {
                                var e = u && u.apply(this, arguments);
                                e && w.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o + "With"](this === r ? n.promise() : this, u ? [e] : arguments)
                            })
                        }), e = null
                    }).promise()
                }, promise: function (e) {
                    return e != null ? w.extend(e, r) : r
                }
            }, i = {};
            return r.pipe = r.then, w.each(t, function (e, s) {
                var o = s[2], u = s[3];
                r[s[1]] = o.add, u && o.add(function () {
                    n = u
                }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = function () {
                    return i[s[0] + "With"](this === i ? r : this, arguments), this
                }, i[s[0] + "With"] = o.fireWith
            }), r.promise(i), e && e.call(i, i), i
        }, when: function (e) {
            var t = 0, n = v.call(arguments), r = n.length, i = r !== 1 || e && w.isFunction(e.promise) ? r : 0, s = i === 1 ? e : w.Deferred(), o = function (e, t, n) {
                return function (r) {
                    t[e] = this, n[e] = arguments.length > 1 ? v.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
                }
            }, u, a, f;
            if (r > 1) {
                u = new Array(r), a = new Array(r), f = new Array(r);
                for (; t < r; t++)n[t] && w.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
            }
            return i || s.resolveWith(f, n), s.promise()
        }
    }), w.support = function (t) {
        var n, r, s, u, a, f, l, c, h, p = o.createElement("div");
        p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = p.getElementsByTagName("*") || [], r = p.getElementsByTagName("a")[0];
        if (!r || !r.style || !n.length)return t;
        u = o.createElement("select"), f = u.appendChild(o.createElement("option")), s = p.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = p.className !== "t", t.leadingWhitespace = p.firstChild.nodeType === 3, t.tbody = !p.getElementsByTagName("tbody").length, t.htmlSerialize = !!p.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = r.getAttribute("href") === "/a", t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !!r.style.cssFloat, t.checkOn = !!s.value, t.optSelected = f.selected, t.enctype = !!o.createElement("form").enctype, t.html5Clone = o.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, s.checked = !0, t.noCloneChecked = s.cloneNode(!0).checked, u.disabled = !0, t.optDisabled = !f.disabled;
        try {
            delete p.test
        } catch (d) {
            t.deleteExpando = !1
        }
        s = o.createElement("input"), s.setAttribute("value", ""), t.input = s.getAttribute("value") === "", s.value = "t", s.setAttribute("type", "radio"), t.radioValue = s.value === "t", s.setAttribute("checked", "t"), s.setAttribute("name", "t"), a = o.createDocumentFragment(), a.appendChild(s), t.appendChecked = s.checked, t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, p.attachEvent && (p.attachEvent("onclick", function () {
            t.noCloneEvent = !1
        }), p.cloneNode(!0).click());
        for (h in{
            submit: !0,
            change: !0,
            focusin: !0
        })p.setAttribute(l = "on" + h, "t"), t[h + "Bubbles"] = l in e || p.attributes[l].expando === !1;
        p.style.backgroundClip = "content-box", p.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = p.style.backgroundClip === "content-box";
        for (h in w(t))break;
        return t.ownLast = h !== "0", w(function () {
            var n, r, s, u = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", a = o.getElementsByTagName("body")[0];
            if (!a)return;
            n = o.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", a.appendChild(n).appendChild(p), p.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", s = p.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = s[0].offsetHeight === 0, s[0].style.display = "", s[1].style.display = "none", t.reliableHiddenOffsets = c && s[0].offsetHeight === 0, p.innerHTML = "", p.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", w.swap(a, a.style.zoom != null ? {zoom: 1} : {}, function () {
                t.boxSizing = p.offsetWidth === 4
            }), e.getComputedStyle && (t.pixelPosition = (e.getComputedStyle(p, null) || {}).top !== "1%", t.boxSizingReliable = (e.getComputedStyle(p, null) || {width: "4px"}).width === "4px", r = p.appendChild(o.createElement("div")), r.style.cssText = p.style.cssText = u, r.style.marginRight = r.style.width = "0", p.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof p.style.zoom !== i && (p.innerHTML = "", p.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.innerHTML = "<div></div>", p.firstChild.style.width = "5px", t.shrinkWrapBlocks = p.offsetWidth !== 3, t.inlineBlockNeedsLayout && (a.style.zoom = 1)), a.removeChild(n), n = p = s = r = null
        }), n = u = a = f = r = s = null, t
    }({});
    var F = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, I = /([A-Z])/g;
    w.extend({
        cache: {},
        noData: {applet: !0, embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},
        hasData: function (e) {
            return e = e.nodeType ? w.cache[e[w.expando]] : e[w.expando], !!e && !z(e)
        },
        data: function (e, t, n) {
            return q(e, t, n)
        },
        removeData: function (e, t) {
            return R(e, t)
        },
        _data: function (e, t, n) {
            return q(e, t, n, !0)
        },
        _removeData: function (e, t) {
            return R(e, t, !0)
        },
        acceptData: function (e) {
            if (e.nodeType && e.nodeType !== 1 && e.nodeType !== 9)return !1;
            var t = e.nodeName && w.noData[e.nodeName.toLowerCase()];
            return !t || t !== !0 && e.getAttribute("classid") === t
        }
    }), w.fn.extend({
        data: function (e, n) {
            var r, i, s = null, o = 0, u = this[0];
            if (e === t) {
                if (this.length) {
                    s = w.data(u);
                    if (u.nodeType === 1 && !w._data(u, "parsedAttrs")) {
                        r = u.attributes;
                        for (; o < r.length; o++)i = r[o].name, i.indexOf("data-") === 0 && (i = w.camelCase(i.slice(5)), U(u, i, s[i]));
                        w._data(u, "parsedAttrs", !0)
                    }
                }
                return s
            }
            return typeof e == "object" ? this.each(function () {
                w.data(this, e)
            }) : arguments.length > 1 ? this.each(function () {
                w.data(this, e, n)
            }) : u ? U(u, e, w.data(u, e)) : null
        }, removeData: function (e) {
            return this.each(function () {
                w.removeData(this, e)
            })
        }
    }), w.extend({
        queue: function (e, t, n) {
            var r;
            if (e)return t = (t || "fx") + "queue", r = w._data(e, t), n && (!r || w.isArray(n) ? r = w._data(e, t, w.makeArray(n)) : r.push(n)), r || []
        }, dequeue: function (e, t) {
            t = t || "fx";
            var n = w.queue(e, t), r = n.length, i = n.shift(), s = w._queueHooks(e, t), o = function () {
                w.dequeue(e, t)
            };
            i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
        }, _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return w._data(e, n) || w._data(e, n, {
                    empty: w.Callbacks("once memory").add(function () {
                        w._removeData(e, t + "queue"), w._removeData(e, n)
                    })
                })
        }
    }), w.fn.extend({
        queue: function (e, n) {
            var r = 2;
            return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? w.queue(this[0], e) : n === t ? this : this.each(function () {
                var t = w.queue(this, e, n);
                w._queueHooks(this, e), e === "fx" && t[0] !== "inprogress" && w.dequeue(this, e)
            })
        }, dequeue: function (e) {
            return this.each(function () {
                w.dequeue(this, e)
            })
        }, delay: function (e, t) {
            return e = w.fx ? w.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) {
                var r = setTimeout(t, e);
                n.stop = function () {
                    clearTimeout(r)
                }
            })
        }, clearQueue: function (e) {
            return this.queue(e || "fx", [])
        }, promise: function (e, n) {
            var r, i = 1, s = w.Deferred(), o = this, u = this.length, a = function () {
                --i || s.resolveWith(o, [o])
            };
            typeof e != "string" && (n = e, e = t), e = e || "fx";
            while (u--)r = w._data(o[u], e + "queueHooks"), r && r.empty && (i++, r.empty.add(a));
            return a(), s.promise(n)
        }
    });
    var W, X, V = /[\t\r\n\f]/g, $ = /\r/g, J = /^(?:input|select|textarea|button|object)$/i, K = /^(?:a|area)$/i, Q = /^(?:checked|selected)$/i, G = w.support.getSetAttribute, Y = w.support.input;
    w.fn.extend({
        attr: function (e, t) {
            return w.access(this, w.attr, e, t, arguments.length > 1)
        }, removeAttr: function (e) {
            return this.each(function () {
                w.removeAttr(this, e)
            })
        }, prop: function (e, t) {
            return w.access(this, w.prop, e, t, arguments.length > 1)
        }, removeProp: function (e) {
            return e = w.propFix[e] || e, this.each(function () {
                try {
                    this[e] = t, delete this[e]
                } catch (n) {
                }
            })
        }, addClass: function (e) {
            var t, n, r, i, s, o = 0, u = this.length, a = typeof e == "string" && e;
            if (w.isFunction(e))return this.each(function (t) {
                w(this).addClass(e.call(this, t, this.className))
            });
            if (a) {
                t = (e || "").match(S) || [];
                for (; o < u; o++) {
                    n = this[o], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(V, " ") : " ");
                    if (r) {
                        s = 0;
                        while (i = t[s++])r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        n.className = w.trim(r)
                    }
                }
            }
            return this
        }, removeClass: function (e) {
            var t, n, r, i, s, o = 0, u = this.length, a = arguments.length === 0 || typeof e == "string" && e;
            if (w.isFunction(e))return this.each(function (t) {
                w(this).removeClass(e.call(this, t, this.className))
            });
            if (a) {
                t = (e || "").match(S) || [];
                for (; o < u; o++) {
                    n = this[o], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(V, " ") : "");
                    if (r) {
                        s = 0;
                        while (i = t[s++])while (r.indexOf(" " + i + " ") >= 0)r = r.replace(" " + i + " ", " ");
                        n.className = e ? w.trim(r) : ""
                    }
                }
            }
            return this
        }, toggleClass: function (e, t) {
            var n = typeof e;
            return typeof t == "boolean" && n === "string" ? t ? this.addClass(e) : this.removeClass(e) : w.isFunction(e) ? this.each(function (n) {
                w(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function () {
                if (n === "string") {
                    var t, r = 0, s = w(this), o = e.match(S) || [];
                    while (t = o[r++])s.hasClass(t) ? s.removeClass(t) : s.addClass(t)
                } else if (n === i || n === "boolean")this.className && w._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : w._data(this, "__className__") || ""
            })
        }, hasClass: function (e) {
            var t = " " + e + " ", n = 0, r = this.length;
            for (; n < r; n++)if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(V, " ").indexOf(t) >= 0)return !0;
            return !1
        }, val: function (e) {
            var n, r, i, s = this[0];
            if (!arguments.length) {
                if (s)return r = w.valHooks[s.type] || w.valHooks[s.nodeName.toLowerCase()], r && "get"in r && (n = r.get(s, "value")) !== t ? n : (n = s.value, typeof n == "string" ? n.replace($, "") : n == null ? "" : n);
                return
            }
            return i = w.isFunction(e), this.each(function (n) {
                var s;
                if (this.nodeType !== 1)return;
                i ? s = e.call(this, n, w(this).val()) : s = e, s == null ? s = "" : typeof s == "number" ? s += "" : w.isArray(s) && (s = w.map(s, function (e) {
                    return e == null ? "" : e + ""
                })), r = w.valHooks[this.type] || w.valHooks[this.nodeName.toLowerCase()];
                if (!r || !("set"in r) || r.set(this, s, "value") === t)this.value = s
            })
        }
    }), w.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = w.find.attr(e, "value");
                    return t != null ? t : e.text
                }
            }, select: {
                get: function (e) {
                    var t, n, r = e.options, i = e.selectedIndex, s = e.type === "select-one" || i < 0, o = s ? null : [], u = s ? i + 1 : r.length, a = i < 0 ? u : s ? i : 0;
                    for (; a < u; a++) {
                        n = r[a];
                        if ((n.selected || a === i) && (w.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !w.nodeName(n.parentNode, "optgroup"))) {
                            t = w(n).val();
                            if (s)return t;
                            o.push(t)
                        }
                    }
                    return o
                }, set: function (e, t) {
                    var n, r, i = e.options, s = w.makeArray(t), o = i.length;
                    while (o--) {
                        r = i[o];
                        if (r.selected = w.inArray(w(r).val(), s) >= 0)n = !0
                    }
                    return n || (e.selectedIndex = -1), s
                }
            }
        }, attr: function (e, n, r) {
            var s, o, u = e.nodeType;
            if (!e || u === 3 || u === 8 || u === 2)return;
            if (typeof e.getAttribute === i)return w.prop(e, n, r);
            if (u !== 1 || !w.isXMLDoc(e))n = n.toLowerCase(), s = w.attrHooks[n] || (w.expr.match.bool.test(n) ? X : W);
            if (r === t)return s && "get"in s && (o = s.get(e, n)) !== null ? o : (o = w.find.attr(e, n), o == null ? t : o);
            if (r !== null)return s && "set"in s && (o = s.set(e, r, n)) !== t ? o : (e.setAttribute(n, r + ""), r);
            w.removeAttr(e, n)
        }, removeAttr: function (e, t) {
            var n, r, i = 0, s = t && t.match(S);
            if (s && e.nodeType === 1)while (n = s[i++])r = w.propFix[n] || n, w.expr.match.bool.test(n) ? Y && G || !Q.test(n) ? e[r] = !1 : e[w.camelCase("default-" + n)] = e[r] = !1 : w.attr(e, n, ""), e.removeAttribute(G ? n : r)
        }, attrHooks: {
            type: {
                set: function (e, t) {
                    if (!w.support.radioValue && t === "radio" && w.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }, propFix: {"for": "htmlFor", "class": "className"}, prop: function (e, n, r) {
            var i, s, o, u = e.nodeType;
            if (!e || u === 3 || u === 8 || u === 2)return;
            return o = u !== 1 || !w.isXMLDoc(e), o && (n = w.propFix[n] || n, s = w.propHooks[n]), r !== t ? s && "set"in s && (i = s.set(e, r, n)) !== t ? i : e[n] = r : s && "get"in s && (i = s.get(e, n)) !== null ? i : e[n]
        }, propHooks: {
            tabIndex: {
                get: function (e) {
                    var t = w.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : J.test(e.nodeName) || K.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), X = {
        set: function (e, t, n) {
            return t === !1 ? w.removeAttr(e, n) : Y && G || !Q.test(n) ? e.setAttribute(!G && w.propFix[n] || n, n) : e[w.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, w.each(w.expr.match.bool.source.match(/\w+/g), function (e, n) {
        var r = w.expr.attrHandle[n] || w.find.attr;
        w.expr.attrHandle[n] = Y && G || !Q.test(n) ? function (e, n, i) {
            var s = w.expr.attrHandle[n], o = i ? t : (w.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null;
            return w.expr.attrHandle[n] = s, o
        } : function (e, n, r) {
            return r ? t : e[w.camelCase("default-" + n)] ? n.toLowerCase() : null
        }
    });
    if (!Y || !G)w.attrHooks.value = {
        set: function (e, t, n) {
            if (!w.nodeName(e, "input"))return W && W.set(e, t, n);
            e.defaultValue = t
        }
    };
    G || (W = {
        set: function (e, n, r) {
            var i = e.getAttributeNode(r);
            return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", r === "value" || n === e.getAttribute(r) ? n : t
        }
    }, w.expr.attrHandle.id = w.expr.attrHandle.name = w.expr.attrHandle.coords = function (e, n, r) {
        var i;
        return r ? t : (i = e.getAttributeNode(n)) && i.value !== "" ? i.value : null
    }, w.valHooks.button = {
        get: function (e, n) {
            var r = e.getAttributeNode(n);
            return r && r.specified ? r.value : t
        }, set: W.set
    }, w.attrHooks.contenteditable = {
        set: function (e, t, n) {
            W.set(e, t === "" ? !1 : t, n)
        }
    }, w.each(["width", "height"], function (e, t) {
        w.attrHooks[t] = {
            set: function (e, n) {
                if (n === "")return e.setAttribute(t, "auto"), n
            }
        }
    })), w.support.hrefNormalized || w.each(["href", "src"], function (e, t) {
        w.propHooks[t] = {
            get: function (e) {
                return e.getAttribute(t, 4)
            }
        }
    }), w.support.style || (w.attrHooks.style = {
        get: function (e) {
            return e.style.cssText || t
        }, set: function (e, t) {
            return e.style.cssText = t + ""
        }
    }), w.support.optSelected || (w.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), w.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        w.propFix[this.toLowerCase()] = this
    }), w.support.enctype || (w.propFix.enctype = "encoding"), w.each(["radio", "checkbox"], function () {
        w.valHooks[this] = {
            set: function (e, t) {
                if (w.isArray(t))return e.checked = w.inArray(w(e).val(), t) >= 0
            }
        }, w.support.checkOn || (w.valHooks[this].get = function (e) {
            return e.getAttribute("value") === null ? "on" : e.value
        })
    });
    var Z = /^(?:input|select|textarea)$/i, et = /^key/, tt = /^(?:mouse|contextmenu)|click/, nt = /^(?:focusinfocus|focusoutblur)$/, rt = /^([^.]*)(?:\.(.+)|)$/;
    w.event = {
        global: {},
        add: function (e, n, r, s, o) {
            var u, a, f, l, c, h, p, d, v, m, g, y = w._data(e);
            if (!y)return;
            r.handler && (l = r, r = l.handler, o = l.selector), r.guid || (r.guid = w.guid++), (a = y.events) || (a = y.events = {}), (h = y.handle) || (h = y.handle = function (e) {
                return typeof w === i || !!e && w.event.triggered === e.type ? t : w.event.dispatch.apply(h.elem, arguments)
            }, h.elem = e), n = (n || "").match(S) || [""], f = n.length;
            while (f--) {
                u = rt.exec(n[f]) || [], v = g = u[1], m = (u[2] || "").split(".").sort();
                if (!v)continue;
                c = w.event.special[v] || {}, v = (o ? c.delegateType : c.bindType) || v, c = w.event.special[v] || {}, p = w.extend({
                    type: v,
                    origType: g,
                    data: s,
                    handler: r,
                    guid: r.guid,
                    selector: o,
                    needsContext: o && w.expr.match.needsContext.test(o),
                    namespace: m.join(".")
                }, l);
                if (!(d = a[v])) {
                    d = a[v] = [], d.delegateCount = 0;
                    if (!c.setup || c.setup.call(e, s, m, h) === !1)e.addEventListener ? e.addEventListener(v, h, !1) : e.attachEvent && e.attachEvent("on" + v, h)
                }
                c.add && (c.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), o ? d.splice(d.delegateCount++, 0, p) : d.push(p), w.event.global[v] = !0
            }
            e = null
        },
        remove: function (e, t, n, r, i) {
            var s, o, u, a, f, l, c, h, p, d, v, m = w.hasData(e) && w._data(e);
            if (!m || !(l = m.events))return;
            t = (t || "").match(S) || [""], f = t.length;
            while (f--) {
                u = rt.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
                if (!p) {
                    for (p in l)w.event.remove(e, p + t[f], n, r, !0);
                    continue
                }
                c = w.event.special[p] || {}, p = (r ? c.delegateType : c.bindType) || p, h = l[p] || [], u = u[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = s = h.length;
                while (s--)o = h[s], (i || v === o.origType) && (!n || n.guid === o.guid) && (!u || u.test(o.namespace)) && (!r || r === o.selector || r === "**" && o.selector) && (h.splice(s, 1), o.selector && h.delegateCount--, c.remove && c.remove.call(e, o));
                a && !h.length && ((!c.teardown || c.teardown.call(e, d, m.handle) === !1) && w.removeEvent(e, p, m.handle), delete l[p])
            }
            w.isEmptyObject(l) && (delete m.handle, w._removeData(e, "events"))
        },
        trigger: function (n, r, i, s) {
            var u, a, f, l, c, h, p, d = [i || o], v = y.call(n, "type") ? n.type : n, m = y.call(n, "namespace") ? n.namespace.split(".") : [];
            f = h = i = i || o;
            if (i.nodeType === 3 || i.nodeType === 8)return;
            if (nt.test(v + w.event.triggered))return;
            v.indexOf(".") >= 0 && (m = v.split("."), v = m.shift(), m.sort()), a = v.indexOf(":") < 0 && "on" + v, n = n[w.expando] ? n : new w.Event(v, typeof n == "object" && n), n.isTrigger = s ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = r == null ? [n] : w.makeArray(r, [n]), c = w.event.special[v] || {};
            if (!s && c.trigger && c.trigger.apply(i, r) === !1)return;
            if (!s && !c.noBubble && !w.isWindow(i)) {
                l = c.delegateType || v, nt.test(l + v) || (f = f.parentNode);
                for (; f; f = f.parentNode)d.push(f), h = f;
                h === (i.ownerDocument || o) && d.push(h.defaultView || h.parentWindow || e)
            }
            p = 0;
            while ((f = d[p++]) && !n.isPropagationStopped())n.type = p > 1 ? l : c.bindType || v, u = (w._data(f, "events") || {})[n.type] && w._data(f, "handle"), u && u.apply(f, r), u = a && f[a], u && w.acceptData(f) && u.apply && u.apply(f, r) === !1 && n.preventDefault();
            n.type = v;
            if (!s && !n.isDefaultPrevented() && (!c._default || c._default.apply(d.pop(), r) === !1) && w.acceptData(i) && a && i[v] && !w.isWindow(i)) {
                h = i[a], h && (i[a] = null), w.event.triggered = v;
                try {
                    i[v]()
                } catch (g) {
                }
                w.event.triggered = t, h && (i[a] = h)
            }
            return n.result
        },
        dispatch: function (e) {
            e = w.event.fix(e);
            var n, r, i, s, o, u = [], a = v.call(arguments), f = (w._data(this, "events") || {})[e.type] || [], l = w.event.special[e.type] || {};
            a[0] = e, e.delegateTarget = this;
            if (l.preDispatch && l.preDispatch.call(this, e) === !1)return;
            u = w.event.handlers.call(this, e, f), n = 0;
            while ((s = u[n++]) && !e.isPropagationStopped()) {
                e.currentTarget = s.elem, o = 0;
                while ((i = s.handlers[o++]) && !e.isImmediatePropagationStopped())if (!e.namespace_re || e.namespace_re.test(i.namespace))e.handleObj = i, e.data = i.data, r = ((w.event.special[i.origType] || {}).handle || i.handler).apply(s.elem, a), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())
            }
            return l.postDispatch && l.postDispatch.call(this, e), e.result
        },
        handlers: function (e, n) {
            var r, i, s, o, u = [], a = n.delegateCount, f = e.target;
            if (a && f.nodeType && (!e.button || e.type !== "click"))for (; f != this; f = f.parentNode || this)if (f.nodeType === 1 && (f.disabled !== !0 || e.type !== "click")) {
                s = [];
                for (o = 0; o < a; o++)i = n[o], r = i.selector + " ", s[r] === t && (s[r] = i.needsContext ? w(r, this).index(f) >= 0 : w.find(r, this, null, [f]).length), s[r] && s.push(i);
                s.length && u.push({elem: f, handlers: s})
            }
            return a < n.length && u.push({elem: this, handlers: n.slice(a)}), u
        },
        fix: function (e) {
            if (e[w.expando])return e;
            var t, n, r, i = e.type, s = e, u = this.fixHooks[i];
            u || (this.fixHooks[i] = u = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = u.props ? this.props.concat(u.props) : this.props, e = new w.Event(s), t = r.length;
            while (t--)n = r[t], e[n] = s[n];
            return e.target || (e.target = s.srcElement || o), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, u.filter ? u.filter(e, s) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (e, t) {
                return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, n) {
                var r, i, s, u = n.button, a = n.fromElement;
                return e.pageX == null && n.clientX != null && (i = e.target.ownerDocument || o, s = i.documentElement, r = i.body, e.pageX = n.clientX + (s && s.scrollLeft || r && r.scrollLeft || 0) - (s && s.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (s && s.scrollTop || r && r.scrollTop || 0) - (s && s.clientTop || r && r.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? n.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
            }
        },
        special: {
            load: {noBubble: !0}, focus: {
                trigger: function () {
                    if (this !== ot() && this.focus)try {
                        return this.focus(), !1
                    } catch (e) {
                    }
                }, delegateType: "focusin"
            }, blur: {
                trigger: function () {
                    if (this === ot() && this.blur)return this.blur(), !1
                }, delegateType: "focusout"
            }, click: {
                trigger: function () {
                    if (w.nodeName(this, "input") && this.type === "checkbox" && this.click)return this.click(), !1
                }, _default: function (e) {
                    return w.nodeName(e.target, "a")
                }
            }, beforeunload: {
                postDispatch: function (e) {
                    e.result !== t && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function (e, t, n, r) {
            var i = w.extend(new w.Event, n, {type: e, isSimulated: !0, originalEvent: {}});
            r ? w.event.trigger(i, null, t) : w.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
        }
    }, w.removeEvent = o.removeEventListener ? function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function (e, t, n) {
        var r = "on" + t;
        e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n))
    }, w.Event = function (e, t) {
        if (!(this instanceof w.Event))return new w.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : st) : this.type = e, t && w.extend(this, t), this.timeStamp = e && e.timeStamp || w.now(), this[w.expando] = !0
    }, w.Event.prototype = {
        isDefaultPrevented: st,
        isPropagationStopped: st,
        isImmediatePropagationStopped: st,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = it;
            if (!e)return;
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = it;
            if (!e)return;
            e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = it, this.stopPropagation()
        }
    }, w.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (e, t) {
        w.event.special[e] = {
            delegateType: t, bindType: t, handle: function (e) {
                var n, r = this, i = e.relatedTarget, s = e.handleObj;
                if (!i || i !== r && !w.contains(r, i))e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
                return n
            }
        }
    }), w.support.submitBubbles || (w.event.special.submit = {
        setup: function () {
            if (w.nodeName(this, "form"))return !1;
            w.event.add(this, "click._submit keypress._submit", function (e) {
                var n = e.target, r = w.nodeName(n, "input") || w.nodeName(n, "button") ? n.form : t;
                r && !w._data(r, "submitBubbles") && (w.event.add(r, "submit._submit", function (e) {
                    e._submit_bubble = !0
                }), w._data(r, "submitBubbles", !0))
            })
        }, postDispatch: function (e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && w.event.simulate("submit", this.parentNode, e, !0))
        }, teardown: function () {
            if (w.nodeName(this, "form"))return !1;
            w.event.remove(this, "._submit")
        }
    }), w.support.changeBubbles || (w.event.special.change = {
        setup: function () {
            if (Z.test(this.nodeName)) {
                if (this.type === "checkbox" || this.type === "radio")w.event.add(this, "propertychange._change", function (e) {
                    e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                }), w.event.add(this, "click._change", function (e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1), w.event.simulate("change", this, e, !0)
                });
                return !1
            }
            w.event.add(this, "beforeactivate._change", function (e) {
                var t = e.target;
                Z.test(t.nodeName) && !w._data(t, "changeBubbles") && (w.event.add(t, "change._change", function (e) {
                    this.parentNode && !e.isSimulated && !e.isTrigger && w.event.simulate("change", this.parentNode, e, !0)
                }), w._data(t, "changeBubbles", !0))
            })
        }, handle: function (e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox")return e.handleObj.handler.apply(this, arguments)
        }, teardown: function () {
            return w.event.remove(this, "._change"), !Z.test(this.nodeName)
        }
    }), w.support.focusinBubbles || w.each({focus: "focusin", blur: "focusout"}, function (e, t) {
        var n = 0, r = function (e) {
            w.event.simulate(t, e.target, w.event.fix(e), !0)
        };
        w.event.special[t] = {
            setup: function () {
                n++ === 0 && o.addEventListener(e, r, !0)
            }, teardown: function () {
                --n === 0 && o.removeEventListener(e, r, !0)
            }
        }
    }), w.fn.extend({
        on: function (e, n, r, i, s) {
            var o, u;
            if (typeof e == "object") {
                typeof n != "string" && (r = r || n, n = t);
                for (o in e)this.on(o, n, r, e[o], s);
                return this
            }
            r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
            if (i === !1)i = st; else if (!i)return this;
            return s === 1 && (u = i, i = function (e) {
                return w().off(e), u.apply(this, arguments)
            }, i.guid = u.guid || (u.guid = w.guid++)), this.each(function () {
                w.event.add(this, e, i, r, n)
            })
        }, one: function (e, t, n, r) {
            return this.on(e, t, n, r, 1)
        }, off: function (e, n, r) {
            var i, s;
            if (e && e.preventDefault && e.handleObj)return i = e.handleObj, w(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if (typeof e == "object") {
                for (s in e)this.off(s, n, e[s]);
                return this
            }
            if (n === !1 || typeof n == "function")r = n, n = t;
            return r === !1 && (r = st), this.each(function () {
                w.event.remove(this, e, r, n)
            })
        }, trigger: function (e, t) {
            return this.each(function () {
                w.event.trigger(e, t, this)
            })
        }, triggerHandler: function (e, t) {
            var n = this[0];
            if (n)return w.event.trigger(e, t, n, !0)
        }
    });
    var ut = /^.[^:#\[\.,]*$/, at = /^(?:parents|prev(?:Until|All))/, ft = w.expr.match.needsContext, lt = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    w.fn.extend({
        find: function (e) {
            var t, n = [], r = this, i = r.length;
            if (typeof e != "string")return this.pushStack(w(e).filter(function () {
                for (t = 0; t < i; t++)if (w.contains(r[t], this))return !0
            }));
            for (t = 0; t < i; t++)w.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? w.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        }, has: function (e) {
            var t, n = w(e, this), r = n.length;
            return this.filter(function () {
                for (t = 0; t < r; t++)if (w.contains(this, n[t]))return !0
            })
        }, not: function (e) {
            return this.pushStack(ht(this, e || [], !0))
        }, filter: function (e) {
            return this.pushStack(ht(this, e || [], !1))
        }, is: function (e) {
            return !!ht(this, typeof e == "string" && ft.test(e) ? w(e) : e || [], !1).length
        }, closest: function (e, t) {
            var n, r = 0, i = this.length, s = [], o = ft.test(e) || typeof e != "string" ? w(e, t || this.context) : 0;
            for (; r < i; r++)for (n = this[r]; n && n !== t; n = n.parentNode)if (n.nodeType < 11 && (o ? o.index(n) > -1 : n.nodeType === 1 && w.find.matchesSelector(n, e))) {
                n = s.push(n);
                break
            }
            return this.pushStack(s.length > 1 ? w.unique(s) : s)
        }, index: function (e) {
            return e ? typeof e == "string" ? w.inArray(this[0], w(e)) : w.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        }, add: function (e, t) {
            var n = typeof e == "string" ? w(e, t) : w.makeArray(e && e.nodeType ? [e] : e), r = w.merge(this.get(), n);
            return this.pushStack(w.unique(r))
        }, addBack: function (e) {
            return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
        }
    }), w.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && t.nodeType !== 11 ? t : null
        }, parents: function (e) {
            return w.dir(e, "parentNode")
        }, parentsUntil: function (e, t, n) {
            return w.dir(e, "parentNode", n)
        }, next: function (e) {
            return ct(e, "nextSibling")
        }, prev: function (e) {
            return ct(e, "previousSibling")
        }, nextAll: function (e) {
            return w.dir(e, "nextSibling")
        }, prevAll: function (e) {
            return w.dir(e, "previousSibling")
        }, nextUntil: function (e, t, n) {
            return w.dir(e, "nextSibling", n)
        }, prevUntil: function (e, t, n) {
            return w.dir(e, "previousSibling", n)
        }, siblings: function (e) {
            return w.sibling((e.parentNode || {}).firstChild, e)
        }, children: function (e) {
            return w.sibling(e.firstChild)
        }, contents: function (e) {
            return w.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : w.merge([], e.childNodes)
        }
    }, function (e, t) {
        w.fn[e] = function (n, r) {
            var i = w.map(this, t, n);
            return e.slice(-5) !== "Until" && (r = n), r && typeof r == "string" && (i = w.filter(r, i)), this.length > 1 && (lt[e] || (i = w.unique(i)), at.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    }), w.extend({
        filter: function (e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), t.length === 1 && r.nodeType === 1 ? w.find.matchesSelector(r, e) ? [r] : [] : w.find.matches(e, w.grep(t, function (e) {
                return e.nodeType === 1
            }))
        }, dir: function (e, n, r) {
            var i = [], s = e[n];
            while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !w(s).is(r)))s.nodeType === 1 && i.push(s), s = s[n];
            return i
        }, sibling: function (e, t) {
            var n = [];
            for (; e; e = e.nextSibling)e.nodeType === 1 && e !== t && n.push(e);
            return n
        }
    });
    var dt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", vt = / jQuery\d+="(?:null|\d+)"/g, mt = new RegExp("<(?:" + dt + ")[\\s/>]", "i"), gt = /^\s+/, yt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bt = /<([\w:]+)/, wt = /<tbody/i, Et = /<|&#?\w+;/, St = /<(?:script|style|link)/i, xt = /^(?:checkbox|radio)$/i, Tt = /checked\s*(?:[^=]|=\s*.checked.)/i, Nt = /^$|\/(?:java|ecma)script/i, Ct = /^true\/(.*)/, kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Lt = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: w.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }, At = pt(o), Ot = At.appendChild(o.createElement("div"));
    Lt.optgroup = Lt.option, Lt.tbody = Lt.tfoot = Lt.colgroup = Lt.caption = Lt.thead, Lt.th = Lt.td, w.fn.extend({
        text: function (e) {
            return w.access(this, function (e) {
                return e === t ? w.text(this) : this.empty().append((this[0] && this[0].ownerDocument || o).createTextNode(e))
            }, null, e, arguments.length)
        }, append: function () {
            return this.domManip(arguments, function (e) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var t = Mt(this, e);
                    t.appendChild(e)
                }
            })
        }, prepend: function () {
            return this.domManip(arguments, function (e) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var t = Mt(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        }, before: function () {
            return this.domManip(arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        }, after: function () {
            return this.domManip(arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        }, remove: function (e, t) {
            var n, r = e ? w.filter(e, this) : this, i = 0;
            for (; (n = r[i]) != null; i++)!t && n.nodeType === 1 && w.cleanData(jt(n)), n.parentNode && (t && w.contains(n.ownerDocument, n) && Pt(jt(n, "script")), n.parentNode.removeChild(n));
            return this
        }, empty: function () {
            var e, t = 0;
            for (; (e = this[t]) != null; t++) {
                e.nodeType === 1 && w.cleanData(jt(e, !1));
                while (e.firstChild)e.removeChild(e.firstChild);
                e.options && w.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        }, clone: function (e, t) {
            return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function () {
                return w.clone(this, e, t)
            })
        }, html: function (e) {
            return w.access(this, function (e) {
                var n = this[0] || {}, r = 0, i = this.length;
                if (e === t)return n.nodeType === 1 ? n.innerHTML.replace(vt, "") : t;
                if (typeof e == "string" && !St.test(e) && (w.support.htmlSerialize || !mt.test(e)) && (w.support.leadingWhitespace || !gt.test(e)) && !Lt[(bt.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(yt, "<$1></$2>");
                    try {
                        for (; r < i; r++)n = this[r] || {}, n.nodeType === 1 && (w.cleanData(jt(n, !1)), n.innerHTML = e);
                        n = 0
                    } catch (s) {
                    }
                }
                n && this.empty().append(e)
            }, null, e, arguments.length)
        }, replaceWith: function () {
            var e = w.map(this, function (e) {
                return [e.nextSibling, e.parentNode]
            }), t = 0;
            return this.domManip(arguments, function (n) {
                var r = e[t++], i = e[t++];
                i && (r && r.parentNode !== i && (r = this.nextSibling), w(this).remove(), i.insertBefore(n, r))
            }, !0), t ? this : this.remove()
        }, detach: function (e) {
            return this.remove(e, !0)
        }, domManip: function (e, t, n) {
            e = p.apply([], e);
            var r, i, s, o, u, a, f = 0, l = this.length, c = this, h = l - 1, d = e[0], v = w.isFunction(d);
            if (v || !(l <= 1 || typeof d != "string" || w.support.checkClone || !Tt.test(d)))return this.each(function (r) {
                var i = c.eq(r);
                v && (e[0] = d.call(this, r, i.html())), i.domManip(e, t, n)
            });
            if (l) {
                a = w.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = a.firstChild, a.childNodes.length === 1 && (a = r);
                if (r) {
                    o = w.map(jt(a, "script"), _t), s = o.length;
                    for (; f < l; f++)i = a, f !== h && (i = w.clone(i, !0, !0), s && w.merge(o, jt(i, "script"))), t.call(this[f], i, f);
                    if (s) {
                        u = o[o.length - 1].ownerDocument, w.map(o, Dt);
                        for (f = 0; f < s; f++)i = o[f], Nt.test(i.type || "") && !w._data(i, "globalEval") && w.contains(u, i) && (i.src ? w._evalUrl(i.src) : w.globalEval((i.text || i.textContent || i.innerHTML || "").replace(kt, "")))
                    }
                    a = r = null
                }
            }
            return this
        }
    }), w.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t) {
        w.fn[e] = function (e) {
            var n, r = 0, i = [], s = w(e), o = s.length - 1;
            for (; r <= o; r++)n = r === o ? this : this.clone(!0), w(s[r])[t](n), d.apply(i, n.get());
            return this.pushStack(i)
        }
    }), w.extend({
        clone: function (e, t, n) {
            var r, i, s, o, u, a = w.contains(e.ownerDocument, e);
            w.support.html5Clone || w.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (Ot.innerHTML = e.outerHTML, Ot.removeChild(s = Ot.firstChild));
            if ((!w.support.noCloneEvent || !w.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !w.isXMLDoc(e)) {
                r = jt(s), u = jt(e);
                for (o = 0; (i = u[o]) != null; ++o)r[o] && Bt(i, r[o])
            }
            if (t)if (n) {
                u = u || jt(e), r = r || jt(s);
                for (o = 0; (i = u[o]) != null; o++)Ht(i, r[o])
            } else Ht(e, s);
            return r = jt(s, "script"), r.length > 0 && Pt(r, !a && jt(e, "script")), r = u = i = null, s
        }, buildFragment: function (e, t, n, r) {
            var i, s, o, u, a, f, l, c = e.length, h = pt(t), p = [], d = 0;
            for (; d < c; d++) {
                s = e[d];
                if (s || s === 0)if (w.type(s) === "object")w.merge(p, s.nodeType ? [s] : s); else if (!Et.test(s))p.push(t.createTextNode(s)); else {
                    u = u || h.appendChild(t.createElement("div")), a = (bt.exec(s) || ["", ""])[1].toLowerCase(), l = Lt[a] || Lt._default, u.innerHTML = l[1] + s.replace(yt, "<$1></$2>") + l[2], i = l[0];
                    while (i--)u = u.lastChild;
                    !w.support.leadingWhitespace && gt.test(s) && p.push(t.createTextNode(gt.exec(s)[0]));
                    if (!w.support.tbody) {
                        s = a === "table" && !wt.test(s) ? u.firstChild : l[1] === "<table>" && !wt.test(s) ? u : 0, i = s && s.childNodes.length;
                        while (i--)w.nodeName(f = s.childNodes[i], "tbody") && !f.childNodes.length && s.removeChild(f)
                    }
                    w.merge(p, u.childNodes), u.textContent = "";
                    while (u.firstChild)u.removeChild(u.firstChild);
                    u = h.lastChild
                }
            }
            u && h.removeChild(u), w.support.appendChecked || w.grep(jt(p, "input"), Ft), d = 0;
            while (s = p[d++]) {
                if (r && w.inArray(s, r) !== -1)continue;
                o = w.contains(s.ownerDocument, s), u = jt(h.appendChild(s), "script"), o && Pt(u);
                if (n) {
                    i = 0;
                    while (s = u[i++])Nt.test(s.type || "") && n.push(s)
                }
            }
            return u = null, h
        }, cleanData: function (e, t) {
            var n, r, s, o, u = 0, a = w.expando, f = w.cache, l = w.support.deleteExpando, h = w.event.special;
            for (; (n = e[u]) != null; u++)if (t || w.acceptData(n)) {
                s = n[a], o = s && f[s];
                if (o) {
                    if (o.events)for (r in o.events)h[r] ? w.event.remove(n, r) : w.removeEvent(n, r, o.handle);
                    f[s] && (delete f[s], l ? delete n[a] : typeof n.removeAttribute !== i ? n.removeAttribute(a) : n[a] = null, c.push(s))
                }
            }
        }, _evalUrl: function (e) {
            return w.ajax({url: e, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
        }
    }), w.fn.extend({
        wrapAll: function (e) {
            if (w.isFunction(e))return this.each(function (t) {
                w(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = w(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                    var e = this;
                    while (e.firstChild && e.firstChild.nodeType === 1)e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        }, wrapInner: function (e) {
            return w.isFunction(e) ? this.each(function (t) {
                w(this).wrapInner(e.call(this, t))
            }) : this.each(function () {
                var t = w(this), n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        }, wrap: function (e) {
            var t = w.isFunction(e);
            return this.each(function (n) {
                w(this).wrapAll(t ? e.call(this, n) : e)
            })
        }, unwrap: function () {
            return this.parent().each(function () {
                w.nodeName(this, "body") || w(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    var It, qt, Rt, Ut = /alpha\([^)]*\)/i, zt = /opacity\s*=\s*([^)]*)/, Wt = /^(top|right|bottom|left)$/, Xt = /^(none|table(?!-c[ea]).+)/, Vt = /^margin/, $t = new RegExp("^(" + E + ")(.*)$", "i"), Jt = new RegExp("^(" + E + ")(?!px)[a-z%]+$", "i"), Kt = new RegExp("^([+-])=(" + E + ")", "i"), Qt = {BODY: "block"}, Gt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Yt = {
        letterSpacing: 0,
        fontWeight: 400
    }, Zt = ["Top", "Right", "Bottom", "Left"], en = ["Webkit", "O", "Moz", "ms"];
    w.fn.extend({
        css: function (e, n) {
            return w.access(this, function (e, n, r) {
                var i, s, o = {}, u = 0;
                if (w.isArray(n)) {
                    s = qt(e), i = n.length;
                    for (; u < i; u++)o[n[u]] = w.css(e, n[u], !1, s);
                    return o
                }
                return r !== t ? w.style(e, n, r) : w.css(e, n)
            }, e, n, arguments.length > 1)
        }, show: function () {
            return rn(this, !0)
        }, hide: function () {
            return rn(this)
        }, toggle: function (e) {
            return typeof e == "boolean" ? e ? this.show() : this.hide() : this.each(function () {
                nn(this) ? w(this).show() : w(this).hide()
            })
        }
    }), w.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = Rt(e, "opacity");
                        return n === "" ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {"float": w.support.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (e, n, r, i) {
            if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style)return;
            var s, o, u, a = w.camelCase(n), f = e.style;
            n = w.cssProps[a] || (w.cssProps[a] = tn(f, a)), u = w.cssHooks[n] || w.cssHooks[a];
            if (r === t)return u && "get"in u && (s = u.get(e, !1, i)) !== t ? s : f[n];
            o = typeof r, o === "string" && (s = Kt.exec(r)) && (r = (s[1] + 1) * s[2] + parseFloat(w.css(e, n)), o = "number");
            if (r == null || o === "number" && isNaN(r))return;
            o === "number" && !w.cssNumber[a] && (r += "px"), !w.support.clearCloneStyle && r === "" && n.indexOf("background") === 0 && (f[n] = "inherit");
            if (!u || !("set"in u) || (r = u.set(e, r, i)) !== t)try {
                f[n] = r
            } catch (l) {
            }
        },
        css: function (e, n, r, i) {
            var s, o, u, a = w.camelCase(n);
            return n = w.cssProps[a] || (w.cssProps[a] = tn(e.style, a)), u = w.cssHooks[n] || w.cssHooks[a], u && "get"in u && (o = u.get(e, !0, r)), o === t && (o = Rt(e, n, i)), o === "normal" && n in Yt && (o = Yt[n]), r === "" || r ? (s = parseFloat(o), r === !0 || w.isNumeric(s) ? s || 0 : o) : o
        }
    }), e.getComputedStyle ? (qt = function (t) {
        return e.getComputedStyle(t, null)
    }, Rt = function (e, n, r) {
        var i, s, o, u = r || qt(e), a = u ? u.getPropertyValue(n) || u[n] : t, f = e.style;
        return u && (a === "" && !w.contains(e.ownerDocument, e) && (a = w.style(e, n)), Jt.test(a) && Vt.test(n) && (i = f.width, s = f.minWidth, o = f.maxWidth, f.minWidth = f.maxWidth = f.width = a, a = u.width, f.width = i, f.minWidth = s, f.maxWidth = o)), a
    }) : o.documentElement.currentStyle && (qt = function (e) {
        return e.currentStyle
    }, Rt = function (e, n, r) {
        var i, s, o, u = r || qt(e), a = u ? u[n] : t, f = e.style;
        return a == null && f && f[n] && (a = f[n]), Jt.test(a) && !Wt.test(n) && (i = f.left, s = e.runtimeStyle, o = s && s.left, o && (s.left = e.currentStyle.left), f.left = n === "fontSize" ? "1em" : a, a = f.pixelLeft + "px", f.left = i, o && (s.left = o)), a === "" ? "auto" : a
    }), w.each(["height", "width"], function (e, t) {
        w.cssHooks[t] = {
            get: function (e, n, r) {
                if (n)return e.offsetWidth === 0 && Xt.test(w.css(e, "display")) ? w.swap(e, Gt, function () {
                    return un(e, t, r)
                }) : un(e, t, r)
            }, set: function (e, n, r) {
                var i = r && qt(e);
                return sn(e, n, r ? on(e, t, r, w.support.boxSizing && w.css(e, "boxSizing", !1, i) === "border-box", i) : 0)
            }
        }
    }), w.support.opacity || (w.cssHooks.opacity = {
        get: function (e, t) {
            return zt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        }, set: function (e, t) {
            var n = e.style, r = e.currentStyle, i = w.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "", s = r && r.filter || n.filter || "";
            n.zoom = 1;
            if ((t >= 1 || t === "") && w.trim(s.replace(Ut, "")) === "" && n.removeAttribute) {
                n.removeAttribute("filter");
                if (t === "" || r && !r.filter)return
            }
            n.filter = Ut.test(s) ? s.replace(Ut, i) : s + " " + i
        }
    }), w(function () {
        w.support.reliableMarginRight || (w.cssHooks.marginRight = {
            get: function (e, t) {
                if (t)return w.swap(e, {display: "inline-block"}, Rt, [e, "marginRight"])
            }
        }), !w.support.pixelPosition && w.fn.position && w.each(["top", "left"], function (e, t) {
            w.cssHooks[t] = {
                get: function (e, n) {
                    if (n)return n = Rt(e, t), Jt.test(n) ? w(e).position()[t] + "px" : n
                }
            }
        })
    }), w.expr && w.expr.filters && (w.expr.filters.hidden = function (e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !w.support.reliableHiddenOffsets && (e.style && e.style.display || w.css(e, "display")) === "none"
    }, w.expr.filters.visible = function (e) {
        return !w.expr.filters.hidden(e)
    }), w.each({margin: "", padding: "", border: "Width"}, function (e, t) {
        w.cssHooks[e + t] = {
            expand: function (n) {
                var r = 0, i = {}, s = typeof n == "string" ? n.split(" ") : [n];
                for (; r < 4; r++)i[e + Zt[r] + t] = s[r] || s[r - 2] || s[0];
                return i
            }
        }, Vt.test(e) || (w.cssHooks[e + t].set = sn)
    });
    var ln = /%20/g, cn = /\[\]$/, hn = /\r?\n/g, pn = /^(?:submit|button|image|reset|file)$/i, dn = /^(?:input|select|textarea|keygen)/i;
    w.fn.extend({
        serialize: function () {
            return w.param(this.serializeArray())
        }, serializeArray: function () {
            return this.map(function () {
                var e = w.prop(this, "elements");
                return e ? w.makeArray(e) : this
            }).filter(function () {
                var e = this.type;
                return this.name && !w(this).is(":disabled") && dn.test(this.nodeName) && !pn.test(e) && (this.checked || !xt.test(e))
            }).map(function (e, t) {
                var n = w(this).val();
                return n == null ? null : w.isArray(n) ? w.map(n, function (e) {
                    return {name: t.name, value: e.replace(hn, "\r\n")}
                }) : {name: t.name, value: n.replace(hn, "\r\n")}
            }).get()
        }
    }), w.param = function (e, n) {
        var r, i = [], s = function (e, t) {
            t = w.isFunction(t) ? t() : t == null ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        n === t && (n = w.ajaxSettings && w.ajaxSettings.traditional);
        if (w.isArray(e) || e.jquery && !w.isPlainObject(e))w.each(e, function () {
            s(this.name, this.value)
        }); else for (r in e)vn(r, e[r], n, s);
        return i.join("&").replace(ln, "+")
    }, w.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
        w.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), w.fn.extend({
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }, bind: function (e, t, n) {
            return this.on(e, null, t, n)
        }, unbind: function (e, t) {
            return this.off(e, null, t)
        }, delegate: function (e, t, n, r) {
            return this.on(t, e, n, r)
        }, undelegate: function (e, t, n) {
            return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var mn, gn, yn = w.now(), bn = /\?/, wn = /#.*$/, En = /([?&])_=[^&]*/, Sn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, xn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Tn = /^(?:GET|HEAD)$/, Nn = /^\/\//, Cn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, kn = w.fn.load, Ln = {}, An = {}, On = "*/".concat("*");
    try {
        gn = s.href
    } catch (Mn) {
        gn = o.createElement("a"), gn.href = "", gn = gn.href
    }
    mn = Cn.exec(gn.toLowerCase()) || [], w.fn.load = function (e, n, r) {
        if (typeof e != "string" && kn)return kn.apply(this, arguments);
        var i, s, o, u = this, a = e.indexOf(" ");
        return a >= 0 && (i = e.slice(a, e.length), e = e.slice(0, a)), w.isFunction(n) ? (r = n, n = t) : n && typeof n == "object" && (o = "POST"), u.length > 0 && w.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: n
        }).done(function (e) {
            s = arguments, u.html(i ? w("<div>").append(w.parseHTML(e)).find(i) : e)
        }).complete(r && function (e, t) {
                u.each(r, s || [e.responseText, t, e])
            }), this
    }, w.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        w.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), w.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: gn,
            type: "GET",
            isLocal: xn.test(mn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": On,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {"* text": String, "text html": !0, "text json": w.parseJSON, "text xml": w.parseXML},
            flatOptions: {url: !0, context: !0}
        },
        ajaxSetup: function (e, t) {
            return t ? Pn(Pn(e, w.ajaxSettings), t) : Pn(w.ajaxSettings, e)
        },
        ajaxPrefilter: _n(Ln),
        ajaxTransport: _n(An),
        ajax: function (e, n) {
            function N(e, n, r, i) {
                var l, g, y, E, S, T = n;
                if (b === 2)return;
                b = 2, u && clearTimeout(u), f = t, o = i || "", x.readyState = e > 0 ? 4 : 0, l = e >= 200 && e < 300 || e === 304, r && (E = Hn(c, x, r)), E = Bn(c, E, x, l);
                if (l)c.ifModified && (S = x.getResponseHeader("Last-Modified"), S && (w.lastModified[s] = S), S = x.getResponseHeader("etag"), S && (w.etag[s] = S)), e === 204 || c.type === "HEAD" ? T = "nocontent" : e === 304 ? T = "notmodified" : (T = E.state, g = E.data, y = E.error, l = !y); else {
                    y = T;
                    if (e || !T)T = "error", e < 0 && (e = 0)
                }
                x.status = e, x.statusText = (n || T) + "", l ? d.resolveWith(h, [g, T, x]) : d.rejectWith(h, [x, T, y]), x.statusCode(m), m = t, a && p.trigger(l ? "ajaxSuccess" : "ajaxError", [x, c, l ? g : y]), v.fireWith(h, [x, T]), a && (p.trigger("ajaxComplete", [x, c]), --w.active || w.event.trigger("ajaxStop"))
            }

            typeof e == "object" && (n = e, e = t), n = n || {};
            var r, i, s, o, u, a, f, l, c = w.ajaxSetup({}, n), h = c.context || c, p = c.context && (h.nodeType || h.jquery) ? w(h) : w.event, d = w.Deferred(), v = w.Callbacks("once memory"), m = c.statusCode || {}, g = {}, y = {}, b = 0, E = "canceled", x = {
                readyState: 0,
                getResponseHeader: function (e) {
                    var t;
                    if (b === 2) {
                        if (!l) {
                            l = {};
                            while (t = Sn.exec(o))l[t[1].toLowerCase()] = t[2]
                        }
                        t = l[e.toLowerCase()]
                    }
                    return t == null ? null : t
                },
                getAllResponseHeaders: function () {
                    return b === 2 ? o : null
                },
                setRequestHeader: function (e, t) {
                    var n = e.toLowerCase();
                    return b || (e = y[n] = y[n] || e, g[e] = t), this
                },
                overrideMimeType: function (e) {
                    return b || (c.mimeType = e), this
                },
                statusCode: function (e) {
                    var t;
                    if (e)if (b < 2)for (t in e)m[t] = [m[t], e[t]]; else x.always(e[x.status]);
                    return this
                },
                abort: function (e) {
                    var t = e || E;
                    return f && f.abort(t), N(0, t), this
                }
            };
            d.promise(x).complete = v.add, x.success = x.done, x.error = x.fail, c.url = ((e || c.url || gn) + "").replace(wn, "").replace(Nn, mn[1] + "//"), c.type = n.method || n.type || c.method || c.type, c.dataTypes = w.trim(c.dataType || "*").toLowerCase().match(S) || [""], c.crossDomain == null && (r = Cn.exec(c.url.toLowerCase()), c.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || (r[1] === "http:" ? "80" : "443")) === (mn[3] || (mn[1] === "http:" ? "80" : "443")))), c.data && c.processData && typeof c.data != "string" && (c.data = w.param(c.data, c.traditional)), Dn(Ln, c, n, x);
            if (b === 2)return x;
            a = c.global, a && w.active++ === 0 && w.event.trigger("ajaxStart"), c.type = c.type.toUpperCase(), c.hasContent = !Tn.test(c.type), s = c.url, c.hasContent || (c.data && (s = c.url += (bn.test(s) ? "&" : "?") + c.data, delete c.data), c.cache === !1 && (c.url = En.test(s) ? s.replace(En, "$1_=" + yn++) : s + (bn.test(s) ? "&" : "?") + "_=" + yn++)), c.ifModified && (w.lastModified[s] && x.setRequestHeader("If-Modified-Since", w.lastModified[s]), w.etag[s] && x.setRequestHeader("If-None-Match", w.etag[s])), (c.data && c.hasContent && c.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", c.contentType), x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + On + "; q=0.01" : "") : c.accepts["*"]);
            for (i in c.headers)x.setRequestHeader(i, c.headers[i]);
            if (!c.beforeSend || c.beforeSend.call(h, x, c) !== !1 && b !== 2) {
                E = "abort";
                for (i in{success: 1, error: 1, complete: 1})x[i](c[i]);
                f = Dn(An, c, n, x);
                if (!f)N(-1, "No Transport"); else {
                    x.readyState = 1, a && p.trigger("ajaxSend", [x, c]), c.async && c.timeout > 0 && (u = setTimeout(function () {
                        x.abort("timeout")
                    }, c.timeout));
                    try {
                        b = 1, f.send(g, N)
                    } catch (T) {
                        if (!(b < 2))throw T;
                        N(-1, T)
                    }
                }
                return x
            }
            return x.abort()
        },
        getJSON: function (e, t, n) {
            return w.get(e, t, n, "json")
        },
        getScript: function (e, n) {
            return w.get(e, t, n, "script")
        }
    }), w.each(["get", "post"], function (e, n) {
        w[n] = function (e, r, i, s) {
            return w.isFunction(r) && (s = s || i, i = r, r = t), w.ajax({
                url: e,
                type: n,
                dataType: s,
                data: r,
                success: i
            })
        }
    }), w.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /(?:java|ecma)script/},
        converters: {
            "text script": function (e) {
                return w.globalEval(e), e
            }
        }
    }), w.ajaxPrefilter("script", function (e) {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), w.ajaxTransport("script", function (e) {
        if (e.crossDomain) {
            var n, r = o.head || w("head")[0] || o.documentElement;
            return {
                send: function (t, i) {
                    n = o.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, t) {
                        if (t || !n.readyState || /loaded|complete/.test(n.readyState))n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success")
                    }, r.insertBefore(n, r.firstChild)
                }, abort: function () {
                    n && n.onload(t, !0)
                }
            }
        }
    });
    var jn = [], Fn = /(=)\?(?=&|$)|\?\?/;
    w.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var e = jn.pop() || w.expando + "_" + yn++;
            return this[e] = !0, e
        }
    }), w.ajaxPrefilter("json jsonp", function (n, r, i) {
        var s, o, u, a = n.jsonp !== !1 && (Fn.test(n.url) ? "url" : typeof n.data == "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Fn.test(n.data) && "data");
        if (a || n.dataTypes[0] === "jsonp")return s = n.jsonpCallback = w.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, a ? n[a] = n[a].replace(Fn, "$1" + s) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + s), n.converters["script json"] = function () {
            return u || w.error(s + " was not called"), u[0]
        }, n.dataTypes[0] = "json", o = e[s], e[s] = function () {
            u = arguments
        }, i.always(function () {
            e[s] = o, n[s] && (n.jsonpCallback = r.jsonpCallback, jn.push(s)), u && w.isFunction(o) && o(u[0]), u = o = t
        }), "script"
    });
    var In, qn, Rn = 0, Un = e.ActiveXObject && function () {
            var e;
            for (e in In)In[e](t, !0)
        };
    w.ajaxSettings.xhr = e.ActiveXObject ? function () {
        return !this.isLocal && zn() || Wn()
    } : zn, qn = w.ajaxSettings.xhr(), w.support.cors = !!qn && "withCredentials"in qn, qn = w.support.ajax = !!qn, qn && w.ajaxTransport(function (n) {
        if (!n.crossDomain || w.support.cors) {
            var r;
            return {
                send: function (i, s) {
                    var o, u, a = n.xhr();
                    n.username ? a.open(n.type, n.url, n.async, n.username, n.password) : a.open(n.type, n.url, n.async);
                    if (n.xhrFields)for (u in n.xhrFields)a[u] = n.xhrFields[u];
                    n.mimeType && a.overrideMimeType && a.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (u in i)a.setRequestHeader(u, i[u])
                    } catch (f) {
                    }
                    a.send(n.hasContent && n.data || null), r = function (e, i) {
                        var u, f, l, c;
                        try {
                            if (r && (i || a.readyState === 4)) {
                                r = t, o && (a.onreadystatechange = w.noop, Un && delete In[o]);
                                if (i)a.readyState !== 4 && a.abort(); else {
                                    c = {}, u = a.status, f = a.getAllResponseHeaders(), typeof a.responseText == "string" && (c.text = a.responseText);
                                    try {
                                        l = a.statusText
                                    } catch (h) {
                                        l = ""
                                    }
                                    !u && n.isLocal && !n.crossDomain ? u = c.text ? 200 : 404 : u === 1223 && (u = 204)
                                }
                            }
                        } catch (p) {
                            i || s(-1, p)
                        }
                        c && s(u, l, c, f)
                    }, n.async ? a.readyState === 4 ? setTimeout(r) : (o = ++Rn, Un && (In || (In = {}, w(e).unload(Un)), In[o] = r), a.onreadystatechange = r) : r()
                }, abort: function () {
                    r && r(t, !0)
                }
            }
        }
    });
    var Xn, Vn, $n = /^(?:toggle|show|hide)$/, Jn = new RegExp("^(?:([+-])=|)(" + E + ")([a-z%]*)$", "i"), Kn = /queueHooks$/, Qn = [nr], Gn = {
        "*": [function (e, t) {
            var n = this.createTween(e, t), r = n.cur(), i = Jn.exec(t), s = i && i[3] || (w.cssNumber[e] ? "" : "px"), o = (w.cssNumber[e] || s !== "px" && +r) && Jn.exec(w.css(n.elem, e)), u = 1, a = 20;
            if (o && o[3] !== s) {
                s = s || o[3], i = i || [], o = +r || 1;
                do u = u || ".5", o /= u, w.style(n.elem, e, o + s); while (u !== (u = n.cur() / r) && u !== 1 && --a)
            }
            return i && (o = n.start = +o || +r || 0, n.unit = s, n.end = i[1] ? o + (i[1] + 1) * i[2] : +i[2]), n
        }]
    };
    w.Animation = w.extend(er, {
        tweener: function (e, t) {
            w.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            var n, r = 0, i = e.length;
            for (; r < i; r++)n = e[r], Gn[n] = Gn[n] || [], Gn[n].unshift(t)
        }, prefilter: function (e, t) {
            t ? Qn.unshift(e) : Qn.push(e)
        }
    }), w.Tween = rr, rr.prototype = {
        constructor: rr, init: function (e, t, n, r, i, s) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (w.cssNumber[n] ? "" : "px")
        }, cur: function () {
            var e = rr.propHooks[this.prop];
            return e && e.get ? e.get(this) : rr.propHooks._default.get(this)
        }, run: function (e) {
            var t, n = rr.propHooks[this.prop];
            return this.options.duration ? this.pos = t = w.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this
        }
    }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = w.css(e.elem, e.prop, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
            }, set: function (e) {
                w.fx.step[e.prop] ? w.fx.step[e.prop](e) : e.elem.style && (e.elem.style[w.cssProps[e.prop]] != null || w.cssHooks[e.prop]) ? w.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, w.each(["toggle", "show", "hide"], function (e, t) {
        var n = w.fn[t];
        w.fn[t] = function (e, r, i) {
            return e == null || typeof e == "boolean" ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i)
        }
    }), w.fn.extend({
        fadeTo: function (e, t, n, r) {
            return this.filter(nn).css("opacity", 0).show().end().animate({opacity: t}, e, n, r)
        }, animate: function (e, t, n, r) {
            var i = w.isEmptyObject(e), s = w.speed(t, n, r), o = function () {
                var t = er(this, w.extend({}, e), s);
                (i || w._data(this, "finish")) && t.stop(!0)
            };
            return o.finish = o, i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
        }, stop: function (e, n, r) {
            var i = function (e) {
                var t = e.stop;
                delete e.stop, t(r)
            };
            return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function () {
                var t = !0, n = e != null && e + "queueHooks", s = w.timers, o = w._data(this);
                if (n)o[n] && o[n].stop && i(o[n]); else for (n in o)o[n] && o[n].stop && Kn.test(n) && i(o[n]);
                for (n = s.length; n--;)s[n].elem === this && (e == null || s[n].queue === e) && (s[n].anim.stop(r), t = !1, s.splice(n, 1));
                (t || !r) && w.dequeue(this, e)
            })
        }, finish: function (e) {
            return e !== !1 && (e = e || "fx"), this.each(function () {
                var t, n = w._data(this), r = n[e + "queue"], i = n[e + "queueHooks"], s = w.timers, o = r ? r.length : 0;
                n.finish = !0, w.queue(this, e, []), i && i.stop && i.stop.call(this, !0);
                for (t = s.length; t--;)s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                for (t = 0; t < o; t++)r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), w.each({
        slideDown: ir("show"),
        slideUp: ir("hide"),
        slideToggle: ir("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (e, t) {
        w.fn[e] = function (e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), w.speed = function (e, t, n) {
        var r = e && typeof e == "object" ? w.extend({}, e) : {
            complete: n || !n && t || w.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !w.isFunction(t) && t
        };
        r.duration = w.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in w.fx.speeds ? w.fx.speeds[r.duration] : w.fx.speeds._default;
        if (r.queue == null || r.queue === !0)r.queue = "fx";
        return r.old = r.complete, r.complete = function () {
            w.isFunction(r.old) && r.old.call(this), r.queue && w.dequeue(this, r.queue)
        }, r
    }, w.easing = {
        linear: function (e) {
            return e
        }, swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, w.timers = [], w.fx = rr.prototype.init, w.fx.tick = function () {
        var e, n = w.timers, r = 0;
        Xn = w.now();
        for (; r < n.length; r++)e = n[r], !e() && n[r] === e && n.splice(r--, 1);
        n.length ||
        w.fx.stop(), Xn = t
    }, w.fx.timer = function (e) {
        e() && w.timers.push(e) && w.fx.start()
    }, w.fx.interval = 13, w.fx.start = function () {
        Vn || (Vn = setInterval(w.fx.tick, w.fx.interval))
    }, w.fx.stop = function () {
        clearInterval(Vn), Vn = null
    }, w.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, w.fx.step = {}, w.expr && w.expr.filters && (w.expr.filters.animated = function (e) {
        return w.grep(w.timers, function (t) {
            return e === t.elem
        }).length
    }), w.fn.offset = function (e) {
        if (arguments.length)return e === t ? this : this.each(function (t) {
            w.offset.setOffset(this, e, t)
        });
        var n, r, s = {top: 0, left: 0}, o = this[0], u = o && o.ownerDocument;
        if (!u)return;
        return n = u.documentElement, w.contains(n, o) ? (typeof o.getBoundingClientRect !== i && (s = o.getBoundingClientRect()), r = sr(u), {
            top: s.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
            left: s.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
        }) : s
    }, w.offset = {
        setOffset: function (e, t, n) {
            var r = w.css(e, "position");
            r === "static" && (e.style.position = "relative");
            var i = w(e), s = i.offset(), o = w.css(e, "top"), u = w.css(e, "left"), a = (r === "absolute" || r === "fixed") && w.inArray("auto", [o, u]) > -1, f = {}, l = {}, c, h;
            a ? (l = i.position(), c = l.top, h = l.left) : (c = parseFloat(o) || 0, h = parseFloat(u) || 0), w.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using"in t ? t.using.call(e, f) : i.css(f)
        }
    }, w.fn.extend({
        position: function () {
            if (!this[0])return;
            var e, t, n = {top: 0, left: 0}, r = this[0];
            return w.css(r, "position") === "fixed" ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), w.nodeName(e[0], "html") || (n = e.offset()), n.top += w.css(e[0], "borderTopWidth", !0), n.left += w.css(e[0], "borderLeftWidth", !0)), {
                top: t.top - n.top - w.css(r, "marginTop", !0),
                left: t.left - n.left - w.css(r, "marginLeft", !0)
            }
        }, offsetParent: function () {
            return this.map(function () {
                var e = this.offsetParent || u;
                while (e && !w.nodeName(e, "html") && w.css(e, "position") === "static")e = e.offsetParent;
                return e || u
            })
        }
    }), w.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (e, n) {
        var r = /Y/.test(n);
        w.fn[e] = function (i) {
            return w.access(this, function (e, i, s) {
                var o = sr(e);
                if (s === t)return o ? n in o ? o[n] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(r ? w(o).scrollLeft() : s, r ? s : w(o).scrollTop()) : e[i] = s
            }, e, i, arguments.length, null)
        }
    }), w.each({Height: "height", Width: "width"}, function (e, n) {
        w.each({padding: "inner" + e, content: n, "": "outer" + e}, function (r, i) {
            w.fn[i] = function (i, s) {
                var o = arguments.length && (r || typeof i != "boolean"), u = r || (i === !0 || s === !0 ? "margin" : "border");
                return w.access(this, function (n, r, i) {
                    var s;
                    return w.isWindow(n) ? n.document.documentElement["client" + e] : n.nodeType === 9 ? (s = n.documentElement, Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])) : i === t ? w.css(n, r, u) : w.style(n, r, i, u)
                }, n, o ? i : t, o, null)
            }
        })
    }), w.fn.size = function () {
        return this.length
    }, w.fn.andSelf = w.fn.addBack, typeof module == "object" && module && typeof module.exports == "object" ? module.exports = w : (e.jQuery = e.$ = w, typeof define == "function" && define.amd && define("jquery", [], function () {
        return w
    }))
}(window), function (e, t, n) {
    function i(n) {
        var i = t.console;
        r[n] || (r[n] = !0, e.migrateWarnings.push(n), i && i.warn && !e.migrateMute && (i.warn("JQMIGRATE: " + n), e.migrateTrace && i.trace && i.trace()))
    }

    function s(t, n, r, s) {
        if (Object.defineProperty)try {
            Object.defineProperty(t, n, {
                configurable: !0, enumerable: !0, get: function () {
                    return i(s), r
                }, set: function (e) {
                    i(s), r = e
                }
            });
            return
        } catch (o) {
        }
        e._definePropertyBroken = !0, t[n] = r
    }

    var r = {};
    e.migrateWarnings = [], e.migrateMute = !0, !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"), e.migrateTrace === n && (e.migrateTrace = !0), e.migrateReset = function () {
        r = {}, e.migrateWarnings.length = 0
    }, document.compatMode === "BackCompat" && i("jQuery is not compatible with Quirks Mode");
    var o = e("<input/>", {size: 1}).attr("size") && e.attrFn, u = e.attr, a = e.attrHooks.value && e.attrHooks.value.get || function () {
            return null
        }, f = e.attrHooks.value && e.attrHooks.value.set || function () {
            return n
        }, l = /^(?:input|button)$/i, c = /^[238]$/, h = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, p = /^(?:checked|selected)$/i;
    s(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"), e.attr = function (t, r, s, a) {
        var f = r.toLowerCase(), d = t && t.nodeType;
        if (a) {
            u.length < 4 && i("jQuery.fn.attr( props, pass ) is deprecated");
            if (t && !c.test(d) && (o ? r in o : e.isFunction(e.fn[r])))return e(t)[r](s)
        }
        return r === "type" && s !== n && l.test(t.nodeName) && t.parentNode && i("Can't change the 'type' of an input or button in IE 6/7/8"), !e.attrHooks[f] && h.test(f) && (e.attrHooks[f] = {
            get: function (t, r) {
                var i, s = e.prop(t, r);
                return s === !0 || typeof s != "boolean" && (i = t.getAttributeNode(r)) && i.nodeValue !== !1 ? r.toLowerCase() : n
            }, set: function (t, n, r) {
                var i;
                return n === !1 ? e.removeAttr(t, r) : (i = e.propFix[r] || r, i in t && (t[i] = !0), t.setAttribute(r, r.toLowerCase())), r
            }
        }, p.test(f) && i("jQuery.fn.attr('" + f + "') may use property instead of attribute")), u.call(e, t, r, s)
    }, e.attrHooks.value = {
        get: function (e, t) {
            var n = (e.nodeName || "").toLowerCase();
            return n === "button" ? a.apply(this, arguments) : (n !== "input" && n !== "option" && i("jQuery.fn.attr('value') no longer gets properties"), t in e ? e.value : null)
        }, set: function (e, t) {
            var n = (e.nodeName || "").toLowerCase();
            if (n === "button")return f.apply(this, arguments);
            n !== "input" && n !== "option" && i("jQuery.fn.attr('value', val) no longer sets properties"), e.value = t
        }
    };
    var d, v, m = e.fn.init, g = e.parseJSON, y = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
    e.fn.init = function (t, n, r) {
        var s;
        if (t && typeof t == "string" && !e.isPlainObject(n) && (s = y.exec(e.trim(t))) && s[0]) {
            t.charAt(0) !== "<" && i("$(html) HTML strings must start with '<' character"), s[3] && i("$(html) HTML text after last tag is ignored"), s[0].charAt(0) === "#" && (i("HTML string cannot start with a '#' character"), e.error("JQMIGRATE: Invalid selector string (XSS)")), n && n.context && (n = n.context);
            if (e.parseHTML)return m.call(this, e.parseHTML(s[2], n, !0), n, r)
        }
        return m.apply(this, arguments)
    }, e.fn.init.prototype = e.fn, e.parseJSON = function (e) {
        return !e && e !== null ? (i("jQuery.parseJSON requires a valid JSON string"), null) : g.apply(this, arguments)
    }, e.uaMatch = function (e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {browser: t[1] || "", version: t[2] || "0"}
    }, e.browser || (d = e.uaMatch(navigator.userAgent), v = {}, d.browser && (v[d.browser] = !0, v.version = d.version), v.chrome ? v.webkit = !0 : v.webkit && (v.safari = !0), e.browser = v), s(e, "browser", e.browser, "jQuery.browser is deprecated"), e.sub = function () {
        function t(e, n) {
            return new t.fn.init(e, n)
        }

        e.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function (i, s) {
            return s && s instanceof e && !(s instanceof t) && (s = t(s)), e.fn.init.call(this, i, s, n)
        }, t.fn.init.prototype = t.fn;
        var n = t(document);
        return i("jQuery.sub() is deprecated"), t
    }, e.ajaxSetup({converters: {"text json": e.parseJSON}});
    var b = e.fn.data;
    e.fn.data = function (t) {
        var r, s, o = this[0];
        if (o && t === "events" && arguments.length === 1) {
            r = e.data(o, t), s = e._data(o, t);
            if ((r === n || r === s) && s !== n)return i("Use of jQuery.fn.data('events') is deprecated"), s
        }
        return b.apply(this, arguments)
    };
    var w = /\/(java|ecma)script/i, E = e.fn.andSelf || e.fn.addBack;
    e.fn.andSelf = function () {
        return i("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), E.apply(this, arguments)
    }, e.clean || (e.clean = function (t, n, r, s) {
        n = n || document, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, i("jQuery.clean() is deprecated");
        var o, u, a, f, l = [];
        e.merge(l, e.buildFragment(t, n).childNodes);
        if (r) {
            a = function (e) {
                if (!e.type || w.test(e.type))return s ? s.push(e.parentNode ? e.parentNode.removeChild(e) : e) : r.appendChild(e)
            };
            for (o = 0; (u = l[o]) != null; o++)if (!e.nodeName(u, "script") || !a(u))r.appendChild(u), typeof u.getElementsByTagName != "undefined" && (f = e.grep(e.merge([], u.getElementsByTagName("script")), a), l.splice.apply(l, [o + 1, 0].concat(f)), o += f.length)
        }
        return l
    });
    var S = e.event.add, x = e.event.remove, T = e.event.trigger, N = e.fn.toggle, C = e.fn.live, k = e.fn.die, L = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess", A = new RegExp("\\b(?:" + L + ")\\b"), O = /(?:^|\s)hover(\.\S+|)\b/, M = function (t) {
        return typeof t != "string" || e.event.special.hover ? t : (O.test(t) && i("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), t && t.replace(O, "mouseenter$1 mouseleave$1"))
    };
    e.event.props && e.event.props[0] !== "attrChange" && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), e.event.dispatch && s(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), e.event.add = function (e, t, n, r, s) {
        e !== document && A.test(t) && i("AJAX events should be attached to document: " + t), S.call(this, e, M(t || ""), n, r, s)
    }, e.event.remove = function (e, t, n, r, i) {
        x.call(this, e, M(t) || "", n, r, i)
    }, e.fn.error = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return i("jQuery.fn.error() is deprecated"), e.splice(0, 0, "error"), arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e), this)
    }, e.fn.toggle = function (t, n) {
        if (!e.isFunction(t) || !e.isFunction(n))return N.apply(this, arguments);
        i("jQuery.fn.toggle(handler, handler...) is deprecated");
        var r = arguments, s = t.guid || e.guid++, o = 0, u = function (n) {
            var i = (e._data(this, "lastToggle" + t.guid) || 0) % o;
            return e._data(this, "lastToggle" + t.guid, i + 1), n.preventDefault(), r[i].apply(this, arguments) || !1
        };
        u.guid = s;
        while (o < r.length)r[o++].guid = s;
        return this.click(u)
    }, e.fn.live = function (t, n, r) {
        return i("jQuery.fn.live() is deprecated"), C ? C.apply(this, arguments) : (e(this.context).on(t, this.selector, n, r), this)
    }, e.fn.die = function (t, n) {
        return i("jQuery.fn.die() is deprecated"), k ? k.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n), this)
    }, e.event.trigger = function (e, t, n, r) {
        return !n && !A.test(e) && i("Global events are undocumented and deprecated"), T.call(this, e, t, n || document, r)
    }, e.each(L.split("|"), function (t, n) {
        e.event.special[n] = {
            setup: function () {
                var t = this;
                return t !== document && (e.event.add(document, n + "." + e.guid, function () {
                    e.event.trigger(n, null, t, !0)
                }), e._data(this, n, e.guid++)), !1
            }, teardown: function () {
                return this !== document && e.event.remove(document, n + "." + e._data(this, n)), !1
            }
        }
    })
}(jQuery, window), function () {
    "use strict";
    var e = "undefined", t = "string", n = self.navigator, r = String, i = Object.prototype.hasOwnProperty, s = {}, o = {}, u = !1, a = !0, f = /^\s*application\/(?:vnd\.oftn\.|x-)?l10n\+json\s*(?:$|;)/i, l, c = "locale", h = "defaultLocale", p = "toLocaleString", d = "toLowerCase", v = Array.prototype.indexOf || function (e) {
            var t = this.length, n = 0;
            for (; n < t; n++)if (n in this && this[n] === e)return n;
            return -1
        }, m = function (e) {
        var t = new l;
        return t.open("GET", e, u), t.send(null), t.status !== 200 ? (setTimeout(function () {
            var t = new Error("Unable to load localization data: " + e);
            throw t.name = "Localization Error", t
        }, 0), {}) : JSON.parse(t.responseText)
    }, g = r[p] = function (e) {
        if (arguments.length > 0 && typeof e != "number")if (typeof e === t)g(m(e)); else if (e === u)o = {}; else {
            var n, a, f;
            for (n in e)if (i.call(e, n)) {
                a = e[n], n = n[d]();
                if (!(n in o) || a === u)o[n] = {};
                if (a === u)continue;
                if (typeof a === t) {
                    if (r[c][d]().indexOf(n) !== 0) {
                        n in s || (s[n] = []), s[n].push(a);
                        continue
                    }
                    a = m(a)
                }
                for (f in a)i.call(a, f) && (o[n][f] = a[f])
            }
        }
        return Function.prototype[p].apply(r, arguments)
    }, y = function (e) {
        var t = s[e], n = 0, r = t.length, i;
        for (; n < r; n++)i = {}, i[e] = m(t[n]), g(i);
        delete s[e]
    }, b, w = r.prototype[p] = function () {
        var e = b, t = r[e ? h : c], n = t[d]().split("-"), i = n.length, f = this.valueOf(), l;
        b = u;
        do {
            l = n.slice(0, i).join("-"), l in s && y(l);
            if (l in o && f in o[l])return o[l][f]
        } while (i-- > 1);
        return !e && r[h] ? (b = a, w.call(f)) : f
    };
    if (typeof XMLHttpRequest === e && typeof ActiveXObject !== e) {
        var E = ActiveXObject;
        l = function () {
            try {
                return new E("Msxml2.XMLHTTP.6.0")
            } catch (e) {
            }
            try {
                return new E("Msxml2.XMLHTTP.3.0")
            } catch (t) {
            }
            try {
                return new E("Msxml2.XMLHTTP")
            } catch (n) {
            }
            throw new Error("XMLHttpRequest not supported by this browser.")
        }
    } else l = XMLHttpRequest;
    r[h] = r[h] || "", r[c] = n && (n.language || n.userLanguage) || "";
    if (typeof document !== e) {
        var S = document.getElementsByTagName("link"), x = S.length, T;
        while (x--) {
            var N = S[x], C = (N.getAttribute("rel") || "")[d]().split(/\s+/);
            f.test(N.type) && (v.call(C, "localizations") !== -1 ? g(N.getAttribute("href")) : v.call(C, "localization") !== -1 && (T = {}, T[(N.getAttribute("hreflang") || "")[d]()] = N.getAttribute("href"), g(T)))
        }
    }
}(), function () {
    var e = this, t = e._, n = {}, r = Array.prototype, i = Object.prototype, s = Function.prototype, o = r.push, u = r.slice, a = r.concat, f = i.toString, l = i.hasOwnProperty, c = r.forEach, h = r.map, p = r.reduce, d = r.reduceRight, v = r.filter, m = r.every, g = r.some, y = r.indexOf, b = r.lastIndexOf, w = Array.isArray, E = Object.keys, S = s.bind, x = function (e) {
        return e instanceof x ? e : this instanceof x ? (this._wrapped = e, void 0) : new x(e)
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = x), exports._ = x) : e._ = x, x.VERSION = "1.4.3";
    var T = x.each = x.forEach = function (e, t, r) {
        if (null != e)if (c && e.forEach === c)e.forEach(t, r); else if (e.length === +e.length) {
            for (var i = 0, s = e.length; s > i; i++)if (t.call(r, e[i], i, e) === n)return
        } else for (var o in e)if (x.has(e, o) && t.call(r, e[o], o, e) === n)return
    };
    x.map = x.collect = function (e, t, n) {
        var r = [];
        return null == e ? r : h && e.map === h ? e.map(t, n) : (T(e, function (e, i, s) {
            r[r.length] = t.call(n, e, i, s)
        }), r)
    };
    var N = "Reduce of empty array with no initial value";
    x.reduce = x.foldl = x.inject = function (e, t, n, r) {
        var i = arguments.length > 2;
        if (null == e && (e = []), p && e.reduce === p)return r && (t = x.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
        if (T(e, function (e, s, o) {
                i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
            }), !i)throw new TypeError(N);
        return n
    }, x.reduceRight = x.foldr = function (e, t, n, r) {
        var i = arguments.length > 2;
        if (null == e && (e = []), d && e.reduceRight === d)return r && (t = x.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
        var s = e.length;
        if (s !== +s) {
            var o = x.keys(e);
            s = o.length
        }
        if (T(e, function (u, a, f) {
                a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0)
            }), !i)throw new TypeError(N);
        return n
    }, x.find = x.detect = function (e, t, n) {
        var r;
        return C(e, function (e, i, s) {
            return t.call(n, e, i, s) ? (r = e, !0) : void 0
        }), r
    }, x.filter = x.select = function (e, t, n) {
        var r = [];
        return null == e ? r : v && e.filter === v ? e.filter(t, n) : (T(e, function (e, i, s) {
            t.call(n, e, i, s) && (r[r.length] = e)
        }), r)
    }, x.reject = function (e, t, n) {
        return x.filter(e, function (e, r, i) {
            return !t.call(n, e, r, i)
        }, n)
    }, x.every = x.all = function (e, t, r) {
        t || (t = x.identity);
        var i = !0;
        return null == e ? i : m && e.every === m ? e.every(t, r) : (T(e, function (e, s, o) {
            return (i = i && t.call(r, e, s, o)) ? void 0 : n
        }), !!i)
    };
    var C = x.some = x.any = function (e, t, r) {
        t || (t = x.identity);
        var i = !1;
        return null == e ? i : g && e.some === g ? e.some(t, r) : (T(e, function (e, s, o) {
            return i || (i = t.call(r, e, s, o)) ? n : void 0
        }), !!i)
    };
    x.contains = x.include = function (e, t) {
        return null == e ? !1 : y && e.indexOf === y ? -1 != e.indexOf(t) : C(e, function (e) {
            return e === t
        })
    }, x.invoke = function (e, t) {
        var n = u.call(arguments, 2);
        return x.map(e, function (e) {
            return (x.isFunction(t) ? t : e[t]).apply(e, n)
        })
    }, x.pluck = function (e, t) {
        return x.map(e, function (e) {
            return e[t]
        })
    }, x.where = function (e, t) {
        return x.isEmpty(t) ? [] : x.filter(e, function (e) {
            for (var n in t)if (t[n] !== e[n])return !1;
            return !0
        })
    }, x.max = function (e, t, n) {
        if (!t && x.isArray(e) && e[0] === +e[0] && 65535 > e.length)return Math.max.apply(Math, e);
        if (!t && x.isEmpty(e))return -1 / 0;
        var r = {computed: -1 / 0, value: -1 / 0};
        return T(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            o >= r.computed && (r = {value: e, computed: o})
        }), r.value
    }, x.min = function (e, t, n) {
        if (!t && x.isArray(e) && e[0] === +e[0] && 65535 > e.length)return Math.min.apply(Math, e);
        if (!t && x.isEmpty(e))return 1 / 0;
        var r = {computed: 1 / 0, value: 1 / 0};
        return T(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            r.computed > o && (r = {value: e, computed: o})
        }), r.value
    }, x.shuffle = function (e) {
        var t, n = 0, r = [];
        return T(e, function (e) {
            t = x.random(n++), r[n - 1] = r[t], r[t] = e
        }), r
    };
    var k = function (e) {
        return x.isFunction(e) ? e : function (t) {
            return t[e]
        }
    };
    x.sortBy = function (e, t, n) {
        var r = k(t);
        return x.pluck(x.map(e, function (e, t, i) {
            return {value: e, index: t, criteria: r.call(n, e, t, i)}
        }).sort(function (e, t) {
            var n = e.criteria, r = t.criteria;
            if (n !== r) {
                if (n > r || void 0 === n)return 1;
                if (r > n || void 0 === r)return -1
            }
            return e.index < t.index ? -1 : 1
        }), "value")
    };
    var L = function (e, t, n, r) {
        var i = {}, s = k(t || x.identity);
        return T(e, function (t, o) {
            var u = s.call(n, t, o, e);
            r(i, u, t)
        }), i
    };
    x.groupBy = function (e, t, n) {
        return L(e, t, n, function (e, t, n) {
            (x.has(e, t) ? e[t] : e[t] = []).push(n)
        })
    }, x.countBy = function (e, t, n) {
        return L(e, t, n, function (e, t) {
            x.has(e, t) || (e[t] = 0), e[t]++
        })
    }, x.sortedIndex = function (e, t, n, r) {
        n = null == n ? x.identity : k(n);
        for (var i = n.call(r, t), s = 0, o = e.length; o > s;) {
            var u = s + o >>> 1;
            i > n.call(r, e[u]) ? s = u + 1 : o = u
        }
        return s
    }, x.toArray = function (e) {
        return e ? x.isArray(e) ? u.call(e) : e.length === +e.length ? x.map(e, x.identity) : x.values(e) : []
    }, x.size = function (e) {
        return null == e ? 0 : e.length === +e.length ? e.length : x.keys(e).length
    }, x.first = x.head = x.take = function (e, t, n) {
        return null == e ? void 0 : null == t || n ? e[0] : u.call(e, 0, t)
    }, x.initial = function (e, t, n) {
        return u.call(e, 0, e.length - (null == t || n ? 1 : t))
    }, x.last = function (e, t, n) {
        return null == e ? void 0 : null == t || n ? e[e.length - 1] : u.call(e, Math.max(e.length - t, 0))
    }, x.rest = x.tail = x.drop = function (e, t, n) {
        return u.call(e, null == t || n ? 1 : t)
    }, x.compact = function (e) {
        return x.filter(e, x.identity)
    };
    var A = function (e, t, n) {
        return T(e, function (e) {
            x.isArray(e) ? t ? o.apply(n, e) : A(e, t, n) : n.push(e)
        }), n
    };
    x.flatten = function (e, t) {
        return A(e, t, [])
    }, x.without = function (e) {
        return x.difference(e, u.call(arguments, 1))
    }, x.uniq = x.unique = function (e, t, n, r) {
        x.isFunction(t) && (r = n, n = t, t = !1);
        var i = n ? x.map(e, n, r) : e, s = [], o = [];
        return T(i, function (n, r) {
            (t ? r && o[o.length - 1] === n : x.contains(o, n)) || (o.push(n), s.push(e[r]))
        }), s
    }, x.union = function () {
        return x.uniq(a.apply(r, arguments))
    }, x.intersection = function (e) {
        var t = u.call(arguments, 1);
        return x.filter(x.uniq(e), function (e) {
            return x.every(t, function (t) {
                return x.indexOf(t, e) >= 0
            })
        })
    }, x.difference = function (e) {
        var t = a.apply(r, u.call(arguments, 1));
        return x.filter(e, function (e) {
            return !x.contains(t, e)
        })
    }, x.zip = function () {
        for (var e = u.call(arguments), t = x.max(x.pluck(e, "length")), n = Array(t), r = 0; t > r; r++)n[r] = x.pluck(e, "" + r);
        return n
    }, x.object = function (e, t) {
        if (null == e)return {};
        for (var n = {}, r = 0, i = e.length; i > r; r++)t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
        return n
    }, x.indexOf = function (e, t, n) {
        if (null == e)return -1;
        var r = 0, i = e.length;
        if (n) {
            if ("number" != typeof n)return r = x.sortedIndex(e, t), e[r] === t ? r : -1;
            r = 0 > n ? Math.max(0, i + n) : n
        }
        if (y && e.indexOf === y)return e.indexOf(t, n);
        for (; i > r; r++)if (e[r] === t)return r;
        return -1
    }, x.lastIndexOf = function (e, t, n) {
        if (null == e)return -1;
        var r = null != n;
        if (b && e.lastIndexOf === b)return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
        for (var i = r ? n : e.length; i--;)if (e[i] === t)return i;
        return -1
    }, x.range = function (e, t, n) {
        1 >= arguments.length && (t = e || 0, e = 0), n = arguments[2] || 1;
        for (var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = Array(r); r > i;)s[i++] = e, e += n;
        return s
    };
    var O = function () {
    };
    x.bind = function (e, t) {
        var n, r;
        if (e.bind === S && S)return S.apply(e, u.call(arguments, 1));
        if (!x.isFunction(e))throw new TypeError;
        return n = u.call(arguments, 2), r = function () {
            if (this instanceof r) {
                O.prototype = e.prototype;
                var i = new O;
                O.prototype = null;
                var s = e.apply(i, n.concat(u.call(arguments)));
                return Object(s) === s ? s : i
            }
            return e.apply(t, n.concat(u.call(arguments)))
        }
    }, x.bindAll = function (e) {
        var t = u.call(arguments, 1);
        return 0 == t.length && (t = x.functions(e)), T(t, function (t) {
            e[t] = x.bind(e[t], e)
        }), e
    }, x.memoize = function (e, t) {
        var n = {};
        return t || (t = x.identity), function () {
            var r = t.apply(this, arguments);
            return x.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
        }
    }, x.delay = function (e, t) {
        var n = u.call(arguments, 2);
        return setTimeout(function () {
            return e.apply(null, n)
        }, t)
    }, x.defer = function (e) {
        return x.delay.apply(x, [e, 1].concat(u.call(arguments, 1)))
    }, x.throttle = function (e, t) {
        var n, r, i, s, o = 0, u = function () {
            o = new Date, i = null, s = e.apply(n, r)
        };
        return function () {
            var a = new Date, f = t - (a - o);
            return n = this, r = arguments, 0 >= f ? (clearTimeout(i), i = null, o = a, s = e.apply(n, r)) : i || (i = setTimeout(u, f)), s
        }
    }, x.debounce = function (e, t, n) {
        var r, i;
        return function () {
            var s = this, o = arguments, u = function () {
                r = null, n || (i = e.apply(s, o))
            }, a = n && !r;
            return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i
        }
    }, x.once = function (e) {
        var t, n = !1;
        return function () {
            return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t)
        }
    }, x.wrap = function (e, t) {
        return function () {
            var n = [e];
            return o.apply(n, arguments), t.apply(this, n)
        }
    }, x.compose = function () {
        var e = arguments;
        return function () {
            for (var t = arguments, n = e.length - 1; n >= 0; n--)t = [e[n].apply(this, t)];
            return t[0]
        }
    }, x.after = function (e, t) {
        return 0 >= e ? t() : function () {
            return 1 > --e ? t.apply(this, arguments) : void 0
        }
    }, x.keys = E || function (e) {
            if (e !== Object(e))throw new TypeError("Invalid object");
            var t = [];
            for (var n in e)x.has(e, n) && (t[t.length] = n);
            return t
        }, x.values = function (e) {
        var t = [];
        for (var n in e)x.has(e, n) && t.push(e[n]);
        return t
    }, x.pairs = function (e) {
        var t = [];
        for (var n in e)x.has(e, n) && t.push([n, e[n]]);
        return t
    }, x.invert = function (e) {
        var t = {};
        for (var n in e)x.has(e, n) && (t[e[n]] = n);
        return t
    }, x.functions = x.methods = function (e) {
        var t = [];
        for (var n in e)x.isFunction(e[n]) && t.push(n);
        return t.sort()
    }, x.extend = function (e) {
        return T(u.call(arguments, 1), function (t) {
            if (t)for (var n in t)e[n] = t[n]
        }), e
    }, x.pick = function (e) {
        var t = {}, n = a.apply(r, u.call(arguments, 1));
        return T(n, function (n) {
            n in e && (t[n] = e[n])
        }), t
    }, x.omit = function (e) {
        var t = {}, n = a.apply(r, u.call(arguments, 1));
        for (var i in e)x.contains(n, i) || (t[i] = e[i]);
        return t
    }, x.defaults = function (e) {
        return T(u.call(arguments, 1), function (t) {
            if (t)for (var n in t)null == e[n] && (e[n] = t[n])
        }), e
    }, x.clone = function (e) {
        return x.isObject(e) ? x.isArray(e) ? e.slice() : x.extend({}, e) : e
    }, x.tap = function (e, t) {
        return t(e), e
    };
    var M = function (e, t, n, r) {
        if (e === t)return 0 !== e || 1 / e == 1 / t;
        if (null == e || null == t)return e === t;
        e instanceof x && (e = e._wrapped), t instanceof x && (t = t._wrapped);
        var i = f.call(e);
        if (i != f.call(t))return !1;
        switch (i) {
            case"[object String]":
                return e == t + "";
            case"[object Number]":
                return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
            case"[object Date]":
            case"[object Boolean]":
                return +e == +t;
            case"[object RegExp]":
                return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
        }
        if ("object" != typeof e || "object" != typeof t)return !1;
        for (var s = n.length; s--;)if (n[s] == e)return r[s] == t;
        n.push(e), r.push(t);
        var o = 0, u = !0;
        if ("[object Array]" == i) {
            if (o = e.length, u = o == t.length)for (; o-- && (u = M(e[o], t[o], n, r)););
        } else {
            var a = e.constructor, l = t.constructor;
            if (a !== l && !(x.isFunction(a) && a instanceof a && x.isFunction(l) && l instanceof l))return !1;
            for (var c in e)if (x.has(e, c) && (o++, !(u = x.has(t, c) && M(e[c], t[c], n, r))))break;
            if (u) {
                for (c in t)if (x.has(t, c) && !(o--))break;
                u = !o
            }
        }
        return n.pop(), r.pop(), u
    };
    x.isEqual = function (e, t) {
        return M(e, t, [], [])
    }, x.isEmpty = function (e) {
        if (null == e)return !0;
        if (x.isArray(e) || x.isString(e))return 0 === e.length;
        for (var t in e)if (x.has(e, t))return !1;
        return !0
    }, x.isElement = function (e) {
        return !!e && 1 === e.nodeType
    }, x.isArray = w || function (e) {
            return "[object Array]" == f.call(e)
        }, x.isObject = function (e) {
        return e === Object(e)
    }, T(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
        x["is" + e] = function (t) {
            return f.call(t) == "[object " + e + "]"
        }
    }), x.isArguments(arguments) || (x.isArguments = function (e) {
        return !!e && !!x.has(e, "callee")
    }), x.isFunction = function (e) {
        return "function" == typeof e
    }, x.isFinite = function (e) {
        return isFinite(e) && !isNaN(parseFloat(e))
    }, x.isNaN = function (e) {
        return x.isNumber(e) && e != +e
    }, x.isBoolean = function (e) {
        return e === !0 || e === !1 || "[object Boolean]" == f.call(e)
    }, x.isNull = function (e) {
        return null === e
    }, x.isUndefined = function (e) {
        return void 0 === e
    }, x.has = function (e, t) {
        return l.call(e, t)
    }, x.noConflict = function () {
        return e._ = t, this
    }, x.identity = function (e) {
        return e
    }, x.times = function (e, t, n) {
        for (var r = Array(e), i = 0; e > i; i++)r[i] = t.call(n, i);
        return r
    }, x.random = function (e, t) {
        return null == t && (t = e, e = 0), e + (0 | Math.random() * (t - e + 1))
    };
    var _ = {escape: {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;"}};
    _.unescape = x.invert(_.escape);
    var D = {
        escape: RegExp("[" + x.keys(_.escape).join("") + "]", "g"),
        unescape: RegExp("(" + x.keys(_.unescape).join("|") + ")", "g")
    };
    x.each(["escape", "unescape"], function (e) {
        x[e] = function (t) {
            return null == t ? "" : ("" + t).replace(D[e], function (t) {
                return _[e][t]
            })
        }
    }), x.result = function (e, t) {
        if (null == e)return null;
        var n = e[t];
        return x.isFunction(n) ? n.call(e) : n
    }, x.mixin = function (e) {
        T(x.functions(e), function (t) {
            var n = x[t] = e[t];
            x.prototype[t] = function () {
                var e = [this._wrapped];
                return o.apply(e, arguments), F.call(this, n.apply(x, e))
            }
        })
    };
    var P = 0;
    x.uniqueId = function (e) {
        var t = "" + ++P;
        return e ? e + t : t
    }, x.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g};
    var H = /(.)^/, B = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, j = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    x.template = function (e, t, n) {
        n = x.defaults({}, n, x.templateSettings);
        var r = RegExp([(n.escape || H).source, (n.interpolate || H).source, (n.evaluate || H).source].join("|") + "|$", "g"), i = 0, s = "__p+='";
        e.replace(r, function (t, n, r, o, u) {
            return s += e.slice(i, u).replace(j, function (e) {
                return "\\" + B[e]
            }), n && (s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), r && (s += "'+\n((__t=(" + r + "))==null?'':__t)+\n'"), o && (s += "';\n" + o + "\n__p+='"), i = u + t.length, t
        }), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
        try {
            var o = Function(n.variable || "obj", "_", s)
        } catch (u) {
            throw u.source = s, u
        }
        if (t)return o(t, x);
        var a = function (e) {
            return o.call(this, e, x)
        };
        return a.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", a
    }, x.chain = function (e) {
        return x(e).chain()
    };
    var F = function (e) {
        return this._chain ? x(e).chain() : e
    };
    x.mixin(x), T(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
        var t = r[e];
        x.prototype[e] = function () {
            var n = this._wrapped;
            return t.apply(n, arguments), "shift" != e && "splice" != e || 0 !== n.length || delete n[0], F.call(this, n)
        }
    }), T(["concat", "join", "slice"], function (e) {
        var t = r[e];
        x.prototype[e] = function () {
            return F.call(this, t.apply(this._wrapped, arguments))
        }
    }), x.extend(x.prototype, {
        chain: function () {
            return this._chain = !0, this
        }, value: function () {
            return this._wrapped
        }
    })
}.call(this), _.templateSettings = {
    evaluate: /\[\[(.+?)\]\]/g,
    interpolate: /\{\{(.+?)\}\}/g
}, String.toLocaleString({
    en: {
        "%rechoose": "rechoose",
        "%delete": "delete",
        "%warn_system_file": "system file is not allowed",
        "%warn_exec_file": "EXE/BAT format file is not allowed",
        "%file_name_too_long": "file name is too long",
        "%warn_oversize": "file size is over {{maxSize}}",
        "%warn_wrong_mobile_number": "please enter correct mobile number of mainland China",
        "%total": "total",
        "%download": "download",
        "%sold_out": "sold out",
        "%common_separator": ", ",
        "%resend": "resend SMS",
        "%sendingSMS": "sending SMS",
        "%warn_geo_cannot_get_location": "Can't get your location!",
        "%warn_geo_permission_denied": "You denied the request for Geolocation.",
        "%warn_geo_position_unavailable": "Location information is unavailable.",
        "%warn_geo_timeout": "The request to get your location timed out.",
        "%warn_geo_unknown_error": "An unknown error occurred.",
        "%geo_coord": "Longitude:{{long}},Latitude:{{lat}}",
        "%geo_address": "{{address}}",
        "%geo_choose": "Choose location",
        "%geo_locate": "Get current location",
        "%geo_locating": "Locating...",
        "%geo_no_address": "No address information. ",
        "%select_prompt": "Please select",
        "%no_geo_data": "There is no data for this field currently.",
        "%bracket": " ({{content}})",
        "%upload_failed": "failed {{status}}, please contact system admin",
        "%upload_failed_400": "failed, changed to standard mode, please try again",
        "%upload_failed_401": "failed, please refresh page and try again",
        "%uploading": "Uploading...",
        "%upload_done": "Uploading finished!",
        "%max_file_quantity": "File quantity is over {{maxFileQuantity}}",
        "%page_number": "Page {{currentPage}}/{{totalPage}}"
    },
    "zh-CN": {
        "%rechoose": "请重新选择",
        "%delete": "刪除",
        "%warn_system_file": "禁止上传系统文件",
        "%warn_exec_file": "禁止上传EXE、BAT格式的文件",
        "%file_name_too_long": "文件名过长",
        "%warn_oversize": "文件超过了{{maxSize}}",
        "%warn_wrong_mobile_number": "请输入正确的中国大陆手机号码",
        "%total": "合计",
        "%download": "下载",
        "%sold_out": "已售空",
        "%common_separator": "、",
        "%resend": "重新发送",
        "%sendingSMS": "正在发送短信",
        "%warn_geo_cannot_get_location": "无法定位您的位置！",
        "%warn_geo_permission_denied": "无法定位您的位置！请打开浏览器的位置共享权限",
        "%warn_geo_position_unavailable": "无法定位您的位置！位置信息不可用",
        "%warn_geo_timeout": "无法定位您的位置！获取经纬度超时",
        "%warn_geo_unknown_error": "无法定位您的位置！未知错误",
        "%geo_coord": "经度:{{long}}，纬度:{{lat}}",
        "%geo_address": "{{address}}",
        "%geo_choose": "获取地理位置",
        "%geo_locate": "获取当前位置",
        "%geo_locating": "获取位置中...",
        "%geo_no_address": "无法获取地址。",
        "%select_prompt": "请选择",
        "%no_geo_data": "该地理位置字段暂无数据。",
        "%bracket": "({{content}})",
        "%upload_failed": "上传失败{{status}}，请联系管理员",
        "%upload_failed_400": "该浏览器不支持极速上传模式，现已调整为传统模式。请选择文件重新上传。",
        "%upload_failed_401": "上传失败，请刷新页面，并在1小时内重新上传",
        "%uploading": "上传中...",
        "%upload_done": "上传成功！",
        "%max_file_quantity": "最多只能上传{{maxFileQuantity}}个文件",
        "%page_number": "第{{currentPage}}页/共{{totalPage}}页"
    },
    "zh-TW": {
        "%rechoose": "請重新選擇",
        "%delete": "刪除",
        "%warn_system_file": "禁止上傳系統檔案",
        "%warn_exec_file": "禁止上傳EXE、BAT格式的檔案",
        "%file_name_too_long": "檔案名過長",
        "%warn_oversize": "檔案超過了{{maxSize}}",
        "%warn_wrong_mobile_number": "請輸入正確的中國大陸手機號碼",
        "%total": "合計",
        "%download": "下載",
        "%sold_out": "已售罄",
        "%common_separator": "、",
        "%resend": "重新發送",
        "%sendingSMS": "正在發送簡訊",
        "%warn_geo_cannot_get_location": "無法定位您的位置！",
        "%warn_geo_permission_denied": "無法定位您的位置！請打開瀏覽器的位置共用許可權",
        "%warn_geo_position_unavailable": "無法定位您的位置！位置資訊不可用",
        "%warn_geo_timeout": "無法定位您的位置！獲取經緯度超時",
        "%warn_geo_unknown_error": "無法定位您的位置！未知錯誤",
        "%geo_coord": "經度:{{long}}，緯度:{{lat}}",
        "%geo_address": "{{address}}",
        "%geo_choose": "獲取地理位置",
        "%geo_locate": "獲取當前位置",
        "%geo_locating": "獲取位置中...",
        "%geo_no_address": "無法獲取地址。",
        "%select_prompt": "請選擇",
        "%no_geo_data": "該地理位置字段暫無數據。",
        "%bracket": "（{{content}}）",
        "%upload_failed": "上傳失敗{{status}}，請聯繫管理員",
        "%upload_failed_400": "該瀏覽器不支援極速上傳模式，現已調整為傳統模式。請選擇檔案重新上傳。",
        "%upload_failed_401": "上傳失敗，請刷新頁面，並在1小時內重新上傳",
        "%uploading": "上傳中...",
        "%upload_done": "上傳成功！",
        "%max_file_quantity": "最多只能上傳{{maxFileQuantity}}個檔案",
        "%page_number": "第{{currentPage}}頁/共{{totalPage}}頁"
    }
});
var l = function (e, t) {
    return t == null && (t = {}), _.template(e.toLocaleString(), t)
};
String.locale = "zh-CN", function () {
    window.GoldenData || (window.GoldenData = {}), GoldenData.ShareIt = function () {
        function e() {
        }

        return e.prototype.setEntry = function (e) {
            return this.title = encodeURIComponent(e.title || document.title), this.url = encodeURIComponent((e.url || document.location).replace("https://", "http://")), this.pic = encodeURIComponent(e.pic || ""), this.description = encodeURIComponent(e.description || "")
        }, e.prototype.weibo = function () {
            var e, t, n;
            return e = 1843447738, t = "http://v.t.sina.com.cn/share/share.php?appkey=" + e + "&title=" + this.title + "&url=" + this.url + "&pic=" + this.pic, n = "width=700,height=480, top=" + (screen.height - 430) / 2 + ", left=" + (screen.width - 440) / 2 + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=1, status=no", window.open(t, "分享到微博", n)
        }, e.prototype.qqmb = function () {
            var e, t;
            return e = "http://v.t.qq.com/share/share.php?title=" + this.title + "&url=" + this.url + "&pic=" + this.pic, t = "width=600, height=480, top=" + (screen.height - 700) / 2 + ", left=" + (screen.width - 580) / 2 + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no", window.open(e, "转播到腾讯微博", t)
        }, e.prototype.qzone = function () {
            var e, t, n;
            return e = "" + this.title + " - " + this.description, t = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + e + "&url=" + this.url, n = "width=700, height=600, top=" + (screen.height - 700) / 2 + ", left=" + (screen.width - 600) / 2 + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no", window.open(t, "分享到QZONE", n)
        }, e.prototype.renren = function () {
            var e, t;
            return e = "http://widget.renren.com/dialog/share?title=" + this.title + "&resourceUrl=" + this.url + "&images=" + this.pic + "&description=" + this.description, t = "width=700, height=600, top=" + (screen.height - 700) / 2 + ", left=" + (screen.width - 600) / 2 + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no", window.open(e, "分享到人人", t)
        }, e.prototype.mingdao = function () {
            var e, t, n;
            return e = "76AE474AF1B8DC75A387FEC4EECF4CAB", t = "http://www.mingdao.com/share?title=" + this.title + "&url=" + this.url + "&pic=" + this.pic + "&appkey=" + e, n = "width=700, height=600, top=" + (screen.height - 700) / 2 + ", left=" + (screen.width - 600) / 2 + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no", window.open(t, "分享到明道", n)
        }, e
    }(), window.shareIt = new GoldenData.ShareIt
}.call(this), function (e) {
    e.extend(e.fn, {
        livequery: function (t, n, r) {
            var i = this, s;
            return e.isFunction(t) && (r = n, n = t, t = undefined), e.each(e.livequery.queries, function (e, o) {
                if (i.selector == o.selector && i.context == o.context && t == o.type && (!n || n.$lqguid == o.fn.$lqguid) && (!r || r.$lqguid == o.fn2.$lqguid))return (s = o) && !1
            }), s = s || new e.livequery(this.selector, this.context, t, n, r), s.stopped = !1, s.run(), this
        }, expire: function (t, n, r) {
            var i = this;
            return e.isFunction(t) && (r = n, n = t, t = undefined), e.each(e.livequery.queries, function (s, o) {
                i.selector == o.selector && i.context == o.context && (!t || t == o.type) && (!n || n.$lqguid == o.fn.$lqguid) && (!r || r.$lqguid == o.fn2.$lqguid) && !this.stopped && e.livequery.stop(o.id)
            }), this
        }
    }), e.livequery = function (t, n, r, i, s) {
        return this.selector = t, this.context = n, this.type = r, this.fn = i, this.fn2 = s, this.elements = [], this.stopped = !1, this.id = e.livequery.queries.push(this) - 1, i.$lqguid = i.$lqguid || e.livequery.guid++, s && (s.$lqguid = s.$lqguid || e.livequery.guid++), this
    }, e.livequery.prototype = {
        stop: function () {
            var e = this;
            this.type ? this.elements.unbind(this.type, this.fn) : this.fn2 && this.elements.each(function (t, n) {
                e.fn2.apply(n)
            }), this.elements = [], this.stopped = !0
        }, run: function () {
            if (this.stopped)return;
            var t = this, n = this.elements, r = e(this.selector, this.context), i = r.not(n);
            this.elements = r, this.type ? (i.bind(this.type, this.fn), n.length > 0 && e.each(n, function (n, i) {
                e.inArray(i, r) < 0 && e.event.remove(i, t.type, t.fn)
            })) : (i.each(function () {
                t.fn.apply(this)
            }), this.fn2 && n.length > 0 && e.each(n, function (n, i) {
                e.inArray(i, r) < 0 && t.fn2.apply(i)
            }))
        }
    }, e.extend(e.livequery, {
        guid: 0, queries: [], queue: [], running: !1, timeout: null, checkQueue: function () {
            if (e.livequery.running && e.livequery.queue.length) {
                var t = e.livequery.queue.length;
                while (t--)e.livequery.queries[e.livequery.queue.shift()].run()
            }
        }, pause: function () {
            e.livequery.running = !1
        }, play: function () {
            e.livequery.running = !0, e.livequery.run()
        }, registerPlugin: function () {
            e.each(arguments, function (t, n) {
                if (!e.fn[n])return;
                var r = e.fn[n];
                e.fn[n] = function () {
                    var t = r.apply(this, arguments);
                    return e.livequery.run(), t
                }
            })
        }, run: function (t) {
            t != undefined ? e.inArray(t, e.livequery.queue) < 0 && e.livequery.queue.push(t) : e.each(e.livequery.queries, function (t) {
                e.inArray(t, e.livequery.queue) < 0 && e.livequery.queue.push(t)
            }), e.livequery.timeout && clearTimeout(e.livequery.timeout), e.livequery.timeout = setTimeout(e.livequery.checkQueue, 20)
        }, stop: function (t) {
            t != undefined ? e.livequery.queries[t].stop() : e.each(e.livequery.queries, function (t) {
                e.livequery.queries[t].stop()
            })
        }
    }), e.livequery.registerPlugin("append", "prepend", "after", "before", "wrap", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "empty", "remove", "html"), e(function () {
        e.livequery.play()
    })
}(jQuery), function (e, t) {
    "use strict";
    function r() {
        if (n.READY)return;
        n.event.determineEventTypes();
        for (var e in n.gestures)n.gestures.hasOwnProperty(e) && n.detection.register(n.gestures[e]);
        n.event.onTouch(n.DOCUMENT, n.EVENT_MOVE, n.detection.detect), n.event.onTouch(n.DOCUMENT, n.EVENT_END, n.detection.detect), n.READY = !0
    }

    var n = function (e, t) {
        return new n.Instance(e, t || {})
    };
    n.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    }, n.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, n.HAS_TOUCHEVENTS = "ontouchstart"in e, n.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, n.NO_MOUSEEVENTS = n.HAS_TOUCHEVENTS && navigator.userAgent.match(n.MOBILE_REGEX), n.EVENT_TYPES = {}, n.DIRECTION_DOWN = "down", n.DIRECTION_LEFT = "left", n.DIRECTION_UP = "up", n.DIRECTION_RIGHT = "right", n.POINTER_MOUSE = "mouse", n.POINTER_TOUCH = "touch", n.POINTER_PEN = "pen", n.EVENT_START = "start", n.EVENT_MOVE = "move", n.EVENT_END = "end", n.DOCUMENT = document, n.plugins = {}, n.READY = !1, n.Instance = function (e, t) {
        var i = this;
        return r(), this.element = e, this.enabled = !0, this.options = n.utils.extend(n.utils.extend({}, n.defaults), t || {}), this.options.stop_browser_behavior && n.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), n.event.onTouch(e, n.EVENT_START, function (e) {
            i.enabled && n.detection.startDetect(i, e)
        }), this
    }, n.Instance.prototype = {
        on: function (t, n) {
            var r = t.split(" ");
            for (var i = 0; i < r.length; i++)this.element.addEventListener(r[i], n, !1);
            return this
        }, off: function (t, n) {
            var r = t.split(" ");
            for (var i = 0; i < r.length; i++)this.element.removeEventListener(r[i], n, !1);
            return this
        }, trigger: function (t, r) {
            var i = n.DOCUMENT.createEvent("Event");
            i.initEvent(t, !0, !0), i.gesture = r;
            var s = this.element;
            return n.utils.hasParent(r.target, s) && (s = r.target), s.dispatchEvent(i), this
        }, enable: function (t) {
            return this.enabled = t, this
        }
    };
    var i = null, s = !1, o = !1;
    n.event = {
        bindDom: function (e, t, n) {
            var r = t.split(" ");
            for (var i = 0; i < r.length; i++)e.addEventListener(r[i], n, !1)
        }, onTouch: function (t, r, u) {
            var a = this;
            this.bindDom(t, n.EVENT_TYPES[r], function (f) {
                var l = f.type.toLowerCase();
                if (l.match(/mouse/) && o)return;
                if (l.match(/touch/) || l.match(/pointerdown/) || l.match(/mouse/) && f.which === 1)s = !0;
                l.match(/touch|pointer/) && (o = !0);
                var c = 0;
                s && (n.HAS_POINTEREVENTS && r != n.EVENT_END ? c = n.PointerEvent.updatePointer(r, f) : l.match(/touch/) ? c = f.touches.length : o || (c = l.match(/up/) ? 0 : 1), c > 0 && r == n.EVENT_END ? r = n.EVENT_MOVE : c || (r = n.EVENT_END), !c && i !== null ? f = i : i = f, u.call(n.detection, a.collectEventData(t, r, f)), n.HAS_POINTEREVENTS && r == n.EVENT_END && (c = n.PointerEvent.updatePointer(r, f))), c || (i = null, s = !1, o = !1, n.PointerEvent.reset())
            })
        }, determineEventTypes: function () {
            var t;
            n.HAS_POINTEREVENTS ? t = n.PointerEvent.getEvents() : n.NO_MOUSEEVENTS ? t = ["touchstart", "touchmove", "touchend touchcancel"] : t = ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], n.EVENT_TYPES[n.EVENT_START] = t[0], n.EVENT_TYPES[n.EVENT_MOVE] = t[1], n.EVENT_TYPES[n.EVENT_END] = t[2]
        }, getTouchList: function (t) {
            return n.HAS_POINTEREVENTS ? n.PointerEvent.getTouchList() : t.touches ? t.touches : [{
                identifier: 1,
                pageX: t.pageX,
                pageY: t.pageY,
                target: t.target
            }]
        }, collectEventData: function (t, r, i) {
            var s = this.getTouchList(i, r), o = n.POINTER_TOUCH;
            if (i.type.match(/mouse/) || n.PointerEvent.matchType(n.POINTER_MOUSE, i))o = n.POINTER_MOUSE;
            return {
                center: n.utils.getCenter(s),
                timeStamp: (new Date).getTime(),
                target: i.target,
                touches: s,
                eventType: r,
                pointerType: o,
                srcEvent: i,
                preventDefault: function () {
                    this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
                },
                stopPropagation: function () {
                    this.srcEvent.stopPropagation()
                },
                stopDetect: function () {
                    return n.detection.stopDetect()
                }
            }
        }
    }, n.PointerEvent = {
        pointers: {}, getTouchList: function () {
            var e = this, t = [];
            return Object.keys(e.pointers).sort().forEach(function (n) {
                t.push(e.pointers[n])
            }), t
        }, updatePointer: function (e, t) {
            return e == n.EVENT_END ? this.pointers = {} : (t.identifier = t.pointerId, this.pointers[t.pointerId] = t), Object.keys(this.pointers).length
        }, matchType: function (e, t) {
            if (!t.pointerType)return !1;
            var r = {};
            return r[n.POINTER_MOUSE] = t.pointerType == t.MSPOINTER_TYPE_MOUSE || t.pointerType == n.POINTER_MOUSE, r[n.POINTER_TOUCH] = t.pointerType == t.MSPOINTER_TYPE_TOUCH || t.pointerType == n.POINTER_TOUCH, r[n.POINTER_PEN] = t.pointerType == t.MSPOINTER_TYPE_PEN || t.pointerType == n.POINTER_PEN, r[e]
        }, getEvents: function () {
            return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
        }, reset: function () {
            this.pointers = {}
        }
    }, n.utils = {
        extend: function (n, r, i) {
            for (var s in r) {
                if (n[s] !== t && i)continue;
                n[s] = r[s]
            }
            return n
        }, hasParent: function (e, t) {
            while (e) {
                if (e == t)return !0;
                e = e.parentNode
            }
            return !1
        }, getCenter: function (t) {
            var n = [], r = [];
            for (var i = 0, s = t.length; i < s; i++)n.push(t[i].pageX), r.push(t[i].pageY);
            return {
                pageX: (Math.min.apply(Math, n) + Math.max.apply(Math, n)) / 2,
                pageY: (Math.min.apply(Math, r) + Math.max.apply(Math, r)) / 2
            }
        }, getVelocity: function (t, n, r) {
            return {x: Math.abs(n / t) || 0, y: Math.abs(r / t) || 0}
        }, getAngle: function (t, n) {
            var r = n.pageY - t.pageY, i = n.pageX - t.pageX;
            return Math.atan2(r, i) * 180 / Math.PI
        }, getDirection: function (t, r) {
            var i = Math.abs(t.pageX - r.pageX), s = Math.abs(t.pageY - r.pageY);
            return i >= s ? t.pageX - r.pageX > 0 ? n.DIRECTION_LEFT : n.DIRECTION_RIGHT : t.pageY - r.pageY > 0 ? n.DIRECTION_UP : n.DIRECTION_DOWN
        }, getDistance: function (t, n) {
            var r = n.pageX - t.pageX, i = n.pageY - t.pageY;
            return Math.sqrt(r * r + i * i)
        }, getScale: function (t, n) {
            return t.length >= 2 && n.length >= 2 ? this.getDistance(n[0], n[1]) / this.getDistance(t[0], t[1]) : 1
        }, getRotation: function (t, n) {
            return t.length >= 2 && n.length >= 2 ? this.getAngle(n[1], n[0]) - this.getAngle(t[1], t[0]) : 0
        }, isVertical: function (t) {
            return t == n.DIRECTION_UP || t == n.DIRECTION_DOWN
        }, stopDefaultBrowserBehavior: function (t, n) {
            var r, i = ["webkit", "khtml", "moz", "ms", "o", ""];
            if (!n || !t.style)return;
            for (var s = 0; s < i.length; s++)for (var o in n)n.hasOwnProperty(o) && (r = o, i[s] && (r = i[s] + r.substring(0, 1).toUpperCase() + r.substring(1)), t.style[r] = n[o]);
            n.userSelect == "none" && (t.onselectstart = function () {
                return !1
            })
        }
    }, n.detection = {
        gestures: [], current: null, previous: null, stopped: !1, startDetect: function (t, r) {
            if (this.current)return;
            this.stopped = !1, this.current = {
                inst: t,
                startEvent: n.utils.extend({}, r),
                lastEvent: !1,
                name: ""
            }, this.detect(r)
        }, detect: function (t) {
            if (!this.current || this.stopped)return;
            t = this.extendEventData(t);
            var r = this.current.inst.options;
            for (var i = 0, s = this.gestures.length; i < s; i++) {
                var o = this.gestures[i];
                if (!this.stopped && r[o.name] !== !1 && o.handler.call(o, t, this.current.inst) === !1) {
                    this.stopDetect();
                    break
                }
            }
            return this.current && (this.current.lastEvent = t), t.eventType == n.EVENT_END && !t.touches.length - 1 && this.stopDetect(), t
        }, stopDetect: function () {
            this.previous = n.utils.extend({}, this.current), this.current = null, this.stopped = !0
        }, extendEventData: function (t) {
            var r = this.current.startEvent;
            if (r && (t.touches.length != r.touches.length || t.touches === r.touches)) {
                r.touches = [];
                for (var i = 0, s = t.touches.length; i < s; i++)r.touches.push(n.utils.extend({}, t.touches[i]))
            }
            var o = t.timeStamp - r.timeStamp, u = t.center.pageX - r.center.pageX, a = t.center.pageY - r.center.pageY, f = n.utils.getVelocity(o, u, a);
            return n.utils.extend(t, {
                deltaTime: o,
                deltaX: u,
                deltaY: a,
                velocityX: f.x,
                velocityY: f.y,
                distance: n.utils.getDistance(r.center, t.center),
                angle: n.utils.getAngle(r.center, t.center),
                direction: n.utils.getDirection(r.center, t.center),
                scale: n.utils.getScale(r.touches, t.touches),
                rotation: n.utils.getRotation(r.touches, t.touches),
                startEvent: r
            }), t
        }, register: function (r) {
            var i = r.defaults || {};
            return i[r.name] === t && (i[r.name] = !0), n.utils.extend(n.defaults, i, !0), r.index = r.index || 1e3, this.gestures.push(r), this.gestures.sort(function (e, t) {
                return e.index < t.index ? -1 : e.index > t.index ? 1 : 0
            }), this.gestures
        }
    }, n.gestures = n.gestures || {}, n.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {hold_timeout: 500, hold_threshold: 1},
        timer: null,
        handler: function (t, r) {
            switch (t.eventType) {
                case n.EVENT_START:
                    clearTimeout(this.timer), n.detection.current.name = this.name, this.timer = setTimeout(function () {
                        n.detection.current.name == "hold" && r.trigger("hold", t)
                    }, r.options.hold_timeout);
                    break;
                case n.EVENT_MOVE:
                    t.distance > r.options.hold_threshold && clearTimeout(this.timer);
                    break;
                case n.EVENT_END:
                    clearTimeout(this.timer)
            }
        }
    }, n.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: !0,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        handler: function (t, r) {
            if (t.eventType == n.EVENT_END) {
                var i = n.detection.previous, s = !1;
                if (t.deltaTime > r.options.tap_max_touchtime || t.distance > r.options.tap_max_distance)return;
                i && i.name == "tap" && t.timeStamp - i.lastEvent.timeStamp < r.options.doubletap_interval && t.distance < r.options.doubletap_distance && (r.trigger("doubletap", t), s = !0);
                if (!s || r.options.tap_always)n.detection.current.name = "tap", r.trigger(n.detection.current.name, t)
            }
        }
    }, n.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {swipe_max_touches: 1, swipe_velocity: .7},
        handler: function (t, r) {
            if (t.eventType == n.EVENT_END) {
                if (r.options.swipe_max_touches > 0 && t.touches.length > r.options.swipe_max_touches)return;
                if (t.velocityX > r.options.swipe_velocity || t.velocityY > r.options.swipe_velocity)r.trigger(this.name, t), r.trigger(this.name + t.direction, t)
            }
        }
    }, n.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            drag_max_touches: 1,
            drag_block_horizontal: !1,
            drag_block_vertical: !1,
            drag_lock_to_axis: !1,
            drag_lock_min_distance: 25
        },
        triggered: !1,
        handler: function (t, r) {
            if (n.detection.current.name != this.name && this.triggered) {
                r.trigger(this.name + "end", t), this.triggered = !1;
                return
            }
            if (r.options.drag_max_touches > 0 && t.touches.length > r.options.drag_max_touches)return;
            switch (t.eventType) {
                case n.EVENT_START:
                    this.triggered = !1;
                    break;
                case n.EVENT_MOVE:
                    if (t.distance < r.options.drag_min_distance && n.detection.current.name != this.name)return;
                    n.detection.current.name = this.name;
                    if (n.detection.current.lastEvent.drag_locked_to_axis || r.options.drag_lock_to_axis && r.options.drag_lock_min_distance <= t.distance)t.drag_locked_to_axis = !0;
                    var i = n.detection.current.lastEvent.direction;
                    t.drag_locked_to_axis && i !== t.direction && (n.utils.isVertical(i) ? t.direction = t.deltaY < 0 ? n.DIRECTION_UP : n.DIRECTION_DOWN : t.direction = t.deltaX < 0 ? n.DIRECTION_LEFT : n.DIRECTION_RIGHT), this.triggered || (r.trigger(this.name + "start", t), this.triggered = !0), r.trigger(this.name, t), r.trigger(this.name + t.direction, t), (r.options.drag_block_vertical && n.utils.isVertical(t.direction) || r.options.drag_block_horizontal && !n.utils.isVertical(t.direction)) && t.preventDefault();
                    break;
                case n.EVENT_END:
                    this.triggered && r.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, n.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {transform_min_scale: .01, transform_min_rotation: 1, transform_always_block: !1},
        triggered: !1,
        handler: function (t, r) {
            if (n.detection.current.name != this.name && this.triggered) {
                r.trigger(this.name + "end", t), this.triggered = !1;
                return
            }
            if (t.touches.length < 2)return;
            r.options.transform_always_block && t.preventDefault();
            switch (t.eventType) {
                case n.EVENT_START:
                    this.triggered = !1;
                    break;
                case n.EVENT_MOVE:
                    var i = Math.abs(1 - t.scale), s = Math.abs(t.rotation);
                    if (i < r.options.transform_min_scale && s < r.options.transform_min_rotation)return;
                    n.detection.current.name = this.name, this.triggered || (r.trigger(this.name + "start", t), this.triggered = !0), r.trigger(this.name, t), s > r.options.transform_min_rotation && r.trigger("rotate", t), i > r.options.transform_min_scale && (r.trigger("pinch", t), r.trigger("pinch" + (t.scale < 1 ? "in" : "out"), t));
                    break;
                case n.EVENT_END:
                    this.triggered && r.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, n.gestures.Touch = {
        name: "touch",
        index: -Infinity,
        defaults: {prevent_default: !1, prevent_mouseevents: !1},
        handler: function (t, r) {
            if (r.options.prevent_mouseevents && t.pointerType == n.POINTER_MOUSE) {
                t.stopDetect();
                return
            }
            r.options.prevent_default && t.preventDefault(), t.eventType == n.EVENT_START && r.trigger(this.name, t)
        }
    }, n.gestures.Release = {
        name: "release", index: Infinity, handler: function (t, r) {
            t.eventType == n.EVENT_END && r.trigger(this.name, t)
        }
    }, typeof module == "object" && typeof module.exports == "object" ? module.exports = n : (e.Hammer = n, typeof e.define == "function" && e.define.amd && e.define("hammer", [], function () {
        return n
    }))
}(this), function (e, t) {
    "use strict";
    if (e === t)return;
    Hammer.event.bindDom = function (n, r, i) {
        e(n).on(r, function (e) {
            var n = e.originalEvent || e;
            n.pageX === t && (n.pageX = e.pageX, n.pageY = e.pageY), n.target || (n.target = e.target), n.which === t && (n.which = n.button), n.preventDefault || (n.preventDefault = e.preventDefault), n.stopPropagation || (n.stopPropagation = e.stopPropagation), i.call(this, n)
        })
    }, Hammer.Instance.prototype.on = function (t, n) {
        return e(this.element).on(t, n)
    }, Hammer.Instance.prototype.off = function (t, n) {
        return e(this.element).off(t, n)
    }, Hammer.Instance.prototype.trigger = function (t, n) {
        var r = e(this.element);
        return r.has(n.target).length && (r = e(n.target)), r.trigger({type: t, gesture: n})
    }, e.fn.hammer = function (t) {
        return this.each(function () {
            var n = e(this), r = n.data("hammer");
            r ? r && t && Hammer.utils.extend(r.options, t) : n.data("hammer", new Hammer(this, t || {}))
        })
    }
}(window.jQuery || window.Zepto), function (e, t, n) {
    function f(e) {
        var t = {}, r = /^jQuery\d+$/;
        return n.each(e.attributes, function (e, n) {
            n.specified && !r.test(n.name) && (t[n.name] = n.value)
        }), t
    }

    function l(e, r) {
        var i = this, s = n(i);
        if (i.value == s.attr("placeholder") && s.hasClass("placeholder"))if (s.data("placeholder-password")) {
            s = s.hide().next().show().attr("id", s.removeAttr("id").data("placeholder-id"));
            if (e === !0)return s[0].value = r;
            s.focus()
        } else i.value = "", s.removeClass("placeholder"), i == t.activeElement && i.select()
    }

    function c() {
        var e, t = this, r = n(t), i = r, s = this.id;
        if (t.value == "") {
            if (t.type == "password") {
                if (!r.data("placeholder-textinput")) {
                    try {
                        e = r.clone().attr({type: "text"})
                    } catch (o) {
                        e = n("<input>").attr(n.extend(f(this), {type: "text"}))
                    }
                    e.removeAttr("name").data({
                        "placeholder-password": !0,
                        "placeholder-id": s
                    }).bind("focus.placeholder", l), r.data({"placeholder-textinput": e, "placeholder-id": s}).before(e)
                }
                r = r.removeAttr("id").hide().prev().attr("id", s).show()
            }
            r.addClass("placeholder"), r[0].value = r.attr("placeholder")
        } else r.removeClass("placeholder")
    }

    var r = "placeholder"in t.createElement("input"), i = "placeholder"in t.createElement("textarea"), s = n.fn, o = n.valHooks, u, a;
    r && i ? (a = s.placeholder = function () {
        return this
    }, a.input = a.textarea = !0) : (a = s.placeholder = function () {
        var e = this;
        return e.filter((r ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
            "focus.placeholder": l,
            "blur.placeholder": c
        }).data("placeholder-enabled", !0).trigger("blur.placeholder"), e
    }, a.input = r, a.textarea = i, u = {
        get: function (e) {
            var t = n(e);
            return t.data("placeholder-enabled") && t.hasClass("placeholder") ? "" : e.value
        }, set: function (e, r) {
            var i = n(e);
            return i.data("placeholder-enabled") ? (r == "" ? (e.value = r, e != t.activeElement && c.call(e)) : i.hasClass("placeholder") ? l.call(e, !0, r) || (e.value = r) : e.value = r, i) : e.value = r
        }
    }, r || (o.input = u), i || (o.textarea = u), n(function () {
        n(t).delegate("form", "submit.placeholder", function () {
            var e = n(".placeholder", this).each(l);
            setTimeout(function () {
                e.each(c)
            }, 10)
        })
    }), n(e).bind("beforeunload.placeholder", function () {
        n(".placeholder").each(function () {
            this.value = ""
        })
    }))
}(this, document, jQuery), function (e, t) {
    function n(t, n) {
        var i, s, o, u = t.nodeName.toLowerCase();
        return "area" === u ? (i = t.parentNode, s = i.name, !t.href || !s || i.nodeName.toLowerCase() !== "map" ? !1 : (o = e("img[usemap=#" + s + "]")[0], !!o && r(o))) : (/input|select|textarea|button|object/.test(u) ? !t.disabled : "a" === u ? t.href || n : n) && r(t)
    }

    function r(t) {
        return e.expr.filters.visible(t) && !e(t).parents().andSelf().filter(function () {
                return e.css(this, "visibility") === "hidden"
            }).length
    }

    var i = 0, s = /^ui-id-\d+$/;
    e.ui = e.ui || {};
    if (e.ui.version)return;
    e.extend(e.ui, {
        version: "1.9.2",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), e.fn.extend({
        _focus: e.fn.focus, focus: function (t, n) {
            return typeof t == "number" ? this.each(function () {
                var r = this;
                setTimeout(function () {
                    e(r).focus(), n && n.call(r)
                }, t)
            }) : this._focus.apply(this, arguments)
        }, scrollParent: function () {
            var t;
            return e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? t = this.parents().filter(function () {
                return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
            }).eq(0) : t = this.parents().filter(function () {
                return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
            }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t
        }, zIndex: function (n) {
            if (n !== t)return this.css("zIndex", n);
            if (this.length) {
                var r = e(this[0]), i, s;
                while (r.length && r[0] !== document) {
                    i = r.css("position");
                    if (i === "absolute" || i === "relative" || i === "fixed") {
                        s = parseInt(r.css("zIndex"), 10);
                        if (!isNaN(s) && s !== 0)return s
                    }
                    r = r.parent()
                }
            }
            return 0
        }, uniqueId: function () {
            return this.each(function () {
                this.id || (this.id = "ui-id-" + ++i)
            })
        }, removeUniqueId: function () {
            return this.each(function () {
                s.test(this.id) && e(this).removeAttr("id")
            })
        }
    }), e.extend(e.expr[":"], {
        data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
            return function (n) {
                return !!e.data(n, t)
            }
        }) : function (t, n, r) {
            return !!e.data(t, r[3])
        }, focusable: function (t) {
            return n(t, !isNaN(e.attr(t, "tabindex")))
        }, tabbable: function (t) {
            var r = e.attr(t, "tabindex"), i = isNaN(r);
            return (i || r >= 0) && n(t, !i)
        }
    }), e(function () {
        var t = document.body, n = t.appendChild(n = document.createElement("div"));
        n.offsetHeight, e.extend(n.style, {
            minHeight: "100px",
            height: "auto",
            padding: 0,
            borderWidth: 0
        }), e.support.minHeight = n.offsetHeight === 100, e.support.selectstart = "onselectstart"in n, t.removeChild(n).style.display = "none"
    }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (n, r) {
        function i(t, n, r, i) {
            return e.each(s, function () {
                n -= parseFloat(e.css(t, "padding" + this)) || 0, r && (n -= parseFloat(e.css(t, "border" + this + "Width")) || 0), i && (n -= parseFloat(e.css(t, "margin" + this)) || 0)
            }), n
        }

        var s = r === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], o = r.toLowerCase(), u = {
            innerWidth: e.fn.innerWidth,
            innerHeight: e.fn.innerHeight,
            outerWidth: e.fn.outerWidth,
            outerHeight: e.fn.outerHeight
        };
        e.fn["inner" + r] = function (n) {
            return n === t ? u["inner" + r].call(this) : this.each(function () {
                e(this).css(o, i(this, n) + "px")
            })
        }, e.fn["outer" + r] = function (t, n) {
            return typeof t != "number" ? u["outer" + r].call(this, t) : this.each(function () {
                e(this).css(o, i(this, t, !0, n) + "px")
            })
        }
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
        return function (n) {
            return arguments.length ? t.call(this, e.camelCase(n)) : t.call(this)
        }
    }(e.fn.removeData)), function () {
        var t = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
        e.ui.ie = t.length ? !0 : !1, e.ui.ie6 = parseFloat(t[1], 10) === 6
    }(), e.fn.extend({
        disableSelection: function () {
            return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
                e.preventDefault()
            })
        }, enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }
    }), e.extend(e.ui, {
        plugin: {
            add: function (t, n, r) {
                var i, s = e.ui[t].prototype;
                for (i in r)s.plugins[i] = s.plugins[i] || [], s.plugins[i].push([n, r[i]])
            }, call: function (e, t, n) {
                var r, i = e.plugins[t];
                if (!i || !e.element[0].parentNode || e.element[0].parentNode.nodeType === 11)return;
                for (r = 0; r < i.length; r++)e.options[i[r][0]] && i[r][1].apply(e.element, n)
            }
        }, contains: e.contains, hasScroll: function (t, n) {
            if (e(t).css("overflow") === "hidden")return !1;
            var r = n && n === "left" ? "scrollLeft" : "scrollTop", i = !1;
            return t[r] > 0 ? !0 : (t[r] = 1, i = t[r] > 0, t[r] = 0, i)
        }, isOverAxis: function (e, t, n) {
            return e > t && e < t + n
        }, isOver: function (t, n, r, i, s, o) {
            return e.ui.isOverAxis(t, r, s) && e.ui.isOverAxis(n, i, o)
        }
    })
}(jQuery), function (e, t) {
    var n = 0, r = Array.prototype.slice, i = e.cleanData;
    e.cleanData = function (t) {
        for (var n = 0, r; (r = t[n]) != null; n++)try {
            e(r).triggerHandler("remove")
        } catch (s) {
        }
        i(t)
    }, e.widget = function (t, n, r) {
        var i, s, o, u, a = t.split(".")[0];
        t = t.split(".")[1], i = a + "-" + t, r || (r = n, n = e.Widget), e.expr[":"][i.toLowerCase()] = function (t) {
            return !!e.data(t, i)
        }, e[a] = e[a] || {}, s = e[a][t], o = e[a][t] = function (e, t) {
            if (!this._createWidget)return new o(e, t);
            arguments.length && this._createWidget(e, t)
        }, e.extend(o, s, {
            version: r.version,
            _proto: e.extend({}, r),
            _childConstructors: []
        }), u = new n, u.options = e.widget.extend({}, u.options), e.each(r, function (t, i) {
            e.isFunction(i) && (r[t] = function () {
                var e = function () {
                    return n.prototype[t].apply(this, arguments)
                }, r = function (e) {
                    return n.prototype[t].apply(this, e)
                };
                return function () {
                    var t = this._super, n = this._superApply, s;
                    return this._super = e, this._superApply = r, s = i.apply(this, arguments), this._super = t, this._superApply = n, s
                }
            }())
        }), o.prototype = e.widget.extend(u, {widgetEventPrefix: s ? u.widgetEventPrefix : t}, r, {
            constructor: o,
            namespace: a,
            widgetName: t,
            widgetBaseClass: i,
            widgetFullName: i
        }), s ? (e.each(s._childConstructors, function (t, n) {
            var r = n.prototype;
            e.widget(r.namespace + "." + r.widgetName, o, n._proto)
        }), delete s._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o)
    }, e.widget.extend = function (n) {
        var i = r.call(arguments, 1), s = 0, o = i.length, u, a;
        for (; s < o; s++)for (u in i[s])a = i[s][u], i[s].hasOwnProperty(u) && a !== t && (e.isPlainObject(a) ? n[u] = e.isPlainObject(n[u]) ? e.widget.extend({}, n[u], a) : e.widget.extend({}, a) : n[u] = a);
        return n
    }, e.widget.bridge = function (n, i) {
        var s = i.prototype.widgetFullName || n;
        e.fn[n] = function (o) {
            var u = typeof o == "string", a = r.call(arguments, 1), f = this;
            return o = !u && a.length ? e.widget.extend.apply(null, [o].concat(a)) : o, u ? this.each(function () {
                var r, i = e.data(this, s);
                if (!i)return e.error("cannot call methods on " + n + " prior to initialization; " + "attempted to call method '" + o + "'");
                if (!e.isFunction(i[o]) || o.charAt(0) === "_")return e.error("no such method '" + o + "' for " + n + " widget instance");
                r = i[o].apply(i, a);
                if (r !== i && r !== t)return f = r && r.jquery ? f.pushStack(r.get()) : r, !1
            }) : this.each(function () {
                var t = e.data(this, s);
                t ? t.option(o || {})._init() : e.data(this, s, new i(o, this))
            }), f
        }
    }, e.Widget = function () {
    }, e.Widget._childConstructors = [], e.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: !1, create: null},
        _createWidget: function (t, r) {
            r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), r !== this && (e.data(r, this.widgetName, this), e.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function (e) {
                    e.target === r && this.destroy()
                }
            }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function () {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: e.noop,
        widget: function () {
            return this.element
        },
        option: function (n, r) {
            var i = n, s, o, u;
            if (arguments.length === 0)return e.widget.extend({}, this.options);
            if (typeof n == "string") {
                i = {}, s = n.split("."), n = s.shift();
                if (s.length) {
                    o = i[n] = e.widget.extend({}, this.options[n]);
                    for (u = 0; u < s.length - 1; u++)o[s[u]] = o[s[u]] || {}, o = o[s[u]];
                    n = s.pop();
                    if (r === t)return o[n] === t ? null : o[n];
                    o[n] = r
                } else {
                    if (r === t)return this.options[n] === t ? null : this.options[n];
                    i[n] = r
                }
            }
            return this._setOptions(i), this
        },
        _setOptions: function (e) {
            var t;
            for (t in e)this._setOption(t, e[t]);
            return this
        },
        _setOption: function (e, t) {
            return this.options[e] = t, e === "disabled" && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
        },
        enable: function () {
            return this._setOption("disabled", !1)
        },
        disable: function () {
            return this._setOption("disabled", !0)
        },
        _on: function (t, n, r) {
            var i, s = this;
            typeof t != "boolean" && (r = n, n = t, t = !1), r ? (n = i = e(n), this.bindings = this.bindings.add(n)) : (r = n, n = this.element, i = this.widget()), e.each(r, function (r, o) {
                function u() {
                    if (!t && (s.options.disabled === !0 || e(this).hasClass("ui-state-disabled")))return;
                    return (typeof o == "string" ? s[o] : o).apply(s, arguments)
                }

                typeof o != "string" && (u.guid = o.guid = o.guid || u.guid || e.guid++);
                var a = r.match(/^(\w+)\s*(.*)$/), f = a[1] + s.eventNamespace, l = a[2];
                l ? i.delegate(l, f, u) : n.bind(f, u)
            })
        },
        _off: function (e, t) {
            t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t)
        },
        _delay: function (e, t) {
            function n() {
                return (typeof e == "string" ? r[e] : e).apply(r, arguments)
            }

            var r = this;
            return setTimeout(n, t || 0)
        },
        _hoverable: function (t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function (t) {
                    e(t.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (t) {
                    e(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function (t) {
                    e(t.currentTarget).addClass("ui-state-focus")
                }, focusout: function (t) {
                    e(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (t, n, r) {
            var i, s, o = this.options[t];
            r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent;
            if (s)for (i in s)i in n || (n[i] = s[i]);
            return this.element.trigger(n, r), !(e.isFunction(o) && o.apply(this.element[0], [n].concat(r)) === !1 || n.isDefaultPrevented())
        }
    }, e.each({show: "fadeIn", hide: "fadeOut"}, function (t, n) {
        e.Widget.prototype["_" + t] = function (r, i, s) {
            typeof i == "string" && (i = {effect: i});
            var o, u = i ? i === !0 || typeof i == "number" ? n : i.effect || n : t;
            i = i || {}, typeof i == "number" && (i = {duration: i}), o = !e.isEmptyObject(i), i.complete = s, i.delay && r.delay(i.delay), o && e.effects && (e.effects.effect[u] || e.uiBackCompat !== !1 && e.effects[u]) ? r[t](i) : u !== t && r[u] ? r[u](i.duration, i.easing, s) : r.queue(function (n) {
                e(this)[t](), s && s.call(r[0]), n()
            })
        }
    }), e.uiBackCompat !== !1 && (e.Widget.prototype._getCreateOptions = function () {
        return e.metadata && e.metadata.get(this.element[0])[this.widgetName]
    })
}(jQuery), function (e, t) {
    var n = !1;
    e(document).mouseup(function (e) {
        n = !1
    }), e.widget("ui.mouse", {
        version: "1.9.2",
        options: {cancel: "input,textarea,button,select,option", distance: 1, delay: 0},
        _mouseInit: function () {
            var t = this;
            this.element.bind("mousedown." + this.widgetName, function (e) {
                return t._mouseDown(e)
            }).bind("click." + this.widgetName, function (n) {
                if (!0 === e.data(n.target, t.widgetName + ".preventClickEvent"))return e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1
            }), this.started = !1
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function (t) {
            if (n)return;
            this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t;
            var r = this, i = t.which === 1, s = typeof this.options.cancel == "string" && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
            if (!i || s || !this._mouseCapture(t))return !0;
            this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                r.mouseDelayMet = !0
            }, this.options.delay));
            if (this._mouseDistanceMet(t) && this._mouseDelayMet(t)) {
                this._mouseStarted = this._mouseStart(t) !== !1;
                if (!this._mouseStarted)return t.preventDefault(), !0
            }
            return !0 === e.data(t.target, this.widgetName + ".preventClickEvent") && e.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
                return r._mouseMove(e)
            }, this._mouseUpDelegate = function (e) {
                return r._mouseUp(e)
            }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), n = !0, !0
        },
        _mouseMove: function (t) {
            return !e.ui.ie || document.documentMode >= 9 || !!t.button ? this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted) : this._mouseUp(t)
        },
        _mouseUp: function (t) {
            return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1
        },
        _mouseDistanceMet: function (e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function (e) {
            return this.mouseDelayMet
        },
        _mouseStart: function (e) {
        },
        _mouseDrag: function (e) {
        },
        _mouseStop: function (e) {
        },
        _mouseCapture: function (e) {
            return !0
        }
    })
}(jQuery), function (e, t) {
    e.widget("ui.sortable", e.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3
        },
        _create: function () {
            var e = this.options;
            this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? e.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0
        },
        _destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy();
            for (var e = this.items.length - 1; e >= 0; e--)this.items[e].item.removeData(this.widgetName + "-item");
            return this
        },
        _setOption: function (t, n) {
            t === "disabled" ? (this.options[t] = n, this.widget().toggleClass("ui-sortable-disabled", !!n)) : e.Widget.prototype._setOption.apply(this, arguments)
        },
        _mouseCapture: function (t, n) {
            var r = this;
            if (this.reverting)return !1;
            if (this.options.disabled || this.options.type == "static")return !1;
            this._refreshItems(t);
            var i = null, s = e(t.target).parents().each(function () {
                if (e.data(this, r.widgetName + "-item") == r)return i = e(this), !1
            });
            e.data(t.target, r.widgetName + "-item") == r && (i = e(t.target));
            if (!i)return !1;
            if (this.options.handle && !n) {
                var o = !1;
                e(this.options.handle, i).find("*").andSelf().each(function () {
                    this == t.target && (o = !0)
                });
                if (!o)return !1
            }
            return this.currentItem = i, this._removeCurrentsFromItems(), !0
        },
        _mouseStart: function (t, n, r) {
            var i = this.options;
            this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, e.extend(this.offset, {
                click: {left: t.pageX - this.offset.left, top: t.pageY - this.offset.top},
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt
            ), this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            }, this.helper[0] != this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), i.containment && this._setContainment(), i.cursor && (e("body").css("cursor") && (this._storedCursor = e("body").css("cursor")), e("body").css("cursor", i.cursor)), i.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", i.opacity)), i.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", i.zIndex)), this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions();
            if (!r)for (var s = this.containers.length - 1; s >= 0; s--)this.containers[s]._trigger("activate", t, this._uiHash(this));
            return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(t), !0
        },
        _mouseDrag: function (t) {
            this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
            if (this.options.scroll) {
                var n = this.options, r = !1;
                this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < n.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + n.scrollSpeed : t.pageY - this.overflowOffset.top < n.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - n.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < n.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + n.scrollSpeed : t.pageX - this.overflowOffset.left < n.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - n.scrollSpeed)) : (t.pageY - e(document).scrollTop() < n.scrollSensitivity ? r = e(document).scrollTop(e(document).scrollTop() - n.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < n.scrollSensitivity && (r = e(document).scrollTop(e(document).scrollTop() + n.scrollSpeed)), t.pageX - e(document).scrollLeft() < n.scrollSensitivity ? r = e(document).scrollLeft(e(document).scrollLeft() - n.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < n.scrollSensitivity && (r = e(document).scrollLeft(e(document).scrollLeft() + n.scrollSpeed))), r !== !1 && e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)
            }
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
            for (var i = this.items.length - 1; i >= 0; i--) {
                var s = this.items[i], o = s.item[0], u = this._intersectsWithPointer(s);
                if (!u)continue;
                if (s.instance !== this.currentContainer)continue;
                if (o != this.currentItem[0] && this.placeholder[u == 1 ? "next" : "prev"]()[0] != o && !e.contains(this.placeholder[0], o) && (this.options.type == "semi-dynamic" ? !e.contains(this.element[0], o) : !0)) {
                    this.direction = u == 1 ? "down" : "up";
                    if (this.options.tolerance != "pointer" && !this._intersectsWithSides(s))break;
                    this._rearrange(t, s), this._trigger("change", t, this._uiHash());
                    break
                }
            }
            return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
        },
        _mouseStop: function (t, n) {
            if (!t)return;
            e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t);
            if (this.options.revert) {
                var r = this, i = this.placeholder.offset();
                this.reverting = !0, e(this.helper).animate({
                    left: i.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                    top: i.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                }, parseInt(this.options.revert, 10) || 500, function () {
                    r._clear(t)
                })
            } else this._clear(t, n);
            return !1
        },
        cancel: function () {
            if (this.dragging) {
                this._mouseUp({target: null}), this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var t = this.containers.length - 1; t >= 0; t--)this.containers[t]._trigger("deactivate", null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this
        },
        serialize: function (t) {
            var n = this._getItemsAsjQuery(t && t.connected), r = [];
            return t = t || {}, e(n).each(function () {
                var n = (e(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[-=_](.+)/);
                n && r.push((t.key || n[1] + "[]") + "=" + (t.key && t.expression ? n[1] : n[2]))
            }), !r.length && t.key && r.push(t.key + "="), r.join("&")
        },
        toArray: function (t) {
            var n = this._getItemsAsjQuery(t && t.connected), r = [];
            return t = t || {}, n.each(function () {
                r.push(e(t.item || this).attr(t.attribute || "id") || "")
            }), r
        },
        _intersectsWith: function (e) {
            var t = this.positionAbs.left, n = t + this.helperProportions.width, r = this.positionAbs.top, i = r + this.helperProportions.height, s = e.left, o = s + e.width, u = e.top, a = u + e.height, f = this.offset.click.top, l = this.offset.click.left, c = r + f > u && r + f < a && t + l > s && t + l < o;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > e[this.floating ? "width" : "height"] ? c : s < t + this.helperProportions.width / 2 && n - this.helperProportions.width / 2 < o && u < r + this.helperProportions.height / 2 && i - this.helperProportions.height / 2 < a
        },
        _intersectsWithPointer: function (t) {
            var n = this.options.axis === "x" || e.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, t.top, t.height), r = this.options.axis === "y" || e.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, t.left, t.width), i = n && r, s = this._getDragVerticalDirection(), o = this._getDragHorizontalDirection();
            return i ? this.floating ? o && o == "right" || s == "down" ? 2 : 1 : s && (s == "down" ? 2 : 1) : !1
        },
        _intersectsWithSides: function (t) {
            var n = e.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height), r = e.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width), i = this._getDragVerticalDirection(), s = this._getDragHorizontalDirection();
            return this.floating && s ? s == "right" && r || s == "left" && !r : i && (i == "down" && n || i == "up" && !n)
        },
        _getDragVerticalDirection: function () {
            var e = this.positionAbs.top - this.lastPositionAbs.top;
            return e != 0 && (e > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var e = this.positionAbs.left - this.lastPositionAbs.left;
            return e != 0 && (e > 0 ? "right" : "left")
        },
        refresh: function (e) {
            return this._refreshItems(e), this.refreshPositions(), this
        },
        _connectWith: function () {
            var e = this.options;
            return e.connectWith.constructor == String ? [e.connectWith] : e.connectWith
        },
        _getItemsAsjQuery: function (t) {
            var n = [], r = [], i = this._connectWith();
            if (i && t)for (var s = i.length - 1; s >= 0; s--) {
                var o = e(i[s]);
                for (var u = o.length - 1; u >= 0; u--) {
                    var a = e.data(o[u], this.widgetName);
                    a && a != this && !a.options.disabled && r.push([e.isFunction(a.options.items) ? a.options.items.call(a.element) : e(a.options.items, a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), a])
                }
            }
            r.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : e(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (var s = r.length - 1; s >= 0; s--)r[s][0].each(function () {
                n.push(this)
            });
            return e(n)
        },
        _removeCurrentsFromItems: function () {
            var t = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = e.grep(this.items, function (e) {
                for (var n = 0; n < t.length; n++)if (t[n] == e.item[0])return !1;
                return !0
            })
        },
        _refreshItems: function (t) {
            this.items = [], this.containers = [this];
            var n = this.items, r = [[e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {item: this.currentItem}) : e(this.options.items, this.element), this]], i = this._connectWith();
            if (i && this.ready)for (var s = i.length - 1; s >= 0; s--) {
                var o = e(i[s]);
                for (var u = o.length - 1; u >= 0; u--) {
                    var a = e.data(o[u], this.widgetName);
                    a && a != this && !a.options.disabled && (r.push([e.isFunction(a.options.items) ? a.options.items.call(a.element[0], t, {item: this.currentItem}) : e(a.options.items, a.element), a]), this.containers.push(a))
                }
            }
            for (var s = r.length - 1; s >= 0; s--) {
                var f = r[s][1], l = r[s][0];
                for (var u = 0, c = l.length; u < c; u++) {
                    var h = e(l[u]);
                    h.data(this.widgetName + "-item", f), n.push({
                        item: h,
                        instance: f,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
                }
            }
        },
        refreshPositions: function (t) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            for (var n = this.items.length - 1; n >= 0; n--) {
                var r = this.items[n];
                if (r.instance != this.currentContainer && this.currentContainer && r.item[0] != this.currentItem[0])continue;
                var i = this.options.toleranceElement ? e(this.options.toleranceElement, r.item) : r.item;
                t || (r.width = i.outerWidth(), r.height = i.outerHeight());
                var s = i.offset();
                r.left = s.left, r.top = s.top
            }
            if (this.options.custom && this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this); else for (var n = this.containers.length - 1; n >= 0; n--) {
                var s = this.containers[n].element.offset();
                this.containers[n].containerCache.left = s.left, this.containers[n].containerCache.top = s.top, this.containers[n].containerCache.width = this.containers[n].element.outerWidth(), this.containers[n].containerCache.height = this.containers[n].element.outerHeight()
            }
            return this
        },
        _createPlaceholder: function (t) {
            t = t || this;
            var n = t.options;
            if (!n.placeholder || n.placeholder.constructor == String) {
                var r = n.placeholder;
                n.placeholder = {
                    element: function () {
                        var n = e(document.createElement(t.currentItem[0].nodeName)).addClass(r || t.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                        return r || (n.style.visibility = "hidden"), n
                    }, update: function (e, i) {
                        if (r && !n.forcePlaceholderSize)return;
                        i.height() || i.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css("paddingTop") || 0, 10) - parseInt(t.currentItem.css("paddingBottom") || 0, 10)), i.width() || i.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css("paddingLeft") || 0, 10) - parseInt(t.currentItem.css("paddingRight") || 0, 10))
                    }
                }
            }
            t.placeholder = e(n.placeholder.element.call(t.element, t.currentItem)), t.currentItem.after(t.placeholder), n.placeholder.update(t, t.placeholder)
        },
        _contactContainers: function (t) {
            var n = null, r = null;
            for (var i = this.containers.length - 1; i >= 0; i--) {
                if (e.contains(this.currentItem[0], this.containers[i].element[0]))continue;
                if (this._intersectsWith(this.containers[i].containerCache)) {
                    if (n && e.contains(this.containers[i].element[0], n.element[0]))continue;
                    n = this.containers[i], r = i
                } else this.containers[i].containerCache.over && (this.containers[i]._trigger("out", t, this._uiHash(this)), this.containers[i].containerCache.over = 0)
            }
            if (!n)return;
            if (this.containers.length === 1)this.containers[r]._trigger("over", t, this._uiHash(this)), this.containers[r].containerCache.over = 1; else {
                var s = 1e4, o = null, u = this.containers[r].floating ? "left" : "top", a = this.containers[r].floating ? "width" : "height", f = this.positionAbs[u] + this.offset.click[u];
                for (var l = this.items.length - 1; l >= 0; l--) {
                    if (!e.contains(this.containers[r].element[0], this.items[l].item[0]))continue;
                    if (this.items[l].item[0] == this.currentItem[0])continue;
                    var c = this.items[l].item.offset()[u], h = !1;
                    Math.abs(c - f) > Math.abs(c + this.items[l][a] - f) && (h = !0, c += this.items[l][a]), Math.abs(c - f) < s && (s = Math.abs(c - f), o = this.items[l], this.direction = h ? "up" : "down")
                }
                if (!o && !this.options.dropOnEmpty)return;
                this.currentContainer = this.containers[r], o ? this._rearrange(t, o, null, !0) : this._rearrange(t, null, this.containers[r].element, !0), this._trigger("change", t, this._uiHash()), this.containers[r]._trigger("change", t, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[r]._trigger("over", t, this._uiHash(this)), this.containers[r].containerCache.over = 1
            }
        },
        _createHelper: function (t) {
            var n = this.options, r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t, this.currentItem])) : n.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            return r.parents("body").length || e(n.appendTo != "parent" ? n.appendTo : this.currentItem[0].parentNode)[0].appendChild(r[0]), r[0] == this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }), (r[0].style.width == "" || n.forceHelperSize) && r.width(this.currentItem.width()), (r[0].style.height == "" || n.forceHelperSize) && r.height(this.currentItem.height()), r
        },
        _adjustOffsetFromHelper: function (t) {
            typeof t == "string" && (t = t.split(" ")), e.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            this.cssPosition == "absolute" && this.scrollParent[0] != document && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && e.ui.ie)t = {
                top: 0,
                left: 0
            };
            return {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var e = this.currentItem.position();
                return {
                    top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var t = this.options;
            t.containment == "parent" && (t.containment = this.helper[0].parentNode);
            if (t.containment == "document" || t.containment == "window")this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, e(t.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (e(t.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(t.containment)) {
                var n = e(t.containment)[0], r = e(t.containment).offset(), i = e(n).css("overflow") != "hidden";
                this.containment = [r.left + (parseInt(e(n).css("borderLeftWidth"), 10) || 0) + (parseInt(e(n).css("paddingLeft"), 10) || 0) - this.margins.left, r.top + (parseInt(e(n).css("borderTopWidth"), 10) || 0) + (parseInt(e(n).css("paddingTop"), 10) || 0) - this.margins.top, r.left + (i ? Math.max(n.scrollWidth, n.offsetWidth) : n.offsetWidth) - (parseInt(e(n).css("borderLeftWidth"), 10) || 0) - (parseInt(e(n).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, r.top + (i ? Math.max(n.scrollHeight, n.offsetHeight) : n.offsetHeight) - (parseInt(e(n).css("borderTopWidth"), 10) || 0) - (parseInt(e(n).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },
        _convertPositionTo: function (t, n) {
            n || (n = this.position);
            var r = t == "absolute" ? 1 : -1, i = this.options, s = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, o = /(html|body)/i.test(s[0].tagName);
            return {
                top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * r,
                left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * r
            }
        },
        _generatePosition: function (t) {
            var n = this.options, r = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, i = /(html|body)/i.test(r[0].tagName);
            this.cssPosition == "relative" && (this.scrollParent[0] == document || this.scrollParent[0] == this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset());
            var s = t.pageX, o = t.pageY;
            if (this.originalPosition) {
                this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (s = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (s = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top));
                if (n.grid) {
                    var u = this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1];
                    o = this.containment ? u - this.offset.click.top < this.containment[1] || u - this.offset.click.top > this.containment[3] ? u - this.offset.click.top < this.containment[1] ? u + n.grid[1] : u - n.grid[1] : u : u;
                    var a = this.originalPageX + Math.round((s - this.originalPageX) / n.grid[0]) * n.grid[0];
                    s = this.containment ? a - this.offset.click.left < this.containment[0] || a - this.offset.click.left > this.containment[2] ? a - this.offset.click.left < this.containment[0] ? a + n.grid[0] : a - n.grid[0] : a : a
                }
            }
            return {
                top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : i ? 0 : r.scrollTop()),
                left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : i ? 0 : r.scrollLeft())
            }
        },
        _rearrange: function (e, t, n, r) {
            n ? n[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
            var i = this.counter;
            this._delay(function () {
                i == this.counter && this.refreshPositions(!r)
            })
        },
        _clear: function (t, n) {
            this.reverting = !1;
            var r = [];
            !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var i in this._storedCSS)if (this._storedCSS[i] == "auto" || this._storedCSS[i] == "static")this._storedCSS[i] = "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !n && r.push(function (e) {
                this._trigger("receive", e, this._uiHash(this.fromOutside))
            }), (this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !n && r.push(function (e) {
                this._trigger("update", e, this._uiHash())
            }), this !== this.currentContainer && (n || (r.push(function (e) {
                this._trigger("remove", e, this._uiHash())
            }), r.push(function (e) {
                return function (t) {
                    e._trigger("receive", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer)), r.push(function (e) {
                return function (t) {
                    e._trigger("update", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer))));
            for (var i = this.containers.length - 1; i >= 0; i--)n || r.push(function (e) {
                return function (t) {
                    e._trigger("deactivate", t, this._uiHash(this))
                }
            }.call(this, this.containers[i])), this.containers[i].containerCache.over && (r.push(function (e) {
                return function (t) {
                    e._trigger("out", t, this._uiHash(this))
                }
            }.call(this, this.containers[i])), this.containers[i].containerCache.over = 0);
            this._storedCursor && e("body").css("cursor", this._storedCursor), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex), this.dragging = !1;
            if (this.cancelHelperRemoval) {
                if (!n) {
                    this._trigger("beforeStop", t, this._uiHash());
                    for (var i = 0; i < r.length; i++)r[i].call(this, t);
                    this._trigger("stop", t, this._uiHash())
                }
                return this.fromOutside = !1, !1
            }
            n || this._trigger("beforeStop", t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] != this.currentItem[0] && this.helper.remove(), this.helper = null;
            if (!n) {
                for (var i = 0; i < r.length; i++)r[i].call(this, t);
                this._trigger("stop", t, this._uiHash())
            }
            return this.fromOutside = !1, !0
        },
        _trigger: function () {
            e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
        },
        _uiHash: function (t) {
            var n = t || this;
            return {
                helper: n.helper,
                placeholder: n.placeholder || e([]),
                position: n.position,
                originalPosition: n.originalPosition,
                offset: n.positionAbs,
                item: n.currentItem,
                sender: t ? t.element : null
            }
        }
    })
}(jQuery), jQuery.effects || function (e, t) {
    var n = e.uiBackCompat !== !1, r = "ui-effects-";
    e.effects = {effect: {}}, function (t, n) {
        function r(e, t, n) {
            var r = c[t.type] || {};
            return e == null ? n || !t.def ? null : t.def : (e = r.floor ? ~~e : parseFloat(e), isNaN(e) ? t.def : r.mod ? (e + r.mod) % r.mod : 0 > e ? 0 : r.max < e ? r.max : e)
        }

        function i(e) {
            var n = f(), r = n._rgba = [];
            return e = e.toLowerCase(), v(a, function (t, i) {
                var s, o = i.re.exec(e), u = o && i.parse(o), a = i.space || "rgba";
                if (u)return s = n[a](u), n[l[a].cache] = s[l[a].cache], r = n._rgba = s._rgba, !1
            }), r.length ? (r.join() === "0,0,0,0" && t.extend(r, d.transparent), n) : d[e]
        }

        function s(e, t, n) {
            return n = (n + 1) % 1, n * 6 < 1 ? e + (t - e) * n * 6 : n * 2 < 1 ? t : n * 3 < 2 ? e + (t - e) * (2 / 3 - n) * 6 : e
        }

        var o = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "), u = /^([\-+])=\s*(\d+\.?\d*)/, a = [{
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (e) {
                return [e[1], e[2], e[3], e[4]]
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            parse: function (e) {
                return [e[1] * 2.55, e[2] * 2.55, e[3] * 2.55, e[4]]
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (e) {
                return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (e) {
                return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function (e) {
                return [e[1], e[2] / 100, e[3] / 100, e[4]]
            }
        }], f = t.Color = function (e, n, r, i) {
            return new t.Color.fn.parse(e, n, r, i)
        }, l = {
            rgba: {
                props: {
                    red: {idx: 0, type: "byte"},
                    green: {idx: 1, type: "byte"},
                    blue: {idx: 2, type: "byte"}
                }
            },
            hsla: {
                props: {
                    hue: {idx: 0, type: "degrees"},
                    saturation: {idx: 1, type: "percent"},
                    lightness: {idx: 2, type: "percent"}
                }
            }
        }, c = {
            "byte": {floor: !0, max: 255},
            percent: {max: 1},
            degrees: {mod: 360, floor: !0}
        }, h = f.support = {}, p = t("<p>")[0], d, v = t.each;
        p.style.cssText = "background-color:rgba(1,1,1,.5)", h.rgba = p.style.backgroundColor.indexOf("rgba") > -1, v(l, function (e, t) {
            t.cache = "_" + e, t.props.alpha = {idx: 3, type: "percent", def: 1}
        }), f.fn = t.extend(f.prototype, {
            parse: function (s, o, u, a) {
                if (s === n)return this._rgba = [null, null, null, null], this;
                if (s.jquery || s.nodeType)s = t(s).css(o), o = n;
                var c = this, h = t.type(s), p = this._rgba = [];
                o !== n && (s = [s, o, u, a], h = "array");
                if (h === "string")return this.parse(i(s) || d._default);
                if (h === "array")return v(l.rgba.props, function (e, t) {
                    p[t.idx] = r(s[t.idx], t)
                }), this;
                if (h === "object")return s instanceof f ? v(l, function (e, t) {
                    s[t.cache] && (c[t.cache] = s[t.cache].slice())
                }) : v(l, function (t, n) {
                    var i = n.cache;
                    v(n.props, function (e, t) {
                        if (!c[i] && n.to) {
                            if (e === "alpha" || s[e] == null)return;
                            c[i] = n.to(c._rgba)
                        }
                        c[i][t.idx] = r(s[e], t, !0)
                    }), c[i] && e.inArray(null, c[i].slice(0, 3)) < 0 && (c[i][3] = 1, n.from && (c._rgba = n.from(c[i])))
                }), this
            }, is: function (e) {
                var t = f(e), n = !0, r = this;
                return v(l, function (e, i) {
                    var s, o = t[i.cache];
                    return o && (s = r[i.cache] || i.to && i.to(r._rgba) || [], v(i.props, function (e, t) {
                        if (o[t.idx] != null)return n = o[t.idx] === s[t.idx], n
                    })), n
                }), n
            }, _space: function () {
                var e = [], t = this;
                return v(l, function (n, r) {
                    t[r.cache] && e.push(n)
                }), e.pop()
            }, transition: function (e, t) {
                var n = f(e), i = n._space(), s = l[i], o = this.alpha() === 0 ? f("transparent") : this, u = o[s.cache] || s.to(o._rgba), a = u.slice();
                return n = n[s.cache], v(s.props, function (e, i) {
                    var s = i.idx, o = u[s], f = n[s], l = c[i.type] || {};
                    if (f === null)return;
                    o === null ? a[s] = f : (l.mod && (f - o > l.mod / 2 ? o += l.mod : o - f > l.mod / 2 && (o -= l.mod)), a[s] = r((f - o) * t + o, i))
                }), this[i](a)
            }, blend: function (e) {
                if (this._rgba[3] === 1)return this;
                var n = this._rgba.slice(), r = n.pop(), i = f(e)._rgba;
                return f(t.map(n, function (e, t) {
                    return (1 - r) * i[t] + r * e
                }))
            }, toRgbaString: function () {
                var e = "rgba(", n = t.map(this._rgba, function (e, t) {
                    return e == null ? t > 2 ? 1 : 0 : e
                });
                return n[3] === 1 && (n.pop(), e = "rgb("), e + n.join() + ")"
            }, toHslaString: function () {
                var e = "hsla(", n = t.map(this.hsla(), function (e, t) {
                    return e == null && (e = t > 2 ? 1 : 0), t && t < 3 && (e = Math.round(e * 100) + "%"), e
                });
                return n[3] === 1 && (n.pop(), e = "hsl("), e + n.join() + ")"
            }, toHexString: function (e) {
                var n = this._rgba.slice(), r = n.pop();
                return e && n.push(~~(r * 255)), "#" + t.map(n, function (e) {
                    return e = (e || 0).toString(16), e.length === 1 ? "0" + e : e
                }).join("")
            }, toString: function () {
                return this._rgba[3] === 0 ? "transparent" : this.toRgbaString()
            }
        }), f.fn.parse.prototype = f.fn, l.hsla.to = function (e) {
            if (e[0] == null || e[1] == null || e[2] == null)return [null, null, null, e[3]];
            var t = e[0] / 255, n = e[1] / 255, r = e[2] / 255, i = e[3], s = Math.max(t, n, r), o = Math.min(t, n, r), u = s - o, a = s + o, f = a * .5, l, c;
            return o === s ? l = 0 : t === s ? l = 60 * (n - r) / u + 360 : n === s ? l = 60 * (r - t) / u + 120 : l = 60 * (t - n) / u + 240, f === 0 || f === 1 ? c = f : f <= .5 ? c = u / a : c = u / (2 - a), [Math.round(l) % 360, c, f, i == null ? 1 : i]
        }, l.hsla.from = function (e) {
            if (e[0] == null || e[1] == null || e[2] == null)return [null, null, null, e[3]];
            var t = e[0] / 360, n = e[1], r = e[2], i = e[3], o = r <= .5 ? r * (1 + n) : r + n - r * n, u = 2 * r - o;
            return [Math.round(s(u, o, t + 1 / 3) * 255), Math.round(s(u, o, t) * 255), Math.round(s(u, o, t - 1 / 3) * 255), i]
        }, v(l, function (e, i) {
            var s = i.props, o = i.cache, a = i.to, l = i.from;
            f.fn[e] = function (e) {
                a && !this[o] && (this[o] = a(this._rgba));
                if (e === n)return this[o].slice();
                var i, u = t.type(e), c = u === "array" || u === "object" ? e : arguments, h = this[o].slice();
                return v(s, function (e, t) {
                    var n = c[u === "object" ? e : t.idx];
                    n == null && (n = h[t.idx]), h[t.idx] = r(n, t)
                }), l ? (i = f(l(h)), i[o] = h, i) : f(h)
            }, v(s, function (n, r) {
                if (f.fn[n])return;
                f.fn[n] = function (i) {
                    var s = t.type(i), o = n === "alpha" ? this._hsla ? "hsla" : "rgba" : e, a = this[o](), f = a[r.idx], l;
                    return s === "undefined" ? f : (s === "function" && (i = i.call(this, f), s = t.type(i)), i == null && r.empty ? this : (s === "string" && (l = u.exec(i), l && (i = f + parseFloat(l[2]) * (l[1] === "+" ? 1 : -1))), a[r.idx] = i, this[o](a)))
                }
            })
        }), v(o, function (e, n) {
            t.cssHooks[n] = {
                set: function (e, r) {
                    var s, o, u = "";
                    if (t.type(r) !== "string" || (s = i(r))) {
                        r = f(s || r);
                        if (!h.rgba && r._rgba[3] !== 1) {
                            o = n === "backgroundColor" ? e.parentNode : e;
                            while ((u === "" || u === "transparent") && o && o.style)try {
                                u = t.css(o, "backgroundColor"), o = o.parentNode
                            } catch (a) {
                            }
                            r = r.blend(u && u !== "transparent" ? u : "_default")
                        }
                        r = r.toRgbaString()
                    }
                    try {
                        e.style[n] = r
                    } catch (l) {
                    }
                }
            }, t.fx.step[n] = function (e) {
                e.colorInit || (e.start = f(e.elem, n), e.end = f(e.end), e.colorInit = !0), t.cssHooks[n].set(e.elem, e.start.transition(e.end, e.pos))
            }
        }), t.cssHooks.borderColor = {
            expand: function (e) {
                var t = {};
                return v(["Top", "Right", "Bottom", "Left"], function (n, r) {
                    t["border" + r + "Color"] = e
                }), t
            }
        }, d = t.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(jQuery), function () {
        function n() {
            var t = this.ownerDocument.defaultView ? this.ownerDocument.defaultView.getComputedStyle(this, null) : this.currentStyle, n = {}, r, i;
            if (t && t.length && t[0] && t[t[0]]) {
                i = t.length;
                while (i--)r = t[i], typeof t[r] == "string" && (n[e.camelCase(r)] = t[r])
            } else for (r in t)typeof t[r] == "string" && (n[r] = t[r]);
            return n
        }

        function r(t, n) {
            var r = {}, i, o;
            for (i in n)o = n[i], t[i] !== o && !s[i] && (e.fx.step[i] || !isNaN(parseFloat(o))) && (r[i] = o);
            return r
        }

        var i = ["add", "remove", "toggle"], s = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        e.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (t, n) {
            e.fx.step[n] = function (e) {
                if (e.end !== "none" && !e.setAttr || e.pos === 1 && !e.setAttr)jQuery.style(e.elem, n, e.end), e.setAttr = !0
            }
        }), e.effects.animateClass = function (t, s, o, u) {
            var a = e.speed(s, o, u);
            return this.queue(function () {
                var s = e(this), o = s.attr("class") || "", u, f = a.children ? s.find("*").andSelf() : s;
                f = f.map(function () {
                    var t = e(this);
                    return {el: t, start: n.call(this)}
                }), u = function () {
                    e.each(i, function (e, n) {
                        t[n] && s[n + "Class"](t[n])
                    })
                }, u(), f = f.map(function () {
                    return this.end = n.call(this.el[0]), this.diff = r(this.start, this.end), this
                }), s.attr("class", o), f = f.map(function () {
                    var t = this, n = e.Deferred(), r = jQuery.extend({}, a, {
                        queue: !1, complete: function () {
                            n.resolve(t)
                        }
                    });
                    return this.el.animate(this.diff, r), n.promise()
                }), e.when.apply(e, f.get()).done(function () {
                    u(), e.each(arguments, function () {
                        var t = this.el;
                        e.each(this.diff, function (e) {
                            t.css(e, "")
                        })
                    }), a.complete.call(s[0])
                })
            })
        }, e.fn.extend({
            _addClass: e.fn.addClass, addClass: function (t, n, r, i) {
                return n ? e.effects.animateClass.call(this, {add: t}, n, r, i) : this._addClass(t)
            }, _removeClass: e.fn.removeClass, removeClass: function (t, n, r, i) {
                return n ? e.effects.animateClass.call(this, {remove: t}, n, r, i) : this._removeClass(t)
            }, _toggleClass: e.fn.toggleClass, toggleClass: function (n, r, i, s, o) {
                return typeof r == "boolean" || r === t ? i ? e.effects.animateClass.call(this, r ? {add: n} : {remove: n}, i, s, o) : this._toggleClass(n, r) : e.effects.animateClass.call(this, {toggle: n}, r, i, s)
            }, switchClass: function (t, n, r, i, s) {
                return e.effects.animateClass.call(this, {add: n, remove: t}, r, i, s)
            }
        })
    }(), function () {
        function i(t, n, r, i) {
            e.isPlainObject(t) && (n = t, t = t.effect), t = {effect: t}, n == null && (n = {}), e.isFunction(n) && (i = n, r = null, n = {});
            if (typeof n == "number" || e.fx.speeds[n])i = r, r = n, n = {};
            return e.isFunction(r) && (i = r, r = null), n && e.extend(t, n), r = r || n.duration, t.duration = e.fx.off ? 0 : typeof r == "number" ? r : r in e.fx.speeds ? e.fx.speeds[r] : e.fx.speeds._default, t.complete = i || n.complete, t
        }

        function s(t) {
            return !t || typeof t == "number" || e.fx.speeds[t] ? !0 : typeof t == "string" && !e.effects.effect[t] ? n && e.effects[t] ? !1 : !0 : !1
        }

        e.extend(e.effects, {
            version: "1.9.2", save: function (e, t) {
                for (var n = 0; n < t.length; n++)t[n] !== null && e.data(r + t[n], e[0].style[t[n]])
            }, restore: function (e, n) {
                var i, s;
                for (s = 0; s < n.length; s++)n[s] !== null && (i = e.data(r + n[s]), i === t && (i = ""), e.css(n[s], i))
            }, setMode: function (e, t) {
                return t === "toggle" && (t = e.is(":hidden") ? "show" : "hide"), t
            }, getBaseline: function (e, t) {
                var n, r;
                switch (e[0]) {
                    case"top":
                        n = 0;
                        break;
                    case"middle":
                        n = .5;
                        break;
                    case"bottom":
                        n = 1;
                        break;
                    default:
                        n = e[0] / t.height
                }
                switch (e[1]) {
                    case"left":
                        r = 0;
                        break;
                    case"center":
                        r = .5;
                        break;
                    case"right":
                        r = 1;
                        break;
                    default:
                        r = e[1] / t.width
                }
                return {x: r, y: n}
            }, createWrapper: function (t) {
                if (t.parent().is(".ui-effects-wrapper"))return t.parent();
                var n = {
                    width: t.outerWidth(!0),
                    height: t.outerHeight(!0),
                    "float": t.css("float")
                }, r = e("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }), i = {width: t.width(), height: t.height()}, s = document.activeElement;
                try {
                    s.id
                } catch (o) {
                    s = document.body
                }
                return t.wrap(r), (t[0] === s || e.contains(t[0], s)) && e(s).focus(), r = t.parent(), t.css("position") === "static" ? (r.css({position: "relative"}), t.css({position: "relative"})) : (e.extend(n, {
                    position: t.css("position"),
                    zIndex: t.css("z-index")
                }), e.each(["top", "left", "bottom", "right"], function (e, r) {
                    n[r] = t.css(r), isNaN(parseInt(n[r], 10)) && (n[r] = "auto")
                }), t.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), t.css(i), r.css(n).show()
            }, removeWrapper: function (t) {
                var n = document.activeElement;
                return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), (t[0] === n || e.contains(t[0], n)) && e(n).focus()), t
            }, setTransition: function (t, n, r, i) {
                return i = i || {}, e.each(n, function (e, n) {
                    var s = t.cssUnit(n);
                    s[0] > 0 && (i[n] = s[0] * r + s[1])
                }), i
            }
        }), e.fn.extend({
            effect: function () {
                function t(t) {
                    function n() {
                        e.isFunction(s) && s.call(i[0]), e.isFunction(t) && t()
                    }

                    var i = e(this), s = r.complete, o = r.mode;
                    (i.is(":hidden") ? o === "hide" : o === "show") ? n() : u.call(i[0], r, n)
                }

                var r = i.apply(this, arguments), s = r.mode, o = r.queue, u = e.effects.effect[r.effect], a = !u && n && e.effects[r.effect];
                return e.fx.off || !u && !a ? s ? this[s](r.duration, r.complete) : this.each(function () {
                    r.complete && r.complete.call(this)
                }) : u ? o === !1 ? this.each(t) : this.queue(o || "fx", t) : a.call(this, {
                    options: r,
                    duration: r.duration,
                    callback: r.complete,
                    mode: r.mode
                })
            }, _show: e.fn.show, show: function (e) {
                if (s(e))return this._show.apply(this, arguments);
                var t = i.apply(this, arguments);
                return t.mode = "show", this.effect.call(this, t)
            }, _hide: e.fn.hide, hide: function (e) {
                if (s(e))return this._hide.apply(this, arguments);
                var t = i.apply(this, arguments);
                return t.mode = "hide", this.effect.call(this, t)
            }, __toggle: e.fn.toggle, toggle: function (t) {
                if (s(t) || typeof t == "boolean" || e.isFunction(t))return this.__toggle.apply(this, arguments);
                var n = i.apply(this, arguments);
                return n.mode = "toggle", this.effect.call(this, n)
            }, cssUnit: function (t) {
                var n = this.css(t), r = [];
                return e.each(["em", "px", "%", "pt"], function (e, t) {
                    n.indexOf(t) > 0 && (r = [parseFloat(n), t])
                }), r
            }
        })
    }(), function () {
        var t = {};
        e.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (e, n) {
            t[n] = function (t) {
                return Math.pow(t, e + 2)
            }
        }), e.extend(t, {
            Sine: function (e) {
                return 1 - Math.cos(e * Math.PI / 2)
            }, Circ: function (e) {
                return 1 - Math.sqrt(1 - e * e)
            }, Elastic: function (e) {
                return e === 0 || e === 1 ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin(((e - 1) * 80 - 7.5) * Math.PI / 15)
            }, Back: function (e) {
                return e * e * (3 * e - 2)
            }, Bounce: function (e) {
                var t, n = 4;
                while (e < ((t = Math.pow(2, --n)) - 1) / 11);
                return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((t * 3 - 2) / 22 - e, 2)
            }
        }), e.each(t, function (t, n) {
            e.easing["easeIn" + t] = n, e.easing["easeOut" + t] = function (e) {
                return 1 - n(1 - e)
            }, e.easing["easeInOut" + t] = function (e) {
                return e < .5 ? n(e * 2) / 2 : 1 - n(e * -2 + 2) / 2
            }
        })
    }()
}(jQuery), function (e, t) {
    var n = /up|down|vertical/, r = /up|left|vertical|horizontal/;
    e.effects.effect.blind = function (t, i) {
        var s = e(this), o = ["position", "top", "bottom", "left", "right", "height", "width"], u = e.effects.setMode(s, t.mode || "hide"), a = t.direction || "up", f = n.test(a), l = f ? "height" : "width", c = f ? "top" : "left", h = r.test(a), p = {}, d = u === "show", v, m, g;
        s.parent().is(".ui-effects-wrapper") ? e.effects.save(s.parent(), o) : e.effects.save(s, o), s.show(), v = e.effects.createWrapper(s).css({overflow: "hidden"}), m = v[l](), g = parseFloat(v.css(c)) || 0, p[l] = d ? m : 0, h || (s.css(f ? "bottom" : "right", 0).css(f ? "top" : "left", "auto").css({position: "absolute"}), p[c] = d ? g : m + g), d && (v.css(l, 0), h || v.css(c, g + m)), v.animate(p, {
            duration: t.duration,
            easing: t.easing,
            queue: !1,
            complete: function () {
                u === "hide" && s.hide(), e.effects.restore(s, o), e.effects.removeWrapper(s), i()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.bounce = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "height", "width"], s = e.effects.setMode(r, t.mode || "effect"), o = s === "hide", u = s === "show", a = t.direction || "up", f = t.distance, l = t.times || 5, c = l * 2 + (u || o ? 1 : 0), h = t.duration / c, p = t.easing, d = a === "up" || a === "down" ? "top" : "left", v = a === "up" || a === "left", m, g, y, b = r.queue(), w = b.length;
        (u || o) && i.push("opacity"), e.effects.save(r, i), r.show(), e.effects.createWrapper(r), f || (f = r[d === "top" ? "outerHeight" : "outerWidth"]() / 3), u && (y = {opacity: 1}, y[d] = 0, r.css("opacity", 0).css(d, v ? -f * 2 : f * 2).animate(y, h, p)), o && (f /= Math.pow(2, l - 1)), y = {}, y[d] = 0;
        for (m = 0; m < l; m++)g = {}, g[d] = (v ? "-=" : "+=") + f, r.animate(g, h, p).animate(y, h, p), f = o ? f * 2 : f / 2;
        o && (g = {opacity: 0}, g[d] = (v ? "-=" : "+=") + f, r.animate(g, h, p)), r.queue(function () {
            o && r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
        }), w > 1 && b.splice.apply(b, [1, 0].concat(b.splice(w, c + 1))), r.dequeue()
    }
}(jQuery), function (e, t) {
    e.effects.effect.clip = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "height", "width"], s = e.effects.setMode(r, t.mode || "hide"), o = s === "show", u = t.direction || "vertical", a = u === "vertical", f = a ? "height" : "width", l = a ? "top" : "left", c = {}, h, p, d;
        e.effects.save(r, i), r.show(), h = e.effects.createWrapper(r).css({overflow: "hidden"}), p = r[0].tagName === "IMG" ? h : r, d = p[f](), o && (p.css(f, 0), p.css(l, d / 2)), c[f] = o ? d : 0, c[l] = o ? 0 : d / 2, p.animate(c, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: function () {
                o || r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.drop = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"], s = e.effects.setMode(r, t.mode || "hide"), o = s === "show", u = t.direction || "left", a = u === "up" || u === "down" ? "top" : "left", f = u === "up" || u === "left" ? "pos" : "neg", l = {opacity: o ? 1 : 0}, c;
        e.effects.save(r, i), r.show(), e.effects.createWrapper(r), c = t.distance || r[a === "top" ? "outerHeight" : "outerWidth"](!0) / 2, o && r.css("opacity", 0).css(a, f === "pos" ? -c : c), l[a] = (o ? f === "pos" ? "+=" : "-=" : f === "pos" ? "-=" : "+=") + c, r.animate(l, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: function () {
                s === "hide" && r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.explode = function (t, n) {
        function r() {
            p.push(this), p.length === s * o && i()
        }

        function i() {
            u.css({visibility: "visible"}), e(p).remove(), f || u.hide(), n()
        }

        var s = t.pieces ? Math.round(Math.sqrt(t.pieces)) : 3, o = s, u = e(this), a = e.effects.setMode(u, t.mode || "hide"), f = a === "show", l = u.show().css("visibility", "hidden").offset(), c = Math.ceil(u.outerWidth() / o), h = Math.ceil(u.outerHeight() / s), p = [], d, v, m, g, y, b;
        for (d = 0; d < s; d++) {
            g = l.top + d * h, b = d - (s - 1) / 2;
            for (v = 0; v < o; v++)m = l.left + v * c, y = v - (o - 1) / 2, u.clone().appendTo("body").wrap("<div></div>").css({
                position: "absolute",
                visibility: "visible",
                left: -v * c,
                top: -d * h
            }).parent().addClass("ui-effects-explode").css({
                position: "absolute",
                overflow: "hidden",
                width: c,
                height: h,
                left: m + (f ? y * c : 0),
                top: g + (f ? b * h : 0),
                opacity: f ? 0 : 1
            }).animate({
                left: m + (f ? 0 : y * c),
                top: g + (f ? 0 : b * h),
                opacity: f ? 1 : 0
            }, t.duration || 500, t.easing, r)
        }
    }
}(jQuery), function (e, t) {
    e.effects.effect.fade = function (t, n) {
        var r = e(this), i = e.effects.setMode(r, t.mode || "toggle");
        r.animate({opacity: i}, {queue: !1, duration: t.duration, easing: t.easing, complete: n})
    }
}(jQuery), function (e, t) {
    e.effects.effect.fold = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "height", "width"], s = e.effects.setMode(r, t.mode || "hide"), o = s === "show", u = s === "hide", a = t.size || 15, f = /([0-9]+)%/.exec(a), l = !!t.horizFirst, c = o !== l, h = c ? ["width", "height"] : ["height", "width"], p = t.duration / 2, d, v, m = {}, g = {};
        e.effects.save(r, i), r.show(), d = e.effects.createWrapper(r).css({overflow: "hidden"}), v = c ? [d.width(), d.height()] : [d.height(), d.width()], f && (a = parseInt(f[1], 10) / 100 * v[u ? 0 : 1]), o && d.css(l ? {
            height: 0,
            width: a
        } : {
            height: a,
            width: 0
        }), m[h[0]] = o ? v[0] : a, g[h[1]] = o ? v[1] : 0, d.animate(m, p, t.easing).animate(g, p, t.easing, function () {
            u && r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.highlight = function (t, n) {
        var r = e(this), i = ["backgroundImage", "backgroundColor", "opacity"], s = e.effects.setMode(r, t.mode || "show"), o = {backgroundColor: r.css("backgroundColor")};
        s === "hide" && (o.opacity = 0), e.effects.save(r, i), r.show().css({
            backgroundImage: "none",
            backgroundColor: t.color || "#ffff99"
        }).animate(o, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                s === "hide" && r.hide(), e.effects.restore(r, i), n()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.pulsate = function (t, n) {
        var r = e(this), i = e.effects.setMode(r, t.mode || "show"), s = i === "show", o = i === "hide", u = s || i === "hide", a = (t.times || 5) * 2 + (u ? 1 : 0), f = t.duration / a, l = 0, c = r.queue(), h = c.length, p;
        if (s || !r.is(":visible"))r.css("opacity", 0).show(), l = 1;
        for (p = 1; p < a; p++)r.animate({opacity: l}, f, t.easing), l = 1 - l;
        r.animate({opacity: l}, f, t.easing), r.queue(function () {
            o && r.hide(), n()
        }), h > 1 && c.splice.apply(c, [1, 0].concat(c.splice(h, a + 1))), r.dequeue()
    }
}(jQuery), function (e, t) {
    e.effects.effect.puff = function (t, n) {
        var r = e(this), i = e.effects.setMode(r, t.mode || "hide"), s = i === "hide", o = parseInt(t.percent, 10) || 150, u = o / 100, a = {
            height: r.height(),
            width: r.width(),
            outerHeight: r.outerHeight(),
            outerWidth: r.outerWidth()
        };
        e.extend(t, {
            effect: "scale",
            queue: !1,
            fade: !0,
            mode: i,
            complete: n,
            percent: s ? o : 100,
            from: s ? a : {
                height: a.height * u,
                width: a.width * u,
                outerHeight: a.outerHeight * u,
                outerWidth: a.outerWidth * u
            }
        }), r.effect(t)
    }, e.effects.effect.scale = function (t, n) {
        var r = e(this), i = e.extend(!0, {}, t), s = e.effects.setMode(r, t.mode || "effect"), o = parseInt(t.percent, 10) || (parseInt(t.percent, 10) === 0 ? 0 : s === "hide" ? 0 : 100), u = t.direction || "both", a = t.origin, f = {
            height: r.height(),
            width: r.width(),
            outerHeight: r.outerHeight(),
            outerWidth: r.outerWidth()
        }, l = {y: u !== "horizontal" ? o / 100 : 1, x: u !== "vertical" ? o / 100 : 1};
        i.effect = "size", i.queue = !1, i.complete = n, s !== "effect" && (i.origin = a || ["middle", "center"], i.restore = !0), i.from = t.from || (s === "show" ? {
                height: 0,
                width: 0,
                outerHeight: 0,
                outerWidth: 0
            } : f), i.to = {
            height: f.height * l.y,
            width: f.width * l.x,
            outerHeight: f.outerHeight * l.y,
            outerWidth: f.outerWidth * l.x
        }, i.fade && (s === "show" && (i.from.opacity = 0, i.to.opacity = 1), s === "hide" && (i.from.opacity = 1, i.to.opacity = 0)), r.effect(i)
    }, e.effects.effect.size = function (t, n) {
        var r, i, s, o = e(this), u = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"], a = ["position", "top", "bottom", "left", "right", "overflow", "opacity"], f = ["width", "height", "overflow"], l = ["fontSize"], c = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], p = e.effects.setMode(o, t.mode || "effect"), d = t.restore || p !== "effect", v = t.scale || "both", m = t.origin || ["middle", "center"], g = o.css("position"), y = d ? u : a, b = {
            height: 0,
            width: 0,
            outerHeight: 0,
            outerWidth: 0
        };
        p === "show" && o.show(), r = {
            height: o.height(),
            width: o.width(),
            outerHeight: o.outerHeight(),
            outerWidth: o.outerWidth()
        }, t.mode === "toggle" && p === "show" ? (o.from = t.to || b, o.to = t.from || r) : (o.from = t.from || (p === "show" ? b : r), o.to = t.to || (p === "hide" ? b : r)), s = {
            from: {
                y: o.from.height / r.height,
                x: o.from.width / r.width
            }, to: {y: o.to.height / r.height, x: o.to.width / r.width}
        };
        if (v === "box" || v === "both")s.from.y !== s.to.y && (y = y.concat(c), o.from = e.effects.setTransition(o, c, s.from.y, o.from), o.to = e.effects.setTransition(o, c, s.to.y, o.to)), s.from.x !== s.to.x && (y = y.concat(h), o.from = e.effects.setTransition(o, h, s.from.x, o.from), o.to = e.effects.setTransition(o, h, s.to.x, o.to));
        (v === "content" || v === "both") && s.from.y !== s.to.y && (y = y.concat(l).concat(f), o.from = e.effects.setTransition(o, l, s.from.y, o.from), o.to = e.effects.setTransition(o, l, s.to.y, o.to)), e.effects.save(o, y), o.show(), e.effects.createWrapper(o), o.css("overflow", "hidden").css(o.from), m && (i = e.effects.getBaseline(m, r), o.from.top = (r.outerHeight - o.outerHeight()) * i.y, o.from.left = (r.outerWidth - o.outerWidth()) * i.x, o.to.top = (r.outerHeight - o.to.outerHeight) * i.y, o.to.left = (r.outerWidth - o.to.outerWidth) * i.x), o.css(o.from);
        if (v === "content" || v === "both")c = c.concat(["marginTop", "marginBottom"]).concat(l), h = h.concat(["marginLeft", "marginRight"]), f = u.concat(c).concat(h), o.find("*[width]").each(function () {
            var n = e(this), r = {
                height: n.height(),
                width: n.width(),
                outerHeight: n.outerHeight(),
                outerWidth: n.outerWidth()
            };
            d && e.effects.save(n, f), n.from = {
                height: r.height * s.from.y,
                width: r.width * s.from.x,
                outerHeight: r.outerHeight * s.from.y,
                outerWidth: r.outerWidth * s.from.x
            }, n.to = {
                height: r.height * s.to.y,
                width: r.width * s.to.x,
                outerHeight: r.height * s.to.y,
                outerWidth: r.width * s.to.x
            }, s.from.y !== s.to.y && (n.from = e.effects.setTransition(n, c, s.from.y, n.from), n.to = e.effects.setTransition(n, c, s.to.y, n.to)), s.from.x !== s.to.x && (n.from = e.effects.setTransition(n, h, s.from.x, n.from), n.to = e.effects.setTransition(n, h, s.to.x, n.to)), n.css(n.from), n.animate(n.to, t.duration, t.easing, function () {
                d && e.effects.restore(n, f)
            })
        });
        o.animate(o.to, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                o.to.opacity === 0 && o.css("opacity", o.from.opacity), p === "hide" && o.hide(), e.effects.restore(o, y), d || (g === "static" ? o.css({
                    position: "relative",
                    top: o.to.top,
                    left: o.to.left
                }) : e.each(["top", "left"], function (e, t) {
                    o.css(t, function (t, n) {
                        var r = parseInt(n, 10), i = e ? o.to.left : o.to.top;
                        return n === "auto" ? i + "px" : r + i + "px"
                    })
                })), e.effects.removeWrapper(o), n()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.shake = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "height", "width"], s = e.effects.setMode(r, t.mode || "effect"), o = t.direction || "left", u = t.distance || 20, a = t.times || 3, f = a * 2 + 1, l = Math.round(t.duration / f), c = o === "up" || o === "down" ? "top" : "left", h = o === "up" || o === "left", p = {}, d = {}, v = {}, m, g = r.queue(), y = g.length;
        e.effects.save(r, i), r.show(), e.effects.createWrapper(r), p[c] = (h ? "-=" : "+=") + u, d[c] = (h ? "+=" : "-=") + u * 2, v[c] = (h ? "-=" : "+=") + u * 2, r.animate(p, l, t.easing);
        for (m = 1; m < a; m++)r.animate(d, l, t.easing).animate(v, l, t.easing);
        r.animate(d, l, t.easing).animate(p, l / 2, t.easing).queue(function () {
            s === "hide" && r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
        }), y > 1 && g.splice.apply(g, [1, 0].concat(g.splice(y, f + 1))), r.dequeue()
    }
}(jQuery), function (e, t) {
    e.effects.effect.slide = function (t, n) {
        var r = e(this), i = ["position", "top", "bottom", "left", "right", "width", "height"], s = e.effects.setMode(r, t.mode || "show"), o = s === "show", u = t.direction || "left", a = u === "up" || u === "down" ? "top" : "left", f = u === "up" || u === "left", l, c = {};
        e.effects.save(r, i), r.show(), l = t.distance || r[a === "top" ? "outerHeight" : "outerWidth"](!0), e.effects.createWrapper(r).css({overflow: "hidden"}), o && r.css(a, f ? isNaN(l) ? "-" + l : -l : l), c[a] = (o ? f ? "+=" : "-=" : f ? "-=" : "+=") + l, r.animate(c, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: function () {
                s === "hide" && r.hide(), e.effects.restore(r, i), e.effects.removeWrapper(r), n()
            }
        })
    }
}(jQuery), function (e, t) {
    e.effects.effect.transfer = function (t, n) {
        var r = e(this), i = e(t.to), s = i.css("position") === "fixed", o = e("body"), u = s ? o.scrollTop() : 0, a = s ? o.scrollLeft() : 0, f = i.offset(), l = {
            top: f.top - u,
            left: f.left - a,
            height: i.innerHeight(),
            width: i.innerWidth()
        }, c = r.offset(), h = e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(t.className).css({
            top: c.top - u,
            left: c.left - a,
            height: r.innerHeight(),
            width: r.innerWidth(),
            position: s ? "fixed" : "absolute"
        }).animate(l, t.duration, t.easing, function () {
            h.remove(), n()
        })
    }
}(jQuery), function (e) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery", "jquery.ui.widget"], e) : typeof exports == "object" ? e(require("jquery"), require("./vendor/jquery.ui.widget")) : e(window.jQuery)
}(function (e) {
    "use strict";
    function t(t) {
        var n = t === "dragover";
        return function (r) {
            r.dataTransfer = r.originalEvent && r.originalEvent.dataTransfer;
            var i = r.dataTransfer;
            i && e.inArray("Files", i.types) !== -1 && this._trigger(t, e.Event(t, {delegatedEvent: r})) !== !1 && (r.preventDefault(), n && (i.dropEffect = "copy"))
        }
    }

    e.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))")).test(window.navigator.userAgent) && !e('<input type="file">').prop("disabled"), e.support.xhrFileUpload = !!window.ProgressEvent && !!window.FileReader, e.support.xhrFormDataFileUpload = !!window.FormData, e.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice), e.widget("blueimp.fileupload", {
        options: {
            dropZone: e(document),
            pasteZone: undefined,
            fileInput: undefined,
            replaceFileInput: !0,
            paramName: undefined,
            singleFileUploads: !0,
            limitMultiFileUploads: undefined,
            limitMultiFileUploadSize: undefined,
            limitMultiFileUploadSizeOverhead: 512,
            sequentialUploads: !1,
            limitConcurrentUploads: undefined,
            forceIframeTransport: !1,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: !0,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: !0,
            progressInterval: 100,
            bitrateInterval: 500,
            autoUpload: !0,
            messages: {uploadedBytes: "Uploaded bytes exceed file size"},
            i18n: function (t, n) {
                return t = this.messages[t] || t.toString(), n && e.each(n, function (e, n) {
                    t = t.replace("{" + e + "}", n)
                }), t
            },
            formData: function (e) {
                return e.serializeArray()
            },
            add: function (t, n) {
                if (t.isDefaultPrevented())return !1;
                (n.autoUpload || n.autoUpload !== !1 && e(this).fileupload("option", "autoUpload")) && n.process().done(function () {
                    n.submit()
                })
            },
            processData: !1,
            contentType: !1,
            cache: !1
        },
        _specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
        _blobSlice: e.support.blobSlice && function () {
            var e = this.slice || this.webkitSlice || this.mozSlice;
            return e.apply(this, arguments)
        },
        _BitrateTimer: function () {
            this.timestamp = Date.now ? Date.now() : (new Date).getTime(), this.loaded = 0, this.bitrate = 0, this.getBitrate = function (e, t, n) {
                var r = e - this.timestamp;
                if (!this.bitrate || !n || r > n)this.bitrate = (t - this.loaded) * (1e3 / r) * 8, this.loaded = t, this.timestamp = e;
                return this.bitrate
            }
        },
        _isXHRUpload: function (t) {
            return !t.forceIframeTransport && (!t.multipart && e.support.xhrFileUpload || e.support.xhrFormDataFileUpload)
        },
        _getFormData: function (t) {
            var n;
            return e.type(t.formData) === "function" ? t.formData(t.form) : e.isArray(t.formData) ? t.formData : e.type(t.formData) === "object" ? (n = [], e.each(t.formData, function (e, t) {
                n.push({name: e, value: t})
            }), n) : []
        },
        _getTotal: function (t) {
            var n = 0;
            return e.each(t, function (e, t) {
                n += t.size || 1
            }), n
        },
        _initProgressObject: function (t) {
            var n = {loaded: 0, total: 0, bitrate: 0};
            t._progress ? e.extend(t._progress, n) : t._progress = n
        },
        _initResponseObject: function (e) {
            var t;
            if (e._response)for (t in e._response)e._response.hasOwnProperty(t) && delete e._response[t]; else e._response = {}
        },
        _onProgress: function (t, n) {
            if (t.lengthComputable) {
                var r = Date.now ? Date.now() : (new Date).getTime(), i;
                if (n._time && n.progressInterval && r - n._time < n.progressInterval && t.loaded !== t.total)return;
                n._time = r, i = Math.floor(t.loaded / t.total * (n.chunkSize || n._progress.total)) + (n.uploadedBytes || 0), this._progress.loaded += i - n._progress.loaded, this._progress.bitrate = this._bitrateTimer.getBitrate(r, this._progress.loaded, n.bitrateInterval), n._progress.loaded = n.loaded = i, n._progress.bitrate = n.bitrate = n._bitrateTimer.getBitrate(r, i, n.bitrateInterval), this._trigger("progress", e.Event("progress", {delegatedEvent: t}), n), this._trigger("progressall", e.Event("progressall", {delegatedEvent: t}), this._progress)
            }
        },
        _initProgressListener: function (t) {
            var n = this, r = t.xhr ? t.xhr() : e.ajaxSettings.xhr();
            r.upload && (e(r.upload).bind("progress", function (e) {
                var r = e.originalEvent;
                e.lengthComputable = r.lengthComputable, e.loaded = r.loaded, e.total = r.total, n._onProgress(e, t)
            }), t.xhr = function () {
                return r
            })
        },
        _isInstanceOf: function (e, t) {
            return Object.prototype.toString.call(t) === "[object " + e + "]"
        },
        _initXHRData: function (t) {
            var n = this, r, i = t.files[0], s = t.multipart || !e.support.xhrFileUpload, o = e.type(t.paramName) === "array" ? t.paramName[0] : t.paramName;
            t.headers = e.extend({}, t.headers), t.contentRange && (t.headers["Content-Range"] = t.contentRange);
            if (!s || t.blob || !this._isInstanceOf("File", i))t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(i.name) + '"';
            s ? e.support.xhrFormDataFileUpload && (t.postMessage ? (r = this._getFormData(t), t.blob ? r.push({
                name: o,
                value: t.blob
            }) : e.each(t.files, function (n, i) {
                r.push({name: e.type(t.paramName) === "array" && t.paramName[n] || o, value: i})
            })) : (n._isInstanceOf("FormData", t.formData) ? r = t.formData : (r = new FormData, e.each(this._getFormData(t), function (e, t) {
                r.append(t.name, t.value)
            })), t.blob ? r.append(o, t.blob, i.name) : e.each(t.files, function (i, s) {
                (n._isInstanceOf("File", s) || n._isInstanceOf("Blob", s)) && r.append(e.type(t.paramName) === "array" && t.paramName[i] || o, s, s.uploadName || s.name)
            })), t.data = r) : (t.contentType = i.type || "application/octet-stream", t.data = t.blob || i), t.blob = null
        },
        _initIframeSettings: function (t) {
            var n = e("<a></a>").prop("href", t.url).prop("host");
            t.dataType = "iframe " + (t.dataType || ""), t.formData = this._getFormData(t), t.redirect && n && n !== location.host && t.formData.push({
                name: t.redirectParamName || "redirect",
                value: t.redirect
            })
        },
        _initDataSettings: function (e) {
            this._isXHRUpload(e) ? (this._chunkedUpload(e, !0) || (e.data || this._initXHRData(e), this._initProgressListener(e)), e.postMessage && (e.dataType = "postmessage " + (e.dataType || ""))) : this._initIframeSettings(e)
        },
        _getParamName: function (t) {
            var n = e(t.fileInput), r = t.paramName;
            return r ? e.isArray(r) || (r = [r]) : (r = [], n.each(function () {
                var t = e(this), n = t.prop("name") || "files[]", i = (t.prop("files") || [1]).length;
                while (i)r.push(n), i -= 1
            }), r.length || (r = [n.prop("name") || "files[]"])), r
        },
        _initFormSettings: function (t) {
            if (!t.form || !t.form.length)t.form = e(t.fileInput.prop("form")), t.form.length || (t.form = e(this.options.fileInput.prop("form")));
            t.paramName = this._getParamName(t), t.url || (t.url = t.form.prop("action") || location.href), t.type = (t.type || e.type(t.form.prop("method")) === "string" && t.form.prop("method") || "").toUpperCase(), t.type !== "POST" && t.type !== "PUT" && t.type !== "PATCH" && (t.type = "POST"), t.formAcceptCharset || (t.formAcceptCharset = t.form.attr("accept-charset"))
        },
        _getAJAXSettings: function (t) {
            var n = e.extend({}, this.options, t);
            return this._initFormSettings(n), this._initDataSettings(n), n
        },
        _getDeferredState: function (e) {
            return e.state ? e.state() : e.isResolved() ? "resolved" : e.isRejected() ? "rejected" : "pending"
        },
        _enhancePromise: function (e) {
            return e.success = e.done, e.error = e.fail, e.complete = e.always, e
        },
        _getXHRPromise: function (t, n, r) {
            var i = e.Deferred(), s = i.promise();
            return n = n || this.options.context || s, t === !0 ? i.resolveWith(n, r) : t === !1 && i.rejectWith(n, r), s.abort = i.promise, this._enhancePromise(s)
        },
        _addConvenienceMethods: function (t, n) {
            var r = this, i = function (t) {
                return e.Deferred().resolveWith(r, t).promise()
            };
            n.process = function (t, s) {
                if (t || s)n._processQueue = this._processQueue = (this._processQueue || i([this])).pipe(function () {
                    return n.errorThrown ? e.Deferred().rejectWith(r, [n]).promise() : i(arguments)
                }).pipe(t, s);
                return this._processQueue || i([this])
            }, n.submit = function () {
                return this.state() !== "pending" && (n.jqXHR = this.jqXHR = r._trigger("submit", e.Event("submit", {delegatedEvent: t}), this) !== !1 && r._onSend(t, this)), this.jqXHR || r._getXHRPromise()
            }, n.abort = function () {
                return this.jqXHR ? this.jqXHR.abort() : (this.errorThrown = "abort", r._trigger("fail", null, this), r._getXHRPromise(!1))
            }, n.state = function () {
                if (this.jqXHR)return r._getDeferredState(this.jqXHR);
                if (this._processQueue)return r._getDeferredState(this._processQueue)
            }, n.processing = function () {
                return !this.jqXHR && this._processQueue && r._getDeferredState(this._processQueue) === "pending"
            }, n.progress = function () {
                return this._progress
            }, n.response = function () {
                return this._response
            }
        },
        _getUploadedBytes: function (e) {
            var t = e.getResponseHeader("Range"), n = t && t.split("-"), r = n && n.length > 1 && parseInt(n[1], 10);
            return r && r + 1
        },
        _chunkedUpload: function (t, n) {
            t.uploadedBytes = t.uploadedBytes || 0;
            var r = this, i = t.files[0], s = i.size, o = t.uploadedBytes, u = t.maxChunkSize || s, a = this._blobSlice, f = e.Deferred(), l = f.promise(), c, h;
            return !(this._isXHRUpload(t) && a && (o || u < s)) || t.data ? !1 : n ? !0 : o >= s ? (i.error = t.i18n("uploadedBytes"), this._getXHRPromise(!1, t.context, [null, "error", i.error])) : (h = function () {
                var n = e.extend({}, t), l = n._progress.loaded;
                n.blob = a.call(i, o, o + u, i.type), n.chunkSize = n.blob.size, n.contentRange = "bytes " + o + "-" + (o + n.chunkSize - 1) + "/" + s, r._initXHRData(n), r._initProgressListener(n), c = (r._trigger("chunksend", null, n) !== !1 && e.ajax(n) || r._getXHRPromise(!1, n.context)).done(function (i, u, a) {
                    o = r._getUploadedBytes(a) || o + n.chunkSize, l + n.chunkSize - n._progress.loaded && r._onProgress(e.Event("progress", {
                        lengthComputable: !0,
                        loaded: o - n.uploadedBytes,
                        total: o - n.uploadedBytes
                    }), n), t.uploadedBytes = n.uploadedBytes = o, n.result = i, n.textStatus = u, n.jqXHR = a, r._trigger("chunkdone", null, n), r._trigger("chunkalways", null, n), o < s ? h() : f.resolveWith(n.context, [i, u, a])
                }).fail(function (e, t, i) {
                    n.jqXHR = e, n.textStatus = t, n.errorThrown = i, r._trigger("chunkfail", null, n), r._trigger("chunkalways", null, n), f.rejectWith(n.context, [e, t, i])
                })
            }, this._enhancePromise(l), l.abort = function () {
                return c.abort()
            }, h(), l)
        },
        _beforeSend: function (e, t) {
            this._active === 0 && (this._trigger("start"), this._bitrateTimer = new this._BitrateTimer, this._progress.loaded = this._progress.total = 0, this._progress.bitrate = 0), this._initResponseObject(t), this._initProgressObject(t), t._progress.loaded = t.loaded = t.uploadedBytes || 0, t._progress.total = t.total = this._getTotal(t.files) || 1, t._progress.bitrate = t.bitrate = 0, this._active += 1, this._progress.loaded += t.loaded, this._progress.total += t.total
        },
        _onDone: function (t, n, r, i) {
            var s = i._progress.total, o = i._response;
            i._progress.loaded < s && this._onProgress(e.Event("progress", {
                lengthComputable: !0,
                loaded: s,
                total: s
            }), i), o.result = i.result = t, o.textStatus = i.textStatus = n, o.jqXHR = i.jqXHR = r, this._trigger("done", null, i)
        },
        _onFail: function (e, t, n, r) {
            var i = r._response;
            r.recalculateProgress && (this._progress.loaded -= r._progress.loaded, this._progress.total -= r._progress.total), i.jqXHR = r.jqXHR = e, i.textStatus = r.textStatus = t, i.errorThrown = r.errorThrown = n, this._trigger("fail", null, r)
        },
        _onAlways: function (e, t, n, r) {
            this._trigger("always", null, r)
        },
        _onSend: function (t, n) {
            n.submit || this._addConvenienceMethods(t, n);
            var r = this, i, s, o, u, a = r._getAJAXSettings(n), f = function () {
                return r._sending += 1, a._bitrateTimer = new r._BitrateTimer, i = i || ((s || r._trigger("send", e.Event("send", {delegatedEvent: t}), a) === !1) && r._getXHRPromise(!1, a.context, s) || r._chunkedUpload(a) || e.ajax(a)).done(function (e, t, n) {
                        r._onDone(e, t, n, a)
                    }).fail(function (e, t, n) {
                        r._onFail(e, t, n, a)
                    }).always(function (e, t, n) {
                        r._onAlways(e, t, n, a), r._sending -= 1, r._active -= 1;
                        if (a.limitConcurrentUploads && a.limitConcurrentUploads > r._sending) {
                            var i = r._slots.shift();
                            while (i) {
                                if (r._getDeferredState(i) === "pending") {
                                    i.resolve();
                                    break
                                }
                                i = r._slots.shift()
                            }
                        }
                        r._active === 0 && r._trigger("stop")
                    }), i
            };
            return this._beforeSend(t, a), this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending ? (this.options.limitConcurrentUploads > 1 ? (o = e.Deferred(), this._slots.push(o), u = o.pipe(f)) : (this._sequence = this._sequence.pipe(f, f), u = this._sequence), u.abort = function () {
                return s = [undefined, "abort", "abort"], i ? i.abort() : (o && o.rejectWith(a.context, s), f())
            }, this._enhancePromise(u)) : f()
        },
        _onAdd: function (t, n) {
            var r = this, i = !0, s = e.extend({}, this.options, n), o = n.files, u = o.length, a = s.limitMultiFileUploads, f = s.limitMultiFileUploadSize, l = s.limitMultiFileUploadSizeOverhead, c = 0, h = this._getParamName(s), p, d, v, m, g = 0;
            f && (!u || o[0].size === undefined) && (f = undefined);
            if (!(s.singleFileUploads || a || f) || !this._isXHRUpload(s))v = [o], p = [h]; else if (!s.singleFileUploads && !f && a) {
                v = [], p = [];
                for (m = 0; m < u; m += a)v.push(o.slice(m, m + a)), d = h.slice(m, m + a), d.length || (d = h), p.push(d)
            } else if (!s.singleFileUploads && f) {
                v = [], p = [];
                for (m = 0; m < u; m += 1) {
                    c += o[m].size + l;
                    if (m + 1 === u || c + o[m + 1].size + l > f || a && m + 1 - g >= a)v.push(o.slice(g, m + 1)), d = h.slice(g, m + 1), d.length || (d = h), p.push(d), g = m + 1, c = 0
                }
            } else p = h;
            return n.originalFiles = o, e.each(v || o, function (s, o) {
                var u = e.extend({}, n);
                return u.files = v ? o : [o], u.paramName = p[s], r._initResponseObject(u), r._initProgressObject(u), r._addConvenienceMethods(t, u), i = r._trigger("add", e.Event("add", {delegatedEvent: t}), u), i
            }), i
        },
        _replaceFileInput: function (t) {
            var n = t.fileInput, r = n.clone(!0);
            t.fileInputClone = r, e("<form></form>").append(r)[0].reset(), n.after(r).detach(), e.cleanData(n.unbind("remove")), this.options.fileInput = this.options.fileInput.map(function (e, t) {
                return t === n[0] ? r[0] : t
            }), n[0] === this.element[0] && (this.element = r)
        },
        _handleFileTreeEntry: function (t, n) {
            var r = this, i = e.Deferred(), s = function (e) {
                e && !e.entry && (e.entry = t), i.resolve([e])
            }, o = function (e) {
                r._handleFileTreeEntries(e, n + t.name + "/").done(function (e) {
                    i.resolve(e)
                }).fail(s)
            }, u = function () {
                a.readEntries(function (e) {
                    e.length ? (f = f.concat(e), u()) : o(f)
                }, s)
            }, a, f = [];
            return n = n || "", t.isFile ? t._file ? (t._file.relativePath = n, i.resolve(t._file)) : t.file(function (e) {
                e.relativePath = n, i.resolve(e)
            }, s) : t.isDirectory ? (a = t.createReader(), u()) : i.resolve([]), i.promise()
        },
        _handleFileTreeEntries: function (t, n) {
            var r = this;
            return e.when.apply(e, e.map(t, function (e) {
                return r._handleFileTreeEntry(e, n)
            })).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _getDroppedFiles: function (t) {
            t = t || {};
            var n = t.items;
            return n && n.length && (n[0].webkitGetAsEntry || n[0].getAsEntry) ? this._handleFileTreeEntries(e.map(n, function (e) {
                var t;
                return e.webkitGetAsEntry ? (t = e.webkitGetAsEntry(), t && (t._file = e.getAsFile()), t) : e.getAsEntry()
            })) : e.Deferred().resolve(e.makeArray(t.files)).promise()
        },
        _getSingleFileInputFiles: function (t) {
            t = e(t);
            var n = t.prop("webkitEntries") || t.prop("entries"), r, i;
            if (n && n.length)return this._handleFileTreeEntries(n);
            r = e.makeArray(t.prop("files"));
            if (!r.length) {
                i = t.prop("value");
                if (!i)return e.Deferred().resolve([]).promise();
                r = [{name: i.replace(/^.*\\/, "")}]
            } else r[0].name === undefined && r[0].fileName && e.each(r, function (e, t) {
                t.name = t.fileName, t.size = t.fileSize
            });
            return e.Deferred().resolve(r).promise()
        },
        _getFileInputFiles: function (t) {
            return t instanceof e && t.length !== 1 ? e.when.apply(e, e.map(t, this._getSingleFileInputFiles)).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            }) : this._getSingleFileInputFiles(t)
        },
        _onChange: function (t) {
            var n = this, r = {fileInput: e(t.target), form: e(t.target.form)};
            this._getFileInputFiles(r.fileInput).always(function (i) {
                r.files = i, n.options.replaceFileInput && n._replaceFileInput(r), n._trigger("change", e.Event("change", {delegatedEvent: t}), r) !== !1 && n._onAdd(t, r)
            })
        },
        _onPaste: function (t) {
            var n = t.originalEvent && t.originalEvent.clipboardData && t.originalEvent.clipboardData.items, r = {files: []};
            n && n.length && (e.each(n, function (e, t) {
                var n = t.getAsFile && t.getAsFile();
                n && r.files.push(n)
            }), this._trigger("paste", e.Event("paste", {delegatedEvent: t}), r) !== !1 && this._onAdd(t, r))
        },
        _onDrop: function (t) {
            t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer;
            var n = this, r = t.dataTransfer, i = {};
            r && r.files && r.files.length && (t.preventDefault(), this._getDroppedFiles(r).always(function (r) {
                i.files = r, n._trigger("drop", e.Event("drop", {delegatedEvent: t}), i) !== !1 && n._onAdd(t, i)
            }))
        },
        _onDragOver: t("dragover"),
        _onDragEnter: t("dragenter"),
        _onDragLeave: t("dragleave"),
        _initEventHandlers: function () {
            this._isXHRUpload(this.options) && (this._on(this.options.dropZone, {
                dragover: this._onDragOver,
                drop: this._onDrop,
                dragenter: this._onDragEnter,
                dragleave: this._onDragLeave
            }), this._on(this.options.pasteZone, {paste: this._onPaste})), e.support.fileInput && this._on(this.options.fileInput, {change: this._onChange})
        },
        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, "dragenter dragleave dragover drop"), this._off(this.options.pasteZone, "paste"), this._off(this.options.fileInput, "change")
        },
        _setOption: function (t, n) {
            var r = e.inArray(t, this._specialOptions) !== -1;
            r && this._destroyEventHandlers(), this._super(t, n), r && (this._initSpecialOptions(), this._initEventHandlers())
        },
        _initSpecialOptions: function () {
            var t = this.options;
            t.fileInput === undefined ? t.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]') : t.fileInput instanceof e || (t.fileInput = e(t.fileInput)), t.dropZone instanceof e || (t.dropZone = e(t.dropZone)), t.pasteZone instanceof e || (t.pasteZone = e(t.pasteZone))
        },
        _getRegExp: function (e) {
            var t = e.split("/"), n = t.pop();
            return t.shift(), new RegExp(t.join("/"), n)
        },
        _isRegExpOption: function (t, n) {
            return t !== "url" && e.type(n) === "string" && /^\/.*\/[igm]{0,3}$/.test(n)
        },
        _initDataAttributes: function () {
            var t = this, n = this.options, r = this.element.data();
            e.each(this.element[0].attributes, function (e, i) {
                var s = i.name.toLowerCase(), o;
                /^data-/.test(s) && (s = s.slice(5).replace(/-[a-z]/g, function (e) {
                    return e.charAt(1).toUpperCase()
                }), o = r[s], t._isRegExpOption(s, o) && (o = t._getRegExp(o)), n[s] = o)
            })
        },
        _create: function () {
            this._initDataAttributes(), this._initSpecialOptions(), this._slots = [], this._sequence = this._getXHRPromise(!0), this._sending = this._active = 0, this._initProgressObject(this), this._initEventHandlers()
        },
        active: function () {
            return this._active
        },
        progress: function () {
            return this._progress
        },
        add: function (t) {
            var n = this;
            if (!t || this.options.disabled)return;
            t.fileInput && !t.files ? this._getFileInputFiles(t.fileInput).always(function (e) {
                t.files = e, n._onAdd(null, t)
            }) : (t.files = e.makeArray(t.files), this._onAdd(null, t))
        },
        send: function (t) {
            if (t && !this.options.disabled) {
                if (t.fileInput && !t.files) {
                    var n = this, r = e.Deferred(), i = r.promise(), s, o;
                    return i.abort = function () {
                        return o = !0, s ? s.abort() : (r.reject(null, "abort", "abort"), i)
                    }, this._getFileInputFiles(t.fileInput).always(function (e) {
                        if (o)return;
                        if (!e.length) {
                            r.reject();
                            return
                        }
                        t.files = e, s = n._onSend(null, t), s.then(function (e, t, n) {
                            r.resolve(e, t, n)
                        }, function (e, t, n) {
                            r.reject(e, t, n)
                        })
                    }), this._enhancePromise(i)
                }
                t.files = e.makeArray(t.files);
                if (t.files.length)return this._onSend(null, t)
            }
            return this._getXHRPromise(!1, t && t.context)
        }
    })
}), function (e, t) {
    if (typeof define == "function" && define.amd)define(["exports", "module"], t); else if (typeof exports != "undefined" && typeof module != "undefined")t(exports, module); else {
        var n = {exports: {}};
        t(n.exports, n), e.autosize = n.exports
    }
}(this, function (e, t) {
    "use strict";
    function n(e) {
        function a() {
            var t = window.getComputedStyle(e, null);
            t.resize === "vertical" ? e.style.resize = "none" : t.resize === "both" && (e.style.resize = "horizontal"), t.boxSizing === "content-box" ? o = -(parseFloat(t.paddingTop) + parseFloat(t.paddingBottom)) : o = parseFloat(t.borderTopWidth) + parseFloat(t.borderBottomWidth), l()
        }

        function f(t) {
            var n = e.style.width;
            e.style.width = "0px", e.offsetWidth, e.style.width = n, u = t, s && (e.style.overflowY = t), l()
        }

        function l() {
            var t = e.style.height, n = document.documentElement.scrollTop, r = document.body.scrollTop, i = e.style.height;
            e.style.height = "auto";
            var s = e.scrollHeight + o;
            if (e.scrollHeight === 0) {
                e.style.height = i;
                return
            }
            e.style.height = s + "px", document.documentElement.scrollTop = n, document.body.scrollTop = r;
            var a = window.getComputedStyle(e, null);
            if (a.height !== e.style.height) {
                if (u !== "visible") {
                    f("visible");
                    return
                }
            } else if (u !== "hidden") {
                f("hidden");
                return
            }
            if (t !== e.style.height) {
                var l = document.createEvent("Event");
                l.initEvent("autosize:resized", !0, !1), e.dispatchEvent(l)
            }
        }

        var t = arguments[1] === undefined ? {} : arguments[1], n = t.setOverflowX, r = n === undefined ? !0 : n, i = t.setOverflowY, s = i === undefined ? !0 : i;
        if (!e || !e.nodeName || e.nodeName !== "TEXTAREA" || e.hasAttribute("data-autosize-on"))return;
        var o = null, u = "hidden", c = function (t) {
            window.removeEventListener("resize", l), e.removeEventListener("input", l), e.removeEventListener("keyup", l), e.removeAttribute("data-autosize-on"), e.removeEventListener("autosize:destroy", c), Object.keys(t).forEach(function (n) {
                e.style[n] = t[n]
            })
        }.bind(e, {
            height: e.style.height,
            resize: e.style.resize,
            overflowY: e.style.overflowY,
            overflowX: e.style.overflowX,
            wordWrap: e.style
                .wordWrap
        });
        e.addEventListener("autosize:destroy", c), "onpropertychange"in e && "oninput"in e && e.addEventListener("keyup", l), window.addEventListener("resize", l), e.addEventListener("input", l), e.addEventListener("autosize:update", l), e.setAttribute("data-autosize-on", !0), s && (e.style.overflowY = "hidden"), r && (e.style.overflowX = "hidden", e.style.wordWrap = "break-word"), a()
    }

    function r(e) {
        if (!e || !e.nodeName || e.nodeName !== "TEXTAREA")return;
        var t = document.createEvent("Event");
        t.initEvent("autosize:destroy", !0, !1), e.dispatchEvent(t)
    }

    function i(e) {
        if (!e || !e.nodeName || e.nodeName !== "TEXTAREA")return;
        var t = document.createEvent("Event");
        t.initEvent("autosize:update", !0, !1), e.dispatchEvent(t)
    }

    var s = null;
    typeof window.getComputedStyle != "function" ? (s = function (e) {
        return e
    }, s.destroy = function (e) {
        return e
    }, s.update = function (e) {
        return e
    }) : (s = function (e, t) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], function (e) {
            return n(e, t)
        }), e
    }, s.destroy = function (e) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], r), e
    }, s.update = function (e) {
        return e && Array.prototype.forEach.call(e.length ? e : [e], i), e
    }), t.exports = s
}), window.Modernizr = function (e, t, n) {
    function r(e) {
        d.cssText = e
    }

    function i(e, t) {
        return r(prefixes.join(e + ";") + (t || ""))
    }

    function s(e, t) {
        return typeof e === t
    }

    function o(e, t) {
        return !!~("" + e).indexOf(t)
    }

    function u(e, t, r) {
        for (var i in e) {
            var o = t[e[i]];
            if (o !== n)return r === !1 ? e[i] : s(o, "function") ? o.bind(r || t) : o
        }
        return !1
    }

    function a() {
        l.inputtypes = function (e) {
            for (var r = 0, i, s, o, u = e.length; r < u; r++)v.setAttribute("type", s = e[r]), i = v.type !== "text", i && (v.value = m, v.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(s) && v.style.WebkitAppearance !== n ? (c.appendChild(v), o = t.defaultView, i = o.getComputedStyle && o.getComputedStyle(v, null).WebkitAppearance !== "textfield" && v.offsetHeight !== 0, c.removeChild(v)) : /^(search|tel)$/.test(s) || (/^(url|email)$/.test(s) ? i = v.checkValidity && v.checkValidity() === !1 : i = v.value != m)), b[e[r]] = !!i;
            return b
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    var f = "2.6.3", l = {}, c = t.documentElement, h = "modernizr", p = t.createElement(h), d = p.style, v = t.createElement("input"), m = ":)", g = {}.toString, y = {}, b = {}, w = {}, E = [], S = E.slice, x, T = function () {
        function e(e, i) {
            i = i || t.createElement(r[e] || "div"), e = "on" + e;
            var o = e in i;
            return o || (i.setAttribute || (i = t.createElement("div")), i.setAttribute && i.removeAttribute && (i.setAttribute(e, ""), o = s(i[e], "function"), s(i[e], "undefined") || (i[e] = n), i.removeAttribute(e))), i = null, o
        }

        var r = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        return e
    }(), N = {}.hasOwnProperty, C;
    !s(N, "undefined") && !s(N.call, "undefined") ? C = function (e, t) {
        return N.call(e, t)
    } : C = function (e, t) {
        return t in e && s(e.constructor.prototype[t], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function (e) {
        var t = this;
        if (typeof t != "function")throw new TypeError;
        var n = S.call(arguments, 1), r = function () {
            if (this instanceof r) {
                var i = function () {
                };
                i.prototype = t.prototype;
                var s = new i, o = t.apply(s, n.concat(S.call(arguments)));
                return Object(o) === o ? o : s
            }
            return t.apply(e, n.concat(S.call(arguments)))
        };
        return r
    }), y.draganddrop = function () {
        var e = t.createElement("div");
        return "draggable"in e || "ondragstart"in e && "ondrop"in e
    };
    for (var k in y)C(y, k) && (x = k.toLowerCase(), l[x] = y[k](), E.push((l[x] ? "" : "no-") + x));
    return l.input || a(), l.addTest = function (e, t) {
        if (typeof e == "object")for (var r in e)C(e, r) && l.addTest(r, e[r]); else {
            e = e.toLowerCase();
            if (l[e] !== n)return l;
            t = typeof t == "function" ? t() : t, typeof enableClasses != "undefined" && enableClasses && (c.className += " " + (t ? "" : "no-") + e), l[e] = t
        }
        return l
    }, r(""), p = v = null, l._version = f, l.hasEvent = T, l
}(this, this.document), window.url = function () {
    function e(e) {
        return !isNaN(parseFloat(e)) && isFinite(e)
    }

    return function (t, n) {
        var r = n || window.location.toString();
        if (!t)return r;
        t = t.toString(), "//" === r.substring(0, 2) ? r = "http:" + r : 1 === r.split("://").length && (r = "http://" + r), n = r.split("/");
        var i = {auth: ""}, s = n[2].split("@");
        1 === s.length ? s = s[0].split(":") : (i.auth = s[0], s = s[1].split(":")), i.protocol = n[0], i.hostname = s[0], i.port = s[1] || "80", i.pathname = "/" + n.slice(3, n.length).join("/").split("?")[0].split("#")[0];
        var o = i.pathname;
        1 === o.split(".").length && "/" !== o[o.length - 1] && (o += "/");
        var u = i.hostname, f = u.split("."), l = o.split("/");
        if ("hostname" === t)return u;
        if ("domain" === t)return f.slice(-2).join(".");
        if ("sub" === t)return f.slice(0, f.length - 2).join(".");
        if ("port" === t)return i.port || "80";
        if ("protocol" === t)return i.protocol.split(":")[0];
        if ("auth" === t)return i.auth;
        if ("user" === t)return i.auth.split(":")[0];
        if ("pass" === t)return i.auth.split(":")[1] || "";
        if ("path" === t)return o;
        if ("." === t.charAt(0)) {
            if (t = t.substring(1), e(t))return t = parseInt(t, 10), f[0 > t ? f.length + t : t - 1] || ""
        } else {
            if (e(t))return t = parseInt(t, 10), l[0 > t ? l.length + t : t] || "";
            if ("file" === t)return l.slice(-1)[0];
            if ("filename" === t)return l.slice(-1)[0].split(".")[0];
            if ("fileext" === t)return l.slice(-1)[0].split(".")[1] || "";
            if ("?" === t.charAt(0) || "#" === t.charAt(0)) {
                var c = r, h = null;
                if ("?" === t.charAt(0) ? c = (c.split("?")[1] || "").split("#")[0] : "#" === t.charAt(0) && (c = c.split("#")[1] || ""), !t.charAt(1))return c;
                t = t.substring(1), c = c.split("&");
                for (var p = 0, d = c.length; d > p; p++)if (h = c[p].split("="), h[0] === t)return h[1];
                return null
            }
        }
        return ""
    }
}(), jQuery && jQuery.extend({
    url: function (e, t) {
        return window.url(e, t)
    }
}), +function (e) {
    "use strict";
    function n(n, r) {
        return this.each(function () {
            var i = e(this), s = i.data("bs.modal"), o = e.extend({}, t.DEFAULTS, i.data(), typeof n == "object" && n);
            s || i.data("bs.modal", s = new t(this, o)), typeof n == "string" ? s[n](r) : o.show && s.show(r)
        })
    }

    var t = function (t, n) {
        this.options = n, this.$body = e(document.body), this.$element = e(t), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    t.VERSION = "3.3.1", t.TRANSITION_DURATION = 300, t.BACKDROP_TRANSITION_DURATION = 150, t.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, t.prototype.toggle = function (e) {
        return this.isShown ? this.hide() : this.show(e)
    }, t.prototype.show = function (n) {
        var r = this, i = e.Event("show.bs.modal", {relatedTarget: n});
        this.$element.trigger(i);
        if (this.isShown || i.isDefaultPrevented())return;
        this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.backdrop(function () {
            var i = e.support.transition && r.$element.hasClass("fade");
            r.$element.parent().length || r.$element.appendTo(r.$body), r.$element.show().scrollTop(0), r.options.backdrop && r.adjustBackdrop(), r.adjustDialog(), i && r.$element[0].offsetWidth, r.$element.addClass("in").attr("aria-hidden", !1), r.enforceFocus();
            var s = e.Event("shown.bs.modal", {relatedTarget: n});
            i ? r.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
                r.$element.trigger("focus").trigger(s)
            }).emulateTransitionEnd(t.TRANSITION_DURATION) : r.$element.trigger("focus").trigger(s)
        })
    }, t.prototype.hide = function (n) {
        n && n.preventDefault(), n = e.Event("hide.bs.modal"), this.$element.trigger(n);
        if (!this.isShown || n.isDefaultPrevented())return;
        this.isShown = !1, this.escape(), this.resize(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : this.hideModal()
    }, t.prototype.enforceFocus = function () {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function (e) {
            this.$element[0] !== e.target && !this.$element.has(e.target).length && this.$element.trigger("focus")
        }, this))
    }, t.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy(function (e) {
            e.which == 27 && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, t.prototype.resize = function () {
        this.isShown ? e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window).off("resize.bs.modal")
    }, t.prototype.hideModal = function () {
        var e = this;
        this.$element.hide(), this.backdrop(function () {
            e.$body.removeClass("modal-open"), e.resetAdjustments(), e.resetScrollbar(), e.$element.trigger("hidden.bs.modal")
        })
    }, t.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, t.prototype.backdrop = function (n) {
        var r = this, i = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var s = e.support.transition && i;
            this.$backdrop = e('<div class="modal-backdrop ' + i + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", e.proxy(function (e) {
                if (e.target !== e.currentTarget)return;
                this.options.backdrop == "static" ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
            }, this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in");
            if (!n)return;
            s ? this.$backdrop.one("bsTransitionEnd", n).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : n()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var o = function () {
                r.removeBackdrop(), n && n()
            };
            e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", o).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : o()
        } else n && n()
    }, t.prototype.handleUpdate = function () {
        this.options.backdrop && this.adjustBackdrop(), this.adjustDialog()
    }, t.prototype.adjustBackdrop = function () {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    }, t.prototype.adjustDialog = function () {
        var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
        })
    }, t.prototype.resetAdjustments = function () {
        this.$element.css({paddingLeft: "", paddingRight: ""})
    }, t.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight, this.scrollbarWidth = this.measureScrollbar()
    }, t.prototype.setScrollbar = function () {
        var e = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
    }, t.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", "")
    }, t.prototype.measureScrollbar = function () {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure", this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        return this.$body[0].removeChild(e), t
    };
    var r = e.fn.modal;
    e.fn.modal = n, e.fn.modal.Constructor = t, e.fn.modal.noConflict = function () {
        return e.fn.modal = r, this
    }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (t) {
        var r = e(this), i = r.attr("href"), s = e(r.attr("data-target") || i && i.replace(/.*(?=#[^\s]+$)/, "")), o = s.data("bs.modal") ? "toggle" : e.extend({remote: !/#/.test(i) && i}, s.data(), r.data());
        r.is("a") && t.preventDefault(), s.one("show.bs.modal", function (e) {
            if (e.isDefaultPrevented())return;
            s.one("hidden.bs.modal", function () {
                r.is(":visible") && r.trigger("focus")
            })
        }), n.call(s, o, this)
    })
}(jQuery), function (e, t) {
    function r() {
        return new Date(Date.UTC.apply(Date, arguments))
    }

    function i() {
        var e = new Date;
        return r(e.getFullYear(), e.getMonth(), e.getDate())
    }

    function s(e) {
        return function () {
            return this[e].apply(this, arguments)
        }
    }

    function f(t, n) {
        function u(e, t) {
            return t.toLowerCase()
        }

        var r = e(t).data(), i = {}, s, o = new RegExp("^" + n.toLowerCase() + "([A-Z])");
        n = new RegExp("^" + n.toLowerCase());
        for (var a in r)n.test(a) && (s = a.replace(o, u), i[s] = r[a]);
        return i
    }

    function l(t) {
        var n = {};
        if (!d[t]) {
            t = t.split("-")[0];
            if (!d[t])return
        }
        var r = d[t];
        return e.each(p, function (e, t) {
            t in r && (n[t] = r[t])
        }), n
    }

    var n = e(window), o = function () {
        var t = {
            get: function (e) {
                return this.slice(e)[0]
            }, contains: function (e) {
                var t = e && e.valueOf();
                for (var n = 0, r = this.length; n < r; n++)if (this[n].valueOf() === t)return n;
                return -1
            }, remove: function (e) {
                this.splice(e, 1)
            }, replace: function (t) {
                if (!t)return;
                e.isArray(t) || (t = [t]), this.clear(), this.push.apply(this, t)
            }, clear: function () {
                this.length = 0
            }, copy: function () {
                var e = new o;
                return e.replace(this), e
            }
        };
        return function () {
            var n = [];
            return n.push.apply(n, arguments), e.extend(n, t), n
        }
    }(), u = function (t, n) {
        this.dates = new o, this.viewDate = i(), this.focusDate = null, this._process_options(n), this.element = e(t), this.isInline = !1, this.isInput = this.element.is("input"), this.component = this.element.is(".date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1, this.hasInput = this.component && this.element.find("input").length, this.component && this.component.length === 0 && (this.component = !1), this.picker = e(v.template), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && this.picker.addClass("datepicker-rtl"), this.viewMode = this.o.startView, this.o.calendarWeeks && this.picker.find("tfoot th.today").attr("colspan", function (e, t) {
            return parseInt(t) + 1
        }), this._allow_update = !1, this.setStartDate(this._o.startDate), this.setEndDate(this._o.endDate), this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled), this.fillDow(), this.fillMonths(), this._allow_update = !0, this.update(), this.showMode(), this.isInline && this.show()
    };
    u.prototype = {
        constructor: u, _process_options: function (t) {
            this._o = e.extend({}, this._o, t);
            var n = this.o = e.extend({}, this._o), r = n.language;
            d[r] || (r = r.split("-")[0], d[r] || (r = h.language)), n.language = r;
            switch (n.startView) {
                case 2:
                case"decade":
                    n.startView = 2;
                    break;
                case 1:
                case"year":
                    n.startView = 1;
                    break;
                default:
                    n.startView = 0
            }
            switch (n.minViewMode) {
                case 1:
                case"months":
                    n.minViewMode = 1;
                    break;
                case 2:
                case"years":
                    n.minViewMode = 2;
                    break;
                default:
                    n.minViewMode = 0
            }
            n.startView = Math.max(n.startView, n.minViewMode), n.multidate !== !0 && (n.multidate = Number(n.multidate) || !1, n.multidate !== !1 ? n.multidate = Math.max(0, n.multidate) : n.multidate = 1), n.multidateSeparator = String(n.multidateSeparator), n.weekStart %= 7, n.weekEnd = (n.weekStart + 6) % 7;
            var i = v.parseFormat(n.format);
            n.startDate !== -Infinity && (n.startDate ? n.startDate instanceof Date ? n.startDate = this._local_to_utc(this._zero_time(n.startDate)) : n.startDate = v.parseDate(n.startDate, i, n.language) : n.startDate = -Infinity), n.endDate !== Infinity && (n.endDate ? n.endDate instanceof Date ? n.endDate = this._local_to_utc(this._zero_time(n.endDate)) : n.endDate = v.parseDate(n.endDate, i, n.language) : n.endDate = Infinity), n.daysOfWeekDisabled = n.daysOfWeekDisabled || [], e.isArray(n.daysOfWeekDisabled) || (n.daysOfWeekDisabled = n.daysOfWeekDisabled.split(/[,\s]*/)), n.daysOfWeekDisabled = e.map(n.daysOfWeekDisabled, function (e) {
                return parseInt(e, 10)
            });
            var s = String(n.orientation).toLowerCase().split(/\s+/g), o = n.orientation.toLowerCase();
            s = e.grep(s, function (e) {
                return /^auto|left|right|top|bottom$/.test(e)
            }), n.orientation = {x: "auto", y: "auto"};
            if (!!o && o !== "auto")if (s.length === 1)switch (s[0]) {
                case"top":
                case"bottom":
                    n.orientation.y = s[0];
                    break;
                case"left":
                case"right":
                    n.orientation.x = s[0]
            } else o = e.grep(s, function (e) {
                return /^left|right$/.test(e)
            }), n.orientation.x = o[0] || "auto", o = e.grep(s, function (e) {
                return /^top|bottom$/.test(e)
            }), n.orientation.y = o[0] || "auto"
        }, _events: [], _secondaryEvents: [], _applyEvents: function (e) {
            for (var n = 0, r, i, s; n < e.length; n++)r = e[n][0], e[n].length === 2 ? (i = t, s = e[n][1]) : e[n].length === 3 && (i = e[n][1], s = e[n][2]), r.on(s, i)
        }, _unapplyEvents: function (e) {
            for (var n = 0, r, i, s; n < e.length; n++)r = e[n][0], e[n].length === 2 ? (s = t, i = e[n][1]) : e[n].length === 3 && (s = e[n][1], i = e[n][2]), r.off(i, s)
        }, _buildEvents: function () {
            this.isInput ? this._events = [[this.element, {
                focus: e.proxy(this.show, this), keyup: e.proxy(function (t) {
                    e.inArray(t.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1 && this.update()
                }, this), keydown: e.proxy(this.keydown, this)
            }]] : this.component && this.hasInput ? this._events = [[this.element.find("input"), {
                focus: e.proxy(this.show, this),
                keyup: e.proxy(function (t) {
                    e.inArray(t.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1 && this.update()
                }, this),
                keydown: e.proxy(this.keydown, this)
            }], [this.component, {click: e.proxy(this.show, this)}]] : this.element.is("div") ? this.isInline = !0 : this._events = [[this.element, {click: e.proxy(this.show, this)}]], this._events.push([this.element, "*", {
                blur: e.proxy(function (e) {
                    this._focused_from = e.target
                }, this)
            }], [this.element, {
                blur: e.proxy(function (e) {
                    this._focused_from = e.target
                }, this)
            }]), this._secondaryEvents = [[this.picker, {click: e.proxy(this.click, this)}], [e(window), {resize: e.proxy(this.place, this)}], [e(document), {
                "mousedown touchstart": e.proxy(function (e) {
                    this.element.is(e.target) || this.element.find(e.target).length || this.picker.is(e.target) || this.picker.find(e.target).length || this.hide()
                }, this)
            }]]
        }, _attachEvents: function () {
            this._detachEvents(), this._applyEvents(this._events)
        }, _detachEvents: function () {
            this._unapplyEvents(this._events)
        }, _attachSecondaryEvents: function () {
            this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
        }, _detachSecondaryEvents: function () {
            this._unapplyEvents(this._secondaryEvents)
        }, _trigger: function (t, n) {
            var r = n || this.dates.get(-1), i = this._utc_to_local(r);
            this.element.trigger({
                type: t,
                date: i,
                dates: e.map(this.dates, this._utc_to_local),
                format: e.proxy(function (e, t) {
                    arguments.length === 0 ? (e = this.dates.length - 1, t = this.o.format) : typeof e == "string" && (t = e, e = this.dates.length - 1), t = t || this.o.format;
                    var n = this.dates.get(e);
                    return v.formatDate(n, t, this.o.language)
                }, this)
            })
        }, show: function () {
            this.isInline || this.picker.appendTo("body"), this.picker.show(), this.place(), this._attachSecondaryEvents(), this._trigger("show")
        }, hide: function () {
            if (this.isInline)return;
            if (!this.picker.is(":visible"))return;
            this.focusDate = null, this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this._trigger("hide")
        }, remove: function () {
            this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date
        }, _utc_to_local: function (e) {
            return e && new Date(e.getTime() + e.getTimezoneOffset() * 6e4)
        }, _local_to_utc: function (e) {
            return e && new Date(e.getTime() - e.getTimezoneOffset() * 6e4)
        }, _zero_time: function (e) {
            return e && new Date(e.getFullYear(), e.getMonth(), e.getDate())
        }, _zero_utc_time: function (e) {
            return e && new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()))
        }, getDates: function () {
            return e.map(this.dates, this._utc_to_local)
        }, getUTCDates: function () {
            return e.map(this.dates, function (e) {
                return new Date(e)
            })
        }, getDate: function () {
            return this._utc_to_local(this.getUTCDate())
        }, getUTCDate: function () {
            return new Date(this.dates.get(-1))
        }, setDates: function () {
            var t = e.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, t), this._trigger("changeDate"), this.setValue()
        }, setUTCDates: function () {
            var t = e.isArray(arguments[0]) ? arguments[0] : arguments;
            this.update.apply(this, e.map(t, this._utc_to_local)), this._trigger("changeDate"), this.setValue()
        }, setDate: s("setDates"), setUTCDate: s("setUTCDates"), setValue: function () {
            var e = this.getFormattedDate();
            this.isInput ? this.element.val(e).change() : this.component && this.element.find("input").val(e).change()
        }, getFormattedDate: function (n) {
            n === t && (n = this.o.format);
            var r = this.o.language;
            return e.map(this.dates, function (e) {
                return v.formatDate(e, n, r)
            }).join(this.o.multidateSeparator)
        }, setStartDate: function (e) {
            this._process_options({startDate: e}), this.update(), this.updateNavArrows()
        }, setEndDate: function (e) {
            this._process_options({endDate: e}), this.update(), this.updateNavArrows()
        }, setDaysOfWeekDisabled: function (e) {
            this._process_options({daysOfWeekDisabled: e}), this.update(), this.updateNavArrows()
        }, place: function () {
            if (this.isInline)return;
            var t = this.picker.outerWidth(), r = this.picker.outerHeight(), i = 10, s = n.width(), o = n.height(), u = n.scrollTop(), a = parseInt(this.element.parents().filter(function () {
                    return e(this).css("z-index") !== "auto"
                }).first().css("z-index")) + 10, f = this.component ? this.component.parent().offset() : this.element.offset(), l = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1), c = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1), h = f.left, p = f.top;
            this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), this.o.orientation.x !== "auto" ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), this.o.orientation.x === "right" && (h -= t - c)) : (this.picker.addClass("datepicker-orient-left"), f.left < 0 ? h -= f.left - i : f.left + t > s && (h = s - t - i));
            var d = this.o.orientation.y, v, m;
            d === "auto" && (v = -u + f.top - r, m = u + o - (f.top + l + r), Math.max(v, m) === m ? d = "top" : d = "bottom"), this.picker.addClass("datepicker-orient-" + d), d === "top" ? p += l : p -= r + parseInt(this.picker.css("padding-top")), this.picker.css({
                top: p,
                left: h,
                zIndex: a
            })
        }, _allow_update: !0, update: function () {
            if (!this._allow_update)return;
            var t = this.dates.copy(), n = [], r = !1;
            arguments.length ? (e.each(arguments, e.proxy(function (e, t) {
                t instanceof Date && (t = this._local_to_utc(t)), n.push(t)
            }, this)), r = !0) : (n = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val(), n && this.o.multidate ? n = n.split(this.o.multidateSeparator) : n = [n], delete this.element.data().date), n = e.map(n, e.proxy(function (e) {
                return v.parseDate(e, this.o.format, this.o.language)
            }, this)), n = e.grep(n, e.proxy(function (e) {
                return e < this.o.startDate || e > this.o.endDate || !e
            }, this), !0), this.dates.replace(n), this.dates.length ? this.viewDate = new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? this.viewDate = new Date(this.o.startDate) : this.viewDate > this.o.endDate && (this.viewDate = new Date(this.o.endDate)), r ? this.setValue() : n.length && String(t) !== String(this.dates) && this._trigger("changeDate"), !this.dates.length && t.length && this._trigger("clearDate"), this.fill()
        }, fillDow: function () {
            var e = this.o.weekStart, t = "<tr>";
            if (this.o.calendarWeeks) {
                var n = '<th class="cw">&nbsp;</th>';
                t += n, this.picker.find(".datepicker-days thead tr:first-child").prepend(n)
            }
            while (e < this.o.weekStart + 7)t += '<th class="dow">' + d[this.o.language].daysMin[e++ % 7] + "</th>";
            t += "</tr>", this.picker.find(".datepicker-days thead").append(t)
        }, fillMonths: function () {
            var e = "", t = 0;
            while (t < 12)e += '<span class="month">' + d[this.o.language].monthsShort[t++] + "</span>";
            this.picker.find(".datepicker-months td").html(e)
        }, setRange: function (t) {
            !t || !t.length ? delete this.range : this.range = e.map(t, function (e) {
                return e.valueOf()
            }), this.fill()
        }, getClassNames: function (t) {
            var n = [], r = this.viewDate.getUTCFullYear(), i = this.viewDate.getUTCMonth(), s = new Date;
            return t.getUTCFullYear() < r || t.getUTCFullYear() === r && t.getUTCMonth() < i ? n.push("old") : (t.getUTCFullYear() > r || t.getUTCFullYear() === r && t.getUTCMonth() > i) && n.push("new"), this.focusDate && t.valueOf() === this.focusDate.valueOf() && n.push("focused"), this.o.todayHighlight && t.getUTCFullYear() === s.getFullYear() && t.getUTCMonth() === s.getMonth() && t.getUTCDate() === s.getDate() && n.push("today"), this.dates.contains(t) !== -1 && n.push("active"), (t.valueOf() < this.o.startDate || t.valueOf() > this.o.endDate || e.inArray(t.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) && n.push("disabled"), this.range && (t > this.range[0] && t < this.range[this.range.length - 1] && n.push("range"), e.inArray(t.valueOf(), this.range) !== -1 && n.push("selected")), n
        }, fill: function () {
            var n = new Date(this.viewDate), i = n.getUTCFullYear(), s = n.getUTCMonth(), o = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity, u = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity, a = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity, f = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity, l = d[this.o.language].today || d.en.today || "", c = d[this.o.language].clear || d.en.clear || "", h;
            this.picker.find(".datepicker-days thead th.datepicker-switch").text(d[this.o.language].months[s] + " " + i), this.picker.find("tfoot th.today").text(l).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot th.clear").text(c).toggle(this.o.clearBtn !== !1), this.updateNavArrows(), this.fillMonths();
            var p = r(i, s - 1, 28), m = v.getDaysInMonth(p.getUTCFullYear(), p.getUTCMonth());
            p.setUTCDate(m), p.setUTCDate(m - (p.getUTCDay() - this.o.weekStart + 7) % 7);
            var g = new Date(p);
            g.setUTCDate(g.getUTCDate() + 42), g = g.valueOf();
            var y = [], b;
            while (p.valueOf() < g) {
                if (p.getUTCDay() === this.o.weekStart) {
                    y.push("<tr>");
                    if (this.o.calendarWeeks) {
                        var w = new Date(+p + (this.o.weekStart - p.getUTCDay() - 7) % 7 * 864e5), E = new Date(Number(w) + (11 - w.getUTCDay()) % 7 * 864e5), S = new Date(Number(S = r(E.getUTCFullYear(), 0, 1)) + (11 - S.getUTCDay()) % 7 * 864e5), x = (E - S) / 864e5 / 7 + 1;
                        y.push('<td class="cw">' + x + "</td>")
                    }
                }
                b = this.getClassNames(p), b.push("day");
                if (this.o.beforeShowDay !== e.noop) {
                    var T = this.o.beforeShowDay(this._utc_to_local(p));
                    T === t ? T = {} : typeof T == "boolean" ? T = {enabled: T} : typeof T == "string" && (T = {classes: T}), T.enabled === !1 && b.push("disabled"), T.classes && (b = b.concat(T.classes.split(/\s+/))), T.tooltip && (h = T.tooltip)
                }
                b = e.unique(b), y.push('<td class="' + b.join(" ") + '"' + (h ? ' title="' + h + '"' : "") + ">" + p.getUTCDate() + "</td>"), p.getUTCDay() === this.o.weekEnd && y.push("</tr>"), p.setUTCDate(p.getUTCDate() + 1)
            }
            this.picker.find(".datepicker-days tbody").empty().append(y.join(""));
            var N = this.picker.find(".datepicker-months").find("th:eq(1)").text(i).end().find("span").removeClass("active");
            e.each(this.dates, function (e, t) {
                t.getUTCFullYear() === i && N.eq(t.getUTCMonth()).addClass("active")
            }), (i < o || i > a) && N.addClass("disabled"), i === o && N.slice(0, u).addClass("disabled"), i === a && N.slice(f + 1).addClass("disabled"), y = "", i = parseInt(i / 10, 10) * 10;
            var C = this.picker.find(".datepicker-years").find("th:eq(1)").text(i + "-" + (i + 9)).end().find("td");
            i -= 1;
            var k = e.map(this.dates, function (e) {
                return e.getUTCFullYear()
            }), L;
            for (var A = -1; A < 11; A++)L = ["year"], A === -1 ? L.push("old") : A === 10 && L.push("new"), e.inArray(i, k) !== -1 && L.push("active"), (i < o || i > a) && L.push("disabled"), y += '<span class="' + L.join(" ") + '">' + i + "</span>", i += 1;
            C.html(y)
        }, updateNavArrows: function () {
            if (!this._allow_update)return;
            var e = new Date(this.viewDate), t = e.getUTCFullYear(), n = e.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    this.o.startDate !== -Infinity && t <= this.o.startDate.getUTCFullYear() && n <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({visibility: "hidden"}) : this.picker.find(".prev").css({visibility: "visible"}), this.o.endDate !== Infinity && t >= this.o.endDate.getUTCFullYear() && n >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({visibility: "hidden"}) : this.picker.find(".next").css({visibility: "visible"});
                    break;
                case 1:
                case 2:
                    this.o.startDate !== -Infinity && t <= this.o.startDate.getUTCFullYear() ? this.picker.find(".prev").css({visibility: "hidden"}) : this.picker.find(".prev").css({visibility: "visible"}), this.o.endDate !== Infinity && t >= this.o.endDate.getUTCFullYear() ? this.picker.find(".next").css({visibility: "hidden"}) : this.picker.find(".next").css({visibility: "visible"})
            }
        }, click: function (t) {
            t.preventDefault();
            var n = e(t.target).closest("span, td, th"), i, s, o;
            if (n.length === 1)switch (n[0].nodeName.toLowerCase()) {
                case"th":
                    switch (n[0].className) {
                        case"datepicker-switch":
                            this.showMode(1);
                            break;
                        case"prev":
                        case"next":
                            var u = v.modes[this.viewMode].navStep * (n[0].className === "prev" ? -1 : 1);
                            switch (this.viewMode) {
                                case 0:
                                    this.viewDate = this.moveMonth(this.viewDate, u), this._trigger("changeMonth", this.viewDate);
                                    break;
                                case 1:
                                case 2:
                                    this.viewDate = this.moveYear(this.viewDate, u), this.viewMode === 1 && this._trigger("changeYear", this.viewDate)
                            }
                            this.fill();
                            break;
                        case"today":
                            var a = new Date;
                            a = r(a.getFullYear(), a.getMonth(), a.getDate(), 0, 0, 0), this.showMode(-2);
                            var f = this.o.todayBtn === "linked" ? null : "view";
                            this._setDate(a, f);
                            break;
                        case"clear":
                            var l;
                            this.isInput ? l = this.element : this.component && (l = this.element.find("input")), l && l.val("").change(), this.update(), this._trigger("changeDate"), this.o.autoclose && this.hide()
                    }
                    break;
                case"span":
                    n.is(".disabled") || (this.viewDate.setUTCDate(1), n.is(".month") ? (o = 1, s = n.parent().find("span").index(n), i = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(s), this._trigger("changeMonth", this.viewDate), this.o.minViewMode === 1 && this._setDate(r(i, s, o))) : (o = 1, s = 0, i = parseInt(n.text(), 10) || 0, this.viewDate.setUTCFullYear(i), this._trigger("changeYear", this.viewDate), this.o.minViewMode === 2 && this._setDate(r(i, s, o))), this.showMode(-1), this.fill());
                    break;
                case"td":
                    n.is(".day") && !n.is(".disabled") && (o = parseInt(n.text(), 10) || 1, i = this.viewDate.getUTCFullYear(), s = this.viewDate.getUTCMonth(), n.is(".old") ? s === 0 ? (s = 11, i -= 1) : s -= 1 : n.is(".new") && (s === 11 ? (s = 0, i += 1) : s += 1), this._setDate(r(i, s, o)))
            }
            this.picker.is(":visible") && this._focused_from && e(this._focused_from).focus(), delete this._focused_from
        }, _toggle_multidate: function (e) {
            var t = this.dates.contains(e);
            e ? t !== -1 ? this.dates.remove(t) : this.dates.push(e) : this.dates.clear();
            if (typeof this.o.multidate == "number")while (this.dates.length > this.o.multidate)this.dates.remove(0)
        }, _setDate: function (e, t) {
            (!t || t === "date") && this._toggle_multidate(e && new Date(e));
            if (!t || t === "view")this.viewDate = e && new Date(e);
            this.fill(), this.setValue(), this._trigger("changeDate");
            var n;
            this.isInput ? n = this.element : this.component && (n = this.element.find("input")), n && n.change(), this.o.autoclose && (!t || t === "date") && this.hide()
        }, moveMonth: function (e, n) {
            if (!e)return t;
            if (!n)return e;
            var r = new Date(e.valueOf()), i = r.getUTCDate(), s = r.getUTCMonth(), o = Math.abs(n), u, a;
            n = n > 0 ? 1 : -1;
            if (o === 1) {
                a = n === -1 ? function () {
                    return r.getUTCMonth() === s
                } : function () {
                    return r.getUTCMonth() !== u
                }, u = s + n, r.setUTCMonth(u);
                if (u < 0 || u > 11)u = (u + 12) % 12
            } else {
                for (var f = 0; f < o; f++)r = this.moveMonth(r, n);
                u = r.getUTCMonth(), r.setUTCDate(i), a = function () {
                    return u !== r.getUTCMonth()
                }
            }
            while (a())r.setUTCDate(--i), r.setUTCMonth(u);
            return r
        }, moveYear: function (e, t) {
            return this.moveMonth(e, t * 12)
        }, dateWithinRange: function (e) {
            return e >= this.o.startDate && e <= this.o.endDate
        }, keydown: function (e) {
            if (this.picker.is(":not(:visible)")) {
                e.keyCode === 27 && this.show();
                return
            }
            var t = !1, n, r, s, o = this.focusDate || this.viewDate;
            switch (e.keyCode) {
                case 27:
                    this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide(), e.preventDefault();
                    break;
                case 37:
                case 39:
                    if (!this.o.keyboardNavigation)break;
                    n = e.keyCode === 37 ? -1 : 1, e.ctrlKey ? (r = this.moveYear(this.dates.get(-1) || i(), n), s = this.moveYear(o, n), this._trigger("changeYear", this.viewDate)) : e.shiftKey ? (r = this.moveMonth(this.dates.get(-1) || i(), n), s = this.moveMonth(o, n), this._trigger("changeMonth", this.viewDate)) : (r = new Date(this.dates.get(-1) || i()), r.setUTCDate(r.getUTCDate() + n), s = new Date(o), s.setUTCDate(o.getUTCDate() + n)), this.dateWithinRange(r) && (this.focusDate = this.viewDate = s, this.setValue(), this.fill(), e.preventDefault());
                    break;
                case 38:
                case 40:
                    if (!this.o.keyboardNavigation)break;
                    n = e.keyCode === 38 ? -1 : 1, e.ctrlKey ? (r = this.moveYear(this.dates.get(-1) || i(), n), s = this.moveYear(o, n), this._trigger("changeYear", this.viewDate)) : e.shiftKey ? (r = this.moveMonth(this.dates.get(-1) || i(), n), s = this.moveMonth(o, n), this._trigger("changeMonth", this.viewDate)) : (r = new Date(this.dates.get(-1) || i()), r.setUTCDate(r.getUTCDate() + n * 7), s = new Date(o), s.setUTCDate(o.getUTCDate() + n * 7)), this.dateWithinRange(r) && (this.focusDate = this.viewDate = s, this.setValue(), this.fill(), e.preventDefault());
                    break;
                case 32:
                    break;
                case 13:
                    o = this.focusDate || this.dates.get(-1) || this.viewDate, this._toggle_multidate(o), t = !0, this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.setValue(), this.fill(), this.picker.is(":visible") && (e.preventDefault(), this.o.autoclose && this.hide());
                    break;
                case 9:
                    this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill(), this.hide()
            }
            if (t) {
                this.dates.length ? this._trigger("changeDate") : this._trigger("clearDate");
                var u;
                this.isInput ? u = this.element : this.component && (u = this.element.find("input")), u && u.change()
            }
        }, showMode: function (e) {
            e && (this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + e))), this.picker.find(">div").hide().filter(".datepicker-" + v.modes[this.viewMode].clsName).css("display", "block"), this.updateNavArrows()
        }
    };
    var a = function (t, n) {
        this.element = e(t), this.inputs = e.map(n.inputs, function (e) {
            return e.jquery ? e[0] : e
        }), delete n.inputs, e(this.inputs).datepicker(n).bind("changeDate", e.proxy(this.dateUpdated, this)), this.pickers = e.map(this.inputs, function (t) {
            return e(t).data("datepicker")
        }), this.updateDates()
    };
    a.prototype = {
        updateDates: function () {
            this.dates = e.map(this.pickers, function (e) {
                return e.getUTCDate()
            }), this.updateRanges()
        }, updateRanges: function () {
            var t = e.map(this.dates, function (e) {
                return e.valueOf()
            });
            e.each(this.pickers, function (e, n) {
                n.setRange(t)
            })
        }, dateUpdated: function (t) {
            if (this.updating)return;
            this.updating = !0;
            var n = e(t.target).data("datepicker"), r = n.getUTCDate(), i = e.inArray(t.target, this.inputs), s = this.inputs.length;
            if (i === -1)return;
            e.each(this.pickers, function (e, t) {
                t.getUTCDate() || t.setUTCDate(r)
            });
            if (r < this.dates[i])while (i >= 0 && r < this.dates[i])this.pickers[i--].setUTCDate(r); else if (r > this.dates[i])while (i < s && r > this.dates[i])this.pickers[i++].setUTCDate(r);
            this.updateDates(), delete this.updating
        }, remove: function () {
            e.map(this.pickers, function (e) {
                e.remove()
            }), delete this.element.data().datepicker
        }
    };
    var c = e.fn.datepicker;
    e.fn.datepicker = function (n) {
        var r = Array.apply(null, arguments);
        r.shift();
        var i;
        return this
            .each(function () {
                var s = e(this), o = s.data("datepicker"), c = typeof n == "object" && n;
                if (!o) {
                    var p = f(this, "date"), d = e.extend({}, h, p, c), v = l(d.language), m = e.extend({}, h, v, p, c);
                    if (s.is(".input-daterange") || m.inputs) {
                        var g = {inputs: m.inputs || s.find("input").toArray()};
                        s.data("datepicker", o = new a(this, e.extend(m, g)))
                    } else s.data("datepicker", o = new u(this, m))
                }
                if (typeof n == "string" && typeof o[n] == "function") {
                    i = o[n].apply(o, r);
                    if (i !== t)return !1
                }
            }), i !== t ? i : this
    };
    var h = e.fn.datepicker.defaults = {
        autoclose: !1,
        beforeShowDay: e.noop,
        calendarWeeks: !1,
        clearBtn: !1,
        daysOfWeekDisabled: [],
        endDate: Infinity,
        forceParse: !0,
        format: "mm/dd/yyyy",
        keyboardNavigation: !0,
        language: "en",
        minViewMode: 0,
        multidate: !1,
        multidateSeparator: ",",
        orientation: "auto",
        rtl: !1,
        startDate: -Infinity,
        startView: 0,
        todayBtn: !1,
        todayHighlight: !1,
        weekStart: 0
    }, p = e.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    e.fn.datepicker.Constructor = u;
    var d = e.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear"
        }
    }, v = {
        modes: [{clsName: "days", navFnc: "Month", navStep: 1}, {
            clsName: "months",
            navFnc: "FullYear",
            navStep: 1
        }, {clsName: "years", navFnc: "FullYear", navStep: 10}],
        isLeapYear: function (e) {
            return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
        },
        getDaysInMonth: function (e, t) {
            return [31, v.isLeapYear(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t]
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function (e) {
            var t = e.replace(this.validParts, "\0").split("\0"), n = e.match(this.validParts);
            if (!t || !t.length || !n || n.length === 0)throw new Error("Invalid date format.");
            return {separators: t, parts: n}
        },
        parseDate: function (n, i, s) {
            function w() {
                var e = this.slice(0, a[c].length), t = a[c].slice(0, e.length);
                return e === t
            }

            if (!n)return t;
            if (n instanceof Date)return n;
            typeof i == "string" && (i = v.parseFormat(i));
            var o = /([\-+]\d+)([dmwy])/, a = n.match(/([\-+]\d+)([dmwy])/g), f, l, c;
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(n)) {
                n = new Date;
                for (c = 0; c < a.length; c++) {
                    f = o.exec(a[c]), l = parseInt(f[1]);
                    switch (f[2]) {
                        case"d":
                            n.setUTCDate(n.getUTCDate() + l);
                            break;
                        case"m":
                            n = u.prototype.moveMonth.call(u.prototype, n, l);
                            break;
                        case"w":
                            n.setUTCDate(n.getUTCDate() + l * 7);
                            break;
                        case"y":
                            n = u.prototype.moveYear.call(u.prototype, n, l)
                    }
                }
                return r(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 0, 0, 0)
            }
            a = n && n.match(this.nonpunctuation) || [], n = new Date;
            var h = {}, p = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"], m = {
                yyyy: function (e, t) {
                    return e.setUTCFullYear(t)
                }, yy: function (e, t) {
                    return e.setUTCFullYear(2e3 + t)
                }, m: function (e, t) {
                    if (isNaN(e))return e;
                    t -= 1;
                    while (t < 0)t += 12;
                    t %= 12, e.setUTCMonth(t);
                    while (e.getUTCMonth() !== t)e.setUTCDate(e.getUTCDate() - 1);
                    return e
                }, d: function (e, t) {
                    return e.setUTCDate(t)
                }
            }, g, y;
            m.M = m.MM = m.mm = m.m, m.dd = m.d, n = r(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0);
            var b = i.parts.slice();
            a.length !== b.length && (b = e(b).filter(function (t, n) {
                return e.inArray(n, p) !== -1
            }).toArray());
            if (a.length === b.length) {
                var E;
                for (c = 0, E = b.length; c < E; c++) {
                    g = parseInt(a[c], 10), f = b[c];
                    if (isNaN(g))switch (f) {
                        case"MM":
                            y = e(d[s].months).filter(w), g = e.inArray(y[0], d[s].months) + 1;
                            break;
                        case"M":
                            y = e(d[s].monthsShort).filter(w), g = e.inArray(y[0], d[s].monthsShort) + 1
                    }
                    h[f] = g
                }
                var S, x;
                for (c = 0; c < p.length; c++)x = p[c], x in h && !isNaN(h[x]) && (S = new Date(n), m[x](S, h[x]), isNaN(S) || (n = S))
            }
            return n
        },
        formatDate: function (t, n, r) {
            if (!t)return "";
            typeof n == "string" && (n = v.parseFormat(n));
            var i = {
                d: t.getUTCDate(),
                D: d[r].daysShort[t.getUTCDay()],
                DD: d[r].days[t.getUTCDay()],
                m: t.getUTCMonth() + 1,
                M: d[r].monthsShort[t.getUTCMonth()],
                MM: d[r].months[t.getUTCMonth()],
                yy: t.getUTCFullYear().toString().substring(2),
                yyyy: t.getUTCFullYear()
            };
            i.dd = (i.d < 10 ? "0" : "") + i.d, i.mm = (i.m < 10 ? "0" : "") + i.m, t = [];
            var s = e.extend([], n.separators);
            for (var o = 0, u = n.parts.length; o <= u; o++)s.length && t.push(s.shift()), t.push(i[n.parts[o]]);
            return t.join("")
        },
        headTemplate: '<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
    v.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + v.headTemplate + "<tbody></tbody>" + v.footTemplate + "</table>" + "</div>" + '<div class="datepicker-months">' + '<table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + "</table>" + "</div>" + '<div class="datepicker-years">' + '<table class="table-condensed">' + v.headTemplate + v.contTemplate + v.footTemplate + "</table>" + "</div>" + "</div>", e.fn.datepicker.DPGlobal = v, e.fn.datepicker.noConflict = function () {
        return e.fn.datepicker = c, this
    }, e(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function (t) {
        var n = e(this);
        if (n.data("datepicker"))return;
        t.preventDefault(), n.datepicker("show")
    }), e(function () {
        e('[data-provide="datepicker-inline"]').datepicker()
    })
}(window.jQuery), function (e) {
    e.fn.datepicker.dates["zh-CN"] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        format: "yyyy年mm月dd日",
        weekStart: 1
    }
}(jQuery), function (e) {
    e.fn.datepicker.dates["zh-TW"] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六", "週日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        format: "yyyy年mm月dd日",
        weekStart: 1
    }
}(jQuery), function () {
    window.GoldenData || (window.GoldenData = {}), GoldenData.recalcFormHeight = function () {
        if (!($.browser.msie && $.browser.version < 7))return $(window).trigger("customLoad")
    }, GoldenData.numberToHumanSize = function (e) {
        var t, n, r;
        return e ? (n = e / 1024, n < 1024 ? "" + n.toFixed(0) + " KB" : (r = n / 1024, r < 1024 ? "" + r.toFixed(1) + " MB" : (t = r / 1024, "" + t.toFixed(1) + " GB"))) : null
    }, GoldenData.updateSubmitBtn = function () {
        var e, t, n, r, i;
        return t = $(".submit-field input.submit, .entry-show .actions .btn[data-role='submit']"), n = (r = t.data("fileUploading")) != null ? r : 0, n < 0 && t.data("fileUploading", 0), e = (i = n > 0 || t.data("no-goods-selected")) != null ? i : !1, t.attr("disabled", e)
    }, GoldenData.refreshWeixinToken = function (e) {
        return setTimeout(function () {
            return $.ajax({url: e, type: "patch"})
        }, 10)
    }, GoldenData.getFormMessages = function (e) {
        return setTimeout(function () {
            return $.ajax({url: e}).done(function (e) {
                if ($.trim(e))return $("#new_entry .form-message").html(e), $("#new_entry .form-message").slideDown(GoldenData.recalcFormHeight)
            })
        }, 10)
    }, GoldenData.extractExistedQueryParams = function () {
        var e;
        return e = {}, !url("?order") || (e.order = url("?order")), !url("?per_page") || (e.per_page = url("?per_page")), !$("[data-allow-multi-filter]").data("allow-multi-filter") && !0 ? e : (!url("?query") || (e.query = decodeURIComponent(url("?query"))), !url("?start") || (e.start = url("?start")), !url("?end") || (e.end = url("?end")), $.isEmptyObject(GoldenData.filterParams.data) || (e = $.extend(e, GoldenData.filterParams.data)), e)
    }, GoldenData.isAndroidDevice = function () {
        return navigator.userAgent.indexOf("Android") > 0
    }, GoldenData.isIOS8Device = function () {
        return /iP(ad|hone|od)/.test(navigator.userAgent) && /OS 8_\d(_\d)?/.test(navigator.userAgent)
    }, GoldenData.renderQrcode = function (e, t, n) {
        var r, i;
        return Modernizr.canvas ? typeof (r = e.empty()).qrcode == "function" ? r.qrcode({
            width: n,
            height: n,
            text: t
        }) : void 0 : typeof (i = e.empty()).qrcode == "function" ? i.qrcode({
            render: "table",
            width: n,
            height: n,
            text: t
        }) : void 0
    }, $(function () {
        var e, t;
        return $(document).on("page:load ready", function () {
            var e;
            return typeof (e = $("input, textarea")).placeholder == "function" && e.placeholder(), $("#login_modal").length > 0 && $("#login_modal").modal("show"), $("#login_modal .invitation").on("click", function () {
                return $("#login_modal .alert").hide(), $(this).parents("section").addClass("gd-hide"), $("." + $(this).data("for")).removeClass("gd-hide")
            }), $("form#new_entry input").on("keypress", function (e) {
                if (e.keyCode === 13)return e.preventDefault()
            }), $("#form_error_messages_modal").modal("show"), autosize($(".field-content textarea:visible")), typeof GoldenData.initWeixinLogin == "function" && GoldenData.initWeixinLogin($(".social-account.account-weixin")), t()
        }), t = function () {
            var e, t, n;
            e = $(".qrcode"), n = e.data("text");
            if (n)return t = e.data("size") || 175, GoldenData.renderQrcode(e, n, t)
        }, $(document).on("click", ".captcha-container img", function () {
            return $(this).attr("src", "/captcha?action=captcha&i=" + (new Date).getTime())
        }), $(document).on("click", ".submit-field .submit", function (e) {
            var t;
            t = $(this).parents("form"), t.find("input:text").each(function () {
                return $(this).val($.trim($(this).val()))
            });
            if ($(".submit-field .captcha-container").length > 0)return e.preventDefault(), $.get("/captcha/verify?captcha=" + encodeURIComponent($("#captcha").val()), function (e) {
                return e === "false" ? ($("#captcha").addClass("error"), $(".captcha-container .error-message").show()) : t.submit()
            })
        }), $(document).on("click", ".user-info .logout-link", function (e) {
            return e.preventDefault(), $.ajax({
                url: $(this).attr("href"), type: "delete", complete: function (e) {
                    if (e.status === 200)return window.location.reload()
                }
            })
        }), $(document).on("click", ".qrcode-box + .corner-qrcode img", function (e) {
            return $(".qrcode-box").show("normal"), e.stopPropagation()
        }), e = function (e) {
            if (!$(e).is(".qrcode-box + .corner-qrcode img"))return $(".qrcode-box").hide("normal")
        }, $(document).on("click", "body", function (t) {
            return e(t.target)
        }), $(document).on("keyup", function (t) {
            if (t.keyCode === 27)return e(t.target)
        }), $(window).on("scroll resize", function () {
            var e;
            if (GoldenData.isMobile)return e = $(document).scrollTop().valueOf() > 20, $(".goods-warning").css({position: e ? "fixed" : "initial"})
        })
    })
}.call(this), function () {
    $(function () {
        return GoldenData.DatePicker = function () {
            function e(e) {
                $(e).find(".day_of_week").click(function () {
                    return $(this).prev(".input_date").focus().select()
                }), $(e).find(".input_date").datepicker({
                    language: String.locale || "zh-CN",
                    format: "yyyy-mm-dd",
                    autoclose: !0,
                    orientation: "auto left"
                })
            }

            return e
        }(), GoldenData.initDatePicker = function (e) {
            var t, n, r, i, s;
            i = $(e).find("[data-role=date]"), s = [];
            for (n = 0, r = i.length; n < r; n++)t = i[n], $(t).attr("type") === "text" || !Modernizr.inputtypes.date ? s.push(new GoldenData.DatePicker($(t).parents(".controls"))) : s.push($(t).next(".day_of_week").remove());
            return s
        }, $(document).on("ready page:load ajax:complete", function () {
            if (!($(".dashboard").length > 0))return GoldenData.initDatePicker(document)
        })
    })
}.call(this), function () {
    window.GoldenData || (window.GoldenData = {}), $(function () {
        return GoldenData.AddressSelector = function () {
            function e(e) {
                var t;
                this.data = e, this.provinces = function () {
                    var e;
                    e = [];
                    for (t in this.data)e.push(t);
                    return e
                }.call(this)
            }

            return e.prototype.render = function (e, t, n, r, i, s) {
                var o, u, a, f, l;
                r == null && (r = ""), i == null && (i = ""), s == null && (s = ""), e.html("<option value=''>- 省/自治区/直辖市 -</option>"), l = this.provinces;
                for (a = 0, f = l.length; a < f; a++)u = l[a], o = $("<option value='" + u + "'>" + u + "</option>"), u === r && o.prop("selected", !0), e.append(o);
                return this.renderCityOptions(r, t, i), this.renderDistrictOptions(r, i, n, s), e.on("change", function (r) {
                    return function () {
                        return r.renderCityOptions(e.val(), t), r.renderDistrictOptions(e.val(), "", n)
                    }
                }(this)), t.on("change", function (r) {
                    return function () {
                        return r.renderDistrictOptions(e.val(), t.val(), n)
                    }
                }(this))
            }, e.prototype.renderCityOptions = function (e, t, n) {
                var r, i, s, o, u, a;
                n == null && (n = ""), t.html("<option value=''>- 市 -</option>");
                if (this.data.hasOwnProperty(e)) {
                    u = _.keys(this.data[e]), a = [];
                    for (s = 0, o = u.length; s < o; s++)r = u[s], i = $("<option value='" + r + "'>" + r + "</option>"), r === n && i.prop("selected", !0), a.push(t.append(i));
                    return a
                }
            }, e.prototype.renderDistrictOptions = function (e, t, n, r) {
                var i, s, o, u, a, f, l;
                r == null && (r = ""), n.html("<option value=''>- 区/县 -</option>");
                if ((a = this.data[e]) != null ? a[t] : void 0) {
                    f = this.data[e][t], l = [];
                    for (o = 0, u = f.length; o < u; o++)i = f[o], s = $("<option value='" + i + "'>" + i + "</option>"), i === r && s.prop("selected", !0), l.push(n.append(s));
                    return l
                }
            }, e
        }(), GoldenData.initAddressSelector = function (e) {
            var t, n, r, i, s, o, u, a;
            if (GoldenData.addressSelector) {
                u = $(e).find("[data-role=address]"), a = [];
                for (s = 0, o = u.length; s < o; s++)t = u[s], i = $(t).find("[data-role=province]"), n = $(t).find("[data-role=city]"), r = $(t).find("[data-role=district]"), a.push(GoldenData.addressSelector.render(i, n, r, i.data("value"), n.data("value"), r.data("value")));
                return a
            }
        }, $(document).on("ready page:load ajax:complete", function () {
            if (!($(".dashboard").length > 0))return GoldenData.initAddressSelector(document)
        })
    })
}.call(this), function () {
    $(function () {
        var e, t, n, r, i;
        return i = !0, r = function (e, t, n, r) {
            $(e).find(".rating-group i").removeClass("hover");
            if (r !== "")return $(e).find(".rating-group[data-field-id=" + t + "] i:lt(" + r + ")").addClass("highlight"), $(e).find(".rating-group[data-field-id=" + t + "] i:gt(" + (r - 1) + ")").removeClass("highlight")
        }, e = function (e) {
            return $(e).off("click touchend", ".rating-group i"), $(e).on("click touchend", ".rating-group i", function (t) {
                var n, s, o;
                return t.stopPropagation(), i = !1, n = $(this).parents(".rating-group").data("field-id"), s = $(this).parents(".rating-group").data("rating-type"), o = $(this).data("value"), $(e).find("#entry_" + n).val($(this).data("value")), r(e, n, s, o)
            })
        }, t = function (e) {
            return $(e).off("mouseenter touchstart", ".rating-group i"), $(e).on("mouseenter touchstart", ".rating-group i", function (t) {
                var n, r, s;
                t.stopPropagation(), GoldenData.isMobile && (i = !0);
                if (i && !$.browser.msie)return n = $(this).parents(".rating-group").data("field-id"), r = $(this).parents(".rating-group").data("rating-type"), s = $(this).data("value"), $(e).find(".rating-group[data-field-id=" + n + "] i:lt(" + s + ")").removeClass("highlight").addClass("hover"), $(e).find(".rating-group[data-field-id=" + n + "] i:gt(" + (s - 1) + ")").removeClass("highlight hover")
            })
        }, n = function (e) {
            return $(e).off("mouseleave touchend", ".rating-group"), $(e).on("mouseleave touchend", ".rating-group", function (t) {
                var n;
                return t.stopPropagation(), n = $(e).find("#entry_" + $(this).data("field-id")).val(), r(e, $(this).data("field-id"), $(this).data("rating-type"), n), i = !0
            })
        }, GoldenData.initRating = function (r) {
            return r == null && (r = document), t(r), e(r), n(r)
        }, $(document).on("ready page:load", function () {
            if (!($(".dashboard").length > 0))return GoldenData.initRating(document)
        })
    })
}.call(this), function () {
    $(function () {
        var e;
        return e = function (e, t) {
            var n;
            return n = $(e).parents(".controls").find("input.other-choice"), $(e).find(".other-choice-item").is(":selected") ? (n.show(), n.removeClass("gd-hide"), t && n.focus(), n.parents(".ui-input-text").show()) : (n.hide(), n.addClass("gd-hide"), n.parents(".ui-input-text").hide())
        }, GoldenData.initialDropdownOtherChoice = function (t, n) {
            return $(t).find(".controls select.with-other-choice").each(function () {
                return e(this, n)
            })
        }, $(document).on("ready page:load", function () {
            var t;
            return t = function (e) {
                return function (e, t) {
                    return $(t).parents(".other-choice-area").find("input." + e)
                }
            }(this), $(document).on("click", ".other-choice-input", function () {
                var e;
                e = t("other_choice", this);
                if (!e.is(":checked")) {
                    e.click();
                    if (e.checkboxradio != null)return $("input[type=radio], input[type=checkbox]").checkboxradio("refresh")
                }
            }), $(document).on("click", "input.other_choice", function () {
                $(this).checkboxradio != null && $(this).checkboxradio("refresh");
                if ($(this).is(":checked"))return t("other-choice-input", this).focus()
            }), GoldenData.initialDropdownOtherChoice(document, !1), $(document).on("change", "form .field .controls select.with-other-choice", function () {
                return e($(this), !0)
            }), $(".entry form, #new_entry").on("submit", function () {
                return $(this).find("input.other_choice").each(function () {
                    if (!$(this).is(":checked"))return t("other-choice-input", this).val("")
                }), $(this).find("option.other-choice-item").each(function () {
                    if (!$(this).is(":selected"))return $(this).parents(".controls").find("input.other-choice").val("")
                })
            })
        })
    })
}.call(this), function () {
    $(function () {
        return $(".image-attachment-preview").livequery(function () {
            return $(this).one("load", function () {
                return $(this).prev(".preview-loading").hide(), $(this).css("visibility", "visible"), $(this).next("a").show()
            }).each(function () {
                if (this.complete)return $(this).load()
            })
        })
    })
}.call(this), function () {
    window.GoldenData || (window.GoldenData = {}), GoldenData.validateAttachment = function (e, t) {
        if (e.name.substr(0, 1) === ".")return l("%warn_system_file");
        if (e.name.length > 200)return l("%file_name_too_long");
        if (/.*\.(exe|bat)$/gi.test(e.name))return l("%warn_exec_file");
        if (e.size && e.size > t)return l("%warn_oversize", {maxSize: GoldenData.numberToHumanSize(t)})
    }, $(function () {
        var e, t, n, r, i, s, o, u, a, f, c, h, p, d, v, m, g, y, b, w, E, S;
        return n = $.support.xhrFormDataFileUpload, p = function (e, t, r) {
            var i, s, o;
            return t == null && (t = ""), r == null && (r = null), (o = e.find("[data-role=cancel]").data("jqXHR")) != null && o.abort(), s = e.find(".status"), i = s.find(".file-name"), i.removeClass("error"), i.text(t), s.find(".error").remove(), s.find(".file-name + .error").remove(), s.find(".file-size-status").show(), n ? (e.find(".progress-bar").css({width: "0%"}).show(), s.find(".file-size").text(r)) : (s.find(".text-status, .progress").remove(), s.find(".progress-container").prepend("<div class='text-status'>" + l("%uploading") + "</div>")), s.show(), e.find(".select-area .preview").empty(), e.find("input[data-role=attachment_id]").val("")
        }, c = function (e) {
            var t;
            return t = $(e.target).parents(".attachment"), t.siblings().size() > 0 ? t.remove() : (t.find("[data-role=attachment_id]").val(""), t.hide())
        }, v = function (e, t) {
            return e.find("input[data-role=attachment_id]").val(""), n ? e.find(".status .progress .progress-bar").addClass("initial").text("0%").css("width", "auto") : e.find(".status .text-status").remove(), e.find(".status .file-size-status").hide(), e.find(".status .file-name").addClass("error").after("<span class='error'>" + l("%bracket", {content: t}) + "</span>")
        }, b = function (e) {
            var t, n, r;
            return r = $(".uploaded[data-field='" + e + "']").size(), n = $(".attachment[data-field='" + e + "']:visible").size(), t = $(".submit-field input.submit, .entry-show .actions .btn[data-role='submit']"), t.data("fileUploading", n - r), GoldenData.updateSubmitBtn()
        }, s = function (e, t) {
            var n, r, i, s, o;
            return t == null && (t = ""), r = e.data("field"), $(".attachment-select-trigger[data-field='" + r + "']").hide(), o = $('<input class="origin-file-input" type="file">'), s = e.find('[data-role="attachment_id"]'), i = e.find('input[type="file"]').attr("data-max-size"), o.attr("id", s.attr("id")), o.attr("name", "entry[" + r + "]"), o.attr("data-max-size", i), t && (n = GoldenData.isMobile ? "<i class='mobile-icon-cancel-circled'></i>" : "<i class='fa fa-times-circle'></i>", o.after($("<div class='validation-message'><div class='help-block inline-error'>" + n + " " + t + "</div></div>"))), e.show().html(o), e.closest("form").attr("enctype", "multipart/form-data")
        }, E = function (e, t, n) {
            var r;
            t.find("input[data-role=attachment_id]").val(n.attachment_id);
            if (n.image_url != null)return r = "<a href='" + n.image_url_for_lightbox + "' rel='lightbox[" + e.field + "]'>" + ("<img src='" + n.image_url + "'></a>"), t.find(".preview-area .preview").html(r)
        }, S = function (e, t) {
            var n;
            return n = _.isArray(t) ? t.join(l("%common_separator")) : t, v(e, n)
        }, w = function (e, t, n) {
            var r;
            return r = e.context, n ? $.ajax({
                type: "POST",
                url: "/p/a/en",
                data: t,
                dataType: "json"
            }).done(function (n) {
                return setTimeout(function () {
                    return r.find(".progress-bar").css("width", "100%").fadeOut(), b(e.field)
                }, 200), E(t, r, n)
            }).fail(function (e) {
                var t;
                return t = $.parseJSON(e.responseText), S(r, t.errors)
            }) : t.errors ? S(r, t.errors) : (r.find(".status .progress-container .text-status").text(l("%upload_done")), E(t, r, t))
        }, i = function (e) {
            var t, n;
            return t = $(".attachment-error-message[data-field=" + e.field + "]"), n = $(".attachment[data-field=" + e.field + "]:visible").hasClass("rechoosing"), !n && e.availableFileQuantity <= 0 ? (t.html(l("%max_file_quantity", {maxFileQuantity: e.maxFileQuantity})), !1) : (t.html(""), !0)
        }, f = function (e) {
            var t, n;
            return n = e.data("field"), t = $(".attachment[data-field=" + n + "]:visible").size(), t >= e.data("max-file-quantity")
        }, y = function (e) {
            return f(e) ? e.hide() : e.show()
        }, a = function (e) {
            return e.parent().sortable({
                cursor: "move",
                items: ".attachment",
                forcePlaceholderSize: !0,
                placeholder: "sortable-placeholder"
            })
        }, d = function (e, t) {
            var n, r, i, s;
            return n = t.name.split("."), r = n[n.length - 1].toLowerCase(), i = (s = GoldenData.attachmentIconPath[r]) != null ? s : GoldenData.attachmentIconPath["default"], e.find(".preview-area .preview").html("<img src='" + i + "'>")
        }, o = function (e) {
            return setTimeout(function () {
                return $(".attachment-error-message[data-field=" + e.field + "]").html("")
            }, 3e3)
        }, m = function (e, t) {
            var n, r, i;
            return i = $(".attachment.rechoosing[data-field=" + t + "]"), n = $(".attachment[data-field=" + t + "]").first(), $(".attachment[data-field=" + t + "]:hidden").size() === 1 ? e.context = n.show() : i.size() > 0 ? (e.context = i, i.removeClass("rechoosing")) : (r = n.clone().show(), $(".attachments[data-field=" + t + "]").append(r), e.context = r), e.context.removeClass("uploaded")
        }, h = function (e) {
            var t;
            return t = $("input[type='file'][data-field='" + e + "']"), t.prop("multiple", t.data("origin-multiple"))
        }, u = function (t, n) {
            var r;
            return r = t.data("field"), $(document).on("click", "a[data-role=cancel]", function (e) {
                var n;
                return $(this).parents(".attachment").find(".progress-bar").css("width", "0%"), c(e), y(t), (n = $(this).data("jqXHR")) != null && n.abort(), b(r)
            }), $(document).on("click", ".btn-link[data-role=rechoose]", function (e) {
                var t;
                return t = $(e.target).parents(".attachment"), $("input[type='file'][data-field='" + r + "']").prop("multiple", !1), t.addClass("rechoosing")
            }), t.find("label").on("dragleave", function () {
                return $(this).removeClass("drag-over")
            }), n.closest(".field[data-api-code]").on("shown.logic", function () {
                return e($(this))
            })
        }, g = function (e, t) {
            var r;
            r = "" + Date.parse(new Date) + "_" + _.random(0, 1e3) + "_" + t, e.formData = {
                accept: "text/plain; charset=utf-8",
                token: GoldenData.xhrUploadToken,
                "x:field_api_code": e.context.closest(".field[data-api-code]").data("api-code"),
                "x:timestamp_with_random_number": r
            };
            if (!n)return e.formData.token = GoldenData.iframeUploadToken
        }, r = function (e, t) {
            var n;
            return n = t.data("field"), e.field = n, e.maxFileQuantity = t.data("max-file-quantity"), e.availableFileQuantity = e.maxFileQuantity - $(".attachment[data-field=" + n + "]:visible").size()
        }, t = function (e) {
            var t, a, f;
            f = 0, a = e.data("field"), t = $(".attachment[data-field=" + a + "]").first(), u(e, t);
            if (typeof $("input:file").fileupload != "function")return;
            return $(".jquery-file-upload-file-input[data-field='" + a + "']").fileupload({
                dataType: "json",
                dropZone: e.find("label"),
                paramName: "file",
                sequentialUploads: !0,
                url: "https://up.qbox.me/",
                dragover: function () {
                    return e.find("label").addClass("drag-over")
                },
                drop: function () {
                    return e.find("label").removeClass("drag-over")
                },
                add: function (t, n) {
                    var s, o;
                    r(n, e);
                    if (!i(n))return !1;
                    o = n.files[0], m(n, a), d(n.context, o), p(n.context, o.name, GoldenData.numberToHumanSize(o.size)), s = GoldenData.validateAttachment(o, $(this).data("max-size"));
                    if (s)return v(n.context, s);
                    if (!n.context.hasClass("preview"))return g(n, f), n.context.find("[data-role=cancel]").data("jqXHR", n.submit()), y(e), f += 1, b(a)
                },
                progress: function (e, t) {
                    var n, r;
                    return n = parseInt(t.loaded / t.total * 100, 10), r = Math.min(n, 99) + "%", t.context.find(".progress-bar").css("width", r)
                },
                fail: function (e, t) {
                    var n, r;
                    return (r = t.jqXHR.status) === 401 ? (n = l("%upload_failed_" + t.jqXHR.status), v(t.context, n)) : t.jqXHR.status === 400 ? (n = l("%upload_failed_400"), s(t.context, n)) : (n = l("%upload_failed", {status: t.jqXHR.status}), t.jqXHR.status !== 0 && $.post("/p/a/failure", {
                        url: url(),
                        status: t.jqXHR.status,
                        message: t.jqXHR.responseText,
                        file_name: t.files[0].name,
                        authenticity_token: t.context.closest("form").find("[name=authenticity_token]").val(),
                        user_agent: navigator.userAgent,
                        comment: "window.FormData = " + !!window.FormData + ", isMobile = " + !!GoldenData.isMobile
                    }), v(t.context, n))
                },
                done: function (e, t) {
                    var r;
                    return o(t), h(a), t.context.addClass("uploaded"), r = t.result, r ? w(t, r, n) : v(t.context, l("%upload_failed_401"))
                }
            })
        }, e = function (e) {
            var t, n;
            if (e.find("[data-role=attachment]").length > 0)return GoldenData.isMobile ? (t = $(window).width() - 30, n = t - 85) : n = e.find("[data-role=attachment]").outerWidth() - 150, e.find("[data-role=attachment] .status").width(n)
        }, GoldenData.initializeFileUploads = function (n) {
            return e($(n)), $.each($(n).find(".attachment-select-trigger"), function (e, n) {
                return t($(n))
            })
        }, $(document).on("ready page:load ajax:complete", function () {
            var e, t;
            return window.FormData || $(".attachment-field input.jquery-file-upload-file-input").each(function () {
                var e, t;
                return t = $(this).data("field"), e = $("[data-role=attachment][data-field='" + t + "']"), s($(e))
            }), $("input.origin-file-input").length > 0 && ($("#new_entry").attr("enctype", "multipart/form-data"), e = $("input.origin-file-input").parent(".attachment"), t = e.data("field"), $(".attachment-select-trigger[data-field='" + t + "']").hide(), e.show()), GoldenData.initializeFileUploads(document)
        }), $(window).on("resize", function () {
            return e($(document))
        }), $(document).on("mouseenter", ".attachment", function () {
            return $(this).find(".web-actions").show()
        }), $(document).on("mouseleave", ".attachment", function () {
            return $(this).find(".web-actions").hide()
        })
    })
}.call(this), function () {
    var e, t, n;
    e = jQuery, GoldenData.LightboxOptions = function () {
        function e() {
            this.fadeDuration = 500, this.fitImagesInViewport = !0, this.resizeDuration = 700, this.showImageNumberLabel = !0, this.wrapAround = !1
        }

        return e.prototype.albumLabel = function (e, t) {
            return "Image " + e + " of " + t
        }, e
    }(), GoldenData.Lightbox = function () {
        function t(e) {
            this.options = e, this.album = [], this.currentImageIndex = void 0, this.init()
        }

        return t.prototype.init = function () {
            return this.enable(), this.build()
        }, t.prototype.enable = function () {
            var t = this;
            return e("body").on("click", "a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]", function (n) {
                return t.start(e(n.currentTarget)), !1
            })
        }, t.prototype.build = function () {
            var t = this;
            return e("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'><div class='lb-container'><img class='lb-image' src='' /><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-loader'><a class='lb-cancel'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'></a></div></div></div></div>").appendTo(e("body")), this.$lightbox = e("#lightbox"), this.$overlay = e("#lightboxOverlay"), this.$outerContainer = this.$lightbox.find(".lb-outerContainer"), this.$container = this.$lightbox.find(".lb-container"), this.containerTopPadding = parseInt(this.$container.css("padding-top"), 10), this.containerRightPadding = parseInt(this.$container.css("padding-right"), 10), this.containerBottomPadding = parseInt(this.$container.css("padding-bottom"), 10), this.containerLeftPadding = parseInt(this.$container.css("padding-left"), 10), this.$overlay.hide().on("click", function () {
                return t.end(), !1
            }), this.$lightbox.hide().on("click", function (n) {
                return e(n.target).attr("id") === "lightbox" && t.end(), !1
            }), this.$outerContainer.on("click", function (n) {
                return e(n.target).attr("id") === "lightbox" && t.end(), !1
            }), this.$lightbox.find(".lb-prev").on("click", function () {
                return t.currentImageIndex === 0 ? t.changeImage(t.album.length - 1) : t.changeImage(t.currentImageIndex - 1), !1
            }), this.$lightbox.find(".lb-next").on("click", function () {
                return t.currentImageIndex === t.album.length - 1 ? t.changeImage(0) : t.changeImage(t.currentImageIndex + 1), !1
            }), this.$lightbox.find(".lb-loader, .lb-close").on("click", function () {
                return t.end(), !1
            })
        }, t.prototype.start = function (t) {
            var n, r, i, s, o, u, a, f, l, c, h, p, d;
            e(window).on("resize", this.sizeOverlay), e("select, object, embed").css({visibility: "hidden"}), this.$overlay.width(e(document).width()).height(e(document).height()).fadeIn(this.options.fadeDuration), this.album = [], o = 0, i = t.attr("data-lightbox");
            if (i) {
                p = e(t.prop("tagName") + '[data-lightbox="' + i + '"]');
                for (s = f = 0, c = p.length; f < c; s = ++f)r = p[s], this.album.push({
                    link: e(r).attr("href"),
                    title: e(r).attr("title")
                }), e(r).attr("href") === t.attr("href") && (o = s)
            } else if (t.attr("rel") === "lightbox")this.album.push({
                link: t.attr("href"),
                title: t.attr("title")
            }); else {
                d = e(t.prop("tagName") + '[rel="' + t.attr("rel") + '"]');
                for (s = l = 0, h = d.length; l < h; s = ++l)r = d[s], this.album.push({
                    link: e(r).attr("href"),
                    title: e(r).attr("title")
                }), e(r).attr("href") === t.attr("href") && (o = s)
            }
            n = e(window), a = n.scrollTop() + n.height() / 10, u = n.scrollLeft(), this.$lightbox.css({
                top: a + "px",
                left: u + "px"
            }).fadeIn(this.options.fadeDuration), this.changeImage(o)
        }, t.prototype.changeImage = function (t) {
            var n, r, i = this;
            this.disableKeyboardNav(), n = this.$lightbox.find(".lb-image"), this.sizeOverlay(), this.$overlay.fadeIn(this.options.fadeDuration), e(".lb-loader").fadeIn("slow"), this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption").hide(), this.$outerContainer.addClass("animating"), r = new Image, r.onload = function () {
                var s, o, u, a, f, l, c;
                n.attr("src", i.album[t].link), s = e(r), n.width(r.width), n.height(r.height);
                if (i.options.fitImagesInViewport) {
                    c = e(window).width(), l = e(window).height(), f = c - i.containerLeftPadding - i.containerRightPadding - 20, a = l - i.containerTopPadding - i.containerBottomPadding - 110;
                    if (r.width > f || r.height > a)r.width / f > r.height / a ? (u = f, o = parseInt(r.height / (r.width / u), 10), n.width(u), n.height(o)) : (o = a, u = parseInt(r.width / (r.height / o), 10), n.width(u), n.height(o))
                }
                return i.sizeContainer(n.width(), n.height())
            }, r.src = this.album[t].link, this.currentImageIndex = t
        }, t.prototype.sizeOverlay = function () {
            return e("#lightboxOverlay").width(e(document).width()).height(e(document).height())
        }, t.prototype.sizeContainer = function (e, t) {
            var n, r, i, s, o = this;
            s = this.$outerContainer.outerWidth(), i = this.$outerContainer.outerHeight(), r = e + this.containerLeftPadding + this.containerRightPadding, n = t + this.containerTopPadding + this.containerBottomPadding, this.$outerContainer.animate({
                width: r,
                height: n
            }, this.options.resizeDuration, "swing"), setTimeout(function () {
                o.$lightbox.find(".lb-dataContainer").width(r), o.$lightbox.find(".lb-prevLink").height(n), o.$lightbox.find(".lb-nextLink").height(n), o.showImage()
            }, this.options.resizeDuration)
        }, t.prototype.showImage = function () {
            this.$lightbox.find(".lb-loader").hide(), this.$lightbox.find(".lb-image").fadeIn("slow"), this.updateNav(), this.updateDetails(), this.preloadNeighboringImages(), this.enableKeyboardNav()
        }, t.prototype.updateNav = function () {
            this.$lightbox.find(".lb-nav").show(), this.album.length > 1 && (this.options.wrapAround ? this.$lightbox.find(".lb-prev, .lb-next").show() : (this.currentImageIndex > 0 && this.$lightbox.find(".lb-prev").show(), this.currentImageIndex < this.album.length - 1 && this.$lightbox.find(".lb-next").show()))
        }, t.prototype.updateDetails = function () {
            var e = this;
            typeof this.album[this.currentImageIndex].title != "undefined" && this.album[this.currentImageIndex].title !== "" && this.$lightbox.find(".lb-caption").html(this.album[this.currentImageIndex].title).fadeIn("fast"), this.album.length > 1 && this.options.showImageNumberLabel ? this.$lightbox.find(".lb-number").text(this.options.albumLabel(this.currentImageIndex + 1, this.album.length)).fadeIn("fast") : this.$lightbox.find(".lb-number").hide(), this.$outerContainer.removeClass("animating"), this.$lightbox.find(".lb-dataContainer").fadeIn(this.resizeDuration, function () {
                return e.sizeOverlay()
            })
        }, t.prototype.preloadNeighboringImages = function () {
            var e, t;
            this.album.length > this.currentImageIndex + 1 && (e = new Image, e.src = this.album[this.currentImageIndex + 1].link), this.currentImageIndex > 0 && (t = new Image, t.src = this.album[this.currentImageIndex - 1].link)
        }, t.prototype.enableKeyboardNav = function () {
            e(document).on("keyup.keyboard", e.proxy(this.keyboardAction, this))
        }, t.prototype.disableKeyboardNav = function () {
            e(document).off(".keyboard")
        }, t.prototype.keyboardAction = function (e) {
            var t, n, r, i, s;
            t = 27, n = 37, r = 39, s = e.keyCode, i = String.fromCharCode(s).toLowerCase(), s === t || i.match(/x|o|c/) ? this.end() : i === "p" || s === n ? this.currentImageIndex !== 0 && this.changeImage(this.currentImageIndex - 1) : (i === "n" || s === r) && this.currentImageIndex !== this.album.length - 1 && this.changeImage(this.currentImageIndex + 1)
        }, t.prototype.end = function () {
            return this.disableKeyboardNav(), e(window).off("resize", this.sizeOverlay), this.$lightbox.fadeOut(this.options.fadeDuration), this.$overlay.fadeOut(this.options.fadeDuration), e("select, object, embed").css({visibility: "visible"})
        }, t
    }()
}.call(this), function () {
    $(function () {
        return $(document).on("page:load ready", function () {
            var e;
            return e = {
                fadeDuration: 200,
                resizeDuration: 100
            }, e = _.extend({}, new GoldenData.LightboxOptions, e), GoldenData.lightbox = new GoldenData.Lightbox(e)
        }), $(document).on("change", ".choices.image-choices input", function () {
            return $(this).closest(".image-choices"
            ).children(".radio.active").removeClass("active"), $(this).closest(".radio, .checkbox").toggleClass("active")
        })
    })
}.call(this), function () {
    var e = [].indexOf || function (e) {
            for (var t = 0, n = this.length; t < n; t++)if (t in this && this[t] === e)return t;
            return -1
        };
    window.GoldenData || (window.GoldenData = {}), $(function () {
        var t, n, r;
        return r = function (e) {
            var t, n, r, i, s;
            n = $("[name='entry[" + e + "]']:visible").filter(":radio:checked, :not(:radio)").add("[name='entry[" + e + "][]']:visible:checked"), s = [];
            for (r = 0, i = n.length; r < i; r++)t = n[r], s.push($(t).val());
            return s
        }, n = function () {
            function e(e, t) {
                this.apiCode = t, this.targets = [], this.element = $(e).find("[name='entry[" + this.apiCode + "]']"), this.elementContainer = $(e).find(".field[data-api-code='" + this.apiCode + "']"), this.elementContainer.addClass("logic-trigger")
            }

            return e.prototype._informTargets = function (e) {
                var t, n, r, i, s;
                i = this.targets, s = [];
                for (n = 0, r = i.length; n < r; n++)t = i[n], s.push(t.set(this.apiCode, e));
                return s
            }, e.prototype.run = function () {
                return this.element.on("change", function (e) {
                    return function (t) {
                        e._informTargets(r(e.apiCode));
                        if (!$(t.target).hasClass("with-other-choice"))return t.stopPropagation()
                    }
                }(this)), this.elementContainer.on("change.formLogic", function (e) {
                    return function () {
                        return e._informTargets(r(e.apiCode))
                    }
                }(this))
            }, e
        }(), t = function () {
            function t(e, t, n) {
                var i;
                this.apiCode = t, this.triggerConditions = n, this.element = $(e).find("[name^='entry[" + this.apiCode + "]']"), this.elementContainer = $(e).find(".field[data-api-code='" + this.apiCode + "']");
                for (i in this.triggerConditions)this.set(i, r(i))
            }

            return t.prototype._onElementContainerShowHide = function () {
                return this.elementContainer.trigger("change.formLogic"), GoldenData.recalcFormHeight(), $(window).trigger("formContentShowHide")
            }, t.prototype.set = function (t, n) {
                var r, i, s, o;
                s = (o = this.elementContainer.data("triggered-by")) != null ? o : [], n && _.intersection(n, this.triggerConditions[t]).length > 0 ? e.call(s, t) < 0 && s.push(t) : s = _.without(s, t), this.elementContainer.data("triggered-by", s), r = !this.elementContainer.hasClass("logic-hidden"), i = s.length > 0, i && !r && (this.elementContainer.show(), this.elementContainer.removeClass("logic-hidden"), this.elementContainer.trigger("shown.logic"), autosize(this.elementContainer.find("textarea")), this.element.attr("disabled", !1), this._onElementContainerShowHide());
                if (!i && r)return this.elementContainer.hide(), this.elementContainer.addClass("logic-hidden"), this.elementContainer.trigger("hidden.logic"), this.element.attr("disabled", !0), this._onElementContainerShowHide()
            }, t
        }(), GoldenData.FormLogic = function () {
            function e(e, r) {
                var i, s, o, u, a;
                r == null && (r = document), this.triggers = {}, this.targets = {};
                for (i in e) {
                    o = e[i], (u = this.targets)[i] || (u[i] = new t(r, i, o));
                    for (s in o)(a = this.triggers)[s] || (a[s] = new n(r, s)), this.triggers[s].targets.push(this.targets[i])
                }
            }

            return e.prototype.run = function () {
                var e, t, n, r;
                n = this.triggers, r = [];
                for (e in n)t = n[e], r.push(t.run());
                return r
            }, e
        }(), GoldenData.initFormLogic = function (e, t) {
            return t == null && (t = document), (new GoldenData.FormLogic(e, t)).run()
        }
    })
}.call(this), function () {
    $(function () {
        var e, t, n;
        return e = function () {
            function e(e) {
                var t, n, r, i, s;
                n = e.sku, this.fieldApiCode = e.fieldApiCode, this.goodsValue = e.goodsValue, n == null && (n = {}), this.specification = (r = n.specification) != null ? r : {}, this.price = parseFloat((i = n.price) != null ? i : e.price), t = (s = n.inventory) != null ? s : e.inventory, this.inventory = t != null ? parseInt(t) : null
            }

            return e.prototype.priceDisplay = function () {
                return "&yen;" + this.price.toFixed(2)
            }, e.prototype.inventoryDisplay = function (e, t) {
                return this.inventory == null ? "" : this.inventory > 0 ? "" + e + " " + this.inventory + " " + t : l("%sold_out")
            }, e
        }(), t = function () {
            function t(e, t) {
                this.$el = e, this.shoppingCart = t, this.initialPriceDisplay = this.$el.find(".price").html(), this.initialInventoryDisplay = this.$el.find(".inventory").html(), this._initializeCurrentSpecification(), this._initializeGoodsSKUs(), this._bindOnDimensionChangeEvent(), this._bindOnIncreaseDecreaseClickEvent(), this._bindOnNumberChangeEvent(), this._bindShowHideEvent(), (this.$el.is(":visible") || this._mobileGoodsVisible()) && this._updateCurrentGoodsSKU()
            }

            return t.prototype._addGoodsSKU = function (t, n, r, i, s) {
                var o;
                return r == null && (r = null), i == null && (i = null), s == null && (s = null), o = new e({
                    fieldApiCode: t,
                    goodsValue: n,
                    sku: r,
                    price: i,
                    inventory: s
                }), this.goodsSKUs.push(o)
            }, t.prototype._initializeGoodsSKUs = function () {
                var e, t, n, r, i, s, o, u, a;
                this.goodsSKUs = [], r = this.$el.find("input.number"), e = r.data("field-api-code"), t = r.data("goods-value"), o = this.$el.find(".dimensions").data("skus");
                if (!_.isEmpty(o))for (u = 0, a = o.length; u < a; u++)s = o[u], this._addGoodsSKU(e, t, s);
                if (this.goodsSKUs.length === 0)return i = r.data("goods-price"), n = r.data("inventory"), this._addGoodsSKU(e, t, null, i, n), this._updateNumberInput(), this._updateDecreaseIncreaseBtn(0)
            }, t.prototype._matchedGoodsSKU = function () {
                return _.find(this.goodsSKUs, function (e) {
                    return function (t) {
                        return _.isEqual(t.specification, e.currentSpecification)
                    }
                }(this))
            }, t.prototype._updateNumberInput = function () {
                var e, t;
                return t = this.$el.find("input.number"), e = this._matchedGoodsSKU(), t.prop("disabled", e == null || e.inventory != null && e.inventory === 0)
            }, t.prototype._updateDecreaseIncreaseBtn = function (e) {
                var t, n, r;
                r = this._matchedGoodsSKU(), n = $(this.$el.find(".increase")), t = $(this.$el.find(".decrease")), n.toggleClass("disabled", r == null || r.inventory != null && r.inventory <= e), t.toggleClass("disabled", e <= 0);
                if ($.browser.msie && parseInt($.browser.version, 10) <= 9)return n.html(n.html()), t.html(t.html())
            }, t.prototype._updatePriceAndInventoryDisplay = function () {
                var e;
                return e = this._matchedGoodsSKU(), e != null ? (this.$el.find(".price").html(e.priceDisplay()), this.$el.find(".inventory").html(e.inventoryDisplay(this.$el.data("inventory-label"), this.$el.data("unit")))) : (this.$el.find(".price").html(this.initialPriceDisplay), this.$el.find(".inventory").html(this.initialInventoryDisplay))
            }, t.prototype._bindOnDimensionChangeEvent = function () {
                var e;
                return e = this, this.$el.find(".dimension-options input:radio").change(function () {
                    var t, n, r;
                    return n = e.$el.find("input.number"), n.val(0).change(), t = $(this).closest(".dimension-options"), t.find("label.selected").removeClass("selected"), r = t.find("input:radio:checked"), r.next("label").addClass("selected"), e.currentSpecification[r.data("dimension")] = r.val(), e._updatePriceAndInventoryDisplay(), e._updateNumberInput(), e._updateDecreaseIncreaseBtn(0)
                }), this.$el.find(".dimension-options label").click(function () {
                    var t;
                    return t = $(this).attr("for"), e.$el.find("#" + t).prop("checked", !0).trigger("change")
                })
            }, t.prototype._bindOnIncreaseDecreaseClickEvent = function () {
                var e;
                return e = this, this.$el.find(".number-container a").click(function (t) {
                    var n, r, i;
                    if ($(this).hasClass("disabled"))return !1;
                    t.preventDefault(), r = e._matchedGoodsSKU();
                    if (r != null) {
                        i = e._currentNumber(), n = $(this).is(".increase") ? i + 1 : i - 1;
                        if (n >= 0 && !(r.inventory != null && n > r.inventory))return e.$el.find("input.number").val(n).trigger("change")
                    }
                })
            }, t.prototype._bindOnNumberChangeEvent = function () {
                var e;
                return e = this, this.$el.find("input.number").on("keydown", function (e) {
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 || e.keyCode >= 35 && e.keyCode <= 40)return;
                    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105))return e.preventDefault()
                }), this.$el.find("input.number").change(function () {
                    var t, n;
                    return t = $(this).val(), t && $.isNumeric(t) && t > 0 ? $(this).val(parseInt(t)) : $(this).val(0), n = e._matchedGoodsSKU(), n != null && n.inventory != null && t > n.inventory && $(this).val(n.inventory), e._updateDecreaseIncreaseBtn(t), e._addCurrentGoodsSKUsToShoppingCart()
                })
            }, t.prototype._bindShowHideEvent = function () {
                return this.$el.on("shown.logic", function (e) {
                    return function () {
                        return e._addCurrentGoodsSKUsToShoppingCart()
                    }
                }(this)), this.$el.on("hidden.logic", function (e) {
                    return function () {
                        return e._updateShoppingCart(0)
                    }
                }(this))
            }, t.prototype._addCurrentGoodsSKUsToShoppingCart = function (e) {
                return e == null && (e = !1), this._updateShoppingCart(this._currentNumber(), e)
            }, t.prototype._updateShoppingCart = function (e, t) {
                var n;
                n = this._matchedGoodsSKU();
                if (n != null)return this.shoppingCart.updateGoodsSKUNumber(n, e, t), e > 0 ? this.$el.addClass("active") : this.$el.removeClass("active")
            }, t.prototype._updateCurrentGoodsSKU = function () {
                return this._addCurrentGoodsSKUsToShoppingCart(!0), this._updatePriceAndInventoryDisplay(), this._updateNumberInput(), this._updateDecreaseIncreaseBtn(this._currentNumber())
            }, t.prototype._initializeCurrentSpecification = function () {
                var e, t, n, r, i;
                this.currentSpecification = {}, r = this.$el.find(".dimensions input:radio:checked"), i = [];
                for (t = 0, n = r.length; t < n; t++)e = r[t], i.push(this.currentSpecification[$(e).data("dimension")] = $(e).val());
                return i
            }, t.prototype._currentNumber = function () {
                return parseInt(this.$el.find("input.number").val())
            }, t.prototype._mobileGoodsVisible = function () {
                return GoldenData.isMobile && this.$el.parents(".field [data-role=collapsible]").is(":visible")
            }, t
        }(), n = function () {
            function e() {
                this.goodsList = [], this.eventHandlers = {}
            }

            return e.prototype.on = function (e, t) {
                return this.eventHandlers[e] = t
            }, e.prototype.trigger = function (e) {
                var t;
                t = this.eventHandlers[e];
                if (t != null && typeof t == "function")return t(this)
            }, e.prototype.updateGoodsSKUNumber = function (e, t, n) {
                var r;
                n == null && (n = !1), r = _.find(this.goodsList, function (t) {
                    return _.isEqual(t.goodsSKU, e)
                }), r != null && this.goodsList.splice(_.indexOf(this.goodsList, r), 1), t > 0 && this.goodsList.push({
                    goodsSKU: e,
                    number: t
                });
                if (!n)return this.trigger("change")
            }, e.prototype.totalPrice = function () {
                var e, t, n, r, i;
                t = 0, i = this.goodsList;
                for (n = 0, r = i.length; n < r; n++)e = i[n], t += e.goodsSKU.price * e.number;
                return t
            }, e.prototype._findGoodsByFieldApiCode = function (e) {
                return _.filter(this.goodsList, function (t) {
                    return t.goodsSKU.fieldApiCode === e
                })
            }, e.prototype.clearOnField = function (e) {
                var t, n, r, i;
                i = this._findGoodsByFieldApiCode(e);
                for (n = 0, r = i.length; n < r; n++)t = i[n], this.goodsList.splice(this.goodsList.indexOf(t), 1);
                return this.trigger("change")
            }, e
        }(), GoldenData.initGoods = function (e) {
            var r, i, s, o, u, a, f, c;
            o = new n, r = function (t) {
                var n;
                return n = $(e).find(".field[data-api-code='" + t + "'] .control-label"), $.trim(n.clone().children().remove().end().text())
            }, i = function (t) {
                var n, r, i;
                return n = $(e).find(".field[data-api-code='" + t.fieldApiCode + "'] [data-goods-value='" + t.goodsValue + "']").parents("[data-role=goods]"), r = $.trim(n.find(".name").text()), i = n.find(".dimensions input:radio:checked").map(function (e, t) {
                    return $.trim($(t).next("label").text())
                }).get().join(l("%common_separator")), i === "" ? "" + r + "：" : "" + r + "（" + i + "）："
            }, u = function (t, n) {
                var s, o, u, a, f, c, h, p, d, v, m, g;
                n == null && (n = "update");
                if (_.isEmpty(t.goodsList))$(e).find("#shopping_cart").empty(); else {
                    d = $("<div class='content'></div>"), g = t.goodsList;
                    for (v = 0, m = g.length; v < m; v++)a = g[v], c = a.goodsSKU, u = c.fieldApiCode, s = d.find(".field[data-api-code='" + u + "']"), s.length > 0 ? (o = s, f = o.find("ul")) : (o = $("<div class='field' data-api-code='" + u + "'></div>"), o.append("<div class='field-label'>" + r(u) + "：</div> "), f = $("<ul></ul>"), o.append(f), d.append(o)), h = $("<li></li>"), h.append("<span class='goods-name'>" + i(c) + "</span>"), h.append("<span class='price-number'>&yen;" + c.price.toFixed(2) + " &times; " + a.number + "</span>"), f.append(h);
                    d.append("<div class='summary'>" + l("%total") + "&yen; <span class='total-price'>" + t.totalPrice().toFixed(2) + "</span></div>"), $(e).find("#shopping_cart").html(d)
                }
                return p = _.isEmpty(t.goodsList) && $("[data-role=goods]").closest(".form-group").find(".control-label:visible").length > 0, $(".submit-field.payment input.submit").data("no-goods-selected", p), typeof GoldenData.updateSubmitBtn == "function" && GoldenData.updateSubmitBtn(), typeof GoldenData.recalcFormHeight == "function" ? GoldenData.recalcFormHeight() : void 0
            };
            if ($(e).find("[data-role=goods]").length > 0) {
                o.on("change", u), c = $(e).find("[data-role=goods]");
                for (a = 0, f = c.length; a < f; a++)s = c[a], new t($(s), o);
                return u(o, "init"), $(e).on("hidden.logic", ".field[data-api-code]", function () {
                    return o.clearOnField($(this).data("api-code"))
                }), $(e).on("shown.logic", ".field[data-api-code]", function () {
                    return $(this).find("[data-role=goods] input.number[value!=0]").trigger("change")
                })
            }
        }, $(document).on("ready page:load", function () {
            if (!($(".dashboard").length > 0))return GoldenData.initGoods(document)
        }), $(document).on("ajax:complete", "form:not(#submission_password_form)", function () {
            return GoldenData.initGoods(document)
        })
    })
}.call(this), function () {
    $(function () {
        var e, t, n, r, i, s, o;
        return i = function (e) {
            var t;
            return t = /^1\d{10}$/, t.test(e)
        }, t = function (e, t) {
            return e.addClass("disabled"), e.text(t)
        }, n = function (e) {
            return e.removeClass("disabled"), e.text(l("%resend"))
        }, r = function (e) {
            var t, n;
            return n = $.trim(e.val()), t = e.attr("name").match(/\[(.+)\]$/)[1], [n, t]
        }, o = function (e, t) {
            return e.prev("input").wrap("<div class='field_with_errors'></div>"), e.parent().after("<div class='error-message'>" + t + "</div>")
        }, s = function (e, t, r) {
            return $.post(t, r, function (t) {
                return GoldenData.countDown(e, 60), e.parent().after(t)
            }).fail(function (t) {
                return o(e, t.responseText), n(e)
            })
        }, e = function (e) {
            return e.prev(".field_with_errors").find("input").unwrap(), e.parent().nextAll(".error-message").remove()
        }, $(document).on("click", "[data-role='verification_sender'] a.add-on:not(.disabled):not(.preview)", function () {
            var n, u, a, f, c, h;
            return e($(this)), h = r($(this).parents("[data-role='verification_sender']").find(".mobile")), a = h[0], f = h[1], i(a) ? (t($(this), l("%sendingSMS")), c = {
                mobile: a,
                field_api_code: f
            }, n = $(this).closest("form").find("[name='authenticity_token']").val(), u = {
                field_verification: c,
                authenticity_token: n,
                form_id: $(this).data("form-id")
            }, s($(this), $(this).data("url"), u)) : o($(this), l("%warn_wrong_mobile_number"))
        }), $(document).on("click", "#change_sms_signature_modal [data-role=send_sms]:not(.disabled)", function () {
            var t, n, r, u;
            e($(this)), $(".field_with_errors #setting_sms_signature").unwrap().next(".error-message").remove(), t = !0, r = $("#setting_sms_signature").val(), r || ($("#setting_sms_signature").after("<div class='error-message'>请填写签名</div>").wrap("<div class='field_with_errors'></div>"), t = !1), n = $(this).prev("input").val();
            if (!n || !i(n))o($(this), l("%warn_wrong_mobile_number")), t = !1;
            if (t)return s($(this), "/field_verifications/check", {
                mobile: n,
                signature: r,
                form_id: typeof (u = GoldenData.form).get == "function" ? u.get("token") : void 0
            })
        }), $("#change_sms_signature_modal").on("hidden.bs.modal", function () {
            return e($(this).find("[data-role=send_sms]")), $(".field_with_errors #setting_sms_signature").unwrap().next(".error-message").remove()
        })
    })
}.call(this), function () {
    window.GoldenData || (window.GoldenData = {}), GoldenData.resetGeoFieldChooser = function (e) {
        e.find(".geo-field-chooser").removeClass("disabled"), e.find(".geo-field-chooser span").text(l("%geo_choose"));
        if (e.hasClass("mobile"))return e.find(".btn.geo-field-chooser").val(l("%geo_locate"))
    }, GoldenData.Geo = function () {
        function e(e, t) {
            this.$el = e, this.options = t != null ? t : {}, this.options = $.extend({
                staticMap: !1,
                mobile: !1,
                localizable: !1
            }, this.options), this.initMap(), this.options.staticMap || this.options.mobile && !this.options.localizable || this.initMapEvent()
        }

        return e.prototype._noOverrideError = function (e) {
            throw"can't find " + e + " in subclass"
        }, e.prototype.initMap = function () {
            return this._initMap(this.$el.find(".map-container")[0])
        }, e.prototype.getGeoMethod = function (e) {
            return this.geoArray || (this.geoArray = this._geoArray()), this.geoArray[e]
        }, e.prototype.onGetLocationSuccess = function (e, t) {
            return this.updateMap(e, null, t)
        }, e.prototype.onGetLocationFail = function () {
            return alert(l("%warn_geo_cannot_get_location")), GoldenData.resetGeoFieldChooser(this.$el)
        }, e.prototype._useNextGeoMethod = function (e) {
            var t;
            t = this.getGeoMethod(this.geoIndex);
            if (!t)return;
            return this.geoIndex++, t(e)
        }, e.prototype.currentLocation = function (e) {
            return e == null && (e = null), e = e != null ? e : {}, this.geoIndex = 0, this._useNextGeoMethod(e)
        }, e.prototype.updateMap = function (e, t, n) {
            return t == null && (t = null), n == null && (n = {}), this.mapObj && this.setMarker(e, n.zoom), this.showAddress(e, t, n), this.$el.find(".geo-map-coord").text(l("%geo_coord", {
                lat: e.lat.toFixed(8),
                "long": e.lng.toFixed(8)
            })), this.$el.find("input[name$='[latitude]']").val(e.lat), this.$el.find("input[name$='[longitude]']").val(e.lng)
        }, e.prototype._showAddress = function (e, t) {
            this.$el.find(".geo-map-address").text(l("%geo_address", {address: e})), this.$el.find("input[name$='[address]']").val(e);
            if (t.onComplete)return t.onComplete()
        }, e.prototype.showAddress = function (e, t, n) {
            return t == null && (t = null), n == null && (n = {}), t ? this._showAddress(t, n) : this._showAddressFromLocation(e, n)
        }, e.prototype._initMap = function (e) {
            return this._noOverrideError("_initMap")
        }, e.prototype.initMapEvent = function () {
            return this._noOverrideError("initMapEvent")
        }, e.prototype._geoArray = function () {
            return this._noOverrideError("_geoArray")
        }, e.prototype.setMarker = function (e, t) {
            return t == null && (t = null), this._noOverrideError("setMarker")
        }, e.prototype._showAddressFromLocation = function (e, t) {
            return this._noOverrideError("_showAddressFromLocation")
        }, e.prototype.searchLocation = function (e) {
            return this._noOverrideError("searchLocation")
        }, e
    }()
}.call(this), function () {
    var e = {}.hasOwnProperty, t = function (t, n) {
        function i() {
            this.constructor = t
        }

        for (var r in n)e.call(n, r) && (t[r] = n[r]);
        return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
    };
    GoldenData.GeoAutonavi = function (e) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }

        return t(n, e), n.prototype._initMap = function (e) {
            var t;
            try {
                return this.mapObj = new AMap.Map(e, {lang: String.locale})
            } catch (n) {
                return t = n, console.log(t)
            } finally {
                this.mapObj.plugin("AMap.ToolBar", function (e) {
                    return function () {
                        var t;
                        return t = e.options.localizable && e.options.mobile ? {offset: new AMap.Pixel(2, 65)} : {
                            direction: !1,
                            offset: new AMap.Pixel(-10, 5)
                        }, e.mapObj.addControl(new AMap.ToolBar(t))
                    }
                }(this))
            }
        }, n.prototype.initMapEvent = function () {
            return AMap.event.addListener(this.mapObj, "click", function (e) {
                return function (t) {
                    return e.updateMap(t.lnglat)
                }
            }(this))
        }, n.prototype._geoArray = function () {
            var e, t;
            return e = function (e) {
                return function (t) {
                    var n, r;
                    return r = function (n) {
                        return e.onGetLocationSuccess(n.position, t)
                    }, n = function (n) {
                        n == null && (n = null);
                        if (e._useNextGeoMethod(t))return;
                        if (n)switch (n.info) {
                            case"PERMISSION_DENIED":
                                alert(l("%warn_geo_permission_denied"));
                                break;
                            case"POSITION_UNAVAILBLE":
                                alert(l("%warn_geo_position_unavailable"));
                                break;
                            case"TIMEOUT":
                                alert(l("%warn_geo_timeout"));
                                break;
                            default:
                                alert(l("%warn_geo_unknown_error"))
                        }
                        return GoldenData.resetGeoFieldChooser(e.$el)
                    }, e.mapObj.plugin("AMap.Geolocation", function () {
                        var t;
                        return t = new AMap.Geolocation({
                            timeout: 5e3,
                            showButton: !1,
                            showCircle: !1,
                            zoomToAccuracy: !0
                        }), e.mapObj.addControl(t), AMap.event.addListener(t, "complete", r), AMap.event.addListener(t, "error", n), t.getCurrentPosition()
                    })
                }
            }(this), t = function (e) {
                return function (t) {
                    var n;
                    return n = function () {
                        if (e._useNextGeoMethod(t))return;
                        return e.onGetLocationFail()
                    }, e.mapObj.plugin("AMap.CitySearch", function () {
                        var r;
                        return r = new AMap.CitySearch, AMap.event.addListener(r, "complete", function (r) {
                            var i;
                            if (!(r && r.city && r.bounds))return n();
                            i = r.city, e.$el.find(".geo-map-address").text(i), e.$el.find(".geo-map-coord").empty(), e.$el.find("input[name$='[address]']").val(i), e.mapObj.setBounds(r.bounds);
                            if (t.onComplete)return t.onComplete()
                        }), AMap.event.addListener(r, "error", n), r.getLocalCity()
                    })
                }
            }(this), [e, t]
        }, n.prototype.setMarker = function (e, t) {
            var n, r;
            return t == null && (t = null), this.mapObj.clearMap(), r = {
                map: this.mapObj,
                icon: "https://webapi.amap.com/images/marker_sprite.png",
                position: e
            }, this.options.staticMap || this.options.mobile && !this.options.localizable ? new AMap.Marker(r) : (n = new AMap.Marker($.extend(r, {
                draggable: !0,
                animation: "AMAP_ANIMATION_DROP",
                cursor: "move",
                raiseOnDrag: !0
            })), AMap.event.addListener(n, "dragend", function (e) {
                return function (t) {
                    return e.updateMap(t.lnglat)
                }
            }(this))), this.mapObj.setZoomAndCenter(t != null ? t : 16, e)
        }, n.prototype._showAddressFromLocation = function (e, t) {
            return this.mapObj.plugin("AMap.Geocoder", function (n) {
                return function () {
                    var r;
                    return r = new AMap.Geocoder({
                        radius: 1e3,
                        extensions: "all"
                    }), AMap.event.addListener(r, "complete", function (e) {
                        var r;
                        return r = e.regeocode.formattedAddress, n._showAddress(r, t)
                    }), r.getAddress(e)
                }
            }(this))
        }, n.prototype.searchLocation = function (e) {
            return this.mapObj.plugin("AMap.Geocoder", function (t) {
                return function () {
                    var n;
                    return n = new AMap.Geocoder, AMap.event.addListener(n, "complete", function (e) {
                        var n, r, i;
                        n = e.geocodes[0];
                        if (n)return r = n.level, i = function () {
                            switch (r) {
                                case"省":
                                    return 5;
                                case"市":
                                    return 10;
                                case"区县":
                                    return 12;
                                default:
                                    return 16
                            }
                        }(), t.updateMap(n.location, n.formattedAddress, {zoom: i})
                    }), n.getLocation(e)
                }
            }(this))
        }, n
    }(GoldenData.Geo)
}.call(this), function () {
    var e = {}.hasOwnProperty, t = function (t, n) {
        function i() {
            this.constructor = t
        }

        for (var r in n)e.call(n, r) && (t[r] = n[r]);
        return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
    };
    GoldenData.GeoGoogle = function (e) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }

        return t(n, e), n.prototype._initMap = function (e) {
            var t;
            return t = {
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: !1,
                zoomControlOptions: {position: google.maps.ControlPosition.LEFT_TOP}
            }, this.mapObj = new google.maps.Map(e, t), this.marker = new google.maps.Marker({
                position: this.mapObj.getCenter(),
                map: this.mapObj,
                animation: google.maps.Animation.Drop,
                draggable: !this.options.staticMap
            })
        }, n.prototype.initMapEvent = function () {
            return google.maps.event.addListener(this.mapObj, "click", function (e) {
                return function (t) {
                    return e.updateMap(e._latLngFromGoogleLatLng(t.latLng))
                }
            }(this)), google.maps.event.addListener(this.marker, "dragend", function (e) {
                return function (t) {
                    return e.updateMap(e._latLngFromGoogleLatLng(t.latLng))
                }
            }(this))
        }, n.prototype._geoArray = function () {
            var e;
            return e = function (e) {
                return function (t) {
                    var n, r;
                    return r = function (n) {
                        var r;
                        return r = {lat: n.coords.latitude, lng: n.coords.longitude}, e.onGetLocationSuccess(r, t)
                    }, n = function (n) {
                        n == null && (n = null);
                        if (e._useNextGeoMethod(t))return;
                        if (n)switch (n.code) {
                            case n.PERMISSION_DENIED:
                                alert(l("%warn_geo_permission_denied"));
                                break;
                            case n.POSITION_UNAVAILABLE:
                                alert(l("%warn_geo_position_unavailable"));
                                break;
                            case n.TIMEOUT:
                                alert(l("%warn_geo_timeout"));
                                break;
                            default:
                                alert(l("%warn_geo_unknown_error"))
                        }
                        return GoldenData.resetGeoFieldChooser(e.$el)
                    }, navigator.geolocation ? navigator.geolocation.getCurrentPosition(r, n, {
                        timeout: 5e3,
                        maximumAge: 0
                    }) : n()
                }
            }(this), [e]
        }, n.prototype._googleLatLng = function (e) {
            return new google.maps.LatLng(e.lat, e.lng)
        }, n.prototype._latLngFromGoogleLatLng = function (e) {
            return {lat: e.lat(), lng: e.lng()}
        }, n.prototype.setMarker = function (e, t) {
            var n;
            return t == null && (t = null), n = this._googleLatLng(e), this.mapObj.setZoom(t != null ? t : 16), this.mapObj.setCenter(n), this.marker.setPosition(n)
        }, n.prototype._showAddressFromLocation = function (e, t) {
            var n;
            return n = this._googleLatLng(e), (new google.maps.Geocoder).geocode({latLng: n}, function (n) {
                return function (r, i) {
                    var s;
                    i === google.maps.GeocoderStatus.OK && r[0] && (s = $.trim(r[0].formatted_address.replace(/邮政编码.*/, ""))), s ? (n.$el.find(".geo-map-address").text(l("%geo_address", {address: s})), n.$el.find("input[name$='[address]']").val(s)) : n.$el.find(".geo-map-address").text(l("%geo_no_address") + l("%geo_coord", {
                            "long": e.lng,
                            lat: e.lat
                        }));
                    if (t.onComplete)return t.onComplete()
                }
            }(this))
        }, n.prototype.searchLocation = function (e) {
            return (new google.maps.Geocoder).geocode({address: e}, function (e) {
                return function (t, n) {
                    if (n === google.maps.GeocoderStatus.OK)return e.updateMap(e._latLngFromGoogleLatLng(t[0].geometry.location))
                }
            }(this))
        }, n
    }(GoldenData.Geo)
}.call(this), function () {
    $(function () {
        var e;
        return e = function () {
            function e(e, t, n) {
                this.$container = e, this.useGoogle = t != null ? t : !1, this.staticMap = n != null ? n : !1, this.mobile = this.$container.hasClass("mobile"), this.localizable = this.$container.hasClass("localizable"), this.initialMap(), this.staticMap || this.initialEvents(), this.$container.data("geo-initialized", !0)
            }

            return e.prototype.initialMap = function () {
                return this.staticMap || GoldenData.resetGeoFieldChooser(this.$container), this.initialExistedPosition()
            }, e.prototype.ensureGeo = function () {
                if (this.geo === void 0)return this.useGoogle ? this.geo = new GoldenData.GeoGoogle(this.$container, {
                    mobile: this.mobile,
                    staticMap: this.staticMap
                }) : this.geo = new GoldenData.GeoAutonavi(this.$container, {
                    mobile: this.mobile,
                    staticMap: this.staticMap,
                    localizable: this.localizable
                })
            }, e.prototype.initialExistedPosition = function () {
                var e, t, n, r;
                return this.staticMap ? (e = this.$container.find(".map-container"), n = e.data("latitude"), r = e.data("longitude"), t = e.data("address")) : (n = this.$container.find("input[name$='[latitude]']").val(), r = this.$container.find("input[name$='[longitude]']").val(), t = this.$container.find("input[name$='[address]']").val()), this.setLocation(n, r, t)
            }, e.prototype.setLocation = function (e, t, n) {
                var r;
                if (e && t)return this.ensureGeo(), r = this.useGoogle ? {
                    lat: parseFloat(e),
                    lng: parseFloat(t)
                } : new AMap.LngLat(parseFloat(t), parseFloat(e)), this.geo.updateMap(r, n);
                if (n)return this.ensureGeo(), this.geo.searchLocation(n)
            }, e.prototype.initialEvents = function () {
                return this.$container.find(".geo-field-chooser").click(function (e) {
                    return function () {
                        return e.mobile && !e.localizable && (e.$container.find(".geo-field-chooser").addClass("disabled"), e.$container.find(".geo-field-chooser").val(l("%geo_locating"))), e.ensureGeo(), e.mobile && !e.localizable ? e.geo.currentLocation({
                            onComplete: function () {
                                return e.$container.find(".geo-map-container").show(), e.$container.find(".geo-field-chooser").removeClass("disabled").val(l("%geo_locate")).hide(), GoldenData.recalcFormHeight()
                            }
                        }) : (e.geo.currentLocation(), e.$container.find(".geo-map-container").show(), e.$container.find(".geo-field-chooser").hide(), GoldenData.recalcFormHeight())
                    }
                }(this)), this.$container.find(".clear-location-btn").click(function (e) {
                    return function () {
                        return e.$container.find(".geo-field-chooser").show(), e.$container.find(".geo-map-container").hide(), e.$container.find("input[name$='[latitude]']").val(""), e.$container.find("input[name$='[longitude]']").val(""), e.$container.find("input[name$='[address]']").val(""), GoldenData.recalcFormHeight()
                    }
                }(this)), this.$container.find(".modify-location-btn").click(function (e) {
                    return function () {
                        return e.$container.find(".clear-location-btn").click(), e.$container.find(".geo-field-chooser").click()
                    }
                }(this)), this.$container.find(".map-search-btn").click(function (e) {
                    return function () {
                        var t;
                        t = e.$container.find(".map-search").val();
                        if (t)return e.geo.searchLocation(t)
                    }
                }(this)), this.$container.find(".current-location-btn").click(function (e) {
                    return function () {
                        return e.ensureGeo(), e.geo.currentLocation()
                    }
                }(this))
            }, e
        }(), GoldenData.initGeoView = function (t) {
            var n, r, i, s, o;
            t == null && (t = !1), s = $("[data-role=geo]"), o = [];
            for (r = 0, i = s.length; r < i; r++)n = s[r], $(n).data("geo-initialized") ? o.push(void 0) : o.push(new e($(n), t));
            return o
        }, GoldenData.initStaticGeoView = function (t) {
            var n, r, i, s, o;
            t == null && (t = !1), s = $("[data-role=static-geomap]"), o = [];
            for (r = 0, i = s.length; r < i; r++)n = s[r], o.push(new e($(n), t, !0));
            return o
        }, $(".map-search").on("keypress", function (e) {
            if (e.keyCode === 13)return $(this).parent(".geo-map-action").find(".map-search-btn").click()
        })
    })
}.call(this), function () {
    window.GoldenData || (window.GoldenData = {}), $(function () {
        var e;
        return e = function (e, t) {
            var n, r, i, s, o, u, a, f, c;
            s = e.find("option:selected"), t.html("<option value=''>" + l("%select_prompt") + "</option>"), f = (a = s.data("choices")) != null ? a : [];
            for (o = 0, u = f.length; o < u; o++)n = f[o], typeof n == "object" ? (r = n.name, i = (c = n.value) != null ? c : r) : (r = n, i = n), t.append("<option value='" + i + "'>" + r + "</option>");
            t.val(t.data("value"));
            if ($.mobile)return t.selectmenu("refresh", !0)
        }, GoldenData.initCascadeSelector = function (t) {
            var n, r, i, s, o, u;
            o = $(t).find("[data-role=cascade]"), u = [];
            for (i = 0, s = o.length; i < s; i++)n = o[i], r = $(n).find("[data-role=level_1]"), e(r, $(n).find("[data-role=level_2]")), u.push(r.on("change", function () {
                var t;
                return t = $(this).parents("[data-role=cascade]").find("[data-role=level_2]"), t.data("value", null), e($(this), t)
            }));
            return u
        }, $(document).on("ready page:load ajax:complete", function () {
            if (!($(".dashboard").length > 0))return GoldenData.initCascadeSelector(document)
        })
    })
}.call(this), function () {
    window.GoldenData || (window.GoldenData = {}), $(function () {
        return GoldenData.FormPagination = function () {
            function e(e) {
                this.options = e != null ? e : {}, this.container = this.options.container, this.fieldsContainer = $(this.container.find(".form-fields-container")), this.currentPage = 1, this.pageCount = 1, this._init()
            }

            return e.prototype.onFormContentShowHide = function () {
                return this._updatePageDisplayedIndex(), this._render()
            }, e.prototype._render = function () {
                var e, t, n;
                this.fieldsContainer.find(".form-page").hide(), t = this.container.find(".pagination-action.previous-page"), e = this.container.find(".pagination-action.next-page"), n = this.container.find(".field.submit-field"), this.container.find(".form-description").toggleClass("hide", this._hasPreviousPage()), t.toggleClass("hide", !this._hasPreviousPage()), e.toggleClass("hide", !this._hasNextPage()), n.find(".page-number").html(l("%page_number", {
                    currentPage: this.currentPage,
                    totalPage: this.pageCount
                })).toggleClass("hide", this._hasOnlyOnePage()), this.container.find(".field.submit-field .submit, #shopping_cart, .captcha-container").toggleClass("hide", this._hasNextPage()), n.toggleClass("has-pagination-action", !this._hasOnlyOnePage()), this.fieldsContainer.find(".form-page[data-page-index=" + this.currentPage + "]").show();
                if (GoldenData.isMobile)return $(window).resize()
            }, e.prototype._goToPreviousPage = function () {
                if (!this._hasPreviousPage())return;
                return this.currentPage--, this._render(), $(window).scrollTop(0)
            }, e.prototype._goToNextPage = function () {
                var e;
                if (!this._hasNextPage())return;
                return e = this.fieldsContainer.closest("form").data("validate-url"), e ? this._validateCurrentPage(e, function (e) {
                    return function () {
                        return e._doGoToNextPage()
                    }
                }(this), function (e) {
                    return function () {
                        return $(window).scrollTop(0)
                    }
                }(this)) : this._doGoToNextPage()
            }, e.prototype._doGoToNextPage = function () {
                return this.currentPage++, this._render(), $(window).scrollTop(0)
            }, e.prototype._hasPreviousPage = function () {
                return this.currentPage > 1
            }, e.prototype._hasNextPage = function () {
                return this.currentPage < this.pageCount
            }, e.prototype._hasOnlyOnePage = function () {
                return this.pageCount <= 1
            }, e.prototype._validateCurrentPage = function (e, t, n) {
                var r, i;
                return i = this._getFieldsDataToValidate(), r = $("meta[name=csrf-token]").attr("content"), $.ajax(e, {
                    type: "post",
                    data: $.param(i),
                    beforeSend: function (e) {
                        return e.setRequestHeader("X-CSRF-Token", r)
                    },
                    success: function (e) {
                        return function (n, r, i) {
                            return e._clearFieldsErrorMessages(), t()
                        }
                    }(this),
                    error: function (e) {
                        return function (t) {
                            var r;
                            if (t.status === 400)return r = $.parseJSON(t.responseText), e._showErrorMessages(r.errors), n()
                        }
                    }(this)
                })
            }, e.prototype._getFieldsDataToValidate = function () {
                var e, t, n, r, i;
                return e = $(this.fieldsContainer.find(".form-page[data-page-index=" + this.currentPage + "]")).find("input, textarea, select"), r = _.reject(this.fieldsContainer.find(".logic-trigger"), function (e) {
                    return function (t) {
                        var n;
                        return n = $(t).closest(".form-page").data("page-index"), !n || n >= e.currentPage
                    }
                }(this)), n = e.add(typeof (i = $(r)).find == "function" ? i.find("input, textarea, select") : void 0), t = n.serializeArray(), t = this._appendUncheckedInputsData(t, n), t
            }, e.prototype._appendUncheckedInputsData = function (e, t) {
                return _.each(t, function (t) {
                    return function (t) {
                        var n, r, i;
                        r = _.pluck(e, "name"), i = $(t).attr("name");
                        if (($(t).is("input:radio") || $(t).is("input:checkbox")) && !_.contains(r, i)) {
                            n = i.replace(/\[\]$/, "");
                            if (!_.contains(r, n))return e.push({name: n, value: ""})
                        }
                    }
                }(this)), e
            }, e.prototype._showErrorMessages = function (e) {
                var t, n, r;
                return t = $("#form_page_error_messages_modal"), r = 5, n = "", this._clearFieldsErrorMessages(), _.each(e, function (e) {
                    return function (t, i) {
                        var s, o;
                        s = t[0], o = t[1], e._addErrorMessageToField(s, o);
                        if (i < r)return n += "<li>" + o + "</li>"
                    }
                }(this)), e.length > r && (n += '<li class="others">...</li>'), t.find(".error-explanation ul").html(n), t.modal("show")
            }, e.prototype._clearFieldsErrorMessages = function () {
                var e;
                return e = this.fieldsContainer.find(".form-page[data-page-index=" + this.currentPage + "] .field.has-error"), e.removeClass("has-error"), e.find(".inline-error").remove(), e.find(".field_with_errors").children().unwrap()
            }, e.prototype._addErrorMessageToField = function (e, t) {
                var n;
                return n = this.fieldsContainer.find("[data-api-code=" + e + "]"), n.addClass("has-error"), n.find(".controls").wrapInner('<div class="field_with_errors"></div>'), n.append($("<div class='help-block inline-error'><i class='fa fa-times-circle'></i> " + t + "</div>"))
            }, e.prototype._wrapFieldsInPage = function () {
                return _.each(this.fieldsContainer.find(".page-break"), function (e) {
                    return function (e, t, n) {
                        var r, i, s;
                        return i = t + 1 === n.length, r = i ? $(e).nextAll().addBack() : $(e).nextUntil(".page-break", ".field:not(.page-break)").addBack(), s = $("<div class='form-page'></div>"), r.wrapAll(s)
                    }
                }(this)), this.container.find(".field.submit-field").addClass("has-form-pagination")
            }, e.prototype._updatePageDisplayedIndex = function () {
                var e;
                return e = 0, _.each(this.fieldsContainer.find(".form-page"), function (t) {
                    return function (t) {
                        return $(t).find(".field:not(.logic-hidden):not(.page-break)").length > 0 ? (e++, $(t).attr("data-page-index", e)) : $(t).removeAttr("data-page-index")
                    }
                }(this)), this.pageCount =
                    e
            }, e.prototype._goToFirstErrorPage = function () {
                var e;
                e = this.fieldsContainer.find(".field.has-error");
                if (e.length > 0)return this.currentPage = $(e[0]).closest(".form-page").attr("data-page-index") || 1
            }, e.prototype._init = function () {
                return this._wrapFieldsInPage(), this._updatePageDisplayedIndex(), this._goToFirstErrorPage(), this._bindEvents(), this._render()
            }, e.prototype._bindEvents = function () {
                return this.container.find(".pagination-action.previous-page").click(function (e) {
                    return function () {
                        return e._goToPreviousPage()
                    }
                }(this)), this.container.find(".pagination-action.next-page").click(function (e) {
                    return function () {
                        return e._goToNextPage()
                    }
                }(this))
            }, e
        }(), GoldenData.initFormPagination = function (e) {
            e == null && (e = null), e || (e = $("body"));
            if (!($(e).find(".form-fields-container .page-break").length > 0))return GoldenData.formPagination = null;
            if ($(e).find(".form-page").length === 0)return GoldenData.formPagination = new GoldenData.FormPagination({container: e})
        }, $(window).on("formContentShowHide", function () {
            if (GoldenData.formPagination)return GoldenData.formPagination.onFormContentShowHide()
        })
    })
}.call(this), function () {
}.call(this), function () {
    var e = {}.hasOwnProperty, t = function (t, n) {
        function i() {
            this.constructor = t
        }

        for (var r in n)e.call(n, r) && (t[r] = n[r]);
        return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
    };
    window.GoldenData || (window.GoldenData = {}), $(function () {
        var e, n, r;
        return e = function () {
            function e(e) {
                this.$container = e, this.mobile = $("body").hasClass("mobile"), this.initialMap()
            }

            return e.prototype._noOverrideError = function (e) {
                throw"can't find " + e + " in subclass"
            }, e.prototype._initMap = function () {
                return this._noOverrideError("_initMap")
            }, e.prototype.initialMap = function () {
                return this.geoMapDom = this.$container.find(".map-container")[0], this.coordsList = $(this.geoMapDom).data("coordinates"), this.coordsList.length === 0 ? $(this.geoMapDom).closest(".geo-map-container").html("<div class='no-geo-data'>" + l("%no_geo_data") + "</div>") : (this.fieldApiCode = $(this.geoMapDom).data("api-code"), this.urlPrefix = $(this.geoMapDom).data("url-prefix"), this._initMap(), this.initialExistedPositions())
            }, e.prototype._initIcons = function () {
                return this._noOverrideError("_initIcons")
            }, e.prototype._addMarker = function (e, t, n, r, i) {
                return this._noOverrideError("_addMarker")
            }, e.prototype._onMarkersAdded = function () {
                return this._noOverrideError("_onMarkersAdded")
            }, e.prototype.initialExistedPositions = function () {
                return this._initIcons(), _.each(this.coordsList, function (e) {
                    return function (t, n) {
                        var r, i;
                        return r = t.latitude, i = t.longitude, e._addMarker(parseFloat(r), parseFloat(i), t.address, t.entry_id, n)
                    }
                }(this)), this._onMarkersAdded()
            }, e.prototype._updateMarker = function (e) {
                return this._noOverrideError("_updateMarker")
            }, e.prototype.selectMarker = function (e, t) {
                var n;
                this._updateMarker(e);
                if (!this.mobile)return n = "" + this.urlPrefix + "/" + t + "/entry_for_geo_report", $.get(n, {
                    id: t,
                    field_api_code: this.fieldApiCode
                }, function (e) {
                    return function (t) {
                        return e.$container.find(".geo-entry-container").html(t), e.$container.find(".selected-geo-entry").scrollTop(0)
                    }
                }(this))
            }, e
        }(), n = function (e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }

            return t(n, e), n.prototype._initMap = function () {
                return this.mapObj = new AMap.Map(this.geoMapDom), this.mapObj.plugin(["AMap.ToolBar"], function (e) {
                    return function () {
                        var t;
                        return t = new AMap.ToolBar({
                            direction: !1,
                            offset: e.mobile ? new AMap.Pixel(2, 65) : new AMap.Pixel(-10, 5)
                        }), e.mapObj.addControl(t)
                    }
                }(this))
            }, n.prototype._initIcons = function () {
                var e;
                return e = new AMap.Size(22, 22), this.defaultIcon = new AMap.Icon({
                    size: e,
                    imageSize: e,
                    image: GoldenData.mapMarkerDefault
                }), this.selectedIcon = new AMap.Icon({size: e, imageSize: e, image: GoldenData.mapMarkerSelected})
            }, n.prototype._addMarker = function (e, t, n, r, i) {
                var s, o;
                o = new AMap.LngLat(t, e), s = new AMap.Marker({
                    icon: this.defaultIcon,
                    position: o,
                    title: n,
                    animation: "AMAP_ANIMATION_DROP"
                }), s.setMap(this.mapObj);
                if (this.fieldApiCode != null && this.urlPrefix != null) {
                    AMap.event.addListener(s, "click", function (e) {
                        return function () {
                            return e.selectMarker(s, r)
                        }
                    }(this));
                    if (i === 0)return this.selectMarker(s, r)
                }
            }, n.prototype._updateMarker = function (e) {
                return !this.selectedMarker || this.selectedMarker.setIcon(this.defaultIcon), e.setIcon(this.selectedIcon), e.setzIndex(101), this.selectedMarker && this.selectedMarker.setzIndex(100), this.selectedMarker = e, this.$container.find(".selected-geo-address").text(this.selectedMarker.getTitle())
            }, n.prototype._onMarkersAdded = function () {
                return this.mapObj.setFitView()
            }, n
        }(e), r = function (e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }

            return t(n, e), n.prototype._initMap = function () {
                var e;
                return e = {
                    zoom: 4,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: !1,
                    zoomControlOptions: {position: google.maps.ControlPosition.LEFT_TOP}
                }, this.mapObj = new google.maps.Map(this.geoMapDom, e)
            }, n.prototype._initIcons = function () {
                return this.defaultIcon = new google.maps.MarkerImage(GoldenData.mapMarkerDefault, null, null, null, new google.maps.Size(22, 22)), this.selectedIcon = new google.maps.MarkerImage(GoldenData.mapMarkerSelected, null, null, null, new google.maps.Size(22, 22)), this.bounds = new google.maps.LatLngBounds
            }, n.prototype._addMarker = function (e, t, n, r, i) {
                var s, o;
                o = new google.maps.LatLng(e, t), s = new google.maps.Marker({
                    position: o,
                    map: this.mapObj,
                    animation: google.maps.Animation.Drop,
                    title: n,
                    icon: this.defaultIcon
                }), this.bounds.extend(o);
                if (this.fieldApiCode != null && this.urlPrefix != null) {
                    google.maps.event.addListener(s, "click", function (e) {
                        return function () {
                            return e.selectMarker(s, r)
                        }
                    }(this));
                    if (i === 0)return this.selectMarker(s, r)
                }
            }, n.prototype._updateMarker = function (e) {
                return !this.selectedMarker || this.selectedMarker.setIcon(this.defaultIcon), e.setIcon(this.selectedIcon), e.setZIndex(google.maps.Marker.MAX_ZINDEX + 1), this.selectedMarker && this.selectedMarker.setZIndex(google.maps.Marker.MAX_ZINDEX), this.selectedMarker = e, this.$container.find(".selected-geo-address").text(this.selectedMarker.getTitle())
            }, n.prototype._onMarkersAdded = function () {
                return this.mapObj.fitBounds(this.bounds)
            }, n
        }(e), GoldenData.initGeoReportView = function (e) {
            var t, i;
            return e == null && (e = !1), t = function () {
                var t, i, s, o, u;
                o = $(".geo-reports .geo-map-container"), u = [];
                for (i = 0, s = o.length; i < s; i++)t = o[i], u.push(new (e ? r : n)($(t)));
                return u
            }, i = $(".results_content .title .results_nav"), $("body").hasClass("mobile") && (i = $('.mobile [data-role="navbar"] .results_nav')), i.length > 0 && !i.hasClass("active") ? i.find("a").click(function () {
                return setTimeout(t, 10)
            }) : t()
        }
    })
}.call(this), !function (e, t) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function () {
        return t(e)
    }) : t(e, !0)
}(this, function (e, t) {
    function n(t, n, r) {
        e.WeixinJSBridge ? WeixinJSBridge.invoke(t, i(n), function (e) {
            u(t, e, r)
        }) : l(t, r)
    }

    function r(t, n, r) {
        e.WeixinJSBridge ? WeixinJSBridge.on(t, function (e) {
            r && r.trigger && r.trigger(e), u(t, e, n)
        }) : r ? l(t, r) : l(t, n)
    }

    function i(e) {
        return e = e || {}, e.appId = C.appId, e.verifyAppId = C.appId, e.verifySignType = "sha1", e.verifyTimestamp = C.timestamp + "", e.verifyNonceStr = C.nonceStr, e.verifySignature = C.signature, e
    }

    function s(e, t) {
        return {scope: t, signType: "sha1", timeStamp: e.timestamp + "", nonceStr: e.nonceStr, addrSign: e.addrSign}
    }

    function o(e) {
        return {
            timeStamp: e.timestamp + "",
            nonceStr: e.nonceStr,
            "package": e.package,
            paySign: e.paySign,
            signType: e.signType || "SHA1"
        }
    }

    function u(e, t, n) {
        var r, i, s;
        switch (delete t.err_code, delete t.err_desc, delete t.err_detail, r = t.errMsg, r || (r = t.err_msg, delete t.err_msg, r = a(e, r, n), t.errMsg = r), n = n || {}, n._complete && (n._complete(t), delete n._complete), r = t.errMsg || "", C.debug && !n.isInnerInvoke && alert(JSON.stringify(t)), i = r.indexOf(":"), s = r.substring(i + 1)) {
            case"ok":
                n.success && n.success(t);
                break;
            case"cancel":
                n.cancel && n.cancel(t);
                break;
            default:
                n.fail && n.fail(t)
        }
        n.complete && n.complete(t)
    }

    function a(e, t) {
        var n, r, i, s;
        if (t) {
            switch (n = t.indexOf(":"), e) {
                case v.config:
                    r = "config";
                    break;
                case v.openProductSpecificView:
                    r = "openProductSpecificView";
                    break;
                default:
                    r = t.substring(0, n), r = r.replace(/_/g, " "), r = r.replace(/\b\w+\b/g, function (e) {
                        return e.substring(0, 1).toUpperCase() + e.substring(1)
                    }), r = r.substring(0, 1).toLowerCase() + r.substring(1), r = r.replace(/ /g, ""), -1 != r.indexOf("Wcpay") && (r = r.replace("Wcpay", "WCPay")), i = m[r], i && (r = i)
            }
            s = t.substring(n + 1), "confirm" == s && (s = "ok"), -1 != s.indexOf("failed_") && (s = s.substring(7)), -1 != s.indexOf("fail_") && (s = s.substring(5)), s = s.replace(/_/g, " "), s = s.toLowerCase(), ("access denied" == s || "no permission to execute" == s) && (s = "permission denied"), "config" == r && "function not exist" == s && (s = "ok"), t = r + ":" + s
        }
        return t
    }

    function f(e) {
        var t, n, r, i;
        if (e) {
            for (t = 0, n = e.length; n > t; ++t)r = e[t], i = v[r], i && (e[t] = i);
            return e
        }
    }

    function l(e, t) {
        if (C.debug && !t.isInnerInvoke) {
            var n = m[e];
            n && (e = n), t && t._complete && delete t._complete, console.log('"' + e + '",', t || "")
        }
    }

    function c() {
        if (!("6.0.2" > x || N.systemType < 0)) {
            var e = new Image;
            N.appId = C.appId, N.initTime = T.initEndTime - T.initStartTime, N.preVerifyTime = T.preVerifyEndTime - T.preVerifyStartTime, A.getNetworkType({
                isInnerInvoke: !0,
                success: function (t) {
                    N.networkType = t.networkType;
                    var n = "https://open.weixin.qq.com/sdk/report?v=" + N.version + "&o=" + N.isPreVerifyOk + "&s=" + N.systemType + "&c=" + N.clientVersion + "&a=" + N.appId + "&n=" + N.networkType + "&i=" + N.initTime + "&p=" + N.preVerifyTime + "&u=" + N.url;
                    e.src = n
                }
            })
        }
    }

    function h() {
        return (new Date).getTime()
    }

    function p(t) {
        w && (e.WeixinJSBridge ? t() : g.addEventListener && g.addEventListener("WeixinJSBridgeReady", t, !1))
    }

    function d() {
        A.invoke || (A.invoke = function (t, n, r) {
            e.WeixinJSBridge && WeixinJSBridge.invoke(t, i(n), r)
        }, A.on = function (t, n) {
            e.WeixinJSBridge && WeixinJSBridge.on(t, n)
        })
    }

    var v, m, g, y, b, w, E, S, x, T, N, C, k, L, A;
    if (!e.jWeixin)return v = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest"
    }, m = function () {
        var e, t = {};
        for (e in v)t[v[e]] = e;
        return t
    }(), g = e.document, y = g.title, b = navigator.userAgent.toLowerCase(), w = -1 != b.indexOf("micromessenger"), E = -1 != b.indexOf("android"), S = -1 != b.indexOf("iphone") || -1 != b.indexOf("ipad"), x = function () {
        var e = b.match(/micromessenger\/(\d+\.\d+\.\d+)/) || b.match(/micromessenger\/(\d+\.\d+)/);
        return e ? e[1] : ""
    }(), T = {initStartTime: h(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0}, N = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: S ? 1 : E ? 2 : -1,
        clientVersion: x,
        url: encodeURIComponent(location.href)
    }, C = {}, k = {_completes: []}, L = {state: 0, res: {}}, p(function () {
        T.initEndTime = h()
    }), A = {
        config: function (e) {
            C = e, l("config", e), p(function () {
                n(v.config, {verifyJsApiList: f(C.jsApiList)}, function () {
                    k._complete = function (e) {
                        T.preVerifyEndTime = h(), L.state = 1, L.res = e
                    }, k.success = function () {
                        N.isPreVerifyOk = 0
                    }, k.fail = function (e) {
                        k._fail ? k._fail(e) : L.state = -1
                    };
                    var e = k._completes;
                    return e.push(function () {
                        C.debug || c()
                    }), k.complete = function (t) {
                        for (var n = 0, r = e.length; r > n; ++n)e[n](t);
                        k._completes = []
                    }, k
                }()), T.preVerifyStartTime = h()
            }), C.beta && d()
        }, ready: function (e) {
            0 != L.state ? e() : (k._completes.push(e), !w && C.debug && e())
        }, error: function (e) {
            "6.0.2" > x || (-1 == L.state ? e(L.res) : k._fail = e)
        }, checkJsApi: function (e) {
            var t = function (e) {
                var t, n, r = e.checkResult;
                for (t in r)n = m[t], n && (r[n] = r[t], delete r[t]);
                return e
            };
            n("checkJsApi", {jsApiList: f(e.jsApiList)}, function () {
                return e._complete = function (e) {
                    if (E) {
                        var n = e.checkResult;
                        n && (e.checkResult = JSON.parse(n))
                    }
                    e = t(e)
                }, e
            }())
        }, onMenuShareTimeline: function (e) {
            r(v.onMenuShareTimeline, {
                complete: function () {
                    n("shareTimeline", {
                        title: e.title || y,
                        desc: e.title || y,
                        img_url: e.imgUrl,
                        link: e.link || location.href
                    }, e)
                }
            }, e)
        }, onMenuShareAppMessage: function (e) {
            r(v.onMenuShareAppMessage, {
                complete: function () {
                    n("sendAppMessage", {
                        title: e.title || y,
                        desc: e.desc || "",
                        link: e.link || location.href,
                        img_url: e.imgUrl,
                        type: e.type || "link",
                        data_url: e.dataUrl || ""
                    }, e)
                }
            }, e)
        }, onMenuShareQQ: function (e) {
            r(v.onMenuShareQQ, {
                complete: function () {
                    n("shareQQ", {
                        title: e.title || y,
                        desc: e.desc || "",
                        img_url: e.imgUrl,
                        link: e.link || location.href
                    }, e)
                }
            }, e)
        }, onMenuShareWeibo: function (e) {
            r(v.onMenuShareWeibo, {
                complete: function () {
                    n("shareWeiboApp", {
                        title: e.title || y,
                        desc: e.desc || "",
                        img_url: e.imgUrl,
                        link: e.link || location.href
                    }, e)
                }
            }, e)
        }, startRecord: function (e) {
            n("startRecord", {}, e)
        }, stopRecord: function (e) {
            n("stopRecord", {}, e)
        }, onVoiceRecordEnd: function (e) {
            r("onVoiceRecordEnd", e)
        }, playVoice: function (e) {
            n("playVoice", {localId: e.localId}, e)
        }, pauseVoice: function (e) {
            n("pauseVoice", {localId: e.localId}, e)
        }, stopVoice: function (e) {
            n("stopVoice", {localId: e.localId}, e)
        }, onVoicePlayEnd: function (e) {
            r("onVoicePlayEnd", e)
        }, uploadVoice: function (e) {
            n("uploadVoice", {localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1}, e)
        }, downloadVoice: function (e) {
            n("downloadVoice", {serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1}, e)
        }, translateVoice: function (e) {
            n("translateVoice", {localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1}, e)
        }, chooseImage: function (e) {
            n("chooseImage", {scene: "1|2"}, function () {
                return e._complete = function (e) {
                    if (E) {
                        var t = e.localIds;
                        t && (e.localIds = JSON.parse(t))
                    }
                }, e
            }())
        }, previewImage: function (e) {
            n(v.previewImage, {current: e.current, urls: e.urls}, e)
        }, uploadImage: function (e) {
            n("uploadImage", {localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1}, e)
        }, downloadImage: function (e) {
            n("downloadImage", {serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1}, e)
        }, getNetworkType: function (e) {
            var t = function (e) {
                var t, n, r, i = e.errMsg;
                if (e.errMsg = "getNetworkType:ok", t = e.subtype, delete e.subtype, t)e.networkType = t; else switch (n = i.indexOf(":"), r = i.substring(n + 1)) {
                    case"wifi":
                    case"edge":
                    case"wwan":
                        e.networkType = r;
                        break;
                    default:
                        e.errMsg = "getNetworkType:fail"
                }
                return e
            };
            n("getNetworkType", {}, function () {
                return e._complete = function (e) {
                    e = t(e)
                }, e
            }())
        }, openLocation: function (e) {
            n("openLocation", {
                latitude: e.latitude,
                longitude: e.longitude,
                name: e.name || "",
                address: e.address || "",
                scale: e.scale || 28,
                infoUrl: e.infoUrl || ""
            }, e)
        }, getLocation: function (e) {
            n(v.getLocation, function () {
                var t = s(e, "jsapi_location");
                return t.type = "wgs84", t
            }(), function () {
                return e._complete = function (e) {
                    delete e.type
                }, e
            }())
        }, hideOptionMenu: function (e) {
            n("hideOptionMenu", {}, e)
        }, showOptionMenu: function (e) {
            n("showOptionMenu", {}, e)
        }, closeWindow: function (e) {
            n("closeWindow", {immediate_close: e && e.immediateClose || 0}, e)
        }, hideMenuItems: function (e) {
            n("hideMenuItems", {menuList: e.menuList}, e)
        }, showMenuItems: function (e) {
            n("showMenuItems", {menuList: e.menuList}, e)
        }, hideAllNonBaseMenuItem: function (e) {
            n("hideAllNonBaseMenuItem", {}, e)
        }, showAllNonBaseMenuItem: function (e) {
            n("showAllNonBaseMenuItem", {}, e)
        }, scanQRCode: function (e) {
            n("scanQRCode", {
                desc: e.desc,
                needResult: e.needResult || 0,
                scanType: e.scanType || ["qrCode", "barCode"]
            }, e)
        }, openProductSpecificView: function (e) {
            n(v.openProductSpecificView, {pid: e.productId, view_type: e.viewType || 0}, e)
        }, addCard: function (e) {
            var t, r, i, s, o = e.cardList, u = [];
            for (t = 0, r = o.length; r > t; ++t)i = o[t], s = {card_id: i.cardId, card_ext: i.cardExt}, u.push(s);
            n(v.addCard, {card_list: u}, function () {
                return e._complete = function (e) {
                    var t, n, r, i = e.card_list;
                    if (i) {
                        for (i = JSON.parse(i), t = 0, n = i.length; n > t; ++t)r = i[t], r.cardId = r.card_id, r.cardExt = r.card_ext, r.isSuccess = r.is_succ ? !0 : !1, delete r.card_id, delete r.card_ext, delete r.is_succ;
                        e.cardList = i, delete e.card_list
                    }
                }, e
            }())
        }, chooseCard: function (e) {
            n("chooseCard", {
                app_id: C.appId,
                location_id: e.shopId || "",
                sign_type: e.signType || "SHA1",
                card_id: e.cardId || "",
                card_type: e.cardType || "",
                card_sign: e.cardSign,
                time_stamp: e.timestamp + "",
                nonce_str: e.nonceStr
            }, function () {
                return e._complete = function (e) {
                    e.cardList = e.choose_card_info, delete e.choose_card_info
                }, e
            }())
        }, openCard: function (e) {
            var t, r, i, s, o = e.cardList, u = [];
            for (t = 0, r = o.length; r > t; ++t)i = o[t], s = {card_id: i.cardId, code: i.code}, u.push(s);
            n(v.openCard, {card_list: u}, e)
        }, chooseWXPay: function (e) {
            n(v.chooseWXPay, o(e), e)
        }
    }, t && (e.wx = e.jWeixin = A), A
}), function () {
    window.GoldenData || (window.GoldenData = {}), GoldenData.initWxjs = function (e) {
        return wx.config({
            debug: !1,
            appId: e.appid,
            timestamp: e.timestamp,
            nonceStr: e.noncestr,
            signature: e.signature,
            jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage"]
        }), wx.ready(function () {
            var e, t, n, r, i;
            return t = $("#form_share_info"), e = null, $("#form_thumbnail_selected").length > 0 && (e = $("#form_thumbnail_selected img")), e || $("img").each(function () {
                var t;
                t = $(this);
                if (!e && (t.width() >= 300 && t.height() >= 300 || t.parents("#form_thumbnail_default").length > 0))return e = t
            }), n = e ? e[0].src : "", i = t.data("form-name"), r = t.data("form-url"), wx.onMenuShareTimeline({
                title: i,
                link: r,
                imgUrl: n
            }), wx.onMenuShareAppMessage({title: i, desc: $.trim(t.text()).substring(0, 100), link: r, imgUrl: n})
        })
    }
}.call(this), function () {
    $(function () {
        var e, t, n, r, i, s, o, u;
        return $(document).on("ready page:change", function () {
            var e, t, n;
            $("input[type=date]").closest(".form-group").children(".control-label").append($("<em>(如：2012-12-30)</em>"));
            if ($("#header_image_loading")) {
                t = $("#header_image_loading").data("url");
                if (t)return n = Math.round(window.screen.width * window.devicePixelRatio), e = "" + t + "?imageView/2/w/" + n + "/q/80", $(".header-image .mobile-header-image-place-holder").attr("src", e).hide(), $(".header-image img").load(function () {
                    $(".header-image img").show(), $("#header_image_loading").remove();
                    if ($("body").height() < $(window).height())return s()
                })
            }
        }), $(document).on("change", ".attachment input.origin-file-input", function () {
            var e, t, n, r;
            return n = this.files ? this.files[0] : {name: $(this).val().replace(/^.*\\/, "")}, e = $(this).parents(".attachment"), r = e.find(".validation-message"), n ? (t = GoldenData.validateAttachment(n, $(this).data("max-size")), t ? r.html("<div class='help-block inline-error'><i class='mobile-icon-cancel-circled'></i> " + t + "，" + l("%rechoose") + "</div>") : r.empty(), e.find("[name='delete_attachments[]']").val("")) : r.empty()
        }), $(document).on("submit", "form", function () {
            var e;
            e = $($(this).find("input[data-disabled-with]"));
            if (!e.attr("disabled"))return e.data("enabled-with", e.text()), e.attr("value", e.data("disabled-with")), e.attr("disabled", !0)
        }), $(document).on("touchmove", "#lightboxOverlay, #lightbox", function () {
            return !1
        }), $("#lightbox").livequery(function () {
            var e;
            return e = $(".lb-container").hammer(), $(e).on("swiperight", function () {
                var e;
                e = GoldenData.lightbox.currentImageIndex;
                if (e !== 0)return GoldenData.lightbox.changeImage(e - 1)
            }), $(e).on("swipeleft", function () {
                var e;
                e = GoldenData.lightbox.currentImageIndex;
                if (e !== GoldenData.lightbox.album.length - 1)return GoldenData.lightbox.changeImage(e + 1)
            }), $(e).on("tap", function () {
                return setTimeout(function () {
                    return GoldenData.lightbox.end()
                }, 500)
            })
        }), $(document).on("click", "[data-role=collapse_toggle]", function () {
            var e, t;
            return e = $(this).closest("[data-role=collapsible]"), t = $(this).offset().top - $(window).scrollTop(), e.toggleClass("collapsed"), e.hasClass("collapsed") && $(this).hasClass("collapse-bottom") && $(window).scrollTop(e.offset().top - t), GoldenData.recalcFormHeight()
        }), u = function (e) {
            var t, n, r, i, s, o;
            r = 0, o = e.find("input.number");
            for (i = 0, s = o.length; i < s; i++)t = o[i], r += parseInt($(t).val());
            return r > 0 ? (e.addClass("selected"), n = r > 99 ? "?" : r, e.find(".badge").length > 0 ? e.find(".badge").text(n) : e.append("<div class='badge'>" + n + "</div>")) : (e.removeClass("selected"), e.find(".badge").remove())
        }, $(document).on("change", "[data-role=collapsible] input.number", function () {
            return u($(this).closest("[data-role=collapsible]"))
        }), $(document).on("ready page:change ajax:complete", function () {
            var e, t, n, r, i;
            r = $("[data-role=collapsible]"), i = [];
            for (t = 0, n = r.length; t < n; t++)e = r[t], i.push(u($(e)));
            return i
        }), $(document).on("click", "[data-role=spec_toggle]", function () {
            return $(this).toggleClass("collapsed")
        }), $(document).on("change", ".dimensions input:radio", function () {
            var e, t;
            t = function () {
                var t, n, r, i;
                r = $(this).closest(".dimensions").find("input:checked").next("label"), i = [];
                for (t = 0, n = r.length; t < n; t++)e = r[t], i.push($(e).text());
                return i
            }.call(this);
            if (t.length > 0)return $(this).closest(".dimensions").prev("[data-role=spec_toggle]").find("span").text(t.join(l("%common_separator")))
        }), $(document).on("click", ".current-user-header .mobile-logout-link", function (e) {
            var t;
            return e.preventDefault(), t = $("meta[name=csrf-token]").attr("content"), $.ajax({
                url: $(this).attr("href"),
                type: "delete",
                beforeSend: function (e) {
                    return e.setRequestHeader("X-CSRF-Token", t)
                },
                complete: function (e) {
                    if (e.status === 200)return window.location.reload()
                }
            })
        }), s = function () {
            var e;
            $(".main-content").css({minHeight: 0});
            if ($("body").height() < $(window).height())return e = $(window).height() - $("body").height() + $(".main-content").height(), $(".main-content").css("min-height", e)
        }, t = 1500, e = 200, n = 4, i = function () {
            var r, i, s, o;
            if ($(".wallpaper-bottom:visible").length > 0)return o = $(".wallpaper-bottom").width() / t, r = e * o / 2, s = "-" + (r + n) + "px", i = $(window).width() / 2 - $(".footer footer").width() / 2, $(".footer footer").css({
                marginTop: s,
                marginLeft: i
            })
        }, o = function () {
            var e;
            if ($(".new-image-background").length > 0)return e = $(window).height() / 2 + "px", $(".loading-mask-layer").show(), $(".loading").css({top: e}).show()
        }, r = function () {
            if ($(".new-image-background").length > 0)return $(".loading-mask-layer, .loading").hide()
        }, o(), $(window).on("load page:change", function () {
            return s(), i(), setTimeout(function (e) {
                return function () {
                    return r()
                }
            }(this), 500)
        }), $(window).on("orientationchange resize", function () {
            return s(), i()
        })
    })
}.call(this), function () {
    $(function () {
        var e;
        return e = function () {
            var e;
            e = parent.postMessage ? parent : parent.document.postMessage ? parent.document : void 0;
            if (e != null)return $("[data-embedded=true] .success .main-content").css("min-height", ""), e.postMessage($("body").height() + 20, "*")
        }, $(window).on("load customLoad", e), $("html").css("visibility", "visible")
    })
}.call(this), function () {
    $(function () {
        return GoldenData.isMobile = !0, window.onload = function () {
            return !GoldenData.isAndroidDevice() && !GoldenData.isIOS8Device() && FastClick.attach(document.body), setTimeout(function () {
                return window.scrollTo(0, 1)
            }, 50)
        }, $(document).on("ready page:change", function () {
            var e;
            return $(".page.success").length > 0 && (e = $(document).height() - 10, $(".current-user-header").length > 0 && (e -= $(".current-user-header").outerHeight()), $("header").length > 0 && (e -= $("header").outerHeight()), $(".footer").is(":visible") && (e -= $(".footer").outerHeight() + 30), $(".guides").length > 0 && (e -= $(".guides").outerHeight()), $(".success .main-content").css("min-height", e + "px")), $("#form_error_messages_modal").modal("show")
        }), $(document).on("click", ".success-social-sharing .share-weixin", function () {
            return $(".weixin-share-guide").show()
        }), $(document).on("click touchstart", ".weixin-share-guide", function () {
            return $(this).hide()
        })
    })
}.call(this);