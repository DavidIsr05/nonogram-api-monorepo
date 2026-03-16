# nonogram-api-monorepo

## File Tree:

```
├── 📁 .nx
├── 📁 apps
│   ├── 📁 client
│   │   ├── 📁 public
│   │   ├── 📁 src
│   │   │   ├── 📁 assets
│   │   │   │   ├── 📁 images
│   │   │   │   │   ├── 🖼️ bigLogo.svg
│   │   │   │   │   ├── 🖼️ edit.svg
│   │   │   │   │   ├── 🖼️ games.svg
│   │   │   │   │   ├── 🖼️ hint.svg
│   │   │   │   │   ├── 🖼️ imagePlaceholder.svg
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   ├── 🖼️ like.svg
│   │   │   │   │   ├── 🖼️ logo.svg
│   │   │   │   │   ├── 🖼️ mistakes.svg
│   │   │   │   │   ├── 🖼️ plusCreate.svg
│   │   │   │   │   ├── 🖼️ profile.svg
│   │   │   │   │   ├── 🖼️ restart.svg
│   │   │   │   │   ├── 🖼️ save.svg
│   │   │   │   │   ├── 🖼️ star.svg
│   │   │   │   │   ├── 🖼️ timer.svg
│   │   │   │   │   ├── 🖼️ trophy.svg
│   │   │   │   │   └── 🖼️ upload.svg
│   │   │   │   ├── ⚙️ .gitkeep
│   │   │   │   ├── 📄 favicon.ico
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 components
│   │   │   │   ├── 📄 difficulty-filter.tsx
│   │   │   │   ├── 📄 game-selector.tsx
│   │   │   │   ├── 📄 header.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 query-state-components.tsx
│   │   │   ├── 📁 constants
│   │   │   │   ├── 📄 default-nonogram-generate-form.constant.ts
│   │   │   │   ├── 📄 dim-factor-options.constant.ts
│   │   │   │   ├── 📄 http-error-messages.constant.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 leaderboard-values.constant.ts
│   │   │   │   ├── 📄 mistakes-threshold.constant.ts
│   │   │   │   └── 📄 nonogram-size-based-on-difficulty.constant.ts
│   │   │   ├── 📁 lib
│   │   │   ├── 📁 routes
│   │   │   │   ├── 📁 game
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   ├── 📄 board.tsx
│   │   │   │   │   │   ├── 📄 game-board.tsx
│   │   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   │   └── 📄 nonogram-leaderboard.tsx
│   │   │   │   │   ├── 📄 game.tsx
│   │   │   │   │   └── 📄 index.ts
│   │   │   │   ├── 📁 home
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   ├── 📄 create-nonogram-popup.tsx
│   │   │   │   │   │   ├── 📄 global-leaderboard.tsx
│   │   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   │   └── 📄 nonogram-list.tsx
│   │   │   │   │   ├── 📄 home.tsx
│   │   │   │   │   └── 📄 index.ts
│   │   │   │   ├── 📁 landing
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   │   └── 📄 login-form.tsx
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   └── 📄 landing.tsx
│   │   │   │   ├── 📁 not-found
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   └── 📄 not-found.tsx
│   │   │   │   ├── 📁 signup
│   │   │   │   │   ├── 📁 components
│   │   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   │   └── 📄 signup-form.tsx
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   └── 📄 signup.tsx
│   │   │   │   └── 📁 user
│   │   │   │       ├── 📁 userGames
│   │   │   │       │   ├── 📁 components
│   │   │   │       │   │   ├── 📄 game-list.tsx
│   │   │   │       │   │   └── 📄 index.ts
│   │   │   │       │   ├── 📄 index.ts
│   │   │   │       │   └── 📄 user-games.tsx
│   │   │   │       ├── 📁 userProfile
│   │   │   │       │   ├── 📁 components
│   │   │   │       │   │   ├── 📄 finished-games.tsx
│   │   │   │       │   │   ├── 📄 index.ts
│   │   │   │       │   │   ├── 📄 user-info.tsx
│   │   │   │       │   │   └── 📄 user-stats.tsx
│   │   │   │       │   ├── 📄 index.ts
│   │   │   │       │   └── 📄 user-profile.tsx
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
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   └── 📄 user.slice.ts
│   │   │   │   └── 📄 store.ts
│   │   │   ├── 📄 main.tsx
│   │   │   ├── 🎨 styles.css
│   │   │   └── 📄 vite-env.d.ts
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
│       │   │   ├── 📁 dtos
│       │   │   │   ├── 📄 auth.dto.ts
│       │   │   │   ├── 📄 game.dto.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 nonogram.dto.ts
│       │   │   │   └── 📄 user.dto.ts
│       │   │   ├── 📁 exceptions
│       │   │   │   ├── 📄 forbidden-game.exception.ts
│       │   │   │   ├── 📄 forbidden-nonogram.exception.ts
│       │   │   │   ├── 📄 forbidden-user.exception.ts
│       │   │   │   ├── 📄 global-leaders.exception.ts
│       │   │   │   ├── 📄 index.ts
│       │   │   │   ├── 📄 liking-unfinished-game.exception.ts
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
│   ├── 📁 types
│   │   ├── 📁 src
│   │   │   ├── 📁 db-schemas
│   │   │   │   ├── 📄 game.type.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 nonogram.type.ts
│   │   │   │   └── 📄 user.type.ts
│   │   │   ├── 📁 enums
│   │   │   │   ├── 📄 game-status.enum.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 nonogram-difficulty.enum.ts
│   │   │   │   └── 📄 tile-states.enum.ts
│   │   │   ├── 📁 types
│   │   │   │   ├── 📄 check-and-update-in-progress-nonogram.type.ts
│   │   │   │   ├── 📄 check-nonogram-response-dto.type.ts
│   │   │   │   ├── 📄 create-nonogram-request.dto.ts
│   │   │   │   ├── 📄 exception.type.ts
│   │   │   │   ├── 📄 finished-games-response.type.ts
│   │   │   │   ├── 📄 game-response-dto.type.ts
│   │   │   │   ├── 📄 game-with-clues-response-dto.type.ts
│   │   │   │   ├── 📄 games-for-each-nonogram.type.ts
│   │   │   │   ├── 📄 generate-nonogram-dto.type.ts
│   │   │   │   ├── 📄 generated-nonogram-response-dto.type.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 nonogram-leaders-response-game-object.type.ts
│   │   │   │   ├── 📄 nonogram-leaders-response.type.ts
│   │   │   │   ├── 📄 nonogram-response-dto.type.ts
│   │   │   │   ├── 📄 user-response-dto.type.ts
│   │   │   │   ├── 📄 user-sign-in-dto.type.ts
│   │   │   │   └── 📄 user-stats.type.ts
│   │   │   └── 📄 index.ts
│   │   ├── ⚙️ .eslintrc.json
│   │   ├── ⚙️ project.json
│   │   ├── ⚙️ tsconfig.json
│   │   ├── ⚙️ tsconfig.lib.json
│   │   └── ⚙️ tsconfig.spec.json
│   └── 📁 ui-kit
│       ├── 📁 src
│       │   ├── 📄 card.tsx
│       │   ├── 📄 carousel.tsx
│       │   ├── 📄 cn.ts
│       │   ├── 📄 index.ts
│       │   ├── 📄 sonner.tsx
│       │   └── 📄 spinner.tsx
│       ├── ⚙️ .eslintrc.json
│       ├── 📝 README.md
│       ├── ⚙️ project.json
│       ├── ⚙️ tsconfig.json
│       └── ⚙️ tsconfig.lib.json
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
