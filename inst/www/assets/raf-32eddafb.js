import{g as v,c as x}from"./core-js-93797867.js";import{p as g}from"./performance-now-58eb5a47.js";var m={exports:{}},w=g,a=typeof window>"u"?x:window,s=["moz","webkit"],e="AnimationFrame",o=a["request"+e],l=a["cancel"+e]||a["cancelRequest"+e];for(var c=0;!o&&c<s.length;c++)o=a[s[c]+"Request"+e],l=a[s[c]+"Cancel"+e]||a[s[c]+"CancelRequest"+e];if(!o||!l){var p=0,u=0,t=[],F=1e3/60;o=function(r){if(t.length===0){var n=w(),h=Math.max(0,F-(n-p));p=h+n,setTimeout(function(){var i=t.slice(0);t.length=0;for(var f=0;f<i.length;f++)if(!i[f].cancelled)try{i[f].callback(p)}catch(d){setTimeout(function(){throw d},0)}},Math.round(h))}return t.push({handle:++u,callback:r,cancelled:!1}),u},l=function(r){for(var n=0;n<t.length;n++)t[n].handle===r&&(t[n].cancelled=!0)}}m.exports=function(r){return o.call(a,r)};m.exports.cancel=function(){l.apply(a,arguments)};m.exports.polyfill=function(r){r||(r=a),r.requestAnimationFrame=o,r.cancelAnimationFrame=l};var y=m.exports;const C=v(y);export{C as r};
