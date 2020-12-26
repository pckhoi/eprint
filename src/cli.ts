#!/usr/bin/env node

import * as path from 'path'
import { spawn } from 'child_process'

import * as electron from 'electron'

const [flags, argv] = (() => {
  const flags = []
  const argv = []
  for (let arg of process.argv) {
    if (arg.startsWith('--')) {
      flags.push(arg)
    } else {
      argv.push(arg)
    }
  }
  return [flags, argv]
})()

const debugging = flags.indexOf('--debug') !== -1

const userScript = path.join(process.cwd(), argv[argv.length - 1])
const mainScript = path.join(__dirname, './main.js')
const args = [mainScript, userScript]
const proc = spawn(electron as any, args, {
  stdio: ['ipc'],
  env: {
    EPRINT_DEBUGGING: debugging ? 'true' : 'false',
    ...process.env,
    CONCURRENCY: '1',
  },
})

// send electron ready signal
proc.on('message', (m) => {
  if (m.type === 'print') {
    console.log(m.str)
  } else if (m.type === 'error') {
    console.log(m.errStack)
    kill()
  }
})

const kill = () => {
  if (proc) {
    proc.kill()
  }
}

proc.on('close', kill)
process.on('exit', kill)
