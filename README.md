# Workspace Task Management App

Fast and responsive Task Management application built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. This app features persistent data structures stored entirely locally using the browser's LocalStorage API.

---

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React

---

## Features

- **Multi-Workspace Isolation:** Create, manage, and switch between dynamic task environments.
- **Interactive Mobile View:** Quick-toggle tab status badges customized for mobile interfaces (`md:hidden`) to seamlessly filter column views.
- **Native Error Boundaries:** Safe state-intercept error triggers bound cleanly to Next.js `error.tsx` layouts and `loading.tsx` suspense skeletons.

---

## Prerequisites

Before running this project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- [npm](https://www.npmjs.com/) or yarn / pnpm

---

## Getting Started & Installation

Follow these steps to spin up the development server on your machine:

### 1. Clone the Repository

```bash
git clone https://github.com/shintyabelaa/multi-workspace-task-app.git
cd workspace-task-app
```

### 2. Install and Run dependencies

```bash
pnpm install
pnpm run dev
```

## Struktur Navigasi & URL Dinamis

- **Main page / Direktori:** workspace/[workspaceId]
- **Task Detail Page:** workspace/[workspaceId]/[id]
