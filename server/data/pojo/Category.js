var Category = {
  constructor: function (data) {
    this.id = data && data.id ? data.id : 0;
    this.name = data && data.name ? data.name : '';
    this.active = data && data.active ? data.active : false;
    this.catImg = data && data.catImg ? data.catImg : '';
  },
  apiToCategoryMap: [
    ['id',
      apiObj => {
        const id = apiObj.nodeId.nodeId;
        const name = apiObj.tag;
        const catImg = apiObj.nodeId.nodeId + '.png';
        const active = apiObj.status == "ACTIVE";
        return {
          id,
          name,
          catImg,
          active
        };
      },
      modelObj => {
        return;
      }
    ]
  ],
  // modalToApiCategoryMap: [
  //   ['version', 'version'],
  //   ['nodeCode', 'nodeCode'],
  //   ['tag', 'tag'],
  //   ['departmentNode', 'departmentNode'],
  //   ['departmentSale', 'departmentSale'],
  //   ['status', 'status'],
  //   ['title',
  //     apiObj => {
  //       const title = titleObj => {
  //         const values = titleObj.title
  //         return {
  //           values
  //         }
  //       };
  //       const nodeId = nodeIdObj => {
  //         const nodeId = nodeIdObj.nodeId
  //         return {
  //           nodeId

  //         }
  //       };
  //       const parentId = parentIdObj => {
  //         const parentId = parentIdObj.parentId
  //         return {
  //           parentId
  //         }
  //       };
  //       return {
  //         title,
  //         nodeId,
  //         parentId
  //       };
  //     },
  //     modelObj => {
  //       const title = {
  //         values: [{ value: modelObj.title }]
  //       };
  //       const nodeId = {
  //         nodeId: modelObj.nodeId
  //       };
  //       const parentId = {
  //         nodeId: modelObj.parentId
  //       };
  //       return {
  //         title: title,
  //         nodeId: nodeId,
  //         parentId: parentId
  //       };
  //     }
  //   ]
  // ]
}
module.exports = Category;