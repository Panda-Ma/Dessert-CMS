<template>
  <div class="edit-teacher-container">
    <el-dialog title="修改页面" v-model="isShowDialog" width="769px" @close="resetData" @open="getAllList">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-row>
          <el-col :span="9" class="mb20">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="data.name" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" class="mb20">
            <el-form-item label="图片链接" prop="img">
              <el-input v-model="data.img" placeholder="请输入图片链接" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9" class="mb20 ml40">
            <el-form-item label="种类" prop="listId">
              <el-select v-model="data.listId" placeholder="请选择" class="w100">
                <el-option v-for="item in list" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9" class="mb20 ml40">
            <el-form-item label="商品上下架" prop="state">
              <el-select v-model="data.state" placeholder="商品上下架" class="w100">
                <el-option label="上架" value="上架"></el-option>
                <el-option label="下架" value="下架"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20 ml40" :span="9">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="data.price" :min="1" :max="1000" @change="handleChange"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20" :span="20">
            <el-form-item label="商品描述" prop="describe">
              <el-input v-model="data.intro" placeholder="请输入商品描述..." clearable type="textarea" rows="4"
                        resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(formRef)" size="default">新 增</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {UploadProps, FormRules, FormInstance, UploadInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {editTeacher} from "/@/api/teacher";
import {IDialog, IData} from '../interface';
import {getList} from "/@/api/good";

export default defineComponent({
  name: 'edit',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()

    const initialState = {
      id: -1,
      listId: -1,
      name: '',
      img: '',
      intro: '',
      price: -1,
      list: '',
      state: '',
    }
    const state = reactive<IDialog>({
      isShowDialog: false,
      data: {...initialState},
      list: []
    });
    // 打开弹窗
    const openDialog = (data: IData) => {
      state.isShowDialog = true;
      // state.data.id = data.id
      // state.data.name = data.name
      // state.data.userName = data.userName
      // state.data.password = data.password
      // state.data.cover = data.cover
      // state.data.phone = data.phone
      // state.data.level = data.level
      // state.data.email = data.email
      state.data = {...data}
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
      // state.data.id = -1;
      // state.data.name = '';
      // state.data.introduction = '';
      // state.data.userName = '';
      // state.data.password = '';
      // state.data.cover = '';
      // state.data.phone = '';
      // state.data.level = '';
      // state.data.email = ''
      Object.assign(state.data, initialState)//重置属性值
    }
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    // 提交前的表单验证
    const onSubmit = async (formEl: FormInstance | undefined) => {
      if (!formEl) {
        return
      }
      await formEl.validate((valid) => {
        if (valid) {
          // 对表单进行提交
          editTeacher({
            // id: state.data.id
            // , name: state.data.name
            // , username: state.data.userName
            // , number: state.data.phone
            // , level: state.data.level
            // , img: state.data.cover
            // , email: state.data.email
            ...state.data
          }).then((res: any) => {
            if (res.code == 200) {
              ElMessage.success('修改成功')
              emit('tableChange')
              closeDialog();
            } else {
              ElMessage.error('修改失败:' + res.msg)

            }
          })
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    }
    //上传封面验证
    const beforeCoverUpload: UploadProps['beforeUpload'] = (rawFile) => {
      const imgType = ['image/png', 'image/jpeg']
      if (!imgType.includes(rawFile.type)) {
        ElMessage.error('封面必须是JPEG或者PNG格式')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('封面大小不能超过2MB!')
        return false
      }
      return true
    }
    // 封面上传成功
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
    ) => {
      if (response.code == 200) {
        state.data.img = response.data
        ElMessage.success('上传图片成功')
      } else {
        ElMessage.error('上传图片失败:' + response.msg)
      }
    }

    const handleChange = (value: number) => {
      state.data.price = value
    }
    //表单验证规则
    const rules = reactive<FormRules>({
      name: [
        {required: true, message: '输入商品姓名', trigger: 'blur'},
        {max: 20, message: '最大长度20个字符', trigger: 'blur'}
      ],
      img: [
        {required: true, message: '输入图片链接', trigger: 'blur'},
        {max: 20, message: '最大长度500个字符', trigger: 'blur'}
      ],
      state: [
        {required: true, message: '请选择商品状态', trigger: 'blur'},
      ],
      listId: [
        {required: true, message: '请选择种类', trigger: 'change'}
      ],
      price: [
        {required: true, message: '请输入商品价格', trigger: 'blur'},
      ],
    })
    const getAllList = () => {
      getList().then(res=>{
        state.list=res.data
      })

    }

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      beforeCoverUpload,
      handleAvatarSuccess,
      resetData,
      ...toRefs(state),
      rules,
      formRef,
      handleChange,
      getAllList,
    };
  },
  emits: ['tableChange']
});
</script>

<style scoped>

.avatar-uploader {
  height: 150px;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  margin-top: 10px;
  margin-left: 50px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  height: 178px;
  text-align: center;
  width: 300px;
  font-style: normal;
}

.el-upload__tip {
  position: absolute;
  bottom: -30px;
}
</style>
