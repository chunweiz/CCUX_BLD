sap.ui.define([],function(){"use strict";var a={};return a.render=function(a,b){a.write("<div"),a.writeControlData(b),a.addClass("uteApp"),a.writeClasses(),a.write(">"),this._renderHeader(a,b),this._renderBody(a,b),a.write("</div>")},a._renderHeader=function(a,b){a.write("<header"),a.addClass("uteApp-hdr"),a.writeClasses(),a.write(">"),a.renderControl(b.getHeader()),a.write("</header>")},a._renderBody=function(a,b){a.write("<main"),a.addClass("uteApp-body"),a.writeClasses(),a.write(">"),a.renderControl(b.getBody()),a.write("</main>")},a._renderFooter=function(a,b){a.write("<footer"),a.addClass("uteApp-ftr"),a.writeClasses(),a.write(">"),a.renderControl(b.getFooter()),a.write("</footer>")},a},!0);