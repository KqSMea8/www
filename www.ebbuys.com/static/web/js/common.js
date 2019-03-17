var httpService = (function() {

	var apiURL = 'http://www.dev.com/api/v1';

	var contentType = 'application/json;charset=utf-8';


	var httpPost = function(kind, way, obj, fun) {
		// 
		var httpName = kind + way;
		var	language = {
		        Accept: "application/json; charset=utf-8"
		   }
		$.ajax({
			type: "POST",
			url: apiURL + "/" + kind + "/" + way + "/",
//			async:false,
			//contentType: contentType,
			headers: language,
			//data: JSON.stringify(obj),
			data: obj,
			success: function(data) {
				fun(data)
			},
			error: function(err) {
				console.log(err)
			}
		})
	}
	return {
		httpPost: httpPost
	}
})();

var httpSystem = (function() {
	var register = function(obj,fun) {
			return httpService.httpPost("user", "register", obj, fun);
		}
	var login = function(obj,fun) {
		return httpService.httpPost("user", "login", obj, fun);
	}
	var codeLogin = function(obj,fun) {
		return httpService.httpPost("user", "codeLogin", obj, fun);
	}	
	var checkMobile = function(obj,fun) {
		return httpService.httpPost("user", "checkMobile", obj, fun);
	}
	var sendSMScode = function(obj,fun) {
        return httpService.httpPost("user", "sendSMScode", obj, fun);
    }	
	//注册验证码
	var checkSMScode = function(obj,fun) {
		return httpService.httpPost("user", "checkSMScode", obj, fun);
	}
	return {
		"register":register,
		"login":login,	
		"codeLogin":codeLogin,	
		"checkMobile":checkMobile,
//		发送手机验证码
		"sendSMScode":sendSMScode,	
		"checkSMScode":checkSMScode,
//		获取注册验证码
		//"Send_Register_Code":Send_Register_Code,			
	}		
})();


jQuery.Tip={   

	startLoading:function(element){
		this.$element = $(element);
		if( !this.$element.find('.iziModal-loader').length ){
			this.$element.append('<div class="iziModal-loader fadeIn"></div>');
		}
	},

	stopLoading: function(element){
			this.$element = $(element);
			var $loader = this.$element.find('.iziModal-loader');

			if( !$loader.length ){
				this.$element.prepend('<div class="iziModal-loader fadeIn"></div>');
			}
			$loader.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				$loader.remove();
			},600);
		},

}

xxTip = {
	init: function (element, options) {
		var that = this;
		this.$element = $(element);
		},
	startLoading: function(){

			if( !this.$element.find('.iziModal-loader').length ){
				this.$element.append('<div class="iziModal-loader fadeIn"></div>');
			}
			/*this.$element.find('.iziModal-loader').css({
				top: this.headerHeight,
    			borderRadius: this.options.radius
			});*/
		},

}

