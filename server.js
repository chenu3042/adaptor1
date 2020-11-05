const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const api = require('./server/routes/api');
const userApi = require('./server/routes/user-api');
const siteApi = require('./server/routes/site');
//const tdmApi = require('./server/routes/tdm');
const log4js = require('log4js');
const config = require('./server/config/config.json');
const app = express();
const port = process.env.PORT || '3000';
const db = require('./server/models');

log4js.configure('./server/config/log4js.json');
const log = log4js.getLogger('server');
var log_level = config.BASICS.LOG_LEVEL;
log.level = log_level;

//Data Mapper
var CONSTANTS = require('./constants.js');
var request = require('request');
var DMM = require('./data-model-mapper');
const { include } = require('underscore');
var category_config = require('./catalogMap.js').category_config;
var item_config = require('./catalogMap.js').item_config;
var item_attr_config = require('./catalogMap.js').item_attr_config;
var item_price_config = require('./catalogMap.js').item_price_config;

const csv = require('csv-parser');
const fs = require('fs');

var org = CONSTANTS.BSP.API_PARAMS.ORGANIZATION;
var contentType = "application/json";
var date;
var token;

var cryptojs = require('crypto-js');

//readInputCSVFile();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Expose-Headers", "x-total-count");
	  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
	  res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
	  next();
	});
app.use('/api', api);
app.use('/api', userApi);
app.use('/api', siteApi);
//app.use('/api', tdmApi);
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
	log.info(`APP VERSION :${config.BASICS.APP_VERSION}`);
	log.info(`API running on localhost:${port}`);
	console.log(`API running on localhost:${port}`);
});

db.userModelSync()
	.then(() => {})
	.catch(err => log.error("db.userModelSync :"+err));
   
//Data Mapper
function readInputCSVFile(){

	var csvData=[];
	fs.createReadStream('./import/OctaneItemData.csv')
		.pipe(csv())
		.on('data', (row) => {
			//console.log(row);
			csvData.push(row);   
		})
		.on('end', ()=> {
			processInputCSVFile(csvData);
			//console.log('CSV file successfully processed');
  	     });	  

}


