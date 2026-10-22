import assert from 'node:assert/strict';
import test from 'node:test';
import { LANGUAGE_KEY, localeFromPath, localizedPath, normalizePath, preferredLocale } from './language-routing.js';

const storage = value => ({ getItem: key => key === LANGUAGE_KEY ? value : null });

test('saved choice takes priority over browser language', () => {
  assert.equal(preferredLocale(storage('en'), ['fr-FR']), 'en');
  assert.equal(preferredLocale(storage('fr'), ['en-US']), 'fr');
});
test('browser French is selected and other languages default to English', () => {
  assert.equal(preferredLocale(storage(null), ['fr-CA', 'en-US']), 'fr');
  assert.equal(preferredLocale(storage(null), ['de-DE']), 'en');
});
test('/atl is always a French route regardless of entry preference', () => {
  assert.equal(localeFromPath('/atl'), 'fr');
  assert.equal(localizedPath('/atl', 'en'), '/en/atl');
  assert.equal(localizedPath('/en/atl', 'fr'), '/atl');
});
test('language switching preserves supported pages', () => {
  assert.equal(localizedPath('/fr/projets', 'en'), '/en/projects');
  assert.equal(localizedPath('/en/experience', 'fr'), '/fr/parcours');
  assert.equal(localizedPath('/fr/projets/atl-lab', 'en'), '/en/projects/atl-lab');
});
test('trailing slashes added by nginx do not change routing', () => {
  assert.equal(normalizePath('/fr/'), '/fr');
  assert.equal(normalizePath('/'), '/');
  assert.equal(localeFromPath('/atl/'), 'fr');
  assert.equal(localizedPath('/fr/projets/', 'en'), '/en/projects');
  assert.equal(localizedPath('/en/', 'fr'), '/fr');
});
