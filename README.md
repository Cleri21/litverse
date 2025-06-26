
# Litverse 📖

Litverse is a full-featured book recommendation web application that provides users with personalized suggestions, real-time analytics, and notification support—all within a sleek and interactive UI.

---

## 🚀 Features

- **Personalized Book Recommendations** based on user preferences and reading history  
- **Real-Time Analytics** dashboard displaying user interaction and trends  
- **Notification System** for alerts like new releases or recommended reads  
- **User Profiles** with secure authentication and personalization  
- Clean **Separation of Frontend & Backend** for scalability  

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites

* [Node.js](https://nodejs.org/) (v16+)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 🔨 Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Cleri21/litverse.git
   cd litverse/server
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**
   Copy `.env.example` and fill in your credentials:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Optional: Seed the database**

   ```bash
   node seeder.js
   ```

5. **Start the server**

   ```bash
   npm start
   ```

6. **Open the frontend**
   Open `index.html` in your browser or serve via Vite/other web server

---

## 🛠️ Usage

* Sign up or log in to access personalized recommendations
* Track analytics in real time as you interact with the UI
* Receive notifications for new suggestions or alerts

---

## 🧰 Technologies

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Node.js, Express
* **Database**: MongoDB with Mongoose ORM
* **Auth & Security**: JWT token-based authentication

---

## 🛡️ Security & Best Practices

* Never commit `.env` files—use `.env.example` instead
* Use `.gitignore` to exclude `node_modules/`, cache files, and sensitive configs

---

## 🤝 Contributing

Contributions and pull requests are welcome—feel free to fork and submit improvements!

---
