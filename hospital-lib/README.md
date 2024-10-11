# Hospital Simulator

## Project Structure

[Your existing project structure description]

## Getting Started

1. Clone the repository
2. Run `yarn install` to install dependencies
3. Run `yarn test` to run the Alsatian test suite
4. Run `yarn test:jest` to run the Jest test suite
5. Run `yarn lint` to lint the code
6. Run `yarn build:prod` to build the project for production

### Available Scripts

- `yarn build:vite`: Build the project with Vite
- `yarn build:dev`: Build the project in development mode
- `yarn build:prod`: Build the project in production mode
- `yarn test`: Run Alsatian tests
- `yarn test:jest`: Run Jest tests
- `yarn test:watch`: Run Jest tests in watch mode (useful during development)
- `yarn lint`: Lint the code
- `yarn format`: Format the code using Prettier

## Bundlers

This project uses two bundlers:

1. **Webpack**: Used for production builds and is the established bundler for this project.
2. **Vite**: Introduced for rapid development and as an alternative build tool.

During development, you can use `yarn dev` to start the Vite dev server, which offers fast rebuilds and quick startup times.

## Testing

This project uses two testing frameworks:

1. **Alsatian**: Used for some specific tests. Run with `yarn test`.
2. **Jest**: Used for additional tests. Run with `yarn test:jest`.

During development, you can use `yarn test:watch` to run Jest tests in watch mode, which will re-run relevant tests automatically when you make changes to the code.

## License

MIT