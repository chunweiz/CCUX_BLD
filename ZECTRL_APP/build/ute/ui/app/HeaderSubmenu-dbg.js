/*global sap*/
/*jslint nomen:true*/

sap.ui.define(
    [
        'sap/ui/core/Control',
        'sap/ui/core/Popup',
        'ute/ui/app/Header'
    ],

    function (Control, Popup, Header) {
        'use strict';

        var CustomControl = Control.extend('ute.ui.app.HeaderSubmenu', {
            metadata: {
                library: 'ute.ui.app',

                aggregations: {
                    content: { type: 'sap.ui.core.Control', multiple: true, singularName: 'content' }
                },

                defaultAggregation: 'content'
            }
        });

        CustomControl.prototype.open = function () {
            this._oPopup.setInitialFocusId(this.getId());

            if (this._oPopup.isOpen()) {
                return this;
            }

            this._oPopup.setContent(this);
            this._oPopup.open();

            return this;
        };

        CustomControl.prototype.close = function () {
            var sOpenState = this._oPopup.getOpenState();

            if (!(sOpenState === sap.ui.core.OpenState.CLOSED || sOpenState === sap.ui.core.OpenState.CLOSING)) {
                this._oPopup.close();
            }

            return this;
        };

        CustomControl.prototype.setPosition = function (oRef, sOffset) {
            this._oPopup.setPosition(
                Popup.Dock.LeftBottom,
                Popup.Dock.LeftTop,
                oRef,
                sOffset
            );
        };

        CustomControl.prototype.init = function () {
            var oParentHeader;

            this._oPopup = new Popup();
            this._oPopup.setShadow(false);
            this._oPopup.setModal(false);
            this._oPopup.setAutoClose(false);
            this._oPopup.setDurations(0, 0);
        };

        CustomControl.prototype.exit = function () {
            if (this._oPopup) {
                this._oPopup.destroy();
                this._oPopup = null;
            }
        };

        return CustomControl;
    },

    true
);
