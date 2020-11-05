"use strict";
exports.__esModule = true;
var request = require('request');
var fs = require("fs");
var cryptojs = require('crypto-js');
var CONSTANTS = require('../../constants.js');
var xmlbuilder = require('xmlbuilder');
var dateFormat = require('dateformat');

var org = CONSTANTS.BSP.API_PARAMS.ORGANIZATION;
var contentType = "application/json";
var date;
var token;


var processedIndex = 0;
var totalItemsCount = 0;

//authToken();
//generateXMLFileforItems(inputItemsList,storetoExport);



function generateXMLFileforStore(storeNo,callback) {

	const currentDate = new Date();
	currentDate. setHours(0,0,0,0);
	const secondsSinceEpoch = Math.round(currentDate.getTime());

	var filename = "E" + dateFormat(new Date(), "yyyymmdd_HHMMss_") + storeNo + ".XML";

	console.log('Enter: generateXMLFileforStore' );

	var bspItemList = [];
	authToken();

	var url = CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_ITEM_PRICES_SNAPSHOT;
	request.get(setParamsNEPEUNIT(CONSTANTS.METHOD_TYPES.GET, url), function (e, r, body) {
		if( !e ){
			if(r.statusCode == "200" && body ) {
				var res = JSON.parse(body);
				//console.log(res);
				//bspItemList.push(res);

				for(let i=res.snapshot.length-1; i>-1; --i){
					if( res.snapshot[i].version > secondsSinceEpoch ) {
						bspItemList.push(res.snapshot[i]);
					}
					else { break; }
				}

				if( bspItemList.length > 0  ) {
					writeToXMLFile(storeNo,filename,bspItemList,function(result) {
						callback({ "result": "SUCCESS", "items" : bspItemList.length , "filename": filename });
					});
				} else {
					    callback({ "result": "NO_ITEMS", "items" : "0" , "filename": "" });
				}

				console.log('Items - ' + bspItemList.length);

			}
			else
			{
				console.log("Error ItemPrices Snapshot Info - " + r.statusCode);
				callback({ "result": "ERROR", "items" : "0", "filename": "" });
			}
		}
		else {
			console.log("Error: " + e);
			callback({ "result": "ERROR", "items" : "0" , "filename": "" });
		}
	});

	console.log('Leaving: generateXMLFileforStore');
};


function generateXMLFileforItems(argItemsList,storeNo,filename,callback) {

	const now = new Date()  
	const secondsSinceEpoch = Math.round(now.getTime())	

	console.log('Enter: generateXMLFileforItems' );

	var bspItemList = [];
	processedIndex = 0;
	totalItemsCount = argItemsList.itemIds.length;
	authToken();

	for ( let i = 0; i < argItemsList.itemIds.length; i++ ) {

		fetchItemDetailsFromBSP(argItemsList.itemIds[i],storeNo,filename,function(result) {
			callback(result);
		});

	}

	console.log('Leaving: generateXMLFileforItems');
};



function fetchItemDetailsFromBSP(itemInfo, storeNo,filename,callback ){
	console.log('Enter: fetchItemDetailsFromBSP');
	var url = CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEM_DETAILS+"itemCodePattern="+itemInfo.itemCode;
	request.get(setParamsNEPEUNIT(CONSTANTS.METHOD_TYPES.GET, url), function (e, r, body) {
		if( !e ){

			if(r.statusCode == "200" && body ) {
				var res = JSON.parse(body);
				//console.log(res);
				bspItemList.push(res);

			}
			else
			{
				console.log("Error ItemDeatils Info " + itemInfo.itemCode + " - StatusCode - " + r.statusCode);
			}
		}
		else {
			console.log("Error: " + e);
		}

		
		processedIndex = processedIndex +1;

		if( processedIndex == totalItemsCount ) {
			console.log("Processing Completed" );
			//writeToXMLFile(storeNo,filename,function(result) {
			//	callback(result);
			//});
		}


	
	});

	console.log('Leaving: fetchItemDetailsFromBSP');
}


