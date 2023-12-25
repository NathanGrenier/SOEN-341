# SOEN-341

TODO

## Development

### VSCode Setup

1. Install the `Svelte for VS Code` and `Svelte Intellisense` VSCode Extensions
2. Install the `Tailwind CSS InteliSense` VSCode Extension
3. Install the `Prettier` VSCode Extension
4. Configure Prettier to format on save in VSCode's settings
5. Add this configuration to you VSCode settings.json file (accesible through
   settings)

```json
   "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
```

6. Another useful extension for live collaboration is `Live Share`

### Starting the Dev Environment

Once you've created a project and
installed dependencies with `npm install`, start a
development server by running:

```bash
npm run dev
```

### Environment Variables

Secrets and other configuration values are managed through environment
variables. When developing locally, they can be configured by creating a `.env`
file in the project root folder.

> **Note**: Default values should be optimized for local development, such that
> a developer can clone and run the project successfully without having to
> override any configuration values.

The following variables can be configured:

| VAR                | DESC                                                 | DEFAULT     |
| ------------------ | ---------------------------------------------------- | ----------- |
| EXEC_ENV           | The runtime environment                              | `localhost` |
| FAKE_AUTH_PASSWORD | The password that is required on the fake login page | `changeme`  |
| SERVER_PORT        | Port the application runs on                         | `3000`      |
| USE_FAKE_AUTH      | Set to `true` to bypass Azure authentication         | `true`      |

### Tests

Unit tests are run using the [Vitest](https://vitest.dev/) testing framework. We
use [Testcontainers](https://node.testcontainers.org/) to start a MySQL
container for the duration of the test run.

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

> To deploy your app, you may need to install an
> [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
