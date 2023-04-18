const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./connection.js');
const response = require('./response.js');
const { nanoid } = require('nanoid');

app.use(bodyParser.json());

// GET METHODs

app.get('/', (req, res) => {
  console.log({ urlParam: req.query });
  response(200, 'API ready', 'SUCCESS', res);
});

// GET all fishes
app.get('/fishes', (req, res) => {
  db.query('SELECT * from data_ikan ORDER BY nama_ikan', (error, result) => {
    response(200, result, 'get all data from data_ikan', res);
  });
});

// GET specific fish
app.get('/fishes/:nama_ikan', (req, res) => {
  const { nama_ikan } = req.params;
  const query = `SELECT * from data_ikan where nama_ikan ="${nama_ikan}" `;
  db.query(query, (error, result) => {
    response(200, result, `Get data by spesific name ${nama_ikan}`, res);
  });
});

// GET prices
app.get('/prices', (req, res) => {
  db.query('SELECT * from harga_ikan', (error, result) => {
    response(200, result, 'get all data from harga_ikan', res);
  });
});

// GET sales
app.get('/sales', (req, res) => {
  db.query('SELECT * from penjualan_ikan', (error, result) => {
    response(200, result, 'get all data from penjualan_ikan', res);
  });
});


// POST METHODs

// POST fish
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

// POST price
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

// POST sales
app.post('/sales', (req, res) => {
  const id_penjualan_ikan = nanoid(8);
  const { jumlah_ikan, id_ikan } = req.body;
  const tgl_penjualan = new Date().toISOString();
  const query =
    'INSERT INTO penjualan_ikan (id_penjualan_ikan, jumlah_ikan, tgl_penjualan, id_ikan) VALUES (?, ?, ?, ?)';
  const values = [id_penjualan_ikan, jumlah_ikan, tgl_penjualan, id_ikan];

  db.query(query, values, (error, result) => {
    if (!(jumlah_ikan && tgl_penjualan && id_ikan)) {
      response(400, null, 'Mohon Diisi semua', res);
    } else {
      response(200, result, `Post data harga Berhasil`, res);
    }
  });
});

// PUT METHODs

// PUT fish
app.put('/fishes/:id_ikan', (req, res) => {
  const { id_ikan } = req.params;
  const { nama_ikan, jenis_ikan, berat_ikan } = req.body;
  const query = `UPDATE data_ikan SET nama_ikan = '${nama_ikan}', jenis_ikan = '${jenis_ikan}', berat_ikan = '${berat_ikan}' WHERE id_ikan = '${id_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Get data ${id_ikan}`, res);
    }
  });
});

// PUT price
app.put('/prices/:id_harga_ikan', (req, res) => {
  const { id_harga_ikan } = req.params;
  const { harga_per_kilo, id_ikan } = req.body;
  const query = `UPDATE harga_ikan SET harga_per_kilo = '${harga_per_kilo}', id_ikan = '${id_ikan}' WHERE id_harga_ikan = '${id_harga_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Data harga dengan id ${id_harga_ikan} berhasil diubah`, res);
    }
  });
});

// PUT sales
app.put('/sales/:id_penjualan_ikan', (req, res) => {
  const { id_penjualan_ikan } = req.params;
  const { jumlah_ikan, id_ikan } = req.body;
  const query = `UPDATE penjualan_ikan SET jumlah_ikan = '${jumlah_ikan}', id_ikan = '${id_ikan}' WHERE id_penjualan_ikan = '${id_penjualan_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Data penjualan dengan id ${id_penjualan_ikan} berhasil diubah`, res);
    }
  });
});

// DELETE METHODs

// DELETE fish
app.delete('/fishes/:id_ikan', (req, res) => {
  const { id_ikan } = req.params;
  const query = `DELETE FROM data_ikan WHERE id_ikan = '${id_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Data ikan ${id_ikan} berhasil dihapus`, res);
    }
  });
});

// DELETE price
app.delete('/prices/:id_harga_ikan', (req, res) => {
  const { id_harga_ikan } = req.params;
  const query = `DELETE FROM harga_ikan WHERE id_harga_ikan = '${id_harga_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Data ikan ${id_harga_ikan} berhasil dihapus`, res);
    }
  });
});

// DELETE sales
app.delete('/sales/:id_penjualan_ikan', (req, res) => {
  const { id_penjualan_ikan } = req.params;
  const query = `DELETE FROM penjualan_ikan WHERE id_penjualan_ikan = '${id_penjualan_ikan}'`;
  db.query(query, (error, result) => {
    if (error) {
      response(400, null, 'Terjadi kesalahan')
    } else {
      response(200, result, `Data penjualan ${id_penjualan_ikan} berhasil dihapus`, res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
