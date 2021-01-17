var coverage = localStorage.name;
document.getElementById("coverage").innerHTML = coverage;
var URL = `https://ows.rasdaman.org/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=DescribeCoverage&COVERAGEID=${coverage}`;

loadDoc(URL, myFunction1);

var myButton = document.getElementsByClassName("popup-trigger")[0];
/**
* This function listens to event clik on button q
* then it logs the cube view after clearing the containers
* @param {e}  event of click
* @returns {} 
*/
myButton.onclick = function (e) {
  if (document.getElementById("container").innerHTML === "") {
    loadDoc(URL, myFunction1);
  } else {
    // alert(e.target.getAttribute("data-modal"));
    removeScene();
    loadDoc(URL, myFunction1);
  }
};

var myButton2 = document.getElementsByClassName("popup-trigger2")[0];

/**
* This function listens to event clik on button q
* then it logs the orthoghonal sides view after clearing the containers
* @param {e}  event of click
* @returns {} 
*/
myButton2.onclick = function (e) {
  if (document.getElementById("container").innerHTML === "") {
    loadDoc(URL, myFunction2);
  } else {
    //alert(e.target.getAttribute("data-modal"));
    removeScene();
    loadDoc(URL, myFunction2);
  }
};

/**
* This function clears a three.js scene, by deleting all instances on the DOM
* For example all containers will lose their Three.js  elements
* @param {} 
* @returns {} 
*/
function removeScene() {
  deleteChild("gui_container2");
  deleteChild("container");
  deleteChild("gui_container");
 
}
/**
* This function deletes child instances on a DOM element
* For example the div container, will lose all appended elements
* @param {id}  id of the element we need to delete
* @returns {} 
*/
function deleteChild(id) {
  var e = document.getElementById(id);
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }
}
/**
* This function makes an HTTP GET request to a URL, and  while doing it, calls a callback functions
* 
* @param {url}  url of a DescribeCoverage request
*@param {requestCallback} cFunction - The callback that handles the response.
* @returns {} 
*/
function loadDoc(url, cFunction) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }else{
      console.log("Error", xhttp.statusText);
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}
/**
* This function handles the DescribeCoverage XMl doc response , by calling external functions
* to retrieve data from the doc. Then with this data saved as an object, it renders the cube view three.js scene
* @param {XMLDocument}  XML DOCUMENT
* @returns {} 
*/
function myFunction1(xhttp) {
  var up = getUpperBoundaries(xhttp);
  var up2 = up.split(" ");
  up2[2] = up2[2].slice(1, -1); //takes out "" from string [2]
  var low = getLowerBoundaries(xhttp);
  var low2 = low.split(" ");
  low2[2] = low2[2].slice(1, -1);
  var ax = getAxisNames(xhttp);
  var ax2 = ax.split(" ");
  var pix = getPixels(xhttp);
  var pix2 = pix.split(" ");
 /**
 * @typedef coverage
 * @type {object}
 * @property {string[]} upper - upper boundaries of a coverage.
 * @property {string[]} lower - lower boundaries of a coverage.
 * @property {string[]} names - axes names of a coverage.
 * @property {string[]} pixels - upper pixel boundaries of a coverage.
 */

/** @type {coverage} */
  var obj = {
    upper: up2,
    lower: low2,
    names: ax2,
    pixels: pix2,
  };
  // document.getElementById("test").innerHTML = obj.pixels;
  init(obj, ax2);
  animate();
}
/**
* This function handles the DescribeCoverage XMl doc response , by calling external functions
* to reteieve data from the doc. Then with this data saved as an object, it renders the 3 ortoghonal sides view three.js scene
* @param {XMLDocument}  xhttp  an xml document, from a coverage's describeCoverage request
* @returns {} 
*/
function myFunction2(xhttp) {
  var up = getUpperBoundaries(xhttp);
  var up2 = up.split(" ");
  up2[2] = up2[2].slice(1, -1); //takes out "" from string [2]
  var low = getLowerBoundaries(xhttp);
  var low2 = low.split(" ");
  low2[2] = low2[2].slice(1, -1);
  var ax = getAxisNames(xhttp);
  var ax2 = ax.split(" ");
  var pix = getPixels(xhttp);
  var pix2 = pix.split(" ");
/** @type {coverage} */
  var obj = {
    upper: up2,
    lower: low2,
    names: ax2,
    pixels: pix2,
  };
  init2(obj, ax2);
  animate2();
  //document.getElementById("test").innerHTML = up2;
}
/**
* This function returns a list of the coverage's lower boundaries for all axis.
* @param {XMLDocument} xml an xml document from a selected coverage's DescribeCoverage request
* @returns {string} an string with the lower boundaries per axis, separated by commas.
*/
function getLowerBoundaries(xml) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("gml:lowerCorner")[0];
  var y = x.childNodes[0];
  var txt = y.nodeValue;
  // document.getElementById("low").innerHTML = txt;
  return String(txt);
  //[minimum long, minimumlat, minimum time]
}
/**
* This function returns a list of the coverage's upper boundaries for all axis.
* @param {XMLDocument} xml an xml document from a selected coverage's DescribeCoverage request
* @returns {string} an string with the upper boundaries per axis, separated by commas.
*/
function getUpperBoundaries(xml) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("gml:upperCorner")[0];
  var y = x.childNodes[0];
  var text = y.nodeValue;
  //document.getElementById("top").innerHTML = text;
  return String(text);
}
/**
* This function returns a list of the coverage's axis names.
* @param {XMLDocument} xml an xml document from a selected coverage's DescribeCoverage request
* @returns {string} an string with the axis's names, seprated by commas.
*/
function getAxisNames(xml) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("gml:Envelope")[0];
  var y = x.getAttributeNode("axisLabels");
  var txt = y.nodeValue;
  //document.getElementById("names").innerHTML = txt;
  return String(txt);
}
/**
* This function returns a list of the coverage's maximum pixel boundaries.
* @param {XMLDocument} xml an xml document from a selected coverage's DescribeCoverage request
* @returns {string} an string with the pixel upper boundaries, seprated by commas.
*/
function getPixels(xml) {
  var xmlDoc = xml.responseXML;
  var x = xmlDoc.getElementsByTagName("gml:high")[0];
  var y = x.childNodes[0];
  var text = y.nodeValue;
  //document.getElementById("test").innerHTML = text;
  return String(text);
}

