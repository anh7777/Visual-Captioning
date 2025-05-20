from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.controllers.auth import router as auth_router
from app.controllers.model import router as model_router
from app.controllers.album import router as album_router
from app.controllers.media import router as media_router
from app.controllers.rating import router as rating_router

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(model_router, prefix='/model', tags=['model'])
app.include_router(album_router, prefix='/album', tags=['album'])
app.include_router(media_router, prefix='/media', tags=['media'])
app.include_router(rating_router, prefix='/rating', tags=['rating'])



@app.get('/')
async def hello_wolrd():
    return {"message": "Hello world"}


if __name__ == '__main__':
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)