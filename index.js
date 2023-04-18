const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./connection.js');
const response = require('./response.js');
const { nanoid } = require('nanoid');
// import { nanoid } from "nanoid";

app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.query('SELECT * from data_ikan ORDER BY nama_ikan', (error, result) => {
    response(200, result, 'get all data from data_ikan', res);
  });
});

app.post('/fishes', (req, res) => {
  // "INSERT INTO `data_ikan`(`id_ikan`, `nama_ikan`, `jenis_ikan`, `berat_ikan`, `tgl_masuk`) VALUES (${id_ikan},{nama_ikan},'$jenis_ikan','$berat_ikan','$tgl_masuk')",
  const id_ikan = nanoid(8);
  // console.log({ requestFromOutside: req.body });

  // const id_ikan = req.body.id_ikan;
  const nama_ikan = req.body.nama_ikan;
  const jenis_ikan = req.body.jenis_ikan;
  const berat_ikan = req.body.berat_ikan;
  const tgl_masuk = new Date().toISOString();
  // const query = `INSERT INTO data_ikan (id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk) VALUES (${id_ikan},${nama_ikan},${jenis_ikan},${berat_ikan},${tgl_masuk})`;
  const query =
    'INSERT INTO data_ikan (id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk) VALUES (?, ?, ?, ?, ?)';
  const values = [id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk];

  db.query(query, values, (error, result) => {
    if (!(nama_ikan && jenis_ikan && berat_ikan)) {
      response(400, null, 'Mohon Diisi semua', res);
    }
    // const exist_id =
    else {
      response(200, result, `Post data ${nama_ikan}  Berhasil`, res);
    }
  });
});
app.get('/fishes/:nama_ikan', (req, res) => {
  const name = req.params.nama_ikan;
  // console.log({ test: name });
  // res.send(`Data: ${name}`);
  // response(200, 'get data', `Get data by spesific name ${name}`, res);
  const query = `SELECT * from data_ikan where nama_ikan ="${name}" `;
  db.query(query, (error, result) => {
    response(200, result, `Get data by spesific name ${name}`, res);
  });
});

app.put('/fishesUpt', (req, res) => {
  const { idIkan, namaIkan, jenisIkan, beratIkan } = req.body;
  const query = `UPDATE data_ikan SET nama_ikan = '${namaIkan}', jenis_ikan = '${jenisIkan}', berat_ikan = '${beratIkan}' WHERE id_ikan = '${idIkan}'`
  db.query(query, (error, result) => {
    response(200, result, `Get data ${idIkan}`, res);
  });
});


app.get('/hello', (req, res) => {
  console.log({ urlParam: req.query });
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  console.log({ requestFromOutside: req.body });
  res.send('login berhasil');
});

app.put('/username', (req, res) => {
  console.log({ updateData: req.body });
  res.send('berhasil');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
