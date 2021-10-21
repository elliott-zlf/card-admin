<template>
  <div class="app-container">
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column class-name="status-col" label="倒计时" width="210" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.createdAt | conversionTime }}</el-tag>
          <!-- <el-tag v-for="(item,index) in scope.row.link_url" :key="index">{{ item }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Title" width="140">
        <template slot-scope="scope">
          {{ scope.row.demandName }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="生成的URL" width="210" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.wechatLink }}</el-tag>
          <!-- <el-tag v-for="(item,index) in scope.row.link_url" :key="index">{{ item }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="标签" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.tags }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="标签" width="200">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="handledelete(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <audio id="audio" autoplay src />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    conversionTime(status) {
      var time1 = Date.now()
      var date = new Date(status)
      var timestamp = ''
      // eslint-disable-next-line no-mixed-spaces-and-tabs
	    var time2 = date.getTime()
      var resttime = 600 - (time1 - time2) / 1000
      if (resttime > 0) {
        timestamp = 600 - (time1 - time2) / 1000
        var minutes = Math.floor(timestamp / 60)
        var seconds = Math.floor(timestamp % 60)
        var str = minutes + '分钟'
        return str
      } else {
        return '00 : 00'
        // console.log('愿赌服输', status)
      }
    }
  },
  data() {
    return {
      timestamp: '',
      timeend: '',
      voiceAudio: {
        humidityMp3: require('../../../src/assets/tongzhi.mp3')
      },
      list: [
        {
          id: 123,
          name: 'ELLIOTT',
          title: '配音需求',
          phone: '13120860268',
          link_url: ['生成的链接', '生成的链接', '生成的链接'],
          CreationTime: '2021-09-12'
        },
        {
          id: 123,
          name: 'host',
          title: '配音需求',
          phone: '13120860268',
          link_url: ['生成的链接', '生成的链接', '生成的链接'],
          CreationTime: '2021-09-12'
        },
        {
          id: 123,
          name: '李易峰',
          title: '配音需求',
          phone: '13120860268',
          link_url: ['生成的链接', '生成的链接', '生成的链接'],
          CreationTime: '2021-09-12'
        },
        {
          id: 123,
          name: '花无缺',
          title: '配音需求',
          phone: '13120860268',
          link_url: ['生成的链接', '生成的链接', '生成的链接'],
          CreationTime: '2021-09-12'
        },
        {
          id: 123,
          name: 'Herder',
          title: '配音需求',
          phone: '13120860268',
          link_url: ['生成的链接', '生成的链接', '生成的链接'],
          CreationTime: '2021-09-12'
        }
      ],
      setintime: '',
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    this.getDataList()
  },
  destroyed() {
    clearInterval(this.setintime)
  },
  methods: {
    getDataList() {
      this.setintime = setInterval(() => {
        this.fetchData()
      }, 10000)
    },
    fetchData() {
      var _that = this
      axios.get('https://www.peiyinstreet.com/wechat_api/wechatDemand/getLink').then(function(res) {
        console.log('存在不存在跨域问题', res)
        const arr = res.data.data
        arr.reverse()
        console.log('比较两个数组的长度', _that.list.length, arr.length)
        if (_that.list.length !== arr.length) {
          _that.play()
        }
        _that.list = arr
      }).catch(function(error) {
        console.log(error)
      })
      // this.listLoading = true
      // getList().then(response => {
      //   // this.list = response.data.items
      //   this.listLoading = false
      // })
    },
    handledelete(id) {
      axios.get('https://www.peiyinstreet.com/wechat_api/wechatDemand/deleteUrl', {
        params: {
          demandId: id
        }
      }).then(function(res) {
        console.log('删除数据', res)
      }).catch(function(error) {
        console.log(error)
      })
    },
    play() {
      this.lastRunTime = Date.now()
      // const _that = this
      const audio = document.querySelector('#audio')
      audio.src = this.voiceAudio.humidityMp3
      audio.play()
      audio.onended = function() {
        audio.pause()
      }
      if (!this.isPlaying) {
        // audio.src = this.voiceAudio.temperatureMp3
        // audio.play()
        // this.isPlaying = true
        // audio.src = this.voiceAudio.humidityMp3
        // audio.play()
        // this.isPlaying = true
      }
      // const timeOut = setTimeout(() => {
      //   this.stop(timeOut)
      // }, 3000)
    },
    stop(timeOut) {
      this.currentTime = Date.now()
      const audio = document.querySelector('#audio')
      if (this.currentTime - this.lastRunTime < 3000) {
        console.log('aa')
      } else {
        if (this.isPlaying) {
          this.currentTime = 0
          audio.pause()
          this.isPlaying = false
        }
      }
      clearTimeout(timeOut)
    }
  }
}
</script>
