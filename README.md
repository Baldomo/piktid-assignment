# PiktID Assignment: Face Swap UI/UX
This repo contains a React-based webapp which communicates with PiktID's APIs through REST. Authentication is also handled internally.

### Running the code
The frontend can be brought online in several ways. They will be provided ordered by ease of deployment

#### (1) Docker Compose
```sh
docker compose up

# MacOS only
open http://localhost
```

#### (2) `npm`
```sh
npm ci
npm start -- --open
```