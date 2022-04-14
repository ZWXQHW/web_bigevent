$(function(){
    var form = layui.form
    form.verify({
        // 自定义了一个叫pwd的校验规则
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        // 自定义一个校验两次密码是否一致的校验规则
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码一样！'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            // {
            //     oldPwd:$('[name=oldPwd]').val(),
            //     newPwd:$('[name=newPwd]').val(),
            // },
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
                // 强制回到登录页面
                //1.清空本地存储的token
                localStorage.removeItem('token')
                window.parent.location.href = '/login.html'
            }
        })
    })
})