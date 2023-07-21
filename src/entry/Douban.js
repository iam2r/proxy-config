/******************************************
 * @license
 * @name 豆瓣每日推荐
 * @statement 仅供学习交流|禁止用于商业用途
******************************************
Quantumult X:
[task_local]
06 9 * * * https://iam2r.github.io/ProxyConfig/Script/Douban.js, tag=豆瓣每日推荐, enabled=true
******************************************
Loon、Surge:
[Script]
cron "6 9 * * *" script-path=https://iam2r.github.io/ProxyConfig/Script/Douban.js, timeout=10, tag=豆瓣每日推荐
******************************************/
import Env from '../common/Env';

const scriptName = '好片推荐';
const $ = new Env(scriptName);
const request = $.http;
let $MOVIE = {};
!(async () => {
	$MOVIE = await Douban();
	$MOVIE.url = await toSearch();
	await toNotify();
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());
function Douban() {
	const apiKey = '0ab215a8b1977939201640fa14c66bab';
	const dateStr = $.time('yyyy-MM-dd');
	const opts = {
		url: `https://frodo.douban.com/api/v2/calendar/today?apikey=${apiKey}&date=${dateStr}&alt=json&_sig=tuOyn%2B2uZDBFGAFBLklc2GkuQk4%3D&_ts=1610703479`,
		headers: {
			'User-Agent': 'api-client/0.1.3 com.douban.frodo/8.0.0',
		},
	};
	return new Promise((resolve, reject) => {
		request
			.get(opts)
			.then(({ body: response }) => {
				const { comment, subject } = JSON.parse(response);
				const MOVIE = {
					title: subject.title,
					year: subject.year,
					directors: subject.directors.map((item) => item.name).join('/'),
					actors:
						subject.actors
							.slice(0, 4)
							.map((item) => item.name)
							.join('/') + '...',
					poster: comment.poster,
					pubdate: subject.pubdate.join('/'),
					card_subtitle: subject.card_subtitle.split('\n')[0],
					rating: subject.rating.value,
				};
				resolve(MOVIE);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}
function toSearch() {
	return new Promise(async (resolve) => {
		const sourceList = [
			{
				name: '高清资源',
				searchUrl: 'https://api.1080zyku.com/inc/apijson.php/',
			},
			{
				name: '红牛资源',
				searchUrl: 'https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8/',
			},
			{
				name: '非凡资源',
				searchUrl: 'http://cj.ffzyapi.com/api.php/provide/vod/',
			},
			{
				name: '量子资源',
				searchUrl: 'https://cj.lziapi.com/api.php/provide/vod/',
			},
			{
				name: 'ikun资源',
				searchUrl: 'https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json/',
			},
			{
				name: '光速资源',
				searchUrl: 'https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/',
			},
		];
		async function Main() {
			let playList = null;
			for (const i in sourceList) {
				const item = sourceList[i];
				console.log(`正在使用${item.name}搜索资源`);
				const r = await searchItem(item.searchUrl);
				playList = handleResponse(JSON.parse(r));
				if (playList) {
					return playList;
				}
			}
			return playList;
		}
		const handleResponse = (r) => {
			if (!r || r.list.length == 0) {
				$.log('未搜索到结果');
				return 0;
			}
			let video,
				found = false;
			for (let item of r.list) {
				$.log('正在对比剧集年份和演员');
				let yearEqual = item.vod_year == $MOVIE.year;
				let actorContain = item.vod_actor.split(',')[0].includes($MOVIE.actors.split('/')[0]);
				if (yearEqual === true || actorContain === true) {
					video = item;
					found = true;
					break;
				}
			}
			if (found == false) {
				$.log('没有找到匹配剧集的影片，怎么回事哟！');
				return 0;
			}

			let playList = video.vod_play_url.split('$$$').filter((str) => str.includes('m3u8'));
			if (playList.length == 0) {
				$.log('没有m3u8资源, 无法测速, 无法播放');
				return 0;
			}
			playList = playList[0].split('#');
			playList = playList.map((str) => {
				let index = str.indexOf('$');
				return str.slice(index + 1); // 没有电视剧
				return { name: str.slice(0, index), url: str.slice(index + 1) };
			});

			return playList[0];
		};
		/**
		 * 搜索播放资源
		 * @param {*} _url 资源站链接
		 */
		const searchItem = (_url) => {
			const url = encodeURI(`${_url}?ac=detail&wd=${$MOVIE.title}`);
			return new Promise((resolve, reject) => {
				request
					.get(url)
					.then(({ body: response }) => {
						resolve(response);
					})
					.catch((err) => {
						reject(err);
					});
			});
		};
		const playList = await Main();
		if (!playList) {
			resolve('没有找到相关资源');
		} else {
			resolve(playList);
		}
	});
}
async function toNotify() {
	return new Promise(async (resolve) => {
		const { title, year, directors, actors, poster, pubdate, card_subtitle, rating, url } = $MOVIE;
		const subTitle = `《${title}(${year})》\n${card_subtitle}`;
		const msg = `🎬${subTitle}\n🎭导演：${directors}\n🎭主演：${actors}\n📅上映：${pubdate}\n⭐️评分：${rating}\n🔗链接：${url}`;
		$.msg(scriptName, subTitle, msg, {
			mediaUrl: poster.replace('webp', 'jpg'),
		});
		resolve();
	});
}
