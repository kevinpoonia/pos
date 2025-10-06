const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// --- START FIX: Use dynamic port and environment variables ---

// 1. Prioritize process.env.PORT for deployment environments (like Render)
const PORT = process.env.PORT || config.port;

// 2. Define the allowed origins for CORS, prioritizing the deployed Vercel URL
// The CORS_ORIGIN must be set in the Render environment (e.g., https://pos-mu-nine.vercel.app)
const allowedOrigins = [
    'http://localhost:5173', // For local development
    process.env.CORS_ORIGIN // The deployed Vercel URL
].filter(Boolean); // Filter out undefined if CORS_ORIGIN is not set in a specific env

// --- END FIX ---

// Establish Database Connection (Will now use MONGO_URI from Render env)
connectDB(); 

// Middlewares
app.use(cors({
    credentials: true,
    // Use a function to dynamically check if the request origin is allowed
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // AND allow all URLs listed in the allowedOrigins array.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    }
}));
// Middleware to handle preflight requests (required for POST/PUT/DELETE)
app.options('*', cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    }
}));


app.use(express.json()); // parse incoming request in json format
app.use(cookieParser())


// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler
app.use(globalErrorHandler);


// Server
app.listen(PORT, () => {
    console.log(`☑️ POS Server is listening on port ${PORT}`);
    // Log the CORS origin being used for debugging:
    console.log(`CORS Policy allows: ${process.env.CORS_ORIGIN}`);
})
