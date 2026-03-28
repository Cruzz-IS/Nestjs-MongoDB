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
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones debe durar menos de 500ms
  },
};

const BASE_URL = 'http://localhost:3000/users';
const PARAMS = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'xyz123', // El token que configuramos en el middleware
  },
};

export default function () {
  // --- 1. CREATE (POST) ---
  const email = `k6_user_${__VU}_${__ITER}_${Math.floor(Math.random() * 100000)}@test.com`;
  const payload = JSON.stringify({
    name: 'K6 CRUD User',
    email: email,
    password: 'password123',
    age: 28,
  });

  const postRes = http.post(BASE_URL, payload, PARAMS);
  const checkPost = check(postRes, {
    'POST status is 201': (r) => r.status === 201,
  });

  if (!checkPost) return; // Si no se crea el usuario, no podemos seguir con el CRUD o los siguientes endpoints

  const userId = postRes.json('_id'); // Extraemos el ID del user de la respuesta de NestJS/MongoDB

  sleep(1);

  // --- 2. READ (GET /:id) ---
  const getRes = http.get(`${BASE_URL}/${userId}`, PARAMS);
  check(getRes, { 'GET status is 200': (r) => r.status === 200 });

  sleep(1);

  // --- 3. UPDATE (PUT /:id) ---
  const updatePayload = JSON.stringify({
    name: 'K6 Updated Name',
    age: 35,
  });
  const putRes = http.put(`${BASE_URL}/${userId}`, updatePayload, PARAMS);
  check(putRes, { 'PUT status is 200': (r) => r.status === 200 });

  sleep(1);

  // --- 4. DELETE (DELETE /:id) ---
  const delRes = http.del(`${BASE_URL}/${userId}`, null, PARAMS);
  check(delRes, { 'DELETE status is 200': (r) => r.status === 200 });

  sleep(1); // El usuario virtual espera 1 segundo antes de repetir
}
