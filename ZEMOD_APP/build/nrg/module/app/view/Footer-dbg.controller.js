/*globals sap*/
/*globals ute*/
/*jslint nomen:true*/

sap.ui.define(
    [
        'nrg/base/view/BaseController',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'nrg/module/nnp/view/NNPPopup',
        'jquery.sap.global'
    ],

    function (CoreController, Filter, FilterOperator, NNPPopup, jQuery) {
        'use strict';

        var Controller = CoreController.extend('nrg.module.app.view.Footer', {
            constructor: function () {
                this.bFirstTimeRender = true;
            }
        });

        /*---------------------------------------------- Controller Life Cycle ----------------------------------------------*/

        Controller.prototype.onInit = function () {

        };

        Controller.prototype.onBeforeRendering = function () {
            // Initialize models
            this.getView().setModel(this.getView().getModel('main-app'), 'oMainODataSvc');
            this.getView().setModel(this.getView().getModel('noti-app'), 'oNotiODataSvc');
            this.getView().setModel(this.getView().getModel('rhs-app'), 'oRHSODataSvc');
            this.getView().setModel(this.getView().getModel('comp-app'), 'oCompODataSvc');
            this.getView().setModel(this.getView().getModel('elig-app'), 'oDataEligSvc');

            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oFooterNotification');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oFooterRHS');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oFooterCampaign');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oFooterRouting');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oFooterBpInfo');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oBpInfo');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEligibility');

            // Get the routing info
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo();
            this._updateRouting(oRouteInfo.parameters.bpNum, oRouteInfo.parameters.caNum, oRouteInfo.parameters.coNum);

            // Subscribe to the update events
            if (this.bFirstTimeRender) {
                this.bFirstTimeRender = false;
                sap.ui.getCore().getEventBus().subscribe("nrg.module.appFooter", "eUpdateFooter", this.updateFooter, this);
                sap.ui.getCore().getEventBus().subscribe("nrg.module.appFooter", "eUpdateNotification", this.updateFooterNotification, this);
                sap.ui.getCore().getEventBus().subscribe("nrg.module.appFooter", "eUpdateRhs", this.updateFooterRhs, this);
                sap.ui.getCore().getEventBus().subscribe("nrg.module.appFooter", "eUpdateCampaign", this.updateFooterCampaign, this);
            }
        };

        Controller.prototype.onAfterRendering = function () {
            // Handle footer caret click event
            this.getView().byId('nrgAppMain-footerCaret').detachBrowserEvent('click', this.footerCaretClick, this);
            this.getView().byId('nrgAppMain-footerCaret').attachBrowserEvent('click', this.footerCaretClick, this);
            
            // Initialize footer UI blocks
            this.initUiBlocks();
        };

        /*-------------------------------------------------- Data Retrieve --------------------------------------------------*/

        Controller.prototype._updateRouting = function (sBpNumber, sCaNumber, sCoNumber) {
            var oRouting = this.getView().getModel('oFooterRouting');
            oRouting.setProperty('/BpNumber', sBpNumber);
            oRouting.setProperty('/CaNumber', sCaNumber);
            oRouting.setProperty('/CoNumber', sCoNumber);
        };

        Controller.prototype._retrieveBpInfo = function (sBpNum, fnCallback) {
            var oModel = this.getView().getModel('oMainODataSvc'),
                oBpInfoModel = this.getView().getModel('oBpInfo'),
                sPath = '/Partners' + '(\'' + sBpNum + '\')',
                oParameters;

            oParameters = {
                success : function (oData) {
                    oBpInfoModel.setData(oData);
                    if (fnCallback) { fnCallback(); }
                }.bind(this),
                error: function (oError) {
                    // Handle error
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._retrieveEligibility = function (fnSuccess, fnFail) {
            var oRouting = this.getView().getModel('oFooterRouting'),
                sPath = '/EligCheckS(\'' + oRouting.oData.CoNumber + '\')',
                oModel = this.getView().getModel('oDataEligSvc'),
                oEligModel = this.getView().getModel('oEligibility'),
                oParameters;

            oParameters = {
                success : function (oData) {
                    oEligModel.setData(oData);
                    if (fnSuccess) fnSuccess();
                }.bind(this),
                error: function (oError) {
                    if (fnFail) fnFail();
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        /*--------------------------------------------------- UI Handling ---------------------------------------------------*/

        Controller.prototype.footerCaretClick = function () {
            if (this.getView().byId('nrgAppMain-footerWrap').hasStyleClass('open')) {
                // Hide footer
                this.getView().byId('nrgAppMain-footerWrap').removeStyleClass('open');
                $('.uteAppBodyCnt-footer').css('border-bottom', '6px solid #FFF');
            } else {
                // Show footer
                this.getView().byId('nrgAppMain-footerWrap').addStyleClass('open');
                $('.uteAppBodyCnt-footer').css('border-bottom', 'none');
            }
        };

        Controller.prototype.initUiBlocks = function () {
            this.footerElement = {};

            // Notification
            this.footerElement.notiEmptySec = this.getView().byId('nrgAppFtrDetails-notification-emptySection');
            this.footerElement.notiAlertSec = this.getView().byId('nrgAppFtrDetails-notification-alertSection');
            this.footerElement.notiEmptySec.setVisible(true);
            this.footerElement.notiAlertSec.setVisible(false);

            // RHS
            this.footerElement.rhsEmptySec = this.getView().byId('nrgAppFtrDetails-rhs-emptySection');
            this.footerElement.rhsProdSec = this.getView().byId('nrgAppFtrDetails-rhs-productSection');
            this.footerElement.rhsEmptySec.setVisible(true);
            this.footerElement.rhsProdSec.setVisible(false);

            // Campaign
            this.footerElement.campEmptySec = this.getView().byId('nrgAppFtrDetails-eligibleOffers-emptySection');
            this.footerElement.campOfferSec = this.getView().byId('nrgAppFtrDetails-eligibleOffers');
            this.footerElement.campBtnSec = this.getView().byId('nrgAppFtrDetails-campaignButton');
            this.footerElement.campEmptySec.setVisible(true);
            this.footerElement.campOfferSec.setVisible(false);
            this.footerElement.campBtnSec.setVisible(false);
        };

        Controller.prototype.onContactLog = function (oControlEvent) {
            var oWebUiManager = this.getOwnerComponent().getCcuxWebUiManager();
            oWebUiManager.notifyWebUi('openIndex', {
                LINK_ID: "Z_CLFULLVW"
            });
        };

        Controller.prototype.onCreateLog = function (oControlEvent) {
            var oWebUiManager = this.getOwnerComponent().getCcuxWebUiManager();
            oWebUiManager.notifyWebUi('openIndex', {
                LINK_ID: "Z_CLOG_CRE"
            });
        };

        /*-------------------------------------------------- Update Footer --------------------------------------------------*/

        Controller.prototype.updateFooter = function (channel, event, data) {
            this.updateFooterNotification(channel, event, data);
            this.updateFooterRhs(channel, event, data);
            this.updateFooterCampaign(channel, event, data);
        };

        /*--------------------------- Notification ---------------------------*/

        Controller.prototype.updateFooterNotification = function (channel, event, data) {
            var oModel = this.getView().getModel('oNotiODataSvc'),
                sPath = '/AlertsSet',
                aFilters = [],
                oParameters,
                i;

            // If there's no BP & CA number, then do nothing
            if (!data.bpNum || !data.caNum) { return; }
            
            // Update footer local routing
            this._updateRouting(data.bpNum, data.caNum, data.coNum);

            // Set up filters
            aFilters.push(new Filter({ path: 'BP', operator: FilterOperator.EQ, value1: data.bpNum}));
            aFilters.push(new Filter({ path: 'CA', operator: FilterOperator.EQ, value1: data.caNum}));
            aFilters.push(new Filter({ path: 'Identifier', operator: FilterOperator.EQ, value1: 'FOOTER'}));

            oParameters = {
                filters: aFilters,
                success : function (oData) {
                    if (oData.results.length) {                        
                        this.getView().getModel('oFooterNotification').setData(oData.results);
                        this.notificationLinkPressActions = {};
                        for (i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].FilterType === 'M2M') { this.notificationLinkPressActions[oData.results[i].MessageText] = this._onM2mLinkPress.bind(this); }
                            if (oData.results[i].FilterType === 'SMTP') { this.notificationLinkPressActions[oData.results[i].MessageText] = this._onSmtpLinkPress.bind(this); }
                            if (oData.results[i].FilterType === 'MAIL') { this.notificationLinkPressActions[oData.results[i].MessageText] = this._onMailLinkPress.bind(this); }
                            if (oData.results[i].FilterType === 'SMS') { this.notificationLinkPressActions[oData.results[i].MessageText] = this._onSmsLinkPress.bind(this); }
                            if (oData.results[i].FilterType === 'OAM') { this.notificationLinkPressActions[oData.results[i].MessageText] = this._onOamLinkPress.bind(this); }
                        }
                        this.footerElement.notiEmptySec.setVisible(false);
                        this.footerElement.notiAlertSec.setVisible(true);
                    } else {
                        this.footerElement.notiEmptySec.setVisible(true);
                        this.footerElement.notiAlertSec.setVisible(false);
                    }
                }.bind(this),
                error: function (oError) {
                    this.footerElement.notiEmptySec.setVisible(true);
                    this.footerElement.notiAlertSec.setVisible(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        /*-------------------------------- RHS -------------------------------*/

        Controller.prototype.updateFooterRhs = function (channel, event, data) {
            var sPath = '/FooterS',
                aFilters = [],
                oModel = this.getView().getModel('oRHSODataSvc'),
                oParameters,
                bCurrentFlag = false,
                bPendingFlag = false,
                bHistoryFlag = false;

            // If there's no BP & CA number, then do nothing
            if (!data.bpNum || !data.caNum) { return; }
            
            // Update footer local routing
            this._updateRouting(data.bpNum, data.caNum, data.coNum);

            // Set up filters
            aFilters.push(new Filter({ path: 'BP', operator: FilterOperator.EQ, value1: data.bpNum}));
            aFilters.push(new Filter({ path: 'CA', operator: FilterOperator.EQ, value1: data.caNum}));

            oParameters = {
                filters: aFilters,
                success : function (oData) {
                    var oRhsModel = this.getView().getModel('oFooterRHS'),
                        iCurrentIndex = 0,
                        aCurrent = [],
                        dropdownContainer = this.getView().byId("nrgAppFtrDetails-rhs-currentItem"),
                        i, j,
                        oTag;

                    if (oData.results.length > 0) {                        
                        // Get all objects for Current and generate a dropdwon
                        for (i = 0; i < oData.results.length; i = i + 1) {
                            if (oData.results[i].Type === 'C') {
                                bCurrentFlag = true;
                                oData.results[i].key = iCurrentIndex = iCurrentIndex + 1;
                                aCurrent.push(oData.results[i]);
                            }
                        }
                        oRhsModel.setProperty('/DropdownVis', bCurrentFlag);
                        oRhsModel.setProperty('/NoneVis', !bCurrentFlag);
                        oRhsModel.setProperty('/Current', aCurrent);
                        oRhsModel.setProperty('/DropdownDefautKey', 1);
                        
                        // Listen to click event to handle the UI change when dropdown list is open
                        this.getView().byId('nrgAppFtrDetails-rhs-currentDropdown').attachBrowserEvent("click", this._onRhsCurrenDropdownClick.bind(this));

                        for (j = 0; j < oData.results.length; j = j + 1) {
                            // Get first object for Pending
                            if (oData.results[j].Type === 'P') {
                                bPendingFlag = true;
                                this.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText(oData.results[j].ProdName);
                            }
                            // Get first object for History
                            if (oData.results[j].Type === 'H') {
                                bHistoryFlag = true;
                                this.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText(oData.results[j].ProdName);
                            }
                        }

                        if (bCurrentFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-currentItemContent").setText('None'); }
                        if (bPendingFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText('None'); }
                        if (bHistoryFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText('None'); }

                        this.footerElement.rhsEmptySec.setVisible(false);
                        this.footerElement.rhsProdSec.setVisible(true);

                    } else {

                        if (bCurrentFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-currentItemContent").setText('None'); }
                        if (bPendingFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText('None'); }
                        if (bHistoryFlag === false) { this.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText('None'); }

                        oRhsModel.setProperty('/DropdownVis', false);
                        oRhsModel.setProperty('/NoneVis', true);

                        this.footerElement.rhsEmptySec.setVisible(false);
                        this.footerElement.rhsProdSec.setVisible(true);
                    }
                }.bind(this),
                error: function (oError) {
                    this.footerElement.rhsEmptySec.setVisible(true);
                    this.footerElement.rhsProdSec.setVisible(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._onRhsCurrenItemSelect = function (oControlEvent) {

        }.bind(this);

        Controller.prototype._onRhsCurrenDropdownClick = function (oControlEvent) {
            var rhsSection = $('.nrgAppFtrDetails-rhs');
            if (rhsSection.find('.uteMDd-picker').height() > 170) {
                if (rhsSection.hasClass('scrollBarAppear')) {
                    rhsSection.removeClass('scrollBarAppear');
                } else {
                    rhsSection.addClass('scrollBarAppear');
                }
            }
        };

        Controller.prototype._onRHS = function (oControlEvent) {
            var oWebUiManager = this.getOwnerComponent().getCcuxWebUiManager();
            oWebUiManager.notifyWebUi('openIndex', {
                LINK_ID: "ZVASOPTSLN"
            });
        };

        /*----------------------------- Campaign -----------------------------*/

        Controller.prototype.updateFooterCampaign = function (channel, event, data) {
            // Update footer local routing
            this._updateRouting(data.bpNum, data.caNum, data.coNum);
            // Update contract part
            this._updateFooterCampaignContract(data.coNum);
            // Update button part
            this._updateFooterCampaignButton(data.coNum);
        };

        Controller.prototype._updateFooterCampaignContract = function (sCoNumber) {
            var sPath = '/CpgFtrS',
                aFilters = [],
                oModel = this.getView().getModel('oCompODataSvc'),
                oParameters;
            
            // If there's no CO number, then do nothing
            if (!sCoNumber) { return; }

            // Set up filters
            aFilters.push(new Filter({ path: 'Contract', operator: FilterOperator.EQ, value1: sCoNumber}));

            oParameters = {
                filters: aFilters,
                success : function (oData) {
                    var oCampaignModel = this.getView().getModel('oFooterCampaign'), i;
                    if (oData.results.length > 0) {
                        for (i = 0; i < oData.results.length; i = i + 1) {
                            // Current
                            if (oData.results[i].Type === 'C') {
                                oCampaignModel.setProperty('/Current', oData.results[i]);
                                if (oCampaignModel.oData.Current.OfferTitle !== 'None' && oCampaignModel.oData.Current.OfferTitle !== '') {
                                    this.getView().byId('nrgAppFtrDetails-eligibleOffers-currentItem').addStyleClass('hasValue');
                                }
                            }
                            // Pending
                            if (oData.results[i].Type === 'PE') {
                                oCampaignModel.setProperty('/Pending', oData.results[i]);
                                if (oCampaignModel.oData.Pending.OfferTitle !== 'None' && oCampaignModel.oData.Pending.OfferTitle !== '') {
                                    this.getView().byId('nrgAppFtrDetails-eligibleOffers-pendingItem').addStyleClass('hasValue');
                                }
                            }
                            // History
                            if (oData.results[i].Type === 'H') {
                                oCampaignModel.setProperty('/History', oData.results[i]);
                                if (oCampaignModel.oData.History.OfferTitle !== 'None' && oCampaignModel.oData.History.OfferTitle !== '') {
                                    this.getView().byId('nrgAppFtrDetails-eligibleOffers-historyItem').addStyleClass('hasValue');
                                }
                            }
                        }
                        this.footerElement.campEmptySec.setVisible(false);
                        this.footerElement.campOfferSec.setVisible(true);
                        this.footerElement.campBtnSec.setVisible(true);
                    } else {
                        this.footerElement.campEmptySec.setVisible(true);
                        this.footerElement.campOfferSec.setVisible(false);
                        this.footerElement.campBtnSec.setVisible(false);
                    }
                }.bind(this),
                error: function (oError) {
                    this.footerElement.campEmptySec.setVisible(true);
                    this.footerElement.campOfferSec.setVisible(false);
                    this.footerElement.campBtnSec.setVisible(false);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._updateFooterCampaignButton = function (sCoNumber) {
            var sPath = '/ButtonS(\'' + sCoNumber + '\')',
                oModel = this.getView().getModel('oCompODataSvc'),
                oParameters;

            // If there's no CO number, then do nothing
            if (!sCoNumber) { return; }

            oParameters = {
                success : function (oData) {
                    var oCampaignModel = this.getView().getModel('oFooterCampaign');
                    if (oData.Contract) {
                        if (oData.InitTab) {
                            oCampaignModel.setProperty('/CampaignButtonText', 'Eligible offers Available');
                        } else {
                            oCampaignModel.setProperty('/CampaignButtonText', 'No Eligible offers Available');
                        }
                        oCampaignModel.setProperty('/CampaignFirstBill', oData.FirstBill);
                        oCampaignModel.setProperty('/CampaignButtonType', oData.InitTab);
                        oCampaignModel.setProperty('/CampaignButtonMoveOut', oData.PendMvo);
                    }
                }.bind(this),
                error: function (oError) {
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        Controller.prototype._formatCampaignTime = function (oDate) {
            if (oDate) {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "MM/yyyy"}),
                    dateStr = dateFormat.format(new Date(oDate.getTime()));
                return dateStr;
            }
        };

        Controller.prototype._onCampaignItemClick = function (oControlEvent) {
            var oRouter = this.getOwnerComponent().getRouter(),
                oRouting = this.getView().getModel('oFooterRouting'),
                item = oControlEvent.getSource().getDomRef().childNodes[0];

            if ($(item).hasClass('currentItem') && $(item).hasClass('hasValue')) {
                oRouter.navTo('campaign', {bpNum: oRouting.oData.BpNumber, caNum: oRouting.oData.CaNumber, coNum: oRouting.oData.CoNumber, typeV: 'C'});
            }

            if ($(item).hasClass('pendingItem') && $(item).hasClass('hasValue')) {
                oRouter.navTo('campaign', {bpNum: oRouting.oData.BpNumber, caNum: oRouting.oData.CaNumber, coNum: oRouting.oData.CoNumber, typeV: 'PE'});
            }

            if ($(item).hasClass('historyItem') && $(item).hasClass('hasValue')) {
                oRouter.navTo('campaignhistory', {bpNum: oRouting.oData.BpNumber, caNum: oRouting.oData.CaNumber, coNum: oRouting.oData.CoNumber});
            }
        };

        Controller.prototype._onCampaignBtnClick = function (oEvent) {
            var oCampaignModel = this.getView().getModel('oFooterCampaign'),
                sFirstMonthBill = oCampaignModel.getProperty("/CampaignFirstBill"),
                sPendingMoveOut = oCampaignModel.getProperty("/CampaignButtonMoveOut"),
                sInitTab = oCampaignModel.getProperty("/CampaignButtonType"),
                oRouter = this.getOwnerComponent().getRouter(),
                oRouting = this.getView().getModel('oFooterRouting');

            // Check pending move out
            if (sPendingMoveOut) {
                ute.ui.main.Popup.Alert({
                    title: 'Information',
                    message: 'We are unable to process your campaign change request because you have already requested a move out.'
                });
                return;
            }
            // Check first month bill
            if (!sFirstMonthBill) {
                ute.ui.main.Popup.Alert({
                    title: 'Information',
                    message: 'Customer has to completed at least One Month Invoice.'
                });
                return;
            }
            // Check and parse initTab
            if ((!sInitTab) || (sInitTab === undefined) || (sInitTab === null) || (sInitTab === "")) {
                sInitTab = "SE";
            }
            // If all ok, go to change campaign page
            this._getPendingSwapsCount(oRouting.oData.BpNumber, oRouting.oData.CaNumber, oRouting.oData.CoNumber, sInitTab);
        };


        Controller.prototype._getPendingSwapsCount = function (BpNumber, CaNumber, CoNumber, sInitTab) {
            var oRouter = this.getOwnerComponent().getRouter(),
                oRouting = this.getView().getModel('oFooterRouting'),
                sPath = '/PendSwapS/$count',
                aFilters = [],
                oModel = this.getView().getModel('oCompODataSvc'),
                mParameters;

            // Set up filters
            aFilters.push(new Filter({ path: 'Contract', operator: FilterOperator.EQ, value1: oRouting.oData.CoNumber}));

            mParameters = {
                filters : aFilters,
                success : function (oData) {
                    if (oData) {
                        jQuery.sap.log.info("Odata Read Successfully:::");
                        if ((parseInt(oData, 10)) > 0) {
                            this._showPendingSwaps();
                        } else {
                            oRouter.navTo("campaignoffers", {bpNum: BpNumber, caNum: CaNumber, coNum: CoNumber, typeV: sInitTab});
                        }
                    }
                }.bind(this),
                error: function (oError) {
                    jQuery.sap.log.info("Odata Failed:::" + oError);
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, mParameters);
            }
        };

        Controller.prototype._showPendingSwaps = function () {
            var oRouting = this.getView().getModel('oFooterRouting'),
                sPath = "/PendSwapS",
                oBindingInfo,
                aFilters = [],
                oPendingSwapsTable,
                oPendingSwapsTemplate,
                fnRecievedHandler;

            // Display loading indicator
            this.getOwnerComponent().getCcuxApp().setOccupied(true);

            // Set up filters
            aFilters.push(new Filter({ path: 'Contract', operator: FilterOperator.EQ, value1: oRouting.oData.CoNumber}));

            // Initiate dialogs
            if (!this._oPedingSwapsDialog) { this._oPedingSwapsDialog = sap.ui.xmlfragment("FooterPendingSwaps", "nrg.module.app.view.FooterPendingSwaps", this); }
            if (!this._oCancelDialog) {
                this._oCancelDialog = new ute.ui.main.Popup.create({
                    title: 'Change Campaign - Cancel',
                    close: this._handleDialogClosed,
                    content: this._oPedingSwapsDialog
                });
                this._oCancelDialog.addStyleClass("nrgCamHis-dialog");
            }
            
            oPendingSwapsTable = sap.ui.core.Fragment.byId("FooterPendingSwaps", "idnrgCamPds-pendTable");
            oPendingSwapsTemplate = sap.ui.core.Fragment.byId("FooterPendingSwaps", "idnrgCamPds-pendRow");
            
            fnRecievedHandler = function () {
                var oBinding = oPendingSwapsTable.getBinding("rows");
                this._oCancelDialog.open();
                this.getOwnerComponent().getCcuxApp().setOccupied(false);
                if (oBinding) {
                    oBinding.detachDataReceived(fnRecievedHandler);
                }
            }.bind(this);

            oBindingInfo = {
                model : "comp-app",
                path : sPath,
                filters : aFilters,
                template : oPendingSwapsTemplate,
                events: {dataReceived : fnRecievedHandler}
            };
            oPendingSwapsTable.bindRows(oBindingInfo);
            this.getView().addDependent(this._oCancelDialog);
        };

        /*---------------------------------------------- Footer Alert Methods -----------------------------------------------*/

        Controller.prototype.onNotiLinkPress = function (oControlEvent, a, b, c) {
            this.notificationLinkPressActions[oControlEvent.getSource().getProperty('text')]();
        };

        /*------------------------------- M2M --------------------------------*/

        Controller.prototype._onM2mLinkPress = function (oControlEvent) {
            if (!this.m2mPopup) {
                this.m2mPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.app.view.AlertM2mPopup", this),
                    title: 'Multi-Month Invoice'
                });
                this.m2mPopup.addStyleClass('nrgApp-m2mPopup');
                this.getView().addDependent(this.m2mPopup);
            }
            // Open the popup
            this.m2mPopup.open();
        };

        Controller.prototype._onM2mAcceptClick = function (oEvent) {
            var oWebUiManager = this.getOwnerComponent().getCcuxWebUiManager(),
                oRouter = this.getOwnerComponent().getRouter(),
                oRouting = this.getView().getModel('oFooterRouting'),
                sRetrStatus;

            // Display the loading indicator
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            // Retrieve Notification
            this._retrieveEligibility(function () {sRetrStatus = 'success';}, function () {sRetrStatus = 'fail';} );
            // Check retrieval done
            var checkRetrComplete = setInterval (function () {
                // Succeeded
                if (sRetrStatus === 'success') {
                    var oEligibilityModel = this.getView().getModel('oEligibility');
                    // Dismiss the loading indicator
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    // Upon successfully retrieving the data, stop checking the completion of retrieving data
                    clearInterval(checkRetrComplete);
                    // Close popup
                    this.m2mPopup.close();
                    // Check active or not
                    if (!oEligibilityModel.oData.DPPActv) {
                        // Go to DPP page
                        oRouter.navTo('billing.DefferedPmtPlan', {bpNum: oRouting.oData.BpNumber, caNum: oRouting.oData.CaNumber, coNum: oRouting.oData.CoNumber});
                    } else {
                        // Go to transaction launcher
                        oWebUiManager.notifyWebUi('openIndex', {
                            LINK_ID: "Z_DPP"
                        });
                    }
                }
                // Failed
                if (sRetrStatus === 'fail') {
                    // Dismiss the loading indicator
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    // Stop checking the completion of retrieving data
                    clearInterval(checkRetrComplete);
                    // Close popup
                    this.m2mPopup.close();
                    // Display error message
                    ute.ui.main.Popup.Alert({ title: 'Retrieve Error', message: 'We cannot retrieve the eligibility data of DPP. Please check the Contract number or network and try again later.'});
                }
            }.bind(this), 100); 
        };

        Controller.prototype._onM2mCloseClick = function (oEvent) {
            this.m2mPopup.close();
        };

        /*------------------------------- SMTP -------------------------------*/

        Controller.prototype._onSmtpLinkPress = function (oControlEvent) {
            var NNPPopupControl = new NNPPopup(),
                oRouting = this.getView().getModel('oFooterRouting'),
                bpNum = oRouting.oData.BpNumber,
                caNum = oRouting.oData.CaNumber,
                coNum = oRouting.oData.CoNumber,
                oBpInfoModel = this.getView().getModel('oBpInfo'),
                bRetrBpComplete = false,
                checkBpInfoRetrComplete;

            // Retrieve BP info
            this._retrieveBpInfo(bpNum, function () { bRetrBpComplete = true; });
            // Check the completion of BP info retrieval
            checkBpInfoRetrComplete = setInterval(function () {
                if (bRetrBpComplete) {
                    NNPPopupControl.attachEvent("NNPCompleted", function () {
                        // Update Footer
                        this.updateFooter({}, {}, {'bpNum': bpNum, 'caNum': caNum, 'coNum': coNum});
                        // Dismiss the loading spinner
                        this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    }, this);
                    // Open the NNP popup
                    this.getView().addDependent(NNPPopupControl);
                    NNPPopupControl.openNNP(bpNum, oBpInfoModel.oData.Email, oBpInfoModel.oData.EmailConsum);
                    // Clear the interval check
                    clearInterval(checkBpInfoRetrComplete);
                }
            }.bind(this), 100);
        };

        /*------------------------------- SMS --------------------------------*/

        Controller.prototype._onSmsLinkPress = function (oControlEvent) {
            if (!this.invalidSmsPopup) {
                this.invalidSmsPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.app.view.AlertInvSmsPopup", this),
                    title: 'Invalid SMS Number'
                });
                this.invalidSmsPopup.addStyleClass('nrgApp-invalidSmsPopup');
                this.getView().addDependent(this.invalidSmsPopup);
            }
            // Open the popup
            this.invalidSmsPopup.open();
        };

        Controller.prototype._onInvSmsCloseClick = function (oEvent) {
            this.invalidSmsPopup.close();
        };

        /*------------------------------- OAM --------------------------------*/

        Controller.prototype._onOamLinkPress = function (oControlEvent) {
            var oNotificationModel = this.getView().getModel('oFooterNotification'),
                i;

            for (i = 0; i < oNotificationModel.oData.length; i = i + 1) {
                if (oNotificationModel.oData[i].FilterType === 'OAM') {
                    oNotificationModel.setProperty('/ErrorMessage', oNotificationModel.oData[i].MessageText);
                }
            }

            if (!this.oamPopup) {
                this.oamPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.app.view.AlertOamPopup", this),
                    title: 'Invalid OAM Email'
                });
                this.oamPopup.addStyleClass('nrgApp-oamPopup');
                this.getView().addDependent(this.oamPopup);
            }
            // Open the popup
            this.oamPopup.open();
        };

        Controller.prototype._onOamCloseClick = function (oEvent) {
            this.oamPopup.close();
        };

        /*--------------------- Invalid Mailing Address ----------------------*/

        Controller.prototype._onMailLinkPress = function (oControlEvent) {
            if (!this.invalidMailingAddrPopup) {
                this.invalidMailingAddrPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.app.view.AlertInvMailAddrPopup", this),
                    title: 'Invalid Mailing Address'
                });
                this.invalidMailingAddrPopup.addStyleClass('nrgApp-invalidMailingAddrPopup');
                this.getView().addDependent(this.invalidMailingAddrPopup);
            }
            // Open the popup
            this.invalidMailingAddrPopup.open();
        };

        Controller.prototype._onInvMailAddrCloseClick = function (oEvent) {
            this.invalidMailingAddrPopup.close();
        };

        return Controller;
    }
);