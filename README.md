# PiktID Assignment: Face Swap UI/UX
This repo contains a React-based webapp which communicates with PiktID's APIs through REST. Authentication is also handled internally.

### Running the code
The frontend can be brought online in several ways. They will be provided ordered by ease of deployment. To configure environment variables, see the `.env` file at the root of this repo.

#### (1) Docker Compose
This does not offer hot reloading of the code. The app is packaged as it would be for a production environment, with focus on higher performance. Environment variables are automatically loaded from the `.env` file.
```sh
docker compose up

# MacOS only
open http://localhost
```

#### (2) `npm`
Does the whole code hot reload thing, even when configuration or `package.json` are changed. Environment variables are automatically loaded from the `.env` file.
```sh
npm ci
npm start -- --open
```