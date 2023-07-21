export const isWindows = process.platform === 'win32';

export const isDev = process.env.NODE_ENV === 'development';

export const _typeof = (context: unknown): string => Object.prototype.toString.call(context).slice(8, -1).toLowerCase();

export const getNodeEnvVar = (key: string = 'NODE_ENV'): string | null => {
	const map = {};
	return process.env[key] || map[key];
};
