# AGENTS.md

## Project
This is a Turborepo monorepo for a community grocery platform.

## Apps
- apps/admin: Next.js + shadcn/ui admin dashboard.
- apps/api: NestJS backend service.
- apps/miniapp: uni-app WeChat Mini Program.

## Packages
- packages/types: shared TypeScript business types.
- packages/schemas: shared zod schemas.
- packages/api-client: shared API client.
- packages/constants: shared enums/constants.
- packages/utils: shared pure utilities.
- packages/design-tokens: shared design tokens.
- packages/admin-ui: React UI components for admin only.
- packages/miniapp-ui: Vue/uni-app components for miniapp only.

## Dependency Rules
- apps/admin may depend on admin-ui, api-client, types, schemas, constants, utils.
- apps/miniapp may depend on miniapp-ui, api-client, types, constants, utils.
- apps/api may depend on types, schemas, constants, utils.
- admin-ui must not depend on miniapp-ui.
- miniapp-ui must not depend on admin-ui.
- shared packages must not depend on apps.
- miniapp must not import apps/api internal code.

## UI Rules
- shadcn/ui components are for apps/admin and packages/admin-ui only.
- uni-app components are for apps/miniapp and packages/miniapp-ui only.
- Shared visual decisions should go into packages/design-tokens.

## Backend Rules
- NestJS modules should be grouped by business domain.
- Keep DTO/schema contracts aligned with packages/schemas.
- Do not leak database models directly to frontend clients.

## Commands
- Use pnpm.
- Use turbo for repo-level commands.
- Do not commit generated build output.