/**
* This function generates a  query to get the cube view's top facing face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the top face query
*/
// z is latitude north to south, x is longitude east to west, y is time or altitude
function getTopFace(obj, lat = 1, long = 1, ansi= 1, latX = 1, longX = 1, ansiX= 1,left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  var topQuery;
  if (left == true) {
    var latMin = Math.floor(obj.lower[0] * latX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var longMin = Math.floor(obj.lower[1] * longX);
    var longMax =  Math.floor(obj.upper[1]);
    var currDate = obj.upper[2];
    var endpoint = "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
   // var endpoint = "https://code-de.rasdaman.com/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
     topQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
     lat = 1;
  } else {
   
    var latMin = Math.floor(obj.lower[0] * latX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var longMin = Math.floor(obj.lower[1] * 1);
    var longMax =  Math.floor(obj.upper[1] * long);

    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearTop) - (1 - ansi) * midYear);
    var currDate, currMonth;
    if (ansi == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansi.toString()[2];
      if (decimal == 0 || ansi == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
     topQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
     latX=1;
  }

  //document.getElementById("one").innerHTML = topQuery;
  //document.getElementById("two").innerHTML = latMax;
 
  return topQuery;
}
/**
* This function generates a query to get the cube view's bottom facing face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the bottom face query
*/
// z is latitude north to south, x is longitude east to west, y is time or altitude
function getBottomFace(obj, lat=1, long=1, ansi=1, latX=1, longX=1, ansiX=1, left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  var BottomQuery;
  if (left == false) {
  
    var latMin = Math.floor(obj.lower[0] * latX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var longMin = Math.floor(obj.lower[1] * 1);
    var longMax =  Math.floor(obj.upper[1] * long);
    var currDate = obj.lower[2];
    var endpoint = "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    //var endpoint ="https://code-de.rasdaman.com/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
     BottomQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
     latX = 1;
  } else {
    var latMin = Math.floor(obj.lower[0] * latX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var longMin = Math.floor(obj.lower[1] * longX);
    var longMax =  Math.floor(obj.upper[1] * 1);
  

    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearMin) + (1 - ansiX) * midYear);
    var currDate, currMonth;
    if (ansiX == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansiX.toString()[2];
      if (decimal == 0 || ansiX == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
     BottomQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
     lat=1;
  }
  

  //document.getElementById("one").innerHTML = BottomQuery;
  return BottomQuery;
}
/**
* This function generates a query to get the cube view's front facing face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the front face query
*/
function getFrontFace(obj, lat=1, long=1, ansi=1, latX=1, longX=1, ansiX=1, left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];

  if (left == false) {
   
    var longMax = Math.floor(obj.upper[1] * long);
    var longMin = Math.floor(obj.lower[1]*longX);
    
    var latMin = Math.floor(obj.lower[0] * latX); //penguins pole, not north pole
    var MinTime = obj.lower[2];

    var dateMax = obj.upper[2];
    var MinTime = obj.lower[2];
    var yearMin = MinTime.slice(0, 4);
    var yearTop = dateMax.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearTop) - (1 - ansi) * midYear);
    var currDate, currMonth;
    if (ansi == 1) {
      currDate = String(CurrYear) + dateMax.slice(4);
    } else {
      var decimal = ansi.toString()[2];
      if (decimal == 0 || ansi == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateMax.slice(7);
    }
    var MaxTime = "%22" + currDate + "%22";
  
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" +  "%22" + MinTime + "%22" + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(latMin) + ")";
    var format = "&FORMAT=image/png";
    longx = 1;
    var FrontQuery = endpoint + cov + ax1 + ax2 + ax3 + format;

  } else {
     
    
    var longMax = Math.floor(obj.upper[1] * long);
    var longMin = Math.floor(obj.lower[1]* longX);
    var latMin = Math.floor(obj.lower[0] * latX);
    var MaxTime = "%22" + obj.upper[2] + "%22";

    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearMin) + (1 - ansiX) * midYear);
    var MonthTop = dateTop.slice(5, 7);
    var currDate, currMonth;
    if (ansiX == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansiX.toString()[2];
      if (decimal == 0 || ansiX == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }
    var MinTime = "%22" + currDate + "%22";
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(latMin) + ")";
    var format = "&FORMAT=image/png";
    var FrontQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
  }

//document.getElementById("one").innerHTML = FrontQuery;

  return FrontQuery;
  
}
/**
* This function generates a query to get the cube view's back facing face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the back face query
*/
// z is latitude north to south, x is longitude east to west, y is time or altitude

