# SOEN-341

| Environment | Status                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production  | [![Deploy Production](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-production.yml)       |
| Develop     | [![Deploy Develop](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-develop.yml/badge.svg?branch=develop)](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-develop.yml) |

- [SOEN-341](#soen-341)
  - [Development](#development)
    - [VSCode Setup](#vscode-setup)
    - [Installing Docker](#installing-docker)
    - [Environment Variables](#environment-variables)
    - [Starting the Dev Environment](#starting-the-dev-environment)
    - [Prisma](#prisma)
      - [Prototype Database Change:](#prototype-database-change)
      - [Create Database Migration:](#create-database-migration)
      - [Exploring the Database in Development:](#exploring-the-database-in-development)
    - [Tests](#tests)
    - [Before Merging](#before-merging)
  - [Building](#building)
  - [Deployment](#deployment)

TODO: Add project description

## Development

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### VSCode Setup

1. Install the `Svelte for VS Code` and `Svelte Intellisense` VSCode Extensions
2. Install the `Prisma` VSCode Extension
3. Install the `Tailwind CSS InteliSense` VSCode Extension
4. Install the `Prettier` VSCode Extension
5. Configure Prettier to format on save in VSCode's settings
6. Add this configuration to you VSCode settings.json file (accessible through
   settings)

```json
   "editor.formatOnSave": true,
   "[svelte]": {
      "editor.defaultFormatter": "svelte.svelte-vscode"
   },
   "[prisma]": {
      "editor.defaultFormatter": "Prisma.prisma"
   },
```

6. Another useful extension for live collaboration is `Live Share`

### Installing Docker

A docker container is used in development to create a dev database. You'll need
to [install](https://docs.docker.com/desktop/install/windows-install/) docker on
your computer to be able to use the necessary commands.

### Environment Variables

Secrets and other configuration values are managed through environment
variables. When developing locally, they can be configured by creating a `.env`
file in the project root folder.

> **Note**: Default values should be optimized for local development, such that
> a developer can clone and run the project successfully without having to
> override any configuration values.

The following variables can be configured:

| VAR                 | DESC                                                 | DEFAULT                                                                                 |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| DB_HOST             | The dev database host                                | `localhost`                                                                             |
| DB_USER             | The dev database username                            | `devuser`                                                                               |
| DB_PASSWORD         | The dev database password                            | `supersecret`                                                                           |
| DB_NAME             | The dev database name                                | `devdb`                                                                                 |
| DB_PORT             | The dev database port                                | `5432`                                                                                  |
| DATABASE_URL        | The database URL (used by Prisma)                    | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| DIRECT_DATABASE_URL | Used in development environment to keep Prisma happy | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| FAKE_AUTH_PASSWORD  | The password that is required on the fake login page | `changeme`                                                                              |
| USE_FAKE_AUTH       | Set to `true` to bypass authentication               | `true`                                                                                  |
| EXEC_ENV            | Current execution environment                        | `development`                                                                           |

### Starting the Dev Environment

Use
[nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
to install the proper version of node for the project (can be found in
`package.json` in the `engines` object):

```bash
nvm install 18
```

Install the node dependencies:

```bash
npm install
```

Use docker compose to start the development database:

```bash
docker compose up

# or run the docker container in detached mode (runs in the background)
docker compose up -d
```

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Prisma

#### Prototype Database Change:

To prototype a change to the Prisma schema and sync the modification with your
development database, use the following command:

```bash
npx prisma db push
```

#### Create Database Migration:

When the Prisma schema is in a stable condition (in the desired state), create a
[migration](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) file
with:

```bash
prisma migrate dev
```

This migration file can then be used to update the databases in other
environments (preview, production).

For more detail, visit the
[Prisma Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)
on the topic.

#### Exploring the Database in Development:

If you want to see a visual representation of the database, use the
[Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio) tool by
running:

```bash
npx prisma studio
```

### Tests

Unit tests are run using the [Vitest](https://vitest.dev/) testing framework.

Launch unit tests by running:

```
npm test
```

### Before Merging

Before you created a merge request, make sure that your code is properly
formatted and linted using the following npm commands (located in `package.json`
under scripts):

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

A preview environment is created whenever a pull request is created and the
preliminary tests have passed. This can be used to review any changed made in a
production like environment.

Once the pull request is merged, a GitHub action will automatically deploy the
application to [production](https://soen-341.vercel.app/).
