# yeoman-test-helpers
A thin wrapper on top of [yeoman-test](https://github.com/yeoman/yeoman-test), deigned to work with jest.

## Docs
* `initGenerator( generatorPath : String )`
Initializes the generator for testing
Returns an object with the following props:  
  * `setupDir( callback : ( dir : String, cb : () ) )` 
  Used for setting up files in the directory the generator will be working on.
  For async operations call cb when done, or return promise
  * `withOptions( obj )`
  Mock command line options for the generator
  * `withArguments( obj )`
  Mock command line arguments for the generator
  * `withPrompts( obj )`
  Mock prompt answers for the generator
  * `withLocalConfig( obj )`
  Mock config for the generator
  * `withGenerators( obj )`
  Mock subgenerators
  * `run()`
  Starts the generator.
  Returns a promise that resolves when the generator is done

* `cleanupGenerator()`
Cleans up after testing. Should be called when you are donw testing the generator
Returns a promise
* `file( filePath : String )`
Returns contents of file (sync) in the generated directory
* `fileJSON( filePath : String )`
Same as `file` but runs results trough `JSON.parse`

#### Example

```js
const path = require('path')
const {
  initGenerator,
  cleanupGenerator,
  file,
  fileJSON
} = require('yeoman-test-helpers')

describe('generator-example:app', () => {
  beforeAll(() => {
    return initGenerator(path.join(__dirname, '../generators/app')).run()
  })
  afterAll(() => {
    return cleanupGenerator()
  })

  it('produces package.json', () => {
    expect(file('package.json')).toBeTruthy()
  })
  
  it('produces correct package.json', () => {
    expect(fileJSON('package.json')).toMatchSnapshot()
  })
})

```

Any issues are likely related to [yeoman-test](https://github.com/yeoman/yeoman-test), since this is a really simple wrapper. Also refer to that repo for further questions about inner working of the resting functions.


## License
Released under [MIT(c)](https://opensource.org/licenses/MIT)
