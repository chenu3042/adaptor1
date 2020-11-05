var constants = {
  BSP: {
    API_PARAMS: {
      SHARED_KEY: '1e95aa27f5ad4f4e90886309fd20c018',
      SECRET_KEY: '85667db9ef80424595186809158efb0c',
      NEP_ENTERPRISE_UNIT: 'ca004432ccab4d3aa92642f05dd90a68',
      ORGANIZATION: 'db0665b137b147ff8daf7e7ac1aef9af',
      BASE_URL: 'https://gateway-staging.ncrcloud.com'
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
        PUT_ITEM_PRICES: '/catalog/item-prices',
        GET_ITEM_PRICES_SNAPSHOT: '/catalog/item-prices/snapshot'
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
      TDM_SERVICE: {
        POST_UPLOAD_TDM: '/transaction-document/2/transaction-documents/2',
      },
      SITE_SERVICE: {
        GET_SITES: '/site/sites',
      },
    },
  },
  METHOD_TYPES: {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PUT: 'PUT',
  },
};

module.exports = constants;
