const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./connection.js');
const response = require('./response.js');
const { nanoid } = require('nanoid');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log({ urlParam: req.query });
  response(200, 'API ready', 'SUCCESS', res);
});

app.get('/fishes', (req, res) => {
  db.query('SELECT * from data_ikan ORDER BY nama_ikan', (error, result) => {
    response(200, result, 'get all data from data_ikan', res);
  });
});

app.get('/prices', (req, res) => {
  db.query('SELECT * from harga_ikan', (error, result) => {
    response(200, result, 'get all data from harga_ikan', res);
  });
});

app.post('/fishes', (req, res) => {
  const id_ikan = nanoid(8);
  const { nama_ikan, jenis_ikan, berat_ikan } = req.body;
  const tgl_masuk = new Date().toISOString();
  const query =
    'INSERT INTO data_ikan (id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk) VALUES (?, ?, ?, ?, ?)';
  const values = [id_ikan, nama_ikan, jenis_ikan, berat_ikan, tgl_masuk];

  db.query(query, values, (error, result) => {
    if (!(nama_ikan && jenis_ikan && berat_ikan)) {
      response(400, null, 'Mohon Diisi semua', res);
    } else {
      response(200, result, `Post data ${nama_ikan}  Berhasil`, res);
    }
  });
});

app.post('/prices', (req, res) => {
  const id_harga_ikan = nanoid(8);
  const { harga_per_kilo, id_ikan } = req.body;
  const tgl_berlaku = new Date().toISOString();
  const query =
    'INSERT INTO harga_ikan (id_harga_ikan, harga_per_kilo, tgl_berlaku, id_ikan) VALUES (?, ?, ?, ?)';
  const values = [id_harga_ikan, harga_per_kilo, tgl_berlaku, id_ikan];

  db.query(query, values, (error, result) => {
    if (!(harga_per_kilo && tgl_berlaku && id_ikan)) {
      response(400, null, 'Mohon Diisi semua', res);
    } else {
      response(200, result, `Post data harga Berhasil`, res);
    }
  });
});

app.get('/fishes/:nama_ikan', (req, res) => {
  const { nama_ikan } = req.params;
  const query = `SELECT * from data_ikan where nama_ikan ="${nama_ikan}" `;
  db.query(query, (error, result) => {
    response(200, result, `Get data by spesific name ${nama_ikan}`, res);
  });
});

app.put('/fishes/:id_ikan', (req, res) => {
  const { id_ikan } = req.params;
  const { nama_ikan, jenis_ikan, berat_ikan } = req.body;
  const query = `UPDATE data_ikan SET nama_ikan = '${nama_ikan}', jenis_ikan = '${jenis_ikan}', berat_ikan = '${berat_ikan}' WHERE id_ikan = '${id_ikan}'`;
  db.query(query, (error, result) => {
    response(200, result, `Get data ${id_ikan}`, res);
  });
});

app.put('/prices/:id_harga_ikan', (req, res) => {
  const { id_harga_ikan } = req.params;
  const { harga_per_kilo, id_ikan } = req.body;
  const query = `UPDATE harga_ikan SET harga_per_kilo = '${harga_per_kilo}', id_ikan = '${id_ikan}' WHERE id_ikan = '${id_harga_ikan}'`;
  db.query(query, (error, result) => {
    response(200, result, `Data harga dengan id ${id_harga_ikan} berhasil diubah`, res);
  });
});

app.delete('/fishes/:id_ikan', (req, res) => {
  const { id_ikan } = req.params;
  const query = `DELETE FROM data_ikan WHERE id_ikan = '${id_ikan}'`;
  db.query(query, (error, result) => {
    response(200, result, `Data ikan ${id_ikan} was deleted`, res);
  });
});

app.delete('/prices/:id_harga_ikan', (req, res) => {
  const { id_harga_ikan } = req.params;
  const query = `DELETE FROM harga_ikan WHERE id_harga_ikan = '${id_harga_ikan}'`;
  db.query(query, (error, result) => {
    response(200, result, `Data ikan ${id_harga_ikan} was deleted`, res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
