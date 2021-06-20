TODO: Fill in more information about the project itself.

To run:  
	Execute `node app.js` and open `http://localhost:3000`.  

Setting up the Zoo Interface Web App:  
	Edit the `.env` file to configure the MongoDB information and session secret. To generate a random secret key, consider simply using `openssl rand -h 16`.  

Setting up MongoDB:  
	* Follow [this guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/) to configure a user account with access to the zoo database, providing the user account with access to read and write to the database.  
	* Import the example file into MongoDB using mongoimport. Once up and running, execute `mongoimport --port 27017 --type csv --headerline --db zoo --collection animals ./example_animal_data.csv`  
