import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-2.5-flash')
sample_file = genai.upload_file("TTANG/IMG_0405.PNG")

response = model.generate_content([
    "Extract the minimum order amount from this coupon card. Please return ONLY the number.", 
    sample_file
])
print("IMG_0405.PNG min order:", response.text)