var valid_all = function(el) {
    var street = $(el).val();
    if (street != "") {
       $(el).parents(".in").find(".remind").removeClass("fail").addClass("success").text("")
    } else {
       $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("不能为空")
    }
};
var valid_phone = function(el) {
    	var obj_tel = {
                "country": $("#register .country").html(),
                "area_code": $("#register .area_code").html(),
                "phone": $("#register_tel").val()
            };
        httpSystem.checkMobile(obj_tel,
            function(res) {
            	console.log(res.code);
                if (res.code == 1) {
                	$(el).parents(".in").find(".remind").removeClass("fail").addClass("success").text("");
                	console.log('ok');
                	return true;
                } else {
                	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text(res.msg)
                    return false;
                }
            })            	
};	
var valid_tel = function(el) {
/*	console.log(el);
	return true;*/
    var street = $(el).val();
    var pattern = /^[(\+|\-|(|)|\d)]{5,20}$/i;
    if (pattern.test(street) && street != "") {    	
    	var obj_tel = {
                "country": $("#register .country").html(),
                "area_code": $("#register .area_code").html(),
                "phone": $("#register_tel").val()
            };
        $(el).parents(".in").find(".icon-loading").removeClass('hide');
        httpSystem.checkMobile(obj_tel,
            function(res) {
            	console.log(res.code);
            	$(el).parents(".in").find(".icon-loading").addClass('hide');
                if (res.code == 1) {
                	$(el).parents(".in").find(".remind").removeClass("fail").addClass("success").text("");
                	$(el).parents(".in").find(".icon-close").addClass('hide');
                	$(el).parents(".in").find(".icon-ok").removeClass('hide');
                	return true;
                } else {
                	$(el).parents(".in").find(".close").show();
                	$(el).parents(".in").find(".icon-ok").addClass('hide');
                	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text(res.msg)
                    return false;
                }
            })

        
    } else {
    	$(el).parents(".in").find(".icon-loading").addClass('hide');
        if (street != "") {
        	$(el).parents(".in").find(".icon-close").removeClass('hide');
        	$(el).parents(".in").find(".icon-ok").addClass('hide');
            $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("格式错误")
        } else {
        	$(el).parents(".in").find(".icon-close").removeClass('hide');
        	$(el).parents(".in").find(".icon-ok").addClass('hide');
            $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("不能为空")
        }
        return false
    }
};
var valid_nick = function(el) {
    var street = $(el).val();
    if (street.length >= 2 && street.length <= 50 && street != "") {
        $(el).next().removeClass("fail").addClass("success").text("");
        return true
    } else {
        if (street != "") {
            $(el).next().removeClass("success").addClass('fail').text("长度为2-50")
        } else {
            $(el).next().removeClass("success").addClass('fail').text("不能为空")
        }
        $(el).parents(".in").find(".icon-close").removeClass('hide');
        return false
    }
};
var valid_email = function(el) {
    var street = $(el).val();
    var pattern = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/i;
    if (pattern.test(street) && street != "") {
    	$(el).parents(".in").find(".icon-close").addClass('hide');
     	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("");
        return true
    } else {
        if (street != "") {
        	//console.log('email');
        	$(el).parents(".in").find(".icon-close").removeClass('hide');
        	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("格式错误")
           // $(el).next().removeClass("success").addClass('fail').text("格式错误")
        } else {
        	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("不能为空")
          	//$(el).next().removeClass("success").addClass('fail').text("不能为空")
        }
        return false
    }
};	
var valid_yzm = function (el) {
	var street = $(el).val();
	console.log(street);
	if (street != "") {
			$(el).next().removeClass("success").addClass('fail').text("格式错误")
		} else {

		    $(el).next().removeClass("success").addClass('fail').text("不能为空")
	}
        return false

};
var valid_yzms = function(el) {
    var obj = {
    	"country": $("#register .country").html(),
        "phone": $("#register_tel").val(),
        "code": $(el).val()
    };
    var pattern = /^[(\+|\-|(|)|\d)]{7,20}$/i;
    var pattern2 = /^\d{6}$/;
    if ($("#register_tel").val() != "" && pattern.test($("#register_tel").val())) {
        if (pattern2.test(obj.code)) {
            httpSystem.checkSMScode(obj,
            function(res) {
                var txt = res.msg;
                if (res.code == 0) {
 	               $(el).parents('.in').children('.remind').removeClass("success").addClass('fail').html(txt)
                }
            })
        } else {
            $(el).parents('.in').children('.remind').removeClass("success").addClass('fail').html("验证码格式错误")
        }
    }
};	
var valid_password = function(el) {
    var street = $(el).val();
    var lv = 0;
    var pattern = /^(?![^a-zA-Z]+$)(?!D+$).{7,20}$/;
    if (!pattern.test(street)) {
    	if (street != "" && street.length <= 20) $(el).parents(".in").find(".icon-close").removeClass('hide');
        $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("必须包含数字与字母")
        $(el).parents(".in").find(".strength span").removeClass("red");
        return
    }
    $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("");
    var pattern1 = /^(?=.*?[A-Z]).{7,20}/;
    var pattern2 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (street != "" && street.length >= 7 && street.length <= 20) {
    	$(el).parents(".in").find(".icon-close").addClass('hide');
        if (window.location.href.toUpperCase().indexOf("ZH") != -1) {
            $(el).parents(".in").find(".remind").removeClass("fail").addClass("success").text("")
        } else {
            $(el).parents(".in").find(".remind").removeClass("fail").addClass("success").text("")
        }
        if (pattern1.test(street) && pattern2.test(street)) {
            lv = 3
        } else if (pattern1.test(street) || pattern2.test(street)) {
            lv = 2
        } else {
            lv = 1
        }
    } else {
        $(el).parents(".in").find(".strength span").removeClass("red");
        $(el).parents(".in").find(".strength2").html("");
        if (street != "") {
        	$(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("密码长度为7-20")
            lv = 0
        } else {
            $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("不能为空")
            lv = 0
        }
    }
    $(el).parents(".in").find(".strength span").removeClass("red");
    for (var i = 0; i < lv; i += 1) {
        $(el).parents(".in").find(".strength span:eq(" + i + ")").addClass("red")
    }
    if (lv == 0) {
        $(el).parents(".in").find(".strength2").html("")
    } else if (lv == 1) {
         $(el).parents(".in").find(".strength2").html("低")
    } else if (lv == 2) {
        $(el).parents(".in").find(".strength2").html("中")
    } else if (lv == 3) {
        $(el).parents(".in").find(".strength2").html("高")
    }
};
var password = function(el) {
    var street = $(el).val();
    var pattern = /^(?![^a-zA-Z]+$)(?!D+$).{7,20}$/;
    if (pattern.test(street)) {
        return true
    } else {
        return false
    }
};
var valid_passwords = function(el) {
    var street = $(el).val();
    var street2 = $("#register_password").val();
    var pattern = /^(?![^a-zA-Z]+$)(?!D+$).{7,20}$/;
    if (!pattern.test(street)) {
        $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("必须包含数字与字母")
        return
    }
    $(el).parents(".in").find(".remind").removeClass("success").addClass('fail').text("");
    if (street != "" && street2 != "" && street == street2 && street.length >= 7 && street.length <= 20) {
        $(el).next().removeClass("fail").addClass("success").text("")
    } else {
        if (street != street2) {
            console.log();
             $(el).next().removeClass("success").addClass('fail').text("两次密码不一致")
        } else if (street.length < 7 && street.length > 20) {
            $(el).next().removeClass("success").addClass('fail').text("密码长度为7-20")
        } else if (street == "") {
            $(el).next().removeClass("success").addClass('fail').text("不能为空")
        }
    }
};

    function times(i, j, k, h) {
        $(j).attr("disabled", "disabled");
        if (sessionStorage['time' + i] == undefined) {
            sessionStorage['time' + i] = 60
        }
        h = 'time' + i;
        k = 'set' + i;
        h = sessionStorage['time' + i];
        var k = setInterval(function() {
            h--;
            sessionStorage['time' + i] = h;
            sessionStorage['info' + i] = sessionStorage['time' + i] + "s";
            $(j).html(sessionStorage['info' + i]);
            if (h < 0) {
                clearInterval(k);
                 sessionStorage['info' + i] = '获取验证码'
                $(j).html(sessionStorage['info' + i]);
                sessionStorage['time' + i] = 60;
                h = sessionStorage['time' + i];
                $(j).removeAttr("disabled")
            }
        },
        1000)
    }

    for (var i = 1; i < 4; i += 1) {
        if (sessionStorage['time' + i] == undefined || sessionStorage['time' + i] == 60) {
            sessionStorage['info' + i] = '获取验证码'
        } else {
            $("#sendCode_" + i).html(sessionStorage['info' + i]);
            times($("#sendCode_" + i).attr("data-num"), $("#sendCode_" + i).attr("data-id"))
        }
    }	

  $(".omi-selcet").on("click",function(event) {
        var event = event || window.event;
        event.stopPropagation();
        $(this).find("ul").toggle()
    });
    $(window).on("click",function() {
        $(".omi-selcet").find("ul").hide()
    });
    $(".omi-selcet li").on("click", function() {
        var country = $(this).parents(".tab").find(".contents .country").html();
        var area_code = $(this).parents(".tab").find(".contents .area_code").html();
        $(this).parents(".tab").find(".contents .country").html($(this).find(".country").html());
        $(this).parents(".tab").find(".contents .area_code").html($(this).find(".area_code").html());
        $(this).parents(".tab").find(".title").hide();
        if ($(this).find(".country").html() == "AU") {
            $(this).parents(".tab").find(".title").show();
        } else {
            $(this).parents(".tab").find(".title").hide()
        }
        $(".omi-selcet ul").stop().slideUp()
    });
    $(".omi-selcet").next().on("keyup",function() {
        if ($(this).val() != "") {
            $(".title").hide()
        } else {
            $(".title").show()
        }
    });

//查看密码
$('.showpwd').on('click',function() {
	if($(this).attr("data-eye")=='rePassword'){//明文
		$(this).attr("data-eye","password");
		$(this).addClass('hidepwd');
		$(this).prevAll("input").first().attr('type', 'text');
		return;
		}
	if($(this).attr("data-eye")=='password'){//密文
		$(this).attr("data-eye","rePassword");
		$(this).removeClass('hidepwd');
		$(this).prevAll("input").first().attr('type', 'password');
		return;
		} 
	});

$('.icon-close').on('click',function() {
	$(this).addClass('hide');
	$(this).prevAll("input").first().val('').focus();
	$(this).parents(".in").find(".remind").removeClass("fail").addClass("success").text("")
	});


function setGo2Top()
{
    if(!$('#go2top').length) return;

    $(window).scroll(function()
    {
        if($(window).scrollTop() < 100) $('#go2top').fadeOut(); else $('#go2top').fadeIn();
    }).resize(function ()
    {
        var parent = $('#go2top').closest('.page-container').find('.page-content');
        if(!parent.length) return;
        $('#go2top').css('left', parent.offset().left + parent.width() + 30);
        if(parent.width() == $(window).width()) $('#go2top').css('left', parent.width() - 90);
    }).scroll().resize();

    $('#go2top').tooltip({container: 'body', placement: 'left', html: true})
        .click(function(){$('body,html').animate({scrollTop:0},400); return false;});
 }