import torch
import pickle
import os
from .model import get_model
from torchvision import transforms
from .utils.output_utils import prepare_output
from PIL import Image
from .args import get_parser
import io


data_dir = r'D:\VSCodeProjects\food-captioning\backend\models'
device = torch.device('cpu')
map_loc = 'cpu'

ingrs_vocab = pickle.load(open(os.path.join(data_dir, 'ingr_vocab.pkl'), 'rb'))
vocab = pickle.load(open(os.path.join(data_dir, 'instr_vocab.pkl'), 'rb'))
ingr_vocab_size = len(ingrs_vocab)
instrs_vocab_size = len(vocab)

args = get_parser()
args.maxseqlen = 15
args.ingrs_only = False

model = get_model(args, ingr_vocab_size, instrs_vocab_size)
model_path = os.path.join(data_dir, 'modelbest.ckpt')
model.load_state_dict(torch.load(model_path, map_location=map_loc))
model.to(device)
model.eval()
model.ingrs_only = False
model.recipe_only = False

to_input_transf = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224)
])


def inverse_cooking(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image_transf = transform(image)
    image_tensor = to_input_transf(image_transf).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model.sample(image_tensor, greedy=True, temperature=1.0, beam=-1, true_ingrs=None)
    
    ingr_ids = outputs['ingr_ids'].cpu().numpy()
    recipe_ids = outputs['recipe_ids'].cpu().numpy()
    outs, _ = prepare_output(recipe_ids[0], ingr_ids[0], ingrs_vocab, vocab)
    
    return outs['title'], outs['ingrs'], outs['recipe']


if __name__ == '__main__':
    demo_urls = [
        '/home/marknguyen/VSCodeProjects/vs-cap-app/models/demo_imgs/1.jpg',
    ]

    for img_file in demo_urls:
        image = Image.open(img_file)
        image_transf = transform(image)
        image_tensor = to_input_transf(image_transf).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model.sample(image_tensor, greedy=True, temperature=1.0, beam=-1, true_ingrs=None)
        
        ingr_ids = outputs['ingr_ids'].cpu().numpy()
        recipe_ids = outputs['recipe_ids'].cpu().numpy()
        outs, _ = prepare_output(recipe_ids[0], ingr_ids[0], ingrs_vocab, vocab)
        
        print("Ingredients:", ", ".join(outs['ingrs']))
        print("Recipe:")
        for step in outs['recipe']:
            print(f"- {step}")