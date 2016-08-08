/*global sap*/
/*globals ute*/
/*globals $*/
/*jslint nomen:true*/

sap.ui.define(
    [
        'nrg/base/view/BaseController',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'sap/ui/core/routing/HashChanger',
        'jquery.sap.global',
        'nrg/module/nnp/view/NNPPopup'
    ],

    function (CoreController, Filter, FilterOperator, HashChanger, jQuery, NNPPopup) {
        'use strict';

        var Controller = CoreController.extend('nrg.module.dashboard.view.CustomerDataVerification');

        Controller.prototype.onInit = function () {

        };

        Controller.prototype.onBeforeRendering = function () {

            this.getOwnerComponent().getCcuxApp().setTitle('CUSTOMER DATA');

            this.getView().setModel(this.getOwnerComponent().getModel('comp-dashboard'), 'oODataSvc');

            //Model to hold BP info
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaVrfyBP');

            //Model to hold Buags (avoid too long of bindings
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaVrfyBuags');

            //Model to hold Contract
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaVrfyContract');

            //Model to hold all Contracts of selected Buag
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oAllContractsofBuag');

            //Model to hold all Buags
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oAllBuags');

            //Model to hold mailing/temp address
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaVrfyMailingTempAddr');
            //Model for Edit Popup Screen (Use the model to show on edit screen)
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaAddrEdit');

            //Model to track "Confirm" or not status
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oCfrmStatus');

            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oCoPageModel');

            //For Phone Type
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDayPhoneType');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEvnPhoneType');

            //For EditEmail Popup
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEditEmailNNP');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEditEmailValidate');

            //Siebel Customer Indicator
            this._bSiebelCustomer = false;

            // Disable backspace key on this page
            $(document).on("keydown", function (e) {
                if (e.which === 8 && !$(e.target).is("input, textarea")) {
                    e.preventDefault();
                }
            });

            // Retrieve routing parameters
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo();

            this._bpNum = oRouteInfo.parameters.bpNum;
            this._caNum = oRouteInfo.parameters.caNum;
            this._coNum = oRouteInfo.parameters.coNum;

            this._initToggleArea();
            this._initDtaVrfRetr();
            this._initCfrmStatus();
            this._initPhnTypes();
            this._initMailAddrModels();
        };

        Controller.prototype.onAfterRendering = function () {
            // Navigation arrow event handling
            this.getOwnerComponent().getCcuxApp().showNavLeft(true);
            this.getOwnerComponent().getCcuxApp().detachNavLeftAll();
            this.getOwnerComponent().getCcuxApp().attachNavLeft(this._dhsbVerificationNavLeftCallBack, this);

            // Update Footer
            this.getOwnerComponent().getCcuxApp().updateFooter(this._bpNum, this._caNum, this._coNum);

            // Attach click event to Status
            this.getView().byId("nrgDashBoard-cusDataVerify-Status").attachBrowserEvent("click", this._navToSvcOdr.bind(this));
        };


        Controller.prototype._dhsbVerificationNavLeftCallBack = function () {
            var oWebUiManager = this.getOwnerComponent().getCcuxWebUiManager();

            this.getOwnerComponent().getCcuxApp().setOccupied(true);

            if (true) {
                oWebUiManager.notifyWebUi('clearAccount', {}, this._navLeftClearAccCallBack, this);
            } else {
                this._dhsbVerificationNavLeftClearAccCallBack();
            }
        };

        Controller.prototype._dhsbVerificationNavLeftClearAccCallBack = function () {
            var oContext, oRouter;

            this.getOwnerComponent().getCcuxApp().setOccupied(false);
            oContext = this.getOwnerComponent().getCcuxContextManager().resetContext();
            oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo('app.refresh');
            oRouter.navTo('search.SearchNoID');
        };

        Controller.prototype._initToggleArea = function () {
            if (!this.getView().byId('id_DshbTglBtn').getLeftSelected()) {
                this.getView().byId('id_DshbTglBtn').setLeftSelected(true);
                this._onToggleButtonPress(null);
            }
        };

        Controller.prototype._initPhnTypes = function () {
            var oDayPhnType = this.getView().getModel('oDayPhoneType'),
                oEvnPhnType = this.getView().getModel('oEvnPhoneType'),
                oTypes = [],
                oEvnTypes = [];


            oTypes = [ {Key: "WORK", Type: "LANDLINE"}, {Key: "CELL", Type: "CELL"}];
            oEvnTypes = [ {Key: "HOME", Type: "LANDLINE"}, {Key: "CELL", Type: "CELL"}];

            oDayPhnType.setProperty('/', oTypes);
            oEvnPhnType.setProperty('/', oEvnTypes);
        };

        Controller.prototype._initCfrmStatus = function () {
            this.getView().getModel('oCfrmStatus').setProperty('/bEditable', true);
            this.getView().getModel('oCfrmStatus').setProperty('/ShowSMSBtn', false);
            this.getView().byId('id_confmBtn').setVisible(true);
            this.getView().byId('id_unConfmBtn').setVisible(false);
            this.getView().byId('id_updtBtn').setEnabled(true);
        };





        /*Controller.prototype._onCaChange = function (oEvent) {
            var sNewSelectedBuagIndex;

            sNewSelectedBuagIndex = oEvent.getSource().getSelectedKey();
            this._retrAllCa(sNewSelectedBuagIndex);
        };*/

        Controller.prototype._onToggleButtonPress = function (oEvent) {
            //var l_selected = this.getView().byId('id_DshbTglBtn').getLeftSelected();
            if (this.getView().byId('mailadd_area').getVisible()) {
                this.getView().byId('mailadd_area').setVisible(false);
                this.getView().byId('serviceadd_area').setVisible(true);
                this.getView().byId('idContractDropdown').setVisible(true);
            } else {
                this.getView().byId('serviceadd_area').setVisible(false);
                this.getView().byId('mailadd_area').setVisible(true);
                this.getView().byId('idContractDropdown').setVisible(false);
            }

        };

        Controller.prototype._handleUpdate = function () {
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters;

            sPath = '/Partners' + '(\'' + this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID') + '\')';
            oParameters = {
                merge: false,
                success : function (oData) {
                    ute.ui.main.Popup.Alert({
                        title: 'Customer data update ',
                        message: 'Update Success'
                    });
                    this._initDtaVrfRetr();
                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Customer data update ',
                        message: 'Update Failed'
                    });
                }.bind(this)
            };

            if (oModel) {
                oModel.update(sPath, this.getView().getModel('oDtaVrfyBP').oData, oParameters);
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

        Controller.prototype._formatChecked = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return true;
            } else {
                return false;
            }
        };

        Controller.prototype._formatRemoteLabel = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return false;
            } else {
                return true;
            }
        };

        Controller.prototype._formatSMSBtn = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return false;
            } else {
                return true;
            }
        };

        Controller.prototype._formatDate = function (sDateString) {
            // 20120620
            var sYear,
                sMonth,
                sDay;

            if (sDateString) {
                sYear = sDateString.substring(0, 4);
                sMonth = sDateString.substring(4, 6);
                sDay = sDateString.substring(6, 8);
                return sMonth + '/' + sDay + '/' + sYear;
            } else {
                return " ";
            }
        };





















        /*Ends Here*/
        /********************************************************************************************/

        Controller.prototype._formatVrfyMark = function (sIndicator) {
            if (sIndicator === 'x' || sIndicator === 'X') {
                return true;
            } else {
                return false;
            }
        };
        Controller.prototype._formatVrfyMarkRedX = function (sIndicator, sDLSSN) {
            if (sDLSSN) {
                if (sIndicator === 'x' || sIndicator === 'X') {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        Controller.prototype._cleanUpAddrEditPop = function () {
            var i;

            this.getView().byId('idAddrUpdatePopup').removeStyleClass('nrgDashboard-cusDataVerifyEditMail-vl');
            this.getView().byId('idAddrUpdatePopup-HdrLn').setVisible(false);
            this.getView().byId('idAddrUpdatePopup-l').removeStyleClass('nrgDashboard-cusDataVerifyEditMail-l-vl');
            this.getView().byId('idAddrUpdatePopup-r').setVisible(false);

            for (i = 1; i < 8; i = i + 1) {
                //console.log(this.getView().byId('idAddrUpdatePopup-l').getContent()[i]);
                this.getView().byId('idAddrUpdatePopup-l').getContent()[i].getContent()[0].removeStyleClass('nrgDashboard-cusDataVerifyEditMail-lHighlight');
                this.getView().byId('idAddrUpdatePopup-r').getContent()[i].getContent()[0].removeStyleClass('nrgDashboard-cusDataVerifyEditMail-rHighlight');
            }
        };

        Controller.prototype._handleMailingAddrUpdate = function (oEvent) {
            //Validate the address input first
            this._validateInputAddr();
        };

        Controller.prototype._handleMailingAcceptBtn = function (oEvent) {
            var oMailEdit = this.getView().getModel('oDtaAddrEdit'),
                oMailTempModel = this.getView().getModel('oDtaVrfyMailingTempAddr'),
                tempObj,
                key;

            tempObj = oMailEdit.getProperty('/SuggAddrInfo');
            delete tempObj.HeaderText1;
            delete tempObj.HeaderText2;
            delete tempObj.FooterLine1;
            delete tempObj.FooterLine2;
            delete tempObj.FooterLine3;

            if (oMailEdit.getProperty('/bFixAddr')) {
                oMailTempModel.setProperty('/FixUpd', 'X');
                for (key in tempObj) {
                    if (tempObj.hasOwnProperty(key)) {
                        if (!(key === '__metadata' || key === 'StandardFlag' || key === 'Supplement')) {
                            oMailTempModel.setProperty('/FixAddrInfo/' + key, tempObj[key]);
                        }
                    }
                }
            } else {
                oMailTempModel.setProperty('/TempUpd', 'X');
                for (key in tempObj) {
                    if (tempObj.hasOwnProperty(key)) {
                        if (!(key === '__metadata' || key === 'StandardFlag' || key === 'Supplement')) {
                            oMailTempModel.setProperty('/TempAddrInfo/' + key, tempObj[key]);
                        }
                    }
                }
            }

            this._updateMailingAddr();
        };

        Controller.prototype._handleMailingDeclineBtn = function (oEvent) {
            var oMailEdit = this.getView().getModel('oDtaAddrEdit'),
                oMailTempModel = this.getView().getModel('oDtaVrfyMailingTempAddr'),
                tempObj;

            tempObj = oMailEdit.getProperty('/AddrInfo');

            if (oMailEdit.getProperty('/bFixAddr')) {
                oMailTempModel.setProperty('/FixAddrInfo', tempObj);
                oMailTempModel.setProperty('/FixUpd', 'X');
            } else {
                oMailTempModel.setProperty('/TempAddrInfo', tempObj);
                oMailTempModel.setProperty('/TempUpd', 'X');
            }

            this._updateMailingAddr();
        };

        Controller.prototype._handleMailingEditBtn = function (oEvent) {
            var oEditMail = this.getView().getModel('oDtaAddrEdit');

            //oEditMail.setProperty('/updateSent', false);
            oEditMail.setProperty('/showVldBtns', false);
            oEditMail.setProperty('/updateNotSent', true);
        };

        Controller.prototype._showSuggestedAddr = function () {
            //Address validation error there was. Show system suggested address values we need to.
            this.getView().byId('idAddrUpdatePopup').addStyleClass('nrgDashboard-cusDataVerifyEditMail-vl');
            this.getView().byId('idAddrUpdatePopup-l').addStyleClass('nrgDashboard-cusDataVerifyEditMail-l-vl');
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateSent', true);
            this.getView().getModel('oDtaAddrEdit').setProperty('/showVldBtns', true);
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateNotSent', false);
        };

        Controller.prototype._updateMailingAddr = function () {
            this.getOwnerComponent().getCcuxApp().setOccupied(true);

            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/PartnerID'),
                sCaNum = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/ContractAccountID'),
                sFixedAddressID = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/FixedAddressID');


            sPath = '/BuagMailingAddrs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',ContractAccountID=\'' + sCaNum + '\'' + ',FixedAddressID=\'' + sFixedAddressID + '\')';

            oParameters = {
                urlParameters: {},
                success : function (oData) {
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    ute.ui.main.Popup.Alert({
                        title: 'Mailing address update ',
                        message: 'Update Success'
                    });
                    this._retrAllCa(this.getView().getModel('oDtaVrfyBuags').getProperty('/PartnerID'));
                    this._oMailEditPopup.close();
                }.bind(this),
                error: function (oError) {
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    this._oMailEditPopup.close();
                    ute.ui.main.Popup.Alert({
                        title: 'Mailing address update ',
                        message: 'Update Failed'
                    });
                }.bind(this)
            };

            if (oModel) {
                oModel.update(sPath, this.getView().getModel('oDtaVrfyMailingTempAddr').oData, oParameters);
            }
        };

        Controller.prototype._validateInputAddr = function () {
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            
            //this._showSuggestedAddr();
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters,
                aFilters = this._createAddrValidateFilters(),
                oMailEdit = this.getView().getModel('oDtaAddrEdit');

            sPath = '/BuagMailingAddrs';

            oParameters = {
                filters: aFilters,
                success: function (oData) {
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    if (oData.results[0].AddrChkValid === 'X') {
                        //Validate success, update the address directly
                        this._updateMailingAddr();
                    } else {
                        oMailEdit.setProperty('/SuggAddrInfo', oData.results[0].TriCheck);
                        this._showSuggestedAddr();
                    }
                }.bind(this),
                error: function (oError) {
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    ute.ui.main.Popup.Alert({
                        title: 'Input address validation',
                        message: 'Validation Call Failed'
                    });

                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._createAddrValidateFilters = function () {
            var aFilters = [],
                oFilterTemplate,
                sBpNum = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/PartnerID'),
                oMailEdit = this.getView().getModel('oDtaAddrEdit'),
                oMailEditAddrInfo = oMailEdit.getProperty('/AddrInfo'),
                key,
                bFixAddr = oMailEdit.getProperty('/bFixAddr'),
                tempPath;

            if (bFixAddr) {
                oFilterTemplate = new Filter({ path: 'FixUpd', operator: FilterOperator.EQ, value1: 'X'});
                aFilters.push(oFilterTemplate);
            } else {
                oFilterTemplate = new Filter({ path: 'TempUpd', operator: FilterOperator.EQ, value1: 'X'});
                aFilters.push(oFilterTemplate);
            }

            oFilterTemplate = new Filter({ path: 'PartnerID', operator: FilterOperator.EQ, value1: sBpNum});
            aFilters.push(oFilterTemplate);

            oFilterTemplate = new Filter({ path: 'ChkAddr', operator: FilterOperator.EQ, value1: 'X'});
            aFilters.push(oFilterTemplate);

            for (key in oMailEditAddrInfo) {
                if (oMailEditAddrInfo.hasOwnProperty(key)) {
                    if (!(key === '__metadata' || key === 'StandardFlag' || key === 'ShortForm' || key === 'ValidFrom' || key === 'ValidTo' || key === 'Supplement')) {
                        if (bFixAddr) {
                            tempPath = 'FixAddrInfo/' + key;
                            oFilterTemplate = new Filter({ path: tempPath, operator: FilterOperator.EQ, value1: oMailEditAddrInfo[key]});
                            aFilters.push(oFilterTemplate);
                        } else {
                            tempPath = 'TempAddrInfo/' + key;
                            oFilterTemplate = new Filter({ path: tempPath, operator: FilterOperator.EQ, value1: oMailEditAddrInfo[key]});
                            aFilters.push(oFilterTemplate);
                        }
                    }
                }
            }

            return aFilters;
        };

        Controller.prototype._initMailAddrModels = function () {
            /*this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaVrfyMailingTempAddr');
              this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oDtaAddrEdit');*/
            var oEditMail = this.getView().getModel('oDtaAddrEdit');

            oEditMail.setProperty('/updateSent', false);
            oEditMail.setProperty('/showVldBtns', false);
            oEditMail.setProperty('/updateNotSent', true);
        };

        Controller.prototype._onPoBoxEdit = function (oEvent) {
            //this.getView().byId('idEditHouseNum').setEnabled(false);
            //this.getView().byId('idEditStName').setEnabled(false);
            this.getView().byId('idEditHouseNum').setValue('');
            this.getView().byId('idEditStName').setValue('');
        };

        Controller.prototype._onRegAddrEdit = function (oEvent) {
            this.getView().byId('idEditPoBox').setValue('');
        };

        Controller.prototype._onEditMailAddrClick = function (oEvent) {

            var oEditMail = this.getView().getModel('oDtaAddrEdit'),
                oCompareEvnet = {mParameters: {checked: null}};

                //console.log(oEditMail);


            oEditMail.setProperty('/AddrInfo', this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/FixAddrInfo'));

            if (!this._oMailEditPopup) {
                this._oMailEditPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.dashboard.view.AddrUpdateCaLvlPopUp", this),
                    title: 'Edit Mailing Address',
                    close: function () {
                        this._retrCaMailingAddr(
                            this.getView().getModel('oDtaVrfyBuags').getProperty('/PartnerID'),
                            this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                            this.getView().getModel('oDtaVrfyBuags').getProperty('/FixedAddressID')
                        );
                    }.bind(this)
                });
                this.getView().addDependent(this._oMailEditPopup);
                /*this._oMailEditPopup = ute.ui.main.Popup.create({
                    close: this._handleEditMailPopupClose.bind(this),
                    content: this.getView().byId("idAddrUpdatePopup"),
                    title: 'Edit Mailing Address'
                });*/
            }

            //Control what to or not to display
            this._cleanUpAddrEditPop();
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateSent', false);
            this.getView().getModel('oDtaAddrEdit').setProperty('/showVldBtns', false);
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateNotSent', true);
            this.getView().getModel('oDtaAddrEdit').setProperty('/bFixAddr', true);
            this.getView().byId('idEditMailAddr_UpdtBtn').setVisible(true);
            if (this.getView().byId('idSuggCompareCheck').getChecked()) {
                oCompareEvnet.mParameters.checked = false;
                this._compareSuggChkClicked(oCompareEvnet);
                this.getView().byId('idSuggCompareCheck').setChecked(false);
            }

            this._oMailEditPopup.open();
        };


        Controller.prototype._onEditTempAddrClick = function (oEvent) {
            var oEditMail = this.getView().getModel('oDtaAddrEdit'),
                oCompareEvnet = {mParameters: {checked: null}};

            oEditMail.setProperty('/AddrInfo', this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/TempAddrInfo'));
            if (!this._oMailEditPopup) {
                this._oMailEditPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.dashboard.view.AddrUpdateCaLvlPopUp", this),
                    title: 'Edit Mailing Address'
                });
                this.getView().addDependent(this._oMailEditPopup);
            }

            //Control what to or not to display
            this._cleanUpAddrEditPop();
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateSent', false);
            this.getView().getModel('oDtaAddrEdit').setProperty('/showVldBtns', false);
            this.getView().getModel('oDtaAddrEdit').setProperty('/updateNotSent', true);
            this.getView().getModel('oDtaAddrEdit').setProperty('/bFixAddr', true);
            this.getView().byId('idEditMailAddr_UpdtBtn').setVisible(true);
            if (this.getView().byId('idSuggCompareCheck').getChecked()) {
                oCompareEvnet.mParameters.checked = false;
                this._compareSuggChkClicked(oCompareEvnet);
                this.getView().byId('idSuggCompareCheck').setChecked(false);
            }

            this._oMailEditPopup.open();
        };

        Controller.prototype._handleTempAddrUpdate = function (oEvent) {
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/PartnerID'),
                sCaNum = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/ContractAccountID'),
                sFixedAddressID = this.getView().getModel('oDtaVrfyMailingTempAddr').getProperty('/TemporaryAddrID');



            sPath = '/BuagMailingAddrs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',ContractAccountID=\'' + sCaNum + '\'' + ',FixedAddressID=\'' + sFixedAddressID + '\')';

            oParameters = {
                merge: false,
                success : function (oData) {
                    ute.ui.main.Popup.Alert({
                        title: 'Address update',
                        message: 'Update Success'
                    });
                    this._oTempMailEditPopup.close();
                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Address update',
                        message: 'Update Failed'
                    });
                }.bind(this)
            };

            if (oModel) {
                oModel.update(sPath, this.getView().getModel('oDtaVrfyMailingTempAddr').oData, oParameters);
            }
        };

        Controller.prototype._compareSuggChkClicked = function (oEvent) {
            //this.getView().byId('idAddrUpdatePopup-l').getContent()[2].getContent()[0].getValue()
            var oLeftInputArea = this.getView().byId('idAddrUpdatePopup-l').getContent(),
                oRightSuggArea = this.getView().byId('idAddrUpdatePopup-r').getContent(),
                i;

            if (oEvent.mParameters.checked) {
                for (i = 1; i < 8; i = i + 1) {
                    if (oLeftInputArea[i].getContent()[0].getValue() !== oRightSuggArea[i].getContent()[0].getValue()) {
                        oLeftInputArea[i].getContent()[0].addStyleClass('nrgDashboard-cusDataVerifyEditMail-lHighlight');
                        oRightSuggArea[i].getContent()[0].addStyleClass('nrgDashboard-cusDataVerifyEditMail-rHighlight');
                    }
                }
            } else {
                for (i = 1; i < 8; i = i + 1) {
                    if (oLeftInputArea[i].getContent()[0].getValue() !== oRightSuggArea[i].getContent()[0].getValue()) {
                        oLeftInputArea[i].getContent()[0].removeStyleClass('nrgDashboard-cusDataVerifyEditMail-lHighlight');
                        oRightSuggArea[i].getContent()[0].removeStyleClass('nrgDashboard-cusDataVerifyEditMail-rHighlight');
                    }
                }
            }
        };

        Controller.prototype._onSMSButtonClicked = function (oEvent) {
            var oCurBpModel = this.getView().getModel('oDtaVrfyBP'),
                oCurCaModel = this.getView().getModel('oDtaVrfyBuags'),
                sSmsUrl = oCurBpModel.getProperty('/SMSUrl'),
                iCAstringIndex = sSmsUrl.indexOf('contractAccount=');


            sSmsUrl = sSmsUrl.substr(0, iCAstringIndex + 16) + oCurCaModel.getProperty('/ContractAccountID') + sSmsUrl.substr(iCAstringIndex + 16);
            window.open(sSmsUrl);
        };


    /*************************************************************************************/
        //Edit Email
        Controller.prototype._handleEmailEdit = function (oEvent) {
            var sBpNum = this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID'),
                sBpEmail = this.getView().getModel('oDtaVrfyBP').getProperty('/Email'),
                sBpEmailConsum = this.getView().getModel('oDtaVrfyBP').getProperty('/EmailConsum'),
                NNPPopupControl = new NNPPopup(),
                oNNPView,
                _handleDialogClosed;

            NNPPopupControl.attachEvent("NNPCompleted", function () {
                // Update Footer
                this.getOwnerComponent().getCcuxApp().updateFooterNotification(this._bpNum, this._caNum, this._coNum, false);
                this.getOwnerComponent().getCcuxApp().updateFooterRHS(this._bpNum, this._caNum, this._coNum, false);
                this.getOwnerComponent().getCcuxApp().updateFooterCampaign(this._bpNum, this._caNum, this._coNum, false);
                this._initDtaVrfRetr();
            }, this);
            this.getView().addDependent(NNPPopupControl);
            NNPPopupControl.openNNP(sBpNum, sBpEmail, sBpEmailConsum);
        };

        Controller.prototype._onValidateEmailAddress = function (oEvent) {
            var oEmailValidate = this.getView().getModel('oEditEmailValidate'),
                oModel = this.getView().getModel('oODataSvc'),
                oParameters,
                sPath,
                sEmailAddr,
                oEditEmailNNP = this.getView().getModel('oEditEmailNNP');
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            oEditEmailNNP.refresh(true);
            sEmailAddr = oEditEmailNNP.getProperty('/Email');

            sPath = '/EmailVerifys' + '(\'' + sEmailAddr + '\')';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        oEmailValidate.setData(oData);

                    }
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this),
                error: function (oError) {
                    sap.ui.commons.MessageBox.alert("Email Validate Service Error");
                    ute.ui.main.Popup.Alert({
                        title: 'Email address validation',
                        message: 'Email Validate Service Error'
                    });
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }

        };

        Controller.prototype._onEditEmailSave = function (oEvent) {
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oEditEmailNNP').getProperty('/PartnerID'),
                sBpEmail = this.getView().getModel('oEditEmailNNP').getProperty('/Email'),
                sBpEmailConsum = this.getView().getModel('oEditEmailNNP').getProperty('/EmailConsum'),
                oNNP = this.getView().getModel('oEditEmailNNP'),
                bEmailChanged = true;
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            if (sBpEmail === this.getView().getModel('oDtaVrfyBP').getProperty('/Email')) {
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
                            message: oNNP.getProperty('/LdapMessage')
                        });
                    } else {
                        ute.ui.main.Popup.Alert({
                            title: 'Email save',
                            message: 'Marketing Preference Updated Successfully'
                        });
                    }
                    this._oEmailEditPopup.close();
                    this._initDtaVrfRetr();
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Email save',
                        message: 'Update Failed'
                    });
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.update(sPath, oNNP.oData, oParameters);
            }
        };

        Controller.prototype._onEditEmailDelete = function (oEvent) {
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters,
                sBpNum = this.getView().getModel('oEditEmailNNP').getProperty('/PartnerID'),
                //sBpEmailConsum = this.getView().getModel('oDtaVrfyBP').getProperty('/EmailConsum');
                oNNP = this.getView().getModel('oEditEmailNNP');

            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            //oNNP.setProperty('/Email', '');
            sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'\'' + ',EmailConsum=\'\')';


            oParameters = {
                success : function (oData) {
                    // The following msg need to pull from the backend instead of hardcoding.
/*                    sap.ui.commons.MessageBox.alert("CONFIRMATION NEEDED: I just want to make sure you're aware that deleting email address will remove you from any Internet-based services we offer, including Online Account Management, online bill payment and Paperless Billing, and that all your bills and accounts notices will be sent via regular mail. Are you sure you want to do this? ");*/
                    this._oEmailEditPopup.close();
                    this._initDtaVrfRetr();
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this),
                error: function (oError) {
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    this._oEmailEditPopup.close();
                    ute.ui.main.Popup.Alert({
                        title: 'Email delete',
                        message: 'Update Failed'
                    });
                }.bind(this)
            };

            if ((oNNP.getProperty('/Ecd') === 'Y') || (oNNP.getProperty('/Mkt') === 'Y') || (oNNP.getProperty('/Offer') === 'Y') || (oNNP.getProperty('/Ee') === 'Y')) {
                this.getOwnerComponent().getCcuxApp().setOccupied(false);
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
        /*************************************************************************************************************/
        /*Email Edit NNP logic*/
        Controller.prototype._formatEmailAddressText = function (sEmail) {
            if ((sEmail === '') || (sEmail === undefined)) {
                return '';
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
            var oEmailBox = sap.ui.core.Fragment.byId("EmailEditPopup", "idnrgDB-EmailBox"),
                oDelEmailBox = sap.ui.core.Fragment.byId("EmailEditPopup", "idnrgDB-DelEmailBox"),
                oNNP = this.getView().getModel('oEditEmailNNP');
            if ((oNNP.getProperty('/Ecd') === 'Y') || (oNNP.getProperty('/Mkt') === 'Y') || (oNNP.getProperty('/Offer') === 'Y') || (oNNP.getProperty('/Ee') === 'Y')) {
                this.getOwnerComponent().getCcuxApp().setOccupied(false);
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
            var oEmailBox = sap.ui.core.Fragment.byId("EmailEditPopup", "idnrgDB-EmailBox"),
                oDelEmailBox = sap.ui.core.Fragment.byId("EmailEditPopup", "idnrgDB-DelEmailBox"),
                sPath,
                oModel = this.getView().getModel('oODataSvc'),
                oParameters,
                sBpNum = this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID'),
                sBpEmail = this.getView().getModel('oDtaVrfyBP').getProperty('/Email'),
                sBpEmailConsum = this.getView().getModel('oDtaVrfyBP').getProperty('/EmailConsum');
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            //Start loading NNP logics and settings
            sPath = '/EmailNNPs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',Email=\'' + sBpEmail + '\'' + ',EmailConsum=\'' + sBpEmailConsum + '\')';
            oParameters = {
                /*urlParameters: {"$expand": "Buags"},*/
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oEditEmailNNP').setData(oData);
                        this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    }
                }.bind(this),
                error: function (oError) {
                    ute.ui.main.Popup.Alert({
                        title: 'Email cancel',
                        message: 'NNP Entity Service Error'
                    });
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
            oEmailBox.setVisible(true);
            oDelEmailBox.setVisible(false);
        };







        /*----------------------------------------------- Initial & Start Up ------------------------------------------------*/

        Controller.prototype._initDtaVrfRetr = function () {
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo(),
                sBpNum = oRouteInfo.parameters.bpNum,
                sCaNum = oRouteInfo.parameters.caNum,
                sPath = '/Partners' + '(\'' + sBpNum + '\')';

            this._retrDataVrf(sPath);
        };

        Controller.prototype._retrDataVrf = function (sPath) {

            var oModel = this.getView().getModel('oODataSvc'),
                bCaRetrieveComplete = false,
                bCoRetrieveComplate = false,
                bCurrentCaNumRetrieveComplete = false,
                sCurrentCaNumber,
                oParameters,
                checkCaRetrComplete,
                checkCurCaRetrComplete;

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        // Determine if Seibel Customer
                        if (oData.SiebelCustomer === 'X' || oData.SiebelCustomer === 'x') {this._showSiebelAlert(); }
                        // Determine the SMS button
                        if (oData.Cell) {this.getView().getModel('oCfrmStatus').setProperty('/ShowSMSBtn', true); }
                        // Load the BP info
                        this.getView().getModel('oDtaVrfyBP').setData(oData);
                        // Determine if BP is residentail or organization
                        if (oData.PartnerType === '1') {
                            this.getView().getModel('oDtaVrfyBP').setProperty('/OrgBP', false);
                            this.getView().getModel('oDtaVrfyBP').setProperty('/PsnBP', true);
                        } else {
                            this.getView().getModel('oDtaVrfyBP').setProperty('/OrgBP', true);
                            this.getView().getModel('oDtaVrfyBP').setProperty('/PsnBP', false);
                        }
                        // 1. Retrieve all CA belong to the BP
                        if (oData.PartnerID) {this._retrAllCa(oData.PartnerID, function () {bCaRetrieveComplete = true; }); }
                        // Check the completion of CA retrieval
                        checkCaRetrComplete = setInterval(function () {
                            if (bCaRetrieveComplete) {
                                // 2. Get the current selected CA number
                                sCurrentCaNumber = this._getCurrentCaNum(function () {bCurrentCaNumRetrieveComplete = true; });
                                clearInterval(checkCaRetrComplete);
                            }
                        }.bind(this), 100);
                        // Check the completion of current CA number retrieval
                        checkCurCaRetrComplete = setInterval(function () {
                            if (bCurrentCaNumRetrieveComplete) {
                                // 3. Load the current selected CA info
                                this._setCurrentCa(sCurrentCaNumber);
                                // 4. Retrieve all CO belong to the selected CA
                                this._retrAllCo(sCurrentCaNumber, function () {bCoRetrieveComplate = true; });
                                clearInterval(checkCurCaRetrComplete);
                            }
                        }.bind(this), 100);
                        // Check the completion of CO retrieval
                        var checkCoRetrComplete = setInterval(function () {
                            if (bCoRetrieveComplate) {
                                // Confirm with WebUI and CCUX
                                this._routeInfoConfirm();
                                // Update the linkability of METER lable
                                this._updateUsageLink();
                                clearInterval(checkCoRetrComplete);
                            }
                        }.bind(this), 100);
                    }
                }.bind(this),
                error: function (oError) {
                    
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._showSiebelAlert = function () {
            // Label the Siebel Customer
            this._bSiebelCustomer = true;
            // Disable the edit function
            this.getView().getModel('oCfrmStatus').setProperty('/bEditable', false);
            // Hide the buttons
            this.getView().byId('id_confmBtn').setVisible(false);
            this.getView().byId('id_updtBtn').setVisible(false);
            // Display the alert
            ute.ui.main.Popup.Alert({
                title: 'Siebel Contracted Account',
                message: 'This is a Siebel Contracted account. Connect the caller to the CI Account Management Team for all account inquiries during their business hours of 7:30 AM to 5:30 PM, Monday through Friday (except holidays). After Hours: For service outages and Other Service Order requests, follow the defined process. For all other call types provide the customer with the CI Account Management Team’s toll free number and ask the customer to call back during business hours.'
            });
        };





        /*---------------------------------------------- Retrieve Information -----------------------------------------------*/

        Controller.prototype._retrAllCa = function (sBpNum, fnCallback) {
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo(),
                sCaNum = oRouteInfo.parameters.caNum,
                oModel = this.getView().getModel('oODataSvc'),
                sPath = '/Partners' + '(\'' + sBpNum + '\')/Buags/',
                oParameters,
                iSearchedCaIndex = 0,
                eventBus = sap.ui.getCore().getEventBus(),
                i;

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        // Set select key for all CAs for CA dropdown
                        for (i = 0; i < oData.results.length; i = i + 1) {
                            oData.results[i].iIndex = i.toString();
                            if (oData.results[i].ContractAccountID === sCaNum) { iSearchedCaIndex = i; }
                        }
                        // Load all the CAs for CA dropdown
                        this.getView().getModel('oAllBuags').setData(oData.results);
                        this.getView().getModel('oAllBuags').setProperty('/selectedKey', iSearchedCaIndex);
                        // Check and execute the callback function
                        if (fnCallback) { fnCallback(); }
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._getCurrentCaNum = function (fnCallback) {
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo(),
                sCaNum = oRouteInfo.parameters.caNum,
                sCurrentCaNumber,
                oAllCaModel = this.getView().getModel('oAllBuags');

            if (sCaNum) {
                // If CA number is found in the routing then we return this
                sCurrentCaNumber = sCaNum;
            } else {
                // Else, we will return the first CA from the list
                sCurrentCaNumber = oAllCaModel.oData[0].ContractAccountID;
            }

            if (fnCallback) { fnCallback(); }

            return sCurrentCaNumber;
        };

        Controller.prototype._setCurrentCa = function (sCaNum) {
            var oAllCaModel = this.getView().getModel('oAllBuags'),
                i;

            for (i = 0; i < oAllCaModel.oData.length; i = i + 1) {
                if (oAllCaModel.oData[i].ContractAccountID === sCaNum) {
                    // Load as default to display
                    this.getView().getModel('oDtaVrfyBuags').setData(oAllCaModel.oData[i]);
                    // Retrieve the Mailing Address for the selected CA
                    this._retrCaMailingAddr(
                        this.getView().getModel('oDtaVrfyBuags').getProperty('/PartnerID'),
                        this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                        this.getView().getModel('oDtaVrfyBuags').getProperty('/FixedAddressID')
                    );
                }
            }
        };

        Controller.prototype._retrAllCo = function (sCaNum, fnCallback) {
            var oModel = this.getView().getModel('oODataSvc'),
                oPageModel = this.getView().getModel('oCoPageModel'),
                oPage,
                sPath,
                oParameters;

            sPath = '/Buags' + '(\'' + sCaNum + '\')/Contracts/';
            oParameters = {
                success : function (oData) {
                    if (oData) {
                        // Load the first CO to display
                        if (oData.results[0]) {
                            this.getView().getModel('oDtaVrfyContract').setData(oData.results[0]);
                            // Publish the CO Change event to event bus
                            this._onCoChange(oData.results[0]);
                        }
                        // Reset the CO pagination
                        this._initCoPageModel();
                        // Set up the CO pagination
                        this._setUpCoPageModel(oData.results.length, oData.results);
                        // Refresh the CO dropdown
                        this.getView().getModel('oAllContractsofBuag').setData(oData.results);
                        this.getView().getModel('oAllContractsofBuag').setProperty('/selectedKey', '0');
                        // Check and execute the callback function
                        if (fnCallback) { fnCallback(); }
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._initCoPageModel = function () {
            var oPageModel = this.getView().getModel('oCoPageModel'),
                page = [],
                oTemp,
                i;

            for (i = 0; i < 3; i = i + 1) {
                oTemp = {exist: false, con_ind: 0, index: i};
                page.push(oTemp);
            }
            oPageModel.setProperty('/threeLarger', false);
            oPageModel.setProperty('/paging', page);
        };

        Controller.prototype._setUpCoPageModel = function (iPageNumber, aReturnedCo) {
            var oPageModel = this.getView().getModel('oCoPageModel'),
                oPage = oPageModel.getProperty('/paging'),
                i;

            for (i = 0; i < iPageNumber; i = i + 1) {
                aReturnedCo[i].iIndex = i.toString();
                if (i < 3) {
                    oPage[i].exist = true;
                    oPage[i].co_ind = i + 1;
                    oPageModel.setProperty('/threeLarger', false);
                } else {
                    oPageModel.setProperty('/threeLarger', true);
                }
            }
            oPageModel.setProperty('/paging', oPage);
        };

        /*----------------------------------------------- CCUX Level Methods ------------------------------------------------*/

        Controller.prototype._routeInfoConfirm = function () {
            var sCurrentBp = this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID'),
                sCurrentCa = this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                sCurrentCo = this.getView().getModel('oDtaVrfyContract').getProperty('/ContractID'),
                oComponent = this.getOwnerComponent(),
                oWebUiManager = oComponent.getCcuxWebUiManager(),
                iCompleteCheck = 0,
                checkComplete,
                eventBus = sap.ui.getCore().getEventBus();

            // Update WebUI
            if (oWebUiManager.isAvailable()) {
                this._updateWebUI(sCurrentBp, sCurrentCa, sCurrentCo, function () {
                    iCompleteCheck += 1;
                }, this);
            } else {
                iCompleteCheck += 1;
            }

            // Update CCUX
            this._updateCcux(sCurrentBp, sCurrentCa, sCurrentCo, function () {
                iCompleteCheck += 1;
            });

            // Check the completion of WebUI & CCUX update
            checkComplete = setInterval(function () {
                if (iCompleteCheck === 2) {
                    clearInterval(checkComplete);
                    // Inform customer journey
                    eventBus.publish("nrg.module.dashoard", "eAfterConfirmed", {bpNum: sCurrentBp, caNum: sCurrentCa, coNum: sCurrentCo});
                    // Update Footer
                    oComponent.getCcuxApp().updateFooter(sCurrentBp, sCurrentCa, sCurrentCo);
                }
            }, 100);

        };

        // Notify WebUI service about the current BP, CA and CO.
        Controller.prototype._updateWebUI = function (sCurrentBp, sCurrentCa, sCurrentCo, fnCallback, oListener) {
            var oComponent = this.getOwnerComponent(),
                oWebUiManager = oComponent.getCcuxWebUiManager();

            oWebUiManager.notifyWebUi('caConfirmed', {
                BP_NUM: sCurrentBp,
                CA_NUM: sCurrentCa,
                CO_NUM: sCurrentCo
            }, fnCallback, oListener);
        };

        // Update CCUX about the current BP, CA and CO.
        Controller.prototype._updateCcux = function (sCurrentBp, sCurrentCa, sCurrentCo, fnCallback) {
            var oComponentContextModel = this.getOwnerComponent().getCcuxContextManager().getContext();

            //Set Confirmed CaNum and CoNum to Component level
            oComponentContextModel.setProperty('/bpNum', sCurrentBp);
            oComponentContextModel.setProperty('/caNum', sCurrentCa);
            oComponentContextModel.setProperty('/coNum', sCurrentCo);

            // Update Footer
            this.getOwnerComponent().getCcuxApp().updateFooter(sCurrentBp, sCurrentCa, sCurrentCo);

            fnCallback();
        };





        /*------------------------------------------- UI Style Class Manipulation -------------------------------------------*/

        // If BP, CA and CO are available, then make the "METER. #" label a link to Usage Page.
        Controller.prototype._updateUsageLink = function () {
            var sCurrentBp = this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID'),
                sCurrentCa = this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                sCurrentCo = this.getView().getModel('oDtaVrfyContract').getProperty('/ContractID');

            if (sCurrentBp && sCurrentCa && sCurrentCo) {
                this.getView().byId('nrgDashboard-cusDataVerify-left-usageLink').attachBrowserEvent('click', this._onMeterClick.bind(this));
                this.getView().byId('nrgDashboard-cusDataVerify-left-usageLink').addStyleClass('active');
            } else {
                this.getView().byId('nrgDashboard-cusDataVerify-left-usageLink').detachBrowserEvent('click');
                this.getView().byId('nrgDashboard-cusDataVerify-left-usageLink').removeStyleClass('active');
            }
        };






        /*------------------------------------------------ UI Element Actions -----------------------------------------------*/

        /**********************************************/
        /************** CA Dropdown Select ************/
        /**********************************************/

        Controller.prototype._onCaSelect = function (oEvent) {
            var sSelectedKey = oEvent.getParameters().selectedKey,
                iSelectedIndex = parseInt(sSelectedKey, 10),
                coRetrieveComplete = false,
                checkComplete;

            // Load the selected CA info
            this.getView().getModel('oDtaVrfyBuags').setData(this.getView().getModel('oAllBuags').oData[iSelectedIndex]);

            // Publish the CA Change event to event bus
            this._onCaChange(iSelectedIndex);

            // Retrieve the Mailing Address for the selected CA
            this._retrCaMailingAddr(
                this.getView().getModel('oDtaVrfyBuags').getProperty('/PartnerID'),
                this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                this.getView().getModel('oDtaVrfyBuags').getProperty('/FixedAddressID')
            );

            // Trigger contracts refresh
            this._retrAllCo(
                this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                function () {coRetrieveComplete = true; }
            );

            // Check the completion of CO retrieval
            checkComplete = setInterval(function () {
                if (coRetrieveComplete) {
                    // Confirm with WebUI and CCUX
                    this._routeInfoConfirm();
                    // Update the linkability of METER lable
                    this._updateUsageLink();
                    clearInterval(checkComplete);
                }
            }.bind(this), 100);
        };

        Controller.prototype._onCaChange = function (iNewBuagIndex) {
            var eventBus = sap.ui.getCore().getEventBus(),
                oPayload = {iIndex: iNewBuagIndex};

            eventBus.publish("nrg.module.dashoard", "eBuagChanged", oPayload);
        };

        Controller.prototype._retrCaMailingAddr = function (sBpNum, sCaNum, sFixedAddressID) {
            var oModel = this.getView().getModel('oODataSvc'),
                sPath,
                oParameters;

            sPath = '/BuagMailingAddrs' + '(' + 'PartnerID=\'' + sBpNum + '\'' + ',ContractAccountID=\'' + sCaNum + '\'' + ',FixedAddressID=\'' + sFixedAddressID + '\')';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oDtaVrfyMailingTempAddr').setData(oData);
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        /**********************************************/
        /************** CO Dropdown Select ************/
        /**********************************************/

        Controller.prototype._onCoSelect = function (oEvent) {
            var sSelectedKey = oEvent.getParameters().selectedKey,
                iSelectedIndex = parseInt(sSelectedKey, 10);

            // Load the selected CO info
            this.getView().getModel('oDtaVrfyContract').setData(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);

            // Update the CO pagination
            this._refreshPaging();

            // Publish the CO Change event to event bus
            this._onCoChange(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);

            // Confirm with WebUI and CCUX
            this._routeInfoConfirm();

            // Update the linkability of METER lable
            this._updateUsageLink();
        };

        Controller.prototype._onCoChange = function (oCoInfo) {
            var eventBus = sap.ui.getCore().getEventBus(),
                oPayload = {coInfo: oCoInfo};

            eventBus.publish("nrg.module.dashoard", "eCoChanged", oPayload);
        };

        /**********************************************/
        /************* Confirm Btn Clicked ************/
        /**********************************************/

        // We now take care of the update to WebUI & CCUX automatically,
        // so only lead users to Billing Info page when this button clicked.
        Controller.prototype._onGoToBillingInfo = function () {
            var oRouteInfo = this.getOwnerComponent().getCcuxContextManager().getContext().oData,
                oRouter = this.getOwnerComponent().getRouter(),
                badgeSS = this.getView().getModel('oDtaVrfyBuags').getProperty('/BadgeSS'),
                isPrepaidUser = false;

            // Determine if it is Prepaid User
            if (badgeSS === 'x' || badgeSS === 'X') {
                isPrepaidUser = true;
            }

            // Navigate to Billing page
            if (isPrepaidUser) {
                if (oRouteInfo.coNum) {
                    oRouter.navTo('billing.BillingPrePaid', {bpNum: oRouteInfo.bpNum, caNum: oRouteInfo.caNum, coNum: oRouteInfo.coNum});
                } else {
                    oRouter.navTo('billing.BillingPrePaidNoCo', {bpNum: oRouteInfo.bpNum, caNum: oRouteInfo.caNum});
                }
            } else {
                if (oRouteInfo.coNum) {
                    oRouter.navTo('billing.BillingInfo', {bpNum: oRouteInfo.bpNum, caNum: oRouteInfo.caNum, coNum: oRouteInfo.coNum});
                } else {
                    oRouter.navTo('billing.BillingInfoNoCo', {bpNum: oRouteInfo.bpNum, caNum: oRouteInfo.caNum});
                }
            }
        };

        /**********************************************/
        /************* METER Label Clicked ************/
        /**********************************************/

        Controller.prototype._onMeterClick = function () {
            var oRouter = this.getOwnerComponent().getRouter(),
                sCurrentBp = this.getView().getModel('oDtaVrfyBP').getProperty('/PartnerID'),
                sCurrentCa = this.getView().getModel('oDtaVrfyBuags').getProperty('/ContractAccountID'),
                sCurrentCo = this.getView().getModel('oDtaVrfyContract').getProperty('/ContractID');

            oRouter.navTo('usage', {bpNum: sCurrentBp, caNum: sCurrentCa, coNum: sCurrentCo, typeV: 'D'});
        };

        /*---------------------------------------------- CO Pagination Handlers ---------------------------------------------*/

        Controller.prototype._onConFirst = function () {
            var oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSelectedIndex = 0;

            this.getView().getModel('oDtaVrfyContract').setData(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);
            //delete this.getView().getModel('oDtaVrfyContract').oData.iIndex;
            oContracts.setProperty('/selectedKey', iSelectedIndex.toString());
            this._refreshPaging();

        };
        Controller.prototype._onConLeft = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSel_Ind = parseInt(oContracts.getProperty('/selectedKey'), 10) - 1;  //Selected is the new selected index

            if (iSel_Ind > -1) {
                this.getView().getModel('oDtaVrfyContract').setData(oContracts.oData[iSel_Ind]);
                //delete this.getView().getModel('oDtaVrfyContract').oData.iIndex;

                oContracts.setProperty('/selectedKey', iSel_Ind.toString());
                this._refreshPaging();
            } else {
                return; //do nothing if it's invalid
            }
        };
        Controller.prototype._onConPone = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSelectedIndex = oPage[0].co_ind - 1;

            this.getView().getModel('oDtaVrfyContract').setData(oContracts.oData[iSelectedIndex]);
            // Publish the CO Change event to event bus
            this._onCoChange(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);

            oContracts.setProperty('/selectedKey', iSelectedIndex.toString());
            this._refreshPaging();
        };
        Controller.prototype._onConPtwo = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSelectedIndex = oPage[1].co_ind - 1,
                i;

            this.getView().getModel('oDtaVrfyContract').setData(oContracts.oData[iSelectedIndex]);
            // Publish the CO Change event to event bus
            this._onCoChange(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);

            oContracts.setProperty('/selectedKey', iSelectedIndex.toString());
            this._refreshPaging();
        };
        Controller.prototype._onConPthree = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSelectedIndex = oPage[2].co_ind - 1;

            this.getView().getModel('oDtaVrfyContract').setData(oContracts.oData[iSelectedIndex]);
            // Publish the CO Change event to event bus
            this._onCoChange(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);

            oContracts.setProperty('/selectedKey', iSelectedIndex.toString());
            this._refreshPaging();
        };
        Controller.prototype._onConRite = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSel_Ind = parseInt(oContracts.getProperty('/selectedKey'), 10) + 1;  //Selected is the new selected index


            if (iSel_Ind < oContracts.oData.length) {
                this.getView().getModel('oDtaVrfyContract').setData(oContracts.oData[iSel_Ind]);
                //delete this.getView().getModel('oDtaVrfyContract').oData.iIndex;

                oContracts.setProperty('/selectedKey', iSel_Ind.toString());
                this._refreshPaging();
            } else {
                return; //do nothing if it's invalid
            }
        };
        Controller.prototype._onConLast = function () {
            var oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSelectedIndex = oContracts.oData.length - 1;

            this.getView().getModel('oDtaVrfyContract').setData(this.getView().getModel('oAllContractsofBuag').oData[iSelectedIndex]);
            //delete this.getView().getModel('oDtaVrfyContract').oData.iIndex;

            oContracts.setProperty('/selectedKey', iSelectedIndex.toString());
            this._refreshPaging();
        };

        Controller.prototype._refreshPaging = function () {
            var oPage = this.getView().getModel('oCoPageModel').getProperty('/paging'),
                oContracts = this.getView().getModel('oAllContractsofBuag'),
                iSel_Ind = parseInt(oContracts.getProperty('/selectedKey'), 10),
                i;

            if (iSel_Ind === 0 || oContracts.oData.length === 2) {
                for (i = 0; i < 3; i = i + 1) {
                    oPage[i].co_ind = i + 1;
                }
            } else if (iSel_Ind === (oContracts.oData.length - 1)) {
                for (i = 0; i < 3; i = i + 1) {
                    oPage[i].co_ind = iSel_Ind + 1 - 2 + i;
                }
            } else {
                for (i = 0; i < 3; i = i + 1) {
                    oPage[i].co_ind = iSel_Ind + i;
                }
            }

            this.getView().getModel('oCoPageModel').setProperty('/paging', oPage);
        };

        Controller.prototype._navToSvcOdr = function () {
            var oRouteInfo = this.getOwnerComponent().getCcuxContextManager().getContext().oData,
                oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo('dashboard.ServiceOrder', {bpNum: oRouteInfo.bpNum, caNum: oRouteInfo.caNum, coNum: oRouteInfo.coNum});

        };















        return Controller;
    }
);
