import os
import io
import base64
from datetime import datetime, timedelta, date

import jwt
import openpyxl
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from PIL import Image
from ultralytics import YOLO
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
JWT_SECRET = os.getenv("JWT_SECRET")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="Waste Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Đang load model YOLO, đợi vài giây...")
model = YOLO("model/best.pt")
print("Model đã sẵn sàng.")

CLASS_TRANSLATE = {
    "GLASS": "Thủy tinh",
    "METAL": "Kim loại",
    "CARDBOARD": "Bìa carton",
    "BIODEGRADABLE": "Rác hữu cơ",
    "PLASTIC": "Nhựa",
    "PAPER": "Giấy",
}

# ================= AUTH =================

class LoginRequest(BaseModel):
    username: str
    password: str

def create_token(username: str) -> str:
    payload = {"sub": username, "exp": datetime.utcnow() + timedelta(hours=8)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token đăng nhập")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token đã hết hạn, đăng nhập lại")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

@app.post("/admin/login")
def admin_login(data: LoginRequest):
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    return {"access_token": create_token(data.username), "token_type": "bearer"}

# ================= BANNER =================

class BannerUpdate(BaseModel):
    title: str
    subtitle: str
    image_url: str | None = None
    link_url: str | None = None

@app.get("/banner")
def get_banner():
    res = supabase.table("banners").select("*").eq("is_active", True).limit(1).execute()
    if not res.data:
        return {"title": "EcoFlow", "subtitle": "Nhận diện rác thải, sống xanh mỗi ngày", "image_url": None}
    return res.data[0]

