# @company/platform-ui

Reusable React and TypeScript components maintained by the Platform Team.

## Install from GitHub

```sh
npm install git+https://github.com/MhammedAshfaq/bv-repository.git#v1.1.0
```

The package's `prepare` script builds the distribution when npm installs from Git. The consuming app must have React and React DOM installed because they are peer dependencies.

```tsx
import { RuleManagement, Button, usePermissions } from "@company/platform-ui";
import "@company/platform-ui/styles.css";
```

For a private repository, authenticate Git on the machine or CI runner before installing. Never include a token in the Git URL or commit credentials.

## Local development and package build

```sh
npm ci
npm run build
npm pack
```

The build produces ES module and CommonJS entry points, TypeScript declarations, and CSS in `dist/`. `dist/` is generated during build/install and is intentionally not committed.

## Release a new version

Update the package version in `package.json`, commit and push the source to `main`, and tag that commit. For example:

```sh
git add .
git commit -m "release platform UI 1.1.0"
git push origin main
git tag v1.1.0
git push origin v1.1.0
```

Consuming apps should change the Git dependency to `#v1.1.0` and run `npm install`. This is a Git dependency, not a package published to GitHub Packages or the npm registry.
