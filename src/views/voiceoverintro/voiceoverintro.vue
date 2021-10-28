<template>
  <div class="app-container">
    <el-tabs v-if="type===1" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="0">
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="https://www.peiyinstreet.com/pyadmin/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="个人/企业">
            <el-col :span="12">
              <el-select v-model="form.cate" style="width:100%" placeholder="请选择活动区域" @change="handlecateChange">
                <el-option label="个人" :value="1" />
                <el-option label="企业" :value="2" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="昵称">
            <el-col :span="12">
              <el-input v-model="form.nickname" />
            </el-col>
          </el-form-item>
          <el-form-item v-if="form.cate!==2" label="性别">
            <el-col :span="12">
              <el-select v-model="form.sex" style="width:100%" placeholder="请选择性别">
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="擅长题材">
            <el-col :span="12">
              <el-select v-model="form.subject" style="width:100%" multiple :multiple-limit="3" placeholder="请选择擅长题材">
                <el-option
                  v-for="item in subjectOp"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="擅长风格">
            <el-col :span="12">
              <el-select v-model="form.style" style="width:100%" multiple :multiple-limit="3" placeholder="请选择擅长风格">
                <el-option
                  v-for="item in styleOp"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="微信">
            <el-col :span="12">
              <el-input v-model="form.wechat_number" />
            </el-col>
          </el-form-item>
          <el-form-item label="简介">
            <el-col :span="12">
              <el-input v-model="form.intro" type="textarea" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleEditInformation">提交修改</el-button>
            <el-button @click="handleBackpage">返回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-if="type===2" v-model="activeName2" @tab-click="handleClick">
      <el-tab-pane label="服务管理" name="1">
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
          <el-form-item label="题材类别">
            <el-col :span="12">
              <el-select v-model="worksItem.tag_data[2]" style="width:100%" placeholder="请选择题材">
                <el-option
                  v-for="item in subjectOp"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-for="(item,index) in works" :key="index" :label="'作品'+(index+1)">
            <el-col :span="12">
              <el-input v-model="item.title" :disabled="item.disabled" @blur="handleeditorname(item)" />
            </el-col>
            <el-col :offset="1" :span="6">
              <el-button type="primary" icon="el-icon-edit" @click="handleeditorWorks(item)" />
              <el-button type="primary" icon="el-icon-delete" @click="handleeditorDelete(item)" />
            </el-col>
          </el-form-item>
          <el-form-item label="价格">
            <el-col :span="12">
              <el-input v-model="worksItem.unit_price" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
            <el-button @click="handleBackpage">返回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { tagAll, teacherShow, teacherupdate, serviceshow, workUpdate, serviceworkdel, serviceupdate } from '@/api/info'
export default {

  data() {
    return {
      filterText: '',
      data2: [],
      form: {
        cate: '',
        nickname: '',
        avatar: '',
        subject: [],
        style: [],
        intro: '',
        sex: 1,
        tag_data: {},
        wechat_number: '',
        desc: ''
      },
      worksItem: {
        id: '',
        teacher_id: '',
        tag_data: { '2': null },
        unit_price: ''
      },
      works: [],
      subjectOp: [],
      styleOp: [],
      userId: '',
      type: 1,
      imageUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/LbYGBNz3AAjlqFfjafMA3Bx1tKUpZec2doZ15EFiaQFq24pv9WlOyur9TKLLV31romibRKzzPm76EqMTUDc0B7iaA/132',
      activeName: '0',
      activeName2: '1',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.userId = this.$route.query.id
    this.type = parseInt(this.$route.query.type)
    console.log('类型是多少', this.$route.query, this.userId, this.type)
    this.handletagList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handletagList() {
      tagAll().then((res) => {
        console.log('所有标签', res)
        res.data.map(item => {
          if (item.id === 2) {
            this.subjectOp = item.tags
          } else if (item.id === 5) {
            this.styleOp = item.tags
          }
        })
        if (this.type === 1) {
          this.handleteacherShow()
        } else {
          this.handleserviceshow()
        }
      })
    },
    handleteacherShow() {
      teacherShow({ id: this.userId }).then((res) => {
        console.log('配音师详情数据', res.data)
        var subjectVal = []
        var styleVal = []
        res.data.tags.map((item) => {
          if (item.type_id === 2) {
            subjectVal.push(item.id)
          } else if (item.type_id === 5) {
            styleVal.push(item.id)
          }
        })
        if (res.data.sex === 3) {
          res.data.sex = ''
        }
        this.form = {
          id: res.data.id,
          cate: res.data.cate,
          nickname: res.data.nickname,
          avatar: res.data.avatar,
          subject: subjectVal,
          style: styleVal,
          intro: res.data.intro,
          sex: res.data.sex,
          district: res.data.district,
          tag_data: {},
          wechat_number: res.data.wechat_number
        }
      })
    },
    // 服务详情数据
    handleserviceshow() {
      serviceshow({ id: this.userId }).then(res => {
        console.log('服务作品', res)
        res.data.works.map((item) => {
          item.disabled = true
        })
        this.works = res.data.works
        this.worksItem = {
          id: res.data.id,
          teacher_id: res.data.teacher_id,
          tag_data: { '2': res.data.tags[0].id },
          unit_price: res.data.unit_price
        }
      })
    },
    // 编辑作品
    handleeditorWorks(item) {
      item.disabled = false
    },
    // 失去焦点，触发编辑
    handleeditorname(item) {
      console.log('失去焦点', item)
      item.disabled = true
      var workData = {
        id: item.id,
        title: item.title
      }
      workUpdate(workData).then((res) => {
        this.$message({
          message: '修改作品名称成功',
          type: 'success'
        })
      })
    },
    handleeditorDelete(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        serviceworkdel({ id: item.id }).then((res) => {
          this.$message({
            message: '删除作品成功',
            type: 'success'
          })
          var index = this.works.indexOf(item)
          this.works.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlecateChange(val) {
      console.log('选中值发生变化', val)
    },
    handleEditInformation() {
      this.form.tag_data = { '2': this.form.subject, '5': this.form.style }
      teacherupdate(this.form).then((res) => {
        console.log('res', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    handleBackpage() {
      this.$router.go(-1)
    },
    handleClick() {
      console.log('提交')
    },
    onSubmit() {
      serviceupdate(this.worksItem).then((res) => {
        console.log('更改服务成功', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    handleAvatarSuccess(res, file) {
      console.log('打印文件', file)
      // this.form.avatar = URL.createObjectURL(file.raw)
      this.form.avatar = file.response.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      //   if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!')
      //   }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang="scss">
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    // border-radius: 50px;
    display: block;
  }
</style>
