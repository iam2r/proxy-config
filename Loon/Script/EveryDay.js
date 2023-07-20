/******************************************
 * @name 摸鱼
 * @statement 仅供学习交流|禁止用于商业用途|脚本依赖均已注明作者|转载请注明来源
 * @version 1.0.0
******************************************
Quantumult X:
[task_local]
06 9 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/moyu.js, tag=摸鱼摸鱼, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/67/04/ff/6704ff4c-b49b-de91-70ac-201c62d5296f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png, enabled=true
******************************************
Loon、Surge:
[Script]
cron "6 9 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/moyu.js, timeout=10, tag=摸鱼, argument="https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/67/04/ff/6704ff4c-b49b-de91-70ac-201c62d5296f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png"
******************************************/
const scriptName = '摸鱼来啦~';
const $ = Env(scriptName);

let calendar = {};
loadCalendar();
const request = $.http;
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const hour = today.getHours();
const festivalList = [
	{ festival: '元宵节', date: lunar2solar(year, 1, 15) },
	{ festival: '清明', date: getQinMingJieDate() },
	{ festival: '劳动节', date: `${year}/5/1` },
	{ festival: '端午节', date: lunar2solar(year, 5, 5) },
	{ festival: '中秋节', date: lunar2solar(year, 8, 15) },
	{ festival: '国庆节', date: `${year}/10/1` },
	{ festival: '元旦', date: `${year + 1}/1/1` },
	{ festival: '春节', date: lunar2solar(year + 1, 1, 1) },
];
let holidayList = [];
!(async () => {
	await handleFestival();
	//   await $.wait(500);
	await toNotify();
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());
/**
 * 处理节日
 */
function handleFestival() {
	return new Promise(async (resolve) => {
		for (let i = 0; i < festivalList.length; i++) {
			const festival = festivalList[i];
			const date = new Date(festival.date);
			const timestamp = date.getTime().toString().slice(0, 10);
			const remainDays = getRemainDays(timestamp);
			if (remainDays > 0) {
				holidayList.push({ ...festival, diff: remainDays });
			}
		}
		resolve();
	});
}
/**
 * 通知
 */
function toNotify() {
	return new Promise(async (resolve) => {
		let timeFrame = '';
		if (hour < 12) {
			timeFrame = '早';
		} else if (hour < 19) {
			timeFrame = '晌';
		} else {
			timeFrame = '晚';
		}
		let content = `【${month}月${day}日${timeFrame}】`;
		content += '\n生活不止眼前的苟且，还有诗和远方，还有摸🐟的快乐。';
		const _almanac = await getPermanentCalendar();
		if (_almanac) {
			content += '\n【今日黄历】';
			content += '\n[农]' + _almanac['lunar'];
			content += '\n[势]' + _almanac['lunarGanZhi'];
			_almanac['festivals']?.length && (content += '\n[节]' + _almanac['festivals'].map((item) => `【${item}】`).join(''));
			content += '\n[宜]' + _almanac['suit'].map((item) => (item?.desc ? `${item.name(item.desc)}` : `${item.name}`)).join(' ');
			content += '\n[忌]' + _almanac['avoid'].map((item) => (item?.desc ? `${item.name(item.desc)}` : `${item.name}`)).join(' ');
		}
		const weeekend = getRemainDays(getWeekend());
		content += '\n【快乐周末】';
		if (weeekend > 0 && weeekend < 6) {
			content += `\n距离周末还有${weeekend}天`;
		} else {
			content += `\n今天就是周末呀，快去摸鱼吧~`;
		}
		content += '\n【节日预警】';
		if (holidayList.length > 0) {
			holidayList.map((item) => {
				content += `\n距离${item.festival}还有${item.diff}天`;
			});
		}
		// 来自@king的写诗天赋/doge
		content += '\n🌞摸鱼，是在忙碌的生活中找到的一丝自我。';
		content += '\n🌞摸鱼，是在疲惫的工作中找到的一丝安慰。';
		content += '\n🌞摸鱼，是在疲惫的日子里找到的一丝微笑。';
		content += '\n🌞摸鱼，是在无尽的工作中找到的一丝平静。';
		// @薛定谔的大灰机
		const notifyImgs = [
			'https://s2.loli.net/2022/02/24/SG5svAxd1eXwVDK.jpg',
			'https://s2.loli.net/2022/02/24/St2w79Qq5eDABiH.jpg',
			'https://s2.loli.net/2022/02/24/UQhuHPlIAnSY4fw.jpg',
			'https://s2.loli.net/2022/02/24/5S2DBWdz4nciIp6.jpg',
			'https://s2.loli.net/2022/02/24/SRLnuJQscvxzTlV.jpg',
			'https://s2.loli.net/2022/02/24/FjANmSHr4lYkPXL.jpg',
			'https://s2.loli.net/2022/02/24/qxhrKHpGmQzluao.jpg',
			'https://s2.loli.net/2022/02/24/thvwPN1VCesn9FK.jpg',
			'https://s2.loli.net/2022/02/24/eDM18l5tbwNkXCS.jpg',
			'https://s2.loli.net/2022/02/24/iVUOzxqIBNTA5v4.jpg',
		];
		const notifyImage = notifyImgs[Math.floor(Math.random() * notifyImgs.length)];
		$.msg(scriptName, '', content, { 'media-url': $.isLoon() ? '' : notifyImage });
		resolve();
	});
}
/**
 * 农历转公历
 */
function lunar2solar(year, month, day) {
	var lunarDate = calendar.lunar2solar(year, month, day);
	return lunarDate.cYear + '/' + lunarDate.cMonth + '/' + lunarDate.cDay;
}
/**
 * 获取清明节的日期
 * @param {*} fullYear
 * @returns
 */
function getQinMingJieDate() {
	//清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
	if (isLeapYear(year) || isLeapYear(year - 1)) {
		return year + '/4/4';
	} else {
		return year + '/4/5';
	}
}
/**
 * 判断是否是闰年
 * @param {*} Year
 * @returns
 */
function isLeapYear(Year) {
	if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
		return true;
	} else {
		return false;
	}
}
/**
 * 万年历爬取
 * @site https://wannianrili.bmcx.com
 * @description 获取一个月黄历|使用持久化存储
 * @author 𝒀𝒖𝒉𝒆𝒏𝒈
 * @createDate 2023-06-26
 * @returns 今日黄历
 */
