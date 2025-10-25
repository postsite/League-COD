const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body);
  const { filePath, content } = body;

  const token = process.env.GITHUB_TOKEN; // récupéré depuis Netlify
  const repo = 'postsite/League-COD';           // <-- remplace par ton repo GitHub
  const branch = 'main';                  // ou master

  // Récupérer le SHA du fichier
  const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  });

  if (!getFileRes.ok) return { statusCode: getFileRes.status, body: 'Impossible de récupérer le fichier.' };

  const fileData = await getFileRes.json();
  const sha = fileData.sha;

  // Mettre à jour le fichier
  const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
    body: JSON.stringify({
      message: `Mise à jour de ${filePath}`,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch
    })
  });

  if (!updateRes.ok) return { statusCode: updateRes.status, body: 'Impossible de mettre à jour le fichier.' };

  return { statusCode: 200, body: 'Fichier mis à jour avec succès.' };
};
