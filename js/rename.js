const fs = require('fs');
let path = '/Users/likelight/Downloads/compresspng';

let files = fs.readdirSync(path);
console.log(files);

for(let i = 0; i < files.length; i++){
//  fs.readFile(`${path}/${files[i]}`,function(err,data){
//   // console.log(data.toString().split('\n')[0].split(' ')[1])
//   // console.log(data.toString().split('\n')[1].split(' ')[1])
//   let newname = data.toString().split('\n')[1].split(' ')[1] + '-' + data.toString().split('\n')[0].split(' ')[1].replace(/['|']/g,'')
//   fs.rename(`${path}/${files[i]}`,`${path}/${newname}.md`)
//  })
    // console.log(files[i]);
    let newName = files[i].replace(/\.png\.png/, '.png');
    console.log(newName);
    fs.rename(`${path}/${files[i]}`,`${path}/${newName}`);
}