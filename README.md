#MyMoney Telegram Bot

## Install

### Error: Cannot find module 'foo'
* https://help.heroku.com/TO64O3OG/cannot-find-module-in-node-js-at-runtime
* https://help.heroku.com/QMZ3RR7L/how-do-i-fix-a-missing-module-in-my-package-json

Solution:
```bash
heroku config:set NODE_MODULES_CACHE=false
```

## Using Heroku
