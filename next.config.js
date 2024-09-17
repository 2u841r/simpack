// next.config.js
module.exports = {
    async headers() {
      return [
        {
          source: '/:all*(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|eot|ttf|otf)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          ],
        },
      ];
    },
  };
  