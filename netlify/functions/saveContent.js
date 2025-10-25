// netlify/functions/save.js
import fs from 'fs';
import path from 'path';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const filePath = path.join(process.cwd(), 'savedContent.json');

    let saved = {};
    if (fs.existsSync(filePath)) {
      saved = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    saved[data.id] = data.content;
    fs.writeFileSync(filePath, JSON.stringify(saved, null, 2));

    return { statusCode: 200, body: 'Saved successfully' };
  } catch (err) {
    return { statusCode: 500, body: 'Erreur: ' + err.message };
  }
}
