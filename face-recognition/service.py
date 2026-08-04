import os
import logging
from contextlib import asynccontextmanager

import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("face-service")

MODEL_NAME = os.environ.get("FACE_MODEL", "buffalo_l")
MODEL_ROOT = os.environ.get("FACE_MODEL_ROOT", os.path.expanduser("~/.insightface"))

app = None


@asynccontextmanager
async def lifespan(application: FastAPI):
    global app
    try:
        from insightface.app import FaceAnalysis
    except ImportError:
        logger.error("insightface не установлен. Выполни: bash setup.sh")
        raise
    logger.info("Загрузка модели InsightFace (%s)...", MODEL_NAME)
    app = FaceAnalysis(
        name=MODEL_NAME,
        root=MODEL_ROOT,
        allowed_modules=["detection", "recognition"],
    )
    app.prepare(ctx_id=-1, det_size=(640, 640))
    logger.info("Модель загружена. Ожидание запросов...")
    yield


api = FastAPI(title="Face Recognition Service", lifespan=lifespan)


@api.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}


@api.post("/api/scan")
async def scan(file: UploadFile = File(...)):
    if app is None:
        return JSONResponse({"success": False, "message": "MODEL_NOT_READY"}, status_code=503)

    data = await file.read()
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return JSONResponse({"success": False, "message": "INVALID_IMAGE"}, status_code=400)

    h_img, w_img = img.shape[:2]
    faces = app.get(img)
    result = []
    for face in faces:
        x1, y1, x2, y2 = [int(v) for v in face.bbox]
        result.append({
            "x": round(x1 / w_img, 6),
            "y": round(y1 / h_img, 6),
            "w": round(max(1, x2 - x1) / w_img, 6),
            "h": round(max(1, y2 - y1) / h_img, 6),
            "confidence": round(float(face.det_score), 6),
            "embedding": [float(v) for v in face.normed_embedding],
        })
    return {"success": True, "faces": result}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FACE_PORT", "8008"))
    uvicorn.run("service:api", host="127.0.0.1", port=port, reload=False)
