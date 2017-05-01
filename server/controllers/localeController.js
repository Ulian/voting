const moment = require('moment')

let locale = {}

locale.set = (req, res) => {
  let { lang } = req.params
  lang = lang.toLowerCase()

  res.setLocale(lang)

  res.cookie('language', lang, { expires: moment().add('1', 'y').toDate() })

  return res.status(200).json({ message: res.__('LOCALE_SET') })
}

module.exports = locale