function getPermanentCalendar() {
	return new Promise(async (resolve, reject) => {
		const dataName = `moyu_${year}${month}`;
		const data = $.getdata(dataName) || '[]';
		let dataArr = JSON.parse(data);
		if (!dataArr.length) {
			const _month = month < 10 ? '0' + month : month;
			const _day = day < 10 ? '0' + day : day;
			const dateStr = `${year}-${_month}-${_day}`;
			const url = `https://wannianrili.bmcx.com/${dateStr}__wannianrili/`;
			try {
				const { body: html } = await request.get(url);
				const htmlArr = html
					.match(/<div class="wnrl_k_you".*>([\s\S]*?)<\/div><div class="wnrl_k_xia_id"/)[0]
					.split('<div class="wnrl_k_xia_id"')[0]
					.split(/<div class="wnrl_k_you" id="wnrl_k_you_id_/)
					.filter(Boolean)
					.map((item) => {
						const [, date = ''] = item.match(/<div class="wnrl_k_you_id_biaoti">([\s\S]*?)<\/div>/) || ['', ''];
						const [, day = ''] = item.match(/<div class="wnrl_k_you_id_wnrl_riqi">([\s\S]*?)<\/div>/) || ['', ''];
						const [, lunar = ''] = item.match(/<div class="wnrl_k_you_id_wnrl_nongli">([\s\S]*?)<\/div>/) || ['', ''];
						const [, lunarGanZhi = ''] = item.match(/<div class="wnrl_k_you_id_wnrl_nongli_ganzhi">([\s\S]*?)<\/div>/) || ['', ''];
						const [, festivalList = ''] = item.match(/<span class="wnrl_k_you_id_wnrl_jieri_neirong">([\s\S]*?)<\/span>/) || ['', ''];
						const festivals = festivalList.match(/<a.*?>(.*?)<\/a>/g)?.map((item) => item.match(/<a.*?>(.*?)<\/a>/)[1]) || [];
						const [, suitList = ''] = item.match(/<div class="wnrl_k_you_id_wnrl_yi">([\s\S]*?)<\/div>/) || ['', ''];
						const suit =
							suitList.match(/<a.*?>(.*?)<\/a>/g)?.map((item) => {
								const [, name, desc] = item.match(/<a.*?>(.*?)<\/a>/);
								return { name, desc };
							}) || [];
						const [, avoidList = ''] = item.match(/<div class="wnrl_k_you_id_wnrl_ji">([\s\S]*?)<\/div>/) || ['', ''];
						const avoid =
							avoidList.match(/<a.*?>(.*?)<\/a>/g)?.map((item) => {
								const [, name, desc] = item.match(/<a.*?>(.*?)<\/a>/);
								return { name, desc };
							}) || [];
						return {
							date,
							day,
							lunar,
							lunarGanZhi,
							festivals,
							suit,
							avoid,
						};
					});
				$.setdata(JSON.stringify(htmlArr), `moyu_${year}${month}`);
				const prevDataName = `moyu_${year}${month - 1}`;
				if ($.getdata(prevDataName)) $.setdata('', prevDataName);
				dataArr = htmlArr;
			} catch (e) {
				reject(e || '获取黄历失败');
			}
		}
		const today = dataArr.find((item) => +item.day === day);
		resolve(today);
	});
}
/**
 * 获取周末时间戳
 * @returns timestamp
 */
function getWeekend() {
	const now = today;
	const dayOfWeek = now.getDay();
	const daysUntilWeekend = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
	const saturday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilWeekend + 1, 0, 0, 0);
	return saturday.getTime() / 1000;
}
/**
 * 获取剩余天数
 * @param {*} timestamp 时间戳
 * @returns days
 */
