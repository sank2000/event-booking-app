require('dotenv').config();

const express = require('express');
const Logger = require('js-logger');
const cors = require('cors');
const mongoose = require('mongoose');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');

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
    schema: buildSchema(`

        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
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
