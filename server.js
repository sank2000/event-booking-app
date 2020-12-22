require('dotenv').config();

const express = require('express');
const Logger = require('js-logger');
const cors = require('cors');
const mongoose = require('mongoose');

const { graphqlHTTP } = require('express-graphql');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const app = express();
const port = Number(process.env.PORT);

Logger.useDefaults();

// Show all logs when in development, only Warnings and errors in production
Logger.setLevel(process.env.NODE_ENV === 'production' ? Logger.ERROR : Logger.DEBUG);

app.use(express.json());
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    // listen to port
    app.listen(port, () => {
      Logger.info(`Server started at port ${port}.`);
    });
  })
  .catch(err => {
    Logger.error(err);
  });
