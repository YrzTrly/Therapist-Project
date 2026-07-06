import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const storePath = path.join(os.tmpdir(), 'theramind-db.json');

function createInitialStore() {
  return { users: [], messages: [] };
}

function readStore() {
  try {
    if (!fs.existsSync(storePath)) {
      fs.writeFileSync(storePath, JSON.stringify(createInitialStore(), null, 2));
    }

    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed?.users) ? parsed.users : [],
      messages: Array.isArray(parsed?.messages) ? parsed.messages : []
    };
  } catch {
    return createInitialStore();
  }
}

function saveStore(store) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export function findUserByUsername(username) {
  return readStore().users.find((user) => user.username === username);
}

export function createUser(username, password) {
  const store = readStore();
  if (store.users.some((user) => user.username === username)) {
    return { error: 'User already exists' };
  }

  const user = { id: `user_${Date.now().toString(36)}`, username, password };
  store.users.push(user);
  saveStore(store);
  return { user };
}

export function createOAuthUser(email, provider) {
  const store = readStore();
  let existing = store.users.find((user) => user.username === email);
  if (existing) {
    return { user: existing };
  }

  const user = { id: `user_${Date.now().toString(36)}`, username: email, password: `${provider}-oauth`, provider };
  store.users.push(user);
  saveStore(store);
  return { user };
}

export function createToken(user) {
  return `token_${user.id}`;
}