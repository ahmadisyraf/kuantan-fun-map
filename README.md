# Kuantan Fun Map

Kuantan Fun Map is a lightweight, mobile-friendly interactive web app that helps users discover and explore exciting places around Kuantan, from cozy cafes and scenic spots to hidden local gems.

Built using Next.js, MapLibre, Tailwind CSS, and enhanced with PWA support, the app is installable on mobile devices and works offline for a smooth and native-like experience.

## Setup

Clone the project

```bash
git clone https://github.com/ahmadisyraf/kuantan-fun-map.git
```

Install the dependencies

```bash
npm install
```

Create a .env file at the root of your project and define your environment variables as shown below:

```bash
NEXT_PUBLIC_GOOGLE_MAP_PLACE_API=<your-google-maps-api-key>
NEXT_PUBLIC_DATABASE_URL=<your-postgres-connection-string>
BETTER_AUTH_SECRET=<your-better-auth-secret>
BETTER_AUTH_URL=<your-better-auth-url>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

Run project

```bash
npm run dev
```
