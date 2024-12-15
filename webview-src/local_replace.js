const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
  const readStream = fs.createReadStream(src);
  const writeStream = fs.createWriteStream(dest);

  readStream.pipe(writeStream);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true }); 

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
}

const sourceDir = 'node_modules/@tldraw/assets';
const targetDir = '../board/cdn';
copyDir(sourceDir, targetDir);

/////////////////////

var jsname=''
fs.readFile('../board/index.html', 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    return;
    }
    
    const result = data.replace(/"\/assets\//g, '"./assets/');
    jsname=/index-\w+.js/.exec(data)[0]
    
    fs.writeFile('../board/index.html', result, 'utf8', (err) => {
    if (err) {
        console.error(err);
    } else {

        console.log('jsname',jsname)
        jsname='../board/assets/'+jsname
        fs.readFile(jsname, 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
            
            // const result = data.replace(/https:\/\/cdn.tldraw.com/g, '../dist');
            const result = data.replace(/return`\${\w+}\/\${\w+}`/g, 'return`./cdn`');
            
            fs.writeFile(jsname, result, 'utf8', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('File has been saved with replacements.');
            }
            });
        });
    }
    });
});


