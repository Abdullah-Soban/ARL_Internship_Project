const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

const mockTransactions = [
  {
    txnId: "TXN-2024-001",
    date: new Date("2024-05-12T10:30:00Z"),
    supplier: "Global Oil Corp",
    grade: "Brent Crude",
    volume: 50000,
    unit: "Barrels",
    pricePerUnit: 82.50,
    totalAmount: 4125000,
    status: "Completed",
    location: "Terminal A",
  },
  {
    txnId: "TXN-2024-002",
    date: new Date("2024-05-14T14:15:00Z"),
    supplier: "Apex Energy",
    grade: "WTI Crude",
    volume: 35000,
    unit: "Barrels",
    pricePerUnit: 78.20,
    totalAmount: 2737000,
    status: "Processing",
    location: "Terminal B",
  },
  {
    txnId: "TXN-2024-003",
    date: new Date("2024-05-15T09:45:00Z"),
    supplier: "North Sea Partners",
    grade: "Brent Crude",
    volume: 120000,
    unit: "Barrels",
    pricePerUnit: 83.10,
    totalAmount: 9972000,
    status: "Completed",
    location: "Offshore Platform 1",
  },
  {
    txnId: "TXN-2024-004",
    date: new Date("2024-05-16T16:20:00Z"),
    supplier: "PetroLogistics Inc",
    grade: "Heavy Crude",
    volume: 25000,
    unit: "Barrels",
    pricePerUnit: 65.40,
    totalAmount: 1635000,
    status: "Pending Approval",
    location: "Terminal C",
  },
  {
    txnId: "TXN-2024-005",
    date: new Date("2024-05-18T11:00:00Z"),
    supplier: "Global Oil Corp",
    grade: "WTI Crude",
    volume: 45000,
    unit: "Barrels",
    pricePerUnit: 79.00,
    totalAmount: 3555000,
    status: "Completed",
    location: "Terminal A",
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arl-oil-accounting');
    console.log('Connected to MongoDB');

    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    await Transaction.insertMany(mockTransactions);
    console.log('Database seeded with mock transactions!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
