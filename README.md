<!--
title: 'Telegram Game bot'
description: 'This is a simple echo bot on Telegram.'
framework: v1
platform: AWS
language: NodeJS
authorLink: 'https://github.com/safonovklim'
authorName: 'Klim Safonov'
-->

# AWS Lambda + DynamoDB + Telegram = Game Bot 🎮

Tic-Tac-Toe Game in Telegram Group Chats. Try it now: [t.me/piski_game_bot](t.me/piski_game_bot) (demo bot has phrases in russian)

### Technologies:

- AWS Lambda
- AWS DynamoDB
- Serverless Framework
- [Telegram Bot API](https://core.telegram.org/bots)


### Requirements
- [Telegram account](https://telegram.org/)
- AWS account

## Setup App

1. Make sure you have [serverless](https://www.serverless.com/framework/docs/providers/aws/cli-reference/) installed

2. Make sure you have AWS account and serverless linked to that account

3. Install dependencies

```
$ yarn
```

4. Get Telegram Bot API Token by sending this message to [@BotFather](https://web.telegram.org/#/im?p=@BotFather)

```
$ /newbot
```

5. Set TELEGRAM_BOT_TOKEN in `serverless.yml`

```
  environment:
    TELEGRAM_BOT_TOKEN: xxxxxxxx:xxxxxxxx
```

6. Deploy application. Write down API endpoint from output.

```
$ sls deploy
```

```
...
endpoints:
  POST - https://xxxxxxxx.execute-api.xx-xxxx-x.amazonaws.com/dev/webhook
...
```

7. Let Telegram API know about your WebHook

```
curl --request POST --url https://api.telegram.org/bot{YOUR_TELEGRAM_BOT_API_TOKEN}/setWebhook --header 'content-type: application/json' --data '{"url": "{end-point}"}'
```

8. Last step: Create DynamoDB table in your AWS.

You can find table name in: 

```
AWS Lambda (website) 
-> Functions 
-> aws-tg-game-bot-dev-webhook 
-> Configuration 
-> Environment variables (2)
```

**Done!**

Play with your bot:

```
$ /game
$ /game 5
```


## Testing

```
yarn test
yarn lint
```