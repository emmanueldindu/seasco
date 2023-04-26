const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connectDB = require('./db')
const Customer = require('./models/customer')
const winston = require('winston')
const error = require('./error')
const customerRoutes = require('./routes/customer-routes')
const ejs = require('ejs');
require('dotenv').config({ path: "./config.env" })
const nodemailer = require('nodemailer')
const port = 4000 || process.env.PORT
const session = require('express-session')
const MongoDBSession = require("connect-mongodb-session")(session)
const {getAllCustomers} = require('./controllers/customerController')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const bcrypt = require('bcrypt')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const connect_url = 'mongodb+srv://emmanuelnwobodoc04:chimnadindu@logistic.e1tdm9r.mongodb.net/test'
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
// const User = require('./models/User')

// const UserSchema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        
    }
})


const User = mongoose.model("User", userSchema);
// module.exports.User = User


app.use(express.static('view'))
app.use('/view/css', express.static(__dirname + 'view/css'))
app.use('/view/js', express.static(__dirname + 'view/js'))
app.use('/view/images', express.static(__dirname + 'view/images'))


app.set('views', './view')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(error)
app.use(customerRoutes.routes)

const store = new MongoDBSession({
    uri: connect_url,
    collection: 'mysessions',
  });
  
  store.on('connected', function() {
    console.log('MongoDB session store connected!');
  });
  
  store.on('error', function(error) {
    console.log('MongoDB session store connection error:', error);
  });
  
  app.use(
    session({
      secret: 'key that will sign the cookie',
      resave: false,
      saveUninitialized: true,
    //   store: store,
    })
  );
  

  
app.get('/', (req, res) => {
   
  res.render('index')  
 })


 
app.get('/admin', (req, res) => {
    res.render('admin')
})

//  app.use((req, res, next) => {
//     console.log(req.session);
//     next();
//   });




const adminUserName = 'admin';
const adminPass = 'November!'
    




// app.post('/admin', (req, res) => {
//     const { name, password } = req.body
//     console.log(`Submitted credentials: name=${name}, password=${password}`);
  
//     if (name === adminUserName && password === adminPass) {
//         console.log(session)
//         req.session.isAuth = true;
//         req.session.isAdmin = true;

//         console.log(`Session created: ${JSON.stringify(req.session)}`);
//         res.redirect('/layout')
//     } else {
//         console.log('login failed')
//         res.redirect('/admin')
//     }
// })


// app.get('/layout', getAllCustomers, (req, res) => {
//     console.log(`Current session: ${JSON.stringify(req.session)}`);
//     if (req.session.isAdmin === true && req.session.isAdmin === true) {
// // admin logs in with detailss
//         console.log(`Admin session found: ${req.session}`);
        
//         res.render('layout')
//     } else {
//         console.log('Access denied: user is not an admin');
//         res.redirect('/admin')
//     }
// })



passport.serializeUser(function (user, done) {
    done(null, user.id)
})


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })  

})
passport.use(new localStrategy( {
    usernameField: 'username', // tell passport to look for username in the request body
    passwordField: 'password' // tell passport to look for password in the request body
  }, function (username, password, done) {
    User.findOne({ username: username }).then(function (user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
  
      bcrypt.compare(password, user.password).then(function (res) {
        if (res === false) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      }).catch(function (err) {
        return done(err);
      });
    }).catch(function (err) {
      return done(err);
    });
  }));
  
  app.post('/admin', passport.authenticate('local', {
    successRedirect: '/layout',
      failureRedirect: '/admin',
      failureFlash: true
    
  }));
  

// function isLogged(req, res, next )
app.get('/layout', getAllCustomers, async (req, res) => {
    const exists = await User.exists({
        username: "admin"
    })

    if (!exists) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash("November!", salt, function (err, hash) {
                if (err) return next(err);
                const newAdmin = new User({
                    username: "admin",
                    password: hash
                })

                newAdmin.save()
                res.redirect('/admin')
            })
        })
        return;
    }

    res.render('layout')
})

app.get('/email', (req, res) => {
    res.render('form')
})



app.post('/email', (req, res) => {

    
    const to = req.body.to
    const message = req.body.message


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                             user: 'seascologistics@gmail.com',
                             pass:process.env.MAIL
                        }

    })

            const mail_configs = {
            from: 'masterdindu04@gmail.com',
            to: to,
            subject: 'Your Tracking ID for shipping',
            text:`Thank you for your recent shipping with us. We wanted to inform you that your item has been shipped and is on its way to you. As promised, we are sharing your tracking ID with you so that you can track your package every step of the way. Your tracking ID is ${message} .To track your package, please visit website and enter your tracking ID. You'll be able to see the current status of your package and estimated delivery date.
            
          
            
            Best regards,
            Seasco Logistics
            
            
            
            
            
            
            `
    }
    

    transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log("email sent")

            return  res.send('success')
        }
    })
})    



     







const start = async () => {
    try {
        await connectDB()
        app.listen(port, () => console.log(`Logistic running on Port ${port}`))
        if(connectDB)
console.log('connected to DataBase!')
    } catch (error) {
        console.log(error)


    }
}


start()

