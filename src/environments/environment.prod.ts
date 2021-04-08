const { version } = require('../../package.json');

export const environment = {
  production: true,
  ver: version,
  r2d2_rest_uri: 'http://130.183.216.136/r2d2/datasets',
  r2d2_file_uri: 'http://130.183.216.136/r2d2/files',
  r2d2_admin_uri: 'http://130.183.216.136/r2d2/admin',
  r2d2_vocab_uri: 'http://130.183.216.136/r2d2/vocabulary',

};
