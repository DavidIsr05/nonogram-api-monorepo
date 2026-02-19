# nonogram-api-monorepo

# File Tree:

```
├── 📁 .nx
├── 📁 apps
│   ├── 📁 client
│   │   ├── 📁 public
│   │   ├── 📁 src
│   │   │   ├── 📁 assets
│   │   │   │   ├── 📁 images
│   │   │   │   │   ├── 🖼️ big-logo.png
│   │   │   │   │   ├── 🖼️ blank-star.svg
│   │   │   │   │   ├── 🖼️ edit.svg
│   │   │   │   │   ├── 🖼️ filled-star.svg
│   │   │   │   │   ├── 🖼️ games.svg
│   │   │   │   │   ├── 🖼️ hint.svg
│   │   │   │   │   ├── 🖼️ image-placeholder.svg
│   │   │   │   │   ├── 🖼️ like.svg
│   │   │   │   │   ├── 🖼️ logo.svg
│   │   │   │   │   ├── 🖼️ mistakes.svg
│   │   │   │   │   ├── 🖼️ plus-create.svg
│   │   │   │   │   ├── 🖼️ preview-placeholder.svg
│   │   │   │   │   ├── 🖼️ profile.svg
│   │   │   │   │   ├── 🖼️ restart.svg
│   │   │   │   │   ├── 🖼️ save.svg
│   │   │   │   │   ├── 🖼️ timer.svg
│   │   │   │   │   ├── 🖼️ trophy.svg
│   │   │   │   │   └── 🖼️ upload.svg
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   ├── 📁 components
│   │   │   ├── 📁 routes
│   │   │   │   ├── 📁 game
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   └── 📄 index.ts
│   │   │   │   │   ├── 📄 game.tsx
│   │   │   │   │   └── 📄 index.ts
│   │   │   │   ├── 📁 home
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   └── 📄 index.ts
│   │   │   │   │   ├── 📄 home.tsx
│   │   │   │   │   └── 📄 index.ts
│   │   │   │   ├── 📁 landing
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   └── 📄 index.ts
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   └── 📄 landing.tsx
│   │   │   │   ├── 📁 signup
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   └── 📄 index.ts
│   │   │   │   │   └── 📄 index.ts
│   │   │   │   └── 📁 user
│   │   │   │       ├── 📁 userGames
│   │   │   │       │   ├── 📁 components
│   │   │   │       │   │   └── 📄 index.ts
│   │   │   │       │   └── 📄 index.ts
│   │   │   │       ├── 📁 userProfile
│   │   │   │       │   ├── 📁 components
│   │   │   │       │   │   └── 📄 index.ts
│   │   │   │       │   └── 📄 index.ts
│   │   │   │       └── 📄 index.ts
│   │   │   ├── 📁 store
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 api.ts
│   │   │   │   │   ├── 📄 auth-api.ts
│   │   │   │   │   ├── 📄 game-api.ts
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   ├── 📄 nonogram-api.ts
│   │   │   │   │   └── 📄 user-api.ts
│   │   │   │   ├── 📁 slices
│   │   │   │   └── 📄 store.ts
│   │   │   ├── 📄 main.tsx
│   │   │   └── 🎨 styles.css
│   │   ├── ⚙️ .eslintrc.json
│   │   ├── 🌐 index.html
│   │   ├── 📄 postcss.config.js
│   │   ├── ⚙️ project.json
│   │   ├── 📄 tailwind.config.js
│   │   ├── ⚙️ tsconfig.app.json
│   │   ├── ⚙️ tsconfig.json
│   │   ├── ⚙️ tsconfig.spec.json
│   │   └── 📄 vite.config.ts
│   └── 📁 server
│       ├── 📁 src
│       │   ├── 📁 app
│       │   │   └── 📄 app.module.ts
│       │   ├── 📁 assets
│       │   │   └── ⚙️ .gitkeep
│       │   ├── 📁 common
│       │   │   ├── 📁 decorators
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 public.decorator.ts
│       │   │   │   └── 📄 user.decorator.ts
│       │   │   ├── 📁 exceptions
│       │   │   │   ├── 📄 forbidden-game.exception.ts
│       │   │   │   ├── 📄 forbidden-nonogram.exception.ts
│       │   │   │   ├── 📄 forbidden-user.exception.ts
│       │   │   │   ├── 📄 global-leaders.exception.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 nonogram-leaders.exception.ts
│       │   │   │   ├── 📄 user-already-exists.exception.ts
│       │   │   │   └── 📄 user-not-fount.exception.ts
│       │   │   └── 📄 index.ts
│       │   ├── 📁 modules
│       │   │   ├── 📁 auth
│       │   │   │   ├── 📄 auth.controller.ts
│       │   │   │   ├── 📄 auth.guard.ts
│       │   │   │   ├── 📄 auth.module.ts
│       │   │   │   ├── 📄 auth.service.ts
│       │   │   │   └── 📄 index.ts
│       │   │   ├── 📁 game
│       │   │   │   ├── 📁 entity
│       │   │   │   │   └── 📄 game.entity.ts
│       │   │   │   ├── 📄 game.controller.ts
│       │   │   │   ├── 📄 game.module.ts
│       │   │   │   ├── 📄 game.service.ts
│       │   │   │   └── 📄 index.ts
│       │   │   ├── 📁 nonogram
│       │   │   │   ├── 📁 entity
│       │   │   │   │   └── 📄 nonogram.entity.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 nonogram.controller.ts
│       │   │   │   ├── 📄 nonogram.module.ts
│       │   │   │   └── 📄 nonogram.service.ts
│       │   │   ├── 📁 user
│       │   │   │   ├── 📁 entity
│       │   │   │   │   └── 📄 user.entity.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 user.controller.ts
│       │   │   │   ├── 📄 user.module.ts
│       │   │   │   └── 📄 user.service.ts
│       │   │   └── 📄 index.ts
│       │   ├── 📁 utils
│       │   │   ├── 📄 http-exception.filter.ts
│       │   │   └── 📄 index.ts
│       │   └── 📄 main.ts
│       ├── ⚙️ .eslintrc.json
│       ├── ⚙️ project.json
│       ├── ⚙️ tsconfig.app.json
│       ├── ⚙️ tsconfig.json
│       ├── ⚙️ tsconfig.spec.json
│       └── 📄 webpack.config.js
├── 📁 libs
│   └── 📁 types
│       ├── 📁 src
│       │   ├── 📁 lib
│       │   │   ├── 📁 db-schemas
│       │   │   │   ├── 📄 game.type.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 nonogram.type.ts
│       │   │   │   └── 📄 user.type.ts
│       │   │   ├── 📁 enums
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 nonogram-difficulty.enum.ts
│       │   │   │   └── 📄 tile-states.enum.ts
│       │   │   └── 📁 types
│       │   │       ├── 📄 check-and-update-in-progress-nonogram.type.ts
│       │   │       ├── 📄 create-nonogram-request.dto.ts
│       │   │       ├── 📄 games-for-each-nonogram.type.ts
│       │   │       ├── 📄 generate-nonogram-dto.type.ts
│       │   │       ├── 📄 generated-nonogram-response-dto.type.ts
│       │   │       ├── 📄 index.ts
│       │   │       ├── 📄 nonogram-response-dto.type.ts
│       │   │       ├── 📄 user-response-dto.type.ts
│       │   │       └── 📄 user-sign-in-dto.type.ts
│       │   └── 📄 index.ts
│       ├── ⚙️ .eslintrc.json
│       ├── ⚙️ project.json
│       ├── ⚙️ tsconfig.json
│       ├── ⚙️ tsconfig.lib.json
│       └── ⚙️ tsconfig.spec.json
├── ⚙️ .editorconfig
├── ⚙️ .eslintignore
├── ⚙️ .eslintrc.json
├── ⚙️ .gitignore
├── ⚙️ .prettierignore
├── ⚙️ .prettierrc
├── 📝 README.md
├── ⚙️ nx.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ tsconfig.base.json
└── 📄 vitest.workspace.ts
```
