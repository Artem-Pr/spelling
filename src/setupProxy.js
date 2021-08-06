const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
	app.use(
		['/_cat', '/_search', '/**/_search', '/**/_count'],
		createProxyMiddleware({
			target: 'http://dm-epn2-srv01.dms.loc:9200',
			changeOrigin: true,
		})
	);
};
