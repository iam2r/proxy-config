/******************************************
 * @license
 * @name Study
 * @statement 仅供学习交流|禁止用于商业用途
******************************************
Quantumult X:
[task_local]
06 9 * * * https://iam2r.github.io/ProxyConfig/Script/Study.js, tag=Study, enabled=true
******************************************
Loon、Surge:
[Script]
cron "6 9 * * *" script-path=https://iam2r.github.io/ProxyConfig/Script/Study.js, timeout=10, tag=Study
******************************************/
// import Env from '../common/Env';

// const $ = Env('Study');
(() => {
	// $.msg('title', 'subt', 'content');
	$notification.post('title', 'subt', 'content')
})();
