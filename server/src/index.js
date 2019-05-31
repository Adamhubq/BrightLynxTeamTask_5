//в проекте много пакетов установлено, пытался сделать каталоги через koa-route и построить работу через на axios
// но с нодой не знаком, поэтому не выходит, удалось только структуру какую-то построить опираясь 
// на url и пушить html файлы в body.
// верстки нет так как работал и искал решение для серверной части
const config = require('./config/config')
const koa = require('koa')
const koa_route = require('koa-route');
const session = require('koa-session');
const fs = require('fs');
const app = new koa();
const { Pool, Client } = require('pg');
const connectionString = 'postgres://zhalbzxz:f1cuTjVuZqLw3RRV63jZkfSPghA8bMgI@raja.db.elephantsql.com:5432/zhalbzxz';
const bodyParser = require("koa-bodyparser"); //обычны body-parser не понял как под коа юзать использовал этот
const bcrypt = require('bcrypt');
// создаем парсер для данных application/x-www-form-urlencoded

app.use(bodyParser());



function setNewUser(objectParam) { //записываем нового юзера 
    const pool = new Pool({
        connectionString: connectionString,
    });
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    });
    const client = new Client({
        connectionString: connectionString,
    });
    client.connect();
    let now = new Date();
    let date = now.getFullYear() + ' ' + now.getMonth() + ' ' + now.getDate();
    let hash = bcrypt.hashSync(objectParam.pass, 10);
    //let querySQL = `INSERT INTO USERS (UserName, userLogin, AutorizeDate, UserPassword)\n` +
      //  `VALUES (`${objectParam.name}`,`${objectParam.login}`,`${date}`, `${hash}`)`;
    let querySQL = `INSERT INTO USERS (UserName, userLogin, AutorizeDate, UserPassword) VALUES ('${objectParam.name}', '${objectParam.Login}','${date}', '${hash}')`;
    const query = client.query(querySQL);
    client.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        client.end()
    });
}


// этот блок для работы с сессией
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

// подключаем html файлы
const header = () => {
    return fs.readFileSync('header.html', 'utf-8')
};
const form = () => {
    return fs.readFileSync('config/form.html', 'utf-8');
};
const styles = () => {
    return '<style>' + fs.readFileSync('style.css', 'utf-8') + '</style>';
};
const footer = () => {
    return fs.readFileSync('footer.html', 'utf-8');
};

function *setACookie() {
    this.cookie.set('foo', 'bar', {httpOnly: false});
}

app.use(function* (){ 

    console.log(this.cookie);
    this.body = header();
    this.body += styles();
    if (!!this.session && this.session.views && this.session.views.login){
        this.body += `<script>sessionStorage.setItem('userName',
        ${JSON.stringify(this.session.views.login)}
    )</script>`;
    };

    if (!!this.session && this.session.views && this.session.views.login) {

        this.body += `<script>sessionStorage.setItem('table',
        ${JSON.stringify(this.session)})</script>`;

        this.body += `<script>console.log(JSON.parse(${JSON.stringify(this.session)}))</script>`;
    }
     switch(this.url) {
        case '/avtorizate': 
            //this.body += formAut();
        case '/pushData/':
            setNewUser(this.request.body);
            this.session.views = {};
            this.session.views.login = '';
            this.session.views.login = this.request.body.login;
            this.redirect('/');
        case '/registration' :
            this.body += form();
    //     case '/tab-user/':  // с этим блоком возникли проблемы, которые уже решить не смог
    //         const pool = new Pool({ // не мог разобраться с отработкой колбека
    //             connectionString: connectionString,
    //         });
    //         pool.query('SELECT * FROM users', (err, res) => { // пытался и в сессию и в глобал отправить таблицу
    //                                                         // но не выходит. в терминале данные приходят, 
    //                                                         //все пользователи отображаются, но никак не могу их запушить на страницу
    //             if (!global.table){
    //                 global.table = JSON.stringify(res.rows[0]);
    //             }
    //             console.log(global.table);
    //             pool.end()
    //         });
    //         const client = new Client({
    //             connectionString: connectionString,
    //         });
    //         client.query('SELECT * FROM users', (err, res) => {

    //             client.end()
    //         });
     }
    

    this.body += footer();
});


app.listen(config.port, function(){
    console.log(`Server running on https://localhost:${config.port}`)
});