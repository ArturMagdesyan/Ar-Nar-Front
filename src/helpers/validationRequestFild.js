const language = ['hy', 'ru'];

module.exports = {
  languageFields(data) {
    for (const lang of language) {
      for (const field in data[lang]) {
        if(!data[lang][field].trim()) return `Fill field ${lang} ${field}`
      }
    }
  }
};
