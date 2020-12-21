require('dotenv').config();

const express = require('express');
const Logger = require('js-logger');
const cors = require('cors');

const app = express();
const port = Number(process.env.PORT);

Logger.useDefaults();

// Show all logs when in development, only Warnings and errors in production
Logger.setLevel(
  process.env.NODE_ENV === 'production' ? Logger.ERROR : Logger.DEBUG
);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('working');
});

// listen to port
app.listen(port, () => {
  Logger.info(`Server started at port ${port}.`);
});
