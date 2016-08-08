/*global sap*/
/*jslint nomen:true*/


sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/ValueStateSupport'],
	function (jQuery, library, Control, ValueStateSupport) {
        "use strict";

        var Textfield = Control.extend("ute.ui.commons.Textfield", { metadata : {
            library : "ute.ui.commons",

            properties : {
                //Value the textfield bind with
                value : {type : "string", group : "Data", defaultValue : '', bindable : "bindable"},

                //Not implemented, if enabled = flase will grey out
                enabled : {type : "boolean", group : "Behavior", defaultValue : true},

                //If false the textfield is not editable
                editable : {type : "boolean", group : "Behavior", defaultValue : true},

                //CSS type width of the Textfield, the min width is set to 168px.
                width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : "200px" },

                maxLength : {type : "int", group : "Behavior", defaultValue : 0},

                //name attribute in HTML
                name : {type : "string", group : "Misc", defaultValue : null},

                //Placeholder value of a string before the input
                placeholder : {type : "string", group : "Appearance", defaultValue : null},


                fieldType : { type: "ute.ui.commons.TextfieldType", group: "Appearance", defaultValue: "Regular" },
                //Two types of inputs, one is "field1" and the other is "field2""

                label: { type: "string", group: "Appearance", defaultvalue: null }
            },
            events : {
                /*Fired when textfield is edit*/
                change : {
                    parameters : {
                        /*The new / changed value of the textfield.*/
                        newValue : {type : "string"}
                    }
                },
                // Fired when the enter key got clicked 
                enterKeyPress : {},

                // Fired when the textfield is focused
                focusIn : {}
            }
        }
            });

        Textfield.prototype.onsapfocusleave = function (oEvent) {

            this._checkChange(oEvent);

            oEvent.preventDefault();
            oEvent.stopPropagation();
        };

        Textfield.prototype.onfocusin = function (oEvent) {
            oEvent.preventDefault();
            oEvent.stopPropagation();

            this.fireFocusIn(oEvent);
        };

        Textfield.prototype.onsapenter = function (oEvent) {
            oEvent.preventDefault();
            oEvent.stopPropagation();

            this._checkChange(oEvent);
            this.fireEnterKeyPress(oEvent);
        };

        Textfield.prototype._checkChange = function (oEvent) {
            var oInput = this.getInputDomRef(),
                newVal = oInput && oInput.value,
                oldVal = this.getValue();

            if (this.getEditable() && this.getEnabled() && (oldVal !== newVal)) {
                this.setProperty("value", newVal, true); // suppress rerendering
                //console.log(this.getValue());
                this.fireChange({newValue: newVal}); // oldValue is not that easy in ComboBox and anyway not in API... thus skip it
            }
	    };

        Textfield.prototype._getRenderOuter = function () {

            if (this.bRenderOuter === undefined) {
                var oRenderer = this.getRenderer();
                if (oRenderer.renderOuterAttributes || oRenderer.renderOuterContentBefore || oRenderer.renderOuterContent) {
                    this.bRenderOuter = true;
                } else {
                    this.bRenderOuter = false;
                }
            }
            return this.bRenderOuter;
        };

        Textfield.prototype.getInputDomRef = function () {
            /*
            if (!this._getRenderOuter()) {
                return this.getDomRef() || null;
            } else {
                return this.getDomRef("input") || null;
            }*/
            return this.getDomRef("input") || null;
        };



	    return Textfield;

    }, /* bExport= */ true);
