# Barber Booking

## Prerequisites
- Node.js 18+
- npm 9+

## Run Frontend
```bash
npm install
npm run dev
```
Frontend runs on Vite default URL (usually `http://localhost:5173`).

## Run API (json-server)
```bash
npm run api
```
By default this script runs:
```bash
json-server --watch db.json --port 3001
```
If needed, you can run json-server manually on a custom port.

## Default Accounts
Auth is localStorage-based (no real backend auth yet).

- Admin
  - email: `admin@barber.com`
  - password: any value (example: `admin123`)
  - role resolved as `admin`
- User
  - email: `user@barber.com`
  - password: any value (example: `user123`)
  - role resolved as `user`

## Tests and Coverage
Run tests:
```bash
npm test -- --run
```

Run coverage:
```bash
npm run test:coverage
```

## Feature List (Current)
- React + Vite SPA with `react-router-dom`
- Layout + pages routing (`Home`, `Services`, `Login`, `Register`, `My Reservations`, `Admin`)
- LocalStorage auth skeleton (`login`, `logout`, `current user`)
- Route guards:
  - protected routes for logged-in users
  - admin-only route for admin dashboard
- Services data from `json-server`
- Service details page
- Service booking page with available time slots
- Public holiday visual badge on matching time slots (Nager.Date API)
- Reservation creation and cancel flow
- Add reservation to calendar (`.ics`) download
- Admin dashboard minimal CRUD for services (list/add/delete)
- Vitest + React Testing Library test suite with API mocking and coverage
