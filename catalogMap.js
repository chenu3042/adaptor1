const config = require('./server/config/config.json');

var category_map= [    
  {dest: 'nodeCode', src:`${config.CATEGORY.COLUMNS.nodeCode}`},
  {dest: 'tag', src:`${config.CATEGORY.COLUMNS.tag}`},
  {dest: 'departmentNode', src: `${config.CATEGORY.COLUMNS.departmentNode}`},
  {dest: 'departmentSale', src:`${config.CATEGORY.COLUMNS.departmentSale}`},
  {dest: 'status', src:`${config.CATEGORY.COLUMNS.status}`},
  {dest: 'title_locale', src :`${config.CATEGORY.COLUMNS.title_locale}`},
  {dest: 'title_value', src: `${config.CATEGORY.COLUMNS.title_value}` },
  {dest: 'nodeId', src:`${config.CATEGORY.COLUMNS.nodeId}`}
 ];

 var item_map= [    
  {dest: 'longDescription_locale', src:`${config.ITEMS.COLUMNS.longDescription_locale}`},
  {dest: 'longDescription_value', src:`${config.ITEMS.COLUMNS.longDescription_value}`},
  {dest: 'shortDescription_locale', src: `${config.ITEMS.COLUMNS.shortDescription_locale}`},
  {dest: 'shortDescription_value', src:`${config.ITEMS.COLUMNS.shortDescription_value}`},
  {dest: 'nodeId', src:`${config.ITEMS.COLUMNS.nodeId}`},
  {dest: 'status', src :`${config.ITEMS.COLUMNS.status}`},
  {dest: 'departmentId', src: `${config.ITEMS.COLUMNS.departmentId}` },
  {dest: 'nonMerchandise', src:`${config.ITEMS.COLUMNS.nonMerchandise}`},
  {dest: 'itemCode', src:`${config.ITEMS.COLUMNS.itemCode}`}
 ];


 var item_attributes_map= [    
  {dest: 'longDescription_locale', src:`${config.ITEMATTRIBUTES.COLUMNS.longDescription_locale}`},
  {dest: 'longDescription_value', src:`${config.ITEMATTRIBUTES.COLUMNS.longDescription_value}`},
  {dest: 'shortDescription_locale', src: `${config.ITEMATTRIBUTES.COLUMNS.shortDescription_locale}`},
  {dest: 'shortDescription_value', src:`${config.ITEMATTRIBUTES.COLUMNS.shortDescription_value}`},
  {dest: 'nodeId', src:`${config.ITEMATTRIBUTES.COLUMNS.nodeId}`},
  {dest: 'status', src :`${config.ITEMATTRIBUTES.COLUMNS.status}`},
  {dest: 'blockForSale', src: `${config.ITEMATTRIBUTES.COLUMNS.blockForSale}` },
  {dest: 'itemCode', src:`${config.ITEMATTRIBUTES.COLUMNS.itemCode}`}
 ];


 var item_prices_map= [    
  {dest: 'price', src:`${config.ITEMPRICES.COLUMNS.price}`},
  {dest: 'currency', src:`${config.ITEMPRICES.COLUMNS.currency}`},
  {dest: 'effectiveDate', src: `${config.ITEMPRICES.COLUMNS.effectiveDate}`},
  {dest: 'endDate', src:`${config.ITEMPRICES.COLUMNS.endDate}`},
  {dest: 'basePrice', src:`${config.ITEMPRICES.COLUMNS.basePrice}`},
  {dest: 'status', src :`${config.ITEMPRICES.COLUMNS.status}`},
  {dest: 'itemPriceType', src: `${config.ITEMPRICES.COLUMNS.itemPriceType}` },
  {dest: 'tareWeightUom', src:`${config.ITEMPRICES.COLUMNS.tareWeightUom}`},
  {dest: 'tareWeight', src:`${config.ITEMPRICES.COLUMNS.tareWeight}`},
  {dest: 'precision', src:`${config.ITEMPRICES.COLUMNS.precision}`},
  {dest: 'includesContainer', src:`${config.ITEMPRICES.COLUMNS.includesContainer}`},
  {dest: 'quantityPricedItem', src:`${config.ITEMPRICES.COLUMNS.quantityPricedItem}`},
  {dest: 'itemCode', src:`${config.ITEMPRICES.COLUMNS.itemCode}`},
  {dest: 'priceCode', src:`${config.ITEMPRICES.COLUMNS.priceCode}`}
 ];

 exports.category_config = category_map;
 exports.item_config = item_map;
 exports.item_attr_config = item_attributes_map;
 exports.item_price_config = item_prices_map;
 