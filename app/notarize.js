require('dotenv').config();
const { notarize } = require('@electron/notarize' );
const projectRoot = require('path').resolve(__dirname, '..')

console.log('projectRoot', projectRoot)
console.log('process.env.appleApiKey', process.env.appleApiKey)
console.log('process.env.appleApiIssuer', process.env.appleApiIssuer)

exports.default = async (params) => {
    // Notarization only applies to macOS
    if (process.platform !== 'darwin') {
        return
    }

    let appOutDir = params.appOutDir
    // When using the tool notarytool, which is the default one
    let appleApiKey = `${projectRoot}/app/AuthKey_${process.env.appleApiKey}.p8`
    // When using the legacy mode
    //let appleApiKey = process.env.appleApiKey

    console.log('appPath', `${appOutDir}/daily-video.app`)

    // Package your app here, and code sign with hardened runtime
    await notarize({
        //tool: "legacy",
        //tool: "notarytool",
        appBundleId: "co.daily.launcher",
        appPath: `${appOutDir}/daily-video.app`,
        appleApiKey,
        appleApiKeyId: process.env.appleApiKey,
        appleApiIssuer: process.env.appleApiIssuer,
    });
}

