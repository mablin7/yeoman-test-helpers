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

let currentGenerator

function initGenerator(genPath) {
    let gen = helpers.run(genPath)
    
    return {
        setupDir: cb => gen.inTmpDir(function (dir) {
            let done = this.async()
            let didCallDone = false
            let doneCb = () => {
                didCallDone = true
                done()
            }
            cb(dir, doneCb)
            if (!didCallDone) done()
        }),
        withOptions: gen.withOptions,
        withArguments: gen.withArguments,
        withPrompts: gen.withPrompts,
        withLocalConfig: gen.withLocalConfig,
        withGenerators: gen.withGenerators,
        run: () => new Promise((resolve, reject) => {
            gen.on('ready', dir => { 
                currentGenerator = {
                    dir
                } 
            })
            gen.on('end', resolve)
            gen.on('error', reject)
        })
    }
}

function cleanupGenerator() {
    if (!currentGenerator) return

    return new Promise((resolve, reject) => {
        rimraf(currentGenerator.dir, resolve)
        currentGenerator = null
    })
}

function file(filePath) {
    if (!currentGenerator) return

    let actualFilePath = path.join(currentGenerator.dir, filePath)
    if (fs.existsSync(actualFilePath)) return fs.readFileSync(actualFilePath)
}

function fileJSON(filePath) {
    let file = file(filePath)
    if (file) return JSON.parse(file(filePath))
}