import express from 'express';
import path from 'path';

const app = express();


app.set('port', process.env.PORT || 3002);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (request, response) => {
  console.log('hello');
});

app.listen(app.get('port'), () => {
});

module.exports = app;