function getBackFace(obj, lat=1, long=1, ansi=1, latX=1, longX=1, ansiX=1, left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
 

  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  if (left == true) {
  

    var longMin = Math.floor(obj.lower[1] * longX);
    var longMax = Math.floor(obj.upper[1]*long);
    var latMax = Math.floor(obj.upper[0] * 1);

    var MaxTime = obj.upper[2];
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var yearTop = MaxTime.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearMin) + (1 - ansiX) * midYear);
    var currDate, currMonth;
    if (ansiX== 1) {
      currDate = String(CurrYear) + dateMin.slice(4);
    } else {
      var decimal = ansiX.toString()[3];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateMin.slice(7);
    }
    var MinTime = "%22" + currDate + "%22";

    var endpoint = "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(latMax) + ")";
    var format = "&FORMAT=image/png";
    long=1;
    var BackQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
  } else {
   
    var longMax = Math.floor(obj.upper[1] * long);
    var longMin = Math.floor(obj.lower[1]*longX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var MinTime = "%22" + obj.lower[2] + "%22";
    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearTop) - (1 - ansi) * midYear);
    var MonthTop = dateTop.slice(5, 7);
    var currDate, currMonth;
    if (ansi == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansi.toString()[2];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }
    var MaxTime = "%22" + currDate + "%22";

    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(latMax) + ")";
    var format = "&FORMAT=image/png";
   longX =1;
    var BackQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
  }

 // document.getElementById("one").innerHTML = BackQuery;
  return BackQuery;
}
/**
* This function generates a query to get the cube view's  right side face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the right side, query
*/
function getRSideFace(obj, lat=1, long=1, ansi=1, latX=1, longX=1, ansiX=1, left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];

  if (left == true) {
    var longMax = Math.floor(obj.upper[1]* long);
    var latMin = Math.floor(obj.lower[0] * latX);
    var latMax = Math.floor(obj.upper[0]* lat);
    var MaxTime = obj.upper[2];
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var yearTop = MaxTime.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearMin) + (1 - ansiX) * midYear);
    var currDate, currMonth;
    if (ansiX == 1) {
      currDate = String(CurrYear) + dateMin.slice(4);
    } else {
      var decimal = ansiX.toString()[3];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateMin.slice(7);
    }
    var MinTime = "%22" + currDate + "%22";
    var MaxxTime = "%22" + MaxTime + "%22";
    var endpoint = "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" + String(axis3) + "(" + MinTime + ","  + String(MaxxTime) + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(longMax) + ")";
    var format = "&FORMAT=image/png";
    var queryRside = endpoint + cov + ax1 + ax2 + ax3 + format;
  } else {
    var longMax = Math.floor(obj.upper[1] * long);
    var latMax = Math.floor(obj.upper[0] * lat);
    var latMin = Math.floor(obj.lower[0] * latX);

    var MinTime = "%22" + obj.lower[2] + "%22";
    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearTop) - (1 - ansi) * midYear);
    var MonthTop = dateTop.slice(5, 7);
    var currDate, currMonth;
    if (ansi == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansi.toString()[2];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }

    var MaxTime = "%22" + currDate + "%22";
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" + String(axis3) + "(" + MinTime + "," + String(MaxTime) + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(longMax) + ")";
    var format = "&FORMAT=image/png";
    var queryRside = endpoint + cov + ax1 + ax2 + ax3 + format;
  }
  //document.getElementById("one").innerHTML =queryRside;
  return queryRside;
}
/**
* This function generates a query to get the cube view's left side facing face image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} lat - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From right sife
* @param {Number} long - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From right side
* @param {Number} ansi - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size. From left side
* @param {Number} latX - dat.gui value, form 0.5 to 1.5, representing how much the cube's scale was modified on the z axis, relative to its original size. From left side
* @param {Number} longX - dat.gui value, from 0.5 to 1.5, representing how much the cube's scale was modified on the x axis, relative to its original size. From left side
* @param {Number} ansiX - dat.gui value , representing how much the cube's scale was modified, on the y axis, relative to its original size.
* @param {Boolean} left - if the update was from the second gui, the one that trms/slides from the opposite side
* @returns {string} the left side face query
*/
function getLSideFace(obj, lat=1, long=1, ansi=1, latX=1, longX=1, ansiX=1, left = false) {
  lat = (lat- .50) * 2;
  long = (long - .50) * 2;
  ansi = (ansi- .50) * 2;
  latX = (latX - .50) * 2;
  longX = (longX- .50) * 2;
  ansiX = (ansiX- .50) * 2;
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];

  if (left == true) {
    var longMin = Math.floor(obj.lower[1] * longX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var latMin = Math.floor(obj.lower[0] * latX);
    var MaxTime = obj.upper[2];
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var yearTop = MaxTime.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearMin) + (1 - ansiX) * midYear);
    var currDate, currMonth;
    if (ansiX == 1) {
      currDate = String(CurrYear) + dateMin.slice(4);
    } else {
      var decimal = ansiX.toString()[3];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateMin.slice(7);
    }
    var MinTime = "%22" + currDate + "%22";
    var MaxxTime = "%22" + MaxTime + "%22";
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxxTime + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(longMin) + ")";
    var format = "&FORMAT=image/png";
    var queryLside = endpoint + cov + ax1 + ax2 + ax3 + format;

  } else {
    var longMin = Math.floor(obj.lower[1]*longX);
    var latMax = Math.floor(obj.upper[0] * lat);
    var latMin = Math.floor(obj.lower[0]* latX);
    var MinTime = "%22" + obj.lower[2] + "%22";

    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var midYear = Math.floor((diffYears/2));
    var CurrYear = Math.floor(Number(yearTop) - (1 - ansi) * midYear);
    var currDate, currMonth;
    if (ansi == 1) {
      currDate = String(CurrYear) + dateTop.slice(4);
    } else {
      var decimal = ansi.toString()[2];
      if (decimal == 0) {
        currMonth = 1;
      } else {
        currMonth = Math.floor((12 / 9) * decimal);
      }
      currDate = String(CurrYear) + "-" + String(currMonth) + dateTop.slice(7);
    }
    var MaxTime = "%22" + currDate + "%22";

    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(longMin) + ")";
    var format = "&FORMAT=image/png";
    var queryLside = endpoint + cov + ax1 + ax2 + ax3 + format;
  }
  //document.getElementById("one").innerHTML =queryLside;
  return queryLside;
}
/**
* This function generates a query to get the  3 Orthogonal sides' top facing face, as an image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object where the list is located.
* @param {Number} valAnsi - dat.gui value, from the negative half of the pixel maximum boundary of the third axis, to the positive half of this pixel maximum
* boundary.It  represents how much the plane was moved along the third axis or the position change. 
* @returns {string} the top face query for the three sided orthogo view
*/
function getOrthoTopFace(obj, valAnsi = 1) {
  //slides along ansi,time
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  if (valAnsi == 1) {
    var latMin = obj.lower[0];
    var latMax = obj.upper[0];
    var longMin = obj.lower[1];
    var longMax = obj.upper[1];
    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var scaledYear = Number(yearMin) + Math.floor(diffYears / 2);
    var topMonth = dateTop.slice(5, 7);
    var minMonth = dateMin.slice(5, 7);
    var currMonth0 =
      (diffYears * 12 - (12 - Number(topMonth)) - (12 - Number(minMonth))) / 12;
    var currMonth = Math.floor(currMonth0 / 2);
    var currDate =
      String(scaledYear) + "-" + String(currMonth) + dateTop.slice(7);

    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
    var topQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
  } else {
    var latMin = obj.lower[0];
    var latMax = obj.upper[0];
    var longMin = obj.lower[1];
    var longMax = obj.upper[1];
    var MaxPixTime = Number(obj.pixels[2] / 2);
    var MinPixTime = Number((obj.pixels[2] / 2) * -1);
    var dateTop = obj.upper[2];
    var yearTop = dateTop.slice(0, 4);
    var dateMin = obj.lower[2];
    var yearMin = dateMin.slice(0, 4);
    var diffYears = Number(yearTop) - Number(yearMin);
    var MiddleYear = Number(yearMin) + Math.floor(diffYears / 2);
    var scaledYear = Math.floor(
      MiddleYear + 0.5 + (valAnsi * (diffYears / 2)) / MaxPixTime
    );
    var topMonth = dateTop.slice(5, 7);
    var minMonth = dateMin.slice(5, 7);
    var currMonth;
    if (scaledYear == Number(yearTop) && valAnsi == MaxPixTime) {
      currMonth = topMonth;
    } else if (scaledYear == Number(yearMin) && valAnsi == MinPixTime) {
      currMonth = minMonth;
    } else {
      var totalMonths =
        diffYears * 12 - (12 - Number(topMonth)) - (12 - Number(minMonth));
      var scaledMonth = (valAnsi * (totalMonths / 12)) / MaxPixTime;
      currMonth = Math.abs(Math.floor((scaledMonth * 12) % 12) + 1);
    }

    var currDate =
      String(scaledYear) + "-" + String(currMonth) + dateTop.slice(7);
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + coverage; //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax3 =
      "&SUBSET=" +
      String(axis3) +
      "(%" +
      "22" +
      String(currDate) +
      "%" +
      "22" +
      ")";
    var format = "&FORMAT=image/png";
    var topQuery = endpoint + cov + ax1 + ax2 + ax3 + format;
  }

 // document.getElementById("three").innerHTML = " " + axis3 + " = " + currDate;
  return topQuery;
}
/**
* This function generates a query to get the  3 Orthogonal sides' side facing face, as an image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object with info of the coverage
* @param {Number} valLong - dat.gui value, from the negative half of the pixel maximum boundary of the second axis, to the positive half of this pixel maximum
* boundary.It  represents how much the plane was moved along the second axis or the position change. An example is how much it moved along the latitude pixels
* @returns {string} the side face query for the orthoghonal view
*/
function getOrthoSideFace(obj, valLong = 1) {
  //slides along long
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  if (valLong == 1) {
    var latMax = obj.upper[0];
    var latMin = obj.lower[0];
    var MaxTime = "%22" + obj.upper[2] + "%22";
    var MinTime = "%22" + obj.lower[2] + "%22";

    var longMin = obj.lower[1];
    var longMax = obj.upper[1];
    var scaledLong = Number(longMax) + Number(longMin);

    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(scaledLong) + ")";
    var format = "&FORMAT=image/png";
    var querySide = endpoint + cov + ax1 + ax2 + ax3 + format;
  } else {
    var latMax = obj.upper[0];
    var latMin = obj.lower[0];
    var MaxTime = "%22" + obj.upper[2] + "%22";
    var MinTime = "%22" + obj.lower[2] + "%22";
    var longMin = obj.lower[1];
    var longMax = Number(obj.upper[1]);
    var pixelmaxLong = Number(obj.pixels[1] / 2);
    var scaledLong = Math.floor((valLong * longMax) / pixelmaxLong);
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage);
    var ax1 =
      "&SUBSET=" +
      String(axis1) +
      "(" +
      String(latMin) +
      "," +
      String(latMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis2) + "(" + String(scaledLong) + ")";
    var format = "&FORMAT=image/png";
    var querySide = endpoint + cov + ax1 + ax2 + ax3 + format;
  }

  //document.getElementById("two").innerHTML = axis2 + " = " + scaledLong;
  return querySide;
}
/**
* This function generates a query to get the  3 Orthogonal sides' front facing face, as an image in png.
* It takes into account the the dat.gui values, to modify the query,
* @param {Object} obj - object whith coverage info
* @param {Number} valLat - dat.gui value, from the negative half of the pixel maximum boundary of the first axis, to the positive half of this pixel maximum
* boundary.It  represents how much the plane was moved along the first axis or the position change. An example is how much it moves along the latitude.
* @returns {string} the front face query for the orthog view
*/
function getOrthoFrontFace(obj, valLat = 1) {
  //slides along latitude
  var axis1 = obj.names[0];
  var axis2 = obj.names[1];
  var axis3 = obj.names[2];
  if (valLat == 1) {
    //initial middle lat slice
    var longMax = obj.upper[1];
    var longMin = obj.lower[1];
    var latMin = obj.lower[0]; //slider
    var latMax = obj.upper[0];
    var scaledLat = Number(latMax) + Number(latMin);
    var MinTime = "%22" + obj.lower[2] + "%22";
    var MaxTime = "%22" + obj.upper[2] + "%22";
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(scaledLat) + ")";
    var format = "&FORMAT=image/png";
    var Front = endpoint + cov + ax1 + ax2 + ax3 + format;
  } else {
    var MinTime = "%22" + obj.lower[2] + "%22";
    var MaxTime = "%22" + obj.upper[2] + "%22";
    var longMin = obj.lower[1];
    var longMax = obj.upper[1];
    var pixelMaxLat = Number(obj.pixels[0] / 2);
    var latMax = obj.upper[0];
    var scaledLat = Math.floor((valLat * Number(latMax)) / pixelMaxLat);
    var endpoint =
      "https://ows.rasdaman.org/rasdaman/ows?SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage";
    var cov = "&COVERAGEID=" + String(coverage); //AvgLandTempo
    var ax1 =
      "&SUBSET=" +
      String(axis2) +
      "(" +
      String(longMin) +
      "," +
      String(longMax) +
      ")";
    var ax2 = "&SUBSET=" + String(axis3) + "(" + MinTime + "," + MaxTime + ")";
    var ax3 = "&SUBSET=" + String(axis1) + "(" + String(scaledLat) + ")";
    var format = "&FORMAT=image/png";
    var Front = endpoint + cov + ax1 + ax2 + ax3 + format;
  }

 // document.getElementById("one").innerHTML = axis1 + " = " + scaledLat;
  return Front;
}
var container,
  axisContainer,
  scene,
  arrowScene,
  renderer,
  arrowRenderer,
  camera,
  arrowCamera,
  arrowCanvas,
  arrowPos;
