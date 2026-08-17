import https from 'https';
import fs from 'fs';

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (redRes) => {
        redRes.pipe(file);
        file.on('finish', () => console.log('Downloaded deep field:', fs.statSync(dest).size, 'bytes'));
      });
      return;
    }
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded deep field:', fs.statSync(dest).size, 'bytes'));
  });
}

download('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Webb%27s_First_Deep_Field.jpg/800px-Webb%27s_First_Deep_Field.jpg', 'public/downloads/datasets/webb/images/cam_02_jwst_deepfield.jpg');
