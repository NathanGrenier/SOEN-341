# SOEN-341_SiteName
TODO

## Development

Start the development server by running:

```sh
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

| VAR                   | DESC                                                     | DEFAULT                                               |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| EXEC_ENV              | The runtime environment                                  | `localhost`                                           |
| FAKE_AUTH_PASSWORD    | The password that is required on the fake login page     | `changeme`                                            |
| SERVER_PORT           | Port the application runs on                             | `3000`                                                |
| USE_FAKE_AUTH         | Set to `true` to bypass Azure authentication             | `true`                                                |


### Tests

Unit tests are run using the [Vitest](https://vitest.dev/) testing framework. We
use [Testcontainers](https://node.testcontainers.org/) to start a MySQL
container for the duration of the test run.

Launch unit tests by running:

```
npm test
```

## Deployment


