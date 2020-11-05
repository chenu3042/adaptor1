var Item = {
  constructor: function (data) {
    this.id = data && data.id ? data.id : 0;
    this.name = data && data.name ? data.name : '';
    this.active = data && data.active ? data.active : false;
    this.itemImg = data && data.itemImg ? data.itemImg : '';
  },
  apiToItemMap: [
    ['id',
      apiObj => {
        const id = apiObj.itemId.itemCode;
        const name = apiObj.shortDescription.value;
        const itemImg = apiObj.itemId.itemCode + '.png';
        const active = apiObj.status == "ACTIVE";
        return {
          id,
          name,
          itemImg,
          active
        };
      },
      modelObj => {
        return;
      }
    ]
  ]
}
module.exports = Item;