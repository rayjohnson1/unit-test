const sinon = require('sinon');
const User = require('./userClass');
const database = require('./db');

//Asycronous Unit test scenario.

/*
    1: Test a function when there is returned data
        Create user which returns the user model

    2: Test a function when there is no returned data
        Delete user account

    3: Test for positive scenrios
        When all required user information is supplied to the create function
        When the userId to delete is supplied to the delete function

    4: Test for negative scenearios.
        When all required user information is not supplied to the create function

    5: Test a complex function which makes several external api calls
        Add a generate timestamp to the create user method

*/


describe("User Class", () => {

    describe("register()", () => {

        afterEach(() => {
            sinon.restore();
        });

        it("should make a call to user.database.query()", async () => {

            //arrange
            const user = new User({
                firstname: "John",
                lastname: "Doe",
                username: "jonny_boy12_",
                email: "johnd@gmail.com",
                password: "hello:)"
            }, database, new Date());

            //stub
            sinon.stub(user, 'registrationValidation').returns(true);
            const databaseQuerySpy = sinon.stub(user.database, 'query');

            //act
            await user.register();

            //assert
            sinon.assert.calledOnce(databaseQuerySpy);
            sinon.assert.calledWith(databaseQuerySpy, {
                text: sinon.match.typeOf("string"),
                values: [user.firstname, user.lastname, user.username, user.email, user.password, user.createdAt]
            });

        });

        it("should make a call to user.date.toLocaleString()", async () => {

            //arrange
            const user = new User({
                firstname: "John",
                lastname: "Doe",
                username: "jonny_boy12_",
                email: "johnd@gmail.com",
                password: "hello:)"
            }, database, new Date());

            //stub
            sinon.stub(user, 'registrationValidation').returns(true);
            sinon.stub(user.database, 'query');
            const dateTimeStub = sinon.stub(user.dateTime, 'toLocaleString');

            //act
            await user.register();

            //assert
            sinon.assert.calledOnce(dateTimeStub);

        });

        it("should return a copy of the user model when all required fields are not null", async () => {

            //arrange
            const user = new User({
                firstname: "John",
                lastname: "Doe",
                username: "jonny_boy12_",
                email: "johnd@gmail.com",
                password: "hello:)"
            }, database, new Date());

            //stub
            sinon.stub(user, 'registrationValidation').returns(true);
            sinon.stub(user.database, 'query').resolves({
                rows: [{
                    id: 1,
                    firstname: "John",
                    lastname: "Doe",
                    username: "jonny_boy12_",
                    email: "johnd@gmail.com",
                    created_at: 'Jan. 20, 2018'
                }]
            });

            //act
            const createdUser = await user.register();

            expect.assertions(12);
            //assert
            expect(createdUser).toHaveProperty('id');
            expect(createdUser).toHaveProperty('firstname');
            expect(createdUser).toHaveProperty('lastname');
            expect(createdUser).toHaveProperty('username');
            expect(createdUser).toHaveProperty('email');
            expect(createdUser).toHaveProperty('createdAt');
            expect(createdUser.id).toBe(1);
            expect(createdUser.firstname).toBe('John');
            expect(createdUser.lastname).toBe('Doe');
            expect(createdUser.username).toBe('jonny_boy12_');
            expect(createdUser.email).toBe('johnd@gmail.com');
            expect(createdUser.createdAt).toBe('Jan. 20, 2018');

        });

        it('should throw an error when required values are not provided', async () => {

            //arrange
            const user = new User({
                lastname: "Doe",
                username: "jonny_boy12_",
                email: "johnd@gmail.com",
                password: "hello:)"
            }, database, new Date());

            //stub
            sinon.stub(user, 'registrationValidation').returns(false);
            sinon.stub(user.database, 'query');

            expect.assertions(1);
            try {

                //act
                await user.register();

            } catch(e) {

                //assert
                expect(e).not.toBeNull();

            }
        
        });

    });

    describe('delete()', () => {

        it("should make a call to database.delete()", async () => {

            //arrange
            const user = new User({
                id: 1
            }, database, new Date());

            //stub
            const deleteQueryStub = sinon.stub(user.database, 'query').resolves();

            //act
            await user.delete();

            //assert
            sinon.assert.calledOnce(deleteQueryStub)

        });

    });

        

});