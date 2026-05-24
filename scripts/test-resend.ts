// scripts/test-resend.ts
import { Resend } from "resend";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log("🔧 Testing Resend API key...");
  console.log("API Key (first 10 chars):", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
  
  try {
    const data = await resend.emails.send({
      from: "Test <onboarding@resend.dev>",
      to: ["br23cs020@nltmz.ac.in"],
      subject: "Test from Portfolio",
      text: "This is a test email from your portfolio.",
    });

    console.log("✅ Email sent successfully!");
    console.log("Response:", data);
    
  } catch (error: any) {
    console.error("❌ Failed to send email:");
    console.error("Error:", error.message);
    
    if (error.message.includes("invalid_api_key")) {
      console.log("\n💡 Your Resend API key might be invalid or expired.");
      console.log("   Go to: https://resend.com/api-keys");
      console.log("   1. Check if the API key exists");
      console.log("   2. Regenerate if needed");
    }
  }
}

testResend();