import { homedir } from 'os'
import { join } from 'path'
import {readdirSync} from 'fs'
import { execSync } from 'child_process'

export const mkdirp = path => execSync(`mkdir "${path.replace(/\//g, '\\')}"`)

export const init = (root, home = true) => {
  let _root
  if (home) _root = join(homedir(), root)
    if (readdirSync) try {
      readdirSync(_root)
    } catch (e) {
      mkdirp(_root)
    }

    return _root
}