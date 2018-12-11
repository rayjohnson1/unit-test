const sinon = require('sinon');
const User = require('./userClass');
const database = require('./db');


describe("User Class", () => {

    const user = new User({
        firstname: "John",
        lastname: "Doe",
        username: "jonny_boy12_",
        email: "johnd@gmail.com",
        password: "hello:)"
    }, database, new Date());

    describe("register()", () => {

        afterEach(() => {
            sinon.restore();
        })

        it("should set the createdAt Property", async () => {

            //arrange
            //..

            //stub
            sinon.stub(user.database);
            sinon.stub(user.dateTime, 'toLocaleString')
                .returns("12/9/2018, 9:23:07 PM");

            //act
            await user.register();

            //assert
            expect(user.createdAt).toBeDefined();

        })

        it("should return the newly created userId", async () => {

            //arrange
            //..
            
            //stub
            sinon.stub(user.database, 'query').resolves({
                rows: [{id: 1}]
            });
            sinon.stub(user.dateTime)
            
            //act
            let userId = await user.register();

            //assert
            expect(userId).toEqual(1);

        });

    });

});