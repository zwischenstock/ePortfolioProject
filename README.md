More information about this at [zwischenstock.github.io](https://zwischenstock.github.io/)!  

To run:  
	Execute `node app.js` and open `http://localhost:3000`.  

Setting up the Wildlife Zoo web app:  
	Edit the `.env` file to configure the MongoDB information and session secret. To generate a random secret key, consider simply using `openssl rand -h 16`.  

Setting up MongoDB:  
	* Follow [this guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/) to configure a user account with access to the zoo database, providing the user account with access to read and write to the database.  
	* Import the example file into MongoDB using mongoimport. Once up and running, execute the following: `mongoimport --port DB_PORT --type csv --headerline --db DB_DATABASE --collection animals -u DB_USER -p DB_PASSWORD --authenticationDatabase admin example_animal_data.csv`. Be sure to replace DB_PORT, DB_DATABASE, DB_USER, and DB_PASSWORD with what was defined in `.env`.
