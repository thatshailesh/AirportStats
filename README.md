# Airport Stats

Express.js Application to parse CSV and provide aggregated stats

## Getting Started
-------------
> **Note:**

Using Node.js v6.11.0

Install dependencies:
```
npm install
```
## Quick Start
Start the server:
```
npm start
```

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [event-stream](https://github.com/dominictarr/event-stream) -  EventStream is a toolkit to make creating and working with streams easy.


## Application Structure

- `server.js` - The entry point to our application. This file defines our express server. It also requires the routes we'll be using in the application.
- `config/` - This folder contains configuration for filename as well as a central location for configuration/environment variables.
- `lib/endpoints` - This folder contains the route definitions for our API.


## Endpoints

#### GET: api/all/stats

```sh
returns: a collection of all airports stats,
the collection should be ordered by the count of reviews

each item in the collection should have the following information:

• names of the airport

• count of reviews in system
```

#### GET: api/[airport]/stats

```sh
[airport] as unique identifier returns: stats for a

specific airport:

• airport name,

• count of reviews,

• average “overall_rating”

• count of recommendations “recommended”
```

#### GET: api/[airport]/reviews

```sh
[airport] as unique identifier

returns: a collection of reviews for the given airport

the collection should be ordered by “date”, so the latest review is

returned as first element each review in the collection should have

the following information:

• overall_rating

• recommendation - date

• author_country

• content
```