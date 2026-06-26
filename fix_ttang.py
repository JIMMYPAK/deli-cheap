import os
import json
import glob
import time
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-2.5-flash')

directory = '/Users/jimmypak/deli-cheap/TTANG'
files = sorted(glob.glob(f'{directory}/*.PNG'))

results = []

prompt = """
Analyze this delivery app discount coupon image and extract the following information.
You must return ONLY a valid JSON object. Do not include markdown formatting like ```json.

The image contains a coupon for a brand (e.g. 맘스터치, 메가MGC커피, 피자알볼로, 버거킹, etc.).
Under the large discount amount text, there is smaller grey text indicating the minimum order amount, such as "16,000원 이상 주문시".

Extract these fields:
1. "app": always "땡겨요"
2. "brand": the brand name, removing modifiers like "할인", "최대", "선착순".
3. "discount": the discount amount as an integer (e.g., 10000).
4. "min_order": the minimum order amount as an integer (e.g. 16000), extracted carefully from the grey text. If no minimum order is specified, return null.
5. "method": "전체"
6. "delivery_types": []
7. "special_condition": null
8. "valid_until": null (or extract date if you want, but null is fine per rules for special condition, wait, the prompt says "valid_until are present as per the original rules". The original rule says YYYY-MM-DD. If there is a date range like 2026.04.13~2026.04.26, use the end date "2026-04-26". If not, null.)

Example Output:
{
  "app": "땡겨요",
  "brand": "맘스터치",
  "discount": 10000,
  "min_order": 16000,
  "method": "전체",
  "delivery_types": [],
  "special_condition": null,
  "valid_until": "2026-04-26"
}
"""

for f in files:
    try:
        sample_file = genai.upload_file(f)
        response = model.generate_content([prompt, sample_file])
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
        data = json.loads(text)
        results.append(data)
        print(f"Processed {f}: {data['brand']} - min_order: {data['min_order']}")
        time.sleep(2) # rate limit
    except Exception as e:
        print(f"Error processing {f}: {e}")

with open('TTANG.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done")
