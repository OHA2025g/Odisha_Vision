"""
Odisha Vision 2047 Portal - P2 Features Backend API Tests
Tests for:
1. Admin CRUD endpoints (PUT /api/admin/programs/{id}, districts, kpis, alerts)
2. District detail endpoint (GET /api/districts/{name})
3. Seed endpoint (POST /api/seed)
"""
import pytest
import requests
import os

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestDistrictDetailEndpoint:
    """Tests for GET /api/districts/{name} - District drill-down view"""
    
    def test_district_detail_khurda_returns_200(self):
        """Test GET /api/districts/Khurda returns 200 with district data"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        # Validate structure
        assert "district" in data
        assert "pillar_scores" in data
        assert "related_programs" in data
        assert "related_schemes" in data
        assert "related_kpis" in data
        
        print(f"✓ District detail for Khurda returned successfully")
    
    def test_district_detail_has_correct_district_data(self):
        """Test district detail returns correct district info"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        district = data["district"]
        assert district["name"] == "Khurda"
        assert "vision_score" in district
        assert "status" in district
        assert "characteristics" in district
        
        print(f"✓ District data: {district['name']} - Score: {district['vision_score']}")
    
    def test_district_detail_has_pillar_scores(self):
        """Test district detail returns pillar scores for radar chart"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        pillar_scores = data["pillar_scores"]
        expected_pillars = ["People First", "Rural Power", "Prosperity", "Tech Lead", "Governance"]
        
        for pillar in expected_pillars:
            assert pillar in pillar_scores, f"Missing pillar score: {pillar}"
            assert 0 <= pillar_scores[pillar] <= 100
        
        print(f"✓ Pillar scores: {pillar_scores}")
    
    def test_district_detail_has_related_programs(self):
        """Test district detail returns related programs"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        programs = data["related_programs"]
        assert isinstance(programs, list)
        assert len(programs) > 0
        
        # Check program structure
        for prog in programs:
            assert "id" in prog
            assert "name" in prog
            assert "pillar" in prog
            assert "status" in prog
        
        print(f"✓ Related programs: {len(programs)}")
    
    def test_district_detail_has_related_kpis(self):
        """Test district detail returns related KPIs"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        kpis = data["related_kpis"]
        assert isinstance(kpis, list)
        
        print(f"✓ Related KPIs: {len(kpis)}")
    
    def test_district_detail_has_related_schemes(self):
        """Test district detail returns related schemes"""
        response = requests.get(f"{BASE_URL}/api/districts/Khurda")
        assert response.status_code == 200
        data = response.json()
        
        schemes = data["related_schemes"]
        assert isinstance(schemes, list)
        
        print(f"✓ Related schemes: {len(schemes)}")
    
    def test_district_detail_case_insensitive(self):
        """Test district name lookup is case-insensitive"""
        response1 = requests.get(f"{BASE_URL}/api/districts/khurda")
        response2 = requests.get(f"{BASE_URL}/api/districts/KHURDA")
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        print(f"✓ Case-insensitive lookup works")
    
    def test_district_detail_not_found(self):
        """Test non-existent district returns 404"""
        response = requests.get(f"{BASE_URL}/api/districts/NonExistentDistrict")
        assert response.status_code == 404
        
        print(f"✓ Non-existent district returns 404")


class TestAdminProgramsEndpoint:
    """Tests for PUT /api/admin/programs/{id} - Admin program updates"""
    
    @pytest.fixture(autouse=True)
    def get_program_id(self):
        """Get a valid program ID for testing"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        programs = response.json()
        assert len(programs) > 0
        self.program = programs[0]
        self.program_id = programs[0]["id"]
    
    def test_update_program_status(self):
        """Test updating program status via admin endpoint"""
        original_status = self.program["status"]
        new_status = "At-risk" if original_status != "At-risk" else "On-track"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"status": new_status}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == new_status
        
        # Restore original status
        requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"status": original_status}
        )
        
        print(f"✓ Program status updated: {original_status} -> {new_status}")
    
    def test_update_program_progress(self):
        """Test updating program progress via admin endpoint"""
        original_progress = self.program.get("progress", 50)
        new_progress = 75.0
        
        response = requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"progress": new_progress}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["progress"] == new_progress
        
        # Restore original progress
        requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"progress": original_progress}
        )
        
        print(f"✓ Program progress updated: {original_progress} -> {new_progress}")
    
    def test_update_program_amount_spent(self):
        """Test updating program amount_spent via admin endpoint"""
        original_spent = self.program.get("amount_spent", 1000)
        new_spent = 5500.0
        
        response = requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"amount_spent": new_spent}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["amount_spent"] == new_spent
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={"amount_spent": original_spent}
        )
        
        print(f"✓ Program amount_spent updated: {original_spent} -> {new_spent}")
    
    def test_update_program_not_found(self):
        """Test updating non-existent program returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/programs/nonexistent-id",
            json={"status": "On-track"}
        )
        assert response.status_code == 404
        
        print(f"✓ Non-existent program returns 404")
    
    def test_update_program_empty_payload(self):
        """Test updating with empty payload returns 400"""
        response = requests.put(
            f"{BASE_URL}/api/admin/programs/{self.program_id}",
            json={}
        )
        assert response.status_code == 400
        
        print(f"✓ Empty payload returns 400")


class TestAdminDistrictsEndpoint:
    """Tests for PUT /api/admin/districts/{id} - Admin district updates"""
    
    @pytest.fixture(autouse=True)
    def get_district_id(self):
        """Get a valid district ID for testing"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        districts = response.json()
        assert len(districts) > 0
        self.district = districts[0]
        self.district_id = districts[0]["id"]
    
    def test_update_district_vision_score(self):
        """Test updating district vision_score via admin endpoint"""
        original_score = self.district["vision_score"]
        new_score = 90.0
        
        response = requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"vision_score": new_score}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["vision_score"] == new_score
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"vision_score": original_score}
        )
        
        print(f"✓ District vision_score updated: {original_score} -> {new_score}")
    
    def test_update_district_status(self):
        """Test updating district status via admin endpoint"""
        original_status = self.district["status"]
        new_status = "At-risk" if original_status != "At-risk" else "On-track"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"status": new_status}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == new_status
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"status": original_status}
        )
        
        print(f"✓ District status updated: {original_status} -> {new_status}")
    
    def test_update_district_pillar_scores(self):
        """Test updating district pillar scores via admin endpoint"""
        original_score = self.district["people_first_score"]
        new_score = 95.0
        
        response = requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"people_first_score": new_score}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["people_first_score"] == new_score
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/districts/{self.district_id}",
            json={"people_first_score": original_score}
        )
        
        print(f"✓ District people_first_score updated: {original_score} -> {new_score}")
    
    def test_update_district_not_found(self):
        """Test updating non-existent district returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/districts/nonexistent-id",
            json={"vision_score": 50}
        )
        assert response.status_code == 404
        
        print(f"✓ Non-existent district returns 404")


class TestAdminKPIsEndpoint:
    """Tests for PUT /api/admin/kpis/{id} - Admin KPI updates"""
    
    @pytest.fixture(autouse=True)
    def get_kpi_id(self):
        """Get a valid KPI ID for testing"""
        response = requests.get(f"{BASE_URL}/api/kpis")
        assert response.status_code == 200
        kpis = response.json()
        assert len(kpis) > 0
        self.kpi = kpis[0]
        self.kpi_id = kpis[0]["id"]
    
    def test_update_kpi_current_value(self):
        """Test updating KPI current_value via admin endpoint"""
        original_value = self.kpi["current_value"]
        new_value = "Updated Test Value"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/kpis/{self.kpi_id}",
            json={"current_value": new_value}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["current_value"] == new_value
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/kpis/{self.kpi_id}",
            json={"current_value": original_value}
        )
        
        print(f"✓ KPI current_value updated")
    
    def test_update_kpi_status(self):
        """Test updating KPI status via admin endpoint"""
        original_status = self.kpi["status"]
        new_status = "At-risk" if original_status != "At-risk" else "On-track"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/kpis/{self.kpi_id}",
            json={"status": new_status}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == new_status
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/kpis/{self.kpi_id}",
            json={"status": original_status}
        )
        
        print(f"✓ KPI status updated: {original_status} -> {new_status}")
    
    def test_update_kpi_not_found(self):
        """Test updating non-existent KPI returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/kpis/nonexistent-id",
            json={"status": "On-track"}
        )
        assert response.status_code == 404
        
        print(f"✓ Non-existent KPI returns 404")


