const dotenv = require('dotenv');

dotenv.config({ path: './.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/diploma/level-1',
} = process.env;

module.exports = {
  apps: [{
    name: 'my-films-api',
    script: './dist/app.js',
  }],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/dariarus/movies-explorer-api',
      path: DEPLOY_PATH,
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy-local': `mkdir -p ${DEPLOY_PATH}/source/dist \
        && scp ./.env* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/dist`,
      'post-deploy': 'npm i && npm run build',
    },
  },
};
