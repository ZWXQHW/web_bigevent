$(function () {
    // 定义一个美化时间的过滤器
    template.defaults.imports.dateFormat = function(date){
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 补零函数
    function padZero(n){
        return n>10 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        // 页码值，默认请求第一页的数据
        pagenum: 1,
        // 每页显示几条数据，默认每页显示两条
        pagesize: 2,
        // 文章分类的id
        cate_id:'',
        // 文章的发布状态
        state:'',
    }

    initTable()

    // 获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 获取文章列表之后调用渲染文章分页的方法
                renderPage(res.total)
            }
        })
    }

    initCate()
    // 初始化文章分类列表的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').append(htmlStr)
                layui.form.render()
            }
        })
    }

    // 赛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数重新赋值，再重新渲染表格
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    
    // 定义渲染分页的方法
    function renderPage(total){
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'test1',//注意，这里的 test1 是 ID，不用加 # 号
            count: total ,//数据总数，从服务端得到
            limit:q.pagesize,// 每页显示几条数据
            curr:q.pagenum,// 设置默认选中的分页 
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候，触发jump回调函数
            // 触发jump回调函数的方式有两种：
            // 1.点击页面值的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump:function(obj,first){
                // 点击页码值时first的值为undefined,此时调用initTable方法
                // 调用laypage.render()方法时first的值为true
                // console.log(first)
                // 最新页码值
                // console.log(obj.curr)
                // 把最新的页码值，赋值到q这个查询对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的查询参数q获取数据列表，并渲染表格
                if(!first){
                    initTable()
                }    
            } 
        })
    }

    // 删除文章
    $('tbody').on('click','#btn-del',function(){
        // 获取删除按钮的个数
        var len = $('#btn-del').length
        // 获取要删除文章的id
        var id = $(this).attr('data-id')
        // 弹出层，询问是否删除数据
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除时，判断这页的数据是否全部删完
                    // 全部删完，让页码值-1，然后再渲染列表
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })
          })
    })

})
