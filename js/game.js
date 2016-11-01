// 1.滚动
// 2.让小鸟掉下来
// 3.点击让小鸟上去
// 4.出来柱子
var scroll = document.querySelector('#scroll');
var bird = document.querySelector('#wrap>img');
var wrap = document.querySelector('#wrap');
var pipe = document.querySelector('#pipe');
// 每隔多少毫秒降落多少像素
var downPX = 1.5;
// 点击按钮后，上升初始速度
var upPX = 4;
// 上升以后，每次减少多少高度；
var upReduce = 0.1;
// 下降的计时器
var downTimer;
// 上升的计时器
var upTimer;
// 柱子移动计时器
var pipeTimer;


// 传进来一个滚动标签，让它滚动起来
function bgScroll(obj) {
    var currentOff = obj.offsetLeft;
    setInterval(function() {
        obj.style.left = currentOff + 'px';
        currentOff--;
        if (Math.abs(currentOff) >= obj.offsetWidth / 2) {
            currentOff = 0;
        }
    }, 10);
}

// obj:小鸟；bgObj:为了获得背景的高度，判断是否掉到草坪上
function downBird(obj, bgObj) {
    var offTop = obj.offsetTop;
    downTimer = setInterval(function() {
        offTop += downPX;
        obj.style.top = offTop + 'px';
        if (offTop >= bgObj.offsetHeight - 57 - 26) {
            clearInterval(downTimer);
        }
    }, 10);
}
// 点击让鸟上去，每隔多少秒上去的高度在减小
// obj:小鸟
// stateFun:每隔多少毫秒调用，用来监听状态
// completeFun:速度为0的时候回调
function upBird(obj, stateFun, completeFun) {
    var offTop = obj.offsetTop;
    // 因为每次点击的时候，开始值都是固定的，将此值赋给一个中间变量
    // 中间变量修改不会影响初始值
    var currentUp = upPX;
    // 每次点击上升的时候，将上一个上升计时器干掉
    // 保证上升计时器永远都是一个
    if (upTimer) {
        clearInterval(upTimer);
    }
    upTimer = setInterval(function() {
        offTop -= currentUp;
        obj.style.top = offTop + 'px';
        currentUp -= upReduce;
        if (currentUp <= 0) {
            if (completeFun) {
                completeFun(obj);
            }
            clearInterval(upTimer);
        }
        if (stateFun) {
            stateFun(obj);
        }
    }, 10);
}
// 创建标签
function createBiaoQian(tag, className) {
    var obj = document.createElement(tag);
    obj.className = className;
    return obj;
}
// 获得随机数
function random(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}
// 创建柱子
// obj:柱子添加到的父标签
function createPipe(obj) {
    var upPipe = createBiaoQian('div', 'mypipe');
    var up_mode = createBiaoQian('div', 'up_mode');
    var up_pipe = createBiaoQian('div', 'up_pipe');
    upPipe.appendChild(up_mode);
    upPipe.appendChild(up_pipe);
    upPipe.style.right = "-62px";
    obj.appendChild(upPipe);
    var downPipe = createBiaoQian('div', 'mypipe');
    var down_mode = createBiaoQian('div', 'down_mode');
    var down_pipe = createBiaoQian('div', 'down_pipe');
    downPipe.appendChild(down_pipe);
    downPipe.appendChild(down_mode);
    downPipe.style.right = "-62px";
    downPipe.style.bottom = "57px";
    obj.appendChild(downPipe);

    var rH = random(0, 203);
    up_mode.style.height = rH + 'px';
    down_mode.style.height = 203 - rH + 'px';
}
// 柱子移动
function pipeMove(className) {
    pipeTimer = setInterval(function() {
        var allPipes = document.querySelectorAll(className);
        for (var i = 0; i < allPipes.length; i++) {
            var p = allPipes[i];
            var off = p.offsetLeft;
            off--;
            p.style.left = off + 'px';
            if (p.offsetLeft <= -62) {
                console.log('删除');
                p.remove();
                i--;
            }
        }
    }, 10);
}



// 添加点击事件
function addAction(obj) {
    obj.onclick = function() {
        // 1.让down关掉
        clearInterval(downTimer);
        // 2.调用上升，上升结束后调用down，上升到顶的时候down下来
        upBird(bird, function(myBird) {
            // 为了判断是否撞到顶了
            if (myBird.offsetTop <= 0) {
                clearInterval(upTimer);
                downBird(bird, wrap);
                obj.onclick = null;
            }
        }, function(myBird) {
            // 上升高度为0的时候,调用鸟下降
            downBird(bird, wrap);
        });
        return false;
    }
}

// // 测试
// createPipe(pipe);
// pipeMove('.mypipe');

// 刚开始隔5秒后开始创建柱子,然后每隔1秒创建一对柱子
setTimeout(function() {
    setInterval(function() {
        createPipe(pipe);
    }, 1000);
    createPipe(pipe);
    pipeMove('.mypipe');
}, 5000);


// 添加点击事件
addAction(wrap);
// 调用鸟下落
downBird(bird, wrap);
// 将滚动标签传递过去，进行滚动
bgScroll(scroll);
