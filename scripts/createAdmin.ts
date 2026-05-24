// scripts/createAdmin.ts - CORRECTED VERSION
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

// Use MONGODB_URI directly from .env
const MONGODB_URI = process.env.MONGODB_URI; // CORRECT: MONGODB_URI not MOMGODB_URL

if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not defined in .env file");
    console.log("Make sure your .env file has:");
    console.log('MONGODB_URI="mongodb+srv://admin:admin123@myportfolio.dnua0oi.mongodb.net/portfolio"');
    process.exit(1);
}

console.log("🔗 Connecting to MongoDB Atlas...");
console.log("Using URI:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

async function createAdmin() {
    try {
        console.log("Connecting to MongoDB...");
        
        // Connect directly
        await mongoose.connect(MONGODB_URI as string, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("✅ Connected!");
        
        // Define schema inline
        const userSchema = new mongoose.Schema({
            username: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            }
        }, { timestamps: true });
        
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        
        // Check for existing admin
        const adminExists = await User.findOne({ username: "admin" });
        
        if (adminExists) {
            console.log("Admin already exists. Resetting password...");
            // Hash and update password
            const salt = await bcrypt.genSalt(10);
            adminExists.password = await bcrypt.hash("admin123", salt);
            await adminExists.save();
            console.log("✅ Password reset to: admin123");
            console.log("⚠️  Change this password immediately after login!");
        } else {
            // Create new admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            
            const admin = new User({
                username: "admin",
                password: hashedPassword
            });
            
            await admin.save();
            console.log("✅ Admin created successfully!");
            console.log("📋 Login credentials:");
            console.log("   Username: admin");
            console.log("   Password: admin123");
            console.log("\n⚠️  SECURITY: Change this password immediately!");
        }
        
        // Show all users
        const allUsers = await User.find({});
        console.log(`\n📊 Total users in database: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`   - ${user.username}`);
        });
        
        mongoose.disconnect();
        console.log("\n✅ Done!");
        
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        
        if (error.name === 'MongoServerSelectionError') {
            console.log("\n🔧 Connection failed. Possible issues:");
            console.log("1. Internet connection");
            console.log("2. IP not whitelisted in MongoDB Atlas");
            console.log("3. Wrong username/password");
            console.log("4. Cluster is paused");
            
            console.log("\n💡 Go to MongoDB Atlas (https://cloud.mongodb.com):");
            console.log("   - Check if cluster is running");
            console.log("   - Add your IP to Network Access");
            console.log("   - Verify username/password");
        }
        
        process.exit(1);
    }
}

createAdmin();