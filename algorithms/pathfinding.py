import heapq
import math
from typing import List, Dict, Tuple, Optional

class AStarPathfinder:
    """A* algoritmi ilə optimal marşrut tapır"""
    
    def __init__(self, graph_data: Dict):
        self.nodes = graph_data.get('nodes', {})
        self.edges = graph_data.get('edges', [])
        self.closed_roads = set()
        self.build_adjacency_list()
    
    def build_adjacency_list(self):
        """Qrafiki bitişiklik siyahısına çevir"""
        self.graph = {}
        for node_id in self.nodes.keys():
            self.graph[node_id] = []
        
        for edge in self.edges:
            if not edge['is_closed']:
                source = edge['source']
                target = edge['target']
                weight = edge['length']
                self.graph[source].append((target, weight))
                self.graph[target].append((source, weight))
    
    def heuristic(self, node1_id: str, node2_id: str) -> float:
        """Haversine distansı"""
        node1 = self.nodes[node1_id]
        node2 = self.nodes[node2_id]
        
        lat1, lon1 = math.radians(node1['lat']), math.radians(node1['lon'])
        lat2, lon2 = math.radians(node2['lat']), math.radians(node2['lon'])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        R = 6371000
        
        return R * c
    
    def find_path(self, start_node: str, end_node: str) -> Tuple[List[str], float]:
        """A* algoritmi ilə optimal yolu tap"""
        open_set = [(0, start_node)]
        came_from = {}
        g_score = {node: float('inf') for node in self.nodes.keys()}
        g_score[start_node] = 0
        f_score = {node: float('inf') for node in self.nodes.keys()}
        f_score[start_node] = self.heuristic(start_node, end_node)
        
        while open_set:
            current_f, current = heapq.heappop(open_set)
            
            if current == end_node:
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                return path[::-1], g_score[end_node]
            
            for neighbor, distance in self.graph.get(current, []):
                tentative_g_score = g_score[current] + distance
                
                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + self.heuristic(neighbor, end_node)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
        
        return [], float('inf')
    
    def find_alternative_paths(self, start_node: str, end_node: str, num_paths: int = 3) -> List[Tuple[List[str], float]]:
        """Çoxsaylı alternativ yolları tap"""
        paths = []
        blocked_edges = set()
        
        for i in range(num_paths):
            if paths:
                last_path = paths[-1][0]
                for j in range(len(last_path) - 1):
                    blocked_edges.add((last_path[j], last_path[j+1]))
                    blocked_edges.add((last_path[j+1], last_path[j]))
            
            original_graph = self.graph.copy()
            for node in self.graph:
                self.graph[node] = [
                    (neighbor, dist) for neighbor, dist in original_graph[node]
                    if (node, neighbor) not in blocked_edges
                ]
            
            path, dist = self.find_path(start_node, end_node)
            self.graph = original_graph
            
            if path:
                paths.append((path, dist))
        
        return paths
    
    def close_road(self, source: str, target: str):
        """Yolu qapal"""
        for edge in self.edges:
            if (edge['source'] == source and edge['target'] == target) or \
               (edge['source'] == target and edge['target'] == source):
                edge['is_closed'] = True
        self.build_adjacency_list()
    
    def open_road(self, source: str, target: str):
        """Yolu aç"""
        for edge in self.edges:
            if (edge['source'] == source and edge['target'] == target) or \
               (edge['source'] == target and edge['target'] == source):
                edge['is_closed'] = False
        self.build_adjacency_list()


class RLPathOptimizer:
    """Reinforcement Learning ilə yolu optimizə edir"""
    
    def __init__(self, learning_rate=0.1, discount_factor=0.95):
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.q_values = {}
    
    def optimize_path_with_rl(self, graph_data: Dict, path: List[str], rewards: Dict):
        """RL istifadə edərək yolu optimizə et"""
        total_reward = 0
        for i in range(len(path) - 1):
            current_state = path[i]
            next_state = path[i + 1]
            
            state_action = (current_state, next_state)
            reward = rewards.get(state_action, 0)
            
            if state_action not in self.q_values:
                self.q_values[state_action] = 0
            
            self.q_values[state_action] += self.learning_rate * (
                reward + self.discount_factor * max(
                    [self.q_values.get((next_state, next_next), 0) 
                     for next_next in graph_data.get('nodes', {})]
                ) - self.q_values[state_action]
            )
            
            total_reward += reward
        
        return total_reward
