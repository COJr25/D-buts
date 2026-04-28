import http from 'node:http';

/*
  API ULTRA SIMPLE POUR APPRENDRE
  --------------------------------
  Objectif: alimenter la carte Heart du dashboard.

  Routes:
  - GET  /api/v1/health
  - GET  /api/v1/metrics/heart/latest
  - POST /api/v1/metrics/heart
*/

const PORT = process.env.PORT || 3001;

// "Mini base de données" en mémoire (temporaire)
let latestHeartMetric = {
  bpm: 89,
  measuredAt: new Date().toISOString(),
  source: 'seed'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;

      // Protection minimale anti payload énorme
      if (raw.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      // Body vide => objet vide
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (method === 'GET' && url === '/api/v1/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === 'GET' && url === '/api/v1/metrics/heart/latest') {
    sendJson(res, 200, { data: latestHeartMetric });
    return;
  }

  if (method === 'POST' && url === '/api/v1/metrics/heart') {
    try {
      const body = await readJsonBody(req);
      const bpm = Number(body.bpm);
      const measuredAt = body.measuredAt ? new Date(body.measuredAt) : new Date();

      // Validation simple mais claire
      if (!Number.isInteger(bpm) || bpm < 30 || bpm > 220) {
        sendJson(res, 400, {
          error: 'bpm must be an integer between 30 and 220'
        });
        return;
      }

      if (Number.isNaN(measuredAt.getTime())) {
        sendJson(res, 400, {
          error: 'measuredAt must be a valid date'
        });
        return;
      }

      latestHeartMetric = {
        bpm,
        measuredAt: measuredAt.toISOString(),
        source: body.source || 'manual'
      };

      sendJson(res, 201, { data: latestHeartMetric });
      return;
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }
  }

  sendJson(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});
