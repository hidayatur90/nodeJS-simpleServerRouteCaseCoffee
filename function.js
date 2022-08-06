const mydb = require("./db_con");
const mysql = require("mysql");
const url = require("url");
const http = require("http");

const HOST = "localhost"; 
const PORT = "10000";

const requestListener = function(req, res) {
    const path_name = url.parse(req.url, true).pathname;

    switch (path_name) {
        case "/":
            res.writeHead(200);
            res.end("Backend data kopi");
            break;
    
        case "/get_coffee":
            let query_get = "SELECT * FROM coffee WHERE 1 = 1";
            const params_get = url.parse(req.url, true).query;

            if("id" in params_get) {
                query_get += " AND id = " + mysql.escape(params_get["id"])
            };

            mydb.query(query_get, function(err, result){
                if(err) throw err;
                
                let response_data = {
                    "description" : "Berhasil ambil data",
                    "data" : result
                }

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(response_data));
            });
            break;

        case "/insert_coffee":
            let body_insert = [];
            req.on('data', (chunk) => {
                body_insert.push(chunk)
            }).on('end', () => {
                body_insert = JSON.parse(Buffer.concat(body_insert).toString());

                let name = body_insert["name"];
                let unit_price = body_insert["unit_price"];
                let unit_stock = body_insert["unit_stock"];

                let query_insert = "INSERT INTO coffee(name, unit_price, unit_stock) VALUES(?, ?, ?)";
                let values_insert = [name, unit_price, unit_stock];
                
                mydb.query(query_insert, values_insert, function(err, result) {
                    if(err) throw err;
                    console.log(result);

                    let response_data = {
                        "description" : "Berhasil tambah data",
                        "data" : result
                    };

                    res.setHeader('Content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify(response_data));
                });
            });
            break;
        
        case "/update_coffee":
            let body_update = [];
            req.on('data', (chunk) => {
                body_update.push(chunk);
            }).on('end', () => {
                body_update = JSON.parse(Buffer.concat(body_update).toString());

                let id = body_update["id"];
                let query_update = "UPDATE coffee SET id=id";

                if("name" in body_update) {
                    query_update += " , name=" + mysql.escape(body_update["name"]);
                }

                if("unit_price" in body_update) {
                    query_update += " , unit_price=" + mysql.escape(body_update["unit_price"]);
                }

                if("unit_stock" in body_update) {
                    query_update += " , unit_stock=" + mysql.escape(body_update["unit_stock"]);
                }

                query_update += " WHERE id=" + mysql.escape(id);

                mydb.query(query_update, function(err, result) {
                    if(err) throw err;
                    console.log(result);

                    let response_data = {
                        "description" : "Berhasil update data",
                        "data" : result
                    };

                    res.setHeader('Content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify(response_data));
                });
            });
            break;

        case "/delete_coffee":
            const params_del = url.parse(req.url, true).query;
            let query_delete = "DELETE FROM coffee WHERE id = " + mysql.escape(params_del["id"]);

            mydb.query(query_delete, function(err, result){
                if(err) throw err;

                let response_data = {
                    "description": "Data berhasil di hapus",
                    "data" : result 
                }

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(response_data));
            });
            break;

        default:
            console.log(req.url);
            res.writeHead(404);
            res.end(JSON.stringify({
                error:"API not found"
            }));
            break;
    }
}

const server = http.createServer(requestListener);
server.listen(PORT, HOST, () => {
    console.log(`BASE URL SERVER : http://${HOST}:${PORT}`);
})