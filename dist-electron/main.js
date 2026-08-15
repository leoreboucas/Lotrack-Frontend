import { BrowserWindow as e, app as t } from "electron";
import n from "node:path";
import { fileURLToPath as r } from "node:url";
//#region electron/main.ts
var i = n.dirname(r(import.meta.url));
function a() {
	let t = new e({
		width: 1280,
		height: 800,
		webPreferences: {
			preload: n.join(i, "preload.js"),
			contextIsolation: !0,
			nodeIntegration: !1
		}
	});
	process.env.VITE_DEV_SERVER_URL ? t.loadURL(process.env.VITE_DEV_SERVER_URL) : t.loadFile(n.join(i, "../dist/index.html"));
}
t.whenReady().then(a), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
});
//#endregion
export {};
