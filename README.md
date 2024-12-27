# Backend of HireMe app

**HireMe** is a mobile application that bridges the gap between underprivileged workers and the IT world, empowering them with more job opportunities. It also simplifies hiring for users by offering a wide range of services in one app.


Main Repository : [HireMe](https://github.com/Onnesok/hire_me)
## 🚀 **How to Get Started**

**Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/hireme_api.git
   cd hireme_api
   ```
Now install **NodeJs** from - [NodeJs](https://nodejs.org/en)

**MongoDB Atlas**: Sign up at - [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) to use a hosted MongoDB database.

**Vercel CLI**: Install globally for deployment... For this open vscode and open new cmd and then :
```bash
npm install -g vercel
```

Now init NodeJs -
```bash
npm init -y
```
Install packages -
```bash
npm install express mongoose dotenv cors body-parser
```
Optional packages for better development:
```bash
npm install nodemon --save-dev
```

``express``: For creating routes and APIs.

``mongoose``: For connecting to MongoDB.

``dotenv``: To manage environment variables.

``cors``: To handle cross-origin requests.

``body-parser``: To parse request bodies.

Create a ``.env`` file to store your environment variables:
```bash
PORT=5000
MONGO_URI=<Your MongoDB Atlas Connection URI>
```

Use ``nodemon`` for auto-reloading or node to start the server:
```bash
npx nodemon index.js
```
Or simply use this - (I prefer this one)
```bash
npm start
```

Go to ``http://localhost:5000/api/users`` to see user data and determine if its working or not...


