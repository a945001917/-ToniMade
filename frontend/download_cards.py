import os
import sys
import json
import urllib.request
import urllib.parse

CACHE_DIR = os.path.abspath('public/cards')
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

files = [
  "File:RWS Tarot 00 Fool.jpg",
  "File:RWS Tarot 01 Magician.jpg",
  "File:RWS Tarot 02 High Priestess.jpg",
  "File:RWS Tarot 03 Empress.jpg",
  "File:RWS Tarot 04 Emperor.jpg",
  "File:RWS Tarot 05 Hierophant.jpg",
  "File:RWS Tarot 06 Lovers.jpg",
  "File:RWS Tarot 07 Chariot.jpg",
  "File:RWS Tarot 08 Strength.jpg",
  "File:RWS Tarot 09 Hermit.jpg",
  "File:RWS Tarot 10 Wheel of Fortune.jpg",
  "File:RWS Tarot 11 Justice.jpg",
  "File:RWS Tarot 12 Hanged Man.jpg",
  "File:RWS Tarot 13 Death.jpg",
  "File:RWS Tarot 14 Temperance.jpg",
  "File:RWS Tarot 15 Devil.jpg",
  "File:RWS Tarot 16 Tower.jpg",
  "File:RWS Tarot 17 Star.jpg",
  "File:RWS Tarot 18 Moon.jpg",
  "File:RWS Tarot 19 Sun.jpg",
  "File:RWS Tarot 20 Judgement.jpg",
  "File:RWS Tarot 21 World.jpg"
]

print("Fetching Wikimedia URLs...")
titles = "|".join(files)
url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" + urllib.parse.quote(titles) + "&prop=imageinfo&iiprop=url&format=json"

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
req = urllib.request.Request(url, headers=headers)

import time

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        pages = data['query']['pages']
        
        for page_id, page in pages.items():
            if 'imageinfo' in page and len(page['imageinfo']) > 0:
                title = page['title']
                image_url = page['imageinfo'][0]['url']
                
                try:
                    index = files.index(title)
                    dest = os.path.join(CACHE_DIR, f"{index}.jpg")
                    
                    if os.path.exists(dest) and os.path.getsize(dest) > 10000:
                        print(f"Skipping Card {index} (Already downloaded)")
                        continue
                        
                    print(f"Downloading Card {index}...")
                    
                    # Download the image
                    img_req = urllib.request.Request(image_url, headers=headers)
                    with urllib.request.urlopen(img_req) as img_res:
                        with open(dest, 'wb') as f:
                            f.write(img_res.read())
                    print(f"Successfully downloaded Card {index}")
                    time.sleep(1.5) # Crucial sleep to bypass Wiki 429
                except ValueError:
                    print(f"Unmatched title: {title}")
                    
except Exception as e:
    print("Error:", e)

print("All cards processed.")
