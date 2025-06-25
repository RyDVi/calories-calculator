import base64
import json
from .proxyapi import client
from django.core.files.uploadedfile import InMemoryUploadedFile


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def in_memory_uploaded_file_to_base64(uploaded_file: InMemoryUploadedFile) -> str:
    # Read the file content
    file_content = uploaded_file.read()
    
    # Encode to base64 bytes
    base64_bytes = base64.b64encode(file_content)
    
    # Decode to UTF-8 string
    base64_string = base64_bytes.decode('utf-8')
    
    # Important: Reset file pointer if you might need to read it again
    uploaded_file.seek(0)
    
    return base64_string

# base64_image = encode_image(Path(__file__).resolve().parent.joinpath("test_image_5.jpg"))

def ask_product_info(base64_image):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=300,
        # extra_headers={
        #     "Content-Type": "application/json",
        #     "Authorization": f"Bearer {api_key}"
        # },
        messages=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """You are a professional chef. You receive an image and provide the following data to the program in JSON format:
protein, fat, carbohydrates - bju in field nutrition; 
name - product name;
brand - brand / manufacturer;
barcode - product barcode if available;
category - product category (e.g. meat products, cottage cheese, dairy products, etc.);
quantity - product weight in grams; 

If any data is missing, provide approximate values.
If the value is split into several parts, provide its sum.

Your answers must be written on Russian language.""",
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    }
                ],
            },
        ],
    )

    return json.loads(response.choices[0].message.content.strip('` \n').replace("json\n", ""))
