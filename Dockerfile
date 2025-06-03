# 1. 使用轻量 Node.js 官方镜像
FROM node:20-alpine AS base

# 2. 设置工作目录
WORKDIR /app

# 3. 安装依赖（使用缓存优化）
COPY package*.json ./
RUN npm ci --omit=dev

# 4. 拷贝源码
COPY . .

# 5. 设置生产环境变量
ENV NODE_ENV=production

# 6. 构建项目（如果已构建可跳过）
RUN npm run build

# 7. 设置暴露端口
EXPOSE 3000

# 8. 启动服务（使用 node 直接运行比 npm 更推荐）
CMD ["node", "server.js"]
