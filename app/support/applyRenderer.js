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

    "esri/renderers/SimpleRenderer",
    "esri/symbols/MeshSymbol3D",
    "esri/symbols/FillSymbol3DLayer",
    "esri/renderers/UniqueValueRenderer"

], function (
    declare,
    SimpleRenderer,
    MeshSymbol3D,
    FillSymbol3DLayer,
    UniqueValueRenderer

) {

        return {

            createSimpleRenderer: function () {
                return new SimpleRenderer({
                    symbol: new MeshSymbol3D({
                        symbolLayers: [
                            new FillSymbol3DLayer({
                                material: { color: "#3399FF" }
                            })
                        ]
                    })
                });

            },

            createRenderer: function (values, color, fieldname) {
                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: [135, 135, 135, 0.2]
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    field: fieldname,
                    uniqueValueInfos: this.createValueInfos(values, color)
                });
            },

            createValueInfos: function (values, color) {

                var fields = [];

                for (var i = 0; i < values.length; i++) {
                    fields.push({
                        value: values[i],
                        color: color[i]
                    });
                }

                var valueInfos = [];
                for (var j = 0; j < fields.length; j++) {
                    valueInfos.push(
                        {
                            "value": values[j],
                            "symbol": this.createSymbol(color[j]),
                            "label": values[j]
                        }
                    );
                }
                return valueInfos;
            },

            createSymbol: function (color) {
                return new MeshSymbol3D({
                    symbolLayers: [new FillSymbol3DLayer({
                        material: {
                            color: color
                        }
                    })]
                });
            },

            applyOpacity: function (fieldname, alpha, values) {
                var opacVisVar = {
                    type: "opacity",
                    field: fieldname,
                    stops: this.createStops(alpha, values)
                };

                return opacVisVar;

            },

            createStops: function (alpha, values) {
                var stops = [];

                for (var i = 0; i < values.length; i++) {
                    if (i === 0) {
                        stops.push({
                            value: values[0],
                            opacity: alpha[0]
                        });
                    }
                    stops.push({
                        value: values[i],
                        opacity: alpha[i]
                    });
                }
            },

            createRendererVV: function (selection, fieldname) {
                console.log(selection);
                console.log(fieldname);
                var totalrange = [];

                
                for (var j = 0; j < selection.length; j++) {
                    if (selection[j].attributes[fieldname] !== null) {
                        totalrange.push(selection[j].attributes[fieldname]);
                    }
                    else{
                       totalrange.push(100);
                    }
                }
                console.log(totalrange);
                var valuemax = Math.ceil(Math.max.apply(Math, totalrange));
                var valuemax2 = 0;
                var valuemin = Math.floor(Math.min.apply(Math, totalrange));

                if (valuemax == 15624){
                    var index = totalrange.indexOf(15623.4);
                    totalrange[index]=10;
                    var index2 = totalrange.indexOf(6595.6);
                    totalrange[index2]=10;
                    var valuemax2 = 1000;
                }
                else{
                   var valuemax2 = valuemax 
                }

                console.log(totalrange);
                console.log(index);
                console.log(valuemax);
                console.log(valuemax2);
                console.log(valuemin);
                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: "white"
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    visualVariables: [{
                        type: "color",
                        field: fieldname,
                        stops: [
                            { value: valuemin, color: "#FBE789" },
                            { value: valuemax2, color: "#83BDB0" }                        ]
                    }]

                });
            },

            createRendererVVbar: function (min, max, color, fieldname) {

                console.log(min);
                console.log(max);
                console.log(color);
                var defaultcolor = [135, 135, 135, 0.2];

                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: defaultcolor
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    visualVariables: [{
                        type: "color",
                        field: fieldname,
                        stops: [
                            { value: min-0.01, color: defaultcolor},
                            { value: min, color: color },
                            { value: max, color: color },
                            { value: max+0.01, color: defaultcolor}
                        ]
                    }]

                });
            }
        };
    }
);