/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

const accessKeyId = process.env.ALI_OSS_ACCESSKEY;
const accessKeySecret = process.env.ALI_OSS_SECRETKEY;

const client = new OSS({
  bucket: '4x-antdv',
  cname: 'true',
  endpoint: '4x-antdv.oss-cn-beijing.aliyuncs.com',
  region: 'oss-cn-beijing',
  accessKeyId,
  accessKeySecret,
});

const distPath = path.join(process.cwd(), 'site', 'dist');

const put = (target, source) => {
  return new Promise((resolve, reject) => {
    client
      .put(target, source)
      .then(res => {
        if (res.res.status !== 200) {
          console.log(`${res.name} upload failed!`);
          reject(new Error(`${res.name} upload failed!`));
          process.exit(1);
        } else {
          console.log(`${res.name} upload success!`);
          resolve();
        }
      })
      .catch(err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  });
};

async function collectFiles(dir, prefix = '') {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(fullPath, relPath)));
    } else if (entry.isFile()) {
      results.push({ target: relPath, source: fullPath });
    }
  }
  return results;
}

async function upload() {
  try {
    const files = await collectFiles(distPath);
    let indexHtml = null;
    for (const file of files) {
      if (file.target === 'index.html') {
        indexHtml = file;
        continue;
      }
      await put(file.target, file.source);
    }
    if (indexHtml) {
      await put(indexHtml.target, indexHtml.source);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
upload();
