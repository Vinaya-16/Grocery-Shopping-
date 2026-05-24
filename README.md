````md
# 🛒 QuickCart – Grocery Delivery Website

QuickCart is a modern full-stack grocery delivery web application inspired by platforms like Blinkit and Zepto.  
Users can browse products, add items to cart, manage favourites, place orders, and track deliveries with a clean and responsive UI.

---

# 🚀 Features

## 👤 Authentication
- User Login & Signup
- JWT Authentication
- Persistent Login using LocalStorage
- Secure Protected Routes

---

## 🛍️ Shopping Features
- Browse grocery products
- Product categories
- Search products
- Add to Cart
- Update item quantity
- Remove items from cart
- Wishlist / Favourites system

---

## 🚚 Checkout System
- Delivery Address
- Multiple Delivery Types
  - Standard Delivery
  - Express Delivery
  - Scheduled Delivery
- Multiple Payment Methods
  - Cash on Delivery
  - UPI
  - Credit/Debit Card
- Dynamic Delivery Charges
- Estimated Delivery Time
- Order Success Screen

---

## 📦 Orders
- View placed orders
- Order summary
- Delivery status UI

---

## 🎨 UI/UX
- Modern responsive design
- Mobile friendly
- Animated cart sidebar
- Clean product cards
- Interactive checkout flow

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- CSS3
- Axios

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Authentication
- JWT (JSON Web Tokens)

---

# 📂 Project Structure

```bash
quickcart/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── App.css
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── server.js
````

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Vinaya-16/quickcart.git
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=***************
JWT_SECRET=***********
```

Create a `.env` file inside frontend folder:

```env
VITE_API_URL=http://localhost:5000
```

---

# ▶️ Run Project

## Start Backend

```bash
cd backend
npm run dev
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Cart Sidebar
* Checkout Page
* Orders Page
* Profile Page

---

# 🔮 Future Improvements

* Real-time order tracking
* Razorpay / Stripe integration
* Admin Dashboard
* Live delivery partner tracking
* Push notifications
* AI product recommendations

---

# 👨‍💻 Author

Vinaya Patole

---

# 📄 License

This project is made for educational and practice purposes.

```
```
