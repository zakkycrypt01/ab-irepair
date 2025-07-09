# Telegram Stock Management Bot

This bot allows authorized admins to manage product inventory through Telegram.

## Features

- 📦 Add new products to inventory
- 📋 View all products in inventory
- 🗑️ Delete products from inventory
- 📷 Upload product images
- 🔒 Admin-only access control

## Bot Commands

- `/start` - Start the bot and see welcome message
- `/addstock` - Add a new product to inventory
- `/viewstock` - View all products in inventory
- `/deletestock` - Delete a product from inventory
- `/help` - Show help message

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Use the `/newbot` command
4. Follow the prompts to name your bot
5. Save the bot token that BotFather provides

### 2. Get Your Telegram User ID

1. Search for `@userinfobot` in Telegram
2. Start a conversation and it will show your user ID
3. Note down your user ID (it's a number like `123456789`)

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Edit the `.env` file and add:

```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ADMIN_USERS=your_telegram_user_id,another_admin_id
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Server

```bash
npm run dev
```

The bot will automatically start when the server starts.

## Usage

### Adding a Product

1. Send `/addstock` to the bot
2. Follow the prompts to enter:
   - Product name
   - Category
   - Price
   - Description
   - Image (optional)

### Viewing Products

1. Send `/viewstock` to see all products in inventory

### Deleting a Product

1. Send `/deletestock`
2. Enter the Product ID when prompted

## Security

- Only users listed in `ADMIN_USERS` can use the bot
- The bot token should be kept secret
- Product images are stored as Telegram file IDs

## Error Handling

The bot includes comprehensive error handling for:
- Invalid input validation
- Network errors
- Database connection issues
- Unauthorized access attempts

## Development

To modify the bot behavior, edit the files in the `bot/` directory:

- `telegramBot.js` - Main bot logic
- `index.js` - Bot initialization and lifecycle management
