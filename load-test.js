import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Sube de 0 a 20 usuarios en 30 seg
    { duration: '1m', target: 20 }, // Mantén 20 usuarios por 1 minuto
    { duration: '20s', target: 0 }, // Baja a 0 usuarios
  ],
  thresholds: {
    // 2000 de umbral porque Argon2 bajo carga es pesado
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = 'http://localhost:3000';
// const AUTH_PARAMS = {
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'xyz123', // El token que configuramos en el middleware
//   },
// };

export default function () {
  // --- 0. AUTENTICACIÓN (LOGIN) ---
  // Necesario para obtener el token dinámico generado por Argon2 y JWT [cite: 32, 50]
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: 'jose323@gmail.com',
      password: 'xyz123',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  const loginOk = check(loginRes, { 'Login exitoso': (r) => r.status === 200 });
  if (!loginOk) {
    sleep(1);
    return;
  }

  // const loginCheck = check(loginRes, {
  //   'Login exitoso (200)': (r) => r.status === 200,
  //   'Token obtenido': (r) => r.json('tokens.accessToken') !== undefined,
  // });

  // if (!loginCheck) return;

  const accessToken = loginRes.json('tokens.accessToken');
  const refreshToken = loginRes.json('tokens.refreshToken');

  // Parámetros con el Token Real para las rutas protegidas
  const AUTH_PARAMS = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // --- 1. CREATE (POST) ---
  const newEmail = `k6_user_${__VU}_${__ITER}_${Math.floor(Math.random() * 100000)}@test.com`;
  const createPayload = JSON.stringify({
    name: 'K6 CRUD User',
    email: newEmail,
    password: 'password123',
    age: 28,
  });

  const postRes = http.post(`${BASE_URL}/users`, createPayload, AUTH_PARAMS);
  const checkPost = check(postRes, {
    'POST /users status is 201': (r) => r.status === 201,
  });

  if (!checkPost) return;
  const newUserId = postRes.json('_id');

  sleep(0.5);

  // --- 2. READ (GET /:id) ---
  const getRes = http.get(`${BASE_URL}/users/${newUserId}`, AUTH_PARAMS);
  check(getRes, { 'GET /users/:id status is 200': (r) => r.status === 200 });

  sleep(1);

  // --- 3. UPDATE (PUT /:id) ---
  const updatePayload = JSON.stringify({ name: 'K6 Updated', age: 35 });
  const putRes = http.put(
    `${BASE_URL}/users/${newUserId}`,
    updatePayload,
    AUTH_PARAMS,
  );
  check(putRes, { 'PUT /users/:id status is 200': (r) => r.status === 200 });

  sleep(1);

  // --- 4. REFRESH TOKEN (POST /auth/refresh) ---
  // Probamos el endpoint de rotación de tokens
  const refreshRes = http.post(`${BASE_URL}/auth/refresh`, null, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  check(refreshRes, {
    'Refresh Token válido funciona (200)': (r) => r.status === 200,
  });

  sleep(0.5);

  // --- 5. PRUEBA DE ROBUSTEZ (TOKEN ALTERADO) ---
  // Intentamos usar un token de refresco modificado manualmente para verificar el HTTP 401
  const tamperedToken =
    refreshToken.substring(0, refreshToken.length - 10) + 'INVALID123';
  const robustRes = http.post(`${BASE_URL}/auth/refresh`, null, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tamperedToken}`,
    },
  });

  check(robustRes, {
    'Robustez: Token alterado es rechazado (401)': (r) => r.status === 401,
  });

  sleep(1);

  // --- 6. DELETE (DELETE /:id) ---
  const delRes = http.del(`${BASE_URL}/users/${newUserId}`, null, AUTH_PARAMS);
  check(delRes, {
    'DELETE status is 204': (r) => r.status === 204,
  });

  sleep(1); // El usuario virtual espera 1 segundo antes de repetir
}
