<template>
  <div>
    <h2 style="margin-top:0">球队设置</h2>

    <el-card style="max-width:600px;margin-bottom:16px">
      <template #header>
        <div style="font-weight:bold;font-size:16px">球队信息</div>
      </template>

      <div v-if="loading" style="text-align:center;padding:20px">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>加载中...</p>
      </div>

      <div v-else-if="team">
        <el-form :model="team" label-width="100px">
          <el-form-item label="球队名称">
            <el-input v-model="team.name" maxlength="100" show-word-limit />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="updateTeamName">保存队名</el-button>
      </div>

      <el-empty v-else description="暂无球队信息" />
    </el-card>

    <el-card style="max-width:600px">
      <template #header>
        <div style="font-weight:bold;font-size:16px">邀请码管理</div>
      </template>

      <div v-if="loading" style="text-align:center;padding:20px">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>加载中...</p>
      </div>

      <div v-else-if="team" v-loading="refreshing">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="球队名称">{{ team.name }}</el-descriptions-item>
          <el-descriptions-item label="当前邀请码">
            <span class="invite-code">{{ team.inviteCode }}</span>
            <el-button link type="primary" style="margin-left:12px" @click="copyCode">复制</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="有效期至">{{ formatTime(team.inviteCodeExpiresAt) }}</el-descriptions-item>
          <el-descriptions-item label="剩余时间">
            <el-tag :type="isExpiredSoon ? 'danger' : 'success'">{{ remainingTime }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div style="color:#666;font-size:14px;margin-bottom:12px">
          <el-icon><Info-Filled /></el-icon>
          将邀请码分享给新队员，队员在注册页填写即可加入球队。邀请码 7 天内有效。
        </div>

        <el-button type="primary" @click="refreshInviteCode">重新生成邀请码</el-button>
      </div>

      <el-empty v-else description="暂无球队信息" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import request from '../utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, InfoFilled } from '@element-plus/icons-vue'

const loading = ref(true)
const refreshing = ref(false)
const team = ref<any>(null)
const user = JSON.parse(localStorage.getItem('user') || '{}')

const isExpiredSoon = computed(() => {
  if (!team.value?.inviteCodeExpiresAt) return false
  const expires = new Date(team.value.inviteCodeExpiresAt)
  const now = new Date()
  const diff = expires.getTime() - now.getTime()
  return diff < 24 * 60 * 60 * 1000 // 不足24小时标红
})

const remainingTime = computed(() => {
  if (!team.value?.inviteCodeExpiresAt) return ''
  const expires = new Date(team.value.inviteCodeExpiresAt)
  const now = new Date()
  const diff = expires.getTime() - now.getTime()
  if (diff <= 0) return '已过期'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}天 ${hours}小时`
  return `${hours}小时`
})

function formatTime(t: string) {
  return t ? t.replace('T', ' ').slice(0, 19) : ''
}

async function loadTeam() {
  if (!user.teamId) {
    loading.value = false
    return
  }
  try {
    const res = await request.get(`/api/team/${user.teamId}`)
    team.value = res.data
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '获取球队信息失败')
  } finally {
    loading.value = false
  }
}

function copyCode() {
  if (!team.value?.inviteCode) return
  navigator.clipboard.writeText(team.value.inviteCode).then(() => {
    ElMessage.success('邀请码已复制')
  }).catch(() => {
    ElMessage.warning('复制失败，请手动复制')
  })
}

async function updateTeamName() {
  if (!team.value?.name?.trim()) {
    ElMessage.warning('队名不能为空')
    return
  }
  try {
    const res = await request.put('/api/team/name', null, {
      params: { teamId: user.teamId, name: team.value.name.trim() }
    })
    ElMessage.success(res.data.message)
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '修改失败')
  }
}

async function refreshInviteCode() {
  try {
    await ElMessageBox.confirm(
      '重新生成后，旧邀请码将立即失效，是否继续？',
      '确认重新生成',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    refreshing.value = true
    const res = await request.post(`/api/team/refresh-invite?teamId=${user.teamId}`)
    // 直接局部更新，避免整页闪烁
    if (team.value) {
      team.value.inviteCode = res.data.inviteCode
      team.value.inviteCodeExpiresAt = res.data.inviteCodeExpiresAt
    }
    ElMessage.success(res.data.message)
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e.response?.data?.message || '生成失败')
    }
  } finally {
    refreshing.value = false
  }
}

onMounted(loadTeam)
</script>

<style scoped>
.invite-code {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  color: #409EFF;
  display: inline-block;
  transition: all 0.4s ease;
}
</style>
