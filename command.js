#! /usr/bin/env node

const commander = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
var path = require("path");

commander
  .command('init [dir]')
  .description('init project')
  .action((dir) => {
    // todo something you need
		const spinner = ora('downloading...').start();
		const dirName=path.resolve(process.cwd(),dir);
		download('github:Java-http/yx-easy-gulp', dirName, function (err) {
			if(!err){
			  // 可以输出一些项目成功的信息
			  spinner.text=(chalk.green('下载成功'));
			  modifyPkg(dirName);

			  spinner.succeed(chalk.green('success!'));
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
    console.log('an easy gulp project \r\n you can use the command');
    console.log(chalk.green('yx init [project]'));
    console.log(chalk.green('\n to init project'));
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
