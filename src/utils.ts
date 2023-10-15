import { homedir, platform } from 'os'
import { join } from 'path'
import { readdirSync } from 'fs'
import { mkdirp } from 'mkdirp'

export const init = (root, home = true) => {
  let _root = root
  if (home) _root = join(homedir(), root)
  if (readdirSync) try {
    readdirSync(_root)
  } catch (e) {
    mkdirp(_root)
  }

  return _root
}