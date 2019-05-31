
const connectionString =
    '\tpostgres://zhalbzxz:' +
    'f1cuTjVuZqLw3RRV63jZkfSPghA8bMgI@raja.' +
    'db.elephantsql.com:' +
    '5432/zhalbzxz';
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
let querySQL = 'INSERT INTO USERS ' +
    '(UserName, userLogin, AutorizeDate, UserPassword)\n' +
    'VALUES (\'Ivan\', \'Vanya\', \'26.05.2019\', \'passes\');';

const query = client.query(querySQL);

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
});