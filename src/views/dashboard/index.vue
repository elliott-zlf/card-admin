<template>
  <div class="dashboard-container" style="margin:15px">
    <div v-if="pageshow==='列表'" class="content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="未创建名片" name="1" />
        <el-tab-pane label="未入库" name="2" />
        <el-tab-pane label="已入库" name="3" />
        <el-tab-pane label="封禁" name="4" />
      </el-tabs>
      <div class="screening">
        <el-input v-model="voicelist.nickname" class="screening_input" size="small" placeholder="请输入配音师名称" />
        <el-button type="primary" size="small" @click="handleNickName">查询</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :border="true"
        tooltip-effect="dark"
        size="mini"
        show-overflow-tooltip="true"
        align="center"
      >
        <el-table-column fixed label="头像" width="120" align="center">
          <template slot-scope="scope">
            <img
              class="avatarImg"
              :src="scope.row.avatar"
              mode="scaleToFill"
            >
          </template>
        </el-table-column>
        <el-table-column fixed prop="nickname" label="昵称" width="120" align="center" />
        <el-table-column prop="created_at" label="注册时间" width="170" />
        <el-table-column prop="create_edit" label="创建时间" width="170" />
        <el-table-column prop="cate" label="个人/企业" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cate===null" type="info">未注册</el-tag>
            <el-tag v-if="scope.row.cate===1">个人</el-tag>
            <el-tag v-if="scope.row.cate===2" type="success">企业</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex===1" type="info">男</span>
            <span v-if="scope.row.sex===2">女</span>
            <span v-if="scope.row.sex===3" type="success">企业</span>
          </template>
        </el-table-column>
        <el-table-column label="擅长题材" width="300" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.tags" :key="index">
              <el-tag
                v-if="item.type_id===2"
                class="titag"
                type="success"
                size="mini"
                effect="light"
              >
                {{ item.value }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="擅长风格" width="300" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.tags" :key="index" align="center">
              <el-tag
                v-if="item.type_id===5"
                class="titag"
                type="success"
                size="mini"
                effect="light"
              >
                {{ item.value }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="地区" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.district!=''">{{ scope.row.district[0].name || '' }}</span>
            <span v-if="scope.row.district!=''">{{ scope.row.district[1].name || '' }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="intro" label="简介信息" width="120" />
        <el-table-column prop="wechat_number" label="微信" width="120" />
        <el-table-column :show-overflow-tooltip="true" label="查看服务" width="120" align="center">
          <template slot-scope="scope">
            <el-tag @click="handleserviceCenter(scope.row)">
              查看
              （<span>{{ scope.row.service_count }},</span>
              <span>{{ scope.row.work_count }}</span>）
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="查看数据" width="120" align="center">
          <template slot-scope="scope">
            <el-tag @click="handleCardData(scope.row)">查看</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="排序得分" width="120" align="center" />
        <el-table-column :show-overflow-tooltip="true" label="操作" width="300" align="center">
          <template v-if="scope.row.status!==0" slot-scope="scope">
            <el-button v-if="scope.row.status!==3" type="warning" size="mini" @click="handledisable(scope.row)">禁用</el-button>
            <el-button v-if="scope.row.status===3" type="warning" size="mini" @click="handleCancelDisable(scope.row)">取消禁用</el-button>
            <el-button v-if="scope.row.status!==2" type="success" size="mini" @click="handlePutStorage(scope.row)">入库</el-button>
            <el-button v-if="scope.row.status===2" type="success" size="mini" @click="handleoutbound(scope.row)">出库</el-button>
            <span v-if="scope.row.status===2" style="margin-left: 10px;">
              <el-button v-if="scope.row.is_top===0" type="primary" size="mini" @click="handlePlacedTop(scope.row)">置顶</el-button>
              <el-button v-if="scope.row.is_top===1" type="primary" size="mini" @click="handlePlacedcancelTop(scope.row)">取消置顶</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="个人资料" width="230">
          <template slot-scope="scope" align="center">
            <el-button type="primary" size="mini" @click="handlePersonalCenter(scope.row,1)">编辑信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page.sync="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog :visible.sync="dialogTableVisible">
        <div slot="title">
          <div class="titleimgbox">
            <img class="titleimg" :src="titleData.avatar">
            Ta的数据
          </div>
        </div>
        <el-button-group size="mini" style="margin-bottom: 30px;">
          <el-button size="small">看过Ta的<span class="number">{{ gridData[0] }} </span></el-button>
          <el-button size="small">点赞Ta的<span class="number">{{ gridData[1] }}</span></el-button>
          <el-button size="small">关注Ta的<span class="number">{{ gridData[2] }}</span></el-button>
          <el-button size="small">Ta看过的<span class="number">{{ gridData[3] }}</span></el-button>
          <el-button size="small">Ta点赞的<span class="number">{{ gridData[4] }}</span></el-button>
          <el-button size="small">Ta关注Ta的<span class="number">{{ gridData[5] }}</span></el-button>
        </el-button-group>
      </el-dialog>
      <el-dialog :visible.sync="serviceVisible" :before-close="handleClose">
        <div slot="title">
          <div class="titleimgbox">
            <img class="titleimg" :src="titleData.avatar">
            Ta的服务
          </div>
        </div>
        <el-tabs v-model="serviceName" type="card" @tab-click="handleserviceClick">
          <el-tab-pane
            v-for="(item,indexs) in serviceData"
            :key="indexs"
            :label="item.tags[0].value"
            :name="indexs+''"
          />
        </el-tabs>
        <div>
          <div v-for="(item,index) in workList" :key="index" class="serviceitem">
            <div class="playbox">
              <img v-if="!item.isPlaying" class="play" src="@/assets/play.png" @click="play(item)">
              <img v-if="item.isPlaying" class="playActive" src="@/assets/playActive.png" @click="play(item)">
            </div>
            <div class="sever_name">{{ item.title }}</div>
            <div class="download" @click="downloadExcel(item.url)">
              <i class="el-icon-download" />
            </div>
          </div>
        </div>
        <div class="servicebtn" style="margin-top:15px">
          <el-button type="primary" @click="handlePersonalCenter(serviceData[serviceName],2)">编辑服务</el-button>
          <el-button type="danger" @click="handledeletesever(serviceData[serviceName])">删除服务</el-button>
        </div>
      </el-dialog>
    </div>
    <voic v-if="pageshow==='编辑'" :user-id="VitemId" :type="Vtype" @handleSaveSuccess="handleSaveSuccess" />
    <audio id="audio" autoplay src />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { teacherList, teacherBan, teacherWare, teacherTop, profileData, serviceList, serviceWorkList, servicedelete } from '@/api/user'
import { Message } from 'element-ui'
import voic from '@/components/voiceoverintro/voiceoverintro.vue'
export default {
  name: 'Dashboard',
  components: {
    voic
  },
  data() {
    return {
      tableData: [],
      activeName: '0',
      serviceName: 0,
      voicelist: {
        create_begin: '',
        create_end: '',
        id: '',
        nickname: '',
        phone: '',
        status: 0,
        page: 1,
        size: 10
      },
      serviceData: [],
      nickname: '',
      count: 0,
      currentPage4: 0,
      dialogTableVisible: false,
      serviceVisible: false,
      tabIndex: -1,
      workList: [],
      statusInde: 0,
      pageshow: '列表',
      VitemId: null,
      Vtype: null,
      gridData: [0, 0, 0, 0, 0, 0],
      titleData: {}
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.getvoiceList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.index, event)
      this.statusInde = parseInt(tab.index)
      this.voicelist = {
        create_begin: '',
        create_end: '',
        id: '',
        nickname: '',
        phone: '',
        status: this.statusInde,
        page: 1,
        size: 10
      }
      this.currentPage4 = 0
      this.getvoiceList()
    },
    handleserviceClick(tab, event) {
      console.log('默认的第一遍有没有走', tab, event)
      var item = this.serviceData[tab.index]
      this.getServiceWorksList(item)
    },
    handleNickName() {
      this.getvoiceList()
    },
    getvoiceList() {
      teacherList(this.voicelist).then((res) => {
        console.log(res)
        this.tableData = res.data
        this.count = res.count
      })
    },
    handleCurrentChange(val) {
      console.log('当前多少页', val)
      this.voicelist = {
        create_begin: '',
        create_end: '',
        id: '',
        nickname: '',
        phone: '',
        status: this.statusInde,
        page: val,
        size: 10
      }
      this.getvoiceList()
    },
    // 个人中心
    handlePersonalCenter(item, index) {
      console.log('type', item, index)
      this.VitemId = item.id
      this.Vtype = index
      this.pageshow = '编辑'
      // this.$router.push({ path: '/voiceover', query: { id: item.id, type: index }})
    },
    handleSaveSuccess() {
      this.pageshow = '列表'
      this.serviceName = 0
      if (this.Vtype === 1) {
        this.getvoiceList()
      }
    },
    handledeletesever(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        servicedelete({ id: parseInt(item.id) }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          var index = this.serviceData.indexOf(item)
          this.serviceData.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    downloadExcel(url) {
      window.location.href = url
    },
    // 服务列表
    handleserviceCenter(item) {
      this.serviceVisible = true
      this.titleData = item
      serviceList({ teacher_id: item.id, page: 1, size: 50 }).then(res => {
        this.serviceData = res.data
        this.getServiceWorksList(res.data[0])
      })
    },
    // 请求服务作品下的列表
    getServiceWorksList(item) {
      console.log('配音师的服务数据', item)
      if (item) {
        serviceWorkList({ service_id: item.id }).then(res => {
          res.data.map((item) => {
            item.isPlaying = false
          })
          this.workList = res.data
          console.log('作品列表', this.workList)
        })
      } else {
        this.workList = []
      }
    },
    handleSizeChange(val) {},
    // 操作 禁用
    handledisable(item) {
      console.log('封禁成功', item)
      teacherBan({ id: item.id, is_ban: 1 }).then((res) => {
        this.getvoiceList()
        console.log('封禁成功', res)
        Message({
          message: '封禁成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 取消封禁
    handleCancelDisable(item) {
      teacherBan({ id: item.id, is_ban: 0 }).then((res) => {
        this.getvoiceList()
        Message({
          message: '取消封禁成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 入库
    handlePutStorage(item) {
      teacherWare({ id: item.id, is_ware: 1 }).then((res) => {
        console.log('入库成功', res)
        this.getvoiceList()
        Message({
          message: '入库成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 出库
    handleoutbound(item) {
      teacherWare({ id: item.id, is_ware: 0 }).then((res) => {
        this.getvoiceList()
        Message({
          message: '已成功移除配音师库',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 置顶
    handlePlacedTop(item) {
      teacherTop({ id: item.id, is_top: 1 }).then((res) => {
        this.getvoiceList()
        Message({
          message: '置顶成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 取消置顶
    handlePlacedcancelTop(item) {
      teacherTop({ id: item.id, is_top: 0 }).then((res) => {
        this.getvoiceList()
        Message({
          message: '取消置顶成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleCardData(item) {
      this.dialogTableVisible = true
      this.titleData = item
      profileData({ id: item.id }).then((res) => {
        console.log('配音师数据', res)
        this.gridData = res.data
      })
    },
    // 关闭音频弹窗
    handleClose() {
      this.serviceVisible = false
      this.workList.map((items) => {
        items.isPlaying = false
      })
      const audio = document.querySelector('#audio')
      audio.pause()
    },
    // 编辑服务
    handleEditingService(item) {
      console.log('服务数据', item)
    },
    play(item) {
      if (item.isPlaying) {
        // const _that = this
        item.isPlaying = false
        this.workList.map((items) => {
          items.isPlaying = false
        })
        const audio = document.querySelector('#audio')
        audio.src = item.url
        audio.pause()
      } else {
        const _that = this
        const audio = document.querySelector('#audio')
        this.workList.map((items) => {
          if (items.id === item.id) {
            items.isPlaying = true
          } else {
            items.isPlaying = false
          }
        })
        audio.src = item.url
        audio.play()
        audio.onended = function() {
          console.log('走这里了吗')
          audio.pause()
          _that.workList.map((items) => {
            items.isPlaying = false
          })
        }
      }
      // const timeOut = setTimeout(() => {
      //   this.stop(timeOut)
      // }, 3000)
    },
    stop() {
    }
  }
}
</script>
<style>
.el-dialog__body {
  text-align: center;
}
</style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.avatarImg {
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
.block {
  margin-top: 20px;
}
.titag {
  margin-top: 20px;
  min-width: 80px;
}
.screening {
  display: flex;
  padding-bottom: 15px;
  .screening_input {
    width: 300px;
    margin-right: 20px;
  }
}
.titleimgbox {
  display: flex;
  align-items: center;
  justify-content: center;
}
.titleimg {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
}
.number {
  font-size: 20px;
  color: RGBA(70, 160, 252, 1.00);
}
.serviceitem {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid RGBA(185, 186, 188, 1.00);
  .playbox {
    width: 60px;
    height: 60px;
    .playActive {
       width: 60px;
       height: 60px;
    }
    .play {
       width: 60px;
       height: 60px;
    }
  }
  .sever_name {
    text-align: left;
    width: 100%;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .download {
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}
</style>
