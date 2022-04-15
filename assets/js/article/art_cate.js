$(function(){
    var form = layui.form
    initArtCateList()

    // 添加文章分类
    var addIndex = null
    $('#btnAddCate').on('click',function(){
        addIndex = layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          });     
    })
    
    // 通过代理的形式，为form-add 表单绑定submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$('#form-add').serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('添加失败！')
                }
                layer.msg('添加成功！')
                // 关闭窗口并且更新列表
                layer.close(addIndex)
                initArtCateList()
            }
        })
    })

    // 编辑文章
    var editIndex = null
    $('tbody').on('click','#btn-edit',function(){
        var id = $(this).attr('data-id')
        editIndex = layer.open({
            type:1,
            area:['500px','250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
          });  
        //   获取这条编辑的数据
          $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                // 渲染数据到编辑框
                form.val('form-edit',res.data)
            }
          }) 
    })

    // 更新文章分类的数据
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                   return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层,更新数据
                layer.close(editIndex)
                initArtCateList()
            }
        })
    })

    // 删除文章分类
    $('tbody').on('click','#btn-del',function(){
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败！')
                    }
                    layer.close(index)
                    layer.msg('删除成功！')
                    $('tbody').empty()
                    initArtCateList()
                }
            })
        })
    })


})



// 获取文章的分类列表
function initArtCateList(){
    $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取文章失败！')
            }
            // 渲染数据
           var htmlStr = template('tpl-table',res)
           $('tbody').empty()
           $('tbody').append(htmlStr)
        }
    })
}