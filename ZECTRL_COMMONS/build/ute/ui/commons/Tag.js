sap.ui.define(["sap/ui/core/Control"],function(a){"use strict";var b=a.extend("ute.ui.commons.Tag",{metadata:{library:"ute.ui.commons",properties:{elem:{type:"string",defaultValue:"div"},type:{type:"string",defaultValue:null},text:{type:"string",defaultValue:""},width:{type:"string",defaultValue:""}},aggregations:{content:{type:"sap.ui.core.Control",multiple:!0,singularName:"content"}},defaultAggregation:"content"}});return b},!0);