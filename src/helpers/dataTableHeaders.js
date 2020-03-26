const categoryHeader = [
  {
    text: "Category name",
    align: "center",
    sortable: true,
    value: `name`
  },
  {text: "Actions", value: "action", align: "center", sortable: false}
];

const subCategoryHeader = [
  {
    text: "Sub category name",
    align: "center",
    sortable: true,
    value: `subCategory`
  },
  {
    text: "Category name",
    align: "center",
    sortable: true,
    value: `category`
  },
  { text: "Actions", value: "action", align: "center", sortable: false }
];

const productHeader = [
  {
    text: "Name",
    align: "center",
    sortable: true,
    value: `name`
  },
  {
    text: "Category name",
    align: "center",
    sortable: true,
    value: `category`
  },
  {
    text: "Sub category name",
    align: "center",
    sortable: true,
    value: `subCategory`
  },
  {
    text: "Product code",
    align: "center",
    sortable: false,
    value: `productCode`
  },
  { text: "Actions", value: "action", align: "center", sortable: false }
];

const colorHeader = [
  {
    text: "Color name",
    align: "center",
    sortable: true,
    value: `name`
  },
  {text: "Actions", value: "action", align: "center", sortable: false}
];

module.exports = { subCategoryHeader, categoryHeader, productHeader, colorHeader };
