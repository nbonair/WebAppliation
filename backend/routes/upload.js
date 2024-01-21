const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const { compareInventoryFiles } = require('../utils/csvCompare')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.csv');
    }
});

const upload = multer({ storage: storage });


let dearPath = '';
let shopifyPath = '';


router.post('/dear', upload.single('dearFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log('ok')
    dearPath = req.file.path;
    res.send('Dear Inventory file uploaded successfully.');
});

router.post('/shopify', upload.single('shopifyFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    shopifyPath = req.file.path;
    res.send('Shopify Inventory file uploaded successfully.');
});

router.post('/compare', async (req, res) => {
    if (!dearPath || !shopifyPath) {
        return res.status(400).send('Both files need to be uploaded.');
    }

    try {
        const result = await compareInventoryFiles(dearPath, shopifyPath);
        // const csv = Papa.unparse(result);

        // res.setHeader('Content-disposition', 'attachment; filename=comparison-results.csv');
        // res.set('Content-Type', 'text/csv');
        res.json(result);
    } catch (error) {
        res.status(500).send(`Error during comparison: ${error.message}`);
    } finally {
        // fs.unlinkSync(dearPath);
        // fs.unlinkSync(shopifyPath);
    }
});

module.exports = router;