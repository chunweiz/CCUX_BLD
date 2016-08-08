sap.ui.define(["jquery.sap.global","sap/ui/core/Control","sap/ui/thirdparty/d3"],function(a,b){"use strict";var c=b.extend("nrg.module.usage.view.UsageHistoryChart",{metadata:{properties:{width:{type:"int",defaultValue:1e3},height:{type:"int",defaultValue:300},consumptionGroup:{type:"string",defaultValue:"RES"}}},renderer:function(a,b){a.write("<div"),a.writeControlData(b),a.addClass("tmUsageHistChart"),a.writeClasses(),a.write(">"),a.write("</div>")}});return c.prototype.onInit=function(){},c.prototype.onBeforeRendering=function(){},c.prototype.onAfterRendering=function(){this._createChart(),this._createTemperatureChart()},c.prototype.onExit=function(){this._oDataModel=null},c.prototype.refreshChart=function(){this.rerender()},c.prototype.setDataModel=function(a){return this._oDataModel=a,this},c.prototype.getDataModel=function(){return this._oDataModel},c.prototype._getDataSet=function(){if(!this.getDataModel())return[];var b=a.extend(!0,[],this.getDataModel().getData().data),c=d3.time.format("%x").parse;return b.forEach(function(a){a.meterReadDate=c(a.meterReadDate)},this),b},c.prototype._createChart=function(){function a(a){var b=[e(a.meterReadDate),h(a.kwhUsage)];q.select("path").attr("transform","translate("+[b[0]-52,b[1]-55]+")"),q.select("text").attr("transform","translate("+[b[0],b[1]-40]+")").text(a.kwhUsage),q.style("display",null)}function b(){q.style("display","none")}var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r={top:50,right:40,bottom:100,left:80},s=this.getWidth()-r.left-r.right,t=this.getHeight()-r.top-r.bottom-50,u=this._getDataSet();u&&u.length>0&&(c=d3.select("#"+this.getId()).append("svg").attr("width",this.getWidth()).attr("height",this.getHeight()-50).append("g").attr("transform","translate("+[r.left,r.top]+")"),d=d3.extent(u,function(a){return a.meterReadDate}),d[0]=new Date(d[0].getFullYear(),d[0].getMonth(),1),d[1]=new Date(d[1].getFullYear(),d[1].getMonth()+1,0),e=d3.time.scale().domain(d).range([0,s]),f="REBS"===this.getConsumptionGroup()?1e3:500,g=d3.max(u,function(a){return a.kwhUsage}),h=d3.scale.linear().domain([0,g+(f-g%f)]).range([t,0]),i=s/u.length,j=this.getId()+"-oddBgGradient",k=this.getId()+"-evenBgGradient",c.append("linearGradient").attr("id",j).attr("x1","0%").attr("y1","0%").attr("x2","0%").attr("y2","0%").selectAll("stop").data([{offset:"0%",stopColor:"#a3bece"},{offset:"100%",stopColor:"#a3bece"}]).enter().append("stop").attr("offset",function(a){return a.offset}).attr("stop-color",function(a){return a.stopColor}),c.append("linearGradient").attr("id",k).attr("x1","0%").attr("y1","0%").attr("x2","0%").attr("y2","100%").selectAll("stop").data([{offset:"5%",stopColor:"#b5cbd8"},{offset:"95%",stopColor:"#9cadb8"}]).enter().append("stop").attr("offset",function(a){return a.offset}).attr("stop-color",function(a){return a.stopColor}),c.append("g").selectAll("rect").data(u).enter().append("rect").attr("transform",function(a,b){return"translate("+b*i+",0)"}).attr("height",t).attr("width",i).style("fill",function(a,b){var c=(b+1)%2===0?k:j;return"url(#"+c+")"}),l=d3.svg.axis().orient("bottom").scale(e).tickValues(u.map(function(a){return a.meterReadDate})).tickFormat(d3.time.format("%m/%d/%y")),c.append("g").attr("class","tmUsageHistChart-consumptionXAxis").attr("transform","translate(0,"+(t+20)+")").call(l).selectAll("text").style("text-anchor","middle").attr("dx","-.5em").attr("dy",".15em").attr("transform","rotate(-65)"),n=d3.svg.axis().orient("left").scale(h).ticks(Math.floor(g/f)+1).tickFormat(d3.format("d")),c.append("g").attr("class","tmUsageHistChart-consumptionYAxis").call(n),c.select("g.tmUsageHistChart-consumptionYAxis").append("text").attr("class","tmUsageHistChart-consumptionYAxisLabel").attr("x",-t/2).attr("y",-65).attr("transform","rotate(-90)").text("kWh"),c.append("g").selectAll("line").data(u).enter().append("line").attr("class","tmUsageHistChart-consumptionXGrid").attr("x1",function(a,b){return b*i}).attr("y1",0).attr("x2",function(a,b){return b*i}).attr("y2",t),m=d3.svg.axis().orient("left").scale(h).ticks(Math.floor(g/f)+1).tickSize(-s,0,0).tickFormat(""),c.append("g").attr("class","tmUsageHistChart-consumptionYGrid").call(m),o=d3.svg.line().x(function(a){return e(a.meterReadDate)}).y(function(a){return h(a.kwhUsage)}),c.append("g").append("path").attr("d",o(u)).attr("class","tmUsageHistChart-consumptionLine"),p=c.append("g").selectAll("circle.tmUsageHistChart-consumptionPoint").data(u).enter().append("circle").attr("r","7").attr("cx",function(a){return e(a.meterReadDate)}).attr("cy",function(a){return h(a.kwhUsage)}).attr("class","tmUsageHistChart-consumptionPoint"),q=c.append("g").attr("class","tmUsageHistChart-consumptionPointTooltip").style("display","none"),q.append("path").attr("d","M1,16 C1,7.71572875 7.71655983,1 15.9980512,1 L86.0019488,1 C94.2851438,1 101,7.71390727 101,16 L101,16 C101,24.2842712 94.2823898,31 86.0015316,31 L59.3333333,31 L51,41 L42.6666667,31 L15.9984684,31 C7.71504305,31 1,24.2860927 1,16 L1,16 Z"),q.append("text").attr("dy","0.35em"),p.on("mouseover",a),p.on("mouseout",b))},c.prototype._createTemperatureChart=function(){var a,b,c,d,e={top:0,right:60,bottom:0,left:100},f=this.getWidth()-e.left-e.right,g=30,h=this._getDataSet();h&&h.length>0&&(a=d3.select("#"+this.getId()).append("svg").attr("width",this.getWidth()).attr("height",g),a=a.append("g").attr("transform","translate("+[e.left,e.top]+")"),a.append("text").attr("class","tmUsageHistChart-temperatureYAxisLabel").attr("x",-e.left+15).attr("y",g/2).attr("dy","0.35em").text("Temperature"),b=d3.scale.linear().domain([30,100]).range(["#3597ce","#c1563f"]).clamp(!0),c=f/h.length,d=a.append("g").selectAll("g.tmUsageHistChart-temperature").data(h).enter().append("g").attr("class","tmUsageHistChart-temperature").attr("transform",function(a,b){return"translate("+b*c+",0)"}),d.append("rect").attr("class","tmUsageHistChart-temperatureBar").attr("height",g).attr("width",c).style("fill",function(a){return b(a.avgHighTemp)}),d.append("text").attr("class","tmUsageHistChart-temperatureText").attr("x",c/2).attr("y",g/2).attr("dy","0.35em").text(function(a){return a.avgHighTemp}))},c});