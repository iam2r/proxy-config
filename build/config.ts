import glob from 'glob';
import { basename, extname } from 'path';

export const Entry = glob.sync('src/entry/*.js').map((it) => basename(it, extname(it)));
