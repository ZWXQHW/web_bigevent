$(function(){
    layui.form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()
})

// 初始化用户的基本信息函数
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用form.val()快速为表单赋值
            var form = layui.form
            form.val('formUserInfo',res.data)
        },
    })
}

// 重置表单的数据
$('#btn').on('click',function(e){
    e.preventDefault();
    initUserInfo()
})

// 更新用户的基本信息
 // 监听表单的提交事件
 $('.layui-form').on('submit',function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layer.msg('获取用户信息失败！')
            }
            layer.msg('修改用户信息成功！')
            // 调用父页面中的方法，重新渲染用户的头像和用户信息
            window.parent.getUserInfo()
        },
    })
  })
