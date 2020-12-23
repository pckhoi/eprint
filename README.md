# Eprint

For when you want to run a script in the browser - without opening a browser, and print something of value to the terminal. Why would you ever need to do that? In my case I needed to run various benchmarks in the browser and somehow output the result to the terminal. Reason why it is called Eprint is because we're utilizing Electron under the hood.

## How to use

First install in your project.

```bash
npm install --save-dev eprint
```

Call `eprint` and `eprintKill` in your script (Note that both are global functions).

```javascript
// do some computation
eprint('my script result')
// when script finished execution, call eprintKill to quit
eprintKill()
```

If you are using TypeScript, include this file in your source so that TypeScript won't complain.

```typescript
// eprint.d.ts
export {}

declare global {
  var eprint: (str: string) => void
  var eprintKill: () => void
}
```

Compile your script and call it with `eprint` to execute and print result to terminal.

```bash
npm run build && npx eprint dist/my-script.js
```

You'll probably want to add a script to `package.json` for convenience.

```json
  "scripts": {
    ...
    "benchmark": "npm run build-benchmark && eprint dist/benchmark.js"
  }
```

## Reference

### eprint

Print given string to the terminal. You can replace `console.log` with this function. Only caveat is it won't automatically print object so maybe call `JSON.stringify` prior.

### eprintKill

Take no argument. Call this function when your script finished execution to stop Eprint process.
