"""
Test suite for Vision 2047 Metrics API endpoints
Tests: GET /api/vision-kpis, /api/vision-kpis/summary, /api/vision-kpis/sector/{name}
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestVisionKPIsAPI:
    """Vision KPIs endpoint tests"""
    
    def test_get_all_vision_kpis_returns_236(self):
        """GET /api/vision-kpis should return exactly 236 KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 236, f"Expected 236 KPIs, got {len(data)}"
        
    def test_vision_kpi_structure(self):
        """Each KPI should have required fields"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        
        # Check first KPI has all required fields
        kpi = data[0]
        required_fields = ['id', 'pillar', 'sector', 'goal', 'theme', 
                          'strategic_initiative', 'key_outcome', 'unit',
                          'current', 'target_2026', 'target_2029', 'target_2036', 'target_2047']
        for field in required_fields:
            assert field in kpi, f"Missing field: {field}"
            
    def test_filter_by_pillar_people_first(self):
        """GET /api/vision-kpis?pillar=People First should return only People First KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis?pillar=People%20First")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 70, f"Expected 70 People First KPIs, got {len(data)}"
        
        # Verify all returned KPIs are People First
        for kpi in data:
            assert kpi['pillar'] == 'People First', f"Got pillar: {kpi['pillar']}"
            
    def test_filter_by_pillar_rural_empowerment(self):
        """GET /api/vision-kpis?pillar=Rural Empowerment should return Rural Empowerment KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis?pillar=Rural%20Empowerment")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 49, f"Expected 49 Rural Empowerment KPIs, got {len(data)}"
        
    def test_filter_by_pillar_prosperity_for_all(self):
        """GET /api/vision-kpis?pillar=Prosperity for All should return Prosperity KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis?pillar=Prosperity%20for%20All")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 85, f"Expected 85 Prosperity for All KPIs, got {len(data)}"


class TestVisionKPIsSummary:
    """Vision KPIs summary endpoint tests"""
    
    def test_summary_returns_6_pillars(self):
        """GET /api/vision-kpis/summary should return 6 pillars"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/summary")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 pillars, got {len(data)}"
        
    def test_summary_pillar_structure(self):
        """Each pillar summary should have required fields"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/summary")
        assert response.status_code == 200
        data = response.json()
        
        for pillar in data:
            assert 'pillar' in pillar
            assert 'sectors' in pillar
            assert 'total_kpis' in pillar
            assert 'sector_count' in pillar
            assert isinstance(pillar['sectors'], list)
            
    def test_summary_total_kpis_equals_236(self):
        """Sum of all pillar KPIs should equal 236"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/summary")
        assert response.status_code == 200
        data = response.json()
        
        total = sum(p['total_kpis'] for p in data)
        assert total == 236, f"Expected total 236 KPIs, got {total}"
        
    def test_summary_total_sectors_equals_26(self):
        """Sum of all sectors should equal 26"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/summary")
        assert response.status_code == 200
        data = response.json()
        
        total_sectors = sum(p['sector_count'] for p in data)
        assert total_sectors == 26, f"Expected 26 sectors, got {total_sectors}"
        
    def test_summary_pillar_names(self):
        """Verify all 6 pillar names are correct"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/summary")
        assert response.status_code == 200
        data = response.json()
        
        expected_pillars = {
            'People First', 'Rural Empowerment', 'Prosperity for All',
            'Our Legacy - Our Pride', 'Technology Leading the Way', 'People-Centric Governance'
        }
        actual_pillars = {p['pillar'] for p in data}
        assert actual_pillars == expected_pillars, f"Pillar mismatch: {actual_pillars}"


class TestVisionKPIsSectorDetail:
    """Vision KPIs sector detail endpoint tests"""
    
    def test_sector_women_led_growth(self):
        """GET /api/vision-kpis/sector/Women-led Growth should return sector detail"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/sector/Women-led%20Growth")
        assert response.status_code == 200
        data = response.json()
        
        assert data['sector'] == 'Women-led Growth'
        assert data['pillar'] == 'People First'
        assert data['total_kpis'] == 17, f"Expected 17 KPIs, got {data['total_kpis']}"
        assert len(data['goals']) == 4, f"Expected 4 goals, got {len(data['goals'])}"
        
    def test_sector_detail_structure(self):
        """Sector detail should have goals with themes and KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/sector/Women-led%20Growth")
        assert response.status_code == 200
        data = response.json()
        
        assert 'sector' in data
        assert 'pillar' in data
        assert 'total_kpis' in data
        assert 'goals' in data
        
        # Check goal structure
        for goal in data['goals']:
            assert 'goal' in goal
            assert 'themes' in goal
            assert 'kpi_count' in goal
            assert isinstance(goal['themes'], dict)
            
    def test_sector_quality_education(self):
        """GET /api/vision-kpis/sector/Quality Education should return correct data"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/sector/Quality%20Education")
        assert response.status_code == 200
        data = response.json()
        
        assert data['sector'] == 'Quality Education'
        assert data['pillar'] == 'People First'
        assert data['total_kpis'] == 10, f"Expected 10 KPIs, got {data['total_kpis']}"
        
    def test_sector_inclusive_agriculture(self):
        """GET /api/vision-kpis/sector/Inclusive Agriculture should return correct data"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/sector/Inclusive%20Agriculture")
        assert response.status_code == 200
        data = response.json()
        
        assert data['sector'] == 'Inclusive Agriculture'
        assert data['pillar'] == 'Rural Empowerment'
        assert data['total_kpis'] == 8, f"Expected 8 KPIs, got {data['total_kpis']}"
        
    def test_sector_case_insensitive(self):
        """Sector lookup should be case-insensitive"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis/sector/women-led%20growth")
        assert response.status_code == 200
        data = response.json()
        assert data['total_kpis'] == 17


class TestVisionKPIsDataIntegrity:
    """Data integrity tests for Vision KPIs"""
    
    def test_kpi_has_valid_targets(self):
        """KPIs should have target values for 2026, 2029, 2036, 2047"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis")
        assert response.status_code == 200
        data = response.json()
        
        # Check a sample of KPIs have target fields
        for kpi in data[:10]:
            assert 'target_2026' in kpi
            assert 'target_2029' in kpi
            assert 'target_2036' in kpi
            assert 'target_2047' in kpi
            
    def test_kpi_has_current_value(self):
        """KPIs should have current value"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis")
        assert response.status_code == 200
        data = response.json()
        
        # Most KPIs should have current values (191 out of 236 have values)
        kpis_with_current = [k for k in data if k.get('current') and k['current'] not in ['NA', '-', '-']]
        assert len(kpis_with_current) >= 190, f"Expected >=190 KPIs with current values, got {len(kpis_with_current)}"
        
    def test_search_mortality_kpis(self):
        """Search for 'mortality' should find relevant KPIs"""
        response = requests.get(f"{BASE_URL}/api/vision-kpis")
        assert response.status_code == 200
        data = response.json()
        
        mortality_kpis = [k for k in data if 'mortality' in k['key_outcome'].lower()]
        assert len(mortality_kpis) >= 4, f"Expected at least 4 mortality KPIs, got {len(mortality_kpis)}"
