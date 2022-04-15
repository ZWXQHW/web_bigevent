$(function () {
    initCate()
    // 定义一个加载文章分类的方法
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 渲染文章分类
                var htmlStr = template('tpl-renderCate', res)
                $('[name=cate_id]').html(htmlStr)
                layui.form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //  3. 更换裁剪的图片
    $('#coverFile').on('change',function(e){
        // 获取用户选择的文件
        var filelist = e.target.files
         if(filelist.length === 0){
             return layui.layer.msg('请选择文件！')
         }

        //  1.拿到用户选择的文件
        var file = e.target.files[0]
         // 2.根据选择的文件，创建一个URL地址
         var newURL = URL.createObjectURL(file)
        // 3.先销毁旧的裁剪区域，再创建新的裁剪区域
         $image
            .cropper('destroy')
            .attr('src',newURL)
            // 重新初始化裁剪区域
            .cropper(options)
    })
        // 选择封面
        $('#btnChooseImage').on('click',function(){
            $('#coverFile').click()
        })

        // 定义文章的发布状态
        var art_state = '已发布'
        // 为存为草稿按钮。绑定点击事件
        $('#btnSave2').on('click',function(){
            art_state = '草稿'
        })

        // 为表单绑定submit提交事件
        $('#form-pub').on('submit',function(e){
            e.preventDefault();
            // 基于form表单，快速创建一个FormData对象
            var fd = new FormData($(this)[0])
            fd.append('state',art_state)

            $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将文件对象存储到fd中
            fd.append('cover_img',blob)
            // 发起ajax请求
            publishArticle(fd)
            })
        })

        // 定义一个发布文章的方法
        function publishArticle(fd){
            $.ajax({
                method:'POST',
                url:'/my/article/add',
                data:fd,
                // 注意：如何向服务器提交FormData格式的数据
                // 必须添加一下两个配置项
                contentType:false,
                processData:false,
                success:function(res){
                    console.log(res)
                    if(res.status !== 0){
                        return layer.msg('发布文章失败！')
                    }
                    console.log(res)
                    layer.msg('发布文章成功！')
                    location.href = '/article/art_list.html'
                }
            })
        }
})