function processInputCSVFile(rows){

	var categorylist = [];
	var itemList = [];
	var itemAttrbutesList = [];
	var itemPricesList = [];
	for (let line of rows) {

		var categoryInfo = new DMM(category_config);
		var categoryInfoMapped = categoryInfo.map(line);

		const result = categorylist.find( ({ nodeId }) => nodeId === categoryInfoMapped.nodeId );
		if(result == null) {
			categorylist.push(categoryInfoMapped);
		}


		var itemInfo = new DMM(item_config);
		var itemInfoMapped = itemInfo.map(line);
		itemList.push(itemInfoMapped);

		var itemAttrInfo = new DMM(item_attr_config);
		var itemAttrInfoMapped = itemAttrInfo.map(line);
		itemAttrbutesList.push(itemAttrInfoMapped);

		var itemPriceInfo = new DMM(item_price_config);
		var itemPriceInfoMapped = itemPriceInfo.map(line);
		itemPricesList.push(itemPriceInfoMapped);

	}


	for (let category of categorylist) {

		if(!category.nodeCode){
			category.nodeCode = config.CATEGORY.DEFAULT.nodeCode;
		}

		if(!category.departmentNode){
			category.departmentNode = config.CATEGORY.DEFAULT.departmentNode;
		}

		if(!category.departmentSale){
			category.departmentSale = config.CATEGORY.DEFAULT.departmentSale;
		}

		if(!category.status){
			category.status = config.CATEGORY.DEFAULT.status;
		}

		if(!category.title_locale){
			category.title_locale = config.CATEGORY.DEFAULT.title_locale;
		}

		processCatInfo(category);
		//console.log(category);
	}


	for (let item of itemList) {

		if(!item.longDescription_locale){
			item.longDescription_locale = config.ITEMS.DEFAULT.longDescription_locale;
		}

		if(!item.shortDescription_locale){
			item.shortDescription_locale = config.ITEMS.DEFAULT.shortDescription_locale;
		}

		if(!item.status){
			item.status = config.ITEMS.DEFAULT.status;
		}

		if(!item.nonMerchandise){
			item.nonMerchandise = config.ITEMS.DEFAULT.nonMerchandise;
		}

		processItemInfo(item);
		//console.log(item);
	}

	for (let item of itemAttrbutesList) {

		if(!item.longDescription_locale){
			item.longDescription_locale = config.ITEMATTRIBUTES.DEFAULT.longDescription_locale;
		}

		if(!item.shortDescription_locale){
			item.shortDescription_locale = config.ITEMATTRIBUTES.DEFAULT.shortDescription_locale;
		}

		if(!item.status){
			item.status = config.ITEMATTRIBUTES.DEFAULT.status;
		}

		if(!item.blockForSale){
			item.blockForSale = config.ITEMATTRIBUTES.DEFAULT.blockForSale;
		}


		processItemAttributes(item);
		//console.log(item);
	}

	for (let item of itemPricesList) {

		if(!item.currency){
			item.currency = config.ITEMPRICES.DEFAULT.currency;
		}

		if(!item.basePrice){
			item.basePrice = config.ITEMPRICES.DEFAULT.basePrice;
		}

		if(!item.effectiveDate){
			item.effectiveDate = config.ITEMPRICES.DEFAULT.effectiveDate;
		}

		if(!item.endDate){
			item.endDate = config.ITEMPRICES.DEFAULT.endDate;
		}

		if(!item.status){
			item.status = config.ITEMPRICES.DEFAULT.status;
		}

		if(!item.itemPriceType){
			item.itemPriceType = config.ITEMPRICES.DEFAULT.itemPriceType;
		}

		if(!item.tareWeightUom){
			item.tareWeightUom = config.ITEMPRICES.DEFAULT.tareWeightUom;
		}



		if(!item.tareWeight){
			item.tareWeight = config.ITEMPRICES.DEFAULT.tareWeight;
		}

		if(!item.precision){
			item.precision = config.ITEMPRICES.DEFAULT.precision;
		}

		if(!item.includesContainer){
			item.includesContainer = config.ITEMPRICES.DEFAULT.includesContainer;
		}

		if(!item.quantityPricedItem){
			item.quantityPricedItem = config.ITEMPRICES.DEFAULT.quantityPricedItem;
		}

		if(!item.priceCode){
			item.priceCode = config.ITEMPRICES.DEFAULT.priceCode;
		}



		processItemPrices(item);
		//console.log(item);
	}

	//console.log("Uploading Successfully");
}


function processCatInfo(catInfo){

	var queryParams = "/"+catInfo.nodeId;
	request.get(setParams(CONSTANTS.METHOD_TYPES.GET, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CATS+queryParams), function (e, r, body) {
		var res = {};
		
		if(body) {
			res = JSON.parse(body);
		}

		var insertFlag = 0;
		if(res.statusCode == "404"  ) {
			insertFlag = 1;
			console.log("catInfo - " + queryParams + " : INSERT");
		} else {

			if( res.tag != catInfo.tag ||
				res.title.values[0].value != catInfo.title_value 
				) {
					insertFlag = 2;

                    console.log("catInfo - " + queryParams + " : UPDATE" );
				} else {
					//console.log("catInfo - " + queryParams + " : NO UPDATE REQUIRED");
				}
		}

		if( insertFlag ) {

			var version = insertFlag == 1 ? 1 : res.version + 1;
			catInfo.tag = insertFlag == 1 || catInfo.tag != res.tag ? catInfo.tag : res.tag;
            catInfo.title_value = insertFlag == 1 || catInfo.title_value != res.title.values[0].value ? catInfo.title_value : res.title.values[0].value;

			insert_update_cat_info(catInfo,version);
		}



	});
}

function insert_update_cat_info(catInfo,version) {

	var reqBody = {
		'nodes' : [ 
			{
				'version': version,
				'nodeCode': catInfo.nodeCode,
				'tag': catInfo.tag,
				'departmentNode': catInfo.departmentNode,
				'departmentSale': catInfo.departmentSale,
				'status': catInfo.status,
				'title': {
					'values':  [ 
							{
								'locale': catInfo.title_locale,
								'value': catInfo.title_value
							} 
					]
				},
				'nodeId': {
					'nodeId': catInfo.nodeId
				}
			} 
	  ]
	};

	//console.log("Body"+JSON.stringify(reqBody, null, 4));
	request.put(setParamsForPut(CONSTANTS.METHOD_TYPES.PUT, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_CATS, reqBody), function (e, r, body) {
		if( r.statusCode == '204') {
			console.log("Cat-nodeId:  "+catInfo.nodeId+" - "+r.statusCode);
		} else {
			console.log("Cat-nodeId:  "+catInfo.nodeId+" - "+r.statusCode+" - "+body.message);
		}
	});

}



