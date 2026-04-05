from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Odisha Vision 2047 Portal API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== PYDANTIC MODELS ==============

class Pillar(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    icon: str
    description: str
    budget_allocation: float
    scheme_count: int
    health_score: float
    target_2036: str
    kpis: List[str]
    key_schemes: List[Dict[str, Any]]
    color: str

class FlagshipProgram(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: int
    name: str
    pillar: str
    department: str
    total_budget: Optional[float]
    amount_spent: Optional[float]
    progress: Optional[float]
    status: str
    start_date: str
    expected_completion: str
    target_2036: str
    milestone_summary: str
    ai_flag: Optional[str]
    ai_remedy: Optional[str]

class District(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    vision_score: float
    mom_change: float
    status: str
    characteristics: str
    people_first_score: float
    rural_power_score: float
    prosperity_score: float
    tech_lead_score: float
    governance_score: float

class KPIIndicator(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    pillar: str
    category: str
    current_value: str
    target_2036: str
    target_2047: str
    trend: str
    status: str
    data_source: str
    notes: Optional[str]

class BudgetDepartment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    department: str
    pillar: str
    allocation: float
    utilised: float
    committed: float
    status: str
    utilisation_percent: float
    notes: str

class AIAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    alert_id: str
    severity: str
    category: str
    title: str
    situation: str
    remedies: List[str]
    status: str
    owner: str
    deadline: str

class GSDPData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    financial_year: str
    data_type: str
    gsdp_lakh_cr: Optional[float]
    gsdp_usd_bn: Optional[float]
    yoy_change: Optional[str]
    notes: str

class Scheme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    scheme_id: str
    name: str
    pillar: str
    department: str
    budget: Optional[float]
    scheme_type: str
    progress: str
    status: str
    beneficiary_coverage: str
    status_flag: str
    description: str

class Sector(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    pillar: str
    goals: List[Dict[str, Any]]

class NotificationPrefs(BaseModel):
    email: str = ""
    alert_critical: bool = True
    alert_high: bool = True
    alert_medium: bool = False
    alert_low: bool = False
    daily_digest: bool = False

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # alert, program, district
    title: str
    message: str
    severity: str = "info"  # info, warning, critical
    read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ============== VISION KPI ENDPOINTS ==============

@api_router.get("/vision-kpis")
async def get_vision_kpis(pillar: Optional[str] = None, sector: Optional[str] = None):
    """Get vision KPIs with optional filtering"""
    query = {}
    if pillar:
        query["pillar"] = {"$regex": f"^{pillar}$", "$options": "i"}
    if sector:
        query["sector"] = {"$regex": f"^{sector}$", "$options": "i"}
    kpis = await db.vision_kpis.find(query, {"_id": 0}).to_list(300)
    return kpis

@api_router.get("/vision-kpis/summary")
async def get_vision_kpis_summary():
    """Get summary: pillar -> sectors -> goals counts"""
    pipeline = [
        {"$group": {
            "_id": {"pillar": "$pillar", "sector": "$sector"},
            "goals": {"$addToSet": "$goal"},
            "themes": {"$addToSet": "$theme"},
            "kpi_count": {"$sum": 1}
        }},
        {"$group": {
            "_id": "$_id.pillar",
            "sectors": {"$push": {
                "name": "$_id.sector",
                "goals": {"$size": "$goals"},
                "themes": {"$size": "$themes"},
                "kpis": "$kpi_count"
            }},
            "total_kpis": {"$sum": "$kpi_count"}
        }},
        {"$project": {
            "_id": 0,
            "pillar": "$_id",
            "sectors": 1,
            "total_kpis": 1,
            "sector_count": {"$size": "$sectors"}
        }},
        {"$sort": {"total_kpis": -1}}
    ]
    result = await db.vision_kpis.aggregate(pipeline).to_list(20)
    return result

@api_router.get("/vision-kpis/sector/{sector_name}")
async def get_vision_kpis_by_sector(sector_name: str):
    """Get all KPIs for a specific sector with grouped goals"""
    kpis = await db.vision_kpis.find(
        {"sector": {"$regex": f"^{sector_name}$", "$options": "i"}},
        {"_id": 0}
    ).to_list(100)
    
    # Group by goal
    goals = {}
    for k in kpis:
        g = k["goal"]
        if g not in goals:
            goals[g] = {"goal": g, "themes": {}, "kpi_count": 0}
        theme = k["theme"]
        if theme not in goals[g]["themes"]:
            goals[g]["themes"][theme] = []
        goals[g]["themes"][theme].append(k)
        goals[g]["kpi_count"] += 1
    
    return {
        "sector": sector_name,
        "pillar": kpis[0]["pillar"] if kpis else "",
        "total_kpis": len(kpis),
        "goals": list(goals.values())
    }

# ============== API ENDPOINTS ==============

@api_router.get("/")
async def root():
    return {"message": "Odisha Vision 2047 Portal API", "version": "1.0.0"}

@api_router.get("/pillars", response_model=List[Pillar])
async def get_pillars():
    pillars = await db.pillars.find({}, {"_id": 0}).to_list(100)
    return pillars

@api_router.get("/programs", response_model=List[FlagshipProgram])
async def get_programs():
    programs = await db.programs.find({}, {"_id": 0}).to_list(100)
    return programs

@api_router.get("/districts", response_model=List[District])
async def get_districts():
    districts = await db.districts.find({}, {"_id": 0}).to_list(100)
    return districts

@api_router.get("/kpis", response_model=List[KPIIndicator])
async def get_kpis():
    kpis = await db.kpis.find({}, {"_id": 0}).to_list(200)
    return kpis

@api_router.get("/budget", response_model=List[BudgetDepartment])
async def get_budget():
    budget = await db.budget.find({}, {"_id": 0}).to_list(100)
    return budget

@api_router.get("/alerts", response_model=List[AIAlert])
async def get_alerts():
    alerts = await db.alerts.find({}, {"_id": 0}).to_list(100)
    return alerts

@api_router.get("/gsdp", response_model=List[GSDPData])
async def get_gsdp():
    gsdp = await db.gsdp.find({}, {"_id": 0}).to_list(100)
    return gsdp

@api_router.get("/schemes", response_model=List[Scheme])
async def get_schemes():
    schemes = await db.schemes.find({}, {"_id": 0}).to_list(100)
    return schemes

@api_router.get("/sectors", response_model=List[Sector])
async def get_sectors():
    sectors = await db.sectors.find({}, {"_id": 0}).to_list(100)
    return sectors

@api_router.get("/dashboard-summary")
async def get_dashboard_summary():
    """Get summary statistics for the dashboard"""
    pillars_count = await db.pillars.count_documents({})
    programs_count = await db.programs.count_documents({})
    districts_count = await db.districts.count_documents({})
    schemes_count = await db.schemes.count_documents({})
    
    # Get program statuses
    on_track = await db.programs.count_documents({"status": "On-track"})
    at_risk = await db.programs.count_documents({"status": "At-risk"})
    delayed = await db.programs.count_documents({"status": "Delayed"})
    
    # Calculate total budget
    pillars = await db.pillars.find({}, {"_id": 0, "budget_allocation": 1}).to_list(100)
    total_budget = sum([p.get("budget_allocation", 0) for p in pillars])
    
    # Get active alerts
    active_alerts = await db.alerts.count_documents({"status": "Open"})
    
    return {
        "total_pillars": pillars_count,
        "total_programs": programs_count,
        "total_districts": districts_count,
        "total_schemes": schemes_count,
        "total_budget": total_budget,
        "programs_on_track": on_track,
        "programs_at_risk": at_risk,
        "programs_delayed": delayed,
        "active_alerts": active_alerts,
        "beneficiaries": "4.2Cr"
    }

@api_router.get("/districts/{district_name}")
async def get_district_detail(district_name: str):
    """Get detailed district info with related programs and schemes"""
    district = await db.districts.find_one(
        {"name": {"$regex": f"^{district_name}$", "$options": "i"}},
        {"_id": 0}
    )
    if not district:
        raise HTTPException(status_code=404, detail="District not found")

    # Find programs linked to this district's top pillar areas
    programs = await db.programs.find({}, {"_id": 0}).to_list(100)
    schemes = await db.schemes.find({}, {"_id": 0}).to_list(100)
    kpis = await db.kpis.find({}, {"_id": 0}).to_list(200)

    # Rank pillar scores for this district
    pillar_scores = {
        "People First": district.get("people_first_score", 0),
        "Rural Power": district.get("rural_power_score", 0),
        "Prosperity": district.get("prosperity_score", 0),
        "Tech Lead": district.get("tech_lead_score", 0),
        "Governance": district.get("governance_score", 0),
    }
    top_pillars = sorted(pillar_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    top_names = [p[0] for p in top_pillars]

    related_programs = [p for p in programs if p.get("pillar") in top_names][:8]
    related_schemes = [s for s in schemes if s.get("pillar") in top_names][:6]
    related_kpis = [k for k in kpis if k.get("pillar") in top_names][:8]

    return {
        "district": district,
        "pillar_scores": pillar_scores,
        "related_programs": related_programs,
        "related_schemes": related_schemes,
        "related_kpis": related_kpis,
    }

# ============== ADMIN CRUD ENDPOINTS ==============

class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[float] = None
    amount_spent: Optional[float] = None
    ai_flag: Optional[str] = None
    ai_remedy: Optional[str] = None

class DistrictUpdate(BaseModel):
    vision_score: Optional[float] = None
    status: Optional[str] = None
    people_first_score: Optional[float] = None
    rural_power_score: Optional[float] = None
    prosperity_score: Optional[float] = None
    tech_lead_score: Optional[float] = None
    governance_score: Optional[float] = None

class KPIUpdate(BaseModel):
    current_value: Optional[str] = None
    trend: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None

@api_router.put("/admin/programs/{program_id}")
async def update_program(program_id: str, update: ProgramUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.programs.update_one({"id": program_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    updated = await db.programs.find_one({"id": program_id}, {"_id": 0})
    return updated

@api_router.put("/admin/districts/{district_id}")
async def update_district(district_id: str, update: DistrictUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.districts.update_one({"id": district_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="District not found")
    updated = await db.districts.find_one({"id": district_id}, {"_id": 0})
    return updated

@api_router.put("/admin/kpis/{kpi_id}")
async def update_kpi(kpi_id: str, update: KPIUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.kpis.update_one({"id": kpi_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="KPI not found")
    updated = await db.kpis.find_one({"id": kpi_id}, {"_id": 0})
    return updated

@api_router.put("/admin/alerts/{alert_id}")
async def update_alert(alert_id: str, update: AlertUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.alerts.update_one({"id": alert_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    updated = await db.alerts.find_one({"id": alert_id}, {"_id": 0})
    return updated

# ============== NOTIFICATION ENDPOINTS ==============

@api_router.get("/notifications")
async def get_notifications():
    """Get all notifications"""
    notifications = await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return notifications

@api_router.post("/notifications/generate")
async def generate_notifications():
    """Generate notifications from current alert data"""
    alerts = await db.alerts.find({"status": "Open"}, {"_id": 0}).to_list(100)
    programs_at_risk = await db.programs.find({"status": {"$in": ["At-risk", "Delayed"]}}, {"_id": 0}).to_list(100)

    new_notifs = []
    for a in alerts:
        notif = {
            "id": str(uuid.uuid4()),
            "type": "alert",
            "title": a.get("title", "Alert"),
            "message": a.get("situation", ""),
            "severity": a.get("severity", "Medium").lower(),
            "read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        new_notifs.append(notif)

    for p in programs_at_risk[:5]:
        notif = {
            "id": str(uuid.uuid4()),
            "type": "program",
            "title": f"{p['name']} - {p['status']}",
            "message": f"Progress at {p.get('progress', 0)}%. {p.get('ai_flag', '')}",
            "severity": "warning" if p["status"] == "At-risk" else "critical",
            "read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        new_notifs.append(notif)

    if new_notifs:
        await db.notifications.delete_many({})
        await db.notifications.insert_many(new_notifs)

    return {"generated": len(new_notifs)}

@api_router.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str):
    await db.notifications.update_one({"id": notif_id}, {"$set": {"read": True}})
    return {"success": True}

@api_router.put("/notifications/read-all")
async def mark_all_read():
    await db.notifications.update_many({}, {"$set": {"read": True}})
    return {"success": True}

@api_router.get("/notification-prefs")
async def get_notification_prefs():
    prefs = await db.notification_prefs.find_one({}, {"_id": 0})
    if not prefs:
        prefs = NotificationPrefs().model_dump()
        await db.notification_prefs.insert_one(prefs)
        prefs.pop("_id", None)
    return prefs

@api_router.put("/notification-prefs")
async def update_notification_prefs(prefs: NotificationPrefs):
    prefs_dict = prefs.model_dump()
    await db.notification_prefs.update_one({}, {"$set": prefs_dict}, upsert=True)
    return prefs_dict

@api_router.post("/init")
async def init_database():
    """Initialize database only if empty"""
    pillars_count = await db.pillars.count_documents({})
    vkpi_count = await db.vision_kpis.count_documents({})
    if pillars_count > 0 and vkpi_count > 0:
        return {"message": "Database already initialized", "seeded": False}
    return await seed_database()

@api_router.post("/seed")
async def seed_database():
    """Seed the database with initial data"""
    try:
        # Clear existing data
        await db.pillars.delete_many({})
        await db.programs.delete_many({})
        await db.districts.delete_many({})
        await db.kpis.delete_many({})
        await db.budget.delete_many({})
        await db.alerts.delete_many({})
        await db.gsdp.delete_many({})
        await db.schemes.delete_many({})
        await db.sectors.delete_many({})

        # Seed Pillars
        pillars_data = [
            {
                "id": str(uuid.uuid4()),
                "name": "People First",
                "icon": "Users",
                "description": "Health, nutrition, education, women & child, tribal welfare",
                "budget_allocation": 104500,
                "scheme_count": 12,
                "health_score": 78,
                "target_2036": "100% literacy, 100% GER, <20 IMR",
                "kpis": ["Literacy Rate: 73.5% → 100%", "GER Schools: 92.4% → 100%", "IMR: 38 → <20", "Subhadra: 1.04Cr → 1.5Cr"],
                "key_schemes": [
                    {"name": "Gopabandhu Jana Arogya", "budget": 5450},
                    {"name": "Subhadra Yojana", "budget": 10000},
                    {"name": "Samagra Sikshya", "budget": 3791},
                    {"name": "TASP/SCSP", "budget": 63299},
                    {"name": "Madhubabu Pension", "budget": 4487}
                ],
                "color": "#F26522"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Rural Power",
                "icon": "Wheat",
                "description": "Agriculture, irrigation, rural employment, water, sanitation",
                "budget_allocation": 55705,
                "scheme_count": 8,
                "health_score": 72,
                "target_2036": "170% cropping intensity, 60% irrigation",
                "kpis": ["Cropping: 148% → 170%", "Irrigation: 38% → 60%", "MGNREGS: 22Cr → 30Cr", "Lakhpati Didi: 17L → 25L"],
                "key_schemes": [
                    {"name": "Samrudha Krushaka", "budget": 5000},
                    {"name": "Irrigation", "budget": 14111},
                    {"name": "MGNREGS", "budget": 3651},
                    {"name": "CM-KISAN", "budget": 1935}
                ],
                "color": "#10B981"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Prosperity",
                "icon": "Building2",
                "description": "Industry, MSME, roads, urban development, ports, energy",
                "budget_allocation": 34523,
                "scheme_count": 10,
                "health_score": 68,
                "target_2036": "80L MSME jobs, 40% urbanization",
                "kpis": ["Investment: ₹12.89L Cr (Utkarsh)", "MSME: 42L → 80L jobs", "Roads: 2.42L → 3L km", "Urban: 17% → 40%"],
                "key_schemes": [
                    {"name": "Roads & Railways", "budget": 15865},
                    {"name": "Urban Odisha", "budget": 9603},
                    {"name": "MSME", "budget": 1555},
                    {"name": "Tourism", "budget": 800}
                ],
                "color": "#3B82F6"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Tech Lead",
                "icon": "Cpu",
                "description": "AI governance, digital services, GCC/ITeS, DeepTech, semiconductors",
                "budget_allocation": 2250,
                "scheme_count": 5,
                "health_score": 65,
                "target_2036": "200 GCC companies, 95% digital adoption",
                "kpis": ["GCC: 34 → 200", "IT Export: ₹18K → ₹80K Cr", "Digital: 61% → 95%", "Renewable: 4.2GW → 15GW"],
                "key_schemes": [
                    {"name": "GCC & ITeS Hub", "budget": 1200},
                    {"name": "AI Governance", "budget": 800},
                    {"name": "DeepTech Fund", "budget": 300},
                    {"name": "Semiconductors", "budget": 650}
                ],
                "color": "#8B5CF6"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Legacy",
                "icon": "Landmark",
                "description": "Culture, tourism, Odia language, sports, heritage, afforestation",
                "budget_allocation": 3703,
                "scheme_count": 6,
                "health_score": 75,
                "target_2036": "5Cr tourists, 600 sports venues",
                "kpis": ["Tourists: 1.8Cr → 5Cr", "Tourism Rev: ₹12K → ₹50K Cr", "Heritage Sites: 186 → 300", "Sports: 340 → 600"],
                "key_schemes": [
                    {"name": "Tourism", "budget": 800},
                    {"name": "Sports", "budget": 1315},
                    {"name": "CAMPA", "budget": 1168},
                    {"name": "Odia Language", "budget": 420}
                ],
                "color": "#F59E0B"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Governance",
                "icon": "Shield",
                "description": "Citizen services, law & order, disaster management, planning",
                "budget_allocation": 15512,
                "scheme_count": 6,
                "health_score": 82,
                "target_2036": "95% eGov, <2hr disaster response",
                "kpis": ["eGov: 72% → 95%", "Crime Index: 62 → 40", "Court Pendency: 3.1L → <1L", "Disaster: 4.2hr → <2hr"],
                "key_schemes": [
                    {"name": "Internal Security", "budget": 8994},
                    {"name": "Disaster Management", "budget": 3900},
                    {"name": "Planning & Convergence", "budget": 2018},
                    {"name": "ERSS-112", "budget": 118}
                ],
                "color": "#1E3A8A"
            }
        ]
        await db.pillars.insert_many(pillars_data)

        # Seed Flagship Programs (36 programs)
        programs_data = [
            {"id": str(uuid.uuid4()), "project_id": 1, "name": "Subhadra Yojana - Women Empowerment", "pillar": "People First", "department": "WCD & Mission Shakti", "total_budget": 10000, "amount_spent": 5200, "progress": 52, "status": "On-track", "start_date": "Jul 2024", "expected_completion": "Mar 2027", "target_2036": "1.5 Cr women empowered", "milestone_summary": "Scheme notified|1.04 Cr enrolled|DBT active|2nd phase pending", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 2, "name": "Gopabandhu Jana Arogya Yojana", "pillar": "People First", "department": "Health & FW", "total_budget": 5450, "amount_spent": 2180, "progress": 40, "status": "At-risk", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "100% health coverage", "milestone_summary": "Scheme redesigned|Hospital empanelment|Enrolment 62%|Rural camps pending", "ai_flag": "Budget lag Q4", "ai_remedy": "Accelerate empanelment; redirect underutilised ₹800 Cr to rural camps"},
            {"id": str(uuid.uuid4()), "project_id": 3, "name": "Samrudha Krushaka - Farmer Income", "pillar": "Rural Power", "department": "Agriculture", "total_budget": 6088, "amount_spent": 3650, "progress": 60, "status": "On-track", "start_date": "Jan 2024", "expected_completion": "Dec 2026", "target_2036": "₹2L farmer income/yr", "milestone_summary": "DBT system live|58L farmers enrolled|FPO linkage active|Market integration", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 4, "name": "Parvati Giri Lift Irrigation Phase 2", "pillar": "Rural Power", "department": "Water Resources", "total_budget": 8500, "amount_spent": 3230, "progress": 38, "status": "Delayed", "start_date": "Apr 2023", "expected_completion": "Revised Mar 2028", "target_2036": "84,000 ha irrigated", "milestone_summary": "DPR approved|Tender awarded|Civil works 38%|LA pending 347 acres", "ai_flag": "LA pending Kalahandi", "ai_remedy": "Invoke Section 11 LA Act; parallel-track civil works; 110% ex-gratia offer"},
            {"id": str(uuid.uuid4()), "project_id": 5, "name": "Roads, Bridges & Railway Network", "pillar": "Prosperity", "department": "Works", "total_budget": 18500, "amount_spent": 10175, "progress": 55, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "3L km network by 2036", "milestone_summary": "NH DPRs approved|Bridge works 58%|Railway MoU signed|Airport connectivity ongoing", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 6, "name": "Urban Odisha - BCPPER Transformation", "pillar": "Prosperity", "department": "H&UD", "total_budget": 9985, "amount_spent": 3894, "progress": 39, "status": "At-risk", "start_date": "Jul 2024", "expected_completion": "Mar 2027", "target_2036": "7000 sq km metro region", "milestone_summary": "Master plan approved|Tenders issued 60%|Civil works 39%|Smart-city sensors pending", "ai_flag": "Underutil Q4 ₹5,857 Cr", "ai_remedy": "Activate pre-tendered contracts; re-appropriate ₹800 Cr to road resurfacing"},
            {"id": str(uuid.uuid4()), "project_id": 7, "name": "MSME & Industries Growth (CM-SRIM)", "pillar": "Prosperity", "department": "MSME", "total_budget": 1567, "amount_spent": 940, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Dec 2026", "target_2036": "80L MSME employment", "milestone_summary": "Cluster development active|Credit linkage 45%|Export support enabled", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 8, "name": "Madhubabu Pension Yojana", "pillar": "People First", "department": "Social Security", "total_budget": 5370, "amount_spent": 4296, "progress": 80, "status": "On-track", "start_date": "Jan 2023", "expected_completion": "Ongoing", "target_2036": "All eligible beneficiaries", "milestone_summary": "All eligible covered|DBT active|Verification complete", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 9, "name": "Samagra Sikshya - Education", "pillar": "People First", "department": "School & Mass Education", "total_budget": 3791, "amount_spent": 2274, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "100% GER & zero dropout", "milestone_summary": "GER 92.4%|Infrastructure upgrades|Teacher training active", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 10, "name": "Jal Jeevan Mission - Piped Water", "pillar": "People First", "department": "Rural Development", "total_budget": 8000, "amount_spent": 4640, "progress": 58, "status": "On-track", "start_date": "Apr 2022", "expected_completion": "Dec 2026", "target_2036": "100% rural HH piped water", "milestone_summary": "58% coverage|Pipeline laying active|Quality testing enabled", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 11, "name": "MGNREGS Rural Employment", "pillar": "Rural Power", "department": "Rural Development", "total_budget": 3651, "amount_spent": 2555, "progress": 70, "status": "On-track", "start_date": "Ongoing", "expected_completion": "Ongoing", "target_2036": "30 Cr person-days/yr", "milestone_summary": "22 Cr person-days achieved|Wage payments regular", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 12, "name": "Bhubaneswar-Cuttack Metro BCPPER", "pillar": "Prosperity", "department": "Planning", "total_budget": 25000, "amount_spent": 5000, "progress": 20, "status": "At-risk", "start_date": "Jun 2025", "expected_completion": "2036", "target_2036": "$500B economic hub", "milestone_summary": "DPR revision underway|Land pooling initiated", "ai_flag": "DPR delays", "ai_remedy": "Expedite DPR; fast-track land pooling; engage McKinsey knowledge partner"},
            {"id": str(uuid.uuid4()), "project_id": 13, "name": "GCC & ITeS Hub Development", "pillar": "Tech Lead", "department": "IT & Electronics", "total_budget": 1200, "amount_spent": 480, "progress": 40, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2028", "target_2036": "200 GCC companies", "milestone_summary": "34 GCCs operational|Infocity expansion|Talent pipeline active", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 14, "name": "AI Governance & Digital Services", "pillar": "Tech Lead", "department": "IT & Electronics", "total_budget": 800, "amount_spent": 160, "progress": 20, "status": "Planned", "start_date": "Jul 2025", "expected_completion": "Dec 2027", "target_2036": "95% eGov adoption", "milestone_summary": "Platform design phase|Vendor selection underway", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 15, "name": "Odia Language & Culture Mission", "pillar": "Legacy", "department": "Culture", "total_budget": 420, "amount_spent": 210, "progress": 50, "status": "On-track", "start_date": "Jan 2024", "expected_completion": "2030", "target_2036": "Odia UNESCO recognition", "milestone_summary": "Documentation active|Digital archive created", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 16, "name": "Tourism Circuit Development", "pillar": "Legacy", "department": "Tourism", "total_budget": 800, "amount_spent": 400, "progress": 50, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2028", "target_2036": "5 Cr tourists/yr", "milestone_summary": "Puri circuit active|Eco-tourism expansion|Heritage restoration", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 17, "name": "TASP - Tribal Area Sub-Plan", "pillar": "People First", "department": "ST & SC Dev", "total_budget": 39638, "amount_spent": 23783, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "Tribal equity index 90%", "milestone_summary": "Hostel construction|Livelihood programs|Education support active", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 18, "name": "SCSP - Scheduled Caste Sub-Plan", "pillar": "People First", "department": "ST & SC Dev", "total_budget": 29243, "amount_spent": 17546, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "SC poverty rate < 5%", "milestone_summary": "Skill training|Housing support|Scholarship disbursement", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 19, "name": "PM Surya Ghar - Rooftop Solar", "pillar": "Tech Lead", "department": "Energy", "total_budget": 890, "amount_spent": 178, "progress": 20, "status": "Planned", "start_date": "Jan 2025", "expected_completion": "Dec 2027", "target_2036": "5L rooftop installations", "milestone_summary": "Scheme launched|Registration portal active", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 20, "name": "Disaster Risk Mitigation (SDRMF)", "pillar": "Governance", "department": "Revenue & DM", "total_budget": 4000, "amount_spent": 2400, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Ongoing", "target_2036": "Response < 2 hrs", "milestone_summary": "ODRAF modernization|Early warning systems|Shelter upgrades", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 21, "name": "Green Industries & Semiconductors", "pillar": "Tech Lead", "department": "Industries", "total_budget": 650, "amount_spent": 130, "progress": 20, "status": "Planned", "start_date": "Oct 2025", "expected_completion": "Dec 2030", "target_2036": "Semiconductor fab by 2030", "milestone_summary": "Policy framework|MoU discussions|Site identification", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 22, "name": "Port-led Industrial Development", "pillar": "Prosperity", "department": "Commerce & Transport", "total_budget": 12000, "amount_spent": 3600, "progress": 30, "status": "At-risk", "start_date": "Apr 2024", "expected_completion": "Mar 2029", "target_2036": "Paradip: 150 MT/yr", "milestone_summary": "Berth expansion ongoing|Env clearance pending", "ai_flag": "Env clearance pending", "ai_remedy": "Engage MoEF; appoint liaison officer; parallel greenfield berth DPR"},
            {"id": str(uuid.uuid4()), "project_id": 23, "name": "Skilled in Odisha - Youth Employment", "pillar": "People First", "department": "Skill Dev & Tech Education", "total_budget": 2500, "amount_spent": 1250, "progress": 50, "status": "On-track", "start_date": "Jul 2024", "expected_completion": "Dec 2027", "target_2036": "10L skilled youth/yr", "milestone_summary": "WSC campus expansion|Industry partnerships|Placement drives", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 24, "name": "Swaccha Bharat - Sanitation (Urban)", "pillar": "Governance", "department": "H&UD", "total_budget": 1500, "amount_spent": 900, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Sep 2026", "target_2036": "ODF++ status all ULBs", "milestone_summary": "Waste processing plants|STP construction|IEC campaigns", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 25, "name": "CM-KISAN Farmer Direct Benefit", "pillar": "Rural Power", "department": "Agriculture", "total_budget": 1935, "amount_spent": 1161, "progress": 60, "status": "On-track", "start_date": "Jan 2024", "expected_completion": "Ongoing", "target_2036": "58L farmers covered", "milestone_summary": "DBT active|Verification complete|Coverage expanding", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 26, "name": "Mukhyamantri Swasthya Seva Mission", "pillar": "People First", "department": "Health & FW", "total_budget": 3881, "amount_spent": 1940, "progress": 50, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2028", "target_2036": "Hospital at each block", "milestone_summary": "Block hospital upgrades|Equipment procurement|Staff recruitment", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 27, "name": "Sports for All", "pillar": "Legacy", "department": "Sports", "total_budget": 1320, "amount_spent": 660, "progress": 50, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2029", "target_2036": "600 sports venues by 2036", "milestone_summary": "Stadium construction|Talent identification|Coach training", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 28, "name": "MATY Minor Irrigation Works", "pillar": "Rural Power", "department": "Water Resources", "total_budget": 350, "amount_spent": 105, "progress": 30, "status": "Delayed", "start_date": "Apr 2023", "expected_completion": "Revised Mar 2027", "target_2036": "5L ha minor irrigation", "milestone_summary": "Contractor default|Re-tendering initiated", "ai_flag": "Contractor default", "ai_remedy": "Terminate contract; re-tender with performance bond; engage NABARD"},
            {"id": str(uuid.uuid4()), "project_id": 29, "name": "Shree Anna Abhiyan - Millets", "pillar": "Rural Power", "department": "Agriculture", "total_budget": 649, "amount_spent": 389, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Dec 2026", "target_2036": "Odisha millet hub", "milestone_summary": "Millet clusters active|Processing units|Export linkage", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 30, "name": "PM SHRI Model Schools", "pillar": "People First", "department": "School Education", "total_budget": 500, "amount_spent": 250, "progress": 50, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "100 PM SHRI schools", "milestone_summary": "School selection|Infrastructure upgrades|NEP curriculum", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 31, "name": "CAMPA Afforestation - Climate", "pillar": "Legacy", "department": "Forest & Environment", "total_budget": 1168, "amount_spent": 701, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "30% forest cover by 2036", "milestone_summary": "Plantation drives|Nursery development|Community forestry", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 32, "name": "Emergency Services ERSS-112", "pillar": "Governance", "department": "Home", "total_budget": 118, "amount_spent": 83, "progress": 70, "status": "On-track", "start_date": "Apr 2023", "expected_completion": "Dec 2025", "target_2036": "< 8 min response", "milestone_summary": "Call center upgraded|GPS integration|Training complete", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 33, "name": "Western Odisha Development Fund", "pillar": "Rural Power", "department": "Planning", "total_budget": 500, "amount_spent": 150, "progress": 30, "status": "At-risk", "start_date": "Jul 2024", "expected_completion": "Mar 2028", "target_2036": "Bridge west-east disparity", "milestone_summary": "Fund utilization low|District sub-allotments pending", "ai_flag": "Fund utilisation low", "ai_remedy": "Engage Sambalpur divisional commissioner; issue sub-allotments to districts"},
            {"id": str(uuid.uuid4()), "project_id": 34, "name": "Internal Security Modernisation", "pillar": "Governance", "department": "Home", "total_budget": 10760, "amount_spent": 6456, "progress": 60, "status": "On-track", "start_date": "Apr 2024", "expected_completion": "Mar 2027", "target_2036": "Smart policing 2036", "milestone_summary": "CCTNS upgrade|Vehicle procurement|Training infrastructure", "ai_flag": None, "ai_remedy": None},
            {"id": str(uuid.uuid4()), "project_id": 35, "name": "DeepTech & Frontier Tech Fund", "pillar": "Tech Lead", "department": "IT & Electronics", "total_budget": 300, "amount_spent": 60, "progress": 20, "status": "Delayed", "start_date": "Jan 2025", "expected_completion": "Revised Dec 2027", "target_2036": "50 DeepTech startups", "milestone_summary": "Empanelment pending|IIT/IIIT collaboration", "ai_flag": "Empanelment pending", "ai_remedy": "Fast-track IIT/IIIT Bhubaneswar nodes; issue challenge grants by Jun 2026"},
            {"id": str(uuid.uuid4()), "project_id": 36, "name": "Paradip Port & Logistics Hub", "pillar": "Prosperity", "department": "Commerce & Transport", "total_budget": 15000, "amount_spent": 3000, "progress": 20, "status": "Delayed", "start_date": "Apr 2024", "expected_completion": "Revised 2031", "target_2036": "150 MT cargo capacity", "milestone_summary": "Berth construction delayed|Env issues", "ai_flag": "Berth construction delayed", "ai_remedy": "Invoke CPWA fast-track; invoke EPC contractor penalty clause; CM review"}
        ]
        await db.programs.insert_many(programs_data)

        # Seed Districts (30 districts)
        districts_data = [
            {"id": str(uuid.uuid4()), "name": "Khurda", "vision_score": 84, "mom_change": 2, "status": "On-track", "characteristics": "Bhubaneswar metro; high GCC/IT activity; strong urban development", "people_first_score": 88, "rural_power_score": 79, "prosperity_score": 76, "tech_lead_score": 82, "governance_score": 85},
            {"id": str(uuid.uuid4()), "name": "Cuttack", "vision_score": 82, "mom_change": 1, "status": "On-track", "characteristics": "Industrial hub; Mahanadi basin; port logistics gateway", "people_first_score": 74, "rural_power_score": 71, "prosperity_score": 79, "tech_lead_score": 78, "governance_score": 78},
            {"id": str(uuid.uuid4()), "name": "Sundargarh", "vision_score": 73, "mom_change": 4, "status": "On-track", "characteristics": "Mining district; tribal welfare focus; Rourkela steel city", "people_first_score": 70, "rural_power_score": 65, "prosperity_score": 62, "tech_lead_score": 70, "governance_score": 72},
            {"id": str(uuid.uuid4()), "name": "Ganjam", "vision_score": 72, "mom_change": -1, "status": "At-risk", "characteristics": "Berhampur growth; MSME cluster; coastal fisheries strength", "people_first_score": 74, "rural_power_score": 70, "prosperity_score": 65, "tech_lead_score": 70, "governance_score": 68},
            {"id": str(uuid.uuid4()), "name": "Puri", "vision_score": 67, "mom_change": 2, "status": "On-track", "characteristics": "Heritage tourism; Jagannath temple economy; coastal development", "people_first_score": 64, "rural_power_score": 60, "prosperity_score": 55, "tech_lead_score": 62, "governance_score": 70},
            {"id": str(uuid.uuid4()), "name": "Jharsuguda", "vision_score": 63, "mom_change": 1, "status": "On-track", "characteristics": "Power sector; industrial; SBI colony city", "people_first_score": 58, "rural_power_score": 54, "prosperity_score": 62, "tech_lead_score": 54, "governance_score": 61},
            {"id": str(uuid.uuid4()), "name": "Kandhamal", "vision_score": 63, "mom_change": 0, "status": "On-track", "characteristics": "Haldi production; tribal; tourism - Phulbani", "people_first_score": 58, "rural_power_score": 54, "prosperity_score": 42, "tech_lead_score": 54, "governance_score": 61},
            {"id": str(uuid.uuid4()), "name": "Balasore", "vision_score": 61, "mom_change": 1, "status": "On-track", "characteristics": "Defence sector (ISRO); Chandipur corridor; emerging manufacturing", "people_first_score": 59, "rural_power_score": 54, "prosperity_score": 50, "tech_lead_score": 56, "governance_score": 58},
            {"id": str(uuid.uuid4()), "name": "Sambalpur", "vision_score": 56, "mom_change": 0, "status": "On-track", "characteristics": "Western Odisha hub; Hirakud dam; education centre", "people_first_score": 54, "rural_power_score": 50, "prosperity_score": 46, "tech_lead_score": 52, "governance_score": 55},
            {"id": str(uuid.uuid4()), "name": "Nuapada", "vision_score": 53, "mom_change": 0, "status": "At-risk", "characteristics": "Aspirational district; drought-prone; water security", "people_first_score": 46, "rural_power_score": 42, "prosperity_score": 38, "tech_lead_score": 41, "governance_score": 48},
            {"id": str(uuid.uuid4()), "name": "Kendrapara", "vision_score": 52, "mom_change": 1, "status": "On-track", "characteristics": "Bhitarkanika biodiversity; agri-fisheries; eco-tourism", "people_first_score": 50, "rural_power_score": 46, "prosperity_score": 42, "tech_lead_score": 48, "governance_score": 50},
            {"id": str(uuid.uuid4()), "name": "Jajpur", "vision_score": 50, "mom_change": -1, "status": "At-risk", "characteristics": "Stainless steel hub; industrial pollution issues; MSME", "people_first_score": 48, "rural_power_score": 44, "prosperity_score": 40, "tech_lead_score": 44, "governance_score": 46},
            {"id": str(uuid.uuid4()), "name": "Gajapati", "vision_score": 46, "mom_change": 1, "status": "On-track", "characteristics": "Tribal; border with AP; aspirational district", "people_first_score": 42, "rural_power_score": 38, "prosperity_score": 38, "tech_lead_score": 43, "governance_score": 45},
            {"id": str(uuid.uuid4()), "name": "Angul", "vision_score": 46, "mom_change": -1, "status": "At-risk", "characteristics": "Coal/thermal power; NALCO; industrial diversification needed", "people_first_score": 45, "rural_power_score": 41, "prosperity_score": 37, "tech_lead_score": 41, "governance_score": 44},
            {"id": str(uuid.uuid4()), "name": "Koraput", "vision_score": 44, "mom_change": 2, "status": "On-track", "characteristics": "Tribal welfare priority; Jaipur aspirational district; agri", "people_first_score": 42, "rural_power_score": 38, "prosperity_score": 34, "tech_lead_score": 38, "governance_score": 42},
            {"id": str(uuid.uuid4()), "name": "Mayurbhanj", "vision_score": 42, "mom_change": -1, "status": "At-risk", "characteristics": "Simlipal biodiversity; tribal; border dist with Jharkhand", "people_first_score": 40, "rural_power_score": 36, "prosperity_score": 32, "tech_lead_score": 36, "governance_score": 40},
            {"id": str(uuid.uuid4()), "name": "Bargarh", "vision_score": 40, "mom_change": -2, "status": "At-risk", "characteristics": "Rice bowl of Odisha; Hirakud canal; Subabul cultivation", "people_first_score": 38, "rural_power_score": 34, "prosperity_score": 30, "tech_lead_score": 34, "governance_score": 38},
            {"id": str(uuid.uuid4()), "name": "Boudh", "vision_score": 37, "mom_change": 0, "status": "At-risk", "characteristics": "Aspirational district; tribal; infrastructure gap", "people_first_score": 36, "rural_power_score": 32, "prosperity_score": 28, "tech_lead_score": 32, "governance_score": 35},
            {"id": str(uuid.uuid4()), "name": "Deogarh", "vision_score": 34, "mom_change": -1, "status": "At-risk", "characteristics": "Forest cover; mineral resources; tourism potential", "people_first_score": 32, "rural_power_score": 30, "prosperity_score": 26, "tech_lead_score": 30, "governance_score": 32},
            {"id": str(uuid.uuid4()), "name": "Nayagarh", "vision_score": 32, "mom_change": -3, "status": "At-risk", "characteristics": "Forest produce; agriculture; district admin reforms", "people_first_score": 30, "rural_power_score": 26, "prosperity_score": 22, "tech_lead_score": 26, "governance_score": 30},
            {"id": str(uuid.uuid4()), "name": "Bolangir", "vision_score": 32, "mom_change": -3, "status": "At-risk", "characteristics": "Migration-prone; water scarcity; MGNREGS high demand", "people_first_score": 28, "rural_power_score": 24, "prosperity_score": 20, "tech_lead_score": 24, "governance_score": 28},
            {"id": str(uuid.uuid4()), "name": "Keonjhar", "vision_score": 30, "mom_change": 0, "status": "At-risk", "characteristics": "Iron ore belt; mining royalty; tribal welfare", "people_first_score": 26, "rural_power_score": 22, "prosperity_score": 18, "tech_lead_score": 22, "governance_score": 28},
            {"id": str(uuid.uuid4()), "name": "Subarnapur", "vision_score": 30, "mom_change": -3, "status": "At-risk", "characteristics": "Aspirational district; agri-dependent; connectivity poor", "people_first_score": 26, "rural_power_score": 22, "prosperity_score": 16, "tech_lead_score": 22, "governance_score": 26},
            {"id": str(uuid.uuid4()), "name": "Bhadrak", "vision_score": 45, "mom_change": 1, "status": "On-track", "characteristics": "Coastal; paddy; industrial potential", "people_first_score": 42, "rural_power_score": 40, "prosperity_score": 35, "tech_lead_score": 38, "governance_score": 43},
            {"id": str(uuid.uuid4()), "name": "Dhenkanal", "vision_score": 38, "mom_change": 0, "status": "At-risk", "characteristics": "Agri; mining; NALCO proximity", "people_first_score": 35, "rural_power_score": 32, "prosperity_score": 28, "tech_lead_score": 30, "governance_score": 38},
            {"id": str(uuid.uuid4()), "name": "Nabarangpur", "vision_score": 28, "mom_change": -3, "status": "Delayed", "characteristics": "Aspirational district; tribal; anemia high", "people_first_score": 25, "rural_power_score": 22, "prosperity_score": 18, "tech_lead_score": 20, "governance_score": 27},
            {"id": str(uuid.uuid4()), "name": "Rayagada", "vision_score": 27, "mom_change": -3, "status": "Delayed", "characteristics": "Tribal; HAL plant; nutrition crisis priority", "people_first_score": 24, "rural_power_score": 22, "prosperity_score": 18, "tech_lead_score": 20, "governance_score": 35},
            {"id": str(uuid.uuid4()), "name": "Malkangiri", "vision_score": 25, "mom_change": -3, "status": "Delayed", "characteristics": "Aspirational district; LWE-affected; connectivity crisis", "people_first_score": 22, "rural_power_score": 20, "prosperity_score": 15, "tech_lead_score": 18, "governance_score": 29},
            {"id": str(uuid.uuid4()), "name": "Kalahandi", "vision_score": 35, "mom_change": 1, "status": "At-risk", "characteristics": "LA pending Parvati Giri; aspirational; KBK region", "people_first_score": 32, "rural_power_score": 28, "prosperity_score": 25, "tech_lead_score": 26, "governance_score": 43},
            {"id": str(uuid.uuid4()), "name": "Jagatsinghpur", "vision_score": 48, "mom_change": 0, "status": "On-track", "characteristics": "Industrial; Paradip port; coastal", "people_first_score": 45, "rural_power_score": 42, "prosperity_score": 48, "tech_lead_score": 40, "governance_score": 46}
        ]
        await db.districts.insert_many(districts_data)

        # Seed KPIs
        kpis_data = [
            {"id": str(uuid.uuid4()), "name": "GSDP (Current Prices)", "pillar": "Economic", "category": "Macro", "current_value": "₹10.63 Lakh Cr (~$120B)", "target_2036": "₹46 Lakh Cr ($500B)", "target_2047": "₹1.5 Trillion", "trend": "↑12% YoY", "status": "On-track", "data_source": "MoSPI, DES Odisha", "notes": None},
            {"id": str(uuid.uuid4()), "name": "India GDP Contribution", "pillar": "Economic", "category": "Macro", "current_value": "3.1%", "target_2036": "5%", "target_2047": "5%", "trend": "↑0.1pp", "status": "At-risk", "data_source": "MoSPI", "notes": "Must accelerate manufacturing & exports"},
            {"id": str(uuid.uuid4()), "name": "Capital Outlay / GSDP", "pillar": "Fiscal", "category": "Finance", "current_value": "6.3%", "target_2036": "7%+", "target_2047": "8%+", "trend": "Highest nationally", "status": "On-track", "data_source": "Finance Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Literacy Rate", "pillar": "People First", "category": "Education", "current_value": "73.5%", "target_2036": "100%", "target_2047": "100%", "trend": "↑2pp", "status": "On-track", "data_source": "Census 2011", "notes": None},
            {"id": str(uuid.uuid4()), "name": "GER Schools", "pillar": "People First", "category": "Education", "current_value": "92.4%", "target_2036": "100%", "target_2047": "100%", "trend": "↑1.2pp", "status": "On-track", "data_source": "UDISE", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Infant Mortality Rate", "pillar": "People First", "category": "Health", "current_value": "38 per 1000", "target_2036": "<20", "target_2047": "<15", "trend": "↓3 pts", "status": "On-track", "data_source": "SRS 2021", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Stunting (Under 5)", "pillar": "People First", "category": "Nutrition", "current_value": "31.0%", "target_2036": "<10%", "target_2047": "<5%", "trend": "↓2pp", "status": "At-risk", "data_source": "NFHS-5", "notes": "Nutrition programs need acceleration"},
            {"id": str(uuid.uuid4()), "name": "Anemia (Children 6-59m)", "pillar": "People First", "category": "Nutrition", "current_value": "49.8%", "target_2036": "<20%", "target_2047": "<10%", "trend": "↓1pp", "status": "At-risk", "data_source": "NFHS-5", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Irrigation Coverage", "pillar": "Rural Power", "category": "Agriculture", "current_value": "38%", "target_2036": "60%", "target_2047": "75%", "trend": "↑3pp", "status": "On-track", "data_source": "Water Resources Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Cropping Intensity", "pillar": "Rural Power", "category": "Agriculture", "current_value": "148%", "target_2036": "170%", "target_2047": "185%", "trend": "↑2pp", "status": "On-track", "data_source": "Agriculture Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "MSME Employment", "pillar": "Prosperity", "category": "Industry", "current_value": "42 Lakh", "target_2036": "80 Lakh", "target_2047": "1.2 Crore", "trend": "↑5L", "status": "On-track", "data_source": "MSME Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Road Network", "pillar": "Prosperity", "category": "Infrastructure", "current_value": "2.42 Lakh km", "target_2036": "3 Lakh km", "target_2047": "3.5 Lakh km", "trend": "↑8K km", "status": "On-track", "data_source": "Works Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Urban Population", "pillar": "Prosperity", "category": "Urbanization", "current_value": "17%", "target_2036": "40%", "target_2047": "60%", "trend": "↑1pp", "status": "At-risk", "data_source": "Census", "notes": "BCPPER transformation key"},
            {"id": str(uuid.uuid4()), "name": "GCC Companies", "pillar": "Tech Lead", "category": "IT/ITeS", "current_value": "34", "target_2036": "200", "target_2047": "500", "trend": "↑8", "status": "On-track", "data_source": "IT Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "IT Export", "pillar": "Tech Lead", "category": "IT/ITeS", "current_value": "₹18,000 Cr", "target_2036": "₹80,000 Cr", "target_2047": "₹2 Lakh Cr", "trend": "↑15%", "status": "On-track", "data_source": "IT Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Renewable Energy", "pillar": "Tech Lead", "category": "Energy", "current_value": "4,200 MW", "target_2036": "15,000 MW", "target_2047": "40,000 MW", "trend": "↑800MW", "status": "On-track", "data_source": "Energy Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Tourist Arrivals", "pillar": "Legacy", "category": "Tourism", "current_value": "1.8 Crore", "target_2036": "5 Crore", "target_2047": "10 Crore", "trend": "↑12%", "status": "On-track", "data_source": "Tourism Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Heritage Sites", "pillar": "Legacy", "category": "Culture", "current_value": "186", "target_2036": "300", "target_2047": "500", "trend": "↑12", "status": "On-track", "data_source": "Culture Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Forest Cover", "pillar": "Legacy", "category": "Environment", "current_value": "33.15%", "target_2036": "35%", "target_2047": "38%", "trend": "↑0.3pp", "status": "On-track", "data_source": "FSI 2023", "notes": None},
            {"id": str(uuid.uuid4()), "name": "eGov Adoption", "pillar": "Governance", "category": "Digital", "current_value": "72%", "target_2036": "95%", "target_2047": "99%", "trend": "↑5pp", "status": "On-track", "data_source": "IT Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Disaster Response Time", "pillar": "Governance", "category": "Safety", "current_value": "4.2 hours", "target_2036": "<2 hours", "target_2047": "<1 hour", "trend": "↓0.5hr", "status": "On-track", "data_source": "OSDMA", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Non-farm Jobs Created", "pillar": "Economic", "category": "Employment", "current_value": "34 Lakh", "target_2036": "1 Crore", "target_2047": "2.5 Crore", "trend": "↑5L", "status": "On-track", "data_source": "Labour Dept", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Lakhpati Didi", "pillar": "People First", "category": "Women", "current_value": "17 Lakh", "target_2036": "25 Lakh", "target_2047": "50 Lakh", "trend": "↑3L", "status": "On-track", "data_source": "Mission Shakti", "notes": None},
            {"id": str(uuid.uuid4()), "name": "Subhadra Beneficiaries", "pillar": "People First", "category": "Women", "current_value": "1.04 Crore", "target_2036": "1.5 Crore", "target_2047": "2 Crore", "trend": "↑0.2Cr", "status": "On-track", "data_source": "WCD", "notes": None}
        ]
        await db.kpis.insert_many(kpis_data)

        # Seed Budget
        budget_data = [
            {"id": str(uuid.uuid4()), "department": "Agriculture & Allied", "pillar": "Rural Power", "allocation": 37838, "utilised": 23839, "committed": 23839, "status": "On-track", "utilisation_percent": 63, "notes": "Samrudha Krushaka, CM-KISAN, Shree Anna"},
            {"id": str(uuid.uuid4()), "department": "Irrigation & Water Resources", "pillar": "Rural Power", "allocation": 16273, "utilised": 8954, "committed": 6183, "status": "At-risk", "utilisation_percent": 55, "notes": "Parvati Giri Phase 2, MATY, river linking"},
            {"id": str(uuid.uuid4()), "department": "Roads, Bridges & Railways", "pillar": "Prosperity", "allocation": 18500, "utilised": 10175, "committed": 7215, "status": "On-track", "utilisation_percent": 55, "notes": "Setu Bandhan, MM Sadak Yojana, PMGSY"},
            {"id": str(uuid.uuid4()), "department": "Women & Child Dev", "pillar": "People First", "allocation": 10000, "utilised": 5500, "committed": 3900, "status": "On-track", "utilisation_percent": 55, "notes": "Subhadra Yojana DBT active"},
            {"id": str(uuid.uuid4()), "department": "Social Security (Pension)", "pillar": "People First", "allocation": 5370, "utilised": 2954, "committed": 2418, "status": "On-track", "utilisation_percent": 55, "notes": "Madhubabu Pension"},
            {"id": str(uuid.uuid4()), "department": "Health", "pillar": "People First", "allocation": 6800, "utilised": 3740, "committed": 3060, "status": "At-risk", "utilisation_percent": 55, "notes": "MM Swasthya Seva, Gopabandhu Arogya"},
            {"id": str(uuid.uuid4()), "department": "Urban Development", "pillar": "Prosperity", "allocation": 9985, "utilised": 5492, "committed": 4494, "status": "At-risk", "utilisation_percent": 55, "notes": "MM Sahari Vikas, BCPPER"},
            {"id": str(uuid.uuid4()), "department": "Internal Security", "pillar": "Governance", "allocation": 10760, "utilised": 5918, "committed": 4842, "status": "On-track", "utilisation_percent": 55, "notes": "CCTNS, ERSS expansion"},
            {"id": str(uuid.uuid4()), "department": "Disaster Management", "pillar": "Governance", "allocation": 4000, "utilised": 2200, "committed": 1800, "status": "On-track", "utilisation_percent": 55, "notes": "SDRMF, NDRMF"},
            {"id": str(uuid.uuid4()), "department": "Planning & Convergence", "pillar": "Governance", "allocation": 2808, "utilised": 1544, "committed": 1264, "status": "On-track", "utilisation_percent": 55, "notes": "WODC, SODC"},
            {"id": str(uuid.uuid4()), "department": "MSME & Industries", "pillar": "Prosperity", "allocation": 1567, "utilised": 862, "committed": 705, "status": "On-track", "utilisation_percent": 55, "notes": "CM-SRIM, Land Bank"},
            {"id": str(uuid.uuid4()), "department": "Energy Sector", "pillar": "Tech Lead", "allocation": 3962, "utilised": 2179, "committed": 1783, "status": "On-track", "utilisation_percent": 55, "notes": "MM Shakti Bikash, PM Surya Ghar"},
            {"id": str(uuid.uuid4()), "department": "Tourism", "pillar": "Legacy", "allocation": 800, "utilised": 440, "committed": 360, "status": "On-track", "utilisation_percent": 55, "notes": "Circuit development, accommodation"},
            {"id": str(uuid.uuid4()), "department": "Sports", "pillar": "Legacy", "allocation": 1320, "utilised": 726, "committed": 594, "status": "On-track", "utilisation_percent": 55, "notes": "Stadium construction, talent programs"},
            {"id": str(uuid.uuid4()), "department": "Education", "pillar": "People First", "allocation": 37838, "utilised": 20811, "committed": 12423, "status": "On-track", "utilisation_percent": 55, "notes": "Samagra Sikshya, Godabarisha Vidyalaya"}
        ]
        await db.budget.insert_many(budget_data)

        # Seed AI Alerts
        alerts_data = [
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-001", "severity": "HIGH", "category": "Budget Risk", "title": "Gopabandhu Jana Arogya - Budget underutilisation Q4", "situation": "Health scheme showing 38% utilisation against 62% quarterly target. ₹800 Cr at risk of lapse.", "remedies": ["Accelerate hospital empanelment in 8 underperforming districts", "Redirect ₹500 Cr to rural health camps", "Deploy mobile health units in tribal blocks"], "status": "Open", "owner": "Health Secretary", "deadline": "Apr 15, 2026"},
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-002", "severity": "CRITICAL", "category": "Land Acquisition", "title": "Parvati Giri Phase 2 - LA stalled in Kalahandi", "situation": "347 acres land acquisition pending for 8 months. Civil works at 38% with contractor mobilised.", "remedies": ["Invoke Section 11 of LA Act for expedited acquisition", "Offer 110% ex-gratia compensation", "Parallel-track civil works on acquired land"], "status": "Open", "owner": "Revenue Secretary", "deadline": "Apr 10, 2026"},
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-003", "severity": "MEDIUM", "category": "Project Delay", "title": "DeepTech Fund - Empanelment delayed", "situation": "Venture capital empanelment for DeepTech Fund delayed by 4 months. 50 startup target at risk.", "remedies": ["Fast-track IIT/IIIT Bhubaneswar incubator nodes", "Issue challenge grants by Jun 2026", "Engage NASSCOM for VC connect"], "status": "Open", "owner": "IT Secretary", "deadline": "May 30, 2026"},
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-004", "severity": "HIGH", "category": "Environmental", "title": "Paradip Port Expansion - Environmental clearance pending", "situation": "MoEF clearance for berth expansion delayed 6 months. 150 MTPA capacity target at risk.", "remedies": ["Engage MoEF liaison officer", "Submit revised EIA with mitigation measures", "Parallel greenfield berth DPR preparation"], "status": "Open", "owner": "Commerce Secretary", "deadline": "Apr 20, 2026"},
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-005", "severity": "MEDIUM", "category": "Regional Disparity", "title": "Western Odisha Development Fund - Low utilisation", "situation": "WODC fund utilisation at 30% vs 60% target. Regional disparity persists in Bolangir, Nuapada.", "remedies": ["Engage Sambalpur Divisional Commissioner", "Issue targeted grants to lagging districts", "Review Sambalpur Municipal execution model"], "status": "Open", "owner": "Planning Secretary", "deadline": "Apr 25, 2026"},
            {"id": str(uuid.uuid4()), "alert_id": "ALERT-006", "severity": "LOW", "category": "Contractor Issue", "title": "MATY Minor Irrigation - Contractor default", "situation": "Primary contractor defaulted on 3 check dam projects. Re-tendering initiated.", "remedies": ["Terminate existing contract with penalty", "Re-tender with performance bond requirement", "Engage NABARD for technical support"], "status": "Open", "owner": "Water Resources Secretary", "deadline": "May 15, 2026"}
        ]
        await db.alerts.insert_many(alerts_data)

        # Seed GSDP Data
        gsdp_data = [
            {"id": str(uuid.uuid4()), "financial_year": "2019-20", "data_type": "Actual", "gsdp_lakh_cr": 5.2, "gsdp_usd_bn": 62, "yoy_change": None, "notes": "Pre-COVID baseline"},
            {"id": str(uuid.uuid4()), "financial_year": "2020-21", "data_type": "Actual", "gsdp_lakh_cr": 5.0, "gsdp_usd_bn": 60, "yoy_change": "-3.8%", "notes": "COVID-19 impact"},
            {"id": str(uuid.uuid4()), "financial_year": "2021-22", "data_type": "Actual", "gsdp_lakh_cr": 5.9, "gsdp_usd_bn": 71, "yoy_change": "+18%", "notes": "Recovery year"},
            {"id": str(uuid.uuid4()), "financial_year": "2022-23", "data_type": "Actual", "gsdp_lakh_cr": 7.2, "gsdp_usd_bn": 86, "yoy_change": "+22%", "notes": "Strong rebound"},
            {"id": str(uuid.uuid4()), "financial_year": "2023-24", "data_type": "Actual", "gsdp_lakh_cr": 8.1, "gsdp_usd_bn": 97, "yoy_change": "+12.5%", "notes": "Pre-election momentum"},
            {"id": str(uuid.uuid4()), "financial_year": "2024-25", "data_type": "Actual", "gsdp_lakh_cr": 9.5, "gsdp_usd_bn": 114, "yoy_change": "+17.3%", "notes": "Budget push"},
            {"id": str(uuid.uuid4()), "financial_year": "2025-26", "data_type": "Current", "gsdp_lakh_cr": 10.63, "gsdp_usd_bn": 120, "yoy_change": "+12%", "notes": "Vision execution year"},
            {"id": str(uuid.uuid4()), "financial_year": "2026-27", "data_type": "Projected", "gsdp_lakh_cr": 11.9, "gsdp_usd_bn": 143, "yoy_change": "+12%", "notes": "CAGR projection"},
            {"id": str(uuid.uuid4()), "financial_year": "2029-30", "data_type": "Projected", "gsdp_lakh_cr": 16.8, "gsdp_usd_bn": 201, "yoy_change": "+12%", "notes": "Mid-term milestone"},
            {"id": str(uuid.uuid4()), "financial_year": "2035-36", "data_type": "Target", "gsdp_lakh_cr": 46.0, "gsdp_usd_bn": 500, "yoy_change": None, "notes": "Vision 2036 target"},
            {"id": str(uuid.uuid4()), "financial_year": "2046-47", "data_type": "Target", "gsdp_lakh_cr": 125.0, "gsdp_usd_bn": 1500, "yoy_change": None, "notes": "Vision 2047 target"}
        ]
        await db.gsdp.insert_many(gsdp_data)

        # Seed Schemes
        schemes_data = [
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-001", "name": "Subhadra Yojana", "pillar": "People First", "department": "WCD & Mission Shakti", "budget": 10000, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "1.04 Cr / 1.5 Cr target", "status_flag": "DBT active", "description": "₹10,000 given in 2 installments for women empowerment"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-002", "name": "Gopabandhu Jana Arogya Yojana", "pillar": "People First", "department": "Health & FW", "budget": 5450, "scheme_type": "State", "progress": "At-risk", "status": "At-risk", "beneficiary_coverage": "62% enrolled", "status_flag": "Enrolment lag", "description": "Cashless health at empanelled hospitals"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-003", "name": "Samrudha Krushaka Yojana", "pillar": "Rural Power", "department": "Agriculture", "budget": 5000, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "58L / 80L target", "status_flag": "On-track", "description": "₹2L income target per farmer family annually"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-004", "name": "Madhubabu Pension Yojana", "pillar": "People First", "department": "Social Security", "budget": 5370, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "All eligible covered", "status_flag": "Ongoing", "description": "₹500-700/month social security pension"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-005", "name": "Samagra Sikshya Abhiyan", "pillar": "People First", "department": "School Education", "budget": 3791, "scheme_type": "CSS", "progress": "Active", "status": "On-track", "beneficiary_coverage": "92.4% GER", "status_flag": "On-track", "description": "Centrally sponsored education scheme"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-006", "name": "CM-KISAN", "pillar": "Rural Power", "department": "Agriculture", "budget": 1935, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "58L farmers", "status_flag": "On-track", "description": "₹4,000/yr direct benefit to paddy farmers"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-007", "name": "Jal Jeevan Mission", "pillar": "People First", "department": "Rural Dev", "budget": 8000, "scheme_type": "CSS", "progress": "Active", "status": "On-track", "beneficiary_coverage": "58% covered", "status_flag": "On-track", "description": "100% functional tap connections by 2026"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-008", "name": "MGNREGS", "pillar": "Rural Power", "department": "Rural Dev", "budget": 3651, "scheme_type": "CSS", "progress": "Active", "status": "On-track", "beneficiary_coverage": "22 Cr person-days", "status_flag": "On-track", "description": "Rural employment guarantee"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-009", "name": "TASP", "pillar": "People First", "department": "ST & SC Dev", "budget": 39638, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "Tribal equity 90%", "status_flag": "On-track", "description": "Dedicated tribal welfare budget"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-010", "name": "SCSP", "pillar": "People First", "department": "ST & SC Dev", "budget": 29243, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "SC poverty <5%", "status_flag": "On-track", "description": "Dedicated SC welfare budget"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-011", "name": "PM Surya Ghar", "pillar": "Tech Lead", "department": "Energy", "budget": 890, "scheme_type": "CSS", "progress": "Planned", "status": "Planned", "beneficiary_coverage": "5L target", "status_flag": "Planned", "description": "Rooftop solar; 300 units free electricity/month"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-012", "name": "SDRMF", "pillar": "Governance", "department": "Revenue & DM", "budget": 4000, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "24x7 response", "status_flag": "On-track", "description": "State Disaster Response & Mitigation Fund"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-013", "name": "ERSS-112", "pillar": "Governance", "department": "Home", "budget": 118, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "<8 min response", "status_flag": "On-track", "description": "Integrated police-fire-ambulance emergency"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-014", "name": "Lakhpati Didi", "pillar": "People First", "department": "WCD & Mission Shakti", "budget": 2000, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "17L / 25L target", "status_flag": "On-track", "description": "₹1L income target for SHG women"},
            {"id": str(uuid.uuid4()), "scheme_id": "SCH-015", "name": "Tourism Circuit Development", "pillar": "Legacy", "department": "Tourism", "budget": 800, "scheme_type": "State", "progress": "Active", "status": "On-track", "beneficiary_coverage": "5 Cr arrivals/yr", "status_flag": "On-track", "description": "Heritage, eco, spiritual circuits"}
        ]
        await db.schemes.insert_many(schemes_data)

        # Seed Vision KPIs from Excel data
        await db.vision_kpis.delete_many({})
        import json as json_lib
        vision_kpis_path = os.path.join(os.path.dirname(__file__), "vision_kpis_data.json")
        if os.path.exists(vision_kpis_path):
            with open(vision_kpis_path) as f:
                vision_kpis_data = json_lib.load(f)
            if vision_kpis_data:
                await db.vision_kpis.insert_many(vision_kpis_data)

        return {"message": "Database seeded successfully", "collections": ["pillars", "programs", "districts", "kpis", "budget", "alerts", "gsdp", "schemes", "vision_kpis"]}

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
