sap.ui.define([],function(){"use strict";var a={};return a.render=function(a,b){a.write("<div"),a.writeControlData(b),a.addClass("uteMDd"),b.getDesign()!==ute.ui.main.DropdownDesign.None&&a.addClass("uteMDd-design-"+b.getDesign().toLowerCase()),a.writeClasses(),a.write(">"),this._renderHeader(a,b),this._renderPicker(a,b),a.write("</div>")},a._renderHeader=function(a,b){a.write("<div"),a.addClass("uteMDd-hdr"),a.writeClasses(),a.write(">"),this._renderHeaderContent(a,b),this._renderHeaderExpander(a,b),a.write("</div>")},a._renderHeaderContent=function(a,b){var c=b.getAggregation("_headerContent");a.write("<div"),a.addClass("uteMDd-hdrContent"),a.writeClasses(),a.write(">"),c?a.renderControl(c):b.getPlaceholder()&&(a.write("<span"),a.addClass("uteMDd-hdrContent-placeholder"),a.writeClasses(),a.write(">"),a.writeEscaped(b.getPlaceholder()),a.write("</span>")),a.write("</div>")},a._renderHeaderExpander=function(a){a.write("<div"),a.addClass("uteMDd-hdrExpander"),a.writeClasses(),a.write(">"),a.write("</div>")},a._renderPicker=function(a,b){var c=b.getContent()||[];a.write("<div"),a.writeAttribute("id",b.getId()+"-picker"),a.addClass("uteMDd-picker"),a.writeClasses(),a.write(">"),c.forEach(function(b){a.renderControl(b)}),a.write("</div>")},a},!0);