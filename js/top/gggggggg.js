// JavaScript Document

!function(){  var $ = require('wiki-common:widget/lib/jquery/jquery.js');

  var timer = '';

  $('.wgt-navbar').on('mouseenter', 'dl', function() {
  clearTimeout(timer);
  timer = setTimeout(function() {
  $('.wgt-navbar').addClass('wgt-navbar-hover');
}, 300);
}).on('mouseleave', function() {
clearTimeout(timer);
$('.wgt-navbar').removeClass('wgt-navbar-hover');
}).on('click', 'a', function() {
clearTimeout(timer);
$('.wgt-navbar').removeClass('wgt-navbar-hover');
});
}();


!function(){    var $ = require('wiki-common:widget/lib/jquery/jquery.js');
    var Dialog = require("wiki-common:widget/ui/dialog/dialog.js");
    var userLogin = require('wiki-common:widget/component/userLogin/userLogin.js');
    var unameFiller = require('wiki-common:widget/component/unameFiller/unameFiller.js');
    var rightCheck = require('wiki-lemma:widget/tools/rightCheck/rightCheck.js');

            var isEnterprise = false;
        var enterpriseOwnerUserId = 0;
    
    var userId = 0;
    var editUrl = '/edit/' + encodeURIComponent('百度百科') + '/' + '85895';
    var pgcUrl = '/enterprise/editpgc?lemmaId=85895';

    userLogin.regist({
        onLogin: function(user) {
            userId = user ? user.uid : 0;
        }
    });

   

   
   
    $(document.body).on('click', '.j-edit-link', function() {
        var dl = $(this).attr('data-edit-dl');
        if (dl) {
            var url = editUrl + '?dl=' + dl;
        } else {
            var url = editUrl;
        }

        rightCheck.preeditCheck('85895', '百度百科', '百度百科', '107970004', function(res) {
            if (!checkUserLegal(res)) {
                return;
            }
            if (isEnterprise && enterpriseOwnerUserId === userId) {
                showChoseEditDialog(function() {
                    location.href = pgcUrl;
                }, function() {
                    checkUgc(res, url);
                });
            } else {
                checkUgc(res, url);
            }
        });
    });
}();


