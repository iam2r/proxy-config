function loadModules(context: __WebpackModuleApi.RequireContext) {
	const modules: unknown[] = [];
	context.keys().forEach((k) => {
		modules.push(context(k));
	});
	return modules;
}

const context = require.context('./entry', false, /\.js$/);

loadModules(context);
