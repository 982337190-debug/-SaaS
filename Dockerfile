# ===== 构建阶段 =====
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY backend/package*.json ./

# 安装所有依赖（包括devDependencies用于构建）
RUN npm ci

# 复制源代码
COPY backend/ ./

# 构建项目
RUN npm run build

# ===== 运行阶段 =====
FROM node:20-alpine AS runner

WORKDIR /app

# 复制依赖文件
COPY backend/package*.json ./

# 只安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 复制前端静态文件
COPY backend/frontend ./frontend

# 复制数据库初始化脚本
COPY backend/scripts ./scripts

# 创建数据目录用于SQLite持久化
RUN mkdir -p /app/data

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 启动命令
CMD ["node", "dist/main.js"]
