# MedTech Parts

A modern e-commerce platform specialized in medical technology parts and equipment.

## 🚀 Features

- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: User-selectable theme preference with system detection
- **Product Catalog**: Browse through various categories of medical technology parts
- **Product Details**: Detailed product information, specifications, and images
- **Shopping Cart**: Add products to cart with quantity management
- **Wishlist**: Save products for future reference
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Manage products, orders, and users
- **Search Functionality**: Find products quickly with the search feature
- **Currency Selection**: View prices in different currencies
- **Newsletter Subscription**: Stay updated with the latest products and offers
- **Contact Form**: Easy communication channel for inquiries
- **Tech Updates**: Latest news and updates in the medical technology field
- **Custom Toast Notifications**: User-friendly system notifications

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Prisma ORM
- **State Management**: React Context API
- **Authentication**: JWT

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/EslamPy/Store.git
cd Store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

> **Note**: If you encounter a `permission denied` error when running on port 5000, try using a different port by modifying the server configuration or run with administrative privileges.

## 📁 Project Structure

```
├── client/             # Frontend React application
│   ├── public/         # Public assets
│   └── src/
│       ├── components/ # UI components
│       ├── context/    # React context providers
│       ├── data/       # Static data
│       ├── hooks/      # Custom React hooks
│       ├── pages/      # Page components
│       └── utils/      # Utility functions
├── server/             # Backend Express application
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
└── prisma/             # Database schema and migrations
```

## 📝 Usage

After installation, you can:

- Browse products by navigating through different categories
- View detailed information about each product
- Add products to your cart or wishlist
- Place orders through a secure checkout process
- Manage your account and view order history
- Admins can access the dashboard to manage products and orders

## 🌐 Deployment

The application can be deployed using various platforms:

- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Heroku, AWS, or Google Cloud

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Contributors

- [Eslam Py](https://github.com/EslamPy) 