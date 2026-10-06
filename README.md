# Maybank Place Finder

Two assessments in one system:

| Folder | What it is |
|---|---|
| [`maybankAssestment/`](maybankAssestment) | **Java backend:** Spring Boot 4 (Java 17) REST API with MSSQL |
| [`maybank-places-web/`](maybank-places-web) | **React frontend:** Google Places Autocomplete + map, Redux Toolkit + Redux Saga, Material UI |

The React app searches places on Google and can save one as a favourite. The favourite is stored in MSSQL through the Spring Boot API.

```
React (localhost:5173) ──► Google Maps JS API (autocomplete + map)
        │ REST
        ▼
Spring Boot API (localhost:8080) ──► Open-Meteo weather API (nested 3rd-party call)
        │ JDBC
        ▼
MSSQL  TESTDB
```

## Backend: requirement checklist

| # | Requirement | Where |
|---|---|---|
| 1 | Spring Boot application | `maybankAssestment/` |
| 2 | Maintainable project structure | `controller` → `service` → `repository`, plus `dto`, `entity`, `mapper`, `config`, `exception`, `logging` |
| 3 | API for clients + Postman collection | [`maybankAssestment/postman/`](maybankAssestment/postman) |
| 4 | Log every REQUEST & RESPONSE to a log file | `logging/RequestResponseLoggingFilter` → `logs/app.log` |
| 5 | MSSQL `TESTDB` + `@Transactional` on INSERT, UPDATE, GET | `service/impl/FavouritePlaceServiceImpl` |
| 6 | GET with pagination, 10 per page | `GET /api/v1/favourites?page=0` |
| 7 | API that calls a 3rd-party API | `GET /api/v1/favourites/{id}/weather` → Open-Meteo |

### Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/favourites` | Save a favourite place |
| `PUT` | `/api/v1/favourites/{id}` | Update a favourite |
| `GET` | `/api/v1/favourites/{id}` | Get one favourite |
| `GET` | `/api/v1/favourites?page=0&sort=createdAt,desc` | Paginated list (10 per page) |
| `GET` | `/api/v1/favourites/by-place?googlePlaceId=...` | Find by Google place id (404 if not a favourite) |
| `GET` | `/api/v1/favourites/{id}/weather` | Favourite + current weather from Open-Meteo |
| `DELETE` | `/api/v1/favourites/{id}` | Remove a favourite |

## Frontend: requirement checklist

| # | Requirement | Where |
|---|---|---|
| 1 | Autocomplete textbox using Google Places | `features/search/components/PlaceAutocomplete.jsx` |
| 2 | Redux stores results and every search | `features/search/searchSlice.js` (history persisted to localStorage) |
| 3 | Redux middleware | **Redux Saga**: `features/*/…Saga.js` |
| 4 | Styling | Material UI |
| 5 | Scalable structure | Feature-first folders: `features/search`, `map`, `favourites`, `notifications` |
| Optional | Hooks, custom hooks, HOC, functional components | `hooks/usePlaceSearch`, `hooks/useFavourites`, `hoc/withLoading` |
| Optional | Save favourite via Spring Boot into MSSQL | ☆ button → `features/favourites/favouritesSaga.js` |

## How to run

### Prerequisites
- JDK 17+, Node.js 20+
- SQL Server with a `TESTDB` database, TCP/IP on port 1433, and SQL Server authentication enabled
- A Google Maps Platform API key with **Maps JavaScript API** and **Places API (New)** enabled

### 1. Backend

```powershell
cd maybankAssestment
$env:DB_PASSWORD="<sa password>"   # optional: $env:DB_USERNAME (default sa), $env:SERVER_PORT (default 8080)
.\mvnw spring-boot:run
```

Hibernate creates the `favourite_place` table on first start. Import `postman/Maybank-Favourite-Places.postman_collection.json` into Postman to try the API. Request and response logs are written to `maybankAssestment/logs/app.log`.

### 2. Frontend

```powershell
cd maybank-places-web
copy .env.example .env    # then set VITE_GOOGLE_MAPS_API_KEY (and VITE_API_BASE_URL if the API isn't on 8080)
npm install
npm run dev
```

Open http://localhost:5173.

More detail on the frontend structure and data flow is in [`maybank-places-web/README.md`](maybank-places-web/README.md).

<img width="1047" height="586" alt="gambarpeta" src="https://github.com/user-attachments/assets/a869a488-2e20-4343-85d5-098eb69c8f7b" />

