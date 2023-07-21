import Env from '../common/Env';
const $ = Env('Study');
(() => {
	console.log($.getEnv());
	$.msg('title', 'subt', 'content');
})();
