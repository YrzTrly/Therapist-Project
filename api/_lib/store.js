import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const storePath = path.join(os.tmpdir(), 'theramind-store.json');

function readStore() {
  try {
    if (!fs.existsSync(storePath)) {
      const initialStore = { users: [] };
      fs.writeFileSync(storePath, JSON.stringify(initialStore, null, 2));
      return initialStore;
    }

    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed?.users) ? parsed.users : []
    };
  } catch {
    return { users: [] };
  }
}

function writeStore(store) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function createUserId() {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function findUserByUsername(username) {
  return readStore().users.find((user) => user.username === username);
}

export function createUser(username, password) {
  const store = readStore();
  if (store.users.some((user) => user.username === username)) {
    return { error: 'User already exists' };
  }

  const user = {
    id: createUserId(),
    username,
    password
  };

  store.users.push(user);
  writeStore(store);
  return { user };
}

export function createOAuthUser(email, provider) {
  const store = readStore();
  let existing = store.users.find((user) => user.username === email);
  if (existing) {
    return { user: existing };
  }

  const user = {
    id: createUserId(),
    username: email,
    password: `${provider}-oauth`,
    provider
  };

  store.users.push(user);
  writeStore(store);
  return { user };
}

export function createToken(user) {
  return `token_${user.id}`;
}