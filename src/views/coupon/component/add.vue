<template>
  <div class="edit-teacher-container">
    <el-dialog title="批量生成优惠卷" v-model="isShowDialog" width="769px" @close="resetData">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">

        <el-row>
          <el-col class="mb20 ml40" :span="10">
            <el-form-item label="额度" prop="limit">
              <el-input-number v-model="data.limit" :min="1" :max="1000" @change="limitHandle" class="w100"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20 ml40" :span="10">
            <el-form-item label="数量" prop="num">
              <el-input-number v-model="data.num" :min="1" :max="1000" @change="numHandle" class="w100"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(formRef)" size="default">生 成</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {FormRules, FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {addCoupon} from "/@/api/coupon";

export default defineComponent({
  name: 'edit',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()

    const initialState = {
      num: 0,
      limit: 100,
    }
    const state = reactive({
      isShowDialog: false,
      data: {...initialState},
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
          addCoupon({
            ...state.data
          }).then((res: any) => {
            if (res.code == 200) {
              ElMessage.success('生成成功')
              emit('tableChange')
              closeDialog();
            } else {
              ElMessage.error('生成失败')
            }
          })
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    }

    const limitHandle = (value: number) => {
      state.data.limit = value
    }
    const numHandle = (value: number) => {
      state.data.num = value
    }
    //表单验证规则
    const rules = reactive<FormRules>({
      limit: [
        {required: true, message: '请输入优惠卷额度', trigger: 'change'}
      ],
      num: [
        {required: true, message: '请输入生成优惠卷数量', trigger: 'blur'},
      ],
    })

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      resetData,
      ...toRefs(state),
      rules,
      formRef,
      limitHandle,
      numHandle,
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
