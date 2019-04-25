var express = require('express');
const mongoose = require('mongoose');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var router = express.Router();
const fs = require('fs'); 
//const csv = require('csv-parser');
const csv=require("csvtojson");
mongoose.connect("mongodb+srv://dbuser:test123@cluster0-bkhg1.gcp.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true
}, (err) => {
  console.log(err);
  
});

var tSchema = new mongoose.Schema({
    threat_level: String,
    accuracy: Number,
    time: String,
    filename: String
});

var Pred = mongoose.model("Pred", tSchema);
// const inputFilePath = '/home/ubuntu/segmentation/logs/segmentation.csv';
const inputFilePath = '/home/chaman/projects/fyp/segmentation/logs/segmentation.csv';
/* GET home page. */
router.get('/', async function(req, res, next) {
  const jsonArray=await csv().fromFile(inputFilePath);
  console.log(jsonArray);
  const files1 = await Pred.find({}).exec();
  //  console.log(files1);
  const infiltration = await Pred.find({threat_level: 'infiltration'}).exec();
  console.log(infiltration);
  
  const blast = await Pred.find({threat_level: 'blast'}).exec();
  const normal = await Pred.find({threat_level: 'normal'}).exec();
  const war = await Pred.find({threat_level: 'war'}).exec();

  res.render('index', { files: jsonArray, files1: files1, infiltration: infiltration, blast: blast, normal: normal, war: war });
});

router.get('/log', async (req, res) => {
  const files1 = await Pred.find({}).exec();
  res.render('log', {files1: files1});
});

router.post('/modify', async (req, res) => {
  console.log(req.body);
  const oldPath = '/home/chaman/projects/fyp/segmentation/input_backup/bcbp.jpg';
  const newPath = '/home/chaman/projects/fyp/segmentation/bcbp.jpg';
 /* fs.rename(oldPath, newPath, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
  })*/
  const { stdout, stderr } = await exec('/home/chaman/projects/fyp/segmentation/retrain.sh');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);

  res.sendStatus(200);
});

module.exports = router;
