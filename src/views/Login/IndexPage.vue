<template>
  <div class="login">
    <div class="login-con">
      <!-- 顶部切换 -->
      <ul class="menu-tab">
        <li v-for="item in menuData" :key="item.id" :class="{ current: item.current }" @click="clickMenu(item)">
          {{ item.txt }}
        </li>
      </ul>

      <!-- 表单部分 -->
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
        <!-- 修改提示文字 并且修改type类型 与v-model绑定的数据 并且添加类名-->
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6"
            maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20">
          </el-input>
        </el-form-item>
        <!-- 设置按钮 -->
        <el-form-item>
          <el-button type="danger" @click="submitForm(ruleFormRef)" :disabled="loginBtn" class="login-btn block">{{
              model === 'login' ? '登录'
                :
                '注册'
          }}

          </el-button>
        </el-form-item>
      </el-form>
      <!-- 表单部分 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import * as verification from '../../util/verification'
import { ElMessage, FormInstance } from "element-plus";
import link from '../../util/api'
/**
 * 顶部切换变量
 */
const menuData = reactive([
  { txt: "登录", current: true, type: "login", id: 0 },
  { txt: "注册", current: false, type: "register", id: 1 },
]);
// 当前状态
const model = ref("login");
// 按钮是否可点击
let loginBtn = ref<boolean>(true)

// 切换模块
const clickMenu = (data: any) => {
  console.log(data.txt);
  menuData.forEach((elem) => {
    elem.current = false;
  });
  // 高光
  data.current = true;
  // 修改模块值
  model.value = data.type;
};
// 表单验证
const ruleFormRef = ref<FormInstance>();
const checkName = (rule: any, value: any, callback: any) => {
  // 创建邮箱正则来进行邮箱格式校验
  // let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/; 
  if (value === '') {
    return callback(new Error("邮箱不能为空！！"));
    // 调用验证（注意删掉之前的取反）
  } else if (verification.verificationEmail(value)) {
    return callback(new Error("邮箱格式有误！！"));
  } else {
    callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,15}$/;// 验证密码 6至15位的字母+数字
  if (value === "") {
    callback(new Error("密码不能为空"));
    // 调用验证
  } else if (verification.verificationPwd(value)) {
    callback(new Error("密码格式有误!6至15位的字母+数字"));
  } else {
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  // 因为登录没有重复密码 所以在登录的时候跳过
  if (model.value === 'login') { callback(); }
  if (value === "") {
    callback(new Error("重复密码不能为空"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次密码必须相同"));
  } else {
    callback();
  }
};
const ruleForm = reactive({
  username: "",
  password: "",
  passwords: "",
});
// 对输入内容进行监听
watch(ruleForm, (newVal) => {
  if (model.value === 'login') {
    if (newVal.username && newVal.password) {
      loginBtn.value = false
    } else {
      loginBtn.value = true
    }
  } else {
    // 注册
    if (newVal.username !== "" && newVal.passwords !== "" && newVal.password !== "") {
      loginBtn.value = false
    } else {
      loginBtn.value = true
    }
  }
})
const rules = reactive({
  password: [{ validator: validatePass, trigger: "blur" }],
  passwords: [{ validator: validatePass2, trigger: "blur" }],
  username: [{ validator: checkName, trigger: "blur" }],
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 判断是登录还是注册
      if (model.value == "login") {
        console.log("登录");
      } else {
        // 把要发送的数据拼装成一个对象
        let data = {
          uname: ruleForm.username,
          pwd: ruleForm.password,
        };
        // 发送请求
        link("/register", "POST", data).then((res: any) => {
          // 判断数据是否为空 不为空表示注册成功
          let data = res.data
          // 转成成数组判断长度即可知道对象是否为空
          if (Object.keys(data).length !== 0) {
            console.log(data);
            ElMessage.success('注册成功')
            model.value = "login"
            menuData.forEach((elem) => {
              elem.current = false;
            });
            // 登录的状态变为true
            menuData[0].current = true;
            // 跳转到登录界面，让用户重新输入刚才的信息
            ruleForm.password = ""

          } else {
            ElMessage.error("注册失败")
          }
        });
      }
    } else {
      console.log("注册失败!");
      return false;
    }
  });
};

</script>
<!-- --save(默认,生产环境必备) 和--save-dev(只在开发阶段用一下)   -->
<style lang="scss">
.login {
  background-color: #7a7a88; //深蓝色
  height: 100%;
}

html,
body,
#app {
  //设置页面100%高
  height: 100%;
}

// 设置切换样式开始
.login-wrap {
  width: 330px;
  margin: auto;
}

.menu-tab {
  text-align: center;

  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }

  .current {
    background-color: rgba(255, 255, 255, 0.5); //白色半透明
  }
}

// 设置切换样式结束

// 表单样式
.demo-ruleForm {
  width: 30%;
  margin: 50px auto;

  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }

  .item-from {
    margin-bottom: 13px;
  }

  .block {
    display: block;
    width: 100%;
  }

  .login-btn {
    margin-top: 19px;
  }
}

// 表单样式
</style>