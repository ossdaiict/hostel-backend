# Hostel Backend

Hostel Backend is created with the help of [Express.js](http://expressjs.com/) and [Node-Schedule](https://www.npmjs.com/package/node-schedule).
Basically it manage the mailing and complaint system.

## Requirements
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Nodemailer](https://nodemailer.com/about/) for mailing 

Create .env file at root folder and provide environment variables
```bash
# Gmail Email and Password
EMAIL
PASSWORD

# JWT Secret key
SECRET_KEY

# Website Login page
LOGIN_PAGE

# Mongodb database string
DATABASE_STRING
```

## Instruction
``` bash
# Install dependencies for server
yarn 

# Run the server on nodemon
yarn  dev

# Run the Express server only
yarn start 

# Server runs on http://localhost:5000 
```


* Role base authentication system.
* Sending the mail on every second day for Snail Mail.
* Auto close complaints within 24 to 48 hours.
* Use [Redux](https://redux.js.org/) for state managment.
