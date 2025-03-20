from clarifai.client.model import Model

model_url = "https://clarifai.com/salesforce/blip/models/general-english-image-caption-blip"

def generate_image_caption(image_bytes):
    try:
        model_prediction = Model(url=model_url, pat='10a2f415f1854abc82b33bc89adc7bd0').predict_by_bytes(
            image_bytes, input_type="image"
        )
        return model_prediction.outputs[0].data.text.raw
    except Exception as e:
        return f"Error: {str(e)}"