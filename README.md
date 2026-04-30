# Community Grocery

社区买菜项目基础架构，使用 Turborepo 管理后台、服务端、小程序和共享包。

## Apps

- `apps/admin`: Next.js + shadcn/ui 后台管理端
- `apps/api`: NestJS 服务端
- `apps/miniapp`: uni-app 微信小程序

## Packages

- `packages/types`: 共享业务类型
- `packages/schemas`: 共享校验 schema
- `packages/api-client`: 前端请求 SDK
- `packages/constants`: 业务常量
- `packages/utils`: 通用工具
- `packages/design-tokens`: 设计令牌
- `packages/admin-ui`: 后台 React 组件库
- `packages/miniapp-ui`: 小程序 Vue 组件库
- `packages/config`: 公共配置

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```
