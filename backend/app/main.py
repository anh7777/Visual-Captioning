from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.auth import router as auth_router
from app.controllers.user import router as user_router
from app.controllers.media import router as media_router
from app.controllers.collection import router as collection_router
from app.controllers.caption import router as caption_router


app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def welcome():
    return {"message": "Welcome to our application!"}

app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(user_router, prefix='/user', tags=['user'])
app.include_router(collection_router, prefix='/collection', tags=['collection'])
app.include_router(media_router, prefix='/media', tags=['media'])
app.include_router(caption_router, prefix='/caption', tags=['caption'])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    