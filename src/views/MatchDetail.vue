<template>
    <div v-if="game">
      <el-page-header @back="$router.back()" :content="`vs ${game.opponent}`" style="margin-bottom:16px" />
  
      <el-card style="margin-bottom:16px">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="对手">{{ game.opponent }}</el-descriptions-item>
          <el-descriptions-item label="赛事类型">{{ game.gameType }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ formatTime(game.gameTime) }}</el-descriptions-item>
          <el-descriptions-item label="地点">{{ game.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusType(game.status)">{{ statusLabel(game.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="视频">
            <a v-if="game.videoUrl" :href="game.videoUrl" target="_blank">点击查看</a>
            <span v-else>暂无</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
  
      <!-- 比分 -->
      <el-card style="margin-bottom:16px" header="比分">
        <el-table :data="sets" border>
          <el-table-column label="局数" prop="setNumber" width="80" />
          <el-table-column label="我方" prop="ourScore" />
          <el-table-column label="对方" prop="oppScore" />
          <el-table-column label="结果">
            <template #default="{ row }">
              <el-tag :type="row.ourScore > row.oppScore ? 'success' : 'danger'">
                {{ row.ourScore > row.oppScore ? '胜' : '负' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 首发名单 -->
      <el-card style="margin-bottom:16px" header="首发名单">
        <pre style="margin:0;white-space:pre-wrap">{{ game.lineup || '暂无' }}</pre>
      </el-card>
  
      <!-- 备注 -->
      <el-card style="margin-bottom:16px" header="赛后备注">
        <p style="margin:0">{{ game.notes || '暂无' }}</p>
      </el-card>
  
      <!-- 队长操作 -->
      <el-card v-if="user.role === 'CAPTAIN'" header="状态管理">
        <el-button @click="updateStatus('ONGOING')" :disabled="game.status === 'FINISHED'">设为进行中</el-button>
        <el-button type="success" @click="updateStatus('FINISHED')" :disabled="game.status === 'FINISHED'">设为已结束</el-button>
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
  const game = ref<any>(null)
  const sets = ref<any[]>([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  async function load() {
    const res = await axios.get(`http://localhost:8080/api/match/${id}`)
    game.value = res.data.game
    sets.value = res.data.sets
  }
  
  async function updateStatus(status: string) {
    await axios.put(`http://localhost:8080/api/match/${id}/status`, null, { params: { status } })
    ElMessage.success('更新成功')
    load()
  }
  
  function formatTime(t: string) {
    return t ? t.replace('T', ' ').slice(0, 16) : ''
  }
  
  function statusLabel(s: string) {
    return { UPCOMING: '未开始', ONGOING: '进行中', FINISHED: '已结束' }[s] || s
  }
  
  function statusType(s: string) {
    return { UPCOMING: 'info', ONGOING: 'warning', FINISHED: 'success' }[s] || ''
  }
  
  onMounted(load)
  </script>