function processItemInfo(itemInfo){

	var queryParams = itemInfo.itemCode;
	request.get(setParams(CONSTANTS.METHOD_TYPES.GET, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_ITEM_INFO+queryParams), function (e, r, body) {
		var res = {};
		
		if(body) {
			res = JSON.parse(body);
		}
		
		var insertFlag = 0;
		if(res.statusCode == "404"  ) {
			insertFlag = 1;
			console.log("itemInfo - " + queryParams + " : INSERT");
		} else {

			if( res.shortDescription.values[0].value != itemInfo.shortDescription_value ||
				res.longDescription.values[0].value != itemInfo.longDescription_value ||
				res.merchandiseCategory.nodeId != itemInfo.nodeId ||
				res.status != itemInfo.status
				) {
					insertFlag = 2;

                    console.log("itemInfo - " + queryParams + " : UPDATE" );
				} else {
					console.log("itemInfo - " + queryParams + " : NO UPDATE REQUIRED");
				}
		}

		if( insertFlag ) {


			var version = insertFlag == 1 ? 1: res.version + 1;

			itemInfo.longDescription_value = insertFlag == 1 || itemInfo.longDescription_value != res.longDescription.values[0].value ? itemInfo.longDescription_value : res.longDescription.values[0].value;
			itemInfo.shortDescription_value = insertFlag == 1 || itemInfo.shortDescription_value != res.shortDescription.values[0].value ? itemInfo.shortDescription_value : res.shortDescription.values[0].value;
			itemInfo.nodeId = insertFlag == 1 || itemInfo.nodeId != res.merchandiseCategory.nodeId ? itemInfo.nodeId : res.merchandiseCategory.nodeId;
			itemInfo.status = insertFlag == 1 ||  itemInfo.status != res.status ? itemInfo.status : res.status;

			insert_update_item_info(itemInfo,version);
		}



	});
}


function insert_update_item_info(itemInfo,version) {

	var reqBody = {
		'items' : [ 
			{
				'version': version,
				'longDescription': {
					'values':  [ 
							{
								'locale': itemInfo.longDescription_locale,
								'value': itemInfo.longDescription_value
							} 
					]
				},
				'shortDescription': {
					'values':  [ 
							{
								'locale': itemInfo.shortDescription_locale,
								'value': itemInfo.shortDescription_value
							} 
					]
				},
				'merchandiseCategory': {
					'nodeId': itemInfo.nodeId
				},
				'status': itemInfo.status ,
				'departmentId' : itemInfo.nodeId,
				'nonMerchandise' : itemInfo.nonMerchandise,
				'itemId': {
					'itemCode': itemInfo.itemCode
				}
			} 
	  ]
	};

	//console.log("Body"+JSON.stringify(reqBody, null, 4));
	request.put(setParamsForPut(CONSTANTS.METHOD_TYPES.PUT, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_ITEM_INFO, reqBody), function (e, r, body) {
		if( r.statusCode == '204') {
			console.log("items-itemCode:  "+itemInfo.itemCode+" - "+r.statusCode);
		} else {
			console.log("items-itemCode:  "+itemInfo.itemCode+" - "+r.statusCode+" - "+body.message);
		}
	});


	var tem  = true;
}



