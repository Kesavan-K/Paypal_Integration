const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

// host static files
app.use(express.static("client"));
app.use(cors());
app.use(express.json());

const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
        ).toString("base64");
        const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log(auth);
        console.log(base);
        const { access_token } = response.data;
        return access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        throw error;
    }
};

const createOrder = async (product) => {
    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: product.cost,
                    },
                    description: product.desc,
                },
            ],
        };

        const response = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Failed to create order:", error);
        throw error;
    }
};

const captureOrder = async (orderID) => {
    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;
        const response = await axios.post(url, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Failed to capture order:", error);
        throw error;
    }
};

app.post("/api/orders", async (req, res) => {
    try {
        const { product } = req.body;
        const order = await createOrder(product);
        res.json(order);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
    try {
        const { orderID } = req.params;
        const capturedOrder = await captureOrder(orderID);
        res.json(capturedOrder);
    } catch (error) {
        console.error("Failed to capture order:", error.response.data);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

// serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./client/checkout.html"));
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Node server listening at http://localhost:${PORT}/`);
});
