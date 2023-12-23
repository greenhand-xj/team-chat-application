# 全栈DiscordMY: Next.js 13, React, Socket.io, Prisma, Tailwind, MySQL

![Copy of Copy of Copy of Fullstack Twitter Clone (5)](https://github.com/AntonioErdeljac/next13-discord-clone/assets/23248726/14e25e4f-eb83-44dd-8b97-4f2666b89386)

关键功能点:

- 使用 Socket.io 进行实时消息传递
- 使用 UploadThing 将附件作为消息发送
- 实时删除和编辑所有用户的消息
- 创建文本、音频和视频通话频道
- 成员之间的 1：1 对话
- 成员之间的 1：1 视频通话
- 成员管理（踢人、角色转换、guest/Moderator）
- 独特的邀请链接生成和完整的邀请加入流程
- 无限加载 10 条消息（tanstack/query）
- 服务器创建和自定义
- 完全响应和移动用户界面
- 浅色/深色模式
- Websocket轮询回退

### 前提需求

**Node version 18.x.x**

### 克隆仓库

```shell
git clone https://github.com/AntonioErdeljac/next13-discord-clone.git
```

### Install packages

```shell
npm i
```

### 设置 .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=


DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

### 设置 Prisma

Add MySQL Database URL

```shell
npx prisma generate
npx prisma db push

```

### 启动

```shell
npm run dev
```
