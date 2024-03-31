const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

function isstringnotvalid(string) {  //It will check string is valid or not
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}


const signup = async (req, res) => {
    try {
        const { name, email, number, password } = req.body;
        // console.log(name, email,number, password);
        const userExits = await User.findAll({ where: { email: email } }) //Its checks if user exists in database. and return as array
        if (userExits.length > 0) //If array is not empty then its confirms that email already exits 
        {
            return res.status(203).json({ message: "Email already exists, Please login" })

        }
        if (isstringnotvalid(name) || isstringnotvalid(email)) {
            return res.status(400).json({ err: "Bad parametres" })
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await User.create({ name, email, number, password: hash })
            res.status(201).json({ message: "Sucessfully created the user" })
        })
    }
    catch (err) {
        res.status(500).json(err)
    }

}

function generateAccessToken(id, name, number,)
{
    return jwt.sign({userId: id, name: name, number: number}, process.env.TOKEN_SECRET);
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringnotvalid(email) || isstringnotvalid(password)) {
            return res.status(400).json({ message: "Email id or password is missing", sucess: false })
        }
        // console.log(email);
        // console.log(password);


        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result == true) {
                    res.status(200).json({ sucess: true, message: "User logged in Sucessfully", token: generateAccessToken(user[0].id, user[0].name, user[0].number) })
                }
                else {
                    return res.status(401).json({ sucess: false, message: "Incorrect password" })
                }
            })
        }
        else{
            return res.status(404).json({sucess: false, message: "User not exists"})
        }
    }catch(err)
    {
        res.status(500).json({message: err, sucess: false})
    }
}

module.exports = {
    signup,
    login,
    generateAccessToken
}