function getRemainDays(timestamp) {
	return Math.floor((timestamp - today.getTime().toString().slice(0, 10)) / 60 / 60 / 24);
}
/**
 * @1900-2100区间内的公历、农历互转
 * @charset UTF-8
 * @Author Jea杨(JJonline@JJonline.Cn)
 * @Time  2014-7-21
 * @Time  2016-8-13 Fixed 2033hex、Attribution Annals
 * @Time  2016-9-25 Fixed lunar LeapMonth Param Bug
 * @Version 1.0.2
 * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
 * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
 */

function loadCalendar() {
	calendar = {
		lunarInfo: [
			19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320,
			84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600,
			116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168,
			43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840,
			54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984,
			27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368,
			21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608,
			19195, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835, 37744,
			18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744, 41696, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, 21200,
			43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600,
			59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560,
		],
		solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		Gan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
		Zhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
		Animals: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
		solarTerm: [
			'小寒',
			'大寒',
			'立春',
			'雨水',
			'惊蛰',
			'春分',
			'清明',
			'谷雨',
			'立夏',
			'小满',
			'芒种',
			'夏至',
			'小暑',
			'大暑',
			'立秋',
			'处暑',
			'白露',
			'秋分',
			'寒露',
			'霜降',
			'立冬',
			'小雪',
			'大雪',
			'冬至',
		],
		sTermInfo: [
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c3598082c95f8c965cc920f',
			'97bd0b06bdb0722c965ce1cfcc920f',
			'b027097bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f',
			'97bd0b06bdb0722c965ce1cfcc920f',
			'b027097bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f',
			'97bd0b06bdb0722c965ce1cfcc920f',
			'b027097bd097c36b0b6fc9274c91aa',
			'9778397bd19801ec9210c965cc920e',
			'97b6b97bd19801ec95f8c965cc920f',
			'97bd09801d98082c95f8e1cfcc920f',
			'97bd097bd097c36b0b6fc9210c8dc2',
			'9778397bd197c36c9210c9274c91aa',
			'97b6b97bd19801ec95f8c965cc920e',
			'97bd09801d98082c95f8e1cfcc920f',
			'97bd097bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c91aa',
			'97b6b97bd19801ec95f8c965cc920e',
			'97bcf97c3598082c95f8e1cfcc920f',
			'97bd097bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c3598082c95f8c965cc920f',
			'97bd097bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c3598082c95f8c965cc920f',
			'97bd097bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f',
			'97bd097bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f',
			'97bd097bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f',
			'97bd097bd07f595b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9210c8dc2',
			'9778397bd19801ec9210c9274c920e',
			'97b6b97bd19801ec95f8c965cc920f',
			'97bd07f5307f595b0b0bc920fb0722',
			'7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c920e',
			'97b6b97bd19801ec95f8c965cc920f',
			'97bd07f5307f595b0b0bc920fb0722',
			'7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bd07f1487f595b0b0bc920fb0722',
			'7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c9274c920e',
			'97bcf7f0e47f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c91aa',
			'97b6b97bd197c36c9210c9274c920e',
			'97bcf7f0e47f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c920e',
			'97b6b7f0e47f531b0723b0b6fb0722',
			'7f0e37f5307f595b0b0bc920fb0722',
			'7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36b0b70c9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e37f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc9210c8dc2',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0787b0721',
			'7f0e27f0e47f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c91aa',
			'97b6b7f0e47f149b0723b0787b0721',
			'7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c8dc2',
			'977837f0e37f149b0723b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722',
			'7f0e37f5307f595b0b0bc920fb0722',
			'7f0e397bd097c35b0b6fc9210c8dc2',
			'977837f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e37f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc9210c8dc2',
			'977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722',
			'977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f149b0723b0787b0721',
			'7f0e27f0e47f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'977837f0e37f14998082b0723b06bd',
			'7f07e7f0e37f149b0723b0787b0721',
			'7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722',
			'977837f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722',
			'7f0e37f1487f595b0b0bb0b6fb0722',
			'7f0e37f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722',
			'7f0e37f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e37f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e37f14898082b072297c35',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e37f14898082b072297c35',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f149b0723b0787b0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35',
			'7ec967f0e37f14998082b0723b06bd',
			'7f07e7f0e47f149b0723b0787b0721',
			'7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35',
			'7ec967f0e37f14998082b0723b06bd',
			'7f07e7f0e37f14998083b0787b0721',
			'7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35',
			'7ec967f0e37f14898082b0723b02d5',
			'7f07e7f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722',
			'7f0e36665b66aa89801e9808297c35',
			'665f67f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722',
			'7f0e36665b66a449801e9808297c35',
			'665f67f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e36665b66a449801e9808297c35',
			'665f67f0e37f14898082b072297c35',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e26665b66a449801e9808297c35',
			'665f67f0e37f1489801eb072297c35',
			'7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722',
		],
		nStr1: ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
		nStr2: ['初', '十', '廿', '卅'],
		nStr3: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
		lYearDays: function (b) {
			var f,
				c = 348;
			for (f = 32768; f > 8; f >>= 1) c += calendar.lunarInfo[b - 1900] & f ? 1 : 0;
			return c + calendar.leapDays(b);
		},
		leapMonth: function (b) {
			return 15 & calendar.lunarInfo[b - 1900];
		},
		leapDays: function (b) {
			return calendar.leapMonth(b) ? (65536 & calendar.lunarInfo[b - 1900] ? 30 : 29) : 0;
		},
		monthDays: function (b, f) {
			return f > 12 || f < 1 ? -1 : calendar.lunarInfo[b - 1900] & (65536 >> f) ? 30 : 29;
		},
		solarDays: function (b, f) {
			if (f > 12 || f < 1) return -1;
			var c = f - 1;
			return 1 == c ? ((b % 4 == 0 && b % 100 != 0) || b % 400 == 0 ? 29 : 28) : calendar.solarMonth[c];
		},
		toGanZhiYear: function (b) {
			var f = (b - 3) % 10,
				c = (b - 3) % 12;
			return 0 == f && (f = 10), 0 == c && (c = 12), calendar.Gan[f - 1] + calendar.Zhi[c - 1];
		},
		toAstro: function (b, f) {
			return (
				'魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
					2 * b - (f < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][b - 1] ? 2 : 0),
					2
				) + '座'
			);
		},
		toGanZhi: function (b) {
			return calendar.Gan[b % 10] + calendar.Zhi[b % 12];
		},
		getTerm: function (b, f) {
			if (b < 1900 || b > 2100) return -1;
			if (f < 1 || f > 24) return -1;
			var c = calendar.sTermInfo[b - 1900],
				e = [
					parseInt('0x' + c.substr(0, 5)).toString(),
					parseInt('0x' + c.substr(5, 5)).toString(),
					parseInt('0x' + c.substr(10, 5)).toString(),
					parseInt('0x' + c.substr(15, 5)).toString(),
					parseInt('0x' + c.substr(20, 5)).toString(),
					parseInt('0x' + c.substr(25, 5)).toString(),
				],
				a = [
					e[0].substr(0, 1),
					e[0].substr(1, 2),
					e[0].substr(3, 1),
					e[0].substr(4, 2),
					e[1].substr(0, 1),
					e[1].substr(1, 2),
					e[1].substr(3, 1),
					e[1].substr(4, 2),
					e[2].substr(0, 1),
					e[2].substr(1, 2),
					e[2].substr(3, 1),
					e[2].substr(4, 2),
					e[3].substr(0, 1),
					e[3].substr(1, 2),
					e[3].substr(3, 1),
					e[3].substr(4, 2),
					e[4].substr(0, 1),
					e[4].substr(1, 2),
					e[4].substr(3, 1),
					e[4].substr(4, 2),
					e[5].substr(0, 1),
					e[5].substr(1, 2),
					e[5].substr(3, 1),
					e[5].substr(4, 2),
				];
			return parseInt(a[f - 1]);
		},
		toChinaMonth: function (b) {
			if (b > 12 || b < 1) return -1;
			var f = calendar.nStr3[b - 1];
			return (f += '月');
		},
		toChinaDay: function (b) {
			var f;
			switch (b) {
				case 10:
					f = '初十';
					break;
				case 20:
					f = '二十';
					break;
				case 30:
					f = '三十';
					break;
				default:
					(f = calendar.nStr2[Math.floor(b / 10)]), (f += calendar.nStr1[b % 10]);
			}
			return f;
		},
		getAnimal: function (b) {
			return calendar.Animals[(b - 4) % 12];
		},
		solar2lunar: function (b, f, c) {
			if (b < 1900 || b > 2100) return -1;
			if (1900 == b && 1 == f && c < 31) return -1;
			if (b) e = new Date(b, parseInt(f) - 1, c);
			else var e = new Date();
			var a,
				r = 0,
				d =
					((b = e.getFullYear()),
					(f = e.getMonth() + 1),
					(c = e.getDate()),
					(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) - Date.UTC(1900, 0, 31)) / 864e5);
			for (a = 1900; a < 2101 && d > 0; a++) d -= r = calendar.lYearDays(a);
			d < 0 && ((d += r), a--);
			var n = new Date(),
				t = !1;
			n.getFullYear() == b && n.getMonth() + 1 == f && n.getDate() == c && (t = !0);
			var s = e.getDay(),
				l = calendar.nStr1[s];
			0 == s && (s = 7);
			var u = a,
				o = calendar.leapMonth(a),
				i = !1;
			for (a = 1; a < 13 && d > 0; a++)
				o > 0 && a == o + 1 && 0 == i ? (--a, (i = !0), (r = calendar.leapDays(u))) : (r = calendar.monthDays(u, a)),
					1 == i && a == o + 1 && (i = !1),
					(d -= r);
			0 == d && o > 0 && a == o + 1 && (i ? (i = !1) : ((i = !0), --a)), d < 0 && ((d += r), --a);
			var h = a,
				D = d + 1,
				g = f - 1,
				y = calendar.toGanZhiYear(u),
				p = calendar.getTerm(u, 2 * f - 1),
				m = calendar.getTerm(u, 2 * f),
				v = calendar.toGanZhi(12 * (b - 1900) + f + 11);
			c >= p && (v = calendar.toGanZhi(12 * (b - 1900) + f + 12));
			var M = !1,
				T = null;
			p == c && ((M = !0), (T = calendar.solarTerm[2 * f - 2])), m == c && ((M = !0), (T = calendar.solarTerm[2 * f - 1]));
			var I = Date.UTC(b, g, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10,
				C = calendar.toGanZhi(I + c - 1),
				S = calendar.toAstro(f, c);
			return {
				lYear: u,
				lMonth: h,
				lDay: D,
				Animal: calendar.getAnimal(u),
				IMonthCn: (i ? '闰' : '') + calendar.toChinaMonth(h),
				IDayCn: calendar.toChinaDay(D),
				cYear: b,
				cMonth: f,
				cDay: c,
				gzYear: y,
				gzMonth: v,
				gzDay: C,
				isToday: t,
				isLeap: i,
				nWeek: s,
				ncWeek: '星期' + l,
				isTerm: M,
				Term: T,
				astro: S,
			};
		},
		lunar2solar: function (b, f, c, e) {
			e = !!e;
			var a = calendar.leapMonth(b);
			calendar.leapDays(b);
			if (e && a != f) return -1;
			if ((2100 == b && 12 == f && c > 1) || (1900 == b && 1 == f && c < 31)) return -1;
			var r = calendar.monthDays(b, f),
				d = r;
			if ((e && (d = calendar.leapDays(b, f)), b < 1900 || b > 2100 || c > d)) return -1;
			for (var n = 0, t = 1900; t < b; t++) n += calendar.lYearDays(t);
			var s = 0,
				l = !1;
			for (t = 1; t < f; t++)
				(s = calendar.leapMonth(b)), l || (s <= t && s > 0 && ((n += calendar.leapDays(b)), (l = !0))), (n += calendar.monthDays(b, t));
			e && (n += r);
			var u = Date.UTC(1900, 1, 30, 0, 0, 0),
				o = new Date(864e5 * (n + c - 31) + u),
				i = o.getUTCFullYear(),
				h = o.getUTCMonth() + 1,
				D = o.getUTCDate();
			return calendar.solar2lunar(i, h, D);
		},
	};
}

