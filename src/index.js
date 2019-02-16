const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')

const helpers = require('yeoman-test')

module.exports = {
  initGenerator,
  cleanupGenerator,
  file,
  fileJSON
}

let tmpDir

function initGenerator(genPath) {
  let gen = helpers.run(genPath)

  return {
    setupDir: cb =>
      gen.inTmpDir(function(dir) {
        // Overengineered? Perhaps.
        let done = this.async()
        let didCallDone = false
        let doneCb = () => {
          if (didCallDone) return
          didCallDone = true
          done()
        }
        let ret = cb(dir, doneCb)
        if (ret && 'then' in ret && typeof ret.then === 'function') {
            ret.then(doneCb)
        } else setTimeout(doneCb, 5000)
      }),
    withOptions: gen.withOptions,
    withArguments: gen.withArguments,
    withPrompts: gen.withPrompts,
    withLocalConfig: gen.withLocalConfig,
    withGenerators: gen.withGenerators,
    run: () =>
      new Promise((resolve, reject) => {
        gen.on('ready', dir => {
          tmpDir = dir.contextRoot
        })
        gen.on('end', resolve)
        gen.on('error', reject)
      })
  }
}

function cleanupGenerator() {
  if (!tmpDir) return

  return new Promise(resolve => {
    rimraf(tmpDir, resolve)
    tmpDir = null
  })
}

function file(filePath) {
  if (!tmpDir) return

  let actualFilePath = path.join(tmpDir, filePath)
  if (fs.existsSync(actualFilePath)) return fs.readFileSync(actualFilePath)
}

function fileJSON(filePath) {
  let file = file(filePath)
  if (file) return JSON.parse(file(filePath))
}
