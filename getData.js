// this file will take data from the API tidesDataQuery and upload it to the pg table tableone
// in order for this to work, we'll make a call to the API first, and then write the Data to the database
const https = require('https');
const Client = require('pg').Client;
const tidesDataQuery = 'https://tidesandcurrents.noaa.gov/api/datagetter?date=latest&station=8418150&product=water_level&datum=STND&time_zone=gmt&units=english&format=json'

const pullData = (data) => {
    https.get(tidesDataQuery, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            let parsed = JSON.parse(data);
            console.log(parsed);
            return parsed
            return data
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};



const client = new Client({
    user: 'postgres',
    password: 'dataBoi',
    host: 'localhost', //this would be a cloud server for ongoing operations
    port: 5432, // port set up in pgadmin
    database: 'testdb'
});

const writeData = (data) => {
    setTimeout(
        client.connect(data)
        .then(() => console.log('connected successfully'))
        .then(() => client.query("INSERT INTO tableone (col1, col2) VALUES ('fifth', 5)"))
        .then(() => client.query("SELECT * FROM tableone"))
        .then(results => console.table(results.rows))
        .catch(e => console.log('error'))
        .finally((data) => {
            client.end()
            return data
        }), 2000);
};




// write data to the database and then view it in the console
// function writeData() {
//     client.connect()
//         .then(() => console.log('connected successfully'))
//         // .then(() => client.query("INSERT INTO tableone (col1, col2) VALUES ('fifth', 5)"))
//         .then(() => client.query("SELECT * FROM tableone"))
//         .then(results => console.table(results.rows))
//         .catch(e => console.log('error'))
//         .finally(() => client.end())
// };


const update = new Promise((resolve, reject) => {
    if (tidesDataQuery) {
        resolve(console.log("update promise resolved"));
    } else {
        reject(console.log("update promise rejected"));
    }
});

data = ''

update
    .then(pullData(data))
    .catch(e => console.log('error pulling data in last section'))
    .then(() => writeData())
    .catch(e => console.log('error writing data in last section'));