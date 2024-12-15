# Draw Inline

This project is a fork of [Draw Note (zhaouv/vscode-markdown-draw)](https://github.com/zhaouv/vscode-markdown-draw) and changes to [tldraw](https://github.com/tldraw/tldraw) as the whiteboard engine.

## Compared with the Official tldraw VSCode Extension

- **Identical UI and Editor**: The same user interface and editing experience as the official extension.
- **No CDN Dependency**: Avoids loading files from `https://cdn.tldraw.com`, relying instead on local files for faster loading times.
- **Enhanced File Compatibility**: 
  - Does not use `.tldr` files, which require specific extensions to open.
  - Uses SVG and inline SVG formats, making it easily previewable in most cases and allowing for seamless re-editing.

## License

This project is licensed under the [MIT License](./LICENSE).
