module.exports = class User {

    constructor(params, database, dateTime){
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.username = params.username;
        this.email = params.email;
        this.password = params.password;
        this.createdAt;
        
        this.database = database;
        this.dateTime = dateTime;
    }

    async register(){

        this.createdAt = this.dateTime.toLocaleString();
        
        try {

            let results = await this.database.query({
                text: "INSERT INTO users (firstname, lastname, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                values: [this.firstname, this.lastname, this.username, this.email, this.password, this.createdAt]
            });

            return results.rows[0].id;

        } catch(error) {

            return error;

        }



    }

}

