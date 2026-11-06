import { describe, expect, it } from 'vitest';

import { resolveSkillTile, SKILL_BACKGROUND_ICONS } from './constants';

describe('SkillBackground constants', () => {
  it('contains every skill tile with a resolved URL', () => {
    expect(SKILL_BACKGROUND_ICONS.length).toBeGreaterThan(0);

    SKILL_BACKGROUND_ICONS.forEach((icon) => {
      expect(icon.url).toMatch(/\.svg|data:image\/svg\+xml/);
      expect(icon.label.length).toBeGreaterThan(0);
      expect(icon.size).toBeGreaterThan(0);
    });
  });

  it('throws for an unknown tile file', () => {
    expect(() => resolveSkillTile('unknown.svg')).toThrow('Skill tile not found');
  });
});
