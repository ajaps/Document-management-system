import express from 'express';

const app = express();


app.set('port', process.env.PORT || 3004);

app.get('*', (request, response) => {
  response.status(200).json({});
});

app.listen(app.get('port'), () => {
});

module.exports = app;