!function(){    var $ = require('wiki-common:widget/lib/jquery/jquery.js');
    var nslog = require("wiki-common:widget/component/nslog/nslog.js");
    var testElem = require('wiki-common:widget/component/testElem/testElem.js');
    var cmsModuleLoader = require('wiki-common:widget/component/cmsModuleLoader/cmsModuleLoader.js');

    function requireAsync() {
        require.async('wiki-lemma:widget/tools/announcement/announcement.js');
    }

    cmsModuleLoader('/cms/global/lemma_config.json', [{
        name: 'announcement',
        script: 'wiki-lemma:widget/tools/announcement/announcement.js'
    }]);

    require.async("wiki-lemma:widget/tools/lazyLoad/lazyLoad.js", function(LazyLoad) {
        new LazyLoad();
    });

    require.async(['wiki-common:widget/component/nslog/nslog.js', 'wiki-common:widget/lib/jquery/jquery.js'], function(nslog, $) {
        nslog().setGlobal({
            lemmaId: "1",
            newLemmaId: "85895",
            subLemmaId: "1",
            lemmaTitle: "百度百科"
        });

        // 词条页 pv
        nslog(9322);

        // 链接点击 pv
        var lemmaPageRegExp = new RegExp(/\/subview\/\d+|\/view\/\d+|\/item\//i);
        $('body').on('mousedown', 'a', function() {
            var href = $(this).attr('href');
            if (href && href.indexOf('/') >= 0 && href.indexOf('#') !== 0) {
                // 链接点击 pv
                nslog(10000001);
                if (lemmaPageRegExp.test(href)) {
                    // 词条页链接点击 pv
                    nslog(10000002);
                }
            }
        });

        /****** 词条页站内流转需求统计 start ******/
        (function () {
            // 各种统计配置
            var circulationLinkCfg = {
                innerLink: [ // 内链
                    '.para',
                    '.lemmaWgt-baseInfo-simple-largeMovie',
                    '.lemmaWgt-baseInfo-simple-largeStar',
                    '.basic-info .basicInfo-block',
                    '.lemma-summary',
                    '.lemmaWgt-lemmaSummary',
                    '.view-tip-panel',
                    '.horizontal-module',
                    '.lemmaWgt-roleIntroduction',
                    '.dramaSeries .dramaSerialList',
                    '.module-music',
                    '.table-view',
                    '[log-set-param="table_view"]',
                    '.list-module',
                    '.cell-module',
                    '.baseBox .dl-baseinfo', // 配置后台字段
                    '.pvBtn-box .leadPVBtnWrapper',
                    '.drama-actor',
                    '#staffList',
                    '.starMovieAndTvplay',
                    '.main_tab:not(.main_tab-defaultTab)' // 除去词条tab外的tab
                ],
                relationTable: '.rs-container-foot', // 关系表
                peopleRelation: '.star-info-block.relations, .lemmaWgt-focusAndRelation', // 人物关系（明星+普通）
                moduleActors: '.featureBaseInfo .actors, .lemmaWgt-majorActors', // 主要演员、嘉宾、主持人
                moduleWorks: '.featureBaseInfo .works, .large-feature .works', // 代表作品
                moduleQuarterly: '.featureBaseInfo .po_quarterly, .mian_quarterly', // 分季介绍
                rankStar: '.rank-list.stars-rank', // 明星榜
                rankDrama: '.drama-rank-list', // 电视剧榜
                specialTopic: '.special-topic', // 专题模块
                modDetailTable: '#modDetailTable', // 关系表出图
                chuizhitu: '.chuizhitu', // 垂直化模块
                polysemantList: '.polysemantList-wrapper' // 义项切换
            };
            /****** 连接统计 ******/
            function clickNslogFn() {
                for (var k in circulationLinkCfg) {
                    if (k === 'innerLink') {
                        // 词条内链到词条页
                        var tempArr = circulationLinkCfg[k];
                        for (var i = 0, l = tempArr.length; i < l; i++) {
                            tempArr[i] += ' a';
                        }
                        var sSelector = tempArr.join(', ');

                        $('body').on('mousedown', sSelector, {key: k},function(e) {
                            var key = e.data.key;
                            var href = $(this).attr('href');
                            var tar = $(this).attr('target') || '';
                            if (href && href.indexOf('/') >= 0 && href.indexOf('#') !== 0
                            && tar === '_blank' && lemmaPageRegExp.test(href)) {
                                // 词条页普通内链点击 pv
                                nslog(10000004, null ,{division: key});
                            }
                        });
                    } else {
                        // 模块到词条页链接
                        $(circulationLinkCfg[k]).on('mousedown', 'a', {key: k}, function (e) {
                            var key = e.data.key;
                            var href = $(this).attr('href');
                            if (href && href.indexOf('#') !== 0 && lemmaPageRegExp.test(href)) {
                                // 词条页配置模块链接点击 pv
                                nslog(10000004, null, {division: key});
                            }
                        });
                    }
                }
            }
            // 发起统计请求
            clickNslogFn();

            /****** 各模块展现量pv ******/
            function checkModuleIsShow() {
                var result = [];
                for (var k in circulationLinkCfg) {
                    if (k !== 'innerLink' && k !== 'relationTable') {
                        !!$(circulationLinkCfg[k]).html() && result.push(k);
                    }
                }
                if (result.length > 0) {
                    nslog(10000005, null, {showModules: result.join(',')});
                }
            }
            checkModuleIsShow();

        })();
        /****** 词条页站内流转需求统计 end ******/

    });

    // 广告接入 wikiad 统一加载
    // log 词条页广告被拦截情况（此处 log 请求行为）
    nslog(70000101, window.location.href, {
        api: 'lemma-ad',
        action: 'request'
    });
    $.ajax({
        type: 'GET',
        url: '/api/wikiad/getsquirrels',
        data: {
            lemmaId: 85895
        },
        cache: false,
        dataType: 'JSON',
        success: function (res) {
            // log 词条页广告被拦截情况（此处 log 请求成功）
            nslog(70000101, window.location.href, {
                api: 'lemma-ad',
                action: 'success'
            });

            if (!res.errno) {
                if (res.data[5]) {
                    require.async(['wiki-lemma:widget/promotion/rightPreciseAd/rightPreciseAd.js'], function(rightPreciseAd) {
                        rightPreciseAd(res.data[5]);
                        nslog(10002201, location.href, {
                            adId: res.data[5][0].adId,
                            adTitle: res.data[5][0].name,
                            adPos: 5
                        });
                    });
                } else if (res.data[1]) {
                    require.async(['wiki-lemma:widget/promotion/vbaike/vbaike.js'], function(vbaike) {
                        vbaike(res.data[1]);
                        for(var i in res.data[1]) {
                            nslog(10002201, location.href, {
                                adId: res.data[1][i].adId,
                                adTitle: res.data[1][i].name,
                                adPos: 1
                            });
                        }
                    });
                }
                if (res.data[9]) {
                    require.async(['wiki-lemma:widget/promotion/rightBigAd/rightBigAd.js'], function(rightBigAd) {
                        rightBigAd(res.data[9]);
                            nslog(10002201, location.href, {
                                adId: res.data[9][0].adId,
                                adTitle: res.data[9][0].name,
                                adPos: 9
                            });
                    });
                } else if(res.data[2]) {
                    require.async(['wiki-lemma:widget/promotion/slide/slide.js'], function(slide) {
                        slide(res.data[2]);
                        for(var i in res.data[2]) {
                            nslog(10002201, location.href, {
                                adId: res.data[2][i].adId,
                                adTitle: res.data[2][i].name,
                                adPos: 2
                            });
                        }
                    });
                }
                if (res.data[3]) {
                    require.async(['wiki-lemma:widget/promotion/topAd/topAd.js'], function(topAd) {
                        topAd(res.data[3]);
                        nslog(10002201, location.href, {
                            adId: res.data[3][0].adId,
                            adTitle: res.data[3][0].name,
                            adPos: 3
                        });
                    });
                }
                if (res.data[4]) {
                    require.async(['wiki-lemma:widget/promotion/rightAd/rightAd.js'], function(rightAd) {
                        rightAd(res.data[4]);
                        nslog(10002201, location.href, {
                            adId: res.data[4][0].adId,
                            adTitle: res.data[4][0].name,
                            adPos: 4
                        });
                    });
                }
            } else {
                return;
            }

            setTimeout(function () {
                var elemArr = {};
                res.data[1] && res.data[1].length > 0 && (elemArr['lemma-vbaike-ad'] = $('.lemmaWgt-promotion-vbaike .promotion_viewport a:eq(0) img').get(0));
                res.data[2] && res.data[2].length > 0 && (elemArr['lemma-slide-ad'] = $('.lemmaWgt-promotion-slide .promotion_viewport a:eq(0) img').get(0));
                res.data[3] && res.data[3].length > 0 && (elemArr['lemma-navbar-ad'] = {
                    node: $('.header [nslog-type="10002202"]').get(0),
                    validations: {
                        'noBackgroundImage': function() {
                            return $('.header [nslog-type="10002202"]').css('background-image').indexOf(res.data[3][0].picUrl) < 0
                        }
                    }
                });
                res.data[4] && res.data[4].length > 0 && (elemArr['lemma-side-ad'] = {
                    node: $('.right-ad img').get(0),
                    validations: {
                        'noBackgroundImage': function() {
                            return $('.right-ad img').attr('src').indexOf(res.data[4][0].picUrl) < 0
                        }
                    }
                });

                testElem.log(elemArr, 70000102);
            }, 1000);
        },
        error: function () {
            // log 词条页广告被拦截情况（此处 log 请求失败）
            nslog(70000101, window.location.href, {
                api: 'lemma-ad',
                action: 'error'
            });
        }
    });
}();
