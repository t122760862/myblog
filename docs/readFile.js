const fs = require("fs") // 文件模块
const path = require("path") // 路径模块
const docsRoot = path.join(__dirname) // docs文件路径
const chalk = require("chalk") // 命令行打印美化
const log = console.log

function ReadFile(dir = docsRoot, filesList = [], fpath = "") {
	let files = fs.readdirSync(dir)

	files.forEach((item) => {
		let filePath = path.join(dir, item)
		const stat = fs.statSync(filePath)

		const fileNameArr = path.basename(filePath).split(".")

		if (stat.isDirectory() && item !== ".vuepress") {
			// 生成目录名
			let title = fileNameArr.length > 1 ? fileNameArr[1] : fileNameArr[0]
			if (!title) {
				log(
					chalk.yellow(
						`warning: 该文件夹 "${filePath}" 没有按照约定命名，将忽略生成相应数据。`
					)
				)
				return
			}

			const directoryItem = {
				title,
				collapsable: false,
				path: "/" + item + "/",
				children: []
			}
			filesList.push(directoryItem)

			ReadFile(filePath, directoryItem.children, item)
			return
		} else {
			// 生成文件名数组
			let name = null
			title = null
			typeFile = null
			pathName = null
			let cloneArr = [...fileNameArr]

			typeFile = cloneArr[cloneArr.length - 1]
			if (fileNameArr.length > 1) {
				cloneArr.pop()
				name = cloneArr.join(".")
				pathName = fpath ? `${fpath}/${name}` : name
				title = cloneArr.length > 1 ? cloneArr[1] : cloneArr[0]
			} else {
				log(
					chalk.yellow(
						`warning: 该文件 "${filePath}" 没有按照约定命名，将忽略生成相应数据。`
					)
				)
				return
			}

			// 过滤非md文件
			if (typeFile === "md") {
				if (pathName.includes("README")) {
					// filesList.push(["/", title])
					return
				}
				filesList.push([pathName, title])
			}
		}
	})

	return filesList
}

ReadFile()

module.exports = ReadFile
