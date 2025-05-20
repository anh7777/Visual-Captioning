import torch
from PIL import Image
from io import BytesIO
from transformers import pipeline
from transformers import BlipProcessor, BlipForConditionalGeneration, T5Tokenizer

model = BlipForConditionalGeneration.from_pretrained(r"D:\VSCodeProjects\food-captioning\backend\models\blip-food-finetuned")
processor = BlipProcessor.from_pretrained(r"D:\VSCodeProjects\food-captioning\backend\models\blip-food-finetuned", use_fast=False)

device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

tokenizer = T5Tokenizer.from_pretrained("Vamsi/T5_Paraphrase_Paws", legacy=False)
paraphraser = pipeline("text2text-generation", model="Vamsi/T5_Paraphrase_Paws", tokenizer=tokenizer)
grammar_corrector = pipeline("text2text-generation", model="pszemraj/flan-t5-large-grammar-synthesis")

def generate_simple_caption(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(device)
    output = model.generate(**inputs, max_length=32)
    caption = processor.decode(output[0], skip_special_tokens=True)
    return caption

def paraphrase_caption(text, num_return_sequences=1):
    prompt = f"paraphrase: {text}"
    outputs = paraphraser(prompt, max_length=150, num_return_sequences=num_return_sequences, num_beams=num_return_sequences)
    return [o['generated_text'] for o in outputs]

def polish_caption(text):
    corrected = grammar_corrector(text, max_length=80, num_return_sequences=1)
    return corrected[0]['generated_text']

def generate_caption(image_bytes, num_paraphrases=5):
    base_caption = generate_simple_caption(image_bytes)
    para = paraphrase_caption(base_caption, num_return_sequences=num_paraphrases)[0]
    caption = polish_caption(para)
    return caption


if __name__ == "__main__":
    with open(r"D:\OneDrive\Pictures\Saved Pictures\City.jpg", "rb") as f:
        image_bytes = f.read()

    caption = generate_caption(image_bytes)
    print(caption)