Cookie = {
    domain: location.hostname,
    path: '/',
    set: function (name, value, expiration) {//默認會話cookie
        var now = new Date().getTime();
        var expiration_str = '';
        if (typeof (expiration) == 'number') {
            expiration_str = 'expires=' + new Date(now + expiration).toGMTString() + ';';
        }
        document.cookie = name + '=' + escape(value) + ';' + expiration_str + ' path=' + this.path + '; domain=' + this.domain + ';';
    },
    get: function (name) {
        var allookies = document.cookie;
        var bn = allookies.indexOf(name + '=');
        if (bn == -1) return '';
        bn += name.length + 1;
        en = allookies.indexOf(';', bn);
        if (en == -1) en = allookies.length;
        return unescape(allookies.substring(bn, en));
    },
    del: function (name) {
        this.set(name, '', -1);
    }
}

Storage = {
    set: function (name, value) {
        localStorage.setItem(name, value);
    },
    get: function (name) {
        localStorage.getItem(name);
    },
    del: function (name) {
        localStorage.removeItem(name);
    },
    clearAll: function () {
        localStorage.clear();
    }
}

Tip = {
    loading: function (msg = '數據加載中', remove = false, autoHide = false) {
        loadHTML = '';
        loadHTML += '<div id="loadingToastInit" style="opacity: 1;display: block;">';
        loadHTML += '<div class="weui-mask_transparent"></div>';
        loadHTML += '<div class="weui-toast"><i class="weui-loading weui-icon_toast"></i>';
        loadHTML += '<p class="weui-toast__content">' + msg + '</p>';
        loadHTML += '</div></div>';
        $loadingToast = $('#loadingToastInit');
        if ($loadingToast.length > 0) $loadingToast.remove();
        if (remove) {
            $loadingToast.remove();
            return true;
        } else {
            $('body').append(loadHTML);
            return true;
        }
    },
    success: function () {

    },
    error: function () {

    }
}

/*//调用实例
$(function () {
    $('#form-login').submit(function () {
        request.submitAjax('#form-login');
        return false;
    });
});*/

request = {
    post: function (url, data, success, cache, alone) {
        ajax(url, data, success, cache, alone, false, 'post', 'json');
    },
    get: function (url, success, cache, alone) {
        ajax(url, {}, success, alone, false, 'get', 'json');
    },
    jsonp: function (url, success, cache, alone) {
        ajax(url, {}, success, cache, alone, false, 'get', 'jsonp');
    },
    submitAjax: function (form, success, cache, alone) {
        cache = cache || true;
        var form = $(form);
        var url = form.attr('action');
        var data = form.serialize();
        ajax(url, data, success, cache, alone, false, 'post', 'json');
    }

}

// ajax封装
function ajax(url, data, success, cache, alone, async, type, dataType, error) {
    var type = type || 'post';//请求类型
    var dataType = dataType || 'json';//接收数据类型
    var async = async || true;//异步请求
    var alone = alone || false;//独立提交（一次有效的提交）
    var cache = cache || false;//浏览器历史缓存
    var success = success || function (data) {
        /*console.log('请求成功');*/
        setTimeout(function () {
            layer.msg(data.msg);//通过layer插件来进行提示信息
        }, 500);
        if (data.status) {//服务器处理成功
            setTimeout(function () {
                if (data.url) {
                    location.replace(data.url);
                } else {
                    location.reload(true);
                }
            }, 1500);
        } else {//服务器处理失败
            if (alone) {//改变ajax提交状态
                ajaxStatus = true;
            }
        }
    };
    var error = error || function (data) {
        /*console.error('请求成功失败');*/
        /*data.status;//错误状态吗*/
        $.hideLoading();
        setTimeout(function () {
            if (data.status == 404) {
                layer.msg('请求失败，请求未找到');
            } else if (data.status == 503) {
                layer.msg('请求失败，服务器内部错误');
            } else {
                layer.msg('请求失败,网络连接超时');
            }
            ajaxStatus = true;
        }, 500);
    };
    /*判断是否可以发送请求*/
    if (!ajaxStatus) {
        return false;
    }
    ajaxStatus = false;//禁用ajax请求
    /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
    if (!alone) {
        setTimeout(function () {
            ajaxStatus = true;
        }, 1000);
    }
    $.ajax({
        'url': url,
        'data': data,
        'type': type,
        'dataType': dataType,
        'async': async,
        'success': success,
        'error': error,
        'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
        'beforeSend': function () {
            $.showLoading();
        },
    });
}

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});


//$.toast.prototype.defaults.duration =1000;