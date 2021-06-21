More information about this at [zwischenstock.github.io](https://zwischenstock.github.io/)!  

Dependencies:
* NodeJS
* MongoDB
* The dependencies listed [here](https://www.npmjs.com/package/bcrypt), including `node-gyp` 

To run, execute `node app.js` and open `http://localhost:3000`.  

---

Setting up the Wildlife Zoo web app:  
* Edit the `.env` file to configure the MongoDB information and session secret. To generate a random secret key, consider simply using `openssl rand -h 16`.  

Setting up MongoDB:  
* Follow [this guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/) to configure a user account with access to the zoo database, providing the user account with access to read and write to the database.  
* Import the example file into MongoDB using mongoimport. Once up and running, execute the following: `mongoimport --port DB_PORT --type csv --headerline --db DB_DATABASE --collection animals -u DB_USER -p DB_PASSWORD --authenticationDatabase admin example_animal_data.csv`. Replace the uppercase text with their respective values stored in `.env`.  

---

If no user accounts for the web app are manually defined and `IN_PROD` is not set to `true`, the user and password combos admin/admin and guest/guest will be defined with their respective roles. The passwords can be changed from within the app.