var cube;
var controls, controls2;
var contr;
var fromLeft;
var mesh1, mesh2, mesh3;
/**
* This function setsup the dat.gui slider, the cube canvas, and the tripod canvas. It does not render, just does the setting up.
* @param {Object} obj - object with info of the coverage
* @param {String[]} ax - string aray with the axis names for the coverage
* boundary.It  represents how much the plane was moved along the second axis or the position change. 
* @returns {} 
*/
function init(object, ax) {
  container = document.getElementById("container");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 1);
  container.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.y = 500;
  camera.position.z = -4500;
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  var botText = new THREE.TextureLoader(manager).load(getBottomFace(object));
    botText.flipY = false;
    botText.wrapS = THREE.RepeatWrapping;
    botText.repeat.x = - 1;
   var frontText = new THREE.TextureLoader(manager).load(getFrontFace(object));
 

  var manager = new THREE.LoadingManager(function () {});
  manager.onError = function ( url ) {
    //alert("Loader failed!"+url);
    console.log( 'There was an error loading ' + url );
  
  };
  
  
  var backText = new THREE.TextureLoader(manager).load(getBackFace(object));
  backText.flipY = false;
 backText.wrapS = THREE.RepeatWrapping;
  backText.repeat.x = - 1;
   var rightText =  new THREE.TextureLoader(manager).load(getRSideFace(object));
   rightText.flipY = false;
   rightText.wrapS = THREE.RepeatWrapping;
    rightText.repeat.x = - 1;
  var materials = [
    new THREE.MeshBasicMaterial({
      map:rightText,
    
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader(manager).load(getLSideFace(object)),
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader(manager).load(getTopFace(object)),
    }),
    new THREE.MeshBasicMaterial({
      map: botText,

    }),
    new THREE.MeshBasicMaterial({
      map: frontText,
    }),
    new THREE.MeshBasicMaterial({
      map: backText,
    }),
  ];
  //<gml:high>1799 3599 184</gml:high>
  // color <gml:high>449 899 184</gml:high>
  // z is latitude north to south, x is longitude east to west, y is time or altitude
  var x = Number(object.pixels[0]);
  var y = Number(object.pixels[1]);
  var z = Number(object.pixels[2]);

  var geometry = new THREE.BoxBufferGeometry(y, z, x);

  

  //var geometry2 = new THREE.BoxBufferGeometry(y * 1.5, z * 1.5, x * 1.5);
  cube = new THREE.Mesh(geometry, materials);
  const material2 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  

  // RIGHT SIDE, LEFT SIDE, FRONT SIDE, BACK SIDE, TOP SIDE, BOTTOM SIDE

  const cubeB = new THREE.Mesh(geometry, material2);
  //const cubeC = new THREE.Mesh(geometry, material3);
  //cube.scale.x = -1;
 
  var helper2 = new THREE.BoxHelper(cubeB);
  helper2.material.color.set(0x00ff00);
  helper2.material.linewidth = 3; // may no longer be supported on some platforms
  scene.add(helper2);
 
  cubeB.position.set(cube.position.x, cube.position.y, cube.position.z);
  //cubeC.position.set(cube.position.x, cube.position.y, cube.position.z);
  
  scene.add(cube);
  //cube.scale.x = cube.scale.x * 1.5;
 // cube.scale.y = cube.scale.y * 1.5;
 //cube.scale.z = cube.scale.z * 1.5;
 //cube.rotation.x = Math.PI / 1.5;

 //cube.rotation.y = Math.PI / 1;
  contr = new (function () {
    this.Update = function (e) {
   
     var botB =   new THREE.TextureLoader(manager).load(
        getBottomFace(
          object,
          lat1,
          long1,
          ansi1,
          lat2,
          long2,
          ansi2,
          fromLeft
        )
      );
      botB.flipY = false;
  
 botB.wrapS = THREE.RepeatWrapping;
   botB.repeat.x = - 1;
var backB = new THREE.TextureLoader(manager).load(
  getBackFace(
    object,
    lat1,
    long1,
    ansi1,
    lat2,
    long2,
    ansi2,
    fromLeft
  )
);
backB.flipY = false;
backB.wrapS = THREE.RepeatWrapping;
backB.repeat.x = - 1;

  var frontB = new THREE.TextureLoader(manager).load(
    getFrontFace(
      object,
      lat1,
      long1,
      ansi1,
      lat2,
      long2,
      ansi2,
      fromLeft
    )
  );
  var rightB =  new THREE.TextureLoader(manager).load(
    getRSideFace(
      object,
      lat1,
      long1,
      ansi1,
      lat2,
       long2,
        ansi2,
      fromLeft
    )
  );
  rightB.flipY = false;
  rightB.wrapS = THREE.RepeatWrapping;
  rightB.repeat.x = - 1;
      var material2 = [
        new THREE.MeshBasicMaterial({
          map:rightB,
        }),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader(manager).load(
            getLSideFace(
              object,
              lat1,
              long1,
              ansi1,
              lat2,
               long2,
                ansi2,
              fromLeft
            )
          ),
        }),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader(manager).load(
            getTopFace(
              object,
              lat1,
              long1,
              ansi1,
              lat2,
              long2,
              ansi2,
              fromLeft
            )
          ),
        }),
        new THREE.MeshBasicMaterial({
        map: botB ,
        }),
        new THREE.MeshBasicMaterial({
          map: frontB,
        }),
        new THREE.MeshBasicMaterial({
          map: backB,
        }),
      ];
      cube.material = material2;
    
     
      cube.material.needsUpdate = true;


    };
  })();
  
  coverages = new (function () {
    this.coverage = function (e) {};
  })();
  var controller = new (function () {
    this.positionX = 1.5;
    this.positionY = 1.5;
    this.positionZ = 1.5;
  })();
  var controller2 = new (function () {
    this.positionX = 1.5;
    this.positionY = 1.5;
    this.positionZ = 1.5;
  })();
