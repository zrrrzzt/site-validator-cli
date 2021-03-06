#!/usr/bin/env node
'use strict'

/*
Require statements
 */
const minimist = require('minimist')
const getUrls = require('./lib/get-urls')
const validatePages = require('./lib/validate-pages')
const getHelpText = require('./lib/get-help-text')
const pkg = require('./package.json')
const exit = require('./lib/exit')

/*
Parsing query parameters
 */
const query = process.argv[2]
const argv = minimist(process.argv.slice(2))

let options = {
  cacheTime: argv.cacheTime !== undefined ? argv.cacheTime : false,
  failfast: argv.ff !== undefined,
  verbose: argv.verbose !== undefined,
  quiet: argv.quiet !== undefined,
  debug: argv.debug !== undefined,
  singlePage: argv.page !== undefined
}

/*
Process query parameters
 */
var helpKW = ['help', '-h', '--help']
if (!query || helpKW.map(x => { return process.argv.indexOf(x) !== -1 }).indexOf(true) !== -1) {
  exit(getHelpText())
}

var versionKW = ['version', '-v', '--version']
if (versionKW.map(x => { return process.argv.indexOf(x) !== -1 }).indexOf(true) !== -1) {
  exit(pkg.version)
}

if (argv.path) {
  options.path = argv.path
} else {
  options.path = argv._[0]
}

/*
Main Process
 */
(async () => {
  try {
    let pagesToValidate = await getUrls(options)
    validatePages(pagesToValidate, options)
  } catch (error) {
    exit(error, true)
  }
})()
