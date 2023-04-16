<template>
  <div class="edit-teacher-container">
    <el-dialog title="创建新种类" v-model="isShowDialog" width="769px" @close="resetData" @open="getAllList">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-row>
          <el-col :span="9" class="mb20">
            <el-form-item label="已有种类" prop="listId">
              <el-select v-model="data.listId" placeholder="请选择" class="w100">
                <el-option v-for="item in list" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" class="mb20">
            <el-form-item label="种类名称" prop="name">
              <el-input v-model="data.name" placeholder="请输入新种类名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(formRef)" size="default">添 加</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type { FormRules, FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import { getList, newCategory} from "/@/api/good";

export default defineComponent({
  name: 'edit',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()

    const initialState = {
      name:'',
      listId:1 //此属性只是查看当前有多少种类
    }
    const state = reactive({
      isShowDialog: false,
      data: {...initialState},
      list: []
    });
    // 打开弹窗
    const openDialog = () => {
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
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
          newCategory({
            name:state.data.name
          }).then((res: any) => {
            if (res.code == 200) {
              ElMessage.success('创建成功')
              emit('tableChange')
              closeDialog();
            } else {
              ElMessage.error('创建失败')
            }
          })
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    }


    //表单验证规则
    const rules = reactive<FormRules>({
      name: [
        {required: true, message: '输入种类名称', trigger: 'blur'},
        {max: 20, message: '最大长度20个字符', trigger: 'blur'}
      ],
    })
    const getAllList = () => {
      getList().then(res => {
        state.list = res.data
      })
    }

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      resetData,
      ...toRefs(state),
      rules,
      formRef,
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
