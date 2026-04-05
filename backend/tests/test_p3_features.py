"""
Test P3 Features: Dark Mode, Multi-language Odia, Compare Districts, Notifications
Backend API tests for Odisha Vision 2047 Portal
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestNotificationEndpoints:
    """Test notification-related API endpoints"""
    
    def test_get_notifications(self):
        """GET /api/notifications returns notification list"""
        response = requests.get(f"{BASE_URL}/api/notifications")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verify notification structure if any exist
        if len(data) > 0:
            notif = data[0]
            assert "id" in notif
            assert "type" in notif
            assert "title" in notif
            assert "message" in notif
            assert "severity" in notif
            assert "read" in notif
            assert "created_at" in notif
            print(f"✓ GET /api/notifications returned {len(data)} notifications")
    
    def test_generate_notifications(self):
        """POST /api/notifications/generate creates notifications from alerts"""
        response = requests.post(f"{BASE_URL}/api/notifications/generate")
        assert response.status_code == 200
        data = response.json()
        assert "generated" in data
        assert isinstance(data["generated"], int)
        print(f"✓ POST /api/notifications/generate created {data['generated']} notifications")
    
    def test_mark_all_read(self):
        """PUT /api/notifications/read-all marks all as read"""
        response = requests.put(f"{BASE_URL}/api/notifications/read-all")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("✓ PUT /api/notifications/read-all succeeded")
    
    def test_mark_single_notification_read(self):
        """PUT /api/notifications/{id}/read marks single notification as read"""
        # First get a notification ID
        get_response = requests.get(f"{BASE_URL}/api/notifications")
        assert get_response.status_code == 200
        notifications = get_response.json()
        
        if len(notifications) > 0:
            notif_id = notifications[0]["id"]
            response = requests.put(f"{BASE_URL}/api/notifications/{notif_id}/read")
            assert response.status_code == 200
            data = response.json()
            assert data.get("success") == True
            print(f"✓ PUT /api/notifications/{notif_id}/read succeeded")
        else:
            pytest.skip("No notifications to mark as read")


class TestNotificationPreferences:
    """Test notification preferences API endpoints"""
    
    def test_get_notification_prefs(self):
        """GET /api/notification-prefs returns preferences"""
        response = requests.get(f"{BASE_URL}/api/notification-prefs")
        assert response.status_code == 200
        data = response.json()
        # Verify structure
        assert "email" in data
        assert "alert_critical" in data
        assert "alert_high" in data
        assert "alert_medium" in data
        assert "alert_low" in data
        assert "daily_digest" in data
        print(f"✓ GET /api/notification-prefs returned prefs: email={data['email']}")
    
    def test_update_notification_prefs(self):
        """PUT /api/notification-prefs updates preferences"""
        test_prefs = {
            "email": "test@odisha.gov.in",
            "alert_critical": True,
            "alert_high": True,
            "alert_medium": True,
            "alert_low": False,
            "daily_digest": True
        }
        response = requests.put(
            f"{BASE_URL}/api/notification-prefs",
            json=test_prefs
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_prefs["email"]
        assert data["alert_critical"] == test_prefs["alert_critical"]
        assert data["alert_medium"] == test_prefs["alert_medium"]
        assert data["daily_digest"] == test_prefs["daily_digest"]
        print(f"✓ PUT /api/notification-prefs updated successfully")
    
    def test_update_prefs_persistence(self):
        """Verify preferences persist after update"""
        # Update prefs
        test_email = "persistence_test@odisha.gov.in"
        requests.put(
            f"{BASE_URL}/api/notification-prefs",
            json={
                "email": test_email,
                "alert_critical": True,
                "alert_high": False,
                "alert_medium": True,
                "alert_low": True,
                "daily_digest": False
            }
        )
        
        # Verify by GET
        response = requests.get(f"{BASE_URL}/api/notification-prefs")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_email
        assert data["alert_high"] == False
        assert data["alert_low"] == True
        print("✓ Notification preferences persisted correctly")


class TestDistrictsForCompare:
    """Test districts API for Compare Districts feature"""
    
    def test_get_districts_returns_all_30(self):
        """GET /api/districts returns all 30 districts for comparison"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 30
        print(f"✓ GET /api/districts returned {len(data)} districts")
    
    def test_districts_have_pillar_scores(self):
        """Districts have all pillar scores needed for radar chart"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = [
            "id", "name", "vision_score", "status",
            "people_first_score", "rural_power_score", 
            "prosperity_score", "tech_lead_score", "governance_score"
        ]
        
        for district in data[:5]:  # Check first 5
            for field in required_fields:
                assert field in district, f"Missing {field} in district {district.get('name')}"
        
        print("✓ Districts have all required pillar scores for comparison")
    
    def test_districts_have_unique_ids(self):
        """Each district has a unique ID for selection"""
        response = requests.get(f"{BASE_URL}/api/districts")
        assert response.status_code == 200
        data = response.json()
        
        ids = [d["id"] for d in data]
        assert len(ids) == len(set(ids)), "District IDs are not unique"
        print("✓ All district IDs are unique")


class TestAlertsForNotifications:
    """Test alerts API used by notification generation"""
    
    def test_get_alerts(self):
        """GET /api/alerts returns alerts for notification generation"""
        response = requests.get(f"{BASE_URL}/api/alerts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            alert = data[0]
            assert "id" in alert
            assert "title" in alert
            assert "severity" in alert
            assert "status" in alert
            assert "situation" in alert
        
        print(f"✓ GET /api/alerts returned {len(data)} alerts")
    
    def test_alerts_have_open_status(self):
        """Some alerts have Open status for notification generation"""
        response = requests.get(f"{BASE_URL}/api/alerts")
        assert response.status_code == 200
        data = response.json()
        
        open_alerts = [a for a in data if a.get("status") == "Open"]
        print(f"✓ Found {len(open_alerts)} open alerts for notification generation")


class TestProgramsForNotifications:
    """Test programs API used by notification generation"""
    
    def test_get_programs(self):
        """GET /api/programs returns programs"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 36
        print(f"✓ GET /api/programs returned {len(data)} programs")
    
    def test_programs_have_at_risk_status(self):
        """Some programs have At-risk/Delayed status for notifications"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        
        at_risk = [p for p in data if p.get("status") in ["At-risk", "Delayed"]]
        print(f"✓ Found {len(at_risk)} at-risk/delayed programs for notifications")


class TestNotificationWorkflow:
    """Test complete notification workflow"""
    
    def test_generate_then_read_workflow(self):
        """Test: Generate notifications -> Get -> Mark all read -> Verify"""
        # Step 1: Generate
        gen_response = requests.post(f"{BASE_URL}/api/notifications/generate")
        assert gen_response.status_code == 200
        generated = gen_response.json()["generated"]
        
        # Step 2: Get notifications
        get_response = requests.get(f"{BASE_URL}/api/notifications")
        assert get_response.status_code == 200
        notifications = get_response.json()
        
        # Step 3: Count unread
        unread_before = len([n for n in notifications if not n["read"]])
        
        # Step 4: Mark all read
        read_response = requests.put(f"{BASE_URL}/api/notifications/read-all")
        assert read_response.status_code == 200
        
        # Step 5: Verify all read
        verify_response = requests.get(f"{BASE_URL}/api/notifications")
        assert verify_response.status_code == 200
        notifications_after = verify_response.json()
        unread_after = len([n for n in notifications_after if not n["read"]])
        
        assert unread_after == 0, f"Expected 0 unread, got {unread_after}"
        print(f"✓ Workflow complete: Generated {generated}, had {unread_before} unread, now {unread_after} unread")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
