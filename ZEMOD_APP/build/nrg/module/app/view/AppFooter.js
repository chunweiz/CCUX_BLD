sap.ui.define(["sap/ui/base/EventProvider","sap/ui/model/Filter","sap/ui/model/FilterOperator","nrg/module/nnp/view/NNPPopup"],function(a,b,c,d){"use strict";var e=a.extend("nrg.module.app.view.AppFooter",{constructor:function(b,c){a.apply(this),this._oController=b,this._oApp=c},metadata:{publicMethods:["init","reset","setExpanded","isExpanded"]}});return e.prototype.init=function(){this._registerEvents()},e.prototype._initFooterContent=function(){this._oController.getView().setModel(this._oController.getView().getModel("main-app"),"oMainODataSvc"),this._oController.getView().setModel(this._oController.getView().getModel("noti-app"),"oNotiODataSvc"),this._oController.getView().setModel(this._oController.getView().getModel("rhs-app"),"oRHSODataSvc"),this._oController.getView().setModel(this._oController.getView().getModel("comp-app"),"oCompODataSvc"),this._oController.getView().setModel(this._oController.getView().getModel("elig-app"),"oDataEligSvc"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oFooterNotification"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oFooterRHS"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oFooterCampaign"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oFooterRouting"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oFooterBpInfo"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oBpInfo"),this._oController.getView().setModel(new sap.ui.model.json.JSONModel,"oEligibility"),this.footerElement={},this.footerElement.notiEmptySec=this._oController.getView().byId("nrgAppFtrDetails-notification-emptySection"),this.footerElement.notiAlertSec=this._oController.getView().byId("nrgAppFtrDetails-notification-alertSection"),this.footerElement.notiEmptySec.setVisible(!0),this.footerElement.notiAlertSec.setVisible(!1),this.footerElement.rhsEmptySec=this._oController.getView().byId("nrgAppFtrDetails-rhs-emptySection"),this.footerElement.rhsProdSec=this._oController.getView().byId("nrgAppFtrDetails-rhs-productSection"),this.footerElement.rhsEmptySec.setVisible(!0),this.footerElement.rhsProdSec.setVisible(!1),this.footerElement.campEmptySec=this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-emptySection"),this.footerElement.campOfferSec=this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers"),this.footerElement.campBtnSec=this._oController.getView().byId("nrgAppFtrDetails-campaignButton"),this.footerElement.campEmptySec.setVisible(!0),this.footerElement.campOfferSec.setVisible(!1),this.footerElement.campBtnSec.setVisible(!1)},e.prototype._retrieveBpInfo=function(a,b){var c,d=this._oController.getView().getModel("oMainODataSvc"),e=this._oController.getView().getModel("oBpInfo"),f="/Partners('"+a+"')";c={success:function(a){e.setData(a),b&&b()}.bind(this),error:function(){}.bind(this)},d&&d.read(f,c)},e.prototype._retrieveEligibility=function(a){var b,c=this._oController.getView().getModel("oFooterRouting"),d="/EligCheckS('"+c.oData.CoNumber+"')",e=this._oController.getView().getModel("oDataEligSvc"),f=this._oController.getView().getModel("oEligibility");b={success:function(b){f.setData(b),a&&a()}.bind(this),error:function(){}.bind(this)},e&&e.read(d,b)},e.prototype._onM2mLinkPress=function(){var a,b=this._oController.getOwnerComponent().getCcuxWebUiManager(),c=this._oController.getOwnerComponent().getRouter(),d=this._oController.getView().getModel("oFooterRouting"),e=!1;this._oController.getOwnerComponent().getCcuxApp().setOccupied(!0),this._retrieveEligibility(function(){e=!0}),a=setInterval(function(){if(e){var f=this._oController.getView().getModel("oEligibility");this._oController.getOwnerComponent().getCcuxApp().setOccupied(!1),clearInterval(a),f.oData.DPPActv?b.notifyWebUi("openIndex",{LINK_ID:"Z_DPP"}):c.navTo("billing.DefferedPmtPlan",{bpNum:d.oData.BpNumber,caNum:d.oData.CaNumber,coNum:d.oData.CoNumber})}}.bind(this),100)},e.prototype._onSmtpLinkPress=function(){var a,b=new d,c=this._oController.getView().getModel("oFooterRouting"),e=c.oData.BpNumber,f=c.oData.CaNumber,g=c.oData.CoNumber,h=this._oController.getView().getModel("oBpInfo"),i=!1;this._retrieveBpInfo(e,function(){i=!0}),a=setInterval(function(){i&&(b.attachEvent("NNPCompleted",function(){this._updateAllFooterComponents(e,f,g,!1),this._oController.getView().rerender(),this._oController.getOwnerComponent().getCcuxApp().setOccupied(!1)},this),this._oController.getView().addDependent(b),b.openNNP(e,h.oData.Email,h.oData.EmailConsum),clearInterval(a))}.bind(this),100)},e.prototype._onMailLinkPress=function(){this.invalidMailingAddrPopup||(this.invalidMailingAddrPopup=ute.ui.main.Popup.create({content:sap.ui.xmlfragment(this._oController.getView().sId,"nrg.module.app.view.AlertInvMailAddrPopup",this),title:"Invalid Mailing Address"}),this.invalidMailingAddrPopup.addStyleClass("nrgApp-invalidMailingAddrPopup"),this._oController.getView().addDependent(this.invalidMailingAddrPopup)),this.invalidMailingAddrPopup.open()},e.prototype._onSmsLinkPress=function(){this.invalidSmsPopup||(this.invalidSmsPopup=ute.ui.main.Popup.create({content:sap.ui.xmlfragment(this._oController.getView().sId,"nrg.module.app.view.AlertInvSmsPopup",this),title:"Invalid SMS Number"}),this.invalidSmsPopup.addStyleClass("nrgApp-invalidSmsPopup"),this._oController.getView().addDependent(this.invalidSmsPopup)),this.invalidSmsPopup.open()},e.prototype._onOamLinkPress=function(){var a,b=this._oController.getView().getModel("oFooterNotification");for(a=0;a<b.oData.length;a+=1)"OAM"===b.oData[a].FilterType&&b.setProperty("/ErrorMessage",b.oData[a].MessageText);this.oamPopup||(this.oamPopup=ute.ui.main.Popup.create({content:sap.ui.xmlfragment(this._oController.getView().sId,"nrg.module.app.view.AlertOamPopup",this),title:"Invalid OAM Email"}),this.oamPopup.addStyleClass("nrgApp-oamPopup"),this._oController.getView().addDependent(this.oamPopup)),this.oamPopup.open()},e.prototype._onInvMailAddrCloseClick=function(){this.invalidMailingAddrPopup.close()},e.prototype._onInvSmsCloseClick=function(){this.invalidSmsPopup.close()},e.prototype._onM2mCloseClick=function(){this.m2mPopup.close()},e.prototype._onOamCloseClick=function(){this.oamPopup.close()},e.prototype._updateAllFooterComponents=function(a,b,c,d){this.updateFooterNotification(a,b,c,d),this.updateFooterRHS(a,b,c,d),this.updateFooterCampaign(a,b,c,d)},e.prototype.updateFooterNotification=function(a,d,e,f){this._updateRouting(a,d,e);var g,h,i="/AlertsSet",j=[],k=this._oController.getView().getModel("oNotiODataSvc"),l=this._oController.getView().getModel("oFooterNotification");j.push(new b({path:"BP",operator:c.EQ,value1:a})),j.push(new b({path:"CA",operator:c.EQ,value1:d})),j.push(new b({path:"Identifier",operator:c.EQ,value1:"FOOTER"})),g={filters:j,success:function(a){if(a.results.length){l.setData(a.results);var b,c=[],d={M2M:this._onM2mLinkPress.bind(this),SMTP:this._onSmtpLinkPress.bind(this),MAIL:this._onMailLinkPress.bind(this),SMS:this._onSmsLinkPress.bind(this),OAM:this._onOamLinkPress.bind(this)},e=this._oController.getView().byId("nrgAppFtrDetails-notification-scrollContent");for(h=0;h<l.oData.length;h+=1)c.push(new ute.ui.app.FooterNotificationItem({link:!0,design:"Error",text:l.oData[h].MessageText,linkPress:d[l.oData[h].FilterType]}));if(this.notificationCenter)for(this.notificationCenter.destroyAggregation("content",f),b=0;b<c.length;b+=1)this.notificationCenter.addAggregation("content",c[b],f);else this.notificationCenter=new ute.ui.app.FooterNotificationCenter("nrgAppFtrDetails-notification-notificationCenter",{content:c}),this.notificationCenter.placeAt(e);this.footerElement.notiEmptySec.setVisible(!1),this.footerElement.notiAlertSec.setVisible(!0)}else this.footerElement.notiEmptySec.setVisible(!0),this.footerElement.notiAlertSec.setVisible(!1)}.bind(this),error:function(){this.footerElement.notiEmptySec.setVisible(!0),this.footerElement.notiAlertSec.setVisible(!1)}.bind(this)},k&&k.read(i,g)},e.prototype._onRhsCurrenItemSelect=function(){}.bind(this),e.prototype._onRhsCurrenDropdownClick=function(){var a=this._oController.getView().byId("nrgAppFtrDetails-rhs");$("#nrgAppFtrDetails-rhs-currentDropdown-picker").height()>200&&(a.hasStyleClass("scrollBarAppear")?a.removeStyleClass("scrollBarAppear"):a.addStyleClass("scrollBarAppear"))},e.prototype.updateFooterRHS=function(a,d,e){this._updateRouting(a,d,e);var f,g="/FooterS",h=[],i=this._oController.getView().getModel("oRHSODataSvc"),j=(this._oController.getView().getModel("oFooterRHS"),!1),k=!1,l=!1;h.push(new b({path:"BP",operator:c.EQ,value1:a})),h.push(new b({path:"CA",operator:c.EQ,value1:d})),f={filters:h,success:function(a){var b,c,d,e=0,f=[],g=this._oController.getView().byId("nrgAppFtrDetails-rhs-currentItem");if(a.results.length>0){if(!this.rhsDropdown){for(b=0;b<a.results.length;b+=1)"C"===a.results[b].Type&&(j=!0,c=new ute.ui.commons.Tag({elem:"span",text:a.results[b].ProdName}),f.push(new ute.ui.main.DropdownItem({key:e+=1,content:c}).addStyleClass("nrgAppFtrDetails-rhs-currentDropdownItem")));this.rhsDropdown=new ute.ui.main.Dropdown("nrgAppFtrDetails-rhs-currentDropdown",{content:f,selectedKey:0,select:this._onRhsCurrenItemSelect}).addStyleClass("nrgAppFtrDetails-rhs-itemContent"),this.rhsDropdown.attachBrowserEvent("click",this._onRhsCurrenDropdownClick.bind(this)),this.rhsDropdown.placeAt(g)}for(d=0;d<a.results.length;d+=1)"P"===a.results[d].Type&&(k=!0,this._oController.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText(a.results[d].ProdName)),"H"===a.results[d].Type&&(l=!0,this._oController.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText(a.results[d].ProdName));j===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-currentItemContent").setText("None"),k===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText("None"),l===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText("None"),this.footerElement.rhsEmptySec.setVisible(!1),this.footerElement.rhsProdSec.setVisible(!0)}else j===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-currentItemContent").setText("None"),k===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-pendingItemContent").setText("None"),l===!1&&this._oController.getView().byId("nrgAppFtrDetails-rhs-historyItemContent").setText("None"),this.footerElement.rhsEmptySec.setVisible(!1),this.footerElement.rhsProdSec.setVisible(!0)}.bind(this),error:function(){this.footerElement.rhsEmptySec.setVisible(!0),this.footerElement.rhsProdSec.setVisible(!1)}.bind(this)},i&&i.read(g,f)},e.prototype._updateRouting=function(a,b,c){var d=this._oController.getView().getModel("oFooterRouting");d.setProperty("/BpNumber",a),d.setProperty("/CaNumber",b),d.setProperty("/CoNumber",c)},e.prototype.updateFooterCampaign=function(a,b,c){this._updateRouting(a,b,c),this._updateFooterCampaignContract(c),this._updateFooterCampaignButton(c)},e.prototype._updateFooterCampaignContract=function(a){var d,e="/CpgFtrS",f=[],g=this._oController.getView().getModel("oCompODataSvc"),h=this._oController.getView().getModel("oFooterCampaign");a&&(f.push(new b({path:"Contract",operator:c.EQ,value1:a})),d={filters:f,success:function(a){var b;if(a.results.length>0){for(b=0;b<a.results.length;b+=1)"C"===a.results[b].Type&&(h.setProperty("/Current",a.results[b]),"None"!==h.oData.Current.OfferTitle&&""!==h.oData.Current.OfferTitle&&this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-currentItem").addStyleClass("hasValue"),this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-currentItem").setText(h.oData.Current.OfferTitle),this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-startDateValue").setText(this._formatCampaignTime(h.oData.Current.StartDate)),this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-endDateValue").setText(this._formatCampaignTime(h.oData.Current.EndDate))),"PE"===a.results[b].Type&&(h.setProperty("/Pending",a.results[b]),"None"!==h.oData.Pending.OfferTitle&&""!==h.oData.Pending.OfferTitle&&this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-pendingItem").addStyleClass("hasValue"),this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-pendingItem").setText(h.oData.Pending.OfferTitle)),"H"===a.results[b].Type&&(h.setProperty("/History",a.results[b]),"None"!==h.oData.History.OfferTitle&&""!==h.oData.History.OfferTitle&&this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-historyItem").addStyleClass("hasValue"),this._oController.getView().byId("nrgAppFtrDetails-eligibleOffers-historyItem").setText(h.oData.History.OfferTitle));this.footerElement.campEmptySec.setVisible(!1),this.footerElement.campOfferSec.setVisible(!0),this.footerElement.campBtnSec.setVisible(!0)}else this.footerElement.campEmptySec.setVisible(!0),this.footerElement.campOfferSec.setVisible(!1),this.footerElement.campBtnSec.setVisible(!1)}.bind(this),error:function(){this.footerElement.campEmptySec.setVisible(!0),this.footerElement.campOfferSec.setVisible(!1),this.footerElement.campBtnSec.setVisible(!1)}.bind(this)},g&&g.read(e,d))},e.prototype._updateFooterCampaignButton=function(a){if(a){var b,c="/ButtonS("+a+")",d=this._oController.getView().getModel("oCompODataSvc"),e=this._oController.getView().getModel("oFooterCampaign");b={success:function(a){a.Contract&&("x"===a.FirstBill||"X"===a.FirstBill?(e.setProperty("/CampaignButtonText","Eligible offers Available"),e.setProperty("/CampaignFirstBill",!0)):(e.setProperty("/CampaignButtonText","No Eligible offers Available"),e.setProperty("/CampaignFirstBill",!1)),this._oController.getView().byId("nrgAppFtrDetails-campaignButton-itemTitle").setText(e.oData.CampaignButtonText),e.setProperty("/CampaignButtonType",a.InitTab))}.bind(this),error:function(){}.bind(this)},d&&d.read(c,b)}},e.prototype._formatCampaignTime=function(a){if(a){var b=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/yyyy"}),c=b.format(new Date(a.getTime()));return c}},e.prototype.onCampaignBtnClick=function(){var a=this._oController.getView().getModel("oFooterCampaign"),b=this._oController.getOwnerComponent().getRouter(),c=this._oController.getView().getModel("oFooterRouting");a.getProperty("/CampaignFirstBill")?b.navTo("campaignoffers",{bpNum:c.oData.BpNumber,caNum:c.oData.CaNumber,coNum:c.oData.CoNumber,typeV:a.getProperty("/CampaignButtonType")}):ute.ui.main.Popup.Alert({title:"No First Bill",message:"Customer has to completed at least One Month Invoice"})},e.prototype.onCampaignItemClick=function(a){var b=this._oController.getOwnerComponent().getRouter(),c=this._oController.getView().getModel("oFooterRouting"),d=a.getSource().getDomRef().childNodes[0];$(d).hasClass("currentItem")&&$(d).hasClass("hasValue")&&b.navTo("campaign",{bpNum:c.oData.BpNumber,caNum:c.oData.CaNumber,coNum:c.oData.CoNumber,typeV:"C"}),$(d).hasClass("pendingItem")&&$(d).hasClass("hasValue")&&b.navTo("campaign",{bpNum:c.oData.BpNumber,caNum:c.oData.CaNumber,coNum:c.oData.CoNumber,typeV:"PE"}),$(d).hasClass("historyItem")&&$(d).hasClass("hasValue")&&b.navTo("campaignhistory",{bpNum:c.oData.BpNumber,caNum:c.oData.CaNumber,coNum:c.oData.CoNumber})},e.prototype.reset=function(){var a=this._oController.getView();a.byId("appFtr").removeStyleClass("uteAppFtr-open"),this._getSubmenu().close()},e.prototype.setExpanded=function(a){a=!!a,a?this._getSubmenu().open():this._getSubmenu().close()},e.prototype.isExpanded=function(){return this._getSubmenu().isOpen()},e.prototype._registerEvents=function(){var a=this._oController.getView();a.byId("appFtrCaret").attachEvent("click",this._onFooterCaretClick,this)},e.prototype._onFooterCaretClick=function(){var a=this._oController.getView();a.byId("appFtr").toggleStyleClass("uteAppFtr-open"),this._getSubmenu().open()},e.prototype._onFooterSubmenuCaretClick=function(){var a=this._oController.getView();a.byId("appFtr").toggleStyleClass("uteAppFtr-open"),this._getSubmenu().close()},e.prototype._getSubmenu=function(){var a;return this._oSubmenu||(a=this._oController.getView(),this._oSubmenu=sap.ui.xmlfragment(a.getId(),"nrg.module.app.view.AppFooterDetails",this._oController),this._oSubmenu.setPosition(a.byId("appFtr"),"0 0"),a.addDependent(this._oSubmenu),a.byId("appFtrSMenuCaret").attachEvent("click",this._onFooterSubmenuCaretClick,this),this._oApp._initFooterContent()),this._oSubmenu},e});