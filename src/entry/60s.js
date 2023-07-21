/******************************************
 * @name 每天60s读懂世界
 * @statement 仅供学习交流，禁止用于商业用途
 * @version 1.0.0
******************************************

[task_local]
30 8 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/60s.js, tag=每天60s读懂世界

******************************************/
import Env from '../common/Env';

const $ = Env('每天60s读懂世界');
!(async () => {
	await $.http
		.get({
			url: 'https://www.zhihu.com/api/v4/columns/c_1261258401923026944/items',
		})
		.then(async ({ body }) => {
			const { data } = JSON.parse(body);
			const newItem = data[0];
			const { title, content } = newItem;
			const date = /\d{1,2}月\d{1,2}日/.exec(title)[0];
			const now = new Date();
			const today = $.time('yyyy-MM-dd', now);
			const nowStr = `${now.getMonth() + 1}月${now.getDate()}日`;
			if (date !== nowStr) return $.logErr('还未更新今天的内容');
			let contentArr = content
				.replace(/\"/g, "'")
				.replace(/<p.*?>/g, '<br>')
				.replace(/<\/p>/g, '')
				.replace(/&#34;/g, '')
				.split('<br>')
				.filter(Boolean);
			contentArr.pop();
			const thumb = contentArr[0].match(/data-original='(.*?)'/)[1];
			const summary = contentArr.slice(1, 3).join('\n');
			const mainCon = contentArr
				.slice(3)
				.map((item) => item.split('<')[0])
				.join('\n');
			const getCloseRemark = async () => {
				const data = JSON.parse(
					(await $.http.get(`https://dict.youdao.com/infoline?mode=publish&date=${today}&update=auto&apiversion=5.0`)).body
				);
				const wordsList = data[today].map((item) => {
					return { en: item.title, zh: item.summary };
				});
				const wordsIndex = Math.floor(Math.random() * wordsList.length);
				return wordsList[wordsIndex];
			};
			const { zh, en } = await getCloseRemark();
			const _content = mainCon + `\n【微语】\t${en}\t${zh}`;

			$.msg(summary, '', _content, { 'media-url': $.isLoon() ? '' : thumb });
		})
		.catch((err) => $.logErr(err || '网络请求失败'));
})().finally(() => $.done());
