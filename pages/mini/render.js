const ipcRenderer = require("electron").ipcRenderer;
const { execSync } = require('child_process');

new Vue({
    el: '#app',
    data: {
        time: "",
        content: "",
        menustate: false,
        state: false,
        music: false
    },
    methods: {
        ListenMusic() {
            if (this.music) {
                this.$refs.music.pause()
                this.music = false
            } else {
                this.$refs.music.play()
                this.music = true
            }
        },
        OpenTaobao() {
            execSync('start chrome https://edgehacker.taobao.com')
        },
        OpenMenu() {
            this.menustate = !this.menustate
            console.log("false")
        },
        EnterMain() {
            ipcRenderer.send("main-app")
        },
        CloseContent() {
            this.state = false
        }
    },
    mounted() {
        ipcRenderer.on('schedule-show', (event, param) => {
            this.content = param.content
            this.time = param.time
            this.state = true
        })
    }
})