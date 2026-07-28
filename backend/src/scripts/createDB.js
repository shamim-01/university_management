import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const createDatabase = async () => {
  try {
    const uri = 'mongodb://localhost:27017';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Check if database exists
    const dbs = await mongoose.connection.listDatabases();
    const dbExists = dbs.databases.some(
      db => db.name === 'university_management',
    );

    if (!dbExists) {
      // Create collections
      await db.createCollection('users');
      await db.createCollection('students');
      await db.createCollection('teachers');
      await db.createCollection('departments');
      await db.createCollection('courses');
      await db.createCollection('attendances');
      await db.createCollection('results');
      await db.createCollection('notices');
      await db.createCollection('messages');
      console.log('✅ All collections created');
    }

    // Hash password function
    const hashPassword = async password => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Check if admin exists
    const adminExists = await db.collection('users').findOne({
      email: 'admin@university.com',
    });

    if (!adminExists) {
      // Insert Admin
      const adminPassword = await hashPassword('admin123');
      await db.collection('users').insertOne({
        name: 'System Admin',
        email: 'admin@university.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin user created');
    }

    // Check if student exists
    const studentExists = await db.collection('users').findOne({
      email: 'student@university.com',
    });

    if (!studentExists) {
      // Insert Student
      const studentPassword = await hashPassword('student123');
      await db.collection('users').insertOne({
        name: 'Student One',
        email: 'student@university.com',
        password: studentPassword,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Student user created');
    }

    // Check if teacher exists
    const teacherExists = await db.collection('users').findOne({
      email: 'teacher@university.com',
    });

    if (!teacherExists) {
      // Insert Teacher
      const teacherPassword = await hashPassword('teacher123');
      await db.collection('users').insertOne({
        name: 'Teacher One',
        email: 'teacher@university.com',
        password: teacherPassword,
        role: 'teacher',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Teacher user created');
    }

    // Check if department exists
    const deptExists = await db.collection('departments').findOne({
      code: 'CSE',
    });

    if (!deptExists) {
      // Insert Department
      await db.collection('departments').insertOne({
        name: 'Computer Science & Engineering',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        establishedYear: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ CSE Department created');
    }

    // Show all users
    const users = await db.collection('users').find({}).toArray();
    console.log('\n📊 Current Users:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) [${user.role}]`);
    });

    // Show all collections with counts
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Collection Statistics:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }

    // Show all databases
    const allDbs = await mongoose.connection.listDatabases();
    console.log('\n📊 Available Databases:');
    allDbs.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createDatabase();
