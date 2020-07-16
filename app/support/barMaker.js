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
    "esri/tasks/support/Query",

    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom",

    "c-through/support/applyRenderer",
    "c-through/support/queryTools"

], function (
    declare, Query,
    domCtr, win, on, dom,
    applyRenderer, queryTools
) {
        return {

            createChartData: function (selection, settings, bins) {

                this.selection = selection;

                var chartData = [];
                var kernel = [];
                var totalrange = [];

                if (bins > selection.length) {
                    bins = selection.length - 1;
                }

                for (var j = 0; j < selection.length; j++) {
                    totalrange.push(selection[j].attributes[settings.areaname]);
                }

                function maxIterate(arr) {
                    var max = arr[0];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] > max) {
                            max = arr[i];
                        }
                    }
                    return max;
                }

                function minIterate(arr, max) {
                    var min = max;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] < min) {
                            min = arr[i];
                        }
                    }
                    return min;
                }

                var max = maxIterate(totalrange);
                var min = minIterate(totalrange, max);

                if (Math.round(min) === 1) {
                    min = 0;
                }

                var kernelwidth = (max - min) / bins;

                if (kernelwidth > 1000) {
                    kernelwidth = 500 * Math.round(kernelwidth / 500);
                }
                else if (kernelwidth < 1000 && kernelwidth > 500) {
                    kernelwidth = 250 * Math.round(kernelwidth / 250);
                }
                else if (kernelwidth < 500 && kernelwidth > 200) {
                    kernelwidth = 100 * Math.round(kernelwidth / 100);
                }
                else if (kernelwidth < 200 && kernelwidth > 100) {
                    kernelwidth = 50 * Math.round(kernelwidth / 50);
                }
                else if (kernelwidth < 100 && kernelwidth > 50) {
                    kernelwidth = 10 * Math.round(kernelwidth / 10);
                }
                else if (kernelwidth < 50 && kernelwidth > 10) {
                    kernelwidth = 5 * Math.round(kernelwidth / 5);
                }
                else {
                    kernelwidth = Math.round(kernelwidth);
                }

                min = kernelwidth * Math.round(min / kernelwidth);

                var bins_new = (max - min) / kernelwidth;

                
                console.log(kernel);
                console.log(max);

                if(max > 2000){
                    console.log("oui");
                    if(max > 10000){
                        kernel = [{min:0,max:25},{min:25,max:50},{min:50,max:100},{min:100,max:250},{min:250,max:500},{min:500,max:1000},{min:1000,max:20000}]
                    }
                    else{
                        kernel = [{min:0,max:25},{min:25,max:50},{min:50,max:100},{min:100,max:250},{min:250,max:500},{min:500,max:1000},{min:1000,max:7500}]
                    }
                }

                else{
                    // set up bins with ranges
                    for (var n = 0; n < bins_new; n++) {
                        kernel.push({
                            min: min,
                            max: min + kernelwidth
                        });
                        min += kernelwidth;
                    }
                }

                var color = [];

                if (bins_new > 6) {
                    color = ["#FBE789", "#E2DD8C", "#C9D38F", "#B0CA93", "#97C096", "#7EB699", "#65AD9D", "#4CA3A0", "#3399A3", "#1B90A7"];

                }
                else {
                    color = ["#FBE789", "#CED58F", "#A1C495", "#74B29B", "#47A1A1", "#1B90A7"];
                }


                
                
                for (var i = 0; i < kernel.length; i++) {
                    chartData.push({
                        kernel: Math.round(kernel[i].min) + "m2 - " + Math.round(kernel[i].max) + "m2",
                        count: 0,
                        subdata: [
                            { min: kernel[i].min, max: kernel[i].max }
                        ],
                        "color": color[i]
                    });
                }
                console.log(kernel);
                for (var k = 0; k < totalrange.length; k++) {
                    for (var m = 0; m < kernel.length; m++) {
                        if (totalrange[k] > kernel[m].min && totalrange[k] <= kernel[m].max) {
                            chartData[m].count += 1;
                        }
                    }
                }
                console.log(chartData);
                return chartData;
            },


            createChart: function (selection, data, settings, state, view, callback) {
                console.log(data);
                var chart = AmCharts.makeChart("chartDiv", {
                    "type": "serial",
                    "theme": "light",
                    "sequencedAnimation": false,
                    "dataProvider": data,
                    "fontSize": 12,
                    "fontFamily": "Avenir LT W01 65 Medium",
                    "valueAxes": [{
                        "gridColor": "#FFFFFF",
                        "gridAlpha": 0.2,
                        "dashLength": 0
                    }],
                    "gridAboveGraphs": true,
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "[[category]]: <b>[[value]]</b>",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0,
                        "fillColorsField": "color",
                        "type": "column",
                        "valueField": "count"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "kernel",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "labelRotation": 45,
                        "gridAlpha": 0,
                        "tickPosition": "start",
                        "tickLength": 20
                    },
                    "export": {
                        "enabled": true
                    }

                });

                callback("loaded");

                chart.addListener("clickGraphItem", function (event) {

                    var max = event.item.dataContext.subdata[0].max;
                    var min = event.item.dataContext.subdata[0].min;
                    var color = event.item.dataContext.color;

                    settings.layer1.renderer = applyRenderer.createRendererVVbar(min, max, color, settings.areaname);
                    
                    view.environment.lighting.directShadowsEnabled = false;
                    view.environment.lighting.ambientOcclusionEnabled = false;
                });

                on(dom.byId("reload"), "click", function (event) {

                    settings.layer1.renderer = applyRenderer.createRendererVV(selection, settings.areaname);
                    
                    view.environment.lighting.directShadowsEnabled = true;
                    view.environment.lighting.ambientOcclusionEnabled = true;
                });

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
