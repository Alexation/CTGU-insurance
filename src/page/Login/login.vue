

<template>
  <div class="login-container">
  	<div class="layer">
  			<div class="some-space">
        	<div class="form">
						<h2>CTGU保险推荐系统</h2>




			<div class="item">
			<i class="iconfont icon-user"></i>
			<input
	              autocomplete="off"
	              type="text"
	              class="input"
	              v-model="ruleForm.userName"
	              placeholder="请输入用户名"
	            />
            </div>





            <div class="item">
            	<i class="iconfont icon-password"></i>
	            <input
	              autocomplete="off"
	              type="password"
	              class="input"
	              v-model="ruleForm.userPwd"
	              maxlength="20"
	              @keyup.enter="login"
	              placeholder="请输入密码"
	            />
            </div>

			<div class="item">
			<i class="iconfont icon-user"></i>
			<input
	              autocomplete="off"
	              type="text"
	              class="input"
	              v-model="ruleForm.captcha"
	              placeholder="验证码"
	            />
			<img class="ShowCaptcha" ref="captcha" :src="captchaUrl" alt="" @click="getCaptcha">

            </div>


	          <button 
	            class="loginBtn"
	            :text="logintxt"
				@click="login"
				>
	            {{logintxt}}
	          </button>
	          <div class="tip">
							默认用户名：admin ，默认密码：123
	          </div>
			  <br>
			  <a href="javascript:;" class="tip" style="font-size: 12px; padding-top: 20px;color:white;" @click="toRegister">还没有账号？注册 CTGU 账号</a>
        	</div>
        </div>
    </div>

	    <vue-particles 
	      color="#6495ED"
	      :particleOpacity="0.7"
	      :particlesNumber="80"
	      shapeType="circle"
	      :particleSize="4"
	      linesColor="#6495ED"
	      :linesWidth="1"
	      :lineLinked="true"
	      :lineOpacity="0.6"
	      :linesDistance="150"
	      :moveSpeed="3"
	      :hoverEffect="true"
	      hoverMode="grab"
	      :clickEffect="true"
	      clickMode="push"
	    >
	    </vue-particles>

    <bgAnimation />

    <!-- <modal 
      title="提示" 
      :content="modalContent"
      :visible.sync="visible" 
      @confirm="confirm">
    </modal> -->

  </div>
</template>

