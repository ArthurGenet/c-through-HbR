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
    "esri/webscene/Slide",

    "dojo/dom",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom-style",

    "c-through/ToolsMenu",
    "c-through/welcome",
    "c-through/support/queryTools"

], function (
    declare, esriConfig,
    OAuthInfo, esriId,
    WebScene, SceneView, SceneLayer, Basemap,
    BasemapToggle, Home, Slide,
    dom, on, domCtr, win, domStyle,
    ToolsMenu, Welcome, queryTools) {

        var info = new OAuthInfo({
                    // Swap this ID out with a registered application ID
                    appId: "BAg8hGLcdC75Aiwe",
                    // Uncomment the next line and update if using your own portal
                    // portalUrl: "https://<host>:<port>/arcgis"
                    // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
                    authNamespace: "portal_oauth_inline",
                    popup: true
                });

                esriId.registerOAuthInfos([info]);

        // application settings
        var settings_demo = {
            name: "Demo",
            url: "https://esrinederland.maps.arcgis.com",    // portal URL for config
            webscene: "fe0f3de49e824ecf9184cb04a59b0ff1",   // portal item ID of the webscene
            usagename: "ROOM_NAME",                             // usage attribute (string)
            floorname: "FLOOR_LEVEL_2",                           // floor attribute (int)
            OIDname: "OBJECTID",                            // objectid
            buildingIDname: "COMPLEX_NO",                   // building attribute (int)
            areaname: "ROOM_AREA",                           // area attribute (float)
            color: [[199, 242, 203], [20, 171, 71], [154, 101, 241], [160, 56, 166], [124, 7, 157], [34, 160, 114], [246, 230, 140], [95, 31, 89], [75, 190, 162], [143, 129, 128], [147, 42, 72], [54, 235, 216], [27, 29, 74], [20, 41, 165], [8, 233, 46], [52, 158, 59], [97, 193, 178], [122, 112, 130], [42, 225, 202], [173, 42, 227], [244, 90, 72], [75, 167, 221], [251, 61, 248], [96, 136, 208], [31, 194, 187], [201, 223, 127], [152, 149, 168], [131, 10, 51], [107, 83, 127], [202, 138, 222], [108, 170, 72], [50, 74, 5], [245, 115, 166], [173, 49, 143], [185, 142, 211], [27, 183, 45], [251, 200, 135], [29, 243, 212], [107, 59, 9], [201, 241, 35], [214, 219, 168], [18, 6, 192], [105, 114, 204], [38, 18, 130], [10, 204, 72], [196, 162, 84], [26, 151, 86], [49, 8, 71], [11, 71, 100], [177, 246, 111], [57, 213, 33], [32, 68, 56], [127, 216, 67], [58, 60, 1], [184, 185, 203], [76, 138, 238], [128, 144, 16], [165, 209, 154], [163, 102, 126], [155, 132, 0], [87, 132, 78], [232, 159, 19], [100, 159, 86], [211, 105, 16], [66, 169, 22], [55, 47, 236], [154, 127, 227], [176, 2, 131], [186, 64, 140], [120, 181, 225], [66, 121, 189], [84, 29, 232], [76, 131, 41], [47, 117, 137], [67, 209, 36], [58, 115, 2], [238, 148, 63], [179, 141, 124], [79, 61, 229], [40, 58, 117], [156, 24, 244], [203, 160, 221], [181, 35, 35], [15, 227, 197], [7, 59, 136], [52, 9, 133], [149, 153, 6], [147, 62, 70], [139, 156, 17], [219, 228, 42], [185, 235, 159], [212, 209, 48], [207, 170, 27], [36, 62, 180], [1, 154, 196], [51, 227, 254], [229, 75, 109], [60, 143, 100], [161, 196, 206], [90, 217, 202], [226, 165, 164], [124, 30, 5], [199, 57, 250], [78, 145, 181], [185, 223, 200], [2, 116, 93], [129, 203, 249], [222, 161, 39], [129, 205, 195], [207, 136, 243], [83, 37, 164], [110, 252, 226], [22, 73, 155], [198, 213, 80], [83, 41, 156], [14, 46, 149], [233, 41, 112], [245, 15, 240], [138, 90, 52], [8, 111, 221], [184, 254, 194], [196, 39, 142], [6, 7, 87], [80, 225, 35], [193, 32, 230], [145, 247, 167], [98, 248, 202], [101, 103, 1], [185, 20, 145], [212, 45, 154], [160, 200, 92], [123, 30, 59], [144, 81, 160], [115, 190, 167], [196, 156, 84], [145, 221, 184], [144, 36, 227], [69, 170, 202], [212, 11, 147], [90, 59, 163], [238, 115, 210], [24, 204, 18], [56, 161, 159], [229, 75, 42], [212, 154, 243], [50, 195, 180], [144, 49, 219], [22, 149, 25], [6, 199, 145], [220, 155, 202], [97, 120, 17], [175, 154, 88], [52, 185, 62], [73, 217, 233], [92, 55, 108], [73, 110, 111], [57, 125, 97], [221, 143, 9], [104, 150, 134], [10, 35, 61], [130, 169, 114], [180, 60, 170], [168, 251, 178], [6, 230, 235], [17, 217, 96], [75, 138, 169], [126, 142, 66], [74, 75, 225], [18, 159, 173], [203, 227, 178], [28, 128, 164], [21, 82, 202], [8, 185, 129], [6, 12, 78], [100, 91, 206], [12, 102, 50], [30, 103, 231], [127, 146, 118], [95, 98, 66], [235, 45, 62], [227, 79, 203], [13, 87, 42], [84, 241, 57], [108, 5, 137], [154, 69, 201], [119, 113, 176], [85, 126, 47], [244, 53, 150], [63, 182, 147], [162, 134, 216], [90, 93, 14], [36, 119, 27], [111, 218, 40], [179, 145, 33], [10, 9, 109], [13, 147, 141], [151, 38, 101], [154, 133, 220], [129, 69, 74], [198, 20, 106], [235, 23, 68], [246, 121, 202], [16, 251, 245], [247, 105, 17], [204, 55, 156], [100, 100, 100], [200, 4, 110], [30, 240, 9], [20, 119, 230]]
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


                console.log(this.scene);
                console.log(this.scene.initialViewProperties);

        




        this.view.ui.add([ "slidesDiv"], "top-right");

        		var view =this.view;
                function createSlideUI(slide, placement) {
                	console.log("create slide")
		          /*********************************************************************
		           * Create a new <div> element which contains all the slide information.
		           * Store a reference to the created DOM node so we can use it to place
		           * other DOM nodes and connect events.
		           *********************************************************************/
		          var slideElement = document.createElement("div");
		          // Assign the ID of the slide to the <span> element
		          slideElement.id = slide.id;
		          slideElement.classList.add("slide");

		          /*********************************************************************
		           * Place the newly created DOM node cat the beginning of the slidesDiv
		           *********************************************************************/
		          var slidesDiv = document.getElementById("slidesDiv");
		          if (placement === "first") {
		          	console.log("ok");
		            slidesDiv.insertBefore(slideElement, slidesDiv.firstChild);
		          } else {
		          	console.log("ta");
		            slidesDiv.appendChild(slideElement);
		          }

		          /*********************************************************************
		           * Create a <div> element to contain the slide title text
		           *********************************************************************/
		          var title = document.createElement("div");
		          title.innerText = slide.title.text;
		          // Place the title of the slide in the <div> element
		          slideElement.appendChild(title);

		          /*********************************************************************
		           * Set up a click event handler on the newly created slide. When clicked,
		           * the code defined below will execute.
		           *********************************************************************/
		          slideElement.addEventListener("click", function () {
		          	console.log("click");
		            /*******************************************************************
		             * Remove the "active" class from all elements with the .slide class
		             *******************************************************************/
		            var slides = document.querySelectorAll(".slide");
		            console.log(slides);
		            Array.from(slides).forEach(function (node) {
		              node.classList.remove("active");
		            });
		            console.log("okk");
		            console.log(slideElement);
		            /*******************************************************************
		             * Add the "active" class on the current element being selected
		             *******************************************************************/
		            slideElement.classList.add("active");
		            console.log("okkkk");
		            /******************************************************************
		             * Applies a slide's settings to the SceneView.
		             *
		             * Each slide has a viewpoint and visibleLayers property that define
		             * the point of view or camera for the slide and the layers that should
		             * be visible to the user when the slide is selected. This method
		             * allows the user to animate to the given slide's viewpoint and turn
		             * on its visible layers and basemap layers in the view.
		             ******************************************************************/
		             console.log(slide);
		            slide.applyTo(view);
		            console.log("okkkkkkkkk");
		          });
		        }

		        








                
                var windowHitht = document.documentElement.clientHeight;
                     toolsMenuInnerBox.style.height = windowHitht - 50 + "px";
                     window.addEventListener("resize", function(){
                         windowHitht = document.documentElement.clientHeight;
                         toolsMenuInnerBox.style.height = windowHitht - 50 + "px";
                     });

                // wait until view is loaded
                this.view.when(function () {

                  document.getElementById("slidesDiv").style.visibility = "visible";

		          /*********************************************************************
		           * The slides are a collection inside the presentation property of
		           * the WebScene.
		           *********************************************************************/
		          var slides = this.scene.presentation.slides;
		          console.log(slides);

		          /*********************************************************************
		           * Loop through each slide in the collection and render the slide
		           *********************************************************************/
		          slides.forEach(createSlideUI);






                    // layer1 = active layer (receives renderers, used for statistics, selected)
                    // layer2 = background layer (shows remaining buildings, not selected)

                    // retrieve active layer from webscene
                    this.settings.layer1 = this.scene.layers.getItemAt(2);
                    console.log(this.settings.layer1);
                    console.log(this.settings.layer1.title);
                    console.log(this.settings.layer1.fields);

                    // create background layer (identical copy of activ layer) for highlighting and add it to the scene
                    this.settings.layer2 = new SceneLayer({
                        url: this.settings.layer1.url,
                        popupEnabled: false
                    });
                    this.scene.add(this.settings.layer2);

                    this.settings.layer1.visible = true;
                    this.settings.layer2.visible = false;

                    // retrieve distinct values of usage attribute from feature service to create UI (filter dropdowns)
                    queryTools.distinctValues(this.settings.layer1, this.settings.usagename, this.settings.OIDname, function (distinctValues) {

                        distinctValues.sort();
                        this.settings.values = distinctValues;

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
                    }.bind(this));

                }.bind(this)).otherwise(function (err) {
                    console.error(err);
                });
                var firstSlide = this.scene.presentation.slides.getItemAt(0);
console.log(firstSlide);
firstSlide.applyTo(this.view).then(function() {
  // Slide has been successfully applied to the view
});

            },

            getSettingsFromUser: function (settings) {
                if (settings === "demo"){
                    dom.byId("headerTitle").innerHTML = "Gebouwenverkenner: c-through HbR";
                    return settings_demo;
                }
            }
        });
    });




