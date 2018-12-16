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
        var bgArr = ['./images/abg.jpg', './images/bg.jpeg','./images/car1_04.png', './images/logo.png'];
        $('img[lazy-src]').each(function (i, dom) {
            mainfest.add(dom.getAttribute('lazy-src'));
        });
        var sourceArr = Array.from(mainfest);
        var finalList = [...sourceArr, ...bgArr];
        queue.loadManifest(Array.from(finalList));
        queue.on('progress', handleProgress);
        queue.on('complete', handleComplete, this);
    }

    function handleProgress(data) {
        draw((data.loaded * 100).toFixed(0));
    }

    function handleComplete() {
        setTimeout(function() {
            createSwiper();
            // 完成图片加载
            $('img[lazy-src]').each(function () {
                $(this).show();
                $(this).attr('src', $(this).attr('lazy-src'));
            });

            parseUrl();
            }, 
        500);


    }

    // 目录页码
    const CatergoryIndex = [1, 7, 18, 26, 37, 44];
    // 内容页起始页
    const ContentStartIndex = [2, 8, 19, 27, 38, 45];

    var swiper;
    var disableNextIndexArr = [6, 17, 25, 36, 43, 46];
    var disablePreIndexArr = [2, 8, 19, 27, 38, 45];
    var videoListIndex = [6, 8, 29, 39, 40, 41, 45, 46]; 
    function createSwiper() {
        $('.swiper-container').removeClass('no-visible');
        $('#app').addClass('no-visible');
        swiper = new Swiper('.swiper-container', {
            // Enable debugger
            loop: false,
            debugger: false,
            // effect : 'fade',
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            onSlideChangeEnd: function (swiper) {
                var videolist = $(".video-wrap").find("video");
                for(var k = 0; k<videolist.length; k++){
                    videolist[k].pause();
                }

                // if (videoListIndex.includes(swiper.activeIndex)) {
                //     console.log('hidden');
                //     // $('.video-wrap').css('visibility', 'visible');
                //     $('.video-wrap').find('video').show();
                //     alert(1);

                // } else {
                //     //$('.video-wrap').css('visibility', 'hidden');
                //     $('.video-wrap').find('video').hide();
                // }


                if (disableNextIndexArr.includes(swiper.activeIndex)) {
                    $('.swiper-button-next').css('display', 'none');
                    swiper.lockSwipeToNext();
                } else {

                    $('.swiper-button-next').css('display', 'block');
                    swiper.unlockSwipeToNext();
                }

                if (disablePreIndexArr.includes(swiper.activeIndex)) {
                    $('.swiper-button-prev').css('display', 'none');
                    swiper.lockSwipeToPrev();

                } else {
                    $('.swiper-button-prev').css('display', 'block');
                    swiper.unlockSwipeToPrev();
                }
            }
        });
        $('.swiper-button-prev').css('display', 'none');
        $('.swiper-button-next').css('display', 'none');

    }

    const TIME = 100;

    // 滑动到具体某一页 
    function slideTo(num) {
        swiper.unlockSwipeToNext();
        swiper.unlockSwipeToPrev();
        
        if (disableNextIndexArr.includes(num)) {
            $('.swiper-button-next').css('display', 'none');
            swiper.slideTo(num, TIME, false);
            setTimeout(function() {
                swiper.lockSwipeToNext();
            }, 300);
        } else {
            $('.swiper-button-next').css('display', 'block');
            swiper.unlockSwipeToNext();
        }

        if (disablePreIndexArr.includes(num)) {
            $('.swiper-button-prev').css('display', 'none');
            swiper.lockSwipeToPrev();
        } else {
            $('.swiper-button-prev').css('display', 'block');
            swiper.unlockSwipeToPrev();

        }

        if (CatergoryIndex.includes(num) || num === 0) {
            $('.swiper-button-next').css('display', 'none');
            $('.swiper-button-prev').css('display', 'none');   
        }
        swiper.slideTo(num, TIME, false);
    }

    function addCatergoryEvent() {
        // 目录事件
        $('.point').click(function () {
            let num = $(this).index();
            slideTo(CatergoryIndex[num]);
        });

        $('.text').click(function () {
            let num = $(this).index() - 6;
            slideTo(CatergoryIndex[num]);
        });

        // 目录返回到起点
        $('.catergorty .back').click(function () {
            slideTo(0);
            $('.swiper-button-prev').css('display', 'none');
            $('.swiper-button-next').css('display', 'none');
        });

        // 内容返回
        $('.content .back').click(function () {
            let num = $(this).parent().index();
            let caterIndex = 1;
            console.log(num);
            for (var len = 0; len < CatergoryIndex.length; len++) {
                if (num < CatergoryIndex[len]) {
                    caterIndex = CatergoryIndex[len - 1];
                    break;
                }
            }
            if (len === CatergoryIndex.length) {
                caterIndex = CatergoryIndex[len - 1];
            }

            slideTo(caterIndex);
            $('.swiper-button-prev').css('display', 'none');
            $('.swiper-button-next').css('display', 'none');
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
                    if (startIndex === 27 && index >= 6) {
                        jumpIndex = startIndex + index + 2;
                    } else {
                        jumpIndex = startIndex + index;
                    }
                    slideTo(jumpIndex);
                } else {
                    console.log('查找不对');
                }
            }
        });
    }

    function parseUrl() {
        let param = window.location.hash;
        
        let num = param.replace('#', '');
        console.log(num);
        if (num !== '') {
            slideTo(parseInt(num));
        } else {
            return;
        }
        console.log("fd:" + num);

    }

    windowResize();
    var i = 0;
    // 预加载图片
    preloadImg();
    // 绑定事件
    addCatergoryEvent();

});