function processItemAttributes(itemAttrInfo){

	var queryParams = itemAttrInfo.itemCode;
	request.get(setParams(CONSTANTS.METHOD_TYPES.GET, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_ITEM_ATTRIBUTES+queryParams), function (e, r, body) {
		var res = {};
		
		if(body) {
			res = JSON.parse(body);
		}

		var insertFlag = 0;
		if(res.statusCode == "404"  ) {
			insertFlag = 1;
			console.log("itemAttributes - " + queryParams + " : INSERT");
		} else {

			if( res.shortDescription.values[0].value != itemAttrInfo.shortDescription_value ||
				res.longDescription.values[0].value != itemAttrInfo.longDescription_value ||
				res.merchandiseCategory.nodeId != itemAttrInfo.nodeId ||
				res.status != itemAttrInfo.status ) {
					insertFlag = 2;
                    console.log("itemAttributes - " + queryParams + " : UPDATE");
				} else {
					console.log("itemAttributes - " + queryParams + " : NO UPDATE REQUIRED");
				}
		}

		if( insertFlag ) {


			var version = insertFlag == 1 ? 1: res.version + 1;

			itemAttrInfo.blockForSale = insertFlag == 1 ? itemAttrInfo.blockForSale: res.blockForSale;
			itemAttrInfo.longDescription_value = insertFlag == 1 || itemAttrInfo.longDescription_value != res.longDescription.values[0].value ? itemAttrInfo.longDescription_value : res.longDescription.values[0].value;
			itemAttrInfo.shortDescription_value = insertFlag == 1 || itemAttrInfo.shortDescription_value != res.shortDescription.values[0].value ? itemAttrInfo.shortDescription_value : res.shortDescription.values[0].value;
			itemAttrInfo.nodeId = insertFlag == 1 || itemAttrInfo.nodeId != res.merchandiseCategory.nodeId ? itemAttrInfo.nodeId : res.merchandiseCategory.nodeId;
			itemAttrInfo.status = insertFlag == 1 ||  itemAttrInfo.status != res.status ? itemAttrInfo.status : res.status;

			insert_update_item_attributes(itemAttrInfo,version);
		}

	});
}

function insert_update_item_attributes(itemAttrInfo,version) {

	var reqBody = {
		'itemAttributes' : [ 
			{
				'version': version,
				'blockForSale': itemAttrInfo.blockForSale,
				'longDescription': {
					'values':  [ 
							{
								'locale': itemAttrInfo.longDescription_locale,
								'value': itemAttrInfo.longDescription_value
							} 
					]
				},
				'shortDescription': {
					'values':  [ 
							{
								'locale': itemAttrInfo.shortDescription_locale,
								'value': itemAttrInfo.shortDescription_value
							} 
					]
				},
				'merchandiseCategory': {
					'nodeId': itemAttrInfo.nodeId
				},
				'status': itemAttrInfo.status,
				'itemAttributesId': {
					'itemCode': itemAttrInfo.itemCode,
					'enterpriseUnitId': CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT	
				}
			} 
	  ]
	};

	//console.log("Body"+JSON.stringify(reqBody, null, 4));
	request.put(setParamsForPut(CONSTANTS.METHOD_TYPES.PUT, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_ITEM_ATTRIBUTES, reqBody), function (e, r, body) {
		if( r.statusCode == '204') {
			console.log("itemAttributes-itemCode:  "+itemAttrInfo.itemCode+" - "+r.statusCode);
		} else {
			console.log("itemAttributes-itemCode:  "+itemAttrInfo.itemCode+" - "+r.statusCode+" - "+body.message);
		}
	});


	var tem  = true;
}


