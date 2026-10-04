# Real device models (optional)

Drop `.glb` files here and the site uses them automatically — no code change needed.
If a file is missing or fails to load, the built-in procedural device is used instead.

Expected filenames:

| File | Used for |
| --- | --- |
| `iphone.glb` | iPhone products + hero act 1 |
| `macbook.glb` | Mac products + hero act 2 |
| `watch.glb` | Watch products + hero act 3 |
| `ipad.glb` | iPad products |
| `buds.glb` | Audio products |

Guidelines
- Format: **glb** (binary glTF), Draco compression supported
- Size: keep each under ~5 MB
- Textures: baked PBR, 2K max
- Orientation: +Y up, front of the device facing +Z
- Scale does not matter — models are auto-centred and re-scaled to fit the stage
