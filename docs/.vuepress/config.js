const path = require("path")
// const docRoot = path.resolve(__dirname, "..")
const readFile = require(path.join(__dirname, "..") + "/readFile")

console.log(readFile(), "readFile")

const docker = {
	title: "docker",
	path: "/docker/",
	// children: readFile(docRoot + "/docker"),
	collapsable: false,
	children: [
		["docker/docker+jenkins自动化部署", "docker+jenkins自动化部署"],
		["docker/记录一次docker的学习", "记录一次docker的学习"]
	]
}

// console.log(readFile(docRoot + "/docker"), "readFile")
// console.log(docker, "docker")
module.exports = {
	title: "无来",
	description: "喵巨人学习笔记，包含前端开发、后端开发、服务器运维等",
	// 注入到当前页面的 HTML <head> 中的标签
	head: [
		["link", { rel: "icon", href: "/favicon.ico" }] // 增加一个自定义的 favicon(网页标签的图标)
	],
	base: "/", // 这是部署到github相关的配置 下面会讲
	markdown: {
		lineNumbers: true // 代码块显示行号
	},
	dest: "./dist",
	themeConfig: {
		// sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
		lastUpdated: "Last Updated", // 文档更新时间：每个文件git最后提交的时间
		// displayAllHeaders: true,
		// permalink: "/:year/:month/:day/:slug",
		// sidebar: "auto"
		// sidebar: {
		// 	// "/": {
		// 	// 	title: "记录一次SameSite的问题",
		// 	// 	path: "/",
		// 	// 	children: ["记录一次SameSite的问题"]
		// 	// }
		// }
		sidebar: [...readFile()]
		// sidebar: [
		// 	{
		// 		title: "docker",
		// 		collapsable: false,
		// 		path: "/docker/",
		// 		children: [["/docker/记录一次docker的学习", "记录一次docker的学习"]]
		// 	}
		// 	// readFile()
		// ]
	}
}
