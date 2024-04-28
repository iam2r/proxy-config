const NF_BASE_URL="https://www.netflix.com/title/81280792",DISNEY_BASE_URL="https://www.disneyplus.com",DISNEY_LOCATION_BASE_URL="https://disney.api.edge.bamgrid.com/graph/v1/device/graphql",YTB_BASE_URL="https://www.youtube.com/premium",Dazn_BASE_URL="https://startup.core.indazn.com/misl/v5/Startup",Param_BASE_URL="https://www.paramountplus.com/",Discovery_token_BASE_URL="https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true",Discovery_BASE_URL="https://us1-prod-direct.discoveryplus.com/users/me",GPT_BASE_URL="https://chat.openai.com/",GPT_RegionL_URL="https://chat.openai.com/cdn-cgi/trace",Google_BASE_URL="https://www.google.com/maps/timeline";var inputParams=$environment.params,nodeName=inputParams.node;let flags=new Map([["AC","🇦🇨"],["AE","🇦🇪"],["AF","🇦🇫"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],["BJ","🇧🇯"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BR","🇧🇷"],["BS","🇧🇸"],["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],["CA","🇨🇦"],["CF","🇨🇫"],["CH","🇨🇭"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],["CO","🇨🇴"],["CP","🇨🇵"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],["DE","🇩🇪"],["DG","🇩🇬"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],["EA","🇪🇦"],["EC","🇪🇨"],["EE","🇪🇪"],["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["EU","🇪🇺"],["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],["FM","🇫🇲"],["FO","🇫�"],["FR","🇫🇷"],["GA","🇬🇦"],["GB","🇬🇧"],["HK","🇭🇰"],["HU","🇭🇺"],["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],["IN","🇮🇳"],["IS","🇮🇸"],["IT","🇮🇹"],["JP","🇯🇵"],["KR","🇰🇷"],["LU","🇱🇺"],["MO","🇲🇴"],["MX","🇲🇽"],["MY","🇲🇾"],["NL","🇳🇱"],["PH","🇵🇭"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],["SA","🇸🇦"],["SB","��🇧"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],["TH","🇹🇭"],["TN","🇹🇳"],["TO","🇹🇴"],["TR","🇹🇷"],["TV","🇹🇻"],["TW","🇨🇳"],["UK","🇬🇧"],["UM","🇺🇲"],["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],["VA","🇻🇦"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],["VN","🇻🇳"],["ZA","🇿🇦"]]),result={title:"  节点解锁查询",YouTube:"<b>YouTube: </b>检测失败，请重试� ❗️",Netflix:"<b>Netflix: </b>检测失败，请重试 ❗️",Dazn:"<b>Dazn: </b>检测失败，请重试 ❗️",Disney:"<b>Disneyᐩ: </b>检测失败，请重试 ❗️",Paramount:"<b>Paramountᐩ: </b>检测失败，请重试 ❗️",Discovery:"<b>Discoveryᐩ: </b>检测失败，请重试 ❗️"},arrow=" ➟ ";function disneyLocation(){return new Promise(((e,t)=>{let o={url:DISNEY_LOCATION_BASE_URL,node:nodeName,timeout:5e3,headers:{"Accept-Language":"en",Authorization:"ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84","Content-Type":"application/json","User-Agent":"UA"},body:JSON.stringify({query:"mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }",variables:{input:{applicationRuntime:"chrome",attributes:{browserName:"chrome",browserVersion:"94.0.4606",manufacturer:"microsoft",model:null,operatingSystem:"windows",operatingSystemVersion:"10.0",osDeviceIds:[]},deviceFamily:"browser",deviceLanguage:"en",deviceProfile:"windows"}}})};$httpClient.post(o,((t,o,s)=>{if(console.log("----------disney--------------"),t)return result.Discovery="<b>Disneyᐩ:</b>检测失败 ❗️",void e("disney request failed:"+t);if(200==o.status){console.log("disney request result:"+o.status);let t=JSON.parse(s);if(null!=t?.extensions?.sdk?.session){let{inSupportedLocation:o,location:{countryCode:s}}=t?.extensions?.sdk?.session;0==o?(result.Disney="<b>Disneyᐩ:</b> 即将登陆 ➟ ⟦"+flags.get(s.toUpperCase())+"⟧ ⚠️",e()):(result.Disney="<b>Disneyᐩ:</b> 支持 ➟ ⟦"+flags.get(s.toUpperCase())+"⟧ 🎉",e({inSupportedLocation:o,countryCode:s}))}else result.Disney="<b>Disneyᐩ:</b> 未支持 🚫 ",e()}else result.Discovery="<b>Disneyᐩ:</b>检测失败 ❗️",e()}))}))}function disneyHomePage(){return new Promise(((e,t)=>{let o={url:DISNEY_BASE_URL,node:nodeName,timeout:5e3,headers:{"Accept-Language":"en","User-Agent":UA}};$httpClient.get(o,((t,o,s)=>{if(t)e(t);else if(200!=o.status||-1!=s.indexOf("unavailable"))e();else{let t=s.match(/Region: ([A-Za-z]{2})[\s\S]*?CNBL: ([12])/);if(t){let o=t[1],s=t[2];e({region:o,cnbl:s})}else e()}}))}))}function ytbTest(){return new Promise(((e,t)=>{let o={url:YTB_BASE_URL,node:nodeName,timeout:1e4,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"}};$httpClient.get(o,((t,o,s)=>{if(console.log("----------YTB--------------"),t)return console.log("YTB request failed:"+t),result.YouTube="<b>YouTube Premium: </b>检测失败 ❗️",void e(t);if(200!==o.status)result.YouTube="<b>YouTube Premium: </b>检测失败 ❗️",e(o.status);else if(console.log("YTB request data:"+o.status),-1!==s.indexOf("Premium is not available in your country"))result.YouTube="<b>YouTube Premium: </b>未支持 🚫",e("YTB test failed");else if(-1==s.indexOf("Premium is not available in your country")){let t="",o=new RegExp('"GL":"(.*?)"',"gm").exec(s);t=null!=o&&2===o.length?o[1]:-1!==s.indexOf("www.google.cn")?"CN":"US",console.log("YTB region:"+t),result.YouTube="<b>YouTube Premium: </b>支持 "+arrow+"⟦"+flags.get(t.toUpperCase())+"⟧ 🎉",e(t)}else result.YouTube="<b>YouTube Premium: </b>检测超时 🚦",e("timeout")}))}))}function daznTest(){return new Promise(((e,t)=>{let o={url:Dazn_BASE_URL,node:nodeName,timeout:5e3,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36","Content-Type":"application/json"},body:'{\n            "LandingPageKey":"generic",\n            "Platform":"web",\n            "PlatformAttributes":{},\n            "Manufacturer":"",\n            "PromoCode":"",\n            "Version":"2"\n          }'};$httpClient.post(o,((t,o,s)=>{if(console.log("----------DAZN--------------"),t)return console.log("Dazn request error:"+t),result.Dazn="<b>Dazn: </b>检测失败 ❗️",void e(t);if(200==o.status){console.log("Dazn request data:"+o.status);let t="",r=new RegExp('"GeolocatedCountry":"(.*?)"',"gm").exec(s);null!=r&&2===r.length?(t=r[1],result.Dazn="<b>Dazn: </b>支持 "+arrow+"⟦"+flags.get(t.toUpperCase())+"⟧ 🎉"):result.Dazn="<b>Dazn: </b>未支持 🚫",e(t)}else result.Dazn="<b>Dazn: </b>检测失败 ❗️",e(o.status)}))}))}function parmTest(){return new Promise(((e,t)=>{let o={url:Param_BASE_URL,node:nodeName,timeout:5e3,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"}};$httpClient.get(o,((t,o,s)=>{if(console.log("----------PARAM--------------"),t)return console.log("Param request error:"+t),result["Paramountᐩ"]="<b>Paramountᐩ: </b>检测失败 ❗️",void e(t);console.log("param result:"+o.status),200==o.status?(result.Paramount="<b>Paramountᐩ: </b>支持 🎉 ",e()):302==o.status?(result.Paramount="<b>Paramountᐩ: </b>未支持 🚫",e()):(result.Paramount="<b>Paramountᐩ: </b>检测失败 ❗️",e())}))}))}function discoveryTest(){return new Promise(((e,t)=>{let o={url:Discovery_token_BASE_URL,node:nodeName,timeout:5e3,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"}};$httpClient.get(o,((t,o,s)=>{if(t)return console.log("Discovery token request error:"+t),void e(t);if(200==o.status){console.log("----------Discory token--------------"),console.log("discovery_token request result:"+s);let o=JSON.parse(s).data.attributes.token;let r={url:Discovery_BASE_URL,node:nodeName,timeout:5e3,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",Cookie:`_gcl_au=1.1.858579665.1632206782; _rdt_uuid=1632206782474.6a9ad4f2-8ef7-4a49-9d60-e071bce45e88; _scid=d154b864-8b7e-4f46-90e0-8b56cff67d05; _pin_unauth=dWlkPU1qWTRNR1ZoTlRBdE1tSXdNaTAwTW1Nd0xUbGxORFV0WWpZMU0yVXdPV1l6WldFeQ; _sctr=1|1632153600000; aam_fw=aam%3D9354365%3Baam%3D9040990; aam_uuid=24382050115125439381416006538140778858; st=${o}; gi_ls=0; _uetvid=a25161a01aa711ec92d47775379d5e4d; AMCV_BC501253513148ED0A490D45%40AdobeOrg=-1124106680%7CMCIDTS%7C18894%7CMCMID%7C24223296309793747161435877577673078228%7CMCAAMLH-1633011393%7C9%7CMCAAMB-1633011393%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1632413793s%7CNONE%7CvVersion%7C5.2.0; ass=19ef15da-95d6-4b1d-8fa2-e9e099c9cc38.1632408400.1632406594`}};$httpClient.get(r,((o,s,r)=>{if(console.log("----------Discory--------------"),o)return console.log("Discovery request error:"+t),result.Discovery="<b>Discoveryᐩ: </b>检测失败 ❗️",void e(o);if(200==s.status){console.log("Discovery request result:"+r),"us"==JSON.parse(r).data.attributes.currentLocationTerritory?(result.Discovery="<b>Discoveryᐩ: </b>支持 🎉 ",e()):(result.Discovery="<b>Discoveryᐩ: </b>未支持 🚫",e())}else result.Discovery="<b>Discoveryᐩ: </b>检测失败 ❗️",e(s.status)}))}else result.Discovery="<b>Discoveryᐩ: </b>检测失败 ❗️",e(o.status)}))}))}function nfTest(){return new Promise(((e,t)=>{let o={url:NF_BASE_URL,node:nodeName,timeout:6e3,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15"}};$httpClient.get(o,((t,o,s)=>{if(console.log("----------NetFlix--------------"),t)return console.log("NF request failed: "+t),result.Netflix="<b>Netflix: </b>检测失败 ❗️",void e(t);if(403==o.status)result.Netflix="<b>Netflix: </b>未支持 🚫",e("403 Not Available");else if(404==o.status)result.Netflix="<b>Netflix: </b>支持自制剧集 ⚠️",e("404 Not Found");else if(200==o.status){console.log("NF request result:"+JSON.stringify(o.headers));let t=o.headers["X-Originating-URL"];null==t&&(t=o.headers["X-Originating-Url"]),console.log("X-Originating-URL:"+t);let s=t.split("/")[3];s=s.split("-")[0],"title"==s&&(s="us"),result.Netflix="<b>Netflix: </b>完整支持"+arrow+"⟦"+flags.get(s.toUpperCase())+"⟧ 🎉",e(s)}else result.Netflix="<b>Netflix: </b>检测失败 ❗️",e(o.status)}))}))}function gptTest(){return new Promise(((e,t)=>{let o={url:GPT_BASE_URL,node:nodeName,timeout:5e3};$httpClient.get(o,((t,o,s)=>{if(console.log("----------GPT--------------"),t)return console.log("GPT request failed:!!! "+t),result.ChatGPT="<b>ChatGPT: </b>未支持 🚫",void e("不支持 ChatGPT");let r=JSON.stringify(s);if(console.log("ChatGPT Main Test"),-1==r.indexOf("text/plain")){let o={url:GPT_RegionL_URL,node:nodeName,timeout:5e3};$httpClient.get(o,((o,s,r)=>{if(console.log("----------GPT RegionL--------------"),o)return console.log("GPT RegionL request error:"+t),result.ChatGPT="<b>ChatGPT: </b>检测失败 ❗️",void e(o);console.log("ChatGPT Region Test");let n=r.split("loc=")[1].split("\n")[0];console.log("ChatGPT Region: "+n),-1!=support_countryCodes.indexOf(n)?(result.ChatGPT="<b>ChatGPT: </b>支持 "+arrow+"⟦"+flags.get(n.toUpperCase())+"⟧ 🎉",console.log("支持 ChatGPT"),e(n)):(result.ChatGPT="<b>ChatGPT: </b>未支持 🚫",console.log("不支持 ChatGPT"),e("不支持 ChatGPT"))}))}else result.ChatGPT="<b>ChatGPT: </b>未支持 🚫",console.log("不支持 ChatGPT"),e("不支持 ChatGPT")}))}))}function googleToCN(){return new Promise(((e,t)=>{let o={url:Google_BASE_URL,node:nodeName,timeout:3e3,headers:{"Accept-Encoding":"gzip, deflate, br",Connection:"keep-alive",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Host:"www.google.com","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1","Accept-Language":"zh-CN,zh-Hans;q=0.9"}};$httpClient.get(o,((t,o,s)=>{if(console.log("----------Google2CN--------------"),t)return console.log("Google2CN request failed:"+t),result.Google2CN="<b>2CN: </b>检测失败 ❗️",void e(t);400==o.status?(result.Google2CN="<b>2CN: </b>已被送中",e("404 Not Found")):(result.Google2CN="<b>2CN: </b>未被送中",e(o.status))}))}))}Promise.all([ytbTest(),disneyLocation(),nfTest(),daznTest(),parmTest(),discoveryTest(),gptTest()]).then((e=>{let t="------------------------------------</br>"+[result.Dazn,result.Discovery,result.Paramount,result.Disney,result.Netflix,result.ChatGPT,result.YouTube].join("</br></br>");t=t+"</br>------------------------------------</br><font color=#CD5C5C><b>节点</b> ➟ "+nodeName+"</font>",t='<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">'+t+"</p>",console.log(t),$done({title:result.title,htmlMessage:t})})).catch((e=>{console.log("reject:"+e);let t="------------------------------------</br>"+[result.Dazn,result.Discovery,result.Paramount,result.Disney,result.Netflix,result.ChatGPT,result.YouTube].join("</br></br>");t=t+"</br>------------------------------------</br><font color=#CD5C5C><b>节点</b> ➟ "+nodeName+"</font>",t='<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">'+t+"</p>",$done({title:result.title,htmlMessage:t})})),support_countryCodes=["T1","XX","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BD","BB","BE","BZ","BJ","BT","BA","BW","BR","BG","BF","CV","CA","CL","CO","KM","CR","HR","CY","DK","DJ","DM","DO","EC","SV","EE","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HU","IS","IN","ID","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KW","KG","LV","LB","LS","LR","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA","PG","PE","PH","PL","PT","QA","RO","RW","KN","LC","VC","WS","SM","ST","SN","RS","SC","SL","SG","SK","SI","SB","ZA","ES","LK","SR","SE","CH","TH","TG","TO","TT","TN","TR","TV","UG","AE","US","UY","VU","ZM","BO","BN","CG","CZ","VA","FM","MD","PS","KR","TW","TZ","TL","GB"];