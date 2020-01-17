# flask-vue-word-cloud
A single page application with Flask and Vue.

### 前言
这是一个前端用 Vue，后端用 Python 的 Web 框架 Flask 开发的词云生成应用。写这个小项目的起因是最近团队年终述职，有一些大佬的 PPT 上用了词云来展示自己团队一年的工作成果。还有大佬说不要守着自己的一亩三分地，在技术上拓宽视野可以帮助我们更好的成长。正好之前接触过 Python 和 R 生成词云，于是作为一个移动端开发者，想在本地跑一个生成词云的服务，就有了这个项目。

### 目录结构
先简单看一下项目的目录结构，backend 是 Flask 实现的服务端，frontend 是 Vue 实现的前端。

```
.
├── backend
│   ├── app
│   └── venv
└── frontend
    ├── README.md
    ├── build
    ├── config
    ├── dist
    ├── index.html
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── src
    └── static
```
> Vue 是渐进式 JavaScript 框架。[Vue官网](https://cn.vuejs.org/)

> Flask 是一个使用 Python 编写的轻量级 Web 应用框架。[Flask 学习资源](https://dormousehole.readthedocs.io/en/latest/)

再来看一下目前代码的运行效果：
![image.png](https://i.loli.net/2020/01/17/9J3D5heMVWu6qTC.png)

### 开发环境
硬件：
- macOS Mojave 10.14.6

软件：
- nodejs v11.6.0
- Python 3.7.4

请确保已经安装好了node js 环境，可参考[nodejs官网](https://nodejs.org/en/)进行安装。

### 前端开发

#### 1、安装vue-cli

安装 vue-cli</br>
Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统。
```
$ npm install -g vue-cli
```

#### 2、创建项目

新建目录
```bash
$ mkdir word-cloud
$ cd word-cloud/
```
创建项目
```
$ vue init webpack frontend
```
执行完上面的命令后，会让你设置项目的基本信息，我的配置如下：
![image.png](https://i.loli.net/2020/01/17/zoySbGNxAfXFQv2.png)

然后等待安装一些基本的依赖，完成之后进入到 frontend 目录

```
$ cd frontend
$ npm run dev
```
执行完后会在控制台提示
```
Your application is running here: http://localhost:8080
```
说明我们现在已经可以跑起来了，可以访问一下`http://localhost:8080`，如下：

![image.png](https://i.loli.net/2020/01/17/Qc9sfKhlX46CD2g.png)

这时我们再看一下 frontend 的目录结构，已经默认帮我们生成了一些目录和代码。
```
.
├── README.md
├── build
├── config
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── src
└── static
```

#### 3、安装element-ui

[Element](https://element.eleme.io/#/zh-CN) 是一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库。

```
$ npm i element-ui -S
```
使用插件

在 vue-cli 帮我们生成的目录中`/src/main.js`中导入ElementUI
```
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
```

最后使用
```
Vue.use(ElementUI)
```

#### 4、安装axios
因为是前后端分离的应用，所以还要安装请求的库axios。[axios](https://cn.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html) 是基于 promise 的 HTTP 客户端。
```
$ npm install --save axios
```

同样在`/src/main.js`导入axios
```
import axios from 'axios'
```

注册axios
```
Vue.prototype.axios = axios
```
之后我们就可以使用 axios 发送请求了。

#### 5、编写页面

先找到`App.vue`，把我们不需要的 logo 删掉。

```
<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>
```

新建`WordCloud.vue`，这就是我们的主要页面。一个标题，一个输入框，两个按钮。

```
<template>
    <div>
        <h2>小词云</h2>
        <div id="word-text-area">
            <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="textarea">
            </el-input>
            <div id="word-img">
                <el-image :src="'data:image/png;base64,'+pic" :fit="fit">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </div>
            <div id="word-operation">
                <el-row>
                    <el-button type="primary" @click="onSubmit" round>生成词云</el-button>
                    <el-button type="success" @click="onDownload" round>下载图片</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>
```

实现点击事件并发送请求
```
<script>
    export default {
        name: 'wordcloud',
        data() {
            return {
                textarea: '',
                pic: "",
                pageTitle: 'Flask Vue Word Cloud',
            }
        },
        methods: {
            onSubmit() {
                var param = {
                    "word": this.textarea
                }
                this.axios.post("/word/cloud/generate", param).then(
                    res => {
                        this.pic = res.data
                        console.log(res.data)
                    }
                ).catch(res => {
                    console.log(res.data.res)
                })
            },
            onDownload() {
                const imgUrl = 'data:image/png;base64,' + this.pic
                const a = document.createElement('a')
                a.href = imgUrl
                a.setAttribute('download', 'word-cloud')
                a.click()
            }
        }
    }
</script>
```

最后在`src/router`中找到`index.js`修改一下路由。
```
export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: WordCloud
  }]
})

```

打包资源
```
$ npm run build
```
执行完成后会将资源打包到`dist`目录。

至此，前端的开发工作就完成了。

### 后端开发

#### 1、安装Python3
由于 mac 系统自带的 Python 版本是 2.7，先安装一下Python3，这里我使用 homebrew 安装。

```
brew install python3
```

由于我之前已经安装过了，执行完成之后出现警告，按照提示操作
> Warning: python 3.7.4_1 is already installed, it's just not linked
You can use `brew link python` to link this version.

```
Linking /usr/local/Cellar/python/3.7.4_1... Error: Permission denied @ dir_s_mkdir - /usr/local/Frameworks
```

再次出现错误，没有权限

> 参考处理：https://stackoverflow.com/questions/29422345/installed-just-not-linked

```
sudo chown -R $USER:admin /usr/local
```

再次执行
```
brew link python
```

```
Linking /usr/local/Cellar/python/3.7.4_1... 1 symlinks created
```
错误解决，执行 python3 可以正确显示版本号。

```
$ python3
Python 3.7.4 (default, Sep  7 2019, 18:27:02) 
[Clang 10.0.1 (clang-1001.0.46.4)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
```

#### 2、创建虚拟环境
Python 虚拟环境可以为 Python 项目提供独立的运行环境，使得不同的应用使用不同的 Python 版本，我们使用虚拟环境开发一个 Python 应用。

新建后端目录
```
$ mkdir backend
$ cd backend/
```

创建虚拟环境
```
python3 -m venv venv
```

激活虚拟环境
```
source venv/bin/activate
```

关闭虚拟环境的命令如下
```
deactivate
```

#### 3、安装 flask

关于 flask 我们在文章最开始已经介绍过。

```
pip install flask
```

如果没有报错，那就就安装成果了。


#### 4、安装词云生成库

wordcloud 是 python 优秀的词云生成库。词云以词语为基本单位更加直观的展示文本。

![image.png](https://i.loli.net/2020/01/17/9oWz16msZ5heSfA.png)

```
pip install wordcloud
```

#### 4、编写代码
关于 flask 代码部分参考了[The Flask Mega-Tutorial教程](https://github.com/luhuisicnu/The-Flask-Mega-Tutorial-zh)，看完第一章就可以写出应用了。这里我解释一下关键代码。

在`__init__.py`中修改python默认html和静态资源目录，这个资源就是我们上面在前端开发中通过`npm run build`生成的资源目录。

```
app = Flask(__name__,
            template_folder="../../frontend/dist",
            static_folder="../../frontend/dist/static")
```

修改完成之后再启动 Flask，访问的就是 vue 的页面了。

`routes.py` 里面的代码，就是主页面和生成词云的接口。

```
# 真正调用词云库生成图片
def get_word_cloud(text):
    # font = "./SimHei.ttf"
    # pil_img = WordCloud(width=500, height=500, font_path=font).generate(text=text).to_image()

    pil_img = WordCloud(width=800, height=300, background_color="white").generate(text=text).to_image()
    img = io.BytesIO()
    pil_img.save(img, "PNG")
    img.seek(0)
    img_base64 = base64.b64encode(img.getvalue()).decode()
    return img_base64


# 主页面
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


# 生成词云图片接口，以base64格式返回
@app.route('/word/cloud/generate', methods=["POST"])
def cloud():
    text = request.json.get("word")
    res = get_word_cloud(text)
    return res
```

最后执行`flask run`就可以跑起来了。

当然这是用半天时间跑起来的一个简陋的应用，但是具备了基本的前后端分离应用的功能，后续将会完善起来。

### TODO
- [ ] 支持中文分词
- [ ] 支持停用词
- [ ] 集成 Docker
- [ ] 自定义背景颜色
- [ ] 自定义图片尺寸
- [ ] 自定义词云形状
- [ ] 自定义字体
- [ ] 服务器部署
- [ ] 其他
