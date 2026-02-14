# HisabDesk — Personal Dashboard Module

==========================================================

Enterprise-grade **Financial Command Center**  
Part of: HisabDesk Personal Financial OS

This folder contains the complete dashboard system for:

Track → Analyze → Alert → Advise → AI Assist

Everything here is:
✓ modular  
✓ scalable  
✓ AI-integrated  
✓ production safe  

==========================================================


## 📦 Structure

dashboard/

  page.tsx
  layout.tsx
  loading.tsx
  error.tsx

  sections/
  cards/
  hooks/
  api/


==========================================================

## 🧠 Architecture

Server APIs → Hooks → UI Cards → Sections → Page

Never mix responsibilities.

Server:
- calculations
- DB

Hooks:
- fetching only

Cards:
- UI only

Sections:
- composition only


==========================================================

## 🤖 AI Integration

AI is mandatory across dashboard.

Flow:

metrics → context builder → /api/ai → safeRunAI → response

Never call OpenAI from client.


==========================================================

## Rules

DO:
✓ server calculations
✓ modular cards
✓ hooks for fetch

DON’T:
❌ duplicate logic
❌ heavy charts
❌ AI in client


==========================================================

Dashboard = Financial Command Center
