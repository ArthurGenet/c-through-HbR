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

/*
 * Title: App Configuration Script
 * Author: Lisa Staehli
 * Date: 04/24/17
 * Description: Used to configure and link a webscene
 * with corresponding attributes for visualization
 * and statistics. A webscene with a scene service 
 * that contains the following required attributes on 
 * unit level for each feature needs to be set-up first: 
 * - building id (int)
 * - floor level (int)
 * - usage (string)
 * - area (float)
 */

define([
    "esri/core/declare",
    "esri/config",

    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",

    "esri/WebScene",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/Basemap",

    "esri/widgets/BasemapToggle",
    "esri/widgets/Home",

    "dojo/dom",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom-style",

    "esri/widgets/Search",

    "c-through/ToolsMenu",
    "c-through/welcome",
    "c-through/support/queryTools"

], function (
    declare, esriConfig,
    OAuthInfo, esriId,
    WebScene, SceneView, SceneLayer, Basemap,
    BasemapToggle, Home,
    dom, on, domCtr, win, domStyle,
    Search,
    ToolsMenu, Welcome, queryTools) {

		var info = new OAuthInfo({
			        // Swap this ID out with a registered application ID
			        appId: "BAg8hGLcdC75Aiwe",
			        // Uncomment the next line and update if using your own portal
			        // portalUrl: "https://<host>:<port>/arcgis"
			        // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
			        // authNamespace: "portal_oauth_inline",
			        popup: true
			    });

				esriId.registerOAuthInfos([info]);


        // application settings
        var settings_demo = {
            name: "Demo",
            url: "https://esrinederland.maps.arcgis.com",    // portal URL for config
            webscene: "d59683e18cca4008b61d4b7cb2572dbb",   // portal item ID of the webscene
            usagename: "ROOM_NAME",                             // usage attribute (string)
            floorname: "FLOOR_LEVEL",                           // floor attribute (int)
            OIDname: "OBJECTID",                            // objectid
            buildingIDname: "COMPLEX_NO",                   // building attribute (int)
            areaname: "ROOM_AREA",                           // area attribute (float)
            color: [      
                                             // color ramp for unique value renderer
                    //other 
                    [252, 146, 31, 1], //bijenkoste
                    [254, 224, 139, 1], //gemengde
                    [247, 137, 216, 1], //gezondheit
                    [183, 129, 74, 1], //industrie
                    [158, 85, 156, 1], //kantooor
                    
                    [107, 107, 214, 1], //logie
                    

                    [0,0,0],
                    [20, 158, 206, 1], //overig
                    
                    
                    [60, 175, 153, 1], //sport
                    [167, 198, 54, 1], // winkel
                    
                    [237, 81, 81, 1], //wonen

                    [107, 107, 214, 1],
                    
                    [251, 128, 114, 1],
                    [214, 96, 77, 1],
                    [209, 229, 240, 1],
                    [254, 224, 182, 1]
                ]
        };

        return declare(null, {

            constructor: function () {

            },

            init: function (settings) {



                // destroy welcome page when app is started
                domCtr.destroy("welcome");

                // create header with title according to choice on welcome page
                var header = domCtr.create("div", { id: "header" }, win.body());
                domCtr.create("div", { id: "headerTitle" }, header);

                // get settings from choice on welcome page
                this.settings = this.getSettingsFromUser(settings);

                console.log("bah bien sur");

                
			    

                // set portal url
                esriConfig.portalUrl = this.settings.url;

                // fix CORS issues by adding portal url to cors enabled servers list
                esriConfig.request.corsEnabledServers.push("http://zurich.maps.arcgis.com");



                // load scene with portal ID
                this.scene = new WebScene({
                    portalItem: {
                        id: this.settings.webscene
                    },
                    basemap: "topo"
                });

                // create a view
                this.view = new SceneView({
                    container: "viewDiv",
                    map: this.scene,
                    qualityProfile: "high"
                });

                // environment settings for better visuals (shadows)
                this.view.environment.lighting.ambientOcclusionEnabled = true;
                this.view.environment.lighting.directShadowsEnabled = true;



                // create home button that leads back to welcome page
                var home = domCtr.create("div", { className: "button", id: "homeButton", innerHTML: "Home" }, header);

                on(home, "click", function () {
                    var URI = window.location.href;
                    var newURI = URI.substring(0, URI.lastIndexOf("?"));
                    window.location.href = newURI;
                }.bind(this));

                // create home widget for scene view
                var homeWidget = new Home({
                    view: this.view
                });
                this.view.ui.add(homeWidget, "top-left");
                

                // wait until view is loaded
                this.view.when(function () {
                    // layer1 = active layer (receives renderers, used for statistics, selected)
                    // layer2 = background layer (shows remaining buildings, not selected)

                    // retrieve active layer from webscene
                    this.settings.layer1 = [];
                    for (let i = 0; i<9; i+=1){
						this.settings.layer1.push(this.scene.layers.getItemAt(i));
                    }
                                
                    console.log(this.settings.layer1);
                    
                    //this.settings.layer1.popupTemplate =popup;

                    // create background layer (identical copy of active layer) for highlighting and add it to the scene
                    
                    this.settings.layer2 = [];
                    for (let i = 0; i<9; i+=1){

						this.settings.layer2.push(new SceneLayer({
	                        url: this.settings.layer1.url,
	                        popupEnabled: false
                    }));

                    }

                    
                    this.settings.render = this.settings.layer1[0].renderer;


                    this.scene.add(this.settings.layer2[0]);

                    for (let i = 0; i<9; i+=1){
                    	this.settings.layer1[i].visible = true;

                    	this.settings.layer2[i].visible = false;
                    }

                    
                    console.log("oklm");
                    // retrieve distinct values of usage attribute from feature service to create UI (filter dropdowns)
                    for (let i = 0; i<9; i+=1){
                    queryTools.distinctValues(this.settings.layer1[i], this.settings.usagename, this.settings.OIDname, function (distinctValues) {
                    	console.log("c'est passé");
                        distinctValues.sort();
                        console.log(i);
                        console.log(distinctValues);
                        if(i==0){
                        	this.settings.values = distinctValues;
                        }
                        else{
                        	this.settings.values = this.settings.values.concat(distinctValues);

                        }
                        console.log(this.settings.values);
                        if (i==8){
                        	// initiliaze tools menu with state
                        this.menu = new ToolsMenu({
                            config: this.settings,
                            map: this.scene,
                            view: this.view,
                            state: {
                                highlight: {
                                    name: "city",
                                    features: undefined
                                },
                                viz: {
                                    name: "white"
                                },
                                filter: {
                                    name: "none",
                                    usageFeatures: undefined,
                                    areaFeatures: undefined,
                                    floorFeatures: undefined
                                },
                                combinedFilteredFeatures: undefined
                            }
                        });
                        }
                        
                    }.bind(this))};

                }.bind(this)).otherwise(function (err) {
                    console.error(err);
                });

            },


            getSettingsFromUser: function (settings) {
                if (settings === "demo"){
                    dom.byId("headerTitle").innerHTML = "Gebouwenverkenner: c-through";
                    return settings_demo;
                }
            }
        });
    });




