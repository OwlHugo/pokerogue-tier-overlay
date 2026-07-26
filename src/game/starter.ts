import { keyFor } from '../domain/species-key';
import type { StarterContainer, StarterSelectHandler } from './pokerogue';
import type { Target } from './target';

const BADGE_OFFSET = { x: 0, y: 15 };
const BADGE_SCALE = 0.14;

function targetFor(container: StarterContainer): Target {
  const primary = { speciesId: container.species.speciesId, formKey: '' };

  return {
    key: `starter:${keyFor(primary.speciesId, primary.formKey)}`,
    name: container.species.name,
    primary,
    fusion: null,
    parent: container,
    offset: BADGE_OFFSET,
    scale: BADGE_SCALE,
  };
}

export function readStarterTargets(handler: StarterSelectHandler): Target[] {
  return handler.starterContainers.filter((container) => container.visible).map(targetFor);
}
