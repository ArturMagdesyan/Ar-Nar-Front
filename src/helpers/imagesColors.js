const getImagesColors = (bag, colors, lang) =>  {
  const newColors = [];
  for(let item of bag) {
    let name = '';
    for(let colorId of item.colors) {
      for (let color of colors) {
        if(colorId=== color._id) {
          name += color[lang].name + '/';
        }
      }
    }
    name = name.substr(0,name.length - 1, );
    newColors.push({ _id: item._id, name });
  }
  return newColors;
};

module.exports = {getImagesColors};
