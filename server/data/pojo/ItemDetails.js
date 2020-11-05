var ItemDetails = {
  constructor: function (data) {
    this.id = data && data.id ? data.id : 0;
    this.name = data && data.name ? data.name : '';
    this.desc = data && data.desc ? data.desc : '';
    this.active = data && data.active ? data.active : false;
    this.itemImg = data && data.itemImg ? data.itemImg : '';
    this.itemCode = data && data.itemCode ? data.itemCode : '';
    this.itemPrice = data && data.itemPrice ? data.itemPrice : '';
    this.itemQuantity = data && data.itemQuantity ? data.itemQuantity : 1;
  },
  apiToItemDetailsMap: [
    ['id',
      apiObj => {
        const id = apiObj.item.itemId.itemCode;
        const name = apiObj.item.shortDescription.values[0].value;
        const desc = apiObj.item.longDescription.values[0].value;
        const itemImg = isNotNull(apiObj.itemAttributes) ? isNotNull(apiObj.itemAttributes.imageUrls) ? apiObj.itemAttributes.imageUrls[0] : '' : '';
        const itemCode = apiObj.item.itemId.itemCode;
        const itemPrice = isNotNull(apiObj.itemPrices) ? apiObj.itemPrices[0].price : '';
        const active = apiObj.status == "ACTIVE";
        return {
          id,
          name,
          desc,
          itemImg,
          itemCode,
          itemPrice,
          active
        };
      },
      modelObj => {
        return;
      }
    ]
  ]
}

function isNotNull(obj) {
  if (!!obj && obj.constructor === Array && obj.length == 0)
    return false;
  if (obj === undefined || obj === null)
    return false;
  else
    return true;
}
module.exports = ItemDetails;