@app.put("/admin/banner")
def update_banner(data: BannerUpdate, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("banners").select("id").eq("is_active", True).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Không tìm thấy banner")
    banner_id = res.data[0]["id"]
    supabase.table("banners").update(data.model_dump()).eq("id", banner_id).execute()
    return {"message": "Đã cập nhật banner"}

# ================= SITE SETTINGS =================

class SiteSettingsUpdate(BaseModel):
    logo_header_url: str | None = None
    logo_footer_url: str | None = None
    logo_admin_url: str | None = None
    brand_name: str
    footer_description: str
    footer_email: str
    footer_email_link: str | None = None
    footer_phone: str
    footer_phone_link: str | None = None
    footer_address: str
    footer_address_link: str | None = None

@app.get("/site-settings")
def get_site_settings():
    res = supabase.table("site_settings").select("*").limit(1).execute()
    if not res.data:
        return {
            "footer_description": "EcoFlow giúp bạn nhận diện và xử lý rác thải đúng cách.",
            "footer_email": "contact@ecoflow.vn",
            "footer_phone": "0123 456 789",
            "footer_address": "TP. Hồ Chí Minh, Việt Nam",
        }
    return res.data[0]

@app.put("/admin/site-settings")
def update_site_settings(data: SiteSettingsUpdate, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("site_settings").select("id").limit(1).execute()
    if not res.data:
        supabase.table("site_settings").insert(data.model_dump()).execute()
    else:
        settings_id = res.data[0]["id"]
        supabase.table("site_settings").update(data.model_dump()).eq("id", settings_id).execute()
    return {"message": "Đã cập nhật cài đặt website"}

# ================= WASTE TYPES =================

class WasteTypeUpdate(BaseModel):
    display_name: str
    color: str
    process: str
    should_list: list[str]
    avoid_list: list[str]

@app.get("/waste-types")
def get_waste_types():
    res = supabase.table("waste_types").select("*").execute()
    return {item["class_name"]: item for item in res.data}

@app.put("/admin/waste-types/{class_name}")
def update_waste_type(class_name: str, data: WasteTypeUpdate, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("waste_types").select("id").eq("class_name", class_name).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại rác này")
    supabase.table("waste_types").update(data.model_dump()).eq("class_name", class_name).execute()
    return {"message": f"Đã cập nhật thông tin loại rác {class_name}"}

# ================= FONTS =================

class FontIn(BaseModel):
    name: str
    format: str
    font_data: str

@app.get("/fonts")
def list_fonts():
    res = supabase.table("custom_fonts").select("*").order("created_at").execute()
    return res.data

@app.post("/admin/fonts")
def upload_font(data: FontIn, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("custom_fonts").insert(data.model_dump()).execute()
    return res.data[0]

# ================= ARTICLES =================

class ArticleIn(BaseModel):
    title: str
    title_color: str | None = None
    cover_image_url: str | None = None
    published: bool = True
    content_blocks: list = []
    visible_from: str | None = None
    visible_until: str | None = None

def _filter_visible(rows):
    today = date.today().isoformat()
    return [
        a for a in rows
        if a.get("published")
        and (not a.get("visible_from") or a["visible_from"] <= today)
        and (not a.get("visible_until") or a["visible_until"] >= today)
    ]

@app.get("/articles")
def list_public_articles():
    res = supabase.table("articles").select("*").order("created_at", desc=True).execute()
    return _filter_visible(res.data or [])

@app.get("/articles/{article_id}")
def get_public_article(article_id: str):
    res = supabase.table("articles").select("*").eq("id", article_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài báo")
    visible = _filter_visible([res.data])
    if not visible:
        raise HTTPException(status_code=404, detail="Bài báo không khả dụng")
    return visible[0]

@app.get("/admin/articles")
def get_all_articles(authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("articles").select("*").order("created_at", desc=True).execute()
    return res.data

@app.get("/admin/articles/{article_id}")
def get_admin_article(article_id: str, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("articles").select("*").eq("id", article_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài báo")
    return res.data

@app.post("/admin/articles")
def create_article(data: ArticleIn, authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("articles").insert(data.model_dump()).execute()
    return res.data[0]

@app.put("/admin/articles/{article_id}")
def update_article(article_id: str, data: ArticleIn, authorization: str = Header(None)):
    verify_token(authorization)
    supabase.table("articles").update(data.model_dump()).eq("id", article_id).execute()
    return {"message": "Đã cập nhật bài báo"}

@app.delete("/admin/articles/{article_id}")
def delete_article(article_id: str, authorization: str = Header(None)):
    verify_token(authorization)
    supabase.table("articles").delete().eq("id", article_id).execute()
    return {"message": "Đã xoá bài báo"}

@app.patch("/admin/articles/{article_id}/toggle")
def toggle_article(article_id: str, authorization: str = Header(None)):
    verify_token(authorization)
    current = supabase.table("articles").select("published").eq("id", article_id).single().execute()
    new_val = not current.data["published"]
    supabase.table("articles").update({"published": new_val}).eq("id", article_id).execute()
    return {"published": new_val}

# ================= HISTORY =================

@app.get("/admin/history")
def get_history(authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("classification_history").select("*").order("id", desc=True).limit(200).execute()
    return res.data

@app.delete("/admin/history/{record_id}")
def delete_history(record_id: str, authorization: str = Header(None)):
    verify_token(authorization)
    supabase.table("classification_history").delete().eq("id", record_id).execute()
    return {"message": "Đã xoá bản ghi"}

@app.get("/admin/history/export")
def export_history(authorization: str = Header(None)):
    verify_token(authorization)
    res = supabase.table("classification_history").select("*").order("id", desc=True).execute()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Lich su phan loai"
    ws.append(["STT", "Thời gian", "Loại rác phát hiện", "Số lượng vật thể", "Độ tin cậy trung bình (%)"])

    for idx, row in enumerate(res.data, start=1):
        detections = row.get("detections", [])
        class_names = ", ".join(sorted(set(d.get("class_display", d.get("class_name", "")) for d in detections))) if detections else "Không phát hiện"
        avg_conf = round(sum(d.get("confidence", 0) for d in detections) / len(detections) * 100, 1) if detections else 0
        ws.append([idx, row.get("created_at", ""), class_names, len(detections), avg_conf])

    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=lich_su_phan_loai.xlsx"},
    )

# ================= STATS =================

@app.get("/admin/stats")
def get_stats(authorization: str = Header(None)):
    verify_token(authorization)

    history_res = supabase.table("classification_history").select("detections, created_at").execute()
    rows = history_res.data or []

    total_scans = len(rows)
    class_count = {}
    total_detections = 0
    for row in rows:
        for d in row.get("detections", []):
            name = d.get("class_display", d.get("class_name", "Khác"))
            class_count[name] = class_count.get(name, 0) + 1
            total_detections += 1

    by_class = [{"name": k, "count": v} for k, v in sorted(class_count.items(), key=lambda x: -x[1])]

    articles_res = supabase.table("articles").select("id", count="exact").execute()
    total_articles = articles_res.count or 0

    return {
        "total_scans": total_scans,
        "total_detections": total_detections,
        "total_articles": total_articles,
        "by_class": by_class,
    }

# ================= PREDICT =================

@app.get("/")
def root():
    return {"status": "ok", "message": "Waste Classifier API đang chạy"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    results = model.predict(image, conf=0.35)
    result = results[0]

    detections = []
    for box in result.boxes:
        cls_id = int(box.cls[0])
        cls_name = model.names[cls_id]
        conf = float(box.conf[0])
        x1, y1, x2, y2 = [float(v) for v in box.xyxy[0]]
        detections.append({
            "class_name": cls_name,
            "class_display": CLASS_TRANSLATE.get(cls_name, cls_name),
            "confidence": round(conf, 4),
            "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
        })

    annotated = result.plot()[:, :, ::-1]
    annotated_img = Image.fromarray(annotated)
    buffer = io.BytesIO()
    annotated_img.save(buffer, format="JPEG", quality=85)
    image_base64 = "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode()

    supabase.table("classification_history").insert({
        "image_url": image_base64,
        "detections": detections,
    }).execute()

    return {"detections": detections, "annotated_image": image_base64}