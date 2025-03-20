from pydantic import BaseModel

class Collection(BaseModel):
    collection_id: str
    collection_name: str
    thumbnail_url: str

    class Config:
        from_attributes = True

class CollectionRequest(BaseModel):
    collection_name: str