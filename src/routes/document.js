import express from 'express';
import multer from 'multer';
import md5File from 'md5-file';
import axios from 'axios';
import Document from '../models/Document';
import userRole from '../middleware/userRole';

const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

documentRouter.post('/documents', upload.single('document'), (req, res) => {
  let txID = '';
  axios.post('https://baas-test.wiccdev.org/v2/api/contract/callcontracttx', {
    amount: 0,
    arguments: '316173646661736466617364',
    calleraddress: 'wdLtg6peTqYUtHJmmZPLuFFncSqG6D7LBY',
    fee: 0,
    regid: '1107463-1',
  },
  {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      txID = response.body.data.hash || '';
    })
    .catch((error) => {
      console.log(error);
    });
  Document.create({
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
    txid: txID,
  }, (err, row) => {
    if (err) return res.json('error');
    return res.json(row);
  });
});

// read all documents
documentRouter.get('/documents', (req, res) => Document.find().then(docs => res.json(docs)));

// read documents by document id according to position and department
documentRouter.get('/documents/:id', userRole, (req, res) => {
  const { id } = req.params.id;
  Document.find({ id }).then(docs => res.json(docs));
});

// update
documentRouter.put('/documents/:id', upload.single('document'), (req, res) => {
  let txID = '';
  axios.post('https://baas-test.wiccdev.org/v2/api/contract/callcontracttx', {
    amount: 0,
    arguments: '316173646661736466617364',
    calleraddress: 'wdLtg6peTqYUtHJmmZPLuFFncSqG6D7LBY',
    fee: 0,
    regid: '1107463-1',
  },
  {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      txID = response.body.data.hash || '';
    })
    .catch((error) => {
      console.log(error);
    });
  Document.updateOne({ id: req.params.id }, {
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
    txid: txID,
  })
    .then(docs => res.json(docs));
});

// delete
documentRouter.delete('/documents/:id', (req, res) => {
  Document.deleteOne({ id: req.params.id })
    .then(() => res.status(200).end());
});


export default documentRouter;
