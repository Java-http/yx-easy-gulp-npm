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
        modifyPkg(dirName);
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
            let fileName=answers['gulpfile']+".js";
            copyFile(path.resolve(process.cwd(),'lib',fileName))
              .then(()=>{
                console.log(`
    command    |      message
  --------------------------------
     npm i     |     下载依赖包
  --------------------------------
     gulp      |    运行gulp任务
  --------------------------------
   gulp watch  |   运行gulp 监听任务

运行前请全局安装gulp包,更多任务请查看gulpfile.js
                `)
              })
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
function copyFile(file){
  return new Promise((resolve,reject)=>{
    fs.copyFile(file,'gulpfile.js', (err) => {
      if (err) throw err;
      rimraf("lib", (err) => {
        if (err) throw err;
        resolve()
      })
    });
  })
}