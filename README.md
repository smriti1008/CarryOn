# CarryOn 🎒

**CarryOn** is a full-stack e-commerce web application built using Node.js, Express.js, MongoDB, and EJS. It provides a platform for browsing products and managing a shopping experience, with authentication and protected routes.


## ✨ Features

- **Product Browsing:** View and explore available products.
- **User Authentication:** User login and authentication functionality.
- **Password Security:** Password hashing using bcrypt.
- **Session Management:** Manage user sessions using express-session.
- **Protected Routes:** Restrict access to authorized users.
- **Shopping Cart:** Manage selected products.
- **Flash Messages:** Display feedback messages using connect-flash.
- **Database Integration:** Store and manage data using MongoDB and Mongoose.
- **Dynamic Rendering:** Generate pages dynamically using EJS templates.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| EJS | Server-side templating |
| CSS | Styling and layout |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | Server and routing |
| MongoDB | Database |
| Mongoose | Database modeling |
| bcrypt | Password hashing |
| express-session | Session management |
| JSON Web Token (JWT) | Token-based authentication, where implemented |

## 📁 Project Structure

```text
CarryOn/
├── models/          # Database models
├── routes/          # Application routes
├── controllers/     # Request handlers, if configured
├── middleware/      # Authentication and other middleware
├── views/           # EJS templates
├── public/          # Static assets and stylesheets
├── app.js           # Application entry point (if applicable)
├── package.json
├── package-lock.json
└── .gitignore
```

*The structure above is illustrative. Keep only the directories and files that exist in your repository.*

## ⚙️ Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- MongoDB or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone https://github.com/smriti1008/CarryOn.git
```

### 2. Navigate to the project

```bash
cd CarryOn
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and add the variables required by your application.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

Remove any variables that your application does not use. Never commit actual credentials or secret keys.

### 5. Run the application

Use the start command configured in your `package.json`. For example:

```bash
npm start
```

If your project does not have a start script, run its actual entry file:

```bash
node app.js
```

Open `http://localhost:3000` if your application uses port 3000.

## 🔐 Security

- Hash passwords before storing them.
- Store sensitive configuration in environment variables.
- Apply authentication middleware to protected routes.
- Validate user input before database operations.
- Avoid exposing database credentials and authentication secrets.

## 📈 Future Enhancements

- Product search and filtering
- Improved cart management
- Order history and tracking
- Admin dashboard for product management
- Payment gateway integration
- Automated testing and improved error handling

## 👩‍💻 Author

**Smriti Singh**

GitHub: [@smriti1008](https://github.com/smriti1008)

---

⭐ If you find this project interesting, consider giving the repository a star.
