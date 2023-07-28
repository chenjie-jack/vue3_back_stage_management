/*
 * @Author: chenjie 3232581941@qq.com
 * @Date: 2023-07-24 22:31:59
 * @LastEditors: chenjie 3232581941@qq.com
 * @LastEditTime: 2023-07-24 22:50:27
 * @FilePath: \vue3_admin_template\scripts\preinstall.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 强制使用pnpm包管理器
import process from "process";
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(
    `\u001b[33mThis repository must be using pnpm as the package manager ` +
      `for scripts to work properly.\u001b[39m\n`,
  );

  // 终止进程并显示错误信息
  process.exit(1);
}
