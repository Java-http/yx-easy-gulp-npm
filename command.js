#! /usr/bin/env node

const commander = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
var path = require("path");
var inquirer = require('inquirer');
var rimraf = require("rimraf")

commander
  .command('init [dir]')
  .description('init project')
  .action((dir) => {
		const spinner = ora('downloading...').start();
    const dirName=path.resolve(process.cwd(),dir?dir:'');
		download('github:Java-http/yx-easy-gulp', dirName, function (err) {
			if(!err){
        spinner.succeed('下载成功!');
        inquirer
          .prompt([{
            type: 'list',
            name: 'gulpfile',
            message: '请选择下面其中一个gulpfile版本',
            choices: [
              'base',
              'edu'
            ]
          }])
          .then(answers => {
            let fileName=answers['gulpfile'];
            copyFile(path.resolve(process.cwd(),'lib',fileName))
              .then(()=>{
                modifyPkg(dirName);
                      console.log(chalk.cyan(`--------------------------------`))
                console.log(chalk.cyan(`  command    |      message     `))
                      console.log(chalk.cyan(`--------------------------------`))
                console.log(chalk.cyan(`   npm i     |     下载依赖包    `))
                      console.log(chalk.cyan(`--------------------------------`))
                console.log(chalk.cyan(`    gulp     |     运行gulp任务  `))
                      console.log(chalk.cyan(`--------------------------------`))
                console.log(chalk.cyan(`  gulp watch |  运行gulp 监听任务   `))
                      console.log(chalk.cyan(`--------------------------------`))
                console.log((`运行前请全局安装gulp包,更多任务请查看gulpfile.js`))
              })
              .catch((err)=>{console.log(err)})
          });
			}else{
			  spinner.fail(chalk.red("下载失败，请重新运行！"));
			}
		})
  });

commander.version('1.0.0')
	.option('-v, --version', '1.0.0')
	.option('-m, --message', 'output the message')
	.option('-init [name]', 'init project')
  .parse(process.argv);

if (commander.message) {
    console.log('an easy gulp project');
    console.log('you can use the command');
    console.log(chalk.green('yx init [project]'));
    console.log('to init project');
}

// 修改 package.json
function modifyPkg(dirName) {
	fs.readFile(`${dirName}/package.json`, (err, data) => {
	  if (err) throw err;
	  let _data = JSON.parse(data.toString())
	  _data.name = path.basename(dirName);
	  _data.version = '1.0.0'
	  let str = JSON.stringify(_data, null, 4);
	  fs.writeFile(`${dirName}/package.json`, str, function (err) {
	    if (err) throw err;
	  })
	});
} 

// 复制文件并且删除lib文件夹
async function copyFile(pathDir){
  fs.readdir(pathDir,(err,files)=>{
    if(err) throw new Error("找不到文件路径")
    files.forEach(file=>{
      var fileName=path.resolve(pathDir,file);
      fs.copyFile(fileName,path.resolve(process.cwd(),file), (err) => {
        if (err) throw err;
      });
    })
    rimraf("lib", (err) => {
      if (err) throw err;
    })
  })
}