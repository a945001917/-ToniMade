import fs from 'fs';
import path from 'path';
import https from 'https';

const CACHE_DIR = path.resolve('public/cards');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const files = [
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
];

async function downloadCards() {
  console.log("Fetching Wikimedia URLs...");
  const titles = files.join('|');
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url&format=json`;
  
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' };

  https.get(url, { headers }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      const pages = json.query.pages;
      
      const downloads = [];
      Object.keys(pages).forEach(pageId => {
        const page = pages[pageId];
        if (page.imageinfo && page.imageinfo.length > 0) {
          const title = page.title;
          const imageUrl = page.imageinfo[0].url;
          
          const index = files.indexOf(title);
          if (index !== -1) {
            downloads.push({ index, url: imageUrl });
          } else {
            console.log(`Unmatched title: ${title}`);
          }
        }
      });
      
      let pending = downloads.length;
      downloads.forEach(({index, url}) => {
        const dest = path.join(CACHE_DIR, `${index}.jpg`);
        https.get(url, { headers }, (imgRes) => {
          const fileStream = fs.createWriteStream(dest);
          imgRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded Card ${index}`);
            pending--;
            if (pending === 0) console.log("All cards downloaded successfully!");
          });
        }).on('error', err => console.log(err.message));
      });
    });
  }).on('error', err => console.log(err.message));
}

downloadCards();
