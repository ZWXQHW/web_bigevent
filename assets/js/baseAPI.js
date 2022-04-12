// 注意：每次调用$.get(),$.post(),$.ajax之前都会先调用
// ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象

$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置headers请求头
    // 请求头配置对象
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || '',
        }
    }

    // 全局统一挂载complete函数
    // 不论是成功还是失败，都会调用complete函数
    options.complete = function(res){
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            console.log('1')
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }  
    }


})