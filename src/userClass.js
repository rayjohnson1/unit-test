module.exports = class User {

    constructor(params, database, dateTime){
        this.id = params.id;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.username = params.username;
        this.email = params.email;
        this.password = params.password;
        this.createdAt;
        
        this.database = database;
        this.dateTime = dateTime;
    }

    registrationValidation(){

        const requiredValues = [
            this.firstname,
            this.lastname,
            this.username,
            this.email,
            this.password
        ];

        for(let i = 0; i < requiredValues.length; i++){
            if(requiredValues[i] === null || requiredValues[i] === undefined)
                return false;
        }

        return true;

    }

    async register(){

        if(!this.registrationValidation())
            throw 'Please provide all required fields.';

        this.createdAt = this.dateTime.toLocaleString();

        try {

            const { rows } = await this.database.query({
                text: "INSERT INTO users (firstname, lastname, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                values: [this.firstname, this.lastname, this.username, this.email, this.password, this.createdAt]
            });

            const user = rows[0];

            return {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                createdAt: user.created_at
            }

        } catch(error) {

            return error;

        }

    }

    async delete(){

        try {

            const { rowCount } = await this.database.query({
                text: "DELETE * FROM users WHERE id = $1;",
                values: [this.id]
            });

            if(rowCount === 0)
                throw 'User not found.';

        } catch(error) {

            return error;

        }

    }

}

