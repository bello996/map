
class WhacAMole {
    constructor() {
        // 游戏时间
        this.time = 60
        // 打中地鼠次数
        this.numTotal = 0
        // 游戏难易程度(出现速度，默认2秒出现一次)
        this.level = 2000
        this.timerInter = null
        this.play = this.play.bind(this)
    }
    // 通过id 获取页面DOM元素
    getById(id) {
        return document.getElementById(id)
    }

    // 开始游戏
    play() {
        // 置灰开始和难易度按钮
        this.getById('level').setAttribute('disabled', 'true')
        this.getById('start').setAttribute('disabled', 'true')
        this.getById('audiobox').children[4].play()
        setTimeout(() => {
            this.timerInter = setInterval(() => {
                this.time--
                if (this.time === 0) {
                    // 游戏结束
                    this.end()
                } else if (this.time <= 10) {
                    this.getById('time').className = 'red'
                    this.getById('isshow').classList.remove("isshow")
                }
                // 修改倒计时
                this.getById('time').innerText = ` ${this.time} `
                // 地鼠开始随机露头
                this.showHamster()
            }, 1000);
            this.getById('end').removeAttribute('disabled')
        }, 1000);
    }

    // 地鼠冒出来
    showHamster = () => {
        let holeBox = this.getById('mouseFrame'), // 所有地洞外层父级盒子
            nums = holeBox.children.length, // 地洞个数 
            showMouseBox = holeBox.children[parseInt(Math.random() * nums)] // 随机露头的盒子
        showMouseBox.className = 'mouse out' // 添加out类名 开始露头
        this.getById('audiobox').children[3].play()
        // 通过定时器设置地鼠露头时间（游戏难易度）
        setTimeout(() => {
            showMouseBox.className = 'mouse'
        }, this.level)
    }

    // 页面一加载通过事件委托给地洞大盒子注册点击事件
    hitMouse = () => {
        let holeBox = this.getById('mouseFrame')
        // 创建页面地鼠盒子元素
        let nums = new Array(10).fill(null)
        nums.forEach(() => {
            let card = document.createElement('span')
            card.className = 'mouse'
            holeBox.appendChild(card)
        })
        // 注册点击事件
        holeBox.addEventListener('click', e => {
            let target = e.target, // 目标元素
                targetClsName = target.className // 获取点击的目标元素类名
            if (!this.timerInter) return
            // 如果类名包含out则说明正在露头（即打中了）
            if (targetClsName.indexOf('out') != -1) {
                // 切换打中状态
                target.className = 'mouse hit'
                // 记录打中个数
                this.getById('numHit').innerText = ++this.numTotal
                // 打中
                this.getById('audiobox').children[1].play()
            } else {
                // 未打中
                this.getById('audiobox').children[0].play()
            }
        })
    }

    // 改变游戏的难易程度
    changeSelect = () => {
        let selectfacility = this.getById('level'),
            index = selectfacility.selectedIndex, // 选中哪一个（0，1，2）
            selectValue = selectfacility.options[index].value
        this.level = Number(selectValue) // 设置难易度
    }

    // 游戏结束
    end = () => {
        // 清除倒计时定时器
        clearInterval(this.timerInter)
        this.timerInter = null
        // 弹框
        this.popBox(60 - this.time, this.level, this.numTotal)
        this.getById('audiobox').children[2].play()
        // 重置时间
        this.time = this.getById('time').innerText = 60
        // 重置成绩
        this.getById('numHit').innerText = 0
        this.numTotal = 0
        // 重置难易度
        this.level = 2000
        // 重置难易度
        this.getById('level').options[0].selected = true
        // 移除下拉和开始按钮禁用状态
        this.getById('level').removeAttribute('disabled')
        this.getById('start').removeAttribute('disabled')
        this.getById('end').setAttribute('disabled', 'true')
        this.getById('time').classList.remove('red')
        this.getById('isshow').classList.add("isshow")
    }

    // 弹出框
    popBox = (timeValue, facilityValue, hitVlaue) => {
        facilityValue == '2000' ? facilityValue = '简单' :
            facilityValue == '1000' ? facilityValue = '适中' :
                facilityValue = '困难'
        let popBox = this.getById('popBox'),
            popLayer = this.getById("popLayer"),
            timeValueDom = this.getById("timeValue"),
            facilityValueDom = this.getById("facilityValue"),
            hitVlaueDom = this.getById("hitVlaue")

        timeValueDom.innerText = timeValue
        facilityValueDom.innerText = facilityValue
        hitVlaueDom.innerText = hitVlaue

        popBox.style.display = "block";
        popLayer.style.display = "block";
    }

    // 关闭弹框
    closeBox = () => {
        let popBox = this.getById("popBox"),
            popLayer = this.getById("popLayer");
        popBox.style.display = "none";
        popLayer.style.display = "none";
    }
}

let wam = new WhacAMole()
wam.hitMouse() // 初始化DOM并注册点击事件
let start = wam.play, // 开始
    selectChange = wam.changeSelect, // 切换难易度
    gameOver = wam.end,// 结束
    closeBox = wam.closeBox // 结束