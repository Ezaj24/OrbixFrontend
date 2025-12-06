# ORBIX – AI Chat & Prompt Refinement Frontend  
A modern, premium-grade React interface for the ORBIX AI platform.  
Designed with professional UI/UX, smooth interactions, and a dual-mode workflow: **Chat** and **Refine**.

---

## ✨ Features

### 🔮 Dual AI Modes
- **Chat Mode:** Full conversational AI experience  
- **Refine Mode:** Two-panel workspace for rewriting or enhancing prompts

### 🎨 Custom ORBIX Logo
- Pure SVG (no images)
- Dynamic asteroid ring orbit animation
- Two sizes (header + center stage)

### 🌓 Dark / Light Theme
- Smooth theme switching with memory persistence  
- Fully Tailwind powered

### 📚 Chat System
- Chat sessions saved in localStorage  
- Switch between previous chats in sidebar  
- Clean, modern message UI  
- Copy-to-clipboard for AI messages  
- Auto-scroll behaviour

### ✏️ Prompt Refiner Workspace
- Side-by-side layout  
- Large input panel  
- Refined output with animations  
- Mode Selector (ChatGPT/Claude/Coding/Creative/Marketing/Teaching)  
- Language selector (English/Hindi/Urdu/Arabic/Spanish)

### 🧩 Modular Components
- `Logo.jsx`
- `ChatPage.jsx`
- `RefinePage.jsx`
- `ProfileMenu.jsx`
- `SettingsModal.jsx`
- Clean project structure

---

## 🛠️ Tech Stack
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Radix UI**
- **LocalStorage Persistence**
- **Custom Animations**

---

## 🔗 Backend API Expectations
The frontend communicates with two endpoints:

POST /chat
POST /refine


Backend returns:
``json
{ "response": "..." }

and
{ "refined": "..." }

▶️ Running Locally
npm install
npm run dev


📦 Production Ready

Fully responsive

Smooth interactions

Clean codebase

Works with any backend AI model

Made for the ORBIX AI platform.


---

# ✅ **ORBIX Backend — README.md (API Focused)**

``md
# ORBIX Backend (ASP.NET Core 9)

The backend powering the ORBIX AI platform.  
Provides two main AI endpoints: **Chat** and **Prompt Refinement**, using Groq’s free LLaMA models.

---

## 🚀 Features

### 💬 Chat API
- Natural conversation  
- Injected system message describing ORBIX  
- Stable, predictable responses  
- Works with any frontend

### ✏️ Prompt Refinement Engine
- Mode-aware (creative, coding, teaching, marketing, etc.)  
- Language-aware (English/Hindi/Urdu/Arabic/Spanish)  
- Cleans input  
- Returns structured refined text

### 🔐 Safe API Implementation
- No API keys stored in repo  
- No secrets committed  
- Config loaded from environment variables on deployment

---

## 📁 Project Structure

/Controllers
ChatController.cs
RefineController.cs
/Services
GroqService.cs
PromptRefiner.cs
Program.cs
appsettings.json (no secrets)


---

## 🔗 API Endpoints

### **1. Chat**
POST /chat
**Request**
``json
{ "input": "Hello" }
Response
{ "response": "Hi! I'm ORBIX, your AI assistant." }


2. Refine

POST /refine

{
  "input": "write email",
  "mode": "ChatGPT",
  "language": "English"
}

Response

{ "refined": "Here is a professionally rewritten version..." }


⚙️ Running Locally

Set environment variable:

setx GROQ_API_KEY "your_key_here"


Run:

dotnet run


Backend runs at:

http://localhost:5140

🧱 Tech Stack

ASP.NET Core 9

C#

Groq API (free models)

Dependency Injection

Controllers + Services architecture

🌐 Deployment Ready

This backend is optimized for:

Render

Railway

Azure App Service

DigitalOcean

Docker

No secrets stored in repo. Safe to deploy.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

ok. 
