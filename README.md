# Odisha Vision 2047 Portal

A comprehensive governance dashboard for tracking Odisha's development goals across 6 strategic pillars, 26 sectors, 96 goals, and 236 KPIs - targeting Vision 2036 & 2047.

## Tech Stack
- **Backend**: Python FastAPI + MongoDB
- **Frontend**: React 18 + Tailwind CSS + Shadcn UI + Recharts + React-Leaflet
- **Database**: MongoDB 6+

## Quick Start (Docker)

```bash
docker-compose up --build
```
Then open: **http://localhost:3000**

## Manual Setup

### Prerequisites
- Node.js 18+ & Yarn
- Python 3.11+
- MongoDB 6+ (running on localhost:27017)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
cp .env.local .env
# Edit .env if your MongoDB URL differs

# Start backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install

# Set environment variables
cp .env.local .env

# Start frontend
yarn start
```

### Seed Database
```bash
# After both services are running:
curl -X POST http://localhost:8001/api/seed
```

### Import Database (Alternative)
If you want to import the pre-built database directly:
```bash
cd database
for f in *.json; do
  collection="${f%.json}"
  mongoimport --db odisha_vision_2047 --collection "$collection" --file "$f" --jsonArray --drop
done
```

## Project Structure
```
├── backend/
│   ├── server.py              # FastAPI server (all endpoints)
│   ├── vision_kpis_data.json  # 236 KPIs from Excel
│   ├── requirements.txt
│   └── .env.local
├── frontend/
│   ├── src/
│   │   ├── App.js             # Routes + providers
│   │   ├── contexts/          # Theme + Language providers
│   │   ├── components/        # Sidebar, Maps, UI
│   │   ├── pages/             # All dashboard pages
│   │   └── utils/             # Export utilities
│   ├── public/data/           # GeoJSON files
│   └── .env.local
├── database/                  # MongoDB JSON exports
├── Odisha_Vision_Mapping.xlsx # Source Excel data
├── docker-compose.yml
└── README.md
```

## Features
- **Landing Page**: Hero, role selection, interactive Odisha map, news links
- **Dashboard**: 6 pillar overview with KPI stats
- **36 Flagship Programs**: Filterable table with status tracking
- **District Performance**: Interactive map + 30 district cards
- **District Drill-Down**: Per-district radar charts, programs, KPIs
- **District Comparison**: Side-by-side (up to 4 districts)
- **Vision 2047 Metrics**: 236 KPIs with Pillar→Sector→Goal→Outcome hierarchy
- **KPIs, Budget, Alerts, GSDP, Schemes, Sectors** pages
- **Admin Panel**: Inline CRUD for all data
- **Notifications**: Alert center with email preferences
- **Export**: Excel & PDF on all data pages
- **Dark Mode** + **Multi-language (English/Odia)**

## Roles (No Password Required)
1. Chief Minister
2. Principal Secretary
3. Deputy Secretary
4. District Collector
5. Programme Manager

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard-summary | Dashboard stats |
| GET | /api/pillars | 6 strategic pillars |
| GET | /api/programs | 36 flagship programs |
| GET | /api/districts | 30 districts |
| GET | /api/districts/{name} | District detail + related data |
| GET | /api/kpis | KPI indicators |
| GET | /api/budget | Budget data |
| GET | /api/alerts | AI alerts |
| GET | /api/gsdp | GSDP trends |
| GET | /api/schemes | Schemes master |
| GET | /api/sectors | Sectors & goals |
| GET | /api/vision-kpis | 236 Excel-based KPIs |
| GET | /api/vision-kpis/summary | Pillar summary |
| GET | /api/vision-kpis/sector/{name} | Sector detail |
| GET | /api/notifications | Notifications list |
| GET | /api/notification-prefs | Email preferences |
| PUT | /api/admin/programs/{id} | Update program |
| PUT | /api/admin/districts/{id} | Update district |
| POST | /api/seed | Re-seed database |
