# 使用官方 Node.js 运行时镜像，14 或 16 都可以
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 先复制 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 安装生产依赖
RUN npm install --production

# 复制构建产物和静态资源
COPY .next .next
COPY public public

# 如果你需要其他文件，也一起 COPY
# COPY next.config.js .

# 运行应用端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
