/******************************************
 * @name 豆瓣每日推荐
 * @statement 仅供学习交流，禁止用于商业用途
 * @version 1.0.0
 ******************************************/

const scriptName = "好片推荐";
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
  // 参数来源@Honye
  const apiKey = "0ab215a8b1977939201640fa14c66bab";
  const dateStr = $.time("yyyy-MM-dd");
  const opts = {
    url: `https://frodo.douban.com/api/v2/calendar/today?apikey=${apiKey}&date=${dateStr}&alt=json&_sig=tuOyn%2B2uZDBFGAFBLklc2GkuQk4%3D&_ts=1610703479`,
    headers: {
      "User-Agent": "api-client/0.1.3 com.douban.frodo/8.0.0",
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
          directors: subject.directors.map((item) => item.name).join("/"),
          actors:
            subject.actors
              .slice(0, 4)
              .map((item) => item.name)
              .join("/") + "...",
          poster: comment.poster,
          pubdate: subject.pubdate.join("/"),
          card_subtitle: subject.card_subtitle.split("\n")[0],
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
    // 资源来源@liuser
    const sourceList = [
      {
        name: "高清资源",
        searchUrl: "https://api.1080zyku.com/inc/apijson.php/",
      },
      {
        name: "红牛资源",
        searchUrl:
          "https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8/",
      },
      {
        name: "非凡资源",
        searchUrl: "http://cj.ffzyapi.com/api.php/provide/vod/",
      },
      {
        name: "量子资源",
        searchUrl: "https://cj.lziapi.com/api.php/provide/vod/",
      },
      {
        name: "ikun资源",
        searchUrl:
          "https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json/",
      },
      {
        name: "光速资源",
        searchUrl:
          "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/",
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
        $.log("未搜索到结果");
        return 0;
      }
      let video,
        found = false;
      for (let item of r.list) {
        $.log("正在对比剧集年份和演员");
        let yearEqual = item.vod_year == $MOVIE.year;
        let actorContain = item.vod_actor
          .split(",")[0]
          .includes($MOVIE.actors.split("/")[0]);
        if (yearEqual === true || actorContain === true) {
          video = item;
          found = true;
          break;
        }
      }
      if (found == false) {
        $.log("没有找到匹配剧集的影片，怎么回事哟！");
        return 0;
      }

      let playList = video.vod_play_url
        .split("$$$")
        .filter((str) => str.includes("m3u8"));
      if (playList.length == 0) {
        $.log("没有m3u8资源, 无法测速, 无法播放");
        return 0;
      }
      playList = playList[0].split("#");
      playList = playList.map((str) => {
        let index = str.indexOf("$");
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
      resolve("没有找到相关资源");
    } else {
      resolve(playList);
    }
  });
}
async function toNotify() {
  return new Promise(async (resolve) => {
    const {
      title,
      year,
      directors,
      actors,
      poster,
      pubdate,
      card_subtitle,
      rating,
      url,
    } = $MOVIE;
    const subTitle = `《${title}(${year})》\n${card_subtitle}`;
    const msg = `🎬${subTitle}\n🎭导演：${directors}\n🎭主演：${actors}\n📅上映：${pubdate}\n⭐️评分：${rating}\n🔗链接：${url}`;
    $.msg(scriptName, subTitle, msg, {
      "media-url": poster.replace("webp", "jpg"),
    });
    resolve();
  });
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
