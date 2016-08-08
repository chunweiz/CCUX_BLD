/*globals sap, ute*/
/*jslint nomen:true*/

sap.ui.define(
    [
        'nrg/base/view/BaseController',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'jquery.sap.global',
        "sap/ui/model/json/JSONModel"
    ],

    function (CoreController, Filter, FilterOperator, jQuery, JSONModel) {
        'use strict';

        var Controller = CoreController.extend('nrg.module.nnp.view.NNP');


        /* =========================================================== */
		/* lifecycle method- Init                                     */
		/* =========================================================== */
        Controller.prototype.onInit = function () {

        };
        /* =========================================================== */
		/* lifecycle method- Before Rendering                          */
		/* =========================================================== */
        Controller.prototype.onBeforeRendering = function () {
            var sPath,
                oParameters,
                oModel = this.getView().getModel('comp-dashboard'),
                oEditEmailNNP = new sap.ui.model.json.JSONModel(),
                oEmailBox,
                oDelEmailBox,
                that = this,
                oLocalModel = new sap.ui.model.json.JSONModel({
                    emailExist : true
			    });
            sPath = "/EmailNNPs(PartnerID='" + this._sPartnerID + "',Email='" + this._sEmail + "',EmailConsum='" + this._sEmailConsum + "')";
            this._OwnerComponent = this.getView().getParent().getParent().getParent().getController().getOwnerComponent();
            //Start loading NNP logics and settings
            this.getView().setModel(oEditEmailNNP, 'oEditEmailNNP');
            this.getView().setModel(oLocalModel, 'oLocalModel');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEditEmailValidate');
            this._OwnerComponent.getCcuxApp().setOccupied(true);
            oEmailBox = this.getView().byId("idnrgDB-EmailBox");
            oDelEmailBox = this.getView().byId("idnrgDB-DelEmailBox");
            oEmailBox.setVisible(true);
            oDelEmailBox.setVisible(false);
            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this._beforeOpenEditAddrDialogue = true;
                        oEditEmailNNP.setData(oData);
                        if ((oEditEmailNNP.getProperty('/Email') === undefined) || (oEditEmailNNP.getProperty('/Email') === "") || (oEditEmailNNP.getProperty('/Email') === null)) {
                            this.getView().getModel("oLocalModel").setProperty("/emailExist", false);
                        }
                    }
                }.bind(this),
                error: function (oError) {
                    that.getView().getParent().close();
                    ute.ui.main.Popup.Alert({
                        title: 'Email edit',
                        message: 'NNP Entity Service Error'
                    });
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };
        Controller.prototype._formatEmailMkt = function (sIndicator) {
            if (sIndicator === 'y' || sIndicator === 'Y') {
                return true;
            } else {
                return false;
            }
        };

        Controller.prototype._formatPositiveX = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return true;
            } else {
                return false;
            }
        };

        Controller.prototype._formatNegativeX = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return false;
            } else {
                return true;
            }
        };
        Controller.prototype._onValidateEmailAddress = function (oEvent) {
            var oEmailValidate = this.getView().getModel('oEditEmailValidate'),
                oModel = this.getView().getModel('comp-dashboard'),
                oParameters,
                sPath,
                sEmailAddr,
                oEditEmailNNP = this.getView().getModel('oEditEmailNNP'),
                that = this;
            this._OwnerComponent.getCcuxApp().setOccupied(true);
            oEditEmailNNP.refresh(true);
            sEmailAddr = oEditEmailNNP.getProperty('/Email');
            if ((sEmailAddr === undefined) || (sEmailAddr === "") || (sEmailAddr === null)) {
                ute.ui.main.Popup.Alert({
                    title: 'Email address validation',
                    message: 'Please enter an email address'
                });
                return;
            }
            sPath = '/EmailVerifys' + '(\'' + sEmailAddr + '\')';
            oParameters = {
                success : function (oData) {
                    if (oData) {
                        oEmailValidate.setData(oData);
                    }
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                }.bind(this),
                error: function (oError) {
                    //sap.ui.commons.MessageBox.alert("Email Validate Service Error");
                    ute.ui.main.Popup.Alert({
                        title: 'Email address validation',
                        message: 'Email Validate Service Error'
                    });
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                }.bind(this)
            };
            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._onEditEmailSave = function (oEvent) {
            var oModel = this.getView().getModel('comp-dashboard'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oEditEmailNNP').getProperty('/PartnerID'),
                sBpEmail = this.getView().getModel('oEditEmailNNP').getProperty('/Email'),
                sBpEmailConsum = this.getView().getModel('oEditEmailNNP').getProperty('/EmailConsum'),
                oNNP = this.getView().getModel('oEditEmailNNP'),
                bEmailChanged = true,
                that = this,
                oAlertCallBack = function (oEvent) {
                    that.getView().getParent().close();
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                };
            this._OwnerComponent.getCcuxApp().setOccupied(true);
            if (sBpEmail === this._sEmail) {
                bEmailChanged = false;
            } else {
                bEmailChanged = true;
            }
            if (sBpEmailConsum === '000') {   //If it is 'CREATE'
                sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'' + sBpEmail + '\'' + ',EmailConsum=\'\')';
                oNNP.setProperty('/EmailConsum', '');
            } else {    //If it is 'UPDATE'
                sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'' + sBpEmail + '\'' + ',EmailConsum=\'' + sBpEmailConsum + '\')';
            }
            oParameters = {
                merge: false,
                success : function (oData) {
                    if (bEmailChanged) {
                        ute.ui.main.Popup.Alert({
                            title: 'Email save ',
                            message: oNNP.getProperty('/LdapMessage'),
                            callback : oAlertCallBack
                        });
                    } else {
                        ute.ui.main.Popup.Alert({
                            title: 'Email save',
                            message: 'Marketing Preference Updated Successfully',
                            callback : oAlertCallBack
                        });
                    }

                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Email save',
                        message: 'Update Failed'
                    });
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                }.bind(this)
            };
            if (oModel) {
                oModel.update(sPath, oNNP.oData, oParameters);
            }
        };

        Controller.prototype._onEditEmailDelete = function (oEvent) {
            var oModel = this.getView().getModel('comp-dashboard'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oEditEmailNNP').getProperty('/PartnerID'),
                //sBpEmailConsum = this.getView().getModel('oDtaVrfyBP').getProperty('/EmailConsum');
                oNNP = this.getView().getModel('oEditEmailNNP'),
                that = this;

            this._OwnerComponent.getCcuxApp().setOccupied(true);
            //oNNP.setProperty('/Email', '');
            sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'\'' + ',EmailConsum=\'\')';
            oParameters = {
                success : function (oData) {
                    that.getView().getParent().close();
                    //this._initDtaVrfRetr();
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                }.bind(this),
                error: function (oError) {
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                    that.getView().getParent().close();
                    ute.ui.main.Popup.Alert({
                        title: 'Email delete',
                        message: 'Update Failed'
                    });
                }.bind(this)
            };

            if ((oNNP.getProperty('/Ecd') === 'Y') || (oNNP.getProperty('/Mkt') === 'Y') || (oNNP.getProperty('/Offer') === 'Y') || (oNNP.getProperty('/Ee') === 'Y')) {
                this._OwnerComponent.getCcuxApp().setOccupied(false);
                ute.ui.main.Popup.Alert({
                    title: 'Email delete',
                    message: 'Cannot delete email when preferences set to YES.'
                });
                return;
            } else {
                if (oModel) {
                    oModel.remove(sPath, oParameters);
                }
            }
        };
        Controller.prototype._formatEmailAddressText = function (sEmail) {
            if ((sEmail === '') || (sEmail === undefined)) {
                return 'CLICK to ADD';
            } else {
                return sEmail;
            }
        };
        /**
		 * Handler for first cancel of the email, show additional message and request for cancel or delete email.
		 *
		 * @function
         * @param {sap.ui.base.Event} oEvent pattern match event
		 */
        Controller.prototype._onShowDelEmailBox = function (oEventoEvent) {
            var oEmailBox = this.getView().byId("idnrgDB-EmailBox"),
                oDelEmailBox = this.getView().byId("idnrgDB-DelEmailBox"),
                oNNP = this.getView().getModel('oEditEmailNNP'),
                sEmailAddr = oNNP.getProperty('/Email'),
                olocalModel = this.getView().getModel('oLocalModel');
            if ((sEmailAddr === undefined) || (sEmailAddr === "") || (sEmailAddr === null)) {
                if (!olocalModel.getProperty("/emailExist")) {
                    ute.ui.main.Popup.Alert({
                        title: 'Email address validation',
                        message: 'No Email to delete'
                    });
                    return;
                }
            }
            if ((oNNP.getProperty('/Ecd') === 'Y') || (oNNP.getProperty('/Mkt') === 'Y') || (oNNP.getProperty('/Offer') === 'Y') || (oNNP.getProperty('/Ee') === 'Y')) {
                this._OwnerComponent.getCcuxApp().setOccupied(false);
                ute.ui.main.Popup.Alert({
                    title: 'Email delete',
                    message: 'Cannot delete email when preferences set to YES.'
                });
                return;
            } else {
                oEmailBox.setVisible(false);
                oDelEmailBox.setVisible(true);
            }
        };
        /**
		 * Handler for Email Cancel, so refresh the data from backend for complete popup
		 *
		 * @function
         * @param {sap.ui.base.Event} oEvent pattern match event
		 */
        Controller.prototype._onEmailCancel = function (oEvent) {
            var oEmailBox = this.getView().byId("idnrgDB-EmailBox"),
                oDelEmailBox = this.getView().byId("idnrgDB-DelEmailBox"),
                sPath,
                oModel = this.getView().getModel('comp-dashboard'),
                oParameters,
                sBpNum = this._sPartnerID,
                sBpEmail = this._sEmail,
                sBpEmailConsum = this._sEmailConsum,
                that = this,
                oEditEmailNNP = this.getView().getModel('oEditEmailNNP');
            this._OwnerComponent.getCcuxApp().setOccupied(true);
            //Start loading NNP logics and settings
            sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'' + sBpEmail + '\'' + ',EmailConsum=\'' + sBpEmailConsum + '\')';
            oParameters = {
                /*urlParameters: {"$expand": "Buags"},*/
                success : function (oData) {
                    if (oData) {
                        oEditEmailNNP.setData(oData);
                        if ((oEditEmailNNP.getProperty('/Email') === undefined) || (oEditEmailNNP.getProperty('/Email') === "") || (oEditEmailNNP.getProperty('/Email') === null)) {
                            this.getView().getModel("oLocalModel").setProperty("/emailExist", false);
                        }
                        that._OwnerComponent.getCcuxApp().setOccupied(false);
                    }
                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Email cancel',
                        message: 'NNP Entity Service Error'
                    });
                    that._OwnerComponent.getCcuxApp().setOccupied(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
            oEmailBox.setVisible(true);
            oDelEmailBox.setVisible(false);
        };
        Controller.prototype._onMktPrefTogg = function (oEvent) {
            var oNNP = this.getView().getModel('oEditEmailNNP');

            if (oEvent.mParameters.id.indexOf('ctaddr') > 0) {
                if (oEvent.getSource().getLeftSelected()) {
                    oNNP.setProperty('/Ecd', 'Y');
                } else {
                    oNNP.setProperty('/Ecd', 'N');
                }
            } else if (oEvent.mParameters.id.indexOf('rpdsrv') > 0) {
                if (oEvent.getSource().getLeftSelected()) {
                    oNNP.setProperty('/Mkt', 'Y');
                } else {
                    oNNP.setProperty('/Mkt', 'N');
                }
            } else if (oEvent.mParameters.id.indexOf('thrdpty') > 0) {
                if (oEvent.getSource().getLeftSelected()) {
                    oNNP.setProperty('/Offer', 'Y');
                } else {
                    oNNP.setProperty('/Offer', 'N');
                }
            } else { //('engeff')
                if (oEvent.getSource().getLeftSelected()) {
                    oNNP.setProperty('/Ee', 'Y');
                } else {
                    oNNP.setProperty('/Ee', 'N');
                }
            }
        };
        /**
		 * When Popup is closed
		 *
		 * @function onQuickPay
         * @param {sap.ui.base.Event} oEvent pattern match event
		 */
        Controller.prototype.onPopupClose = function (oEvent) {
            this.getView().getParent().close();
        };
        return Controller;
    }


);
