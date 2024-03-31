const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const User = require('./models/user');


var cors = require('cors');

const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//get config vars
dotenv.config();

// app.use(cors({
//     origin: "*",
// }));
app.use(cors());


const { nextTick } = require('process');
const userRoutes = require('./routes/user');


const exp = require('constants');



// app.use(bodyParser.json({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/user', userRoutes);

// app.use('/purchase', purchasepremiumRoutes);

app.use((req, res) => {
    // console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `/${req.url}`));
})




sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
        // https.createServer({key: privateKey, cert: certificate}, app).listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

