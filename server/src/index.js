const koa = require('koa')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = new koa()
const config = require('./config/config')
//app.use(morgan('combined'))
//app.use(bodyParser.json())
//app.use(cors())

app.use(function* (){
    this.body = `localhost:${config.port}`;
});


app.listen(config.port, function(){
    console.log(`Server running on https://localhost:${config.port}`)
});