<script>
import bgAnimation from '../../components/bgAnimation'
import modal from '../../components/modal'
import YFooter from '/common/footer'
import YButton from '/components/YButton'
import { userLogin, geetest } from '/api/index.js'
import { addCart } from '/api/goods.js'
import store from '../../store'
import { setStore, getStore, removeStore } from '/utils/storage.js'
require('../../../static/geetest/gt.js')
export default {
  name: 'Login',
  components: { bgAnimation, modal },
  data() {
  	return {
		        captchaUrl: 'https://ins-spring-boot-1618793-1309615625.ap-shanghai.run.tcloudbase.com/captcha',
	ruleForm: {
        userName: 'admin',
        userPwd: '123',
        errMsg: '',
        captcha: ''
      },
	  logintxt: '登录',
  		// userName: 'admin',
  		// userPwd: '123',
      visible: false,
      modalContent: '这是一段自定义模态框消息'
  	}
  },
  computed: {
  	isLoginAble() {
  		return !(this.userName && this.userPwd);
  	},
    count () {
      return this.$store.state.login
    }
  },
  created() {},
  mounted() {
    this.getRemembered()
    this.login_addCart()
    // this.init_geetest()
    // this.open('登录提示', '测试体验账号密码：admin | 123')
    let self = this
    document.onkeydown = function(e) {
      let ev = document.all ? window.event : e
      if (ev.keyCode === 13) {
        self.login()
      }
    }
  },
  methods: {
  	// login () {
  	// 	if (this.userName == 'admin' && this.userPwd == '123') {
    //      this.$router.push({
    //       path: '/home'
    //      })
    //   } else {
    //     this.$Toast({
    //       content: '请输入正确的用户名和密码',
    //       type: 'error',
    //       // hasClose: true
    //     })
    //   }
  	// },
    // confirm () {
    //   this.visible = false;
    //   console.log('点击确定')
    // }
	    getCaptcha(event) {
      // geetest()
      // this.captchaUrl = '/api/captcha?time=' + Date.now()
      this.captchaUrl = 'https://ins-spring-boot-1618793-1309615625.ap-shanghai.run.tcloudbase.com/captcha?time=' + Date.now()
    //   this.captchaUrl = '/api/captcha'
    },
    open (t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    messageSuccess () {
      this.$message({
        message: '恭喜您，注册成功！赶紧登录体验吧',
        type: 'success'
      })
    },
    message (m) {
      this.$message.error({
        message: m
      })
    },
    getRemembered () {
      var judge = getStore('remember')
      if (judge === 'true') {
        this.autoLogin = true
        this.ruleForm.userName = getStore('rusername')
        this.ruleForm.userPwd = getStore('rpassword')
      }
    },
    rememberPass () {
      if (this.autoLogin === true) {
        setStore('remember', 'true')
        setStore('rusername', this.ruleForm.userName)
        setStore('rpassword', this.ruleForm.userPwd)
      } else {
        setStore('remember', 'false')
        removeStore('rusername')
        removeStore('rpassword')
      }
    },
    toRegister () {
      this.$router.push({
        path: '/register'
      })
    },
    // 登录返回按钮
    login_back () {
      this.$router.go(-1)
    },
    // 登陆时将本地的添加到用户购物车
    login_addCart () {
      let cartArr = []
      let locaCart = JSON.parse(getStore('buyCart'))
      if (locaCart && locaCart.length) {
        locaCart.forEach(item => {
          cartArr.push({
            userId: getStore('userId'),
            productId: item.productId,
            productNum: item.productNum
          })
        })
      }
      this.cart = cartArr
    },
    login () {
      this.logintxt = '登录中...'
      this.rememberPass()
      if (!this.ruleForm.userName || !this.ruleForm.userPwd) {
        // this.ruleForm.errMsg = '账号或者密码不能为空!'
        this.message('账号或者密码不能为空!')
        return false
      }
      // var result = captcha.getValidate()
      // if (!result) {
      //   this.message('请完成验证')
      //   this.logintxt = '登录'
      //   return false
      // }
      var params = {
        "username": this.ruleForm.userName,
        "password": this.ruleForm.userPwd,
        "code": this.ruleForm.captcha,
      }
      window.localStorage.setItem("satoken", "")
      // let paramsString = `username=${this.ruleForm.userName}&password=${this.ruleForm.userPwd}&code=${this.captcha}`
      userLogin(params).then(res => {
        
        if (res.code === 200) {
          // removeStore('token')
          // ('token', res.data.token)
          setStore(res.data.tokenHeader, res.data.token)
          setStore("id", res.data.user.id)
          // setStore("faceIcon", res.data.user.faceIcon)
          // setStore("username", res.data.user.username)
          store.commit('RECORD_USERINFO', {info: res.data.user})
          // setStore('username', this.ruleForm.userName)
          // 登录后添加当前缓存中的购物车
        //   if (this.cart.length) {
        //     for (var i = 0; i < this.cart.length; i++) {
        //       addCart(this.cart[i]).then(res => {
        //         if (res.success === true) {
        //         }
        //       })
        //     }
        //     removeStore('buyCart')
        //     this.$router.push({
        //       path: '/'
        //     })
        //   } else {
            this.$router.push({
              path: '/thanks'
            })
        // }
          // console.log(res)
        } 
        else if(res.code === 500 && res.msg) {
          this.logintxt = '登录'
          this.message(res.msg)
          // captcha.reset()
          this.getCaptcha()
          return false
        }
        else{
          this.message('账号不存在，请核实账号密码或者前往注册')
          this.logintxt = '登录'
          // captcha.reset()
          this.getCaptcha()
          return false
        }
      })
    },
    init_geetest () {
      geetest().then(res => {
        this.ImgData = res
        // console.log(res)
        // if(res.code === 200) {
        //   // this.loading = false;
        //   ImgData = res
        //   console.log(res)
        // }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
	.layer {
	  position: absolute;
	  height: 100%;
	  width: 100%;
	}
	#particles-js {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
    z-index: 1000;
	}
	.some-space {
	  color: white;
	  font-weight: 100;
	  letter-spacing: 2px;
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  z-index: 1001;
	  -webkit-transform: translate3d(-50%, -50%, 0);
	  transform: translate3d(-50%, -50%, 0);

	//   -ms-animation: cloud 2s 3s ease-in infinite alternate;
	//   -moz-animation: cloud 2s 3s ease-in infinite alternate;
	//   -webkit-animation: cloud 2s 3s ease-in infinite alternate;
	//   -o-animation: cloud 2s 3s ease-in infinite alternate;
	//   -webkit-animation: cloud 2s 3s ease-in infinite alternate;
	//   animation: cloud 2s 3s ease-in infinite alternate;

	  .form {
	  	width: 460px;
	  	height: auto;
	  	background: rgba(36, 36, 85, .5);
	  	margin: 0 auto;
	  	padding: 35px 30px 25px;
	  	box-shadow: 0 0 25px rgba(255, 255, 255, .5);
	  	border-radius: 10px;
	    .item {
	    	display: flex;
	    	align-items: center;
				margin-bottom: 25px;
        border-bottom: 1px solid #d3d7f7;
				i {
					color: #d3d7f7;
					margin-right: 10px;
				}
	    }
	  	h2 {
	  		text-align: center;
	  		font-weight: normal;
	  		font-size: 26px;
	  		color: #d3d7f7;
	  		padding-bottom: 35px;
	  	}
	  	.input {
        font-size: 16px;
        line-height: 30px;
        width: 100%;
        color: #d3d7f7;
        outline: none;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        padding: 10px 0;
	  	}
	  	.loginBtn {
	  		width: 100%;
	  		padding: 12px 0;
	  		border: 1px solid #d3d7f7;
        font-size: 16px;
    		color: #d3d7f7;
    		cursor: pointer;
    		background: transparent;
    		border-radius: 4px;
        margin-top: 10px;
		  transition: 0.3s;
    		&:hover {
    			color: #fff;
    			background: #0090ff;
    			border-color: #0090ff;
    		}
	  	}
	  	.tip {
        font-size: 12px;
        padding-top: 20px;
	  	}
	  }


	}

}

input::-webkit-input-placeholder {
    color: #d3d7f7;
}
input::-moz-placeholder {   /* Mozilla Firefox 19+ */
    color: #d3d7f7;
}
input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
    color: #d3d7f7;
}
input:-ms-input-placeholder {  /* Internet Explorer 10-11 */ 
    color: #d3d7f7;
}


@-ms-keyframes cloud{
    0%{
        -ms-transform: translate(-50%, -50%);
    }
    40%{
        opacity: 1;
    }
    60%{
        opacity: 1;
    }
    100%{
        -ms-transform: translate(-50%, -40%);
    }
}
@-moz-keyframes cloud{
    0%{
        -moz-transform: translate(-50%, -50%);
    }
    40%{
        opacity: 1;
    }
    60%{
        opacity: 1;
    }
    100%{
        -moz-transform: translate(-50%, -40%);
    }
}
@-o-keyframes cloud{
    0%{
        -o-transform: translate(-50%, -50%);
    }
    40%{
        opacity: 1;
    }
    60%{
        opacity: 1;
    }
    100%{
        -o-transform: translate(-50%, -40%);
    }
}
@-webkit-keyframes cloud{
    0%{
        -webkit-transform: translate(-50%, -50%);
    }
    40%{
        opacity: 1;
    }
    60%{
        opacity: 1;
    }
    100%{
        -webkit-transform: translate(-50%, -40%);
    }
}
@keyframes cloud{
    0%{
        transform: translate(-50%, -50%);
    }
    40%{
        opacity: 1;
    }
    60%{
        opacity: 1;
    }
    100%{
        transform: translate(-50%, -40%);
    }
}
	
</style>
