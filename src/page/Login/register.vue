

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
	              v-model.number="ruleForm.userName"
	              placeholder="账号"
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
	              placeholder="密码"
	            />
            </div>

			<div class="item">
			<i class="iconfont icon-user"></i>
			<input
	              autocomplete="off"
	              type="password"
	              class="input"
	              v-model="ruleForm.checkPass"
	              placeholder="确认密码"
	            />
            </div>

            			<div class="item">
			<i class="iconfont icon-user"></i>
			<input
	              autocomplete="off"
	              type="text"
	              class="input"
	              v-model="ruleForm.name"
	              placeholder="真实姓名"
	            />
            </div>

            			<div class="item">

			<i class="iconfont icon-user"></i>
			<input
	              autocomplete="off"
	              type="text"
	              class="input"
	              v-model="ruleForm.email"
	              placeholder="邮箱"
	            />
                            <div>
                                &nbsp
                  <el-button 
                  @click="SendEmail"
                  :disabled='isDisabled' 

                 class="loginBtn"
                  style="width: 120px;"
                  
                  >{{captchaTime}}</el-button>
            </div>
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
			<!-- <img class="ShowCaptcha" ref="captcha" :src="captchaUrl" alt="" @click="getCaptcha"> -->

            </div>



            <el-checkbox class="agree" v-model="agreement" style="font-size: 12px; padding-top: 20px;color:white;">
              我已阅读并同意遵守
              <a style="font-size: 12px; padding-top: 20px;color:white;"
                @click="
                  open(
                    '法律声明',
                    '此仅为互联网+虚拟项目，仅供学习参考，不任何法律问题'
                  )
                "
                >法律声明</a
              >
              和
              <a style="font-size: 12px; padding-top: 20px;color:white;"
                @click="
                  open(
                    '隐私条款',
                    '本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息'
                  )
                "
                >隐私条款</a
              >
            </el-checkbox>

	          <button 
	            class="loginBtn"
	            :text="registxt"
				@click="regist"
				>
	            {{registxt}}
	          </button>
	          <div class="tip">
							                <span>如果您已拥有 CTGU 账号，则可在此</span>
                <a href="javascript:;" class="tip" style="font-size: 12px; padding-top: 20px;color:white;" @click="toLogin"
                  >登陆</a
                >
	          </div>
			  <!-- <br> -->
			  <!-- <a href="javascript:;" class="tip" style="font-size: 12px; padding-top: 20px;color:white;" @click="toRegister">还没有账号？注册 CTGU 账号</a> -->
        	</div>
        </div>
    </div>

	    <vue-particles 
	      color="#6495ED"
	      :particleOpacity="0.7"
	      :particlesNumber="80"
	      shapeType="circle"
	      :particleSize="2"
	      linesColor="#6495ED"
	      :linesWidth="1"
	      :lineLinked="true"
	      :lineOpacity="0.6"
	      :linesDistance="150"
	      :moveSpeed="2"
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


import { setStore, getStore, removeStore } from '/utils/storage.js'
import { register, geetest, SendEmailCaptcha } from "/api/index.js";
require("../../../static/geetest/gt.js");

