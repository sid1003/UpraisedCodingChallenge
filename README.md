# IMF Gadget API

Welcome to the IMF Gadget API! This API is designed to manage gadgets for the Impossible Missions Force (IMF). It includes features like authentication, filtering, and unique codename generation.

---

## **Live Deployment & Doc**

The API is deployed on Render and can be accessed at: https://upraisedcodingchallenge.onrender.com

API documentation can be accessed at: https://documenter.getpostman.com/view/29292065/2sAYXBGKfW

---



## **Features**
- **Authentication**: JWT-based authentication for secure access.
- **Filtering**: Retrieve gadgets based on their status (e.g., Available, Deployed, Destroyed, Decommissioned).
- **Self-Destruct**: Trigger a self-destruct sequence for gadgets.
- **Unique Codename**: Automatically generate unique codenames for gadgets.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render

---



## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/sid1003/UpraisedCodingChallenge.git
cd UpraisedCodingChallenge
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a .env file in the root of your project and add the following:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="supersecretkey123!@#"
PORT=3000
```

### **4.  Run the Server**
```bash
npm run dev
```
