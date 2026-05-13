# 🤖 Mingəçevir Robot Naviqasiya Sistemi

## Təsvir

Mingəçevir şəhərinin real xəritəsi daxilində robotun optimal marşrutunu hesablamaq və göstərmək üçün yaradılmış web sistemi.

### Əsas Xüsusiyyətlər:

✅ **A* Pathfinding Algoritmi** - Optimal marşrut hesablanması  
✅ **Reinforcement Learning** - Yol optimizasiyası  
✅ **Xəritə İnteqrasiyası** - Real Mingəçevir şəhərinin xəritəsi  
✅ **Alternativ Marşrutlar** - 3 müxtəlif yol seçimi  
✅ **Qapalı Yol İdarəsi** - Təmir zamanı yolları qapal/aç  
✅ **Robot Koordinatları** - Real vaxtda mövqe göstərməsi  
✅ **Piyada Keçidləri** - Piyada keçidlərini nəzərə alınması  
✅ **Maşın Hərəkəti** - Maşın hərəkətini simulyasiya  

## Texnologiya Stack'i

### Backend
- **Node.js** + Express.js
- **Python** (A* və RL algoritmlər)
- **OpenStreetMap API**

### Frontend
- **React** 18.2.0
- **Leaflet** (Xəritə)
- **Axios** (API çağırışları)
- **CSS3** (Modern dizayn)

## Quraşdırma

### 1. Proyekti klonla
```bash
git clone https://github.com/Farida-webb/Feride.git
cd Feride
```

### 2. Backend quraşdırması
```bash
npm install
```

### 3. Frontend quraşdırması
```bash
cd client
npm install
cd ..
```

## İstifadə

### Backend serverini başlat
```bash
npm start
```
Server `http://localhost:5000` adresində çalışacaq

### Frontend-i başlat (yeni terminal)
```bash
cd client
npm start
```
Uygulama `http://localhost:3000` adresində açılacaq

## API Endpoints

| Endpoint | Metod | Təsvir |
|----------|-------|--------|
| `/api/map-data` | GET | Xəritə məlumatları |
| `/api/calculate-route` | POST | Optimal marşrut |
| `/api/alternative-routes` | POST | Alternativ marşrutlar |
| `/api/close-road` | POST | Yolu qapal |
| `/api/open-road` | POST | Yolu aç |
| `/api/robot/start` | POST | Robot hərəkətini başlat |
| `/api/robot/status` | GET | Robot vəziyyəti |
| `/api/robot/stop` | POST | Robot dayandır |
| `/api/closed-roads` | GET | Qapalı yollar |

## Koordinatlar

- **Mingəçevir Səhər Girişi**: 40.7669°N, 48.6150°E
- **Sağ Sahil Mərkəzi**: 40.7650°N, 48.6200°E

## Sistem Arxitekturası

```
┌─────────────────────────────────────┐
│      React Frontend (Port 3000)     │
│  - Leaflet Xəritəsi                 │
│  - Robot Kontrolü                   │
│  - Marşrut Seçimi                   │
└────────────┬────────────────────────┘
             │
             │ HTTP/REST
             │
┌────────────▼────────────────────────┐
│    Express Backend (Port 5000)      │
│  - Route Calculation                │
│  - Robot State Management           │
│  - Road Management                  │
└────────────┬────────────────────────┘
             │
             │ Python Scripts
             │
┌────────────▼────────────────────────┐
│   A* & RL Algorithms (Python)       │
│  - Pathfinding                      │
│  - Optimization                     │
│  - Map Data Extraction              │
└─────────────────────────────────────┘
```

## Licenziya

MIT License - Sərbəst istifadə üçün

## Müəllif

👤 **Farida-webb**

## Əlaqə

📧 [GitHub Profili](https://github.com/Farida-webb)
