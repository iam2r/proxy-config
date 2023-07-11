(() => {
  const proxyUrl = `https://ghproxy.com`;
  $done({
    url: `${proxyUrl}/${$request.url}`,
  });
})();
