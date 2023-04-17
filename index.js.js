const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./connection.js');
const response = require('./response.js');
// const { nanoid } = require('nanoid');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.query('SELECT * from data_ikan', (error, result) => {
    response(200, result, 'get all data from data_ikan', res);
  });
});

app.post('/fishes', (req, res) => {
  // "INSERT INTO `data_ikan`(`id_ikan`, `nama_ikan`, `jenis_ikan`, `berat_ikan`, `tgl_masuk`) VALUES (${id_ikan},{nama_ikan},'$jenis_ikan','$berat_ikan','$tgl_masuk')",
  // const id_ikan = nanoid(8);
  // console.log({ requestFromOutside: req.body });

  const id_ikan = req.body.id_ikan;
  const nama_ikan = req.body.nama_ikan;
  const jenis_ikan = req.body.jenis_ikan;
  const berat_ikan = req.body.berat_ikan;
  const tgl_masuk = new Date().toISOString();
  // const query = `INSERT INTO data_ikan (id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk) VALUES (${id_ikan},${nama_ikan},${jenis_ikan},${berat_ikan},${tgl_masuk})`;
  const query =
    'INSERT INTO data_ikan (id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk) VALUES (?, ?, ?, ?, ?)';
  const values = [id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk];

  db.query(query, values, (error, result) => {
    if (!(id_ikan && nama_ikan && jenis_ikan && berat_ikan)) {
      response(400, null, 'Mohon Diisi semua', res);
    }

    // const exist_id =
    else {
      response(200, result, 'Post data Berhasil', res);
    }
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
