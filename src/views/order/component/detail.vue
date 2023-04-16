<template>
  <div class="edit-teacher-container">
    <el-dialog title="订单详情" v-model="isShowDialog" width="769px" @close="resetData" @open="getOrderDetail">

      <el-descriptions title="商品" size="large" border direction="vertical">
        <el-descriptions-item v-for="(item,idx) in goods" :label="item.name" :key="idx">
          <div style="display: flex;justify-content: space-between">
            <span>¥{{ item.price }}</span>
            <span>x{{ item.num }}</span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div style="font-size: 13px;color:#ccc;margin-top: 10px">注意：价格为实际支付时的价格</div>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">关闭</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {FormInstance} from 'element-plus'
import {IDialog, IData} from '../interface';
import {getDetail} from "/@/api/order";

export default defineComponent({
  name: 'detail',
  setup: function () {
    const formRef = ref<FormInstance>()

    const initialState = {
      id: -1, // 主键
      userId: -1, // 用户id
      sum: -1, // 商品总价
      num: -1, // 商品总数
      note: '',// 备注
      time: '',  // 创建时间
      state: ''
    }
    const state = reactive<IDialog>({
      isShowDialog: false,
      data: {...initialState},
      goods: []
    });
    // 打开弹窗
    const openDialog = (data: IData) => {
      state.isShowDialog = true;
      state.data = {...data}
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

    const getOrderDetail = () => {
      getDetail({
        orderId: state.data.id
      }).then(res => {
        state.goods = {...res.data.goods}
      })
    }
    return {
      openDialog,
      closeDialog,
      onCancel,
      resetData,
      ...toRefs(state),
      formRef,
      getOrderDetail
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
