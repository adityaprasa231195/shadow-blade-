class CollisionSystem {
  rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  pointInRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  circleRectOverlap(cx, cy, radius, r) {
    const closestX = Math.max(r.x, Math.min(cx, r.x + r.w));
    const closestY = Math.max(r.y, Math.min(cy, r.y + r.h));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return (distX * distX + distY * distY) < (radius * radius);
  }

  resolveTileX(entity, tiles, tileSize) {
    const startY = Math.floor((entity.y + 2) / tileSize);
    const endY = Math.floor((entity.y + entity.h - 3) / tileSize);

    if (entity.vx > 0) {
      const tx = Math.floor((entity.x + entity.w) / tileSize);
      for (let ty = startY; ty <= endY; ty++) {
        const tile = tiles[ty] && tiles[ty][tx];
        if (tile && tile.solid) {
          entity.x = tx * tileSize - entity.w;
          entity.vx = 0;
          return;
        }
      }
    } else if (entity.vx < 0) {
      const tx = Math.floor(entity.x / tileSize);
      for (let ty = startY; ty <= endY; ty++) {
        const tile = tiles[ty] && tiles[ty][tx];
        if (tile && tile.solid) {
          entity.x = (tx + 1) * tileSize;
          entity.vx = 0;
          return;
        }
      }
    }
  }

  resolveTileY(entity, tiles, tileSize) {
    const startX = Math.floor((entity.x + 1) / tileSize);
    const endX = Math.floor((entity.x + entity.w - 1) / tileSize);

    let grounded = false;

    if (entity.vy >= 0) {
      const ty = Math.floor((entity.y + entity.h) / tileSize);
      for (let tx = startX; tx <= endX; tx++) {
        const tile = tiles[ty] && tiles[ty][tx];
        if (tile && tile.solid) {
          entity.y = ty * tileSize - entity.h;
          entity.vy = 0;
          grounded = true;
          entity.standingTileType = tile.type || "normal";
          entity.isGrounded = true;
          return;
        }
      }
    } else if (entity.vy < 0) {
      const ty = Math.floor(entity.y / tileSize);
      for (let tx = startX; tx <= endX; tx++) {
        const tile = tiles[ty] && tiles[ty][tx];
        if (tile && tile.solid) {
          entity.y = (ty + 1) * tileSize;
          entity.vy = 0;
          return;
        }
      }
    }
    entity.isGrounded = grounded;
  }

  resolveOneWayPlatforms(entity, platforms, prevY) {
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      if (p.broken) continue;
      
      const feetPrev = prevY + entity.h;
      const feetNow = entity.y + entity.h;

      if (
        entity.vy >= 0 &&
        feetPrev <= p.y + 6 &&
        feetNow >= p.y &&
        entity.x + entity.w > p.x &&
        entity.x < p.x + p.w
      ) {
        entity.y = p.y - entity.h;
        entity.vy = 0;
        entity.isGrounded = true;
        entity.standingOnPlatform = p;
        if (p.isCrumbling && !p.triggered) {
          p.triggered = true;
          p.timer = 0.9;
        }
        return;
      }
    }
  }
}

window.Collision = new CollisionSystem();