var lat1, long1, ansi1, lat2, long2, ansi2;

var gui = new dat.GUI({ autoPlace: false, closeOnTop: true });

gui.domElement.id = "gui";
gui_container.appendChild(gui.domElement);
gui.add(coverages, "coverage").name(`MAX:${coverage}`);
gui.add(controller, "positionZ", 1, 1.5).name(ax[0] + " From North").onChange(function () {
  
    lat1 = (controller.positionZ-.5);
    lat2 = 1;
     cube.scale.z = (controller.positionZ-.5);
     var polat =   (x/2) * (1-((controller.positionZ-.5)));
   
     
   // cube.scale.z =  cube.scale.z * (controller.positionZ-.5);
   cube.position.z = polat;
   fromLeft = false;


});
gui
.add(controller, "positionX", 1, 1.5)
.name(ax[1] + " From Left")
.onChange(function () {
 
  long1 = (controller.positionX-.5);
  long2 = 1;
  cube.scale.x = (controller.positionX-.5);
  var polat =   (-y/2) * (1-(controller.positionX-.5));
 // cube.scale.z =  cube.scale.z * (controller.positionZ-.5);
 cube.position.x = polat;
 fromLeft = false;
});
gui
.add(controller, "positionY", 1, 1.5)
.name(ax[2] + " From Top" )
.onChange(function () {
  ansi1=(controller.positionY-.5);
  ansi2 = 1;
  cube.scale.y = (controller.positionY-.5);
  var polat =   (-z/2) * (1-(controller.positionY-.5));
 // cube.scale.z =  cube.scale.z * (controller.positionZ-.5);
 cube.position.y = polat;
 fromLeft = false;
});
gui
  .add(controller2, "positionZ", 1, 1.5)
  .name(ax[0] + " From South")
  .onChange(function () {
     lat2 = (controller2.positionZ-.5);
     lat1 = 1;
     cube.scale.z = (controller2.positionZ-.5);
     var polat =   (-x/2) * (1-((controller2.positionZ-.5)));
   cube.position.z = polat;
   fromLeft = true;
});
gui
.add(controller2, "positionX", 1, 1.5)
.name(ax[1]+" From Right")
.onChange(function () {
  long2 =(controller2.positionX-.5);
  long1 = 1;
  cube.scale.x = (controller2.positionX-.5);
  var polat =   (y/2) * (1-(controller2.positionX-.5));
 // cube.scale.z =  cube.scale.z * (controller.positionZ-.5);
 cube.position.x = polat;
 fromLeft = true;
});
gui
.add(controller2, "positionY", 1, 1.5)
.name(ax[2]+" From Botto")
.onChange(function () {
  ansi2 = (controller2.positionY-.5);
  ansi1 = 1;
  cube.scale.y = (controller2.positionY-.5);
  var polat =   (z/2) * (1-(controller2.positionY-.5));
 // cube.scale.z =  cube.scale.z * (controller.positionZ-.5);
 cube.position.y = polat;
 fromLeft = true;
});
var upd = gui.add(contr, "Update").onChange(contr.Update);
var updStyle = upd.domElement.previousSibling.style;
updStyle.marginLeft = "50px";
updStyle.backgroundColor = "white";
updStyle.color = "black";
updStyle.width = "50%";


