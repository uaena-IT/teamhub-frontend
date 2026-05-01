<template>
    <el-container style="height: 100vh">
      <el-aside width="200px" style="background:#001529">
        <div style="color:white;text-align:center;padding:20px;font-size:18px;font-weight:bold">
          TeamHub
        </div>
        <el-menu router background-color="#001529" text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/training">训练中心</el-menu-item>
          <el-menu-item index="/match">比赛中心</el-menu-item>
          <el-menu-item index="/player">球员档案</el-menu-item>
          <el-menu-item index="/development">发展中心</el-menu-item>
          <el-menu-item index="/timeline">时光轴</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="background:#fff;border-bottom:1px solid #eee;line-height:60px">
          TeamHub 院队数字档案系统
        </el-header>
        <el-main style="background:#f5f5f5">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>