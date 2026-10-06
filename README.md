# Luno

A simple and focused Pomodoro timer for staying productive without unnecessary complexity.

Luno helps you focus on one task at a time using the Pomodoro technique, with automatic breaks and lightweight task management.

## Features

- Create, complete, and delete tasks
- Select a task to focus on
- Pomodoro timer
- Short and long breaks
- Automatic Pomodoro/break transitions
- Pomodoro progress tracking
- Pause, resume, and reset timer
- Persistent tasks and timer-related state using local storage
- Responsive UI
- Keyboard-accessible controls

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- CSS

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/tommyprmbd/luno.git
cd luno
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL shown by Vite.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run test` | Run the test suite |
| `npm run lint` | Run ESLint |

## How It Works

Luno follows the standard Pomodoro cycle:

```text
Pomodoro
   ↓
Short Break
   ↓
Pomodoro
   ↓
Short Break
   ↓
Pomodoro
   ↓
Short Break
   ↓
Pomodoro
   ↓
Long Break
   ↓
Repeat
```

After four completed Pomodoro sessions, Luno starts a long break and resets the Pomodoro progress when the long break finishes.

## Project Structure

```text
src/
├── components/
│   ├── Header/
│   ├── Tasks/
│   └── Timer/
├── constants/
├── hooks/
├── types/
├── App.tsx
└── main.tsx
```

The project keeps the application intentionally small and separates UI components, hooks, types, and constants to keep the codebase easy to understand and maintain.

## Testing

Run the test suite with:

```bash
npm run test
```

Tests cover the main timer, task, component, hook, and application behaviors.

## Production Build

Create a production build with:

```bash
npm run build
```

The generated files are placed in the `dist/` directory.

## Contributing

Contributions, ideas, and improvements are welcome.

For larger changes, please open an issue first to discuss the proposed change.

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.