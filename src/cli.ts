#!/usr/bin/env node

import * as path from 'path'
import { spawn } from 'child_process'

import * as electron from 'electron'

const userScript = path.join(
  process.cwd(),
  process.argv[process.argv.length - 1]
)
const mainScript = path.join(__dirname, './main.js')
const args = [mainScript, userScript]
const proc = spawn(electron as any, args, {
  stdio: ['ipc'],
  env: {
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
