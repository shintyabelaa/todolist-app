# Workspace Task Management App

Fast and responsive To Do List application built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. This app features persistent data structures stored entirely locally using the browser's LocalStorage API.

---

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Unit Testing:** Jest

---

## Features

- **Display Task List:** View your organized schedule in a clean, dual-column layout that tracks task statuses sequentially.
- **Add New Task:** Quickly create new items using an intuitive modal entry system equipped with validation handling.
- **Toggle Task Status (Done / Pending):** Seamlessly move items between active and completed states with real-time UI rendering updates.
- **Delete Task:** Permanently remove stale or unneeded items from both your active view and client-side storage arrays.
- **Form Validation:** Built-in validation constraints that prevent empty submissions and display real-time errors if required fields are missing.
- **Task Filtering Tabs (All / Completed / Pending) in Mobile View:** Instantly isolate and inspect your workload using dedicated view control criteria.
- **UI Responsive**
- **Unit Testing Using Jest**

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
git clone https://github.com/shintyabelaa/todolist-app.git
cd todolist-app
```

### 2. Install and Run dependencies

```bash
pnpm install
pnpm run dev
```

## Brief Architecture Explanation

This project follows Next.js **App Router Architecture**, optimized for performance, code readability, and technical stability :

1. **Routing & Parameter Handling:** The main application dashboard is served at `/workspace`, while individual task tracking details are mapped gracefully via standard nested dynamic parameters under `/workspace/[id]`.
2. **State Management & Persistence:** Handled cleanly using client-side React hooks (`useState`, `useEffect`) bound directly to the browser's `localStorage` API layer, removing unnecessary state-library overhead while guaranteeing cross-session persistence .
3. **Atomic Component Separation:** Highly reusable primitives (like `CardComponent` and `AddTaskDialog`) are separated from layout sheets into an isolated components directory to fulfill clean-code best practices .
4. **Resilient Testing Layer:** Integrated **Jest** and **React Testing Library** under a browser-mocking environment (`jest-environment-jsdom`) using explicit fake timers (`jest.useFakeTimers()`) to validate layout state mutations, asynchronous loading delays, and edge cases flawlessly .

---
