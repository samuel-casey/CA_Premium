const https = require('https');
const Client = require('pg').Client;
const tidesDataQuery = 'https://tidesandcurrents.noaa.gov/api/datagetter?date=recent&station=8443970&product=water_level&datum=STND&time_zone=gmt&units=english&format=JSON'
let obj = ''
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require("csv-parse")

// station IDs
// PORTLAND 8418150
// BRIDGEPORT 8467150 
// BOSTON 8443970

// const client = new Client({
//     user: 'postgres',
//     password: 'dataBoi',
//     host: 'localhost', //this would be a cloud server for ongoing operations
//     port: 5432, // port set up in pgadmin
//     database: 'testdb'
// });

const pullData = (data) => {
    https.get(tidesDataQuery, (resp) => {
        let data = '';

        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // parsed is a JS object with two properties: metadata, data
            let parsed = JSON.parse(data)
            console.log(parsed)

            // 
            const toCsvFile = function() {
                for (let objIndex = 0; objIndex <= 3; objIndex++) {
                    let obj = parsed.data[objIndex]
                }
                console.log(obj)
                const csvWriter = createCsvWriter({
                    path: 'C:\\CA_Premium\\tides_vis\\asyncDat.csv',
                    header: [
                        { id: 'Date Time', title: 'DATE TIME' },
                        { id: 'Water Level', title: 'WATER LEVEL' },
                        { id: 'Sigma', title: 'SIGMA' },
                        { id: 'O or I (for verified)', title: 'O OR I (FOR VERIFIED)' },
                        { id: 'F', title: 'F' },
                        { id: 'R', title: 'R' },
                        { id: 'L', title: 'L' },
                        { id: 'Quality', title: 'QUALITY' }
                    ]
                });

                for (let j = 0; j <= 2; j, j++) {
                    objIndex = 0
                    console.log(obj.t)

                    function records() {
                        recordsList = []
                        for (var object = objIndex; object in parsed.data; object++) {
                            return recordsList.push(object), console.log(recordsList)

                            //     for (const property in obj) {
                            //         console.log(`${property}: ${obj[property]}`);
                            //     };
                            // };
                        };

                        //     csvWriter.writeRecords(records)
                        //         .then(() => {
                        //             console.log(`obj before incrementing index: ${obj.t}`)
                        //             objIndex += 1
                        //             console.log(`Record: ${j} written to csv.`);
                        //             console.log(`Object index: ${objIndex}`);
                        //             console.log(obj)
                        //         })
                        //         .then(() => console.log(`second obj is: ${[obj.t, obj.v, obj.f, obj.q]}`))
                        //         .catch(e => console.log(e));
                        // }
                        // }

                    }
                    records()
                }
            }

            toCsvFile()


        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });
};


pullData()


// async function end() {
//     try {
//         await client.connect()
//         console.log('Connected to client.')
//         await client.query("INSERT INTO async_dat (time, v_val, s_val, f_val, q_val) VALUES ($1, $2, $3, $4, $5)", [obj.t, obj.v, obj.s, obj.f, obj.q])
//         console.log('inserted first row into async_dat')
//         newRow()
//         await client.query("INSERT INTO async_dat (time, v_val, s_val, f_val, q_val) VALUES ($1, $2, $3, $4, $5)", [obj.t, obj.v, obj.s, obj.f, obj.q])
//         const results = await client.query("SELECT * FROM async_dat")
//         console.table(results.rows)

//     } catch (ex) {
//         console.log(`
// Error: $ { ex }
// `)
//         //     } finally {
//         //         await client.end()
//         //         console.log('Disconnected.')
//         //     }
//         // };