function loadModules(context) {
	const modules = [];
	context.keys().forEach((k) => {
		modules.push(context(k));
	});
	return modules;
}

const context = require.context('./entry', false, /\.js$/);

loadModules(context);
