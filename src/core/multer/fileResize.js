import Sharp from "sharp";
import path from "path";

// Resize for File upload.
class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  async saveThumbs(buffer, fn) {
    const filename = fn;
    const filepath = this.filepath(filename);

    await Sharp(buffer)
      .resize(300, 300, {
        fit: Sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }

  async save(buffer, fn) {
    const filename = fn;
    const filepath = this.filepath(filename);

    await Sharp(buffer).toFile(filepath);

    return filename;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}

export default Resize;
