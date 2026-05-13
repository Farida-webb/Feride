import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MapView.css';

export default function MapView() {
    const [mapData, setMapData] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(0);
    const [robotPosition, setRobotPosition] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [closedRoads, setClosedRoads] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await axios.get(`${API_URL}/map-data`);
                setMapData(response.data.data);
                setRobotPosition(response.data.data.key_locations.start_point);
                setLoading(false);
            } catch (error) {
                console.error('Xəritə yüklənmədi:', error);
                setLoading(false);
            }
        };
        fetchMapData();
    }, []);

    const calculateRoute = async () => {
        try {
            const response = await axios.post(`${API_URL}/calculate-route`, {
                start_id: 'start',
                end_id: 'end'
            });
            setRoutes([response.data.path]);
            setSelectedRoute(0);
        } catch (error) {
            console.error('Marşrut hesablanmadı:', error);
        }
    };

    const getAlternativeRoutes = async () => {
        try {
            const response = await axios.post(`${API_URL}/alternative-routes`, {
                start_id: 'start',
                end_id: 'end',
                num_routes: 3
            });
            setRoutes(response.data.routes.map(r => r.path));
        } catch (error) {
            console.error('Alternativ marşrutlar alınmadı:', error);
        }
    };

    const startRobot = async () => {
        if (routes.length === 0) {
            alert('Əvvəlcə marşrut hesablayın!');
            return;
        }
        try {
            await axios.post(`${API_URL}/robot/start`, {
                path: routes[selectedRoute]
            });
            setIsMoving(true);
        } catch (error) {
            console.error('Robot başlatılmadı:', error);
        }
    };

    const stopRobot = async () => {
        try {
            await axios.post(`${API_URL}/robot/stop`);
            setIsMoving(false);
        } catch (error) {
            console.error('Robot dayandırılmadı:', error);
        }
    };

    if (loading || !mapData) {
        return <div className="loading">Xəritə yüklənir...</div>;
    }

    return (
        <div className="map-view">
            <div className="map-container">
                <div style={{
                    height: '600px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    borderRadius: '12px'
                }}>
                    📍 Mingəçevir Xəritəsi
                </div>
            </div>

            <div className="control-panel">
                <h2>🤖 Mingəçevir Robot Naviqasiya Sistemi</h2>

                <div className="button-group">
                    <button onClick={calculateRoute} className="btn btn-primary">
                        Optimal Marşrut Hesabla
                    </button>
                    <button onClick={getAlternativeRoutes} className="btn btn-secondary">
                        Alternativ Marşrutlar
                    </button>
                </div>

                <div className="robot-control">
                    {isMoving ? (
                        <button onClick={stopRobot} className="btn btn-danger">
                            ⏹️ Robotu Dayandır
                        </button>
                    ) : (
                        <button onClick={startRobot} className="btn btn-success">
                            ▶️ Robotu Başlat
                        </button>
                    )}
                </div>

                {robotPosition && (
                    <div className="robot-info">
                        <h3>Robot Vəziyyəti:</h3>
                        <p><strong>Latitude:</strong> {robotPosition.lat.toFixed(6)}</p>
                        <p><strong>Longitude:</strong> {robotPosition.lon.toFixed(6)}</p>
                        <p><strong>Status:</strong> {isMoving ? '🟢 Hərəkət etməkdə' : '🔴 Durğun'}</p>
                    </div>
                )}

                {routes.length > 0 && (
                    <div className="routes-info">
                        <h3>Marşrutlar:</h3>
                        {routes.map((route, index) => (
                            <div key={index} className="route-item">
                                <input
                                    type="radio"
                                    name="route"
                                    checked={selectedRoute === index}
                                    onChange={() => setSelectedRoute(index)}
                                />
                                <label>Marşrut {index + 1}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