document.getElementById('axisContainer');
  var CANVAS_WIDTH = 245;
  var CANVAS_HEIGHT = 250;
  arrowRenderer = new THREE.WebGLRenderer({ alpha: true }); // clear
  arrowRenderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  //container.appendChild(arrowRenderer.domElement);
  arrowCanvas = document.body.appendChild(arrowRenderer.domElement);
  arrowCanvas.setAttribute("id", "arrowCanvas");
  arrowCanvas.style.width = CANVAS_WIDTH;
  arrowCanvas.style.height = CANVAS_HEIGHT;
  arrowScene = new THREE.Scene();
  arrowCamera = new THREE.PerspectiveCamera(
    50,
    CANVAS_WIDTH / CANVAS_HEIGHT,
    1,
    1000
  );
  arrowCamera.up = camera.up; // important!
  
  arrowCamera.position.y = 150;
  arrowCamera.position.z = 400;

  controls2 = new THREE.OrbitControls(arrowCamera, arrowRenderer.domElement);
  //controls2.enableZoom = false;

  arrowPos = new THREE.Vector3(0, 0, 0);
  var arr1 = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    arrowPos,
    60,
    0x7f2020,
    20,
    20
  );
  arrowScene.add(arr1);
  const geometryArr1 = new THREE.CylinderBufferGeometry(3, 3, -85, 30);
  const materialArr1 = new THREE.MeshBasicMaterial({ color: 0x7f2020 });
  const cylinder1 = new THREE.Mesh(geometryArr1, materialArr1);
  arrowScene.add(cylinder1);
  cylinder1.rotation.z = Math.PI / 2;

  arrowScene.add(
    new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      arrowPos,
      60,
      0x207f20,
      20,
      20
    )
  );
  const geometryArr2 = new THREE.CylinderBufferGeometry(3, 3, -85, 30);
  const materialArr2 = new THREE.MeshBasicMaterial({ color: 0x207f20 });
  const cylinder2 = new THREE.Mesh(geometryArr2, materialArr2);
  arrowScene.add(cylinder2);

  arrowScene.add(
    new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      arrowPos,
      60,
      0x20207f,
      20,
      20
    )
  );
  const geometryArr3 = new THREE.CylinderBufferGeometry(3, 3, -85, 30);
  const materialArr3 = new THREE.MeshBasicMaterial({ color: 0x20207f });
  const cylinder3 = new THREE.Mesh(geometryArr3, materialArr3);
  arrowScene.add(cylinder3);
  cylinder3.rotation.x = Math.PI / 2;

  var loader = new THREE.FontLoader();
  var geometry;
  loader.load(
    "https://cdn.rawgit.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      geometry22 = new THREE.TextGeometry(ax[1], {
        font: font,
        size: 10,
        height: 1,
      });
      geometry3 = new THREE.TextGeometry(ax[0], {
        font: font,
        size: 10,
        height: 1,
      });
      geometry4 = new THREE.TextGeometry(ax[2], {
        font: font,
        size: 10,
        height: 1,
      });
      var material2 = new THREE.MeshLambertMaterial({
        color: 0xb0bca7,
        overdraw: true,
      });
      mesh1 = new THREE.Mesh(geometry22, material2);
      mesh2 = new THREE.Mesh(geometry3, material2);
      mesh3 = new THREE.Mesh(geometry4, material2);

      mesh1.position.set(55, 0, 0);
      mesh2.position.set(-30, 0, 55);
      mesh3.position.set(5, 55, 0);

      arrowScene.add(mesh1);
      arrowScene.add(mesh2);
      arrowScene.add(mesh3);
    }
  );
}
/**
* This function renders the tripod and cube canvas, plus the dat.gui slider. 
*it also handles the eventListening within the cube and tripod canvas, to copy camera positions from one to the other canvas.
* @returns {} 
*/

