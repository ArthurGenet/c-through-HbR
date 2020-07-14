 /* Copyright 2017 Esri

   Licensed under the Apache License, Version 2.0 (the "License");

   you may not use this file except in compliance with the License.

   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software

   distributed under the License is distributed on an "AS IS" BASIS,

   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and

   limitations under the License.
   ​
   */

define([
    "esri/core/declare",

    "dojo/dom-construct",
    "dojo/_base/window",

    "c-through/support/applyRenderer"

], function (
    declare,
    domCtr, win,
    applyRenderer
) {
        return {

            createChartData: function (selection, settings) {

                var color = this.rgbToHex(settings.color);

                var chartData = [];

                for (var j = 0; j < settings.values.length; j++) {
                    chartData.push({
                        usage: settings.values[j],
                        area: 0,
                        color: color[j]
                    });
                }
                for (var k = 0; k < selection.length; k++) {
                    var selectionusage = selection[k].attributes[settings.usagename];
                    var selectionarea = selection[k].attributes[settings.areaname];
                    for (var m = 0; m < chartData.length; m++) {
                        if (selectionusage === chartData[m].usage) {
                            chartData[m].area += selectionarea;
                        }
                    }
                }

                for (var i = 0; i < chartData.length; i++) {
                    chartData[i].area = Math.round(chartData[i].area);
                }

                return chartData;
            },


            createChart: function (view, data, settings, state, callback) {

                var color = this.rgbToHex(settings.color);

                var groupPercentValue = 0;

                if (settings.name !== "Zurich") {
                    groupPercentValue = "2";
                }

                console.log(data);

                


                var chart = am4core.create("chartdiv", am4charts.PieChart);
                chart.data = data;




                console.log(chart);
                console.log(chart.type);
                console.log(chart.series);
                // Add and configure Series
                var pieSeries = chart.series.push(new am4charts.PieSeries()); 
                pieSeries.dataFields.value = "area";
                pieSeries.dataFields.category = "usage";




                pieSeries.labels.template.paddingTop = 0;
                pieSeries.labels.template.paddingBottom = 0;
                pieSeries.labels.template.fontSize = 8;
                callback("loaded");

            },

            rgbToHex: function (color) {

                var colorhex = [];

                for (var i = 0; i < color.length; i++) {
                    var r = color[i][0];
                    var g = color[i][1];
                    var b = color[i][2];

                    var hex = "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);

                    colorhex.push(hex);
                }

                return colorhex;
            },

            componentToHex: function (c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
        };
    });