function writeToXMLFile(storeNo,filename,bspItemList, callback){
	console.log('Enter: writeToXMLFile');

	var xmldate=dateFormat(new Date(), "yyyymmddHHMMss");

	var tempItemList = [];
	for(let itemInfo of bspItemList) {
		//console.log(itemInfo);

		var itemInfoXML = { 
			"DRY" : {
				"@date": xmldate,
				"@action": "update",
				"#text": {
					"NLU-NO": itemInfo.priceId.itemCode || "",
					"PRICE": itemInfo.price || ""
				}
			}
		 };

		 tempItemList.push(itemInfoXML);

		 //console.log(itemInfoXML);
	}

	var xmlDoc = {
		"OCT2000-IMPORT" : {
			"@siteno": storeNo,
			"@version" : "Z09.45",
			"@system": "PB",
			"@context": "Pending Changes site"+ storeNo,
			"#text" : tempItemList
		}
	}

	 var xml = xmlbuilder.create(xmlDoc).end({ pretty: true});
	 //console.log(xml);

	 //var filename = "E" + dateFormat(new Date(), "yyyymmdd_HHMMss_") + storeNo + ".XML";

	 fs.writeFile('./'+filename, xml, function (err,data) {
		if (err) {
		  return console.log(err);
		}
		//console.log(data);
		callback("Writing to File Completed");
	  });

	  console.log('Leaving: writeToXMLFile');
};



function authToken(){
	request.post(setParams(CONSTANTS.METHOD_TYPES.POST, CONSTANTS.BSP.API_ENDPOINTS.AUTHENTICATE), function (e, r, body) {
		var res = JSON.parse(body);
		//console.log("authToken :"+JSON.stringify(res, null, 4));
		token = res.token;
		//getCats();
	});
}

function getCats(){
	request.get(setParams(CONSTANTS.METHOD_TYPES.GET, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEMS), function (e, r, body) {
		var res = JSON.parse(body);
		console.log("getCats "+JSON.stringify(res, null, 4));
	});
}

function setParams(type, path){
	return {headers: buildHeaders(type, path), url: buildURL(path),method: type}
}

function buildHeaders(type, path){
	var headers = {
		'nep-organization': org,
		'Authorization': generateAuth(type, path),
		'Date': date,
		'Content-Type':contentType
	};
	return headers;
}


function setParamsNEPEUNIT(type, path){
	return {headers: buildHeadersNEPEUNIT(type, path), url: buildURL(path),method: type}
}

function buildHeadersNEPEUNIT(type, path){
	var headers = {
		'nep-organization': org,
		'nep-enterprise-unit':CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT,
		'Authorization': generateAuth(type, path),
		'Date': date,
		'Content-Type':contentType
	};
	return headers;
}

function generateAuth(method, path){
	if(token){
		return "Bearer " + token;
	}
	var time = isoTime();
	var oneTimeSecret = CONSTANTS.BSP.API_PARAMS.SECRET_KEY + time;
	var toSign = method + "\n" + path;

	if(contentType) {
		toSign += "\n" + contentType.trim();
	}
	if(org) {
		toSign += "\n" + org.trim();
	}
	
	var key = cryptojs.HmacSHA512(toSign, oneTimeSecret);
	var accessKey = "AccessKey " + CONSTANTS.BSP.API_PARAMS.SHARED_KEY + ":" + cryptojs.enc.Base64.stringify(key);
	//console.log("accessKey :"+accessKey);
	
	return accessKey;
}

function isoTime() {
    var d = new Date();
    d.setMilliseconds(0);
	date = d.toUTCString();
    return d.toISOString();
}

function buildURL(path){
	var url = CONSTANTS.BSP.API_PARAMS.BASE_URL + path;
	//console.log("API URL :"+url);
	return url;
}

module.exports.generateXMLFileforItems = generateXMLFileforItems;
module.exports.generateXMLFileforStore = generateXMLFileforStore;