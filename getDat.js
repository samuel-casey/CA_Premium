const https = require('https');
const Client = require('pg').Client;
const tidesDataQuery = 'https://tidesandcurrents.noaa.gov/api/datagetter?date=recent&station=8418150&product=water_level&datum=STND&time_zone=gmt&units=english&format=json'
let obj = ''

const client = new Client({
    user: 'postgres',
    password: 'dataBoi',
    host: 'localhost', //this would be a cloud server for ongoing operations
    port: 5432, // port set up in pgadmin
    database: 'testdb'
});

const pullData = (data) => {
    https.get(tidesDataQuery, (resp) => {
        let data = '';

        // A chunk of data has been recieved.a
        resp.on('data', (chunk) => {
            return data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            let parsed = JSON.parse(data)
            let objIndex = 0
            console.log(`obj index (initial): ${objIndex}`)
            let obj = parsed.data[objIndex]
            let valuesList = [obj.v, obj.s, obj.f, obj.q];

            const newRow = () => {
                console.log(obj)
                objList = []

                // for (let j = objIndex; j <= 3; j++) 

                for (let j = objIndex; j <= parsed.data.length; j++) {

                    obj = parsed.data[objIndex]

                    objList[0] = obj.v;
                    objList[1] = obj.s;
                    objList[2] = obj.f;
                    objList[3] = obj.q;
                    console.log(`objList: ${objList}`)

                    objList.map(x => valuesList)

                    objIndex += 1
                    console.log(`obj index (function): ${objIndex}`)

                }
                return valuesList
            }

            client.connect()
                .then(() => client.query("INSERT INTO tide_dat (V_val, S_val, F_val, Q_val) VALUES ($1, $2, $3, $4)", [obj.v, obj.s, obj.f, obj.q]))
                .then(newRow())
                .then(function results(results) { return console.table(results.rows) })
                .catch(e => console.log(e))
                .finally(() => client.end())
            ``


        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

pullData()