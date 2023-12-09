# Notarizing the app

You can only notarize apps that you sign with a `Developer ID certificate`. 
If you use any other certificate, the notarization fails with the following error:
- The binary is not signed with a valid Developer ID certificate.

More details can be found in this [Apple link](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues#3087721).

## Creating the certificate

You specifically need a Developer ID Application certificate (the last one from the list), which can only be created by the owner of the account.
- https://developer.apple.com/account/resources/certificates/add

- In order to create the certificate, you will need a CSR(certificate signing request). 
  - You can create this using Keychain Access.
  - When a new CSR is created, a new pair of public and private keys are also going to be created in your local machine.
  - You will only be able to properly signing using this certificate if you have that private key for that certificate also installed.
  - So, if you wish to use this certificate in another machine, need to be sure to share both, the certificate and the private key.

## Exporting and Importing the certificate

- Once the certificate is imported, it should be listed inside the tab "My certificates", if you are using the app "Keychain Access".
- More details on how to create, export, and delete signing certificates: https://help.apple.com/xcode/mac/current/#/dev154b28f09

## Finding the right identity for signing the code

Using this command below it will list all the available certificates that you have installed that can be used for signing your code. 
- ```security find-identity -v -p codesigning```

Example result:
```
  1) FE3ED45BD714865C193D7EAC35CCBB050E666B49 "Apple Distribution: XXX (NNN)"
  2) DD780714E8DAF3638A3554FE612DEFD631620A8D "Developer ID Certification Authority: YYY (ZZZZZ)"
  3) 987E9603E535B92CB0467C7C50883B132FE72494 "Apple Distribution: RRR (HHH)"
  4) ABFF239E5F29C8A0D0CD438C2F9ADD8A38FD3159 "Mac Developer: UUU (PPPP)"
```

- You will need to use the "Developer ID" one.
- Copy the last identity hash, in this example case "DD780714E8DAF3638A3554FE612DEFD631620A8D", to use it later when invoking the command to build the app.

## Building the app

Build the app passing the environment variable to use the right certificate:
- ```CSC_NAME=DD780714E8DAF3638A3554FE612DEFD631620A8D npx electron-builder -m```

## Troubleshooting the build

### Check if the app has been properly signed:

Look if the app has been signed with the right certificate.
- ```codesign -dvvv --entitlements - out/mac-arm64/daily-video.app```

Inside the field `Authority`, you must see the same Developer ID certificate that you have used.

### Test if the app has been properly notarized

Command-line interface to the same security assessment policy subsystem that Gatekeeper uses:
- ```spctl -a -v out/mac-arm64/daily-video.app```
- ```spctl -vvv --assess --type exec out/mac-arm64/daily-video.app```

### Manually signing the app

Useful command if you already have the app generated and wish just to test signing with a different certificate:
- ```codesign -s "ABFF239E5F29C8A0D0CD438C2F9ADD8A38FD3159" --options=runtime --deep --force out/mac-arm64/daily-video.app```

## References:
- https://www.npmjs.com/package/@electron/notarize
- https://www.electron.build/code-signing
- https://www.electron.build/configuration/configuration.html
- Create, export, and delete signing certificates: https://help.apple.com/xcode/mac/current/#/dev154b28f09
- https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html#//apple_ref/doc/uid/TP40005929-CH4-SW26
- https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
- https://philo.dev/notarizing-your-electron-application/
- https://stackoverflow.com/questions/64168569/electron-notarize-problem-not-signing-all-binaries
- https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/resolving_common_notarization_issues#3087721
- https://github.com/electron/notarize/network/dependents
