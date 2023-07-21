/******************************************
 * @license
 * @name StudyWithMediaUrl
 * @statement 仅供学习交流|禁止用于商业用途
******************************************
Quantumult X:
[task_local]
06 9 * * * https://iam2r.github.io/ProxyConfig/Script/StudyWithMediaUrl.js, tag=StudyWithMediaUrl, enabled=true
******************************************
Loon、Surge:
[Script]
cron "6 9 * * *" script-path=https://iam2r.github.io/ProxyConfig/Script/StudyWithMediaUrl.js, timeout=10, tag=StudyWithMediaUrl
******************************************/
import Env from '../common/Env';

const $ = Env('StudyWithMediaUrl');
(() => {
	$.msg('title', 'subt', 'content', {
		mediaUrl: 'https://fastly.picsum.photos/id/852/200/200.jpg?hmac=4UHLpiS9j3YDnvq-w-MqnP5-ymiyvMs6BNV5ukoTRrI',
	});
})();
