var constants = {
  BSP: {
    API_PARAMS: {
			SHARED_KEY: "9dba64c3f8e142ef97b4c37b2705cf95",
			SECRET_KEY: "145853e36b9243689e195588da7e0a68",
			NEP_ENTERPRISE_UNIT: "e9c2036a60b845e4a4b8ce9082beb6f0",
			ORGANIZATION: "sr185246",
			BASE_URL: "https://gateway-staging.ncrcloud.com"
    },
    API_ENDPOINTS: {
      AUTHENTICATE: '/security/authentication/login',
      CATALOG_SERVICE: {
        GET_CAT_ITEMS: '/catalog/items',
		  GET_ITEM_INFO: '/catalog/items/',
		  GET_CAT_ITEM_DETAILS: '/catalog/item-details/search?',
		  GET_CATS: '/catalog/category-nodes',
		  GET_ITEM_ATTRIBUTES: '/catalog/item-attributes/',
		  GET_ITEM_PRICES: '/catalog/item-prices/',
		  PUT_CATS: '/catalog/category-nodes',
		  PUT_ITEM_INFO: '/catalog/items',
		  PUT_ITEM_ATTRIBUTES: '/catalog/item-attributes',
		  PUT_ITEM_PRICES: '/catalog/item-prices'
      },
      ITEM_AVAILABILITY_SERVICE: {
        GET_ITEM_AVAILABILITY: '/ias/item-availability/',
      },
      DELIVERY_SERVICES: {
        POST_DELIVERY_QUOTE: '/delivery/quotes',
        POST_DELIVERY_CREATE_DELIVERY: '/delivery/deliveries',
      },
      ORDER_SEREVICE: {
        POST_CREATE_ORDER: '/order/orders',
        GET_ORDER_DETAILS: '/order/orders/',
      },
    },
  },
  METHOD_TYPES: {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
		PUT: 'PUT'
	}
};
module.exports = constants;