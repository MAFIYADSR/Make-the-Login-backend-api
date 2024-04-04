const path = require('path');
const fs = require('fs');

const https = require('https');


const express = require('express');


const bodyParser = require('body-parser');

const sequelize = require('./util/database');


const User = require('./models/user');


const {Server} = require('socket.io');
const {createServer} = require('http');


var cors = require('cors');

const app = express();
const server = createServer(app);

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

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
});



const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        // console.log(`id = ${socket.id}`);
        users[socket.id] = name;
        // console.log(users[socket.id]);

        socket.broadcast.emit('user joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});

    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]

    })
})




sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        // console.log(result);
        server.listen(3000);
        // https.createServer({key: privateKey, cert: certificate}, app).listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

