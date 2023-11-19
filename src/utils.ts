import { homedir } from 'os'
import { join } from 'path'
import { readdir, mkdir } from 'fs/promises'

export const init = async (root: string, home = true) => {
  let _root = root
  if (home) _root = join(homedir(), root)
  if (readdir) try {
    await readdir(_root)
  } catch (e) {
    await mkdir(_root, { recursive: true })
  }
  return _root
}
