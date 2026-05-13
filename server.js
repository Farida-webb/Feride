const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Mingəçevir xəritə məlumatları
let mapData = {
    city: "Mingachevir, Azerbaijan",
    nodes: {},
    edges: [],
    pedestrian_crossings: [],
    key_locations: {
        start_point: {
            name: "Mingəçevir Səhər Girişi",
            lat: 40.7669,
            lon: 48.6150,
            id: "start"
        },
        end_point: {
            name: "Sağ Sahil Mərkəzi",
            lat: 40.7650,
            lon: 48.6200,
            id: "end"
        }
    },
    bounds: {
        north: 40.7750,
        south: 40.7600,
        east: 48.6250,
        west: 48.6050
    }
};

// Robot vəziyyəti
let robotState = {
    current_position: { lat: 40.7669, lon: 48.6150 },
    target_position: { lat: 40.7650, lon: 48.6200 },
    current_path: [],
    status: "idle",
    speed: 5,
    timestamp: new Date()
};

// API ENDPOINTS

// 1. Xəritə məlumatlarını al
app.get('/api/map-data', (req, res) => {
    res.json({
        success: true,
        data: mapData,
        message: "Mingəçevir xəritə məlumatları"
    });
});

// 2. Optimal marşrutu hesabla (A*)
app.post('/api/calculate-route', (req, res) => {
    const simulatedPath = [
        { lat: 40.7669, lon: 48.6150, node_id: "start" },
        { lat: 40.7668, lon: 48.6155, node_id: "node_1" },
        { lat: 40.7665, lon: 48.6165, node_id: "node_2" },
        { lat: 40.7660, lon: 48.6180, node_id: "node_3" },
        { lat: 40.7655, lon: 48.6190, node_id: "node_4" },
        { lat: 40.7650, lon: 48.6200, node_id: "end" }
    ];
    
    res.json({
        success: true,
        path: simulatedPath,
        distance: 850,
        estimated_time: 612,
        algorithm: "A*",
        message: "Optimal marşrut hesablandı"
    });
});

// 3. Alternativ marşrutları al
app.post('/api/alternative-routes', (req, res) => {
    const routes = [
        {
            route_id: 1,
            name: "Birinci alternativ",
            distance: 850,
            time: 612,
            path: [{ lat: 40.7669, lon: 48.6150 }, { lat: 40.7650, lon: 48.6200 }]
        },
        {
            route_id: 2,
            name: "İkinci alternativ",
            distance: 950,
            time: 720,
            path: [{ lat: 40.7669, lon: 48.6150 }, { lat: 40.7650, lon: 48.6200 }]
        },
        {
            route_id: 3,
            name: "Üçüncü alternativ",
            distance: 1100,
            time: 840,
            path: [{ lat: 40.7669, lon: 48.6150 }, { lat: 40.7650, lon: 48.6200 }]
        }
    ];
    
    res.json({
        success: true,
        routes: routes,
        message: "Alternativ marşrutlar tapıldı"
    });
});

// 4. Yolu qapal
app.post('/api/close-road', (req, res) => {
    const { source_node, target_node, reason } = req.body;
    
    res.json({
        success: true,
        message: `Yol qapalı: ${source_node} -> ${target_node}`,
        reason: reason
    });
});

// 5. Yolu aç
app.post('/api/open-road', (req, res) => {
    const { source_node, target_node } = req.body;
    
    res.json({
        success: true,
        message: `Yol açıldı: ${source_node} -> ${target_node}`
    });
});

// 6. Robot hərəkətini başlat
app.post('/api/robot/start', (req, res) => {
    const { path } = req.body;
    
    robotState.current_path = path;
    robotState.status = "moving";
    robotState.timestamp = new Date();
    
    res.json({
        success: true,
        robot_state: robotState,
        message: "Robot hərəkət başladı"
    });
});

// 7. Robot durumu al
app.get('/api/robot/status', (req, res) => {
    if (robotState.status === "moving" && robotState.current_path.length > 0) {
        const randomIndex = Math.floor(Math.random() * robotState.current_path.length);
        robotState.current_position = robotState.current_path[randomIndex];
    }
    
    res.json({
        success: true,
        robot: robotState,
        message: "Robot vəziyyəti"
    });
});

// 8. Robot dayandır
app.post('/api/robot/stop', (req, res) => {
    robotState.status = "idle";
    robotState.current_path = [];
    
    res.json({
        success: true,
        robot_state: robotState,
        message: "Robot dayandırıldı"
    });
});

// 9. Qapalı yolları al
app.get('/api/closed-roads', (req, res) => {
    res.json({
        success: true,
        closed_roads: [],
        count: 0,
        message: "Qapalı yollar"
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: "Server çalışır",
        timestamp: new Date()
    });
});

// ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message,
        message: "Serverdə xəta baş verdi"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışır`);
    console.log(`📍 Mingəçevir Robot Naviqasiya Sistemi başladı`);
});

module.exports = app;
