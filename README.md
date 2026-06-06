# 个人健康档案 (pdd-166)

全栈个人健康档案应用，支持体检指标记录、趋势图展示、用药提醒、家人绑定等功能。

## 项目结构

```
pdd-166/
├── frontend/     # React 18 + TypeScript + Vite + TailwindCSS
└── backend/      # Node.js + Express + SQLite
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 后端

```bash
cd backend
npm install
npm run dev
```

后端运行在 http://localhost:3000

## 功能特性

- 用户注册/登录
- 体检指标记录（血压、血糖、体重、体脂率等）
- 指标趋势图
- 异常值自动标黄提醒
- 用药提醒设置
- 家人账号绑定
- 体检报告上传
- 年度健康统计
