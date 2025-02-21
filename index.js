const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { config } = require("dotenv");
const path = require('path');
config()
const fs = require("fs");
const axios = require('axios')
const validator = require("validator")
const { start } = require("./send.js")
const getAccessToken = require("./access_token")
let screenX = null
let screenY = null

async function getBaiduUri() {
    token = await getAccessToken()
    return "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=" + token
}


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 925,
        height: 470,
        resizable: false,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })
    mainWindow.webContents.loadFile(path.join(__dirname, 'pages', 'main', 'main.html'));
    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools();
    });
    mainWindow.setAlwaysOnTop({ flag: true })
    return mainWindow
}

let display = null
app.disableHardwareAcceleration()

app.whenReady().then(() => {
    mainWindow = createWindow();
    display = screen.getPrimaryDisplay();
    start()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

ipcMain.on('close-app', (event, params) => {
    mainWindow.close()
})

ipcMain.on('start-schedule', (event, params) => {
    let result = start(event)
    if (result) { event.sender.send("index-state", { state: true }); }
})

ipcMain.on('stop-schedule', (event, params) => {
    const { stop } = require("./send.js")
    stop()
    event.sender.send("index-state", { state: false });
})

ipcMain.on('mini-app', (event, params) => {
    if (!screenX || !screenY) {
        const height = display.bounds.height;
        const width = display.bounds.width;
        mainWindow.setSize(440, 195);
        let X = parseInt((width - mainWindow.getSize()[0]) / 2)
        let Y = parseInt((height - mainWindow.getSize()[1]) / 2)
        mainWindow.setPosition(X, Y);
    } else {
        mainWindow.setPosition(screenX, screenY);
    }
    mainWindow.hide();
    mainWindow.loadFile(path.join(__dirname, 'pages', 'mini', 'mini.html'))
    mainWindow.show()
})

ipcMain.on('main-app', (event, params) => {
    const windowPosition = mainWindow.getPosition();
    screenX = windowPosition[0];
    screenY = windowPosition[1];
    mainWindow.setSize(925, 470);
    const height = display.bounds.height;
    const width = display.bounds.width;
    let X = parseInt((width - mainWindow.getSize()[0]) / 2)
    let Y = parseInt((height - mainWindow.getSize()[1]) / 2)
    mainWindow.setPosition(X, Y);
    mainWindow.hide();
    mainWindow.loadFile(path.join(__dirname, 'pages', 'main', 'main.html'))
    mainWindow.show()
})

ipcMain.on('wenxin-question', async (event, params) => {
    let msg = { stream: true, messages: [{ role: "user", content: params.content }], system: "我是像素宝宝桌面宠物，我来自边缘骇客编程实验室，我的每次回答都会说'亲爱的主人'，并且我非常可爱，语气特别亲切！" }
    axios({
        method: 'post',
        data: msg,
        url: await getBaiduUri(),
        responseType: "stream"
    }).then(res => {
        res.data.on('data', (chunk) => {
            let content = chunk.toString().replace("data: ", "")
            if (validator.isJSON(content)) {
                let result = JSON.parse(content).result
                event.sender.send("wenxin-answer", { result: result, isEnd: false });
            }
        })
        res.data.on('end', () => {
            event.sender.send("wenxin-answer", { isEnd: true });
        })
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('random-voice', async (event, params) => {
    let msg = { stream: true, messages: [{ role: "user", content: params.content }], system: "我是像素宝宝桌面宠物，我来自边缘骇客编程实验室，我的每次回答都会说'亲爱的主人'，并且我非常可爱，语气特别亲切！" }
    axios({
        method: 'post',
        data: msg,
        url: await getBaiduUri(),
        responseType: "stream"
    }).then(res => {
        res.data.on('data', (chunk) => {
            let content = chunk.toString().replace("data: ", "")
            if (validator.isJSON(content)) {
                let result = JSON.parse(content).result
                event.sender.send("wenxin-answer", { result: result, isEnd: false });
            }
        })
        res.data.on('end', () => {
            event.sender.send("wenxin-answer", { isEnd: true });
        })
    }).catch(err => {
        console.log(err)
    })
})




