from pydantic import BaseModel


class RecipeResponse(BaseModel):
    name: str
    ingredients: list[str]
    instructions: list[str]
    
