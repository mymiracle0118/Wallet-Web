const fs = require('fs')

const ALPHA_APP_ID = 'chkgjfeacmiiflefonpeeojeknaiappe'
const BETA_APP_ID = 'hcjhpkgbmechpabifbggldplacolbkoh'

const manifestFileVerification = (appId) => {
  if (!appId) {
    const contents = JSON.parse(fs.readFileSync('./public/manifest.json', 'utf8'))
    return {
      contents,
      path: './public/manifest.json',
    }
  }

  const validAppIds = [BETA_APP_ID, ALPHA_APP_ID]

  if (!validAppIds.includes(appId)) throw new Error('Invalid app id')

  const path = `./public/manifest-${appId}.json`

  return {
    path,
    contents: JSON.parse(fs.readFileSync(path, 'utf8')),
  }
}

const getManifestFile = () => {
  let manifestAppId = process.env.MANIFEST_APP_ID
  const isAlphaBuild = process.env.BUILD_ALPHA
  const isBetaBuild = process.env.BUILD_BUILD

  if (isAlphaBuild) {
    manifestAppId = ALPHA_APP_ID
  } else if (isBetaBuild) {
    manifestAppId = BETA_APP_ID
  }

  const manifest = manifestFileVerification(manifestAppId)

  const buildDate = new Date()

  if (isAlphaBuild) {
    const month = `${buildDate.getUTCMonth() + 1}`.padStart(2, '0')
    const year = buildDate.getUTCFullYear()
    const day = `${buildDate.getUTCDate()}`.padStart(2, '0')
    const hour = `${buildDate.getUTCHours()}`.padStart(2, '0')
    const minute = `${buildDate.getUTCMinutes()}`.padStart(2, '0')

    manifest.contents.version = `${year}.${month}.${day}.${hour}${minute}`

    console.log(`Manifest version: ${manifest.contents.version}`)

    fs.writeFileSync(manifest.path, JSON.stringify(manifest.contents, null, 2))
  }

  if (isBetaBuild) {
    console.log('TODO: Implement QA build logic to read from package.json')
  }

  return { from: manifest.path, to: 'manifest.json' }
}

module.exports = getManifestFile
