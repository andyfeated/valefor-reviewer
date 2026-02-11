# Valefor Reviewer

Open-source, AI powered pull request reviewer.

## Architecture

Valefor Reviewer is a full-stack application with a **NestJS** backend and a **React/Vite** frontend. The system handles reviews asynchronously to keep the UI responsive. It connects to **Git Providers** (GitHub/GitLab) to fetch code, uses **OpenRouter** for AI analysis, and stores results in **PostgreSQL** via **Prisma**.

### Review Process

The review process is broken down into synchronous validation and asynchronous analysis:

1.  **Trigger & Validation**:
    -   When a review is requested, the system first checks rate limits and validates the PR URL.
    -   It fetches the PR metadata and performs **Smart Validation** to decide if the PR is reviewable (e.g., checking for token limits and file counts).

2.  **Smart Filtering**:
    To save tokens and reduce noise, specific files are automatically excluded:
    -   **Extensions**: Only supported code files (e.g., `.ts`, `.js`, `.py`, `.go`) are analyzed.
    -   **Test Files**: Files matching patterns like `*.test.ts`, `__tests__`, or `*.spec.js` are skipped.
    -   **Noise**: Directories like `node_modules`, `dist`, and `vendor` are ignored.
    -   **Size**: Extremely large files are skipped to prevent context window overflow.

3.  **Asynchronous Analysis**:
    -   Once validated, the diffs are dispatched to a background process (`dispatchSendDiffsToLlm`).
    -   The server immediately responds to the client, while the analysis continues in the background.
    -   The AI (via OpenRouter) critiques the code, focusing on correctness, security, and maintainability.

4.  **Storage & Result**:
    -   The AI's feedback is parsed and stored in the PostgreSQL database.
    -   The client displays the review results, categorized by criticality (Critical, Major, Minor).

## Screenshots

![valefor-preview](https://github.com/user-attachments/assets/ee69a93c-2d52-406f-81f1-2b05e3c6cf57)

<img width="1831" height="950" alt="image" src="https://github.com/user-attachments/assets/6cf3d710-9726-4fdd-bc67-45239a55adc4" />

<img width="1832" height="960" alt="image" src="https://github.com/user-attachments/assets/035d4fb0-b905-4e54-9863-47593ef6df1d" />

## Tech Stack

-   **Frontend**: React, Vite
-   **Backend**: NestJS, Prisma, PostgreSQL
-   **AI**: OpenRouter
