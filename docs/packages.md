> fuzzy can help you create fuzzy packages. Ask it to bundle your extensions, skills, prompt templates, or themes.

# Fuzzy Packages

Fuzzy packages bundle extensions, skills, prompt templates, and themes so you can share them through npm or git. A package can declare resources in `package.json` under the `fuzzy` key, or use conventional directories.

## Table of Contents

- [Install and Manage](#install-and-manage)
- [Package Sources](#package-sources)
- [Creating a Fuzzy Package](#creating-a-fuzzy-package)
- [Package Structure](#package-structure)
- [Dependencies](#dependencies)
- [Package Filtering](#package-filtering)
- [Enable and Disable Resources](#enable-and-disable-resources)
- [Scope and Deduplication](#scope-and-deduplication)

## Install and Manage

> **Security:** Fuzzy packages run with full system access. Extensions execute arbitrary code, and skills can instruct the model to perform any action including running executables. Review source code before installing third-party packages.

```bash
fuzzy install npm:@foo/bar@1.0.0
fuzzy install git:github.com/user/repo@v1
fuzzy install https://github.com/user/repo  # raw URLs work too
fuzzy install /absolute/path/to/package
fuzzy install ./relative/path/to/package

fuzzy remove npm:@foo/bar
fuzzy list    # show installed packages from settings
fuzzy update  # update all non-pinned packages
```

By default, `install` and `remove` write to global settings (`~/.fuzzy/agent/settings.json`). Use `-l` to write to project settings (`.fuzzy/settings.json`) instead. Project settings can be shared with your team, and fuzzy installs any missing packages automatically on startup.

To try a package without installing it, use `--extension` or `-e`. This installs to a temporary directory for the current run only:

```bash
fuzzy -e npm:@foo/bar
fuzzy -e git:github.com/user/repo
```

## Package Sources

Fuzzy accepts three source types in settings and `fuzzy install`.

### npm

```
npm:@scope/pkg@1.2.3
npm:pkg
```

- Versioned specs are pinned and skipped by `fuzzy update`.
- Global installs use `npm install -g`.
- Project installs go under `.fuzzy/npm/`.

### git

```
git:github.com/user/repo@v1
git:git@github.com:user/repo@v1
https://github.com/user/repo@v1
ssh://git@github.com/user/repo@v1
```

- Without `git:` prefix, only protocol URLs are accepted (`https://`, `http://`, `ssh://`, `git://`).
- With `git:` prefix, shorthand formats are accepted, including `github.com/user/repo` and `git@github.com:user/repo`.
- HTTPS and SSH URLs are both supported.
- SSH URLs use your configured SSH keys automatically (respects `~/.ssh/config`).
- For non-interactive runs (for example CI), you can set `GIT_TERMINAL_PROMPT=0` to disable credential prompts and set `GIT_SSH_COMMAND` (for example `ssh -o BatchMode=yes -o ConnectTimeout=5`) to fail fast.
- Refs pin the package and skip `fuzzy update`.
- Cloned to `~/.fuzzy/agent/git/<host>/<path>` (global) or `.fuzzy/git/<host>/<path>` (project).
- Runs `npm install` after clone or pull if `package.json` exists.

**SSH examples:**
```bash
# git@host:path shorthand (requires git: prefix)
fuzzy install git:git@github.com:user/repo

# ssh:// protocol format
fuzzy install ssh://git@github.com/user/repo

# With version ref
fuzzy install git:git@github.com:user/repo@v1.0.0
```

### Local Paths

```
/absolute/path/to/package
./relative/path/to/package
```

Local paths point to files or directories on disk and are added to settings without copying. Relative paths are resolved against the settings file they appear in. If the path is a file, it loads as a single extension. If it is a directory, fuzzy loads resources using package rules.

## Creating a Fuzzy Package

Add a `fuzzy` manifest to `package.json` or use conventional directories. Include the `fuzzy-package` keyword for discoverability.

```json
{
  "name": "my-package",
  "keywords": ["fuzzy-package"],
  "fuzzy": {
    "extensions": ["./extensions"],
    "skills": ["./skills"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

Paths are relative to the package root. Arrays support glob patterns and `!exclusions`.

### Gallery Metadata

The [package gallery](https://shittycodingagent.ai/packages) displays packages tagged with `fuzzy-package`. Add `video` or `image` fields to show a preview:

```json
{
  "name": "my-package",
  "keywords": ["fuzzy-package"],
  "fuzzy": {
    "extensions": ["./extensions"],
    "video": "https://example.com/demo.mp4",
    "image": "https://example.com/screenshot.png"
  }
}
```

- **video**: MP4 only. On desktop, autoplays on hover. Clicking opens a fullscreen player.
- **image**: PNG, JPEG, GIF, or WebP. Displayed as a static preview.

If both are set, video takes precedence.

## Package Structure

### Convention Directories

If no `fuzzy` manifest is present, fuzzy auto-discovers resources from these directories:

- `extensions/` loads `.ts` and `.js` files
- `skills/` recursively finds `SKILL.md` folders and loads top-level `.md` files as skills
- `prompts/` loads `.md` files
- `themes/` loads `.json` files

## Dependencies

Third party runtime dependencies belong in `dependencies` in `package.json`. Dependencies that do not register extensions, skills, prompt templates, or themes also belong in `dependencies`. When fuzzy installs a package from npm or git, it runs `npm install`, so those dependencies are installed automatically.

Fuzzy bundles core packages for extensions and skills. If you import any of these, list them in `peerDependencies` with a `"*"` range and do not bundle them: `@fuzzyos/fuzzy-ai`, `@fuzzyos/fuzzy-agent`, `@fuzzyos/fuzzy-code`, `@fuzzyos/fuzzy-tui`, `@sinclair/typebox`.

Other fuzzy packages must be bundled in your tarball. Add them to `dependencies` and `bundledDependencies`, then reference their resources through `node_modules/` paths. Fuzzy loads packages with separate module roots, so separate installs do not collide or share modules.

Example:

```json
{
  "dependencies": {
    "shitty-extensions": "^1.0.1"
  },
  "bundledDependencies": ["shitty-extensions"],
  "fuzzy": {
    "extensions": ["extensions", "node_modules/shitty-extensions/extensions"],
    "skills": ["skills", "node_modules/shitty-extensions/skills"]
  }
}
```

## Package Filtering

Filter what a package loads using the object form in settings:

```json
{
  "packages": [
    "npm:simple-pkg",
    {
      "source": "npm:my-package",
      "extensions": ["extensions/*.ts", "!extensions/legacy.ts"],
      "skills": [],
      "prompts": ["prompts/review.md"],
      "themes": ["+themes/legacy.json"]
    }
  ]
}
```

`+path` and `-path` are exact paths relative to the package root.

- Omit a key to load all of that type.
- Use `[]` to load none of that type.
- `!pattern` excludes matches.
- `+path` force-includes an exact path.
- `-path` force-excludes an exact path.
- Filters layer on top of the manifest. They narrow down what is already allowed.

## Enable and Disable Resources

Use `fuzzy config` to enable or disable extensions, skills, prompt templates, and themes from installed packages and local directories. Works for both global (`~/.fuzzy/agent`) and project (`.fuzzy/`) scopes.

## Scope and Deduplication

Packages can appear in both global and project settings. If the same package appears in both, the project entry wins. Identity is determined by:

- npm: package name
- git: repository URL without ref
- local: resolved absolute path
