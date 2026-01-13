# 🩸 LifeFlow | Premium Blood Management System

![LifeFlow Banner](https://images.unsplash.com/photo-1615461166324-cd9f9a46677c?q=80&w=2000)

**LifeFlow** is a next-generation blood management ecosystem designed to bridge the gap between donors and those in need. Built with a focus on speed, safety, and a premium user experience.

---

## ✨ Key Features

### 🛡️ Advanced Biometric Login

- **Realistic Face ID:** High-fidelity biometric facial scanning using `react-webcam`.
- **Two-Factor Safety:** Secure credentials check followed by biometric identity confirmation.

### 🗺️ Smart Map Integration

- **Real-Time Tracking:** Locate nearest hospitals and verified donors instantly.
- **Mapbox Visuals:** Ultra-premium "Silver/Dark" map tiles with predictive routing.
- **Dynamic Fallbacks:** Intelligently populates data even during network outages.

### 🤖 MEDI_PRINCE AI Chatbot

- **Gemini Powered:** Medical intelligence assistant for handling health queries.
- **Voice Recognition:** Natural language processing for hands-free coordination.

### 📊 Real-Time Analytics

- **Live Stats:** Dynamic counters for "Lives Saved", "Active Donors", and "Blood Units".
- **Predictive AI:** High-accuracy inventory forecasting to prevent shortages.

---

## 🛠️ Technology Stack

| Layer            | Technologies                                              |
| ---------------- | --------------------------------------------------------- |
| **Frontend**     | React 19, Vite, Tailwind CSS, Framer Motion, Lucide icons |
| **Backend**      | Node.js, Express, Sequelize                               |
| **Database**     | PostgreSQL                                                |
| **Integrations** | Leaflet.js, Mapbox API, Google Gemini AI                  |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the Repo:**

   ```bash
   git clone https://github.com/PriyanshuMohanty2611/BLOOD_BANK_MANAGEMENT.git
   cd BLOOD_BANK_MANAGEMENT
   ```

2. **Frontend Setup:**

   ```bash
   cd client
   npm install
   # Create a .env file and add your Mapbox Token:
   # VITE_MAPBOX_ACCESS_TOKEN=your_token_here
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd ../server
   npm install
   # Configure your .env with PostgreSQL credentials
   npm start
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributors

- **Priyanshu Mohanty** - Lead Developer & Architect

---

_Made with ❤️ by Team LifeFlow_
