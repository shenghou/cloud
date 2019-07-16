const fs = require("fs");
const filePath = "file.txt";

// fs.open("file.txt", "r", (err, fd) => {
//   if (err) throw err;
//   console.log(fd);
//   fs.close(fd, err => {
//     if (err) throw err;
//   });
// });

// fs.access(file, fs.constants.F_OK, err => {
//     console.log(err)
// })

// fs.appendFile(filePath, "，我是追加的值", err => {
//   if (err) throw err;
//   console.log("文件已经追到了");
// });

// fs.open(filePath, 'a', (err, fd) => {
//     if (err) throw err;
//     fs.appendFile(fd, '追加的数据', 'utf8', (err) => {
//       fs.close(fd, (err) => {
//         if (err) throw err;
//       });
//       if (err) throw err;
//     });
//   });

// const constant = fs.constants;
// console.log(constant)

// fs.copyFile(filePath, "copy.txt", err => {
//   if (err) throw err;
//   console.log("文件已经被拷贝过去了");
// });

// const stream = fs.createReadStream(filePath);
// setTimeout(() => {
//   stream.close(); // 这可能不会关闭流。
//   console.log(stream)
//   stream.push(null);
//   console.log(stream)
//   stream.read(0);
//   console.log(stream)
// }, 100);

// fs.exists(filePath, (err, fd) => {
//   if (err) {
//     console.error(err);
//   }
// });

// fs.mkdir('mkdir/app', {recursive:true}, err => {
//     if(err) throw err
//     console.log('创建文件夹成功')
// })

// fs.read(filePath, Buffer, 0, 0, 0, (err, fd) => {
//   if (err) throw err;
//   console.log(fd);
// });

// fs.readdir("file.txt", (err, file) => {
//   if (err) throw err;
//   console.log(file);
// });

// fs.readFile(filePath, "utf8", (err, fd) => {
//   if (err) throw err;
//   console.log(fd);
// });

// fs.readFile(filePath,  (err, fd) => {
//   if (err) throw err;
//   console.log(fd);
// });

// fs.rename(filePath, 'rename.text', err => {
//     if(err) throw err
//     console.log('改名成功')
// })

// fs.writeFile(filePath, '，我是新写入的文件', 'utf8', err=> {
//     if(err) throw err
//     console.log('我又写入了')
// })