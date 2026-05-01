<template>
    <div v-if="training">
      <el-page-header @back="$router.back()" :content="training.title" style="margin-bottom:16px" />
  
      <el-card style="margin-bottom:16px">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="地点">{{ training.location }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ formatTime(training.trainTime) }}</el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">{{ training.content }}</el-descriptions-item>
          <el-descriptions-item label="视频链接" :span="2">
            <a v-if="training.videoUrl" :href="training.videoUrl" target="_blank">点击查看</a>
            <span v-else>暂无</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
  
      <!-- 报名统计 -->
      <el-card style="margin-bottom:16px">
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <el-tag type="success">参加：{{ stats.attend }}</el-tag>
          <el-tag type="danger">请假：{{ stats.absent }}</el-tag>
          <el-tag type="warning">待定：{{ stats.pending }}</el-tag>
        </div>
        <div>我的状态：</div>
        <el-radio-group v-model="myStatus" style="margin-top:8px">
          <el-radio value="ATTEND">参加</el-radio>
          <el-radio value="ABSENT">请假</el-radio>
          <el-radio value="PENDING">待定</el-radio>
        </el-radio-group>
        <el-input v-if="myStatus === 'ABSENT'" v-model="reason" placeholder="请假原因（选填）" style="margin-top:8px" />
        <el-button type="primary" style="margin-top:12px" @click="handleSignup">提交</el-button>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const route = useRoute()
  const id = route.params.id
  const training = ref<any>(null)
  const stats = ref({ attend: 0, absent: 0, pending: 0 })
  const myStatus = ref('ATTEND')
  const reason = ref('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  async function load() {
    const [t, s] = await Promise.all([
      axios.get(`http://localhost:8080/api/training/${id}`),
      axios.get(`http://localhost:8080/api/training/${id}/stats`)
    ])
    training.value = t.data
    stats.value = s.data
  }
  
  async function handleSignup() {
    await axios.post(`http://localhost:8080/api/training/${id}/signup`, null, {
      params: { userId: user.id, status: myStatus.value, reason: reason.value }
    })
    ElMessage.success('提交成功')
    load()
  }
  
  function formatTime(t: string) {
    return t ? t.replace('T', ' ').slice(0, 16) : ''
  }
  
  onMounted(load)
  </script>