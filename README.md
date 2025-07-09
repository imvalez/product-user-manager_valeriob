# Gestionale Prodotti - Progettone Finale React (Valerio Bottari)

Questo progetto è una web app completa per la gestione di prodotti e utenti, con autenticazione sicura (inclusa autenticazione a due fattori), ruoli amministrativi e interfaccia moderna.  
Il backend è realizzato in Node.js/Express con MongoDB, mentre il frontend è sviluppato in React.

---

## Funzionalità principali

- **Gestione prodotti:** crea, modifica, attiva/disattiva prodotti.
- **Gestione utenti (solo admin):** crea, modifica, attiva/disattiva utenti e ruoli.
- **Autenticazione sicura:** login, registrazione, autenticazione a due fattori (2FA) con app Authenticator e codici di backup.
- **Ruoli:** utente normale e amministratore.
- **Interfaccia responsive** e user-friendly.

---

## Struttura del progetto

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

## Requisiti

- Node.js (>= 16)
- MongoDB (in locale o in cloud)

---

## Come avviare il progetto

### 1. Avvia il backend

```sh
cd backend
npm install
npm start
```

Il backend partirà su `http://localhost:5000` e si collegherà a MongoDB su `mongodb://localhost:27017/progettone_finale_react` (modifica in `backend/config/db.js` se necessario).

### 2. Avvia il frontend

Apri un nuovo terminale:

```sh
cd frontend
npm install
npm start
```

Il frontend sarà disponibile su `http://localhost:3000`.

---

## Note

- Per la 2FA, usa un'app come Google Authenticator o Authy per scansionare il QR code.
- L'utente admin può gestire tutti gli utenti e prodotti.
- Le variabili di configurazione sensibili (es. JWT_SECRET) sono in `backend/config/auth.js` (per produzione, usa variabili d'ambiente!).

---

## Autore

Valerio Bottari

---