export default {
  name: 'Login',
  components: { bgAnimation, modal },
  data() {
    
      var checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }else{
          this.submitValid = true;
          callback()
        }
      };
      var checkCaptcha = (rule, value, callback) => {
        if (!value) {
          this.submitValid = false;
          return callback(new Error('验证码不能为空'));
        }else{
          this.submitValid = true;
          callback()
        }
      };
      
      var checkEmail = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/; 
        if (!value) {
          this.submitValid = false;
          return callback(new Error('邮箱不能为空'));
        }
        else{
          this.submitValid = true;
        }
        setTimeout(() => {
          if (!reg.test(value)) {
            this.emailValid = false;
            this.submitValid = false;
            callback(new Error('请输入正确的邮箱格式'));
          } else {
            this.emailValid = true;
            this.submitValid = true;
            callback();
          }
        }, 100);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          this.submitValid = false;
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          this.submitValid = false;
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.userPwd) {
          this.submitValid = false;
          callback(new Error('两次输入密码不一致!'));
        } else {
          this.submitValid = true;
          callback();
        }
      };
  	return {
      cart: [],
      // captchaStr: '发送验证码',
      // captchaTime: 60,
      captchaTime: '发送验证码',
      isDisabled: false,
      emailValid: false,
      submitValid: false,
      loginPage: true,
      // ruleForm: {
      //   userName: "",
      //   userPwd: "",
      //   errMsg: "",
      //   email: "",
      // },
      registered: {
        userName: "",
        userPwd: "",
        userPwd2: "",
        errMsg: "",
      },
      agreement: false,
      registxt: "注册",
      statusKey: "",
      timer: null,

      ruleForm: {
        userName: '',
        userPwd: '',
        checkPass: '',
        name: '',
        errMsg: "",
        email: "",
        captcha: '',

      },
      // rules: {
      //   userPwd: [
      //     { validator: validatePass, trigger: 'blur' }
      //   ],
      //   checkPass: [
      //     { validator: validatePass2, trigger: 'blur' }
      //   ],
      //   email: [
      //     { validator: checkEmail, trigger: 'blur' }
      //   ],
      //   userName: [
      //     { validator: checkUserName, trigger: 'blur' }
      //   ],
      //   captcha: [
      //     { validator: checkCaptcha, trigger: 'blur' }
      //   ],
      // }
    };
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
  },
  methods: {
    
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert('submit!');
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },

    loading(){
      //启动定时器
      this.captchaTime--;  //定时器减1
    },
    clearTimer(){
        //清除定时器
        clearInterval(this.timer);
        this.timer = null;
    },
    SendEmail() {
      // if (this.emailValid) {
        // this.messageSuccess('验证码正在发送，请注意查收！')
        this.captchaTime = 60;
        this.isDisabled = true;
        this.loading();  //启动定时器
        this.timer = setInterval(() =>{
              //创建定时器
            if(this.captchaTime === 1){
                this.clearTimer();  //关闭定时器
                // this.skipStep();
                this.isDisabled = false;
                this.captchaTime = '发送验证码'
            }else{
                this.loading();
            }
        },1000);
        SendEmailCaptcha({ to: this.ruleForm.email }).then((res) => {
          if (res.code === 200) {
            // console.log(res);
            // this.messageSuccess();
            this.messageSuccess(res.msg);
            // this.toLogin();
            } 
          if(res.code === 500){
            this.message('邮箱格式错误')
            this.clearTimer();
            this.isDisabled = false;
            this.captchaTime = '发送验证码'
          } 
          else {
            // console.log(res);
            this.messageSuccess(res.msg);
            // captcha.reset();
            // this.init_geetest()
            // location.reload()
            // this.registxt = "注册";
            return false;
          }
        });
      // }
      // else{
      //   this.message('邮箱格式错误！')

      // }
      

    },
    open(t, m) {
      this.$notify.info({
        title: t,
        message: m,
      });
    },
    messageSuccess(msg) {
      this.$message({
        message: msg,
        type: "success",
      });
    },
    message(m) {
      this.$message.error({
        message: m,
      });
    },
    toLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    regist() {
      this.registxt = "注册中...";
      // let userName = this.registered.userName;
      // let userPwd = this.registered.userPwd;
      // let userPwd2 = this.registered.userPwd2;
      let userName = this.ruleForm.userName;
      let userPwd = this.ruleForm.userPwd;
      let checkPass = this.ruleForm.checkPass;
      let email = this.ruleForm.email;
      let captcha = this.ruleForm.captcha;
      // if (!userName || !userPwd || !userPwd2) {
      //   this.message("账号密码不能为空!");
      //   this.registxt = "注册";
      //   return false;
      // }
      // if (userPwd2 !== userPwd) {
      //   this.message("两次输入的密码不相同!");
      //   this.registxt = "注册";
      //   return false;
      // }
      if (!userName||!userPwd||!checkPass||!email||!captcha){
        this.message("请按照提示输入!");
        this.registxt = "注册";
        return false;
      }
      if (!this.agreement) {
        this.message("您未勾选同意我们的相关注册协议!");
        this.registxt = "注册";
        return false;
      }
      // var result = captcha.getValidate();
      // if (!result) {
      //   this.message("请完成验证");
      //   this.registxt = "注册";
      //   return false;
      // }
      let updateData = {
        username: this.ruleForm.userName,
        password: this.ruleForm.userPwd,
        code: this.ruleForm.captcha,
        email: this.ruleForm.email,
        name: this.ruleForm.name,
      };
      window.localStorage.setItem("satoken", "");
      register(updateData).then((res) => {
        if (res.code === 200) {
          // console.log(res);
          this.messageSuccess('恭喜你注册成功，抓紧去登录吧！');
          this.toLogin();
        } else {
          // console.log(res);
          this.message(res.msg);
          // // captcha.reset();
          // // this.init_geetest()
          // // location.reload()
          this.registxt = "注册";
          return false;
        }
      });
    },
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

	  // -ms-animation: cloud 2s 3s ease-in infinite alternate;
	  // -moz-animation: cloud 2s 3s ease-in infinite alternate;
	  // -webkit-animation: cloud 2s 3s ease-in infinite alternate;
	  // -o-animation: cloud 2s 3s ease-in infinite alternate;
	  // -webkit-animation: cloud 2s 3s ease-in infinite alternate;
	  // animation: cloud 2s 3s ease-in infinite alternate;

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
