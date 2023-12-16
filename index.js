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
  
  app.use(passport.initialize())
  app.use(passport.session());


  
app.get('/', (req, res) => {
   
  res.render('index')  
 })


 
app.get('/admin', (req, res) => {
    res.render('admin')
})





const adminUserName = 'admin';
const adminPass = 'November!'
    



passport.serializeUser(function (user, done) {
    done(null, user.id)
})


passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});
passport.use(new localStrategy( {
    usernameField: 'username', 
    passwordField: 'password' 
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
  
app.get('/admin', (req, res) => {
  res.render('admin');
});
  
  app.post('/admin', passport.authenticate('local', {
    successRedirect: '/layout',
      failureRedirect: '/admin',
      failureFlash: true
    
  }));
  

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin'); // Redirect to the login page if not authenticated
  }
  

// function isLogged(req, res, next )
app.get('/layout', isAuthenticated, getAllCustomers, async (req, res) => {
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
          
                      
        user: 'logilinklogistic@gmail.com',
                      //  pass:'dsnkzumlgsbfnikn'
                          pass: 'cdpkaunzajqgimif'
                          //     cdpkaunzajqgimif
      }

    })

            const mail_configs = {
            from: 'logilinklogistic@gmail.com',
            to: to,
              subject: 'Your Tracking ID for shipping',
            
            // text:`Thank you for your recent shipping with us. We wanted to inform you that your item has been shipped and is on its way to you. As promised, we are sharing your tracking ID with you so that you can track your package every step of the way. Your tracking ID is ${message} .To track your package, please visit website and enter your tracking ID. You'll be able to see the current status of your package and estimated delivery date.
            
          
            
            // Best regards,
            // Seasco Logistics
            
            
            
            
            
            
              // `
              html: `
              <html>
              <head>
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              />
          
              <style>
                @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap");
                body {
                  font-family: "Quicksand", Arial, sans-serif;
                  margin: 0;
                  /* padding: 0; */
                  margin-top: 80px;
                  padding: 30px;
                  padding-left: 60px;
                  font-weight: 500;
                  color: black;
                  width: 600px;
                  margin-left: auto;
                  margin-right: auto;
                  background-color: white;
                }
          
                /* .container {
                      width: 600px;
                      margin: 0 auto;
                      background: white;
                      margin-top: 80px;
                      padding: 20px;
                  } */
          
                .header {
                  text-align: center;
                }
          
                .message {
                  margin-top: 20px;
                }
          
                .signature {
                  margin-top: 20px;
                }
                .logo-class {
                  color: gray;
                text-transform: capitalize;
                font-size: 22px;
                font-weight: bold;
                text-decoration: underline;
                }
              
                .logo-class span {
                color: #e53d34;
                }
          
                @media (max-width: 430px) {
                  body {
                    width: 350px !important;
                    overflow-x: hidden;
                    padding: 10px;
                    font-size: 16px;
                    margin-right: auto;
                    margin-left: auto;
                    /* font-size: 24px; */
                  }
                }
              </style>
            </head>
              <body>
                  <div class="container">
                  <div class="header">
                  <p class="logo-class">Logi<span>link.</span></p>

                  </div>
                      <p>Thank you for your recent shipping with us. We wanted to inform you that your item has been shipped and is on its way to you.</p>
                      <p>As promised, we are sharing your tracking ID with you so that you can track your package every step of the way. </p>
                      <p style="margin-top: 20px">Your tracking ID is <strong>${message}</strong></p>
                      <p>To track your package, please visit our website and enter your tracking ID. You'll be able to see the current status of your package and the estimated delivery date.</p>
                      <p>Best regards,<br>Logiklink</p>
                  </div>
              </body>
              </html>
          `
              
              
    }
    

    transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log("email sent")

            return  res.status(200).send('Email sent successfully');
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

