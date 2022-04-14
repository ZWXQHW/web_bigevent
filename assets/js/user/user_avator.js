$(function(){   
// 1.創建裁剪功能
  // 1.1 获取裁剪区域的 DOM 元素
  var image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  image.cropper(options)

    // 2.上传图片功能
    $('#btnChoseImage').on('click',function(){
        // 模拟点击上传文件按钮
        $('#file').click()
    })
    // 替换上传头像
    // 为文件选择框绑定change事件
    $('#file').on('change',function(e){
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
         image
            .cropper('destroy')
            .attr('src',newURL)
            // 重新初始化裁剪区域
            .cropper(options)
    })

    // 上传头像
    $('#btnUpload').on('click',function(){
        // 拿到用户裁剪之后的头像
        var dataURL = image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    
      //   调用上传头像接口
      $.ajax({
          method:'POST',
          url:'/my/update/avatar',
          data:{avatar:dataURL},
          success:function(res){
              if(res.status !== 0){
                  return layui.layer.msg('头像上传失败！')
              }
              layui.layer.msg('上传头像成功！')
            //   更新主页头像
            window.parent.getUserInfo()
          }
      })
    
    })


})