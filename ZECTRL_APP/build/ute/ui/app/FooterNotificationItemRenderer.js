sap.ui.define([],function(){"use strict";var a={};return a.render=function(a,b){a.write("<div"),a.writeControlData(b),a.addClass("uteAppFtrNotifItem"),b.getDesign()!==ute.ui.app.FooterNotificationItemDesign.None&&a.addClass("uteAppFtrNotifItem-design-"+b.getDesign().toLowerCase()),b.getLink()&&a.addClass("uteAppFtrNotifItem-link"),a.writeClasses(),a.write(">"),this._renderContent(a,b),a.write("</div>")},a._renderContent=function(a,b){this._renderIcon(a,b),this._renderText(a,b)},a._renderIcon=function(a,b){a.write("<span"),a.addClass("uteAppFtrNotifItem-icon"),a.writeClasses(),a.write(">"),a.writeIcon(b.getCustomIcon()),a.write("</span>")},a._renderText=function(a,b){a.write("<span"),a.addClass("uteAppFtrNotifItem-text"),a.writeClasses(),a.write(">"),a.writeEscaped(b.getText()),a.write("</span>")},a},!0);