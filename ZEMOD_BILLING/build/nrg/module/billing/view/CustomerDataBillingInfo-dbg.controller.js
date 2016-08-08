/*globals sap*/
/*global ute*/
/*global $*/
/*jslint nomen:true*/
/*jslint forin: true */

sap.ui.define(
    [
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'nrg/module/quickpay/view/QuickPayControl',
        'nrg/base/type/Price',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator'
    ],

    function (jQuery, Controller, JSONModel, QuickPayControl, Type_Price, Filter, FilterOperator) {
        'use strict';

        var CustomController = Controller.extend('nrg.module.billing.view.CustomerDataBillingInfo');

        CustomController.prototype.onInit = function () {

        };

        CustomController.prototype.onBeforeRendering = function () {

            this.getOwnerComponent().getCcuxApp().setTitle('BILLING');

            this.getView().setModel(this.getOwnerComponent().getModel('comp-billing'), 'oDataSvc');
            this.getView().setModel(this.getOwnerComponent().getModel('comp-billing-invoice'), 'oDataInvoiceSvc');
            this.getView().setModel(this.getOwnerComponent().getModel('comp-eligibility'), 'oDataEligSvc');

            // Model for Eligibility
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oEligibility');

            // Models for BillingInvoices
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oBillingInvoices');

            // Models for Invoice Details
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oPmtSummary');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oPmtPayments');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oPmtItems');

            // Models for Invoice Select Popup
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oInvoiceSelectInfo');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oInvoiceSelectFilters');
            this.getView().setModel(new sap.ui.model.json.JSONModel(), 'oInvoiceSelectDateRange');

            // Starting invoices retriviging
            this._initRoutingInfo();
            this._initRetrBillInvoices();
            this._initBillingMsgs();

            // Get DPP/ABP/RetroABP/EXTN notification
            this._retreInvoiceNotification();

            // Disable backspace key on this page
            $(document).on("keydown", function (e) {
                if (e.which === 8 && !$(e.target).is("input, textarea")) {
                    e.preventDefault();
                }
            });
        };

        CustomController.prototype.onAfterRendering = function () {
            this.getOwnerComponent().getCcuxApp().setLayout('FullWidthTool');

            // Navigation arrow event handling
            this.getOwnerComponent().getCcuxApp().showNavLeft(true);
            this.getOwnerComponent().getCcuxApp().detachNavRightAll();
            this.getOwnerComponent().getCcuxApp().attachNavLeft(this._navLeftCallBack, this);

            // Update Footer
            this.getOwnerComponent().getCcuxApp().updateFooter(this._bpNum, this._caNum, this._coNum);
        };


        Controller.prototype._navLeftCallBack = function () {
            var oRouter = this.getOwnerComponent().getRouter();

            if (this._coNum && this._caNum && this._bpNum) {
                oRouter.navTo('dashboard.VerificationWithCaCo', {bpNum: this._bpNum, caNum: this._caNum, coNum: this._coNum});
            } else if (!this._coNum && this._caNum && this._bpNum) {
                oRouter.navTo('dashboard.VerificationWithCa', {bpNum: this._bpNum, caNum: this._caNum});
            } else if (!this._coNum && !this._caNum && this._bpNum) {
                oRouter.navTo('dashboard.Verification', {bpNum: this._bpNum});
            }
        };

        CustomController.prototype._initBillingMsgs = function () {
            var aFilterIds,
                aFilterValues,
                aFilters,
                oBindingInfo1,
                oBindingInfo2,
                oBillingMsgTag = this.getView().byId("idnrgBillingMsgs"),
                oBillingMsgTagTemplate = this.getView().byId("idnrgBillingMsgsTemp"),
                oDunningMsgTag = this.getView().byId("idnrgBilDunMsgs"),
                oDunningMsgTagTemplate = this.getView().byId("idnrgBilDunMsgsTemp"),
                sPath = "/AlertsSet",
                fnTableDataRecdHandler = function (oEvent) {
                };
            aFilterIds = ["BP", "CA", "Identifier"];
            aFilterValues = [this._bpNum, this._caNum, "BILLING"];
            aFilters = this._createSearchFilterObject(aFilterIds, aFilterValues);
            oBindingInfo1 = {
                model : "comp-billing",
                path : sPath,
                template : oBillingMsgTagTemplate,
                filters : aFilters,
                events: {dataReceived : fnTableDataRecdHandler}
            };
            oBillingMsgTag.bindAggregation("content", oBindingInfo1);
            aFilterIds = ["BP", "CA", "Identifier"];
            aFilterValues = [this._bpNum, this._caNum, "DUNNING"];
            aFilters = this._createSearchFilterObject(aFilterIds, aFilterValues);
            oBindingInfo2 = {
                model : "comp-billing",
                path : sPath,
                template : oDunningMsgTagTemplate,
                filters : aFilters,
                events: {dataReceived : fnTableDataRecdHandler}
            };
            oDunningMsgTag.bindAggregation("content", oBindingInfo2);
        };
       /**
		 * Assign the filter objects based on the input selection
		 *
		 * @function
		 * @param {Array} aFilterIds to be used as sPath for Filters
         * @param {Array} aFilterValues for each sPath
		 * @private
		 */
        Controller.prototype._createSearchFilterObject = function (aFilterIds, aFilterValues) {
            var aFilters = [],
                iCount;

            for (iCount = 0; iCount < aFilterIds.length; iCount = iCount + 1) {
                aFilters.push(new Filter(aFilterIds[iCount], FilterOperator.EQ, aFilterValues[iCount], ""));
            }
            return aFilters;
        };

        CustomController.prototype.onExit = function () {
        };

        CustomController.prototype._initRoutingInfo = function () {
            var oRouteInfo = this.getOwnerComponent().getCcuxRouteManager().getCurrentRouteInfo();

            this._bpNum = oRouteInfo.parameters.bpNum;
            this._caNum = oRouteInfo.parameters.caNum;
            this._coNum = oRouteInfo.parameters.coNum;
        };


        CustomController.prototype._initRetrBillInvoices = function () {
            var oChbkOData = this.getView().getModel('oDataSvc'),
                sPath,
                oParameters;

            sPath = '/BillInvoices(\'' + this._caNum + '\')';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oBillingInvoices').setData(oData);
                        this._curInvNum = oData.InvoiceNum;
                        this._initRetrInvoiceDetail(this._curInvNum);
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oChbkOData) {
                oChbkOData.read(sPath, oParameters);
            }
        };

        CustomController.prototype._initRetrInvoiceDetail = function (sInvNum) {
            this._retrInvSumry(sInvNum);
            this._retrInvPmts(sInvNum);
            this._retrInvItems(sInvNum);
        };

        CustomController.prototype._retrInvSumry = function (sInvNum) {
            var oChbkOData = this.getView().getModel('oDataSvc'),
                sPath,
                oParameters;

            sPath = '/PaymentHdrs(\'' + sInvNum + '\')/PaymentSumry';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oPmtSummary').setData(oData.results[0]);
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oChbkOData) {
                oChbkOData.read(sPath, oParameters);
            }
        };

        CustomController.prototype._retrInvPmts = function (sInvNum) {
            var oChbkOData = this.getView().getModel('oDataSvc'),
                sPath,
                oParameters;

            sPath = '/PaymentHdrs(\'' + sInvNum + '\')/Payments';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oPmtPayments').setData(oData);
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oChbkOData) {
                oChbkOData.read(sPath, oParameters);
            }
        };

        CustomController.prototype._retrInvItems = function (sInvNum) {
            var oChbkOData = this.getView().getModel('oDataSvc'),
                sPath,
                oParameters;

            sPath = '/PaymentHdrs(\'' + sInvNum + '\')/PaymentItems';

            oParameters = {
                success : function (oData) {
                    if (oData) {
                        this.getView().getModel('oPmtItems').setData(oData);
                    }
                }.bind(this),
                error: function (oError) {
                    //Need to put error message
                }.bind(this)
            };

            if (oChbkOData) {
                oChbkOData.read(sPath, oParameters);
            }
        };

        /*************************************************************************************************************************/
        //Formatter Functions
        CustomController.prototype._formatDate = function (oDate) {
            var sFormattedDate;

            if (!oDate) {
                return null;
            } else {
                sFormattedDate = (oDate.getMonth() + 1).toString() + '/' + oDate.getDate().toString() + '/' + oDate.getFullYear().toString();
                return sFormattedDate;
            }
        };
        CustomController.prototype._formatBoolCurChrg = function (sIndicator) {
            if (sIndicator === 'X' || sIndicator === 'x') {
                return true;
            } else {
                return false;
            }
        };
        CustomController.prototype._formatBoolCurChrg_Rev = function (sIndicator) {
            if (sIndicator === 'X' || sIndicator === 'x') {
                return false;
            } else {
                return true;
            }
        };

        /*------------------------------------------------ UI Element Actions -----------------------------------------------*/

        CustomController.prototype._onInvoiceAmntClicked = function (oEvent) {
            var i18nModel =  this.getOwnerComponent().getModel('comp-i18n-billing'),
                popupTitle = i18nModel.getProperty("nrgBilling-paymentsPopup-ACCOUNT_SUMMARY");

            if (!this._oInvoicePopup) {
                this._oInvoicePopup = sap.ui.xmlfragment("PaymentPopup", "nrg.module.billing.view.InvoicePopup", this);
                this._oInvoicePopup = ute.ui.main.Popup.create({
                    content: this._oInvoicePopup,
                    title: popupTitle
                });

                this._oInvoicePopup.setShowCloseButton(true);
                this.getView().addDependent(this._oInvoicePopup);
            }

            this._oInvoicePopup.open();

            if (this._curInvNum) {
                this._initRetrInvoiceDetail(this._curInvNum);
            }
        };

        CustomController.prototype._onPaymentsClicked = function (oEvent) {
            var i18nModel =  this.getOwnerComponent().getModel('comp-i18n-billing'),
                popupTitle = i18nModel.getProperty("nrgBilling-paymentsPopup-PAYMENTS");

            if (!this._oPaymentPopup) {
                this._oPaymentPopup = sap.ui.xmlfragment("PaymentPopup", "nrg.module.billing.view.PaymentsPopup", this);
                this._oPaymentsPopup = ute.ui.main.Popup.create({
                    content: this._oPaymentPopup,
                    title: popupTitle
                });

                this._oPaymentsPopup.setShowCloseButton(true);
                this.getView().addDependent(this._oPaymentsPopup);
            }

            this._oPaymentsPopup.open();
        };

        CustomController.prototype.onPayNow = function (oEvent) {
            var QuickControl = new QuickPayControl();

            this._sContract = this._coNum;
            this._sBP = this._bpNum;
            this._sCA = this._caNum;
            this.getView().addDependent(QuickControl);
            QuickControl.openQuickPay(this._sContract, this._sBP, this._sCA);
        };

        CustomController.prototype._onChkbookLnkClicked = function () {
            var oRouter = this.getOwnerComponent().getRouter();

            if (this._coNum) {
                oRouter.navTo('billing.CheckBook', {bpNum: this._bpNum, caNum: this._caNum, coNum: this._coNum});
            } else {
                oRouter.navTo('billing.CheckBookNoCo', {bpNum: this._bpNum, caNum: this._caNum});
            }
        };

        CustomController.prototype._onHighbillLnkClicked = function () {
            var oRouter = this.getOwnerComponent().getRouter();

            if (this._coNum) {
                oRouter.navTo('billing.HighBill', {bpNum: this._bpNum, caNum: this._caNum, coNum: this._coNum});
            } else {
                oRouter.navTo('billing.HighBillNoCo', {bpNum: this._bpNum, caNum: this._caNum});
            }
        };

        CustomController.prototype._onInvoiceNumClicked = function (oEvent) {
            var oBillingInvoiceModel = this.getView().getModel('oBillingInvoices');

            if (oBillingInvoiceModel.oData.InvUrl) {
                window.open(oBillingInvoiceModel.oData.InvUrl, '_blank');
            }
        };

        /*------------------------------------------- Retrieve Invoice Notification -----------------------------------------*/

        CustomController.prototype._retreInvoiceNotification = function () {
            var sPath = '/EligCheckS(\'' + this._coNum + '\')',
                oModel = this.getView().getModel('oDataEligSvc'),
                oEligModel = this.getView().getModel('oEligibility'),
                oParameters;

            oParameters = {
                success : function (oData) {
                    oEligModel.setData(oData);
                }.bind(this),
                error: function (oError) {
                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        /*------------------------------------------ Invoice Selection Popup (START) ----------------------------------------*/

        CustomController.prototype._onInvoiceSelectClicked = function () {
            var bRetrieveComplete = false,
                minDate,
                checkRetrComplete;

            // Display the loading indicator
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            // Run for the first time
            if (!this._oInvSelectPopup) {
                this._oInvSelectPopup = ute.ui.main.Popup.create({
                    content: sap.ui.xmlfragment(this.getView().sId, "nrg.module.billing.view.InvSelectPopup", this),
                    title: 'INVOICE SELECTION'
                });
                this._oInvSelectPopup.addStyleClass('nrgBilling-invSelectPopup');
                this.getView().addDependent(this._oInvSelectPopup);
                // Date picker event binding
                this.getView().byId('nrgBilling-invSel-stDate').attachBrowserEvent('select', this._handleStartDateChange, this);
                this.getView().byId('nrgBilling-invSel-edDate').attachBrowserEvent('select', this._handleEndDateChange, this);
                // Set minDate for startDate & endDate
                minDate = new Date();
                minDate.setMonth(minDate.getMonth() - 18);
                this.getView().byId('nrgBilling-invSel-stDate').setMinDate(minDate);
                this.getView().byId('nrgBilling-invSel-edDate').setMinDate(minDate);
            }
            // Open the popup
            this._oInvSelectPopup.open();
            // Retrieve latest data
            this._retrieveInvoiceInfo(this._caNum, function () {bRetrieveComplete = true; });
            // Check the completion of retrieving data
            checkRetrComplete = setInterval(function () {
                if (bRetrieveComplete) {
                    // Dismiss the loading indicator
                    this.getOwnerComponent().getCcuxApp().setOccupied(false);
                    // Initialize filters
                    this._initializeFilters();
                    // Initialize date ranges
                    this._initializeDateRange();
                    clearInterval(checkRetrComplete);
                }
            }.bind(this), 100);
        };

        CustomController.prototype._retrieveInvoiceInfo = function (sCaNumber, fnCallback) {
            var sPath = '/InvoiceS',
                aFilters = [],
                oModel = this.getView().getModel('oDataInvoiceSvc'),
                oInvSelModel = this.getView().getModel('oInvoiceSelectInfo'),
                aInvoiceData = [],
                oParameters,
                rowNumer,
                tableContainer,
                j,
                i;

            aFilters.push(new Filter({ path: 'ContAccount', operator: FilterOperator.EQ, value1: sCaNumber}));

            oParameters = {
                filters: aFilters,
                success : function (oData) {
                    if (oData.results) {
                        oInvSelModel.setData(oData.results);

                        // Generate the table
                        tableContainer = this.getView().byId('nrgBilling-invSelPopup-tableBody');

                        // Remove previous content
                        rowNumer = tableContainer.getContent().length;
                        for (j = 0; j < rowNumer; j = j + 1) { tableContainer.removeContent(0); }

                        // Process the new data
                        for (i = 0; i < oInvSelModel.oData.length; i = i + 1) {
                            // Add self-defined attribute
                            oInvSelModel.oData[i].View = false;
                            // Create table row element
                            var rowElement = new ute.ui.commons.Tag({elem: 'div'}).addStyleClass('nrgBilling-invSelPopup-tableRow');
                            if ((i + 1) % 2 === 0) { rowElement.addStyleClass('nrgBilling-invSelPopup-tableRow-even'); }
                            // Insert row element childs
                            rowElement.addContent(new ute.ui.commons.Tag({elem: 'div', text: oInvSelModel.oData[i].Date}).addStyleClass('nrgBilling-invSelPopup-tableRow-item').addStyleClass('date'));
                            rowElement.addContent(new ute.ui.commons.Tag({elem: 'div', text: oInvSelModel.oData[i].PrintDoc}).addStyleClass('nrgBilling-invSelPopup-tableRow-item').addStyleClass('number'));
                            rowElement.addContent(new ute.ui.commons.Tag({elem: 'div', text: oInvSelModel.oData[i].DataType}).addStyleClass('nrgBilling-invSelPopup-tableRow-item').addStyleClass('description'));
                            rowElement.addContent(new ute.ui.main.Checkbox({checked: oInvSelModel.oData[i].View}).addStyleClass('nrgBilling-invSelPopup-tableRow-item').addStyleClass('view'));
                            // Insert the row element to table
                            tableContainer.addContent(rowElement);
                        }

                        // Execute the callback function
                        if (fnCallback) { fnCallback(); }

                    }
                }.bind(this),
                error: function (oError) {

                }.bind(this)
            };

            if (oModel) {
                oModel.read(sPath, oParameters);
            }
        };

        CustomController.prototype._initializeFilters = function () {
            var oInvSelFiltersModel = this.getView().getModel('oInvoiceSelectFilters');

            oInvSelFiltersModel.setProperty('/All', true);
            this._onSelectAll();
            oInvSelFiltersModel.setProperty('/Disconnect', false);
            oInvSelFiltersModel.setProperty('/Invoice', false);
            oInvSelFiltersModel.setProperty('/Reversal', false);

        };

        CustomController.prototype._initializeDateRange = function () {
            var oInvSelDateRangeModel = this.getView().getModel('oInvoiceSelectDateRange'),
                today = new Date(),
                before = new Date(),
                endDate,
                startDate;

            // Format the endDate
            endDate = this._formatInvoiceDate(today.getDate(), today.getMonth() + 1, today.getFullYear());
            // Format the startDate (12 months ago)
            before.setMonth(before.getMonth() - 12);
            startDate = this._formatInvoiceDate(before.getDate(), before.getMonth() + 1, before.getFullYear());

            this.getView().byId('nrgBilling-invSel-stDate').setDefaultDate(startDate);
            this.getView().byId('nrgBilling-invSel-edDate').setDefaultDate(endDate);

            oInvSelDateRangeModel.setProperty('/Start', startDate);
            oInvSelDateRangeModel.setProperty('/End', endDate);

            // Apply the date ranger filter
            this._filterByDateRange();
        };

        CustomController.prototype._formatInvoiceDate = function (day, month, year) {
            // Pad the date and month
            if (day < 10) {day = '0' + day; }
            if (month < 10) {month = '0' + month; }
            // Format the startDate
            return month + '/' + day + '/' + year;
        };

        CustomController.prototype._deformatInvoiceDate = function (formattedDate) {
            var parts = formattedDate.split("/");
            return new Date(parts[2], parts[0] - 1, parts[1]);
        };

        CustomController.prototype._filterByDateRange = function () {
            var oTable = this.getView().byId('nrgBilling-invSelPopup-tableBody'),
                oInvSelDateRangeModel = this.getView().getModel('oInvoiceSelectDateRange'),
                oInvSelFiltersModel = this.getView().getModel('oInvoiceSelectFilters'),
                i,
                date,
                property;

            for (i = 0; i < oTable.getContent().length; i = i + 1) {
                date = oTable.getContent()[i].getContent()[0].getText();
                if (this._deformatInvoiceDate(date) < this._deformatInvoiceDate(oInvSelDateRangeModel.oData.Start) || this._deformatInvoiceDate(date) > this._deformatInvoiceDate(oInvSelDateRangeModel.oData.End)) {
                    oTable.getContent()[i].setVisible(false);
                } else {
                    oTable.getContent()[i].setVisible(true);
                }
            }

            // Uncheck other type filters except 'all'
            for (property in oInvSelFiltersModel.oData) {
                if (property !== 'All') {
                    oInvSelFiltersModel.setProperty('/' + property, false);
                }
            }
        };

        CustomController.prototype._handleStartDateChange = function (oEvent) {
            var oInvSelDateRangeModel = this.getView().getModel('oInvoiceSelectDateRange'),
                startDate = this.getView().byId('nrgBilling-invSel-stDate').getValue();

            oInvSelDateRangeModel.setProperty('/Start', startDate);
            this._filterByDateRange();
        };

        CustomController.prototype._handleEndDateChange = function (oEvent) {
            var oInvSelDateRangeModel = this.getView().getModel('oInvoiceSelectDateRange'),
                endDate = this.getView().byId('nrgBilling-invSel-edDate').getValue();

            oInvSelDateRangeModel.setProperty('/End', endDate);
            this._filterByDateRange();
        };

        CustomController.prototype._onSelectAll = function (oEvent) {
            var oTable = this.getView().byId('nrgBilling-invSelPopup-tableBody'),
                oInvSelFiltersModel = this.getView().getModel('oInvoiceSelectFilters'),
                i,
                oCheckbox;

            for (i = 0; i < oTable.getContent().length; i = i + 1) {
                oCheckbox = oTable.getContent()[i].getContent()[3];
                oCheckbox.setChecked(oInvSelFiltersModel.oData.All);
            }
        };

        CustomController.prototype._onSelectDisconnect = function (oEvent) {
            this._applyTypeFilter('Disconnect');
        };

        CustomController.prototype._onSelectInvoice = function () {
            this._applyTypeFilter('Invoice');
        };

        CustomController.prototype._onSelectReversed = function () {
            this._applyTypeFilter('Reversal');
        };

        CustomController.prototype._applyTypeFilter = function (sType) {
            var oTable = this.getView().byId('nrgBilling-invSelPopup-tableBody'),
                oInvSelFiltersModel = this.getView().getModel('oInvoiceSelectFilters'),
                oInvSelDateRangeModel = this.getView().getModel('oInvoiceSelectDateRange'),
                typeCheck,
                dateCheck,
                i,
                date,
                property;

            for (i = 0; i < oTable.getContent().length; i = i + 1) {
                date = oTable.getContent()[i].getContent()[0].getText();
                typeCheck = false;
                dateCheck = false;

                // Check the type filter
                if (oTable.getContent()[i].getContent()[2].getText() === sType || !oInvSelFiltersModel.oData[sType]) {
                    typeCheck = true;
                }
                // Check the date filter
                if (this._deformatInvoiceDate(date) >= this._deformatInvoiceDate(oInvSelDateRangeModel.oData.Start) &&
                        this._deformatInvoiceDate(date) <= this._deformatInvoiceDate(oInvSelDateRangeModel.oData.End)) {
                    dateCheck = true;
                }
                if (typeCheck && dateCheck) {
                    oTable.getContent()[i].setVisible(true);
                } else {
                    oTable.getContent()[i].setVisible(false);
                }
            }

            // Uncheck other type filters except 'all'
            for (property in oInvSelFiltersModel.oData) {
                if (property !== 'All' && property !== sType) {
                    oInvSelFiltersModel.setProperty('/' + property, false);
                }
            }
        };


        CustomController.prototype._onOpenBtnClick = function (oEvent) {
            var oTable = this.getView().byId('nrgBilling-invSelPopup-tableBody'),
                oInvSelModel = this.getView().getModel('oInvoiceSelectInfo'),
                i,
                oCheckbox;

            for (i = 0; i < oTable.getContent().length; i = i + 1) {
                oCheckbox = oTable.getContent()[i].getContent()[3];
                if (oCheckbox.getChecked() && oTable.getContent()[i].getVisible()) {
                    this._openNewWindowDelayed(oInvSelModel.oData[i].URL);
                }
            }
        };

        CustomController.prototype._openNewWindowDelayed = function (sUrl) {
            var openNewWindow = setTimeout(function () {
                window.open(sUrl, '_blank');
            }, 1000);
        };

        /*------------------------------------------- Invoice Selection Popup (END) -----------------------------------------*/






        /**
		 * Handler for Dunning Lock Press
		 *
		 * @function
         * @param {sap.ui.base.Event} oEvent pattern match event
		 */
        Controller.prototype.onMessages = function (oEvent) {
            var sPath,
                oBindingInfo,
                oDunningLocksTable,
                oDunningLocksTemplate,
                fnRecievedHandler,
                that = this;
            this.getOwnerComponent().getCcuxApp().setOccupied(true);
            if (!this._oDialogFragment) {
                this._oDialogFragment = sap.ui.xmlfragment("DunnlingLocks", "nrg.module.billing.view.DunningPopup", this);
            }
            if (this._oDunningDialog === undefined) {
                this._oDunningDialog = new ute.ui.main.Popup.create({
                    title: 'Dunning',
                    content: this._oDialogFragment
                });
            }
            sPath = oEvent.getSource().getBindingContext("comp-billing").getPath() + "/DunningLocksSet";
            oDunningLocksTable = sap.ui.core.Fragment.byId("DunnlingLocks", "idnrgBillDn-Table");
            oDunningLocksTemplate = sap.ui.core.Fragment.byId("DunnlingLocks", "idnrgBillDn-Row");
            fnRecievedHandler = function () {
                that.getOwnerComponent().getCcuxApp().setOccupied(false);
            };
            oBindingInfo = {
                model : "comp-billing",
                path : sPath,
                template : oDunningLocksTemplate,
                events: {dataReceived : fnRecievedHandler}
            };
            this.getView().addDependent(this._oDunningDialog);
            //to get access to the global model
            this._oDunningDialog.addStyleClass("nrgCamHis-dialog");
            oDunningLocksTable.bindRows(oBindingInfo);
            this._oDunningDialog.open();
        };
        return CustomController;
    }
);
