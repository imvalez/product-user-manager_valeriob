# 🛍️ Gestionale Prodotti - product-user-manager_valeriob

![GitHub repo size](https://img.shields.io/github/repo-size/imvalez/product-user-manager_valeriob)
![GitHub last commit](https://img.shields.io/github/last-commit/imvalez/product-user-manager_valeriob)
![GitHub issues](https://img.shields.io/github/issues/imvalez/product-user-manager_valeriob)
![GitHub stars](https://img.shields.io/github/stars/imvalez/product-user-manager_valeriob?style=social)
![License](https://img.shields.io/github/license/imvalez/product-user-manager_valeriob)

---

## 📖 Descrizione

Questo progetto è una **web app completa** per la gestione di prodotti e utenti, con:
- autenticazione sicura (inclusa **autenticazione a due fattori - 2FA**),
- gestione ruoli (**utente** e **amministratore**),
- interfaccia moderna e **responsive**.

🔹 **Backend:** Node.js / Express + MongoDB  
🔹 **Frontend:** React

---

## ✨ Funzionalità principali

- **Gestione prodotti:** crea, modifica, attiva/disattiva prodotti.  
- **Gestione utenti (solo admin):** crea, modifica, attiva/disattiva utenti e ruoli.  
- **Autenticazione sicura:** login, registrazione, 2FA tramite app Authenticator e codici di backup.  
- **Ruoli:** utente normale e amministratore.  
- **UI moderna e responsive.**  

---

## 📂 Struttura del progetto

```
progettone_finale_react_valerio_bottari/
│
├── backend/                # Backend Node.js/Express
│   ├── config/             # Configurazioni (db, auth)
│   ├── controllers/        # Controller API
│   ├── middlewares/        # Middleware (auth, admin)
│   ├── models/             # Modelli Mongoose (User, Product)
│   ├── routes/             # API routes (auth, products, users)
│   ├── package.json        # Dipendenze backend
│   └── server.js           # Entry point backend
│
├── frontend/               # Frontend React
│   ├── public/             # Static files (index.html, favicon)
│   ├── src/                # Sorgente React
│   │   ├── components/     # Componenti riutilizzabili
│   │   ├── context/        # Context API (Auth)
│   │   ├── pages/          # Pagine principali
│   │   ├── utils/          # Utility (API, auth)
│   │   ├── App.js          # Entry point React
│   │   └── index.js        # Bootstrap React
│   ├── package.json        # Dipendenze frontend
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

---

## ⚙️ Requisiti

- Node.js (>= 16)
- MongoDB (locale o in cloud)

---

## 🚀 Avvio del progetto

### 1️⃣ Avviare il backend
```sh
cd backend
npm install
npm start
```
👉 Il backend parte su `http://localhost:5000`  
👉 Database predefinito: `mongodb://localhost:27017/progettone_finale_react`  
(Modifica `backend/config/db.js` se necessario)

### 2️⃣ Avviare il frontend
In un nuovo terminale:
```sh
cd frontend
npm install
npm start
```
👉 Il frontend sarà disponibile su `http://localhost:3000`

---

## 🔐 Note

- Per la 2FA, usa un'app come **Google Authenticator** o **Authy** per scansionare il QR code.  
- L’utente admin può gestire tutti gli utenti e prodotti.  
- Le variabili di configurazione sensibili (es. `JWT_SECRET`) si trovano in `backend/config/auth.js`.  
  👉 In produzione, **usa variabili d’ambiente**!  

---

## 👨‍💻 Autore

**Valerio Bottari**

📧 Contatti: [LinkedIn](https://www.linkedin.com/in/valeriobottari/) | [GitHub](https://github.com/imvalez)

---
