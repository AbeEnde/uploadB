"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
let mysql = require("mysql");
const fs = require("fs");
const app = (0, express_1.default)();
app.use(cors());
app.use(fileupload());
app.use(express_1.default.static("files"));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001;
app.get('/', (req, res) => {
    res.send('Hello am taking care of apis!');
});
let file = {
    fileName: '',
    size: 0,
    uploadedDate: ''
};
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssw0rd",
    database: "uploaddb",
});
connection.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});
const query = `
    CREATE TABLE IF NOT EXISTS filestbl (
	    size varchar(300),
	    uploaddate date,
	    filename VARCHAR(300) 
    );`;
const execute = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection.query(query);
        return true;
    }
    catch (error) {
        console.error(error.stack);
        return false;
    }
});
execute(query).then((result) => {
    if (result) {
        console.log("Table created");
    }
});
const date = () => {
    return new Date;
};
app.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = "INSERT INTO filestbl (size, uploaddate,filename) VALUES (?)";
        let values = [req.body.size, date(), req.body.name];
        connection.query(sql, [values], function (err, result) {
            if (err)
                throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
        return res.json({ status: "ok", results: { name: req.body.name, size: req.body.size, date: date() } });
    }
    catch (error) {
        return error;
    }
}));
const getAll = () => {
    try {
        const sql = "SELECT * FROM filestbl";
        return new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
app.get("/getFiles", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getAll();
        res.send(result);
        console.log(result);
    });
});
// app.get("/getFileList",getAll);
app.delete("/remove/:id", (req, res) => {
    try {
        const text = `DELETE FROM filestbl WHERE filename = ?`;
        const values = [req.params.id];
        console.log(values);
        res.json({ status: 'ok', result: 'deleted' + req.params.id });
        return connection.query(text, values);
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map