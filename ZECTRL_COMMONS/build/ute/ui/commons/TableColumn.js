sap.ui.define(["jquery.sap.global","sap/ui/core/Control"],function(a,b){"use strict";var c=b.extend("ute.ui.commons.TableColumn",{metadata:{library:"ute.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},sortable:{typr:"boolean",group:"Behavior",defaultValue:!1}},defaultAggregation:"cells",aggregations:{cells:{type:"sap.ui.core.Control",multiple:!0,singularName:"cell"}},events:{press:{}}}});return c.prototype.onclick=function(a){this.getSortable()&&this.firePress({}),a.preventDefault(),a.stopPropagation()},c},!0);