class TestAdminAlertsEndpoint:
    """Tests for PUT /api/admin/alerts/{id} - Admin alert updates"""
    
    @pytest.fixture(autouse=True)
    def get_alert_id(self):
        """Get a valid alert ID for testing"""
        response = requests.get(f"{BASE_URL}/api/alerts")
        assert response.status_code == 200
        alerts = response.json()
        assert len(alerts) > 0
        self.alert = alerts[0]
        self.alert_id = alerts[0]["id"]
    
    def test_update_alert_status(self):
        """Test updating alert status via admin endpoint"""
        original_status = self.alert["status"]
        new_status = "Acknowledged" if original_status != "Acknowledged" else "Open"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/alerts/{self.alert_id}",
            json={"status": new_status}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == new_status
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/alerts/{self.alert_id}",
            json={"status": original_status}
        )
        
        print(f"✓ Alert status updated: {original_status} -> {new_status}")
    
    def test_update_alert_severity(self):
        """Test updating alert severity via admin endpoint"""
        original_severity = self.alert["severity"]
        new_severity = "Critical" if original_severity != "Critical" else "High"
        
        response = requests.put(
            f"{BASE_URL}/api/admin/alerts/{self.alert_id}",
            json={"severity": new_severity}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["severity"] == new_severity
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/admin/alerts/{self.alert_id}",
            json={"severity": original_severity}
        )
        
        print(f"✓ Alert severity updated: {original_severity} -> {new_severity}")
    
    def test_update_alert_not_found(self):
        """Test updating non-existent alert returns 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/alerts/nonexistent-id",
            json={"status": "Open"}
        )
        assert response.status_code == 404
        
        print(f"✓ Non-existent alert returns 404")


class TestSeedEndpoint:
    """Tests for POST /api/seed - Re-seed database"""
    
    def test_seed_endpoint_returns_200(self):
        """Test POST /api/seed returns 200"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        
        print(f"✓ Seed endpoint returned 200")
    
    def test_seed_restores_data(self):
        """Test seed endpoint restores data correctly"""
        # First seed
        requests.post(f"{BASE_URL}/api/seed")
        
        # Verify data exists
        programs_response = requests.get(f"{BASE_URL}/api/programs")
        districts_response = requests.get(f"{BASE_URL}/api/districts")
        
        assert programs_response.status_code == 200
        assert districts_response.status_code == 200
        assert len(programs_response.json()) == 36
        assert len(districts_response.json()) == 30
        
        print(f"✓ Seed restored 36 programs and 30 districts")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
