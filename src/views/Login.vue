<template>
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f5">
      <el-card style="width:400px">
        <h2 style="text-align:center;margin-bottom:24px">TeamHub 登录</h2>
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const form = reactive({ username: '', password: '' })
  
  async function handleLogin() {
    try {
      const res = await axios.post('http://localhost:8080/api/user/login', form)
      localStorage.setItem('user', JSON.stringify(res.data))
      ElMessage.success('登录成功')
      router.push('/')
    } catch (e: any) {
      ElMessage.error('用户名或密码错误')
    }
  }
  </script>