const express = require('express');
const request = require('request');
const log4js = require('log4js');
var dateFormat = require('dateformat');
const common = require('./common');

const mapApiToModel = require('../data/mapper/modelMapper.js');
const CONSTANTS = require('../../constants.js');
const userService = require('../data/mockResponse/users.js');
const Category = require('../data/pojo/Category.js');
const Item = require('../data/pojo/Item.js');
const ItemDetails = require('../data/pojo/ItemDetails.js');
const config = require('../config/config.json');
const { json } = require('body-parser');
// const Delivery = require('../data/pojo/delivery.js');
const pushFileToDrive = require('../pricebook/fileTransfer.js').pushFileToDrive;
const zipFile = require('../pricebook/zip.js');
const generateXMLFileforStore = require('../pricebook/generateXML.js').generateXMLFileforStore;
const router = express.Router();

log4js.configure('./server/config/log4js.json');
var log = log4js.getLogger('api');
var log_level = config.BASICS.LOG_LEVEL;
log.logLevel = log_level;

router.get('/test', async (req, res, next) => {
	try {

		console.log('Test API');
		res.send({ result: 'success' });
	} catch (e) {
		log.error(`Error :${e}`);
		next(e);
	}
});

router.put('/sendXMLToStore', async (req, res, next) => {
  try {

    var xmlFile = req.body.xmlFile;
    var computername = req.body.computername;
    var networkDirectory = req.body.dirname;
    var xmlZip = xmlFile.replace('.XML', '.ZIP');

    computername = '\\\\' + computername + '\\' + networkDirectory;

    console.log('xmlFile-' + xmlFile);
    console.log('xmlZip-' + xmlZip);
    console.log('computername-' + computername);

    zipFile(xmlFile, xmlZip);

    pushFileToDrive(computername, xmlZip, xmlZip, (r) => {
      console.log('Send XML API');
      res.send({'result': r });
    });

    
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});


router.put('/generateItemsXML/:storeId', async (req, res, next) => {
  try {

    console.log('API Enter: generateItemsXML');

                              var filename = "E" + dateFormat(new Date(), "yyyymmdd_HHMMss_") + req.params.storeId + ".XML";

    generateXMLFileforStore(req.params.storeId,(result) => {
      console.log(result);
      res.send( result );
    });

                              //generateXMLFileforItems(req.body,req.params.storeId,filename,function(result) { 
    //  console.log('API Leaving: generateItemsXML');
                              //            res.send( [ { "filename": filename } ] );

    //});

                              
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});

router.get('/cat/cats', common.authToken, async (req, res, next) => {
  try {
    request.get(
      common.setParams(
        CONSTANTS.METHOD_TYPES.GET,
        CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CATS
      ),
      function (err, response, body) {
        if (err) {
          log.debug(`API Error :${err}`);
          return res.json(err);
        }
        log.debug(`API Response Status Code:${response.statusCode}`);
        var apiResponse = JSON.parse(body);
        var cats = [];
        for (let cat of apiResponse.pageContent) {
          const convertedModel = mapApiToModel(
            cat,
            Category.apiToCategoryMap,
            Category.constructor
          );
          cats.push(convertedModel);
        }
        res.send(cats);
      }
    );
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});

router.get('/cat/items', common.authToken, async (req, res, next) => {
  try {
    request.get(
      common.setParams(
        CONSTANTS.METHOD_TYPES.GET,
        CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEMS
      ),
      function (err, response, body) {
        if (err) {
          log.debug(`API Error :${err}`);
          return res.json(err);
        }
        log.debug(`API Response Status Code:${response.statusCode}`);
        var apiResponse = JSON.parse(body);
        var items = [];
        for (let item of apiResponse.pageContent) {
          const convertedModel = mapApiToModel(
            item,
            Item.apiToItemMap,
            Item.constructor
          );
          items.push(convertedModel);
        }
        res.json(items);
      }
    );
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});

router.get(
  '/cat/itemdetailsByCat/:catId',
  common.authToken,
  async (req, res, next) => {
    try {
      var queryParams = 'merchandiseCategoryId=' + req.params.catId;
      request.get(
        common.setParams(
          CONSTANTS.METHOD_TYPES.GET,
          CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEM_DETAILS +
            queryParams
        ),
        function (err, response, body) {
          if (err) {
            log.debug('API Error : ' + err);
            return res.json(err);
          }
          var apiResponse = JSON.parse(body);
          log.debug('API Response Status Code: ' + response.statusCode);
          var items = [];
          for (let item of apiResponse.pageContent) {
            const convertedModel = mapApiToModel(
              item,
              ItemDetails.apiToItemDetailsMap,
              ItemDetails.constructor
            );
            items.push(convertedModel);
          }
          res.json(items);
        }
      );
    } catch (e) {
      log.error('Error : ' + e);
      next(e);
    }
});

router.get(
  '/store/itemdetailsById/:itemId',
  common.authToken,
  async (req, res, next) => {
    try {
      var queryParams = 'itemCodePattern=' + req.params.itemId;
      request.get(
        common.setParams(
          CONSTANTS.METHOD_TYPES.GET,
          CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEM_DETAILS +
            queryParams
        ),
        function (err, response, body) {
          if (err) {
            log.debug('API Error : ' + err);
            return res.json(err);
          }
          var apiResponse = JSON.parse(body);
          log.debug('API Response Status Code: ' + response.statusCode);
          var items = [];
          for (let item of apiResponse.pageContent) {
            const convertedModel = mapApiToModel(
              item,
              ItemDetails.apiToItemDetailsMap,
              ItemDetails.constructor
            );
            items.push(convertedModel);
          }
          res.json(items);
        }
      );
    } catch (e) {
      log.error('Error : ' + e);
      next(e);
    }
});

router.get(
  '/cat/itemdetailsById/:itemId',
  common.authToken,
  async (req, res, next) => {
    try {
      var queryParams = 'itemCodePattern=' + req.params.itemId;
      request.get(
        common.setParams(
          CONSTANTS.METHOD_TYPES.GET,
          CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.GET_CAT_ITEM_DETAILS +
            queryParams
        ),
        function (err, response, body) {
          if (err) {
            log.debug('API Error : ' + err);
            return res.json(err);
          }
          var apiResponse = JSON.parse(body);
          log.debug('API Response Status Code: ' + response.statusCode);
          var items = [];
          for (let item of apiResponse.pageContent) {
            const convertedModel = mapApiToModel(
              item,
              ItemDetails.apiToItemDetailsMap,
              ItemDetails.constructor
            );
            items.push(convertedModel);
          }
          res.json(items);
        }
      );
    } catch (e) {
      log.error('Error : ' + e);
      next(e);
    }
});

router.get(
  '/ias/item-availability/:itemCode',
  common.authToken,
  async (req, res, next) => {
    try {
      var queryParams = req.params.itemCode;
      request.get(
        common.setParams(
          CONSTANTS.METHOD_TYPES.GET,
          CONSTANTS.BSP.API_ENDPOINTS.ITEM_AVAILABILITY_SERVICE
            .GET_ITEM_AVAILABILITY + queryParams
        ),
        function (err, response, body) {
          if (err) {
            log.debug(`API Error :${err}`);
            return res.json(err);
          }
          log.debug(`API Response Status Code:${response.statusCode}`);
          var apiResponse = JSON.parse(body);
          res.json(apiResponse);
        }
      );
    } catch (e) {
      log.error(`Error :${e}`);
      next(e);
    }
  }
);

router.put('/cat/cats', common.authToken, async (req, res, next) => {
  try {
		var req_cat = { "nodes": [] };
    // for (let cat of req.body) {
    // 	console.log("req_cat :" + JSON.stringify(cat));
    // 	const convertedModel = mapModelToApi(cat, Category.modalToApiCategoryMap);
    // 	req_cat.nodes.push(convertedModel);
    // }
		console.log("req_cat :" + JSON.stringify(req_cat));
    request.put(
      common.setOptions(
        CONSTANTS.METHOD_TYPES.PUT,
        CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_CATS,
				req.body),
      function (err, response, body) {
        if (err) {
          log.debug(`API Error :${err}`);
          return res.json(err);
        }
        log.debug(`API Response Status Code:${response.statusCode}`);
        var apiResponse = JSON.parse(body);
        res.send(body);
			});
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});

router.put('/cat/item-prices', common.authToken, async (req, res, next) => {
  try {

		const now = new Date()  
    const secondsSinceEpoch = Math.round(now.getTime());

    for (let i = 0; i < req.body.itemPrices.length; i++) {
      req.body.itemPrices[i].version = secondsSinceEpoch;
      req.body.itemPrices[i].currency = 'USD';
      req.body.itemPrices[i].effectiveDate = '2020-09-01T00:00:00Z';
      req.body.itemPrices[i].endDate = '2021-09-01T00:00:00Z';
      req.body.itemPrices[i].status = 'ACTIVE';
			req.body.itemPrices[i].priceId.enterpriseUnitId = CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT;
			req.body.itemPrices[i].priceId.priceCode = '1'

    }

    //console.log("req.body :" + JSON.stringify(req.body));
    request.put(
      common.setOptions(
        CONSTANTS.METHOD_TYPES.PUT,
        CONSTANTS.BSP.API_ENDPOINTS.CATALOG_SERVICE.PUT_ITEM_PRICES,
									req.body), 
      function (err, response, body) {
        if (err) {
          log.debug(`API Error :${err}`);
          return res.json(err);
        }
        log.debug(`API Response Status Code:${response.statusCode}`);
        //var apiResponse = JSON.parse(body);
        res.send(body);
		});

  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
});


//Delivery APIs
//Delivery Create quote.
router.post('/delivery/quote', common.authToken, async (req, res, next) => {
  try {
    console.log('reqBody :' + JSON.stringify(req.body));
    request.post(
      common.setOptions(
        CONSTANTS.METHOD_TYPES.POST,
        CONSTANTS.BSP.API_ENDPOINTS.DELIVERY_SERVICES.POST_DELIVERY_QUOTE,
        req.body
      ),

      function (e, r, body) {
        /* var apiResponse = JSON.parse(body);
				var DeliveryResponse;
				const convertedModel = mapApiToModel(
				  apiResponse.content,
				  DeliveryResponse.apiToDeliveryReqMap,
				  DeliveryResponse.constructor*/
        console.log(JSON.stringify(body));
        res.json(body);
        //);
      }
    );
  } catch (e) {}
});

//Delivery Create delivery.
router.post(
  '/delivery/deliveries',
  common.authToken,
  async (req, res, next) => {
    try {
      console.log('reqBody :' + JSON.stringify(req.body));
      request.post(
        common.setOptions(
          CONSTANTS.METHOD_TYPES.POST,
          CONSTANTS.BSP.API_ENDPOINTS.DELIVERY_SERVICES
            .POST_DELIVERY_CREATE_DELIVERY,
          req.body
        ),

        function (e, r, body) {
          /* var apiResponse = JSON.parse(body);
				  var DeliveryResponse;
				  const convertedModel = mapApiToModel(
					apiResponse.content,
					DeliveryResponse.apiToDeliveryReqMap,
					DeliveryResponse.constructor*/
          console.log(JSON.stringify(body));
          res.json(body);
          //);
        }
      );
    } catch (e) {}
});

//Order service APIs
//Create Order.
router.post('/order/orders', common.authToken, async (req, res, next) => {
  try {
    console.log('reqBody :' + JSON.stringify(req.body));
    request.post(
      common.setOptions(
        CONSTANTS.METHOD_TYPES.POST,
        CONSTANTS.BSP.API_ENDPOINTS.ORDER_SEREVICE.POST_CREATE_ORDER,
        req.body
      ),

      function (e, r, body) {
        /* var apiResponse = JSON.parse(body);
					var DeliveryResponse;
					const convertedModel = mapApiToModel(
					  apiResponse.content,
					  DeliveryResponse.apiToDeliveryReqMap,
					  DeliveryResponse.constructor*/
        console.log(JSON.stringify(body));
        res.json(body);
        //);
      }
    );
  } catch (e) {}
});

//Get Order Details
router.get(
  '/order/orders/:orderId',
  common.authToken,
  async (req, res, next) => {
    try {
      var queryParams = req.params.orderId;
      request.get(
        common.setParams(
          CONSTANTS.METHOD_TYPES.GET,
          CONSTANTS.BSP.API_ENDPOINTS.ORDER_SEREVICE.GET_ORDER_DETAILS +
            queryParams
        ),
        function (err, response, body) {
          if (err) {
            log.debug(`API Error :${err}`);
            return res.json(err);
          }
          log.debug(`API Response Status Code:${response.statusCode}`);
          var apiResponse = JSON.parse(body);
          res.json(apiResponse);
        }
      );
    } catch (e) {
      log.error(`Error :${e}`);
      next(e);
    }
});

module.exports = router;
