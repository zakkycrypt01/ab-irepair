# 🤖 AB-iRepair Telegram Stock Bot Integration

## Overview

This integration allows administrators to manage product inventory through a Telegram bot. The bot provides a convenient interface for adding, viewing, and deleting products directly from Telegram.

## ✨ Features

- **Add Products**: Create new products with name, category, price, description, and images
- **View Inventory**: Display all products in the current inventory
- **Delete Products**: Remove products by ID
- **Cloud Image Upload**: Upload product images to Cloudinary for better performance
- **Image Optimization**: Automatic image optimization and resizing
- **Admin Control**: Restrict access to authorized users only
- **Real-time Updates**: Changes are immediately reflected in the main application

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up the Bot

Run the interactive setup:

```bash
npm run setup-bot
```

This will guide you through:
- Creating a Telegram bot with BotFather
- Getting your Telegram user ID
- Configuring environment variables

### 3. Test the Configuration

```bash
npm run test-bot
```

### 4. Start the Server

```bash
npm run dev
```

## 📱 Using the Bot

### Available Commands

- `/start` - Welcome message and command list
- `/addstock` - Add a new product to inventory
- `/viewstock` - View all products in inventory
- `/deletestock` - Delete a product from inventory
- `/cancel` - Cancel current operation
- `/help` - Show detailed help information

### Adding a Product

1. Send `/addstock` to the bot
2. Follow the prompts:
   - Enter product name
   - Enter category
   - Enter price (numbers only)
   - Enter description
   - Send an image or type "skip"

Example interaction:
```
You: /addstock
Bot: 📦 Adding new product (ID: PROD_1704123456_ABC12)
     Please enter the product name:

You: iPhone 13 Pro
Bot: Great! Now enter the product category:

You: Electronics
Bot: Perfect! Now enter the product price:

You: 999.99
Bot: Excellent! Now enter the product description:

You: Latest iPhone with advanced camera system
Bot: Almost done! Please send a product image or type "skip":

You: [sends image]
Bot: 📤 Uploading image to cloud storage...
Bot: ✅ Image uploaded successfully!
Bot: ✅ Product Added Successfully!
     📦 Product ID: PROD_1704123456_ABC12
     📝 Name: iPhone 13 Pro
     🏷️ Category: Electronics
     💰 Price: $999.99
     📄 Description: Latest iPhone with advanced camera system
     📷 Image: Uploaded to cloud storage

The product has been added to your inventory!
```

### Viewing Products

Send `/viewstock` to see all products:

```
You: /viewstock
Bot: 📋 Current Inventory:

     1. 📦 iPhone 13 Pro
        🆔 ID: PROD_1704123456_ABC12
        🏷️ Category: Electronics
        💰 Price: $999.99
        📄 Description: Latest iPhone with advanced camera system
        📷 Cloud Image Available
```

### Deleting a Product

1. Send `/deletestock`
2. Enter the Product ID when prompted

```
You: /deletestock
Bot: Please enter the Product ID to delete:

You: PROD_1704123456_ABC12
Bot: ✅ Product PROD_1704123456_ABC12 has been deleted successfully!
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=2000
MONGO_URL=mongodb://localhost:27017/ab-irepair

# Frontend URL for CORS
FRONTEND_URL=https://ab-irepair.vercel.app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=6123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_USERS=123456789,987654321
```

### Getting Your Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Start a conversation and use `/newbot`
3. Follow the prompts to name your bot
4. Copy the token provided by BotFather

### Getting Your Telegram User ID

1. Search for `@userinfobot` in Telegram
2. Start a conversation to get your user ID
3. Add your user ID to the `ADMIN_USERS` environment variable

## 🛡️ Security

- Only users listed in `ADMIN_USERS` can use the bot
- The bot token should be kept secret and not shared
- Images are stored as Telegram file IDs (not downloaded to server)
- Input validation prevents malicious data entry

## 🔗 API Integration

The bot uses the existing API endpoints:
- `POST /api/addproduct` - Add new product
- `GET /api/products` - Get all products
- `DELETE /api/products/:productId` - Delete product

## 📊 Monitoring

### Health Check

Check if the bot is running:
```bash
curl http://localhost:2000/api/bot/bot-status
```

### Logs

The bot logs important events:
- Bot startup/shutdown
- Product operations
- Error conditions
- User interactions

## 🚨 Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if `TELEGRAM_BOT_TOKEN` is correctly set
   - Verify the token with `/test-bot`
   - Ensure the server is running

2. **"Not authorized" message**
   - Verify your user ID is in `ADMIN_USERS`
   - Check for typos in the user ID
   - Ensure comma separation for multiple users

3. **Product not saving**
   - Check MongoDB connection
   - Verify server logs for errors
   - Ensure all required fields are provided

4. **Image upload issues**
   - Images are automatically uploaded to Cloudinary cloud storage
   - Large images are optimized and resized automatically
   - Check Cloudinary configuration if uploads fail
   - Ensure stable internet connection for uploads

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🔄 Production Deployment

For production deployment:

1. Use webhook instead of polling:
   ```javascript
   bot.setWebHook(`https://yourdomain.com/api/bot/webhook`);
   ```

2. Use environment variables for sensitive data
3. Enable HTTPS for webhook endpoints
4. Set up proper logging and monitoring

## 📈 Future Enhancements

Potential improvements:
- Bulk product import via CSV
- Product search and filtering
- Sales analytics through bot
- Automated stock alerts
- Multi-language support
- Order management through bot

## 🤝 Contributing

To contribute to the bot:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support:
- Check the logs in the server console
- Review the troubleshooting section
- Ensure all dependencies are installed
- Verify environment variables are set correctly