function processItemPrices(priceInfo){

	var queryParams = priceInfo.itemCode+"/1";
	request.get(setParams(CONSTANTS.METHOD_TYPES.GET, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_ITEM_PRICES+queryParams), function (e, r, body) {
		var res = {};
		
		if(body ) {
			res = JSON.parse(body);
		}

		var insertFlag = 0;
		if(res.statusCode == "404"  ) {
			insertFlag = 1;
			console.log("itemPrices - " + queryParams + " : INSERT");
		} else {

			if( res.price != priceInfo.price || res.currency != priceInfo.currency ||
				String(res.basePrice) != priceInfo.basePrice || res.status != priceInfo.status ||
				res.itemPriceType != priceInfo.itemPriceType || res.tareWeightUom != priceInfo.tareWeightUom ||
				res.tareWeight != priceInfo.tareWeight || res.precision != priceInfo.precision ||
				String(res.includesContainer) != priceInfo.includesContainer || String(res.quantityPricedItem) != priceInfo.quantityPricedItem 
				) {
					insertFlag = 2;

                    console.log("itemPrices - " + queryParams + " : UPDATE" );
				} else {
					console.log("itemPrices - " + queryParams + " : NO UPDATE REQUIRED");
				}
		}

		if( insertFlag ) {


			var version = insertFlag == 1 ? 1 : res.version + 1;
			priceInfo.price =  insertFlag == 1 || res.price != priceInfo.price ? priceInfo.price : res.price;
			priceInfo.currency = insertFlag == 1 || res.currency != priceInfo.currency ? priceInfo.currency : res.currency;
			priceInfo.status =  insertFlag == 1 ||  priceInfo.status != res.status ? priceInfo.status : res.status;
			priceInfo.basePrice = insertFlag == 1 || res.basePrice != priceInfo.basePrice ? priceInfo.basePrice : res.basePrice;
			priceInfo.itemPriceType = insertFlag == 1 || res.itemPriceType != priceInfo.itemPriceType ? priceInfo.itemPriceType : res.itemPriceType;
			priceInfo.tareWeightUom = insertFlag == 1 ||  res.tareWeightUom != priceInfo.tareWeightUom ? priceInfo.tareWeightUom : res.tareWeightUom;
			priceInfo.tareWeight = insertFlag == 1 ||  priceInfo.tareWeight != res.tareWeight ? priceInfo.tareWeight : res.tareWeight;
			priceInfo.precision = insertFlag == 1 ||  priceInfo.precision != res.precision ? priceInfo.precision : res.precision;
			priceInfo.includesContainer = insertFlag == 1 ||  priceInfo.includesContainer != res.includesContainer ? priceInfo.includesContainer : res.includesContainer;
			priceInfo.quantityPricedItem = insertFlag == 1 ||  priceInfo.quantityPricedItem != res.quantityPricedItem ? priceInfo.quantityPricedItem : res.quantityPricedItem;
			
			insert_update_item_prices(priceInfo,version);
		}



	});
}



function insert_update_item_prices(priceInfo,version) {

	var reqBody = {
		'itemPrices' : [ 
			{
				'version': version,
				'price': priceInfo.price,
				'currency': priceInfo.currency,
				'effectiveDate': priceInfo.effectiveDate,
				'endDate': priceInfo.endDate,
				'status': priceInfo.status,
				'basePrice': priceInfo.basePrice,
				'itemPriceType': priceInfo.itemPriceType,
				'tareWeightUom': priceInfo.tareWeightUom,
				'tareWeight': priceInfo.tareWeight,
				'precision': priceInfo.precision,
				'includesContainer': priceInfo.includesContainer,
				'quantityPricedItem': priceInfo.quantityPricedItem,
				'priceId': {
					'itemCode': priceInfo.itemCode,
					'enterpriseUnitId': CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT,
					'priceCode': '1'
				}
			} 
	  ]
	};

	//console.log("Body"+JSON.stringify(reqBody, null, 4));
	request.put(setParamsForPut(CONSTANTS.METHOD_TYPES.PUT, CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_ITEM_PRICES, reqBody), function (e, r, body) {
		if( r.statusCode == '204') {
			console.log("itemPrices-itemCode:  "+priceInfo.itemCode+" - "+r.statusCode);
		} else {
			console.log("itemPrices-itemCode:  "+priceInfo.itemCode+" - "+r.statusCode+" - "+body.message);
		}
	});


	var tem  = true;
}




function setParamsForPut(type, path, body){

	var options = {
		headers: buildHeaders(type, path),
		url: buildURL(path),
		method: type,
		json:true
	}

	if (body) {
		options['body'] = body;
	}

	return options;

	//return {headers: buildHeaders(type, path, body), url: buildURL(path),method: type}
}

function setParams(type, path){
	return {headers: buildHeaders(type, path), url: buildURL(path),method: type}
}

function buildHeaders(type, path){
	var headers = {
		'nep-organization': org,
		'nep-enterprise-unit':CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT,
		'Authorization': generateAuth(type, path),
		'Date': date,
		'Content-Type':contentType
	};

	//console.log("headers: ",headers)
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
	console.log("accessKey :"+accessKey);
	
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
	console.log("API URL :"+url);
	return url;
}
   