const language = ['hy', 'ru'];

module.exports = {
  languageFields(data) {
    for (const lang of language) {
      for (const field in data[lang]) {
        if(!data[lang][field].trim()) return `Fill field ${lang} ${field}`
      }
    };
  },
  validateQuantityAndSize(data) {
    if (!data[0].quantity) return "Fill quantity";
    if (!data[0].size.trim()) return "Fill size";
  }
};
