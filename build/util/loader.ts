import { _typeof, isWindows } from './shared';
import { join } from 'path';

const genTranspileDepRegex = (transpileDependencies: Array<string | RegExp>): RegExp | null => {
	const deps = transpileDependencies.map((dep) => {
		if (typeof dep === 'string') {
			const depPath = join('node_modules', dep, '/');
			return isWindows
				? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
				: depPath;
		} else if (dep instanceof RegExp) {
			return dep.source;
		}
	});
	return deps.length ? new RegExp(deps.join('|')) : null;
};

export const babelExclude = (filepath: string, transpileDependencies: Array<string | RegExp> = []): boolean => {
	const transpileDepRegex = genTranspileDepRegex(transpileDependencies);

	// always transpile js in vue files
	if (/\.vue\.jsx?$/.test(filepath)) {
		return false;
	}

	// only include @babel/runtime when the @vue/babel-preset-app preset is used
	if (process.env.VUE_CLI_TRANSPILE_BABEL_RUNTIME && filepath.includes(join('@babel', 'runtime'))) {
		return false;
	}

	// check if this is something the user explicitly wants to transpile
	if (transpileDepRegex && transpileDepRegex.test(filepath)) {
		return false;
	}
	// Don't transpile node_modules
	return /node_modules/.test(filepath);
};