function animate() {
  //controls.update();
  //controls2.update();
  requestAnimationFrame(animate);

  controls.addEventListener("change", () => {
    arrowCamera.position.copy(camera.position);
    arrowCamera.rotation.copy(camera.rotation);
    arrowCamera.position.setLength(300);
  });
  controls2.addEventListener("change", () => {
    //camera.position.x =  arrowCamera.position.x * 10;
    camera.position.copy(arrowCamera.position);
    camera.rotation.copy(arrowCamera.rotation);
    //arrowCamera.position.setLength( 300 );
    camera.position.setLength(5000);
  });
  mesh1.lookAt(arrowCamera.position);
  mesh2.lookAt(arrowCamera.position);
  mesh3.lookAt(arrowCamera.position);

  renderer.render(scene, camera);
  arrowRenderer.render(arrowScene, arrowCamera);
}

var sceneO, cameraO, rendererO, threejs, controlsO;

var planeMesh0, planeMesh1, planeMesh2;
var texture1, texture2, texture3;
var contro;
//var gui = null;
/**
* This function converts degrees to radians, to use on the rotate function of meshes in three.js
* @param {Number} degree - number of degrees
* @returns {Number} radian value
*/
var de2ra = function (degree) {
  return degree * (Math.PI / 180);
};
/**
* This function setsup the dat.gui slider, the three orthogonal faces canvas, and the tripod canvas. It does not render, just does the setting up.
* @param {Object} object2 - object with info of the coverage
* @param {String[]} axi - string aray with the axis names for the coverage 
* @returns {} 
*/
function init2(object2, axi) {
  threejs = document.getElementById("container");
  sceneO = new THREE.Scene();
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  rendererO = new THREE.WebGLRenderer({ antialias: true });
  rendererO.setSize(WIDTH, HEIGHT);
  rendererO.setClearColor(0xffffff, 1);

  threejs.appendChild(rendererO.domElement);
  cameraO = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  cameraO.position.y = 500;
  cameraO.position.z = -4500;

  sceneO.add(cameraO);

  var lat = object2.pixels[0];
  var long = object2.pixels[1];
  var third = object2.pixels[2];
  var loader = new THREE.TextureLoader();
  texture1 = loader.load(getOrthoSideFace(object2));
  var cubeMaterial = [
    new THREE.MeshBasicMaterial({
      color: 'black' //left
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' //right
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' // top
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' // bottom
    }),
    new THREE.MeshBasicMaterial({
        color: 'black'// front
    }),
    new THREE.MeshBasicMaterial({
      map: texture1 //back
    })
];

  var planeMaterial0 = new THREE.MeshBasicMaterial({
    map: texture1,
    opacity: 1,
    transparent: false,
  });
  //var planeMaterial0 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("https://sb.kaleidousercontent.com/800x533/9e7eebd2c6/animals-0b6addc448f4ace0792ba4023cf06ede8efa67b15e748796ef7765ddeb45a6fb-removebg.png")});


  var planeGeometry0 = new THREE.BoxGeometry(lat, third, 0.1);

  planeMesh0 = new THREE.Mesh(planeGeometry0, cubeMaterial);
  //planeMesh0.scale.x = -1;
  //planeMesh0.material.side = THREE.FrontSide;
  planeMesh0.position.set(0, -3, 0);
  planeMesh0.rotation.set(0, 0, 0);
  planeMesh0.rotation.y = de2ra(90);
  planeMesh0.rotation.x = de2ra(180);
  texture1.flipY = false;
  
  
  sceneO.add(planeMesh0);
  



  var planeGeometry1 = new THREE.BoxGeometry(long, lat, 0.1);
  texture2 = loader.load(getOrthoTopFace(object2));
  var planeMaterial1 = new THREE.MeshBasicMaterial({
    map: texture2,
    opacity: 1,
    transparent: false,
  });
  //texture2.flipY = false;
  //texture2.wrapS = THREE.RepeatWrapping;
  //texture2.repeat.x = - 1;
  

  planeMesh1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
  //planeMesh1.scale.x = -1;
  //planeMesh1.material.side = THREE.DoubleSide;
  planeMesh1.position.set(0, -3, 0);
  planeMesh1.rotation.set(0, 0, 0);
  planeMesh1.rotation.x = de2ra(90);


  sceneO.add(planeMesh1);

  var planeGeometry2 = new THREE.BoxGeometry(long, third, 0.1);
  texture3 = loader.load(getOrthoFrontFace(object2));
  var planeMaterial2 = [
    new THREE.MeshBasicMaterial({
      color: 'black' //left
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' //right
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' // top
    }),
    new THREE.MeshBasicMaterial({
        color: 'black' // bottom
    }),
    new THREE.MeshBasicMaterial({
      map: texture3 
      
      // front
    }),
    new THREE.MeshBasicMaterial({
      color: 'black'
    })
];/*
  var planeMaterial2 = new THREE.MeshBasicMaterial({
    map: texture3,
    opacity: 1,
    transparent: false,
  }); */

  planeMesh2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
  planeMesh2.material.side = THREE.DoubleSide;
  planeMesh2.position.set(0, -3, 0);
  planeMesh2.rotation.set(0, 0, 0);
  planeMesh2.rotation.x = de2ra(180);
  planeMesh2.rotation.z = de2ra(180);

  sceneO.add(planeMesh2);

  controlsO = new THREE.OrbitControls(cameraO, rendererO.domElement);
  window.addEventListener("resize", onWindowResize, false);

  var controller = new (function () {
    this.positionX = .5;
    this.positionY = .5;
    this.positionZ = .5;
  })();
  contro = new (function () {
    this.Update = function (e) {
      var texture00 = loader.load( getOrthoSideFace(object2, planeMesh0.position.x) );
      var cubeMaterial2 = [
        new THREE.MeshBasicMaterial({
          color: 'black' //left
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' //right
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' // top
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' // bottom
        }),
        new THREE.MeshBasicMaterial({
            color: 'black'// front
        }),
        new THREE.MeshBasicMaterial({
          map: texture00 //back
        })
    ];
      planeMesh0.material = cubeMaterial2;
      planeMesh0.needsUpdate = true;

      var texture22 = loader.load( getOrthoTopFace(object2, planeMesh1.position.y) );
      var planeMaterial12 = new THREE.MeshBasicMaterial({
        map: texture22,
        opacity: 1,
        transparent: false,
      });
      planeMesh1.material = planeMaterial12;
      planeMesh1.needsUpdate = true;

      var texture33 = loader.load( getOrthoFrontFace(object2, planeMesh2.position.z) );
      var planeMaterial33 = [
        new THREE.MeshBasicMaterial({
          color: 'black' //left
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' //right
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' // top
        }),
        new THREE.MeshBasicMaterial({
            color: 'black' // bottom
        }),
        new THREE.MeshBasicMaterial({
          map: texture33 
          
          // front
        }),
        new THREE.MeshBasicMaterial({
          color: 'black'
        })
    ]; /*
      var planeMaterial33 = new THREE.MeshBasicMaterial({
        map: texture33,
        opacity: 1,
        transparent: false,
      }); */
      planeMesh2.material = planeMaterial33;
      planeMesh2.needsUpdate = true;
    };
  })();
  
  var gui = new dat.GUI({ autoPlace: false, closeOnTop: true });

  gui.domElement.id = "gui";
  gui_container2.appendChild(gui.domElement);
  gui
    .add(controller, "positionZ", -.5, 1.5)
    .name(axi[0])
    .onChange(function () {
      if(controller.positionZ > .5 ){
      var polat =   (lat / 2) * (controller.positionZ-.5);
      planeMesh2.position.z = polat;
    }else{
      var neglat=  (-lat / 2) * Math.abs((controller.positionZ-.5));
      planeMesh2.position.z = neglat;
    }
    
     
    });
  gui
    .add(controller, "positionX", -.5, 1.5)
    .name(axi[1])
    .onChange(function () {
      if(controller.positionX > .5 ){
        var polang =   (long / 2) * (controller.positionX-.5);
        planeMesh0.position.x = polang;
      }else{
        var neglong =  (-long / 2) * Math.abs((controller.positionX-.5));
        planeMesh0.position.x = neglong;
      }
    });
  gui
    .add(controller, "positionY", -.5, 1.5)
    .name(axi[2])
    .onChange(function () {
      if(controller.positionY > .5 ){
        var po3 =   (third / 2) * (controller.positionY-.5);
        planeMesh1.position.y = po3;
      }else{
        var neg3 =  (-third / 2) * Math.abs((controller.positionY-.5));
        planeMesh1.position.y = neg3;
      }
    });
  var updX = gui.add(contro, "Update").onChange(contro.Update);
  var updStyleX = updX.domElement.previousSibling.style;
  updStyleX.marginLeft = "50px";
  updStyleX.backgroundColor = "white";
  updStyleX.color = "black";
  updStyleX.width = "50%";
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  cameraO.aspect = window.innerWidth / window.innerHeight;
  cameraO.updateProjectionMatrix();
  rendererO.setSize(window.innerWidth, window.innerHeight);
}
/**
* This function  renders the gui slider, the orthogonal canvas, and handles the event listenign 
* within the orthogonal canvas and the tripod canvas, so both cameras copy each other's position.
* @returns {} 
*/
function animate2() {
  requestAnimationFrame(animate2);
  //controlsO.update();
  controlsO.addEventListener("change", () => {
    arrowCamera.position.copy(cameraO.position);
    arrowCamera.rotation.copy(cameraO.rotation);
    arrowCamera.position.setLength(300);
  });
  controls2.addEventListener("change", () => {
    cameraO.position.copy(arrowCamera.position);
    cameraO.rotation.copy(arrowCamera.rotation);
    cameraO.position.setLength(5000);
  });
  mesh1.lookAt(arrowCamera.position);
  mesh2.lookAt(arrowCamera.position);
  mesh3.lookAt(arrowCamera.position);

  renderScene();
}

function renderScene() {
  rendererO.render(sceneO, cameraO);
}
