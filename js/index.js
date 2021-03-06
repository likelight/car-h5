$(function () {
    var app = document.getElementById('app');
    var ctx = app.getContext('2d');
    var windowWitdh,
        windowHeight;
    var light = false;

    window.onresize = windowResize;

    function windowResize() {
        windowWitdh = window.innerWidth;
        windowHeight = window.innerHeight;
        app.width = windowWitdh;
        app.height = windowHeight;
        ctx.restore();
        ctx.translate(windowWitdh / 2, windowHeight / 2);
        draw(0);
    }

    const Point = (radius, angle) => ({
        x: radius * Math.cos(angle * Math.PI / 180),
        y: radius * Math.sin(angle * Math.PI / 180)
    });

    // 绘制预加载页面
    function draw(speed) {
        // 起點/長/寬
        ctx.clearRect(-2000, -2000, 4000, 4000);

        function coordinate() {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.moveTo(-windowWitdh / 2, 0);
            ctx.lineTo(windowWitdh / 2, 0);
            ctx.moveTo(0, -windowHeight / 2);
            ctx.lineTo(0, windowHeight / 2);
            ctx.stroke();
        }
        // 座標 校正用
        // coordinate()

        // 儀表板

        if (light == true) {
            ctx.shadowColor = '#999';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            ctx.shadowColor = null;
            ctx.shadowBlur = null;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // 內圈
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.arc(0, 0, 110, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();

        // 底部圆
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(150, 154, 154, 1)';
        ctx.arc(0, 0, 130, Math.PI * 0.11, Math.PI * 0.88);
        ctx.stroke();

        // 绘制文字
        ctx.fillStyle = 'rgba(0,85,156,1)';
        ctx.textAlign = 'center';
        ctx.font = '26px Arial';
        ctx.fillText('Autoliv', 0, 210);

        // 文字下划线
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,85,156,1)';
        ctx.lineWidth = 8;
        ctx.moveTo(-50, 225);
        ctx.lineTo(50, 225);
        ctx.stroke();
        // 仪表板外框 135度~405度
        var splitNum = 8;
        var radius1 = 110;
        var wide;

        for (var i = 0; i <= splitNum; i++) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.lineWidth = 2;
            wide = 10;
            let angle = i * (210 / splitNum) + 165;
            let startPoint = Point(radius1 - wide, angle);
            let endPoint = Point(radius1, angle);
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.stroke();
        }

        // 單位
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText(speed + '%', 0, 80);
        ctx.restore();

        // 中心圈圈
        ctx.beginPath();
        var grd = ctx.createRadialGradient(0, 0, 30, 0, 0, 1);
        grd.addColorStop(0, '#87e2fa');
        grd.addColorStop(1, '#6494ca');
        ctx.fillStyle = grd;
        ctx.arc(0, 0, 20, 0, Math.PI * 2, true);
        ctx.fill();

        // 仪表板外框 135度~405度
        var degreeNum = 70;
        var radius = 140;
        var len;
        var deperate = parseInt(speed / 100 * degreeNum);
        for (var i = 0; i < degreeNum; i++) {
            ctx.beginPath();
            if (i < deperate) {
                ctx.strokeStyle = 'rgba(83,248,255,1)';

            } else {
                ctx.strokeStyle = 'rgba(10,82,191,1)';

            }
            ctx.lineWidth = 5;
            len = 18;
            let angle = i * (210 / degreeNum) + 165;
            let startPoint = Point(radius - len, angle);
            let endPoint = Point(radius, angle);
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.stroke();
        }
        // 指針 

        let pSpeed = 2.075 * speed;
        let firstPoint = Point(40, pSpeed + 340);
        let secondPoint = Point(120, pSpeed + 165);
        let thirdPoint = Point(40, pSpeed + 350);
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.moveTo(firstPoint.x, firstPoint.y);
        ctx.lineTo(secondPoint.x, secondPoint.y);
        ctx.lineTo(thirdPoint.x, thirdPoint.y);
        ctx.fill();
    }

    function preloadImg() {
        var queue = new createjs.LoadQueue();
        var mainfest = new Set();
        $('img[lazy-src]').each(function (i, dom) {
            mainfest.add(dom.getAttribute('lazy-src'));
        });
        queue.loadManifest(Array.from(mainfest));
        queue.on('progress', handleProgress);
        queue.on('complete', handleComplete, this);
    }

    function handleProgress(data) {
        draw((data.loaded * 100).toFixed(0));
    }

    function handleComplete() {
        createSwiper();
        // 完成图片加载
        $('img[lazy-src]').each(function () {
            $(this).show();
            $(this).attr('src', $(this).attr('lazy-src'));
        });
    }

    // 目录页码
    const CatergoryIndex = [1, 5, 9];
    // 内容页起始页
    const ContentStartIndex = [2, 6];

    var swiper;

    function createSwiper() {
        var disableNextIndexArr = [4];
        var disablePreIndexArr = [2];
        $('.swiper-container').removeClass('no-visible');
        $('#app').addClass('no-visible');
        swiper = new Swiper('.swiper-container', {
            // Enable debugger
            loop: false,
            debugger: false,
            onSlideChangeEnd: function (swiper) {
                if (disableNextIndexArr.includes(swiper.activeIndex)) {
                    swiper.lockSwipeToNext();
                } else {
                    swiper.unlockSwipeToNext();
                }

                if (disablePreIndexArr.includes(swiper.activeIndex)) {
                    swiper.lockSwiperToPrev();
                } else {
                    swiper.unlockSwipeToPrev();
                }
                console.log(swiper.activeIndex);
            }
        });
    }

    const TIME = 200;

    // 滑动到具体某一页 
    function slideTo(num) {
        swiper.unlockSwipeToNext();
        swiper.unlockSwipeToPrev();
        swiper.slideTo(num, TIME, false);
    }

    function addCatergoryEvent() {
        // 目录事件
        $('.main-btn').click(function () {
            let num = $(this).index();
            slideTo(CatergoryIndex[num]);
        });

        // 目录返回到起点
        $('.catergorty .back').click(function () {
            swiper.slideTo(0, TIME, false);
        });

        // 内容返回
        $('.content .back').click(function () {
            let num = $(this).parent().index();
            let caterIndex = 1;
            console.log('cat');
            for (var len = 0; len < CatergoryIndex.length; len++) {
                if (num < CatergoryIndex[len]) {
                    caterIndex = CatergoryIndex[len - 1];
                    break;
                }
            }
            if (len === CatergoryIndex.length) {
                caterIndex = CatergoryIndex[len - 1];
            }
            console.log(caterIndex);

            swiper.slideTo(caterIndex, TIME, false);
        });

        // 点击目录到对应页面
        $('.catergory-item').click(function () {
            let index = $(this).index();
            let num = $(this).parent().parent().index();
            let jumpIndex, startIndex;
            if (num >= 1) {
                result = CatergoryIndex.indexOf(num);
                if (result > -1) {
                    startIndex = ContentStartIndex[result];
                    jumpIndex = startIndex + index;
                    console.log('jump:' + jumpIndex);
                    slideTo(jumpIndex);
                } else {
                    console.log('查找不对');
                }
            }
        });
    }

    windowResize();
    var i = 0;
    // 预加载图片
    preloadImg();
    // 绑定事件
    addCatergoryEvent();

});