sap.ui.define(["jquery.sap.global"],function(){"use strict";var a={};return a.render=function(a,b){a.write("<span"),a.addClass("uteChkBox"),a.writeClasses(),a.write("><input"),a.writeAttribute("type","checkbox"),a.writeAttribute("id",b.getId()),a.addClass("uteChkBox-input"),a.writeClasses(),b.getName()&&a.writeAttribute("name",b.getName()),b.getChecked()&&a.write("checked"),a.write("/><label"),a.writeAttribute("for",b.getId()),a.write("></label>"),b.getText()&&(a.write("<text"),a.addClass("uteChkBox-text"),a.writeClasses(),a.write(">"+b.getText()+"</text>")),a.write("</span>")},a},!0);