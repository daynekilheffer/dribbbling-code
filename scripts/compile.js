const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const pug = require('pug');
const sass = require('node-sass');

const subproject = process.argv[2];
const subprojectPath = path.resolve(process.env.NODE_PATH, subproject);
const subprojectBuildPath = path.resolve(process.env.NODE_PATH, 'build', subproject);

const indexHtmlContents = pug.renderFile(path.resolve(subprojectPath, 'index.pug'), {
  pretty: true
});

mkdirp.sync(subprojectBuildPath);
fs.writeFileSync(path.resolve(subprojectBuildPath, 'index.html'), indexHtmlContents);

const inputScssPath = path.resolve(subprojectPath, 'index.scss');
const outputCssPath = path.resolve(subprojectBuildPath, 'index.css');

sass.render({
    file: inputScssPath,
    outFile: outputCssPath,
    sourceMap: true,
  }, function(error, result) {
    if(!error){
      fs.writeFileSync(outputCssPath, result.css);
      fs.writeFileSync(outputCssPath + '.map', result.map);
  } else {
      console.log(error);
  }
  });

const globbedImagesPath = path.resolve(subprojectPath, '*.jpg');
glob(globbedImagesPath, {}, (err, files) => {
  files.forEach(file => {
    fs.copyFileSync(file, path.resolve(subprojectBuildPath, path.basename(file)));
  })
});
