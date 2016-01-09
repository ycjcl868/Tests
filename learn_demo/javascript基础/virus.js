document.write('<a href="http://www.51.la/?18579746" target="_blank" title="51.La &#x7F51;&#x7AD9;&#x6D41;&#x91CF;&#x7EDF;&#x8BA1;&#x7CFB;&#x7EDF;">&#x7F51;&#x7AD9;&#x7EDF;&#x8BA1;</a>\n');
var a9746tf = "51la";
var a9746pu = "";
var a9746pf = "51la";
var a9746su = window.location;
var a9746sf = document.referrer;
var a9746of = "";
var a9746op = "";
var a9746ops = 1;
var a9746ot = 1;
var a9746d = new Date();
var a9746color = "";
if (navigator.appName == "Netscape") {
    a9746color = screen.pixelDepth;
} else {
    a9746color = screen.colorDepth;
}
try {
    a9746tf = top.document.referrer;
} catch (e) {
}
try {
    a9746pu = window.parent.location;
} catch (e) {
}
try {
    a9746pf = window.parent.document.referrer;
} catch (e) {
}
try {
    a9746ops = document.cookie.match(new RegExp("(^| )a9746_pages=([^;]*)(;|$)"));
    a9746ops = (a9746ops == null) ? 1 : (parseInt(unescape((a9746ops)[2])) + 1);
    var a9746oe = new Date();
    a9746oe.setTime(a9746oe.getTime() + 60 * 60 * 1000);
    document.cookie = "a9746_pages=" + a9746ops + ";path=/;expires=" + a9746oe.toGMTString();
    a9746ot = document.cookie.match(new RegExp("(^| )a9746_times=([^;]*)(;|$)"));
    if (a9746ot == null) {
        a9746ot = 1;
    } else {
        a9746ot = parseInt(unescape((a9746ot)[2]));
        a9746ot = (a9746ops == 1) ? (a9746ot + 1) : (a9746ot);
    }
    a9746oe.setTime(a9746oe.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "a9746_times=" + a9746ot + ";path=/;expires=" + a9746oe.toGMTString();
} catch (e) {
}
try {
    if (document.cookie == "") {
        a9746ops = -1;
        a9746ot = -1;
    }
} catch (e) {
}
a9746of = a9746sf;
if (a9746pf !== "51la") {
    a9746of = a9746pf;
}
if (a9746tf !== "51la") {
    a9746of = a9746tf;
}
a9746op = a9746pu;
try {
    lainframe
} catch (e) {
    a9746op = a9746su;
}
a9746src = 'http://web.51.la:82/go.asp?svid=8&id=18579746&tpages=' + a9746ops + '&ttimes=' + a9746ot + '&tzone=' + (0 - a9746d.getTimezoneOffset() / 60) + '&tcolor=' + a9746color + '&sSize=' + screen.width + ',' + screen.height + '&referrer=' + escape(a9746of) + '&vpage=' + escape(a9746op) +
    '&vvtime=' + a9746d.getTime();
setTimeout('a9746img = new Image;a9746img.src=a9746src;', 0);