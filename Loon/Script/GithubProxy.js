(() => {
  const proxyUrl = `https://ghproxy.com`;
  $done({
    response: {
      status: 200,
      headers: {},
      body: "",
    },
  });
  //   $done({
  //     url: `${proxyUrl}/${$request.url}`,
  //   });
})();
