# Base Hospital - Patient Management System

A modern hospital patient management system built with Remix, featuring patient records and appointment scheduling.

## Features

- **Patient Management**
  - View and search patient records
  - Add new patients
  - Edit patient details (name, email, avatar, notes)
  - Mark patients as favorites
  - Delete patient records

- **Appointment Scheduling**
  - View all appointments
  - Schedule new appointments
  - Update appointment status (scheduled, completed, cancelled)
  - Filter appointments by patient, doctor, or reason

- **Modern UI**
  - Clean, responsive design
  - Dark sidebar navigation
  - Status badges for appointments
  - Smooth animations and transitions
  - Mobile-friendly layout

## Tech Stack

- **Framework**: Remix (React)
- **Language**: TypeScript
- **Styling**: CSS

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
app/
├── routes/
│   ├── _index.tsx          # Home page
│   ├── appointments.tsx    # Appointments page
│   ├── Patients.$PatientId.tsx       # Patient details
│   ├── Patients.$PatientId_.edit.tsx # Edit patient
│   ├── Patients.$PatientId.destroy.tsx # Delete patient
│   └── $.tsx              # Error boundary
├── data.ts                 # Patient data layer
├── appointments.ts         # Appointment data layer
├── app.css                 # Styles
└── root.tsx                # Root layout
```

## License

MIT
