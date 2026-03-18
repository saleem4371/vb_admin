export const gatewayFields = {
  "Cashfree Gateway": [
    { name: "appId", label: "App ID" },
    { name: "secretKey", label: "Secret Key", type: "password" },
    { name: "environment", label: "Environment", type: "select", options: ["Test", "Live"] }
  ],

  "Stripe Gateway": [
    { name: "publishableKey", label: "Publishable Key" },
    { name: "secretKey", label: "Secret Key", type: "password" },
    { name: "webhookSecret", label: "Webhook Secret" }
  ],

  "SMS Gateway": [
    { name: "apiKey", label: "API Key" },
    { name: "senderId", label: "Sender ID" }
  ],

  "KYC Verification": [
    { name: "clientId", label: "Client ID" },
    { name: "clientSecret", label: "Client Secret", type: "password" }
  ],

  "Amazon S3 Storage": [
    { name: "accessKey", label: "Access Key ID" },
    { name: "secretKey", label: "Secret Access Key", type: "password" },
    { name: "bucket", label: "Bucket Name" },
    { name: "region", label: "Region" },
    { name: "endpoint", label: "Endpoint URL" }
  ]
};