function Env(name, opts) {
  class Http {
    constructor(env) {
      this.env = env;
    }

    send(opts, method = "GET") {
      opts = typeof opts === "string" ? { url: opts } : opts;
      let sender = this.get;
      if (method === "POST") {
        sender = this.post;
      }
      return new Promise((resolve, reject) => {
        sender.call(this, opts, (err, resp, body) => {
          if (err) reject(err);
          else resolve(resp);
        });
      });
    }

    get(opts) {
      return this.send.call(this.env, opts);
    }

    post(opts) {
      return this.send.call(this.env, opts, "POST");
    }
  }

  return new (class {
    constructor(name, opts) {
      this.name = name;
      this.http = new Http(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.logSeparator = "\n";
      this.encoding = "utf-8";
      this.startTime = new Date().getTime();
      Object.assign(this, opts);
      this.log("", `🔔${this.name}, 开始!`);
    }

    getEnv() {
      if ("undefined" !== typeof $environment && $environment["surge-version"])
        return "Surge";
      if ("undefined" !== typeof $environment && $environment["stash-version"])
        return "Stash";
      if ("undefined" !== typeof module && !!module.exports) return "Node.js";
      if ("undefined" !== typeof $task) return "Quantumult X";
      if ("undefined" !== typeof $loon) return "Loon";
      if ("undefined" !== typeof $rocket) return "Shadowrocket";
    }

    isNode() {
      return "Node.js" === this.getEnv();
    }

    isQuanX() {
      return "Quantumult X" === this.getEnv();
    }

    isSurge() {
      return "Surge" === this.getEnv();
    }

    isLoon() {
      return "Loon" === this.getEnv();
    }

    isShadowrocket() {
      return "Shadowrocket" === this.getEnv();
    }

    isStash() {
      return "Stash" === this.getEnv();
    }

    toObj(str, defaultValue = null) {
      try {
        return JSON.parse(str);
      } catch {
        return defaultValue;
      }
    }

    toStr(obj, defaultValue = null) {
      try {
        return JSON.stringify(obj);
      } catch {
        return defaultValue;
      }
    }

    getjson(key, defaultValue) {
      let json = defaultValue;
      const val = this.getdata(key);
      if (val) {
        try {
          json = JSON.parse(this.getdata(key));
        } catch {}
      }
      return json;
    }

    setjson(val, key) {
      try {
        return this.setdata(JSON.stringify(val), key);
      } catch {
        return false;
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this.get({ url }, (err, resp, body) => resolve(body));
      });
    }

    runScript(script, runOpts) {
      return new Promise((resolve) => {
        let httpapi = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        httpapi = httpapi ? httpapi.replace(/\n/g, "").trim() : httpapi;
        let httpapi_timeout = this.getdata(
          "@chavy_boxjs_userCfgs.httpapi_timeout"
        );
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20;
        httpapi_timeout =
          runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout;
        const [key, addr] = httpapi.split("@");
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`,
          body: {
            script_text: script,
            mock_type: "cron",
            timeout: httpapi_timeout,
          },
          headers: { "X-Key": key, Accept: "*/*" },
          timeout: httpapi_timeout,
        };
        this.post(opts, (err, resp, body) => resolve(body));
      }).catch((e) => this.logErr(e));
    }

    loaddata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const curDirDataFilePath = this.path.resolve(this.dataFile);
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        );
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
        const isRootDirDataFile =
          !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile
            ? curDirDataFilePath
            : rootDirDataFilePath;
          try {
            return JSON.parse(this.fs.readFileSync(datPath));
          } catch (e) {
            return {};
          }
        } else return {};
      } else return {};
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const curDirDataFilePath = this.path.resolve(this.dataFile);
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        );
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
        const isRootDirDataFile =
          !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
        const jsondata = JSON.stringify(this.data);
        if (isCurDirDataFile) {
          this.fs.writeFileSync(curDirDataFilePath, jsondata);
        } else if (isRootDirDataFile) {
          this.fs.writeFileSync(rootDirDataFilePath, jsondata);
        } else {
          this.fs.writeFileSync(curDirDataFilePath, jsondata);
        }
      }
    }

    lodash_get(source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let result = source;
      for (const p of paths) {
        result = Object(result)[p];
        if (result === undefined) {
          return defaultValue;
        }
      }
      return result;
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj;
      if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
      path
        .slice(0, -1)
        .reduce(
          (a, c, i) =>
            Object(a[c]) === a[c]
              ? a[c]
              : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
          obj
        )[path[path.length - 1]] = value;
      return obj;
    }

    getdata(key) {
      let val = this.getval(key);
      // 如果以 @
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
        const objval = objkey ? this.getval(objkey) : "";
        if (objval) {
          try {
            const objedval = JSON.parse(objval);
            val = objedval ? this.lodash_get(objedval, paths, "") : val;
          } catch (e) {
            val = "";
          }
        }
      }
      return val;
    }

    setdata(val, key) {
      let issuc = false;
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
        const objdat = this.getval(objkey);
        const objval = objkey
          ? objdat === "null"
            ? null
            : objdat || "{}"
          : "{}";
        try {
          const objedval = JSON.parse(objval);
          this.lodash_set(objedval, paths, val);
          issuc = this.setval(JSON.stringify(objedval), objkey);
        } catch (e) {
          const objedval = {};
          this.lodash_set(objedval, paths, val);
          issuc = this.setval(JSON.stringify(objedval), objkey);
        }
      } else {
        issuc = this.setval(val, key);
      }
      return issuc;
    }

    getval(key) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.read(key);
        case "Quantumult X":
          return $prefs.valueForKey(key);
        case "Node.js":
          this.data = this.loaddata();
          return this.data[key];
        default:
          return (this.data && this.data[key]) || null;
      }
    }

    setval(val, key) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.write(val, key);
        case "Quantumult X":
          return $prefs.setValueForKey(val, key);
        case "Node.js":
          this.data = this.loaddata();
          this.data[key] = val;
          this.writedata();
          return true;
        default:
          return (this.data && this.data[key]) || null;
      }
    }

    initGotEnv(opts) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {};
        if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this.ckjar;
        }
      }
    }

    get(request, callback = () => {}) {
      if (request.headers) {
        delete request.headers["Content-Type"];
        delete request.headers["Content-Length"];

        // HTTP/2 全是小写
        delete request.headers["content-type"];
        delete request.headers["content-length"];
      }
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          if (this.isSurge() && this.isNeedRewrite) {
            request.headers = request.headers || {};
            Object.assign(request.headers, { "X-Surge-Skip-Scripting": false });
          }
          $httpClient.get(request, (err, resp, body) => {
            if (!err && resp) {
              resp.body = body;
              resp.statusCode = resp.status ? resp.status : resp.statusCode;
              resp.status = resp.statusCode;
            }
            callback(err, resp, body);
          });
          break;
        case "Quantumult X":
          if (this.isNeedRewrite) {
            request.opts = request.opts || {};
            Object.assign(request.opts, { hints: false });
          }
          $task.fetch(request).then(
            (resp) => {
              const {
                statusCode: status,
                statusCode,
                headers,
                body,
                bodyBytes,
              } = resp;
              callback(
                null,
                { status, statusCode, headers, body, bodyBytes },
                body,
                bodyBytes
              );
            },
            (err) => callback((err && err.error) || "UndefinedError")
          );
          break;
        case "Node.js":
          let iconv = require("iconv-lite");
          this.initGotEnv(request);
          this.got(request)
            .on("redirect", (resp, nextOpts) => {
              try {
                if (resp.headers["set-cookie"]) {
                  const ck = resp.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  if (ck) {
                    this.ckjar.setCookieSync(ck, null);
                  }
                  nextOpts.cookieJar = this.ckjar;
                }
              } catch (e) {
                this.logErr(e);
              }
              // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
            })
            .then(
              (resp) => {
                const {
                  statusCode: status,
                  statusCode,
                  headers,
                  rawBody,
                } = resp;
                const body = iconv.decode(rawBody, this.encoding);
                callback(
                  null,
                  { status, statusCode, headers, rawBody, body },
                  body
                );
              },
              (err) => {
                const { message: error, response: resp } = err;
                callback(
                  error,
                  resp,
                  resp && iconv.decode(resp.rawBody, this.encoding)
                );
              }
            );
          break;
      }
    }

    post(request, callback = () => {}) {
      const method = request.method
        ? request.method.toLocaleLowerCase()
        : "post";

      // 如果指定了请求体, 但没指定 `Content-Type`、`content-type`, 则自动生成。
      if (
        request.body &&
        request.headers &&
        !request.headers["Content-Type"] &&
        !request.headers["content-type"]
      ) {
        // HTTP/1、HTTP/2 都支持小写 headers
        request.headers["content-type"] = "application/x-www-form-urlencoded";
      }
      // 为避免指定错误 `content-length` 这里删除该属性，由工具端 (HttpClient) 负责重新计算并赋值
      if (request.headers) {
        delete request.headers["Content-Length"];
        delete request.headers["content-length"];
      }
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          if (this.isSurge() && this.isNeedRewrite) {
            request.headers = request.headers || {};
            Object.assign(request.headers, { "X-Surge-Skip-Scripting": false });
          }
          $httpClient[method](request, (err, resp, body) => {
            if (!err && resp) {
              resp.body = body;
              resp.statusCode = resp.status ? resp.status : resp.statusCode;
              resp.status = resp.statusCode;
            }
            callback(err, resp, body);
          });
          break;
        case "Quantumult X":
          request.method = method;
          if (this.isNeedRewrite) {
            request.opts = request.opts || {};
            Object.assign(request.opts, { hints: false });
          }
          $task.fetch(request).then(
            (resp) => {
              const {
                statusCode: status,
                statusCode,
                headers,
                body,
                bodyBytes,
              } = resp;
              callback(
                null,
                { status, statusCode, headers, body, bodyBytes },
                body,
                bodyBytes
              );
            },
            (err) => callback((err && err.error) || "UndefinedError")
          );
          break;
        case "Node.js":
          let iconv = require("iconv-lite");
          this.initGotEnv(request);
          const { url, ..._request } = request;
          this.got[method](url, _request).then(
            (resp) => {
              const { statusCode: status, statusCode, headers, rawBody } = resp;
              const body = iconv.decode(rawBody, this.encoding);
              callback(
                null,
                { status, statusCode, headers, rawBody, body },
                body
              );
            },
            (err) => {
              const { message: error, response: resp } = err;
              callback(
                error,
                resp,
                resp && iconv.decode(resp.rawBody, this.encoding)
              );
            }
          );
          break;
      }
    }
    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {string} fmt 格式化参数
     * @param {number} 可选: 根据指定时间戳返回格式化日期
     *
     */
    time(fmt, ts = null) {
      const date = ts ? new Date(ts) : new Date();
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }

    /**
     *
     * @param {Object} options
     * @returns {String} 将 Object 对象 转换成 queryStr: key=val&name=senku
     */
    queryStr(options) {
      let queryString = "";

      for (const key in options) {
        let value = options[key];
        if (value != null && value !== "") {
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          queryString += `${key}=${value}&`;
        }
      }
      queryString = queryString.substring(0, queryString.length - 1);

      return queryString;
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = "", desc = "", opts) {
      const toEnvOpts = (rawopts) => {
        switch (typeof rawopts) {
          case undefined:
            return rawopts;
          case "string":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              default:
                return { url: rawopts };
              case "Loon":
              case "Shadowrocket":
                return rawopts;
              case "Quantumult X":
                return { "open-url": rawopts };
              case "Node.js":
                return undefined;
            }
          case "object":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              case "Shadowrocket":
              default: {
                let openUrl =
                  rawopts.url || rawopts.openUrl || rawopts["open-url"];
                return { url: openUrl };
              }
              case "Loon": {
                let openUrl =
                  rawopts.openUrl || rawopts.url || rawopts["open-url"];
                let mediaUrl = rawopts.mediaUrl || rawopts["media-url"];
                return { openUrl, mediaUrl };
              }
              case "Quantumult X": {
                let openUrl =
                  rawopts["open-url"] || rawopts.url || rawopts.openUrl;
                let mediaUrl = rawopts["media-url"] || rawopts.mediaUrl;
                let updatePasteboard =
                  rawopts["update-pasteboard"] || rawopts.updatePasteboard;
                return {
                  "open-url": openUrl,
                  "media-url": mediaUrl,
                  "update-pasteboard": updatePasteboard,
                };
              }
              case "Node.js":
                return undefined;
            }
          default:
            return undefined;
        }
      };
      if (!this.isMute) {
        switch (this.getEnv()) {
          case "Surge":
          case "Loon":
          case "Stash":
          case "Shadowrocket":
          default:
            $notification.post(title, subt, desc, toEnvOpts(opts));
            break;
          case "Quantumult X":
            $notify(title, subt, desc, toEnvOpts(opts));
            break;
          case "Node.js":
            break;
        }
      }
      if (!this.isMuteLog) {
        let logs = ["", "==============📣系统通知📣=============="];
        logs.push(title);
        subt ? logs.push(subt) : "";
        desc ? logs.push(desc) : "";
        console.log(logs.join("\n"));
        this.logs = this.logs.concat(logs);
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this.logs = [...this.logs, ...logs];
      }
      console.log(logs.join(this.logSeparator));
    }

    logErr(err, msg) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          this.log("", `❗️${this.name}, 错误!`, err);
          break;
        case "Node.js":
          this.log("", `❗️${this.name}, 错误!`, err.stack);
          break;
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    done(val = {}) {
      const endTime = new Date().getTime();
      const costTime = (endTime - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
      this.log();
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          $done(val);
          break;
        case "Node.js":
          process.exit(1);
          break;
      }
    }
  })(name, opts);
}
