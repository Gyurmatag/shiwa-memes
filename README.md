# **ShiwaMemes**

## Local development configuration

1. Clone this repo
2. Make a `.env` file with your [Railway](https://railway.app/) Postgres connection URL. The file should look like this:
```javascript
   DATABASE_URL="connection_url"
```
3. Make a `.env.local` file with your Google API credentials, [Cloudinary](https://cloudinary.com/)  API credentials and AUTH_SECRET. The file shoud look like this:
```javascript
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="google_client_id"
   GOOGLE_CLIENT_SECRET="google_client_secret"
   CLOUDINARY_CLOUD_NAME="cloudinary_cloud_name"
   CLOUDINARY_API_KEY="cloudinary_api_key"
   STRIPE_SECRET_KEY="stripe_secret_key"
   STRIPE_ENDPOINT_SECRET="stripe_endpoint_secret"
   CLOUDINARY_API_SECRET="cloudinary_api_secret"
   AUTH_SECRET="auth_secret"
```
4. Run ```npm install```
5. Run ```npx prisma migrate dev ```
6. Run ```npm run dev``` 
