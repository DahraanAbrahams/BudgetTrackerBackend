require('dotenv').config();
const mockData = require('./mockData/MOCK_DATA.json');
const Transaction = require('./models/Transaction');
const connectDB = require('./db/connect');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        await Transaction.create(mockData);
        console.log('Success !!!');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();