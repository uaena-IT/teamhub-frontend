<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="margin:0">训练中心</h2>
      <el-button v-if="user.role === 'CAPTAIN'" type="primary" @click="showCreate = true">发布训练</el-button>
    </div>

    <!-- 训练列表 -->
    <el-card v-for="t in trainings" :key="t.id" style="margin-bottom:12px;cursor:pointer" @click="goDetail(t.id)">
      <div style="display:flex;justify-content:space-between">
        <div>
          <div style="font-size:16px;font-weight:bold">{{ t.title }}</div>
          <div style="color:#888;margin-top:4px">{{ t.location }} · {{ formatTime(t.trainTime) }}</div>
        </div>
        <el-tag>查看详情</el-tag>
      </div>
    </el-card>

    <el-empty v-if="trainings.length === 0" description="暂无训练" />

    <!-- 发布训练弹窗 -->
    <el-dialog v-model="showCreate" title="发布训练" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="form.trainTime" type="datetime" style="width:100%" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="form.videoUrl" placeholder="网盘/B站链接" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const trainings = ref<any[]>([])
const showCreate = ref(false)
const user = JSON.parse(localStorage.getItem('user') || '{}')

const form = reactive({
  title: '',
  location: '',
  trainTime: '',
  content: '',
  videoUrl: '',
  createdBy: user.id
})

async function loadList() {
  const res = await axios.get('http://localhost:8080/api/training/list')
  trainings.value = res.data
}

async function handleCreate() {
  await axios.post('http://localhost:8080/api/training/create', form)
  ElMessage.success('发布成功')
  showCreate.value = false
  loadList()
}

function goDetail(id: number) {
  router.push(`/training/${id}`)
}

function formatTime(t: string) {
  return t ? t.replace('T', ' ').slice(0, 16) : ''
}

onMounted(loadList)
</script>