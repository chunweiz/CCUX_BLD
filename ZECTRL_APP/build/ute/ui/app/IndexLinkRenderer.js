sap.ui.define([],function(){"use strict";var a={};return a.render=function(a,b){a.write("<div"),a.writeControlData(b),a.addClass("uteAppIdxLink"),a.writeClasses(),a.write(">"),this._renderDescription(a,b),a.write("</div>")},a._renderDescription=function(a,b){a.write("<span"),a.addClass("uteAppIdxLink-desc"),a.writeClasses(),a.write(">"),b.getDescription()&&a.writeEscaped(b.getDescription()),a.write("</span>")},a},!0);