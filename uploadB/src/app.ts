
import express, { response } from 'express';
const cors = require('cors')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
let mysql = require("mysql");


const app = express();
app.use(cors())
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json ({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello am taking care of apis!');

});


let file ={
  fileName:'',
  size:0,
  uploadedDate:''
}


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

    const execute = async (query) => {
      try {
        await connection.query(query);
        return true;
      } catch (error) {
        console.error(error.stack);
        return false;
      }
    };

  execute(query).then((result) => {
  if (result) {
    console.log("Table created");
  }
  });


const date =()=>{
  return new Date;
}



app.post("/add", async (req, res) => {
try {
    const sql="INSERT INTO filestbl (size, uploaddate,filename) VALUES (?)";
    let values = [req.body.size, date(), req.body.name];
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
	return res.json({ status: "ok", results: { name: req.body.name,size: req.body.size,date:date()} });
} catch (error) {
  return error;
}
	
});


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
  } catch (error) {
    console.log(error)
  }
}

app.get("/getFiles", async function(req, res) {
   const result = await getAll();
   res.send(result);
   console.log(result);
});

app.delete("/remove/:id", (req ,res) => {
 
  try {
    const text = `DELETE FROM filestbl WHERE filename = ?`;
    const values = [req.params.id];
    console.log(values);
    res.json({status:'ok',result:'deleted'+req.params.id});
    return connection.query(text, values);
  } catch (error) {
   console.log(error);
  }
})


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
