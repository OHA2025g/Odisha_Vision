"""
Odisha Vision 2047 Portal - Backend API Tests
Tests all API endpoints for the Odisha Vision 2047 PMIS Dashboard
"""
import pytest
import requests
import os

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndInit:
    """Health check and initialization tests"""
    
    def test_root_api_endpoint(self):
        """Test root API endpoint returns correct message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Odisha Vision 2047" in data["message"]
        print(f"✓ Root API: {data['message']}")
    
    def test_init_endpoint_returns_seeded_status(self):
        """Test /api/init endpoint returns seeded status"""
        response = requests.post(f"{BASE_URL}/api/init")
        assert response.status_code == 200
        data = response.json()
        assert "seeded" in data or "message" in data
        print(f"✓ Init endpoint: {data}")


class TestDashboardSummary:
    """Dashboard summary endpoint tests - validates correct counts"""
    
    def test_dashboard_summary_returns_correct_counts(self):
        """Test dashboard-summary returns correct district, program, pillar counts"""
        response = requests.get(f"{BASE_URL}/api/dashboard-summary")
        assert response.status_code == 200
        data = response.json()
        
        # Validate structure
        assert "total_districts" in data
        assert "total_programs" in data
        assert "total_pillars" in data
        
        # Validate counts - 30 districts, 36 programs, 6 pillars
        assert data["total_districts"] == 30, f"Expected 30 districts, got {data['total_districts']}"
        assert data["total_programs"] == 36, f"Expected 36 programs, got {data['total_programs']}"
        assert data["total_pillars"] == 6, f"Expected 6 pillars, got {data['total_pillars']}"
        
        print(f"✓ Dashboard Summary: {data['total_districts']} districts, {data['total_programs']} programs, {data['total_pillars']} pillars")
    
    def test_dashboard_summary_has_budget_info(self):
        """Test dashboard-summary includes budget information"""
        response = requests.get(f"{BASE_URL}/api/dashboard-summary")
        assert response.status_code == 200
        data = response.json()
        
        assert "total_budget" in data
        assert data["total_budget"] > 0
        print(f"✓ Total Budget: ₹{data['total_budget']} Cr")


class TestDistrictsAPI:
    """Districts API tests - validates exactly 30 districts (no duplicates)"""
    
    def test_districts_returns_exactly_30(self):
        """Test /api/districts returns exactly 30 districts (not 60 duplicated)"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) == 30, f"Expected 30 districts, got {len(data)} - possible duplication issue"
        print(f"✓ Districts count: {len(data)}")
    
    def test_districts_have_required_fields(self):
        """Test each district has required fields for map and table display"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = [
            "id", "name", "vision_score", "mom_change", "status",
            "people_first_score", "rural_power_score", "prosperity_score",
            "tech_lead_score", "governance_score"
        ]
        
        for district in data:
            for field in required_fields:
                assert field in district, f"District {district.get('name', 'unknown')} missing field: {field}"
        
        print(f"✓ All districts have required fields")
    
    def test_districts_have_unique_names(self):
        """Test all district names are unique (no duplicates)"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        names = [d["name"] for d in data]
        unique_names = set(names)
        
        assert len(names) == len(unique_names), f"Duplicate district names found: {len(names)} total, {len(unique_names)} unique"
        print(f"✓ All {len(unique_names)} district names are unique")
    
    def test_districts_vision_scores_in_valid_range(self):
        """Test all vision scores are between 0 and 100"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        for district in data:
            score = district["vision_score"]
            assert 0 <= score <= 100, f"District {district['name']} has invalid vision_score: {score}"
        
        print(f"✓ All vision scores in valid range (0-100)")


class TestProgramsAPI:
    """Programs API tests - validates exactly 36 flagship programs"""
    
    def test_programs_returns_exactly_36(self):
        """Test /api/programs returns exactly 36 flagship programs"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) == 36, f"Expected 36 programs, got {len(data)}"
        print(f"✓ Programs count: {len(data)}")
    
    def test_programs_have_required_fields(self):
        """Test each program has required fields"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = ["id", "name", "pillar", "department", "status", "progress"]
        
        for program in data:
            for field in required_fields:
                assert field in program, f"Program {program.get('name', 'unknown')} missing field: {field}"
        
        print(f"✓ All programs have required fields")
    
    def test_programs_have_valid_status(self):
        """Test all programs have valid status values"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        valid_statuses = ["On-track", "At-risk", "Delayed", "Planned"]
        
        for program in data:
            assert program["status"] in valid_statuses, f"Program {program['name']} has invalid status: {program['status']}"
        
        print(f"✓ All programs have valid status values")


class TestPillarsAPI:
    """Pillars API tests - validates 6 strategic pillars"""
    
    def test_pillars_returns_exactly_6(self):
        """Test /api/pillars returns exactly 6 strategic pillars"""
        response = requests.get(f"{BASE_URL}/api/pillars")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 pillars, got {len(data)}"
        print(f"✓ Pillars count: {len(data)}")
    
    def test_pillars_have_correct_names(self):
        """Test pillars have the expected names"""
        response = requests.get(f"{BASE_URL}/api/pillars")
        assert response.status_code == 200
        data = response.json()
        
        expected_pillars = ["People First", "Rural Power", "Prosperity", "Tech Lead", "Legacy", "Governance"]
        pillar_names = [p["name"] for p in data]
        
        for expected in expected_pillars:
            assert expected in pillar_names, f"Missing pillar: {expected}"
        
        print(f"✓ All 6 strategic pillars present: {pillar_names}")


class TestOtherEndpoints:
    """Tests for other API endpoints"""
    
    def test_kpis_endpoint(self):
        """Test /api/kpis returns KPI data"""
        response = requests.get(f"{BASE_URL}/api/kpis")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ KPIs count: {len(data)}")
    
    def test_budget_endpoint(self):
        """Test /api/budget returns budget data"""
        response = requests.get(f"{BASE_URL}/api/budget")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ Budget departments: {len(data)}")
    
    def test_alerts_endpoint(self):
        """Test /api/alerts returns AI alerts"""
        response = requests.get(f"{BASE_URL}/api/alerts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Alerts count: {len(data)}")
    
    def test_gsdp_endpoint(self):
        """Test /api/gsdp returns GSDP data"""
        response = requests.get(f"{BASE_URL}/api/gsdp")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ GSDP data points: {len(data)}")
    
    def test_schemes_endpoint(self):
        """Test /api/schemes returns schemes data"""
        response = requests.get(f"{BASE_URL}/api/schemes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ Schemes count: {len(data)}")
    
    def test_sectors_endpoint(self):
        """Test /api/sectors returns sectors data"""
        response = requests.get(f"{BASE_URL}/api/sectors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Sectors count: {len(data)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
