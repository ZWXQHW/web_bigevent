$(function(){
    // 获取用户基本信息
    getUserInfo()

    // 点击退出事件
    $('#btnlogout').on('click',function(){
        layui.layer.open({
            content: '确认退出？',
            yes: function(layero, index){
            //1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            // 关闭弹出窗
            layui.layer.close(index)
            }
          });        
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
    })
}

// 渲染用户头像
// 参数user就是用户的信息res.data
function renderAvatar(user){
    // 1.获取用户的用户名
    var name = user.nickname || user.username
    $('.welcome').html(name)
    // 3.渲染头像,先判断有没有头像
    var user_pic = user.user_pic
    if(user_pic !== null){
        // 3.1有头像渲染
        $('.layui-nav-img').attr('src',user_pic)
        $('.layui-nav-img').show()
        $('.text-avator').hide()
    }else{
        // 没有头像渲染
        var first = name[0].toUpperCase()
        $('.text-avator').html(first)
        $('.text-avator').show()
        $('.layui-nav-img').